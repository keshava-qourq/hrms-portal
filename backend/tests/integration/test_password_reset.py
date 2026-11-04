"""US-006 admin-issued password reset and forced change on first sign-in."""

import pytest

from app.database import SessionLocal
from app.models import User
from tests.integration.test_auth import PASSWORD, _login, client
from tests.integration.test_rbac import _headers, make_roled  # noqa: F401

AUDIT = "/api/admin/audit-logs"


def _reset(admin, target):
    return client.post(f"/api/admin/users/{target.id}/password-reset", headers=_headers(admin))


def _bearer(email, password):
    res = _login(email, password)
    assert res.status_code == 200, res.text
    return res.json(), {"Authorization": f"Bearer {res.json()['session_token']}"}


def test_ac022_reset_returns_one_time_password_and_replaces_hash(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    old_hash = target.password_hash
    res = _reset(admin, target)
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["user_id"] == str(target.id)
    otp = body["one_time_password"]
    with SessionLocal() as db:
        row = db.get(User, target.id)
        assert row.password_hash != old_hash
        assert row.password_hash.startswith("$2")
        assert otp not in row.password_hash
        assert row.must_change_password is True
    assert _login(target.email, PASSWORD).status_code == 401
    assert _login(target.email, otp).status_code == 200


def test_ac022_non_admin_gets_403_and_unknown_user_404(make_roled):  # noqa: F811
    emp = make_roled("EMPLOYEE")
    target = make_roled("EMPLOYEE")
    res = _reset(emp, target)
    assert res.status_code == 403
    assert res.json() == {"detail": "Forbidden"}
    admin = make_roled("SYSTEM_ADMIN")
    bad = client.post(
        "/api/admin/users/00000000-0000-0000-0000-000000000000/password-reset",
        headers=_headers(admin),
    )
    assert bad.status_code == 404


def test_ac023_must_change_blocks_other_routes_until_change(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    otp = _reset(admin, target).json()["one_time_password"]
    login, h = _bearer(target.email, otp)
    assert login["must_change_password"] is True

    blocked = client.get("/api/departments", headers=h)
    assert blocked.status_code == 403
    assert blocked.json() == {"detail": "Password change required"}
    assert client.get("/api/me", headers=h).status_code == 200

    new_pw = "a-brand-new-password-1"
    assert (
        client.post(
            "/api/auth/change-password",
            headers=h,
            json={"current_password": otp, "new_password": "short"},
        ).status_code
        == 422
    )
    assert (
        client.post(
            "/api/auth/change-password",
            headers=h,
            json={"current_password": "wrong-current-pw", "new_password": new_pw},
        ).status_code
        == 400
    )
    ok = client.post(
        "/api/auth/change-password",
        headers=h,
        json={"current_password": otp, "new_password": new_pw},
    )
    assert ok.status_code == 204
    assert client.get("/api/departments", headers=h).status_code == 200
    assert _login(target.email, new_pw).json()["must_change_password"] is False


def test_ac023_new_password_must_differ(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    otp = _reset(admin, target).json()["one_time_password"]
    _, h = _bearer(target.email, otp)
    same = client.post(
        "/api/auth/change-password",
        headers=h,
        json={"current_password": otp, "new_password": otp + "x" * 12},
    )
    assert same.status_code == 204  # differs, so accepted
    again = client.post(
        "/api/auth/change-password",
        headers=h,
        json={"current_password": otp + "x" * 12, "new_password": otp + "x" * 12},
    )
    assert again.status_code == 422


def test_ac023_logout_allowed_while_change_required(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    otp = _reset(admin, target).json()["one_time_password"]
    _, h = _bearer(target.email, otp)
    assert client.post("/api/auth/logout", headers=h).status_code == 204


def test_ac024_reset_and_change_are_audited_without_password(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    otp = _reset(admin, target).json()["one_time_password"]
    _, h = _bearer(target.email, otp)
    new_pw = "another-new-password-2"
    client.post(
        "/api/auth/change-password",
        headers=h,
        json={"current_password": otp, "new_password": new_pw},
    )
    res = client.get(AUDIT, headers=_headers(admin), params={"entity_id": str(target.id)})
    items = res.json()["items"]
    by_action = {i["action"]: i for i in items}
    reset = by_action["user.password_reset"]
    assert reset["actor"] == admin.email
    assert reset["entity_id"] == str(target.id)
    assert reset["created_at"]
    assert "user.password_change" in by_action
    assert otp not in res.text and new_pw not in res.text


def test_ac022_second_reset_invalidates_first_one_time_password(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    first = _reset(admin, target).json()["one_time_password"]
    second = _reset(admin, target).json()["one_time_password"]
    assert first != second
    assert _login(target.email, first).status_code == 401
    assert _login(target.email, second).status_code == 200


def test_ac024_reset_audit_entry_has_actor_account_timestamp_and_no_otp(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    otp = _reset(admin, target).json()["one_time_password"]
    res = client.get(AUDIT, headers=_headers(admin), params={"entity_id": str(target.id)})
    assert res.status_code == 200, res.text
    resets = [i for i in res.json()["items"] if i["action"] == "user.password_reset"]
    assert len(resets) == 1
    e = resets[0]
    assert e["actor"] == admin.email and e["entity_id"] == str(target.id) and e["created_at"]
    assert otp not in res.text
    with SessionLocal() as db:
        row = db.get(User, target.id)
        assert row.password_hash not in res.text


def test_ac024_non_admin_cannot_read_audit_of_reset(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    other = make_roled("EMPLOYEE")
    _reset(admin, target)
    assert client.get(AUDIT, headers=_headers(other)).status_code == 403


def test_ac021_no_self_service_reset_route_exists():
    for path in ("/api/auth/password-reset", "/api/auth/forgot-password", "/api/auth/reset"):
        assert client.post(path, json={"email": "a@example.com"}).status_code in (404, 405)


@pytest.mark.parametrize("path", ["/api/me"])
def test_ac023_normal_user_unaffected(make_roled, path):  # noqa: F811
    user = make_roled("EMPLOYEE")
    assert client.get(path, headers=_headers(user)).status_code == 200

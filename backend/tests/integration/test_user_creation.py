"""US-002 admin user creation via real handlers on live Postgres and Redis.

Covers create returning an active two-role account (AC-005), duplicate-email
rejection (AC-007), that a non-SYSTEM_ADMIN manager role is refused without data
(AC-008) and that create/edit/deactivate each leave one audit entry carrying
actor, action, account id and timestamp (AC-009). Authored from the contract;
tests whose prerequisite endpoint is absent skip as PENDING rather than fail.
"""

import uuid

import pytest
from sqlalchemy import text

from app.database import SessionLocal
from tests.integration.test_auth import client
from tests.integration.test_rbac import _headers, make_roled  # noqa: F401

USERS = "/api/admin/users"
AUDIT = "/api/admin/audit-logs"


def _new_email() -> str:
    return f"created-{uuid.uuid4().hex[:10]}@example.com"


def _cleanup(email: str) -> None:
    with SessionLocal() as db:
        db.execute(text("DELETE FROM users WHERE lower(email) = :e"), {"e": email.lower()})
        db.commit()


def _create(admin, email, roles):
    res = client.post(USERS, headers=_headers(admin), json={"email": email, "role_codes": roles})
    if res.status_code == 404:
        pytest.skip("PENDING: POST /api/admin/users not implemented yet")
    return res


def _audit_for(admin, entity_id):
    res = client.get(AUDIT, headers=_headers(admin), params={"entity_id": str(entity_id)})
    if res.status_code == 404:
        pytest.skip("PENDING: GET /api/admin/audit-logs not implemented yet")
    assert res.status_code == 200, res.text
    return res.json()["items"]


def test_ac005_create_returns_active_account_with_both_roles(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    email = _new_email()
    try:
        res = _create(admin, email, ["EMPLOYEE", "REPORTING_MANAGER"])
        assert res.status_code in (200, 201), res.text
        body = res.json()
        assert body["email"] == email.lower()
        assert body["is_active"] is True
        assert set(body["roles"]) == {"EMPLOYEE", "REPORTING_MANAGER"}
        assert "team.approve" in body["permissions"]
        with SessionLocal() as db:
            row = (
                db.execute(
                    text("SELECT * FROM users WHERE lower(email) = :e"), {"e": email.lower()}
                )
                .mappings()
                .one()
            )
        assert row["is_active"] is True
        # The admin never receives a usable password back.
        assert "password" not in body
    finally:
        _cleanup(email)


def test_ac007_duplicate_email_rejected_with_message(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    email = _new_email()
    try:
        first = _create(admin, email, ["EMPLOYEE"])
        assert first.status_code in (200, 201), first.text
        # Same address, different case: still a duplicate.
        dup = _create(admin, email.upper(), ["EMPLOYEE"])
        assert dup.status_code in (400, 409, 422), dup.text
        assert "email" in dup.text.lower()
        # No second account was created.
        with SessionLocal() as db:
            n = db.execute(
                text("SELECT count(*) FROM users WHERE lower(email) = :e"), {"e": email.lower()}
            ).scalar()
        assert n == 1
    finally:
        _cleanup(email)


@pytest.mark.parametrize("role", ["EMPLOYEE", "REPORTING_MANAGER", "HR_ADMIN", "PROJECT_MANAGER"])
def test_ac008_non_system_admin_gets_403_with_no_data(make_roled, role):  # noqa: F811
    actor = make_roled(role)
    email = _new_email()
    try:
        res = client.post(
            USERS, headers=_headers(actor), json={"email": email, "role_codes": ["EMPLOYEE"]}
        )
        if res.status_code == 404:
            pytest.skip("PENDING: POST /api/admin/users not implemented yet")
        assert res.status_code == 403
        assert res.json() == {"detail": "Forbidden"}
        assert email not in res.text
        with SessionLocal() as db:
            n = db.execute(
                text("SELECT count(*) FROM users WHERE lower(email) = :e"), {"e": email.lower()}
            ).scalar()
        assert n == 0
    finally:
        _cleanup(email)


def test_ac008_unauthenticated_create_is_401(make_roled):  # noqa: F811
    email = _new_email()
    res = client.post(USERS, json={"email": email, "role_codes": ["EMPLOYEE"]})
    if res.status_code == 404:
        pytest.skip("PENDING: POST /api/admin/users not implemented yet")
    assert res.status_code == 401
    assert email not in res.text


def test_ac009_create_edit_deactivate_each_produce_audit_entry(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    email = _new_email()
    try:
        created = _create(admin, email, ["EMPLOYEE"])
        assert created.status_code in (200, 201), created.text
        user_id = created.json()["user_id"]

        after_create = _audit_for(admin, user_id)
        assert len(after_create) == 1, "create produced no single audit entry"
        c = after_create[0]
        assert c["actor"] == admin.email
        assert "create" in c["action"].lower()
        assert str(c["entity_id"]) == str(user_id)
        assert c["created_at"]

        # Edit: change the roles (a non-deactivation change).
        edit = client.patch(
            f"{USERS}/{user_id}",
            headers=_headers(admin),
            json={"role_codes": ["EMPLOYEE", "PROJECT_MANAGER"]},
        )
        assert edit.status_code == 200, edit.text
        after_edit = _audit_for(admin, user_id)
        assert len(after_edit) == 2, "edit produced no additional audit entry"
        e = after_edit[0]
        assert e["actor"] == admin.email and str(e["entity_id"]) == str(user_id)
        assert e["created_at"]

        # Deactivate.
        deact = client.patch(
            f"{USERS}/{user_id}", headers=_headers(admin), json={"is_active": False}
        )
        assert deact.status_code == 200, deact.text
        assert deact.json()["is_active"] is False
        after_deact = _audit_for(admin, user_id)
        assert len(after_deact) == 3, "deactivate produced no additional audit entry"
        d = after_deact[0]
        assert d["actor"] == admin.email and str(d["entity_id"]) == str(user_id)
        assert d["after_values"].get("is_active") is False
        assert d["before_values"].get("is_active") is True
        assert d["created_at"]
    finally:
        _cleanup(email)


def test_ac009_audit_entry_never_contains_password(make_roled):  # noqa: F811
    admin = make_roled("SYSTEM_ADMIN")
    email = _new_email()
    try:
        created = _create(admin, email, ["EMPLOYEE"])
        assert created.status_code in (200, 201), created.text
        user_id = created.json()["user_id"]
        res = client.get(AUDIT, headers=_headers(admin), params={"entity_id": str(user_id)})
        if res.status_code == 404:
            pytest.skip("PENDING: GET /api/admin/audit-logs not implemented yet")
        assert "password" not in res.text.lower()
    finally:
        _cleanup(email)

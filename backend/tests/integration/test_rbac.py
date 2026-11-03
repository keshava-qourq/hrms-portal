"""US-003 role union and server-side enforcement against real Postgres and Redis."""

import uuid

import pytest
from sqlalchemy import select, text

from app.authz import ROLE_NAMES, ROLE_PERMISSIONS, permissions_for
from app.database import SessionLocal
from app.models import Role, User, UserRole
from app.security import hash_password
from tests.integration.test_auth import PASSWORD, _login, client

ALL_ROLES = list(ROLE_NAMES)


@pytest.fixture
def make_roled():
    created: list[uuid.UUID] = []

    def _make(*codes: str) -> User:
        with SessionLocal() as db:
            user = User(
                email=f"{uuid.uuid4().hex[:10]}@example.com",
                password_hash=hash_password(PASSWORD),
                is_active=True,
            )
            db.add(user)
            db.flush()
            for code in codes:
                r = db.scalars(select(Role).where(Role.code == code)).first()
                if r is None:
                    r = Role(code=code, name=ROLE_NAMES[code])
                    db.add(r)
                    db.flush()
                db.add(UserRole(user_id=user.id, role_id=r.id))
            db.commit()
            created.append(user.id)
            return user

    yield _make
    with SessionLocal() as db:
        for uid in created:
            db.execute(text("DELETE FROM users WHERE id = :i"), {"i": uid})
        db.commit()


def _headers(user: User) -> dict[str, str]:
    token = _login(user.email, PASSWORD).json()["session_token"]
    return {"Authorization": f"Bearer {token}"}


def test_ac010_me_returns_union_for_multi_role_user(make_roled):
    user = make_roled("EMPLOYEE", "REPORTING_MANAGER", "PROJECT_MANAGER")
    res = client.get("/api/me", headers=_headers(user))
    assert res.status_code == 200
    body = res.json()
    assert set(body["roles"]) == {"EMPLOYEE", "REPORTING_MANAGER", "PROJECT_MANAGER"}
    expected = (
        ROLE_PERMISSIONS["EMPLOYEE"]
        | ROLE_PERMISSIONS["REPORTING_MANAGER"]
        | ROLE_PERMISSIONS["PROJECT_MANAGER"]
    )
    assert set(body["permissions"]) == set(expected)
    assert "projects.manage" in body["permissions"] and "team.approve" in body["permissions"]
    assert "users.manage" not in body["permissions"]
    assert len(body["permissions"]) == len(set(body["permissions"]))


def test_ac010_me_for_employee_only_has_no_elevated_permissions(make_roled):
    user = make_roled("EMPLOYEE")
    body = client.get("/api/me", headers=_headers(user)).json()
    assert set(body["permissions"]) == set(ROLE_PERMISSIONS["EMPLOYEE"])


def test_ac011_nfr004_employee_only_gets_403_without_data_on_admin_endpoint(make_roled):
    employee = make_roled("EMPLOYEE")
    target = make_roled("EMPLOYEE")
    headers = _headers(employee)
    res = client.patch(
        f"/api/admin/users/{target.id}", headers=headers, json={"is_active": False}
    )
    assert res.status_code == 403
    assert res.json() == {"detail": "Forbidden"}
    assert target.email not in res.text and str(target.id) not in res.text
    with SessionLocal() as db:
        assert db.get(User, target.id).is_active is True


def test_ac011_nfr004_403_identical_for_existing_and_unknown_record_ids(make_roled):
    employee = make_roled("EMPLOYEE")
    target = make_roled("EMPLOYEE")
    headers = _headers(employee)
    known = client.patch(f"/api/admin/users/{target.id}", headers=headers, json={})
    unknown = client.patch(f"/api/admin/users/{uuid.uuid4()}", headers=headers, json={})
    garbage = client.patch("/api/admin/users/not-a-uuid", headers=headers, json={})
    assert known.status_code == unknown.status_code == garbage.status_code == 403
    assert known.text == unknown.text == garbage.text


@pytest.mark.parametrize("role", ["EMPLOYEE", "REPORTING_MANAGER", "HR_ADMIN", "PROJECT_MANAGER"])
def test_ac011_non_admin_roles_cannot_manage_users(make_roled, role):
    user = make_roled(role)
    target = make_roled("EMPLOYEE")
    res = client.patch(
        f"/api/admin/users/{target.id}",
        headers=_headers(user),
        json={"role_codes": ["SYSTEM_ADMIN"]},
    )
    assert res.status_code == 403
    with SessionLocal() as db:
        assert db.get(User, target.id).role_codes == ["EMPLOYEE"]


def test_nfr004_unauthenticated_admin_request_is_401_without_data(make_roled):
    target = make_roled("EMPLOYEE")
    res = client.patch(f"/api/admin/users/{target.id}", json={"is_active": False})
    assert res.status_code == 401
    assert target.email not in res.text


def test_ac012_removing_role_revokes_access_on_next_request(make_roled):
    admin = make_roled("EMPLOYEE", "SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    admin_h = _headers(admin)
    path = f"/api/admin/users/{target.id}"
    assert client.patch(path, headers=admin_h, json={"unlock": True}).status_code == 200

    # Another admin removes the role while the session is still open.
    other = make_roled("SYSTEM_ADMIN")
    res = client.patch(
        f"/api/admin/users/{admin.id}", headers=_headers(other), json={"role_codes": ["EMPLOYEE"]}
    )
    assert res.status_code == 200
    assert res.json()["roles"] == ["EMPLOYEE"]

    assert client.patch(path, headers=admin_h, json={"unlock": True}).status_code == 403
    me = client.get("/api/me", headers=admin_h).json()
    assert me["roles"] == ["EMPLOYEE"]
    assert "users.manage" not in me["permissions"]


def test_ac012_adding_role_grants_access_on_next_request(make_roled):
    admin = make_roled("SYSTEM_ADMIN")
    user = make_roled("EMPLOYEE")
    h = _headers(user)
    assert "projects.manage" not in client.get("/api/me", headers=h).json()["permissions"]
    res = client.patch(
        f"/api/admin/users/{user.id}",
        headers=_headers(admin),
        json={"role_codes": ["EMPLOYEE", "PROJECT_MANAGER"]},
    )
    assert res.status_code == 200
    assert "projects.manage" in client.get("/api/me", headers=h).json()["permissions"]


def test_nfr021_only_five_fixed_roles_and_admin_cannot_create_others(make_roled):
    assert set(ROLE_PERMISSIONS) == set(ROLE_NAMES) == {
        "EMPLOYEE", "REPORTING_MANAGER", "HR_ADMIN", "PROJECT_MANAGER", "SYSTEM_ADMIN",
    }
    admin = make_roled("SYSTEM_ADMIN")
    target = make_roled("EMPLOYEE")
    h = _headers(admin)
    path = f"/api/admin/users/{target.id}"
    assert client.patch(path, headers=h, json={"role_codes": ["SUPERUSER"]}).status_code == 422
    assert client.patch(path, headers=h, json={"role_codes": []}).status_code == 422
    with SessionLocal() as db:
        assert db.scalars(select(Role).where(Role.code == "SUPERUSER")).first() is None
    assert permissions_for(["SUPERUSER"]) == []
    # Combining roles is allowed and yields the union.
    res = client.patch(path, headers=h, json={"role_codes": ALL_ROLES})
    assert res.status_code == 200
    assert set(res.json()["permissions"]) == set().union(*ROLE_PERMISSIONS.values())

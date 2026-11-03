"""Integration tests for sign-in, sign-out and /api/me against real Postgres and Redis."""

import logging
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select, text

from app.database import SessionLocal
from app.main import app
from app.models import Role, User, UserRole
from app.security import get_redis, hash_password

client = TestClient(app)
PASSWORD = "Correct-Horse-9"


@pytest.fixture
def make_user():
    created: list[uuid.UUID] = []

    def _make(active: bool = True, role: str | None = "EMPLOYEE") -> User:
        with SessionLocal() as db:
            user = User(
                email=f"{uuid.uuid4().hex[:10]}@example.com",
                password_hash=hash_password(PASSWORD),
                is_active=active,
            )
            db.add(user)
            db.flush()
            if role:
                r = db.scalars(select(Role).where(Role.code == role)).first()
                if r is None:
                    r = Role(code=role, name=role.title())
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


def _login(email: str, password: str):
    return client.post("/api/auth/login", json={"email": email, "password": password})


def test_ac001_login_returns_session_usable_by_me(make_user):
    user = make_user()
    res = _login(user.email, PASSWORD)
    assert res.status_code == 200
    body = res.json()
    assert body["roles"] == ["EMPLOYEE"]
    assert "set-cookie" not in res.headers
    assert get_redis().exists("session:" + body["session_token"]) == 1

    me = client.get("/api/me", headers={"Authorization": f"Bearer {body['session_token']}"})
    assert me.status_code == 200
    assert me.json()["email"] == user.email


def test_ac001_me_without_valid_session_is_401():
    assert client.get("/api/me").status_code == 401
    bad = client.get("/api/me", headers={"Authorization": "Bearer nope"})
    assert bad.status_code == 401


def test_ac002_wrong_password_and_unknown_email_give_same_message(make_user):
    user = make_user()
    wrong = _login(user.email, "bad-password")
    unknown = _login("nobody-here@example.com", "bad-password")
    assert wrong.status_code == unknown.status_code == 401
    assert wrong.json() == unknown.json() == {"detail": "email or password is incorrect"}


def test_ac003_deactivated_account_refused_with_admin_message(make_user):
    user = make_user(active=False)
    res = _login(user.email, PASSWORD)
    assert res.status_code == 403
    assert "contact an administrator" in res.json()["detail"]


def test_ac003_deactivated_account_with_wrong_password_stays_generic(make_user):
    user = make_user(active=False)
    res = _login(user.email, "bad-password")
    assert res.status_code == 401
    assert res.json()["detail"] == "email or password is incorrect"


def test_ac004_only_bcrypt_hash_stored_and_password_not_logged(make_user, caplog):
    user = make_user()
    with caplog.at_level(logging.DEBUG):
        _login(user.email, PASSWORD)
        _login(user.email, "another-wrong-pw")
    assert PASSWORD not in caplog.text
    assert "another-wrong-pw" not in caplog.text

    with SessionLocal() as db:
        row = db.execute(text("SELECT * FROM users WHERE id = :i"), {"i": user.id}).mappings().one()
    assert row["password_hash"].startswith("$2")
    assert all(PASSWORD not in str(v) for v in row.values())
    assert hash_password(PASSWORD) != hash_password(PASSWORD)  # salted


def test_logout_invalidates_session(make_user):
    user = make_user()
    token = _login(user.email, PASSWORD).json()["session_token"]
    headers = {"Authorization": f"Bearer {token}"}
    assert client.get("/api/me", headers=headers).status_code == 200
    assert client.post("/api/auth/logout", headers=headers).status_code == 204
    assert client.get("/api/me", headers=headers).status_code == 401

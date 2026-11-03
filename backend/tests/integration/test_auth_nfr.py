"""NFR checks for sign-in that can be verified against real Postgres and Redis."""

import json

from tests.integration.test_auth import PASSWORD, _login, client, make_user  # noqa: F401
from app.security import get_redis


def test_nfr001_responses_and_session_never_contain_password_or_hash(make_user):  # noqa: F811
    user = make_user()
    res = _login(user.email, PASSWORD)
    assert PASSWORD not in res.text
    assert user.password_hash not in res.text
    token = res.json()["session_token"]
    stored = get_redis().get("session:" + token)
    assert PASSWORD not in stored and user.password_hash not in stored
    assert set(json.loads(stored)) == {"user_id", "email"}
    me = client.get("/api/me", headers={"Authorization": f"Bearer {token}"})
    assert PASSWORD not in me.text and "password_hash" not in me.text


def test_nfr002_unknown_and_wrong_password_responses_identical(make_user):  # noqa: F811
    user = make_user()
    a = _login(user.email, "wrong-pw-1")
    b = _login("ghost-account@example.com", "wrong-pw-1")
    assert a.status_code == b.status_code == 401
    assert a.text == b.text
    assert set(a.headers) - {"content-length"} == set(b.headers) - {"content-length"}


def test_nfr002_email_is_case_insensitive_and_deactivated_hidden_without_password(make_user):  # noqa: F811
    user = make_user(active=False)
    res = _login(user.email.upper(), "wrong-pw")
    assert res.status_code == 401
    assert res.json()["detail"] == "email or password is incorrect"

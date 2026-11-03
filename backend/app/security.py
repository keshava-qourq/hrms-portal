"""Password hashing and the Redis-backed session store.

Passwords are only ever salted one-way bcrypt digests (NFR-001): nothing here
logs, returns or stores a plain password. Sessions live in Redis with a TTL, so
logout -- or a flushed Redis -- makes a token unusable immediately.
"""

import json
import secrets
from typing import Any

import redis
from passlib.context import CryptContext

from app.config import settings

# Sessions expire after 8 hours: one working day, re-login after that.
SESSION_TTL_SECONDS = 8 * 60 * 60
SESSION_KEY_PREFIX = "session:"

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """A salted one-way bcrypt digest of `plain_password`."""
    return _pwd_context.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """True when the password matches the stored digest; never raises."""
    try:
        return _pwd_context.verify(plain_password, password_hash)
    except ValueError:
        # A malformed or empty stored hash must fail closed, not 500.
        return False


_client: redis.Redis | None = None


def get_redis() -> redis.Redis:
    """The process-wide Redis client, created on first use."""
    global _client
    if _client is None:
        _client = redis.from_url(settings.redis_url, decode_responses=True)
    return _client


def create_session(user_id: str, *, email: str) -> str:
    """Store a new session and return its opaque token."""
    token = secrets.token_urlsafe(32)
    get_redis().set(
        SESSION_KEY_PREFIX + token,
        json.dumps({"user_id": user_id, "email": email}),
        ex=SESSION_TTL_SECONDS,
    )
    return token


def read_session(token: str) -> dict[str, Any] | None:
    """The session behind a token, or None when it is unknown or expired."""
    if not token:
        return None
    raw = get_redis().get(SESSION_KEY_PREFIX + token)
    if not raw:
        return None
    try:
        return json.loads(raw)
    except ValueError:
        return None


def delete_session(token: str) -> None:
    """Invalidate a token. Deleting an unknown token is a no-op."""
    if token:
        get_redis().delete(SESSION_KEY_PREFIX + token)

"""Application configuration read from the environment.

The app runs as one container on a server in the client's own AWS account, and
the platform always injects these variables. Each is read here once, with a
working local default so a fresh clone (and the test suite) runs with nothing
configured. This is the single place to read them: a ticket that needs the API
bearer, the token-signing key or the media directory reads it from `settings`
rather than reaching for `os.getenv` again.

Discovered by `backend/scripts/check_connections.py` via the `settings` object
and `get_settings()` below, so the connection check reads `DATABASE_URL` and
`REDIS_URL` exactly as the app does.
"""

import os
from dataclasses import dataclass, field
from functools import lru_cache

# Dev CORS origins: the Vite dev server and its loopback alias. Used only when
# ALLOWED_ORIGINS is not set, which is exactly the local-development case.
_DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]


def _split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    """Resolved configuration for one process."""

    # The system of record. A SQLAlchemy URL (postgresql+psycopg://...) in every
    # real environment; SQLite only so a bare clone starts without a server.
    database_url: str = field(
        default_factory=lambda: os.getenv("DATABASE_URL", "sqlite:///./app.db")
    )
    # Sessions, caches, failed-attempt counters and the RQ job queue all share
    # this one Redis.
    redis_url: str = field(
        default_factory=lambda: os.getenv("REDIS_URL", "redis://localhost:6379/0")
    )
    # The frontend origin(s) allowed to call the API cross-origin, comma
    # separated. Empty locally, where the dev origins below apply instead.
    allowed_origins: list[str] = field(
        default_factory=lambda: _split_csv(os.getenv("ALLOWED_ORIGINS", ""))
    )
    # The shared API bearer the generated frontend sends. Public, not a secret:
    # never sign anything with it.
    secret_key: str = field(default_factory=lambda: os.getenv("SECRET_KEY", "dev-secret-key"))
    # Private key that signs session tokens. Never sent to the client.
    jwt_secret_key: str = field(
        default_factory=lambda: os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key")
    )
    # A writable directory that survives redeploys. Local default is under the
    # backend working directory.
    media_root: str = field(default_factory=lambda: os.getenv("MEDIA_ROOT", "./media"))
    # Create the demo sign-ins (app/demo_seed.py) on startup. Off unless set; the
    # deployed image turns it on in the Dockerfile.
    seed_demo_accounts: bool = field(
        default_factory=lambda: os.getenv("SEED_DEMO_ACCOUNTS", "").lower() == "true"
    )

    def cors_origins(self) -> list[str]:
        """Origins for CORS: the configured list, or the dev origins locally."""
        return self.allowed_origins or list(_DEV_ORIGINS)

    # Upper-case aliases so tooling that reads settings by the environment
    # variable name (e.g. the connection check) finds the same values.
    @property
    def DATABASE_URL(self) -> str:  # noqa: N802 -- matches the env var name
        return self.database_url

    @property
    def REDIS_URL(self) -> str:  # noqa: N802 -- matches the env var name
        return self.redis_url


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """The process-wide settings, read from the environment once."""
    return Settings()


settings = get_settings()

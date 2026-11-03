"""Pydantic request and response models."""

from pydantic import BaseModel, Field


class StubResponse(BaseModel):
    """What a generated route returns until someone implements it.

    A stub that returns a typed body rather than raising keeps the service
    startable and its OpenAPI document complete, so the frontend can be built
    against the agreed shape while the handlers are still being written.
    """

    endpoint: str
    status: str = "not_implemented"
    detail: str = "Scaffolded from the approved API spec; no behaviour yet."


class LoginRequest(BaseModel):
    """Credentials posted to /api/auth/login."""

    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1, max_length=256)


class LoginResponse(BaseModel):
    """What a successful sign-in returns.

    The session token is in the body, not a cookie: the SPA and the API are on
    different origins, where a browser would drop the cookie.
    """

    session_token: str
    user_id: str
    display_name: str
    roles: list[str]
    must_change_password: bool


class MeResponse(BaseModel):
    """The authenticated user behind the current session."""

    user_id: str
    email: str = Field(min_length=3, max_length=255)
    display_name: str
    roles: list[str]
    permissions: list[str] = []
    must_change_password: bool
    is_active: bool

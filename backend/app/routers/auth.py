"""Sign-in, sign-out and the current-user endpoint.

A failed sign-in always answers with one generic message (NFR-002) so the
portal cannot be used to discover which work emails have an account; only a
deactivated account is told something different, and only after its password
has been verified.
"""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import LoginRequest, LoginResponse, MeResponse
from app.security import (
    create_session,
    delete_session,
    hash_password,
    read_session,
    verify_password,
)

router = APIRouter(prefix="/api", tags=["auth"])

GENERIC_LOGIN_ERROR = "email or password is incorrect"
DEACTIVATED_ERROR = "This account is deactivated. Please contact an administrator."

# Verifying a throwaway hash when no user matches keeps the response time of an
# unknown email close to that of a known one, so timing does not leak either.
_DUMMY_HASH = hash_password("not-a-real-password")


def _bearer_token(request: Request) -> str:
    header = request.headers.get("Authorization", "")
    scheme, _, token = header.partition(" ")
    return token.strip() if scheme.lower() == "bearer" else ""


DbSession = Annotated[Session, Depends(get_db)]


def current_user(request: Request, db: DbSession) -> User:
    """The user behind the request's session token, or 401. Fails closed."""
    session = read_session(_bearer_token(request))
    user = None
    if session:
        try:
            user = db.get(User, uuid.UUID(str(session.get("user_id"))))
        except ValueError:
            user = None
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@router.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: DbSession) -> LoginResponse:
    """Authenticate and open a Redis-backed session."""
    email = payload.email.strip().lower()
    user = db.scalars(select(User).where(func.lower(User.email) == email)).first()

    if user is None or not verify_password(payload.password, user.password_hash):
        if user is not None:
            user.failed_login_count += 1
            db.commit()
        else:
            verify_password(payload.password, _DUMMY_HASH)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=GENERIC_LOGIN_ERROR)

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=DEACTIVATED_ERROR)

    user.failed_login_count = 0
    user.last_login_at = func.now()
    db.commit()
    db.refresh(user)

    token = create_session(str(user.id), email=user.email)
    return LoginResponse(
        session_token=token,
        user_id=str(user.id),
        display_name=user.display_name,
        roles=user.role_codes,
        must_change_password=user.must_change_password,
    )


@router.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request) -> Response:
    """Invalidate the session behind the bearer token. Always 204."""
    delete_session(_bearer_token(request))
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=MeResponse)
def me(user: Annotated[User, Depends(current_user)]) -> MeResponse:
    """The authenticated user."""
    return MeResponse(
        user_id=str(user.id),
        email=user.email,
        display_name=user.display_name,
        roles=user.role_codes,
        must_change_password=user.must_change_password,
        is_active=user.is_active,
    )

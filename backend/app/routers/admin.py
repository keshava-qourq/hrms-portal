"""System Admin user management: create, activate, deactivate, change roles, unlock."""

import secrets
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.audit import changed_fields, write_audit
from app.authz import ROLE_NAMES, permissions_for, require_permission
from app.database import get_db
from app.models import Role, User, UserRole
from app.security import hash_password

router = APIRouter(prefix="/api/admin", tags=["admin"])


class UserCreate(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    employee_id: uuid.UUID | None = None
    role_codes: list[str] = Field(min_length=1)


class UserPatch(BaseModel):
    is_active: bool | None = None
    role_codes: list[str] | None = None
    unlock: bool | None = None


class AdminUser(BaseModel):
    user_id: str
    email: str
    is_active: bool
    roles: list[str]
    permissions: list[str]


def _resolve_roles(db: Session, role_codes: list[str]) -> list[Role]:
    """The Role rows for a non-empty subset of the five fixed codes, creating any missing."""
    wanted = set(role_codes)
    unknown = wanted - set(ROLE_NAMES)
    if unknown or not wanted:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="role_codes must be a non-empty subset of the five fixed roles",
        )
    existing = {r.code: r for r in db.scalars(select(Role))}
    for code in wanted:
        if code not in existing:
            role = Role(code=code, name=ROLE_NAMES[code])
            db.add(role)
            db.flush()
            existing[code] = role
    return [existing[code] for code in wanted]


@router.post("/users", response_model=AdminUser, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    _admin: Annotated[User, Depends(require_permission("users.manage"))],
    db: Annotated[Session, Depends(get_db)],
) -> AdminUser:
    email = payload.email.strip().lower()
    roles = _resolve_roles(db, payload.role_codes)

    existing = db.scalars(select(User).where(func.lower(User.email) == email)).first()
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="email already in use")

    # An unguessable initial password the admin never sees: the account must set
    # its own on first sign-in. The plain value is discarded, only its hash stored.
    user = User(
        email=email,
        employee_id=payload.employee_id,
        password_hash=hash_password(secrets.token_urlsafe(32)),
        must_change_password=True,
        is_active=True,
    )
    db.add(user)
    db.flush()
    for role in roles:
        user.roles.append(UserRole(user_id=user.id, role_id=role.id))
    db.flush()
    db.refresh(user)
    write_audit(
        db,
        actor=_admin,
        action="user.create",
        entity_type="user",
        entity_id=user.id,
        after={
            "email": user.email,
            "is_active": user.is_active,
            "role_codes": user.role_codes,
        },
    )
    db.commit()
    db.refresh(user)
    return AdminUser(
        user_id=str(user.id),
        email=user.email,
        is_active=user.is_active,
        roles=user.role_codes,
        permissions=permissions_for(user.role_codes),
    )


class PasswordResetOut(BaseModel):
    user_id: str
    one_time_password: str


@router.post("/users/{user_id}/password-reset", response_model=PasswordResetOut)
def reset_password(
    user_id: str,
    admin: Annotated[User, Depends(require_permission("users.manage"))],
    db: Annotated[Session, Depends(get_db)],
) -> PasswordResetOut:
    try:
        uid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        ) from None
    user = db.get(User, uid)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    one_time = secrets.token_urlsafe(12)
    user.password_hash = hash_password(one_time)
    user.must_change_password = True
    user.failed_login_count = 0
    user.locked_at = None
    write_audit(
        db,
        actor=admin,
        action="user.password_reset",
        entity_type="user",
        entity_id=user.id,
    )
    db.commit()
    return PasswordResetOut(user_id=str(user.id), one_time_password=one_time)


@router.patch("/users/{user_id}", response_model=AdminUser)
def patch_user(
    user_id: str,
    payload: UserPatch,
    _admin: Annotated[User, Depends(require_permission("users.manage"))],
    db: Annotated[Session, Depends(get_db)],
) -> AdminUser:
    try:
        uid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        ) from None
    user = db.get(User, uid)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    before = {
        "is_active": user.is_active,
        "role_codes": user.role_codes,
        "failed_login_count": user.failed_login_count,
        "locked_at": user.locked_at.isoformat() if user.locked_at else None,
    }
    if payload.role_codes is not None:
        existing = {r.code: r for r in _resolve_roles(db, payload.role_codes)}
        wanted = set(existing)
        held = {link.role.code: link for link in user.roles}
        for code, link in held.items():
            if code not in wanted:
                user.roles.remove(link)
        for code in wanted - set(held):
            user.roles.append(UserRole(user_id=user.id, role_id=existing[code].id))
    if payload.is_active is not None:
        user.is_active = payload.is_active
    if payload.unlock:
        user.failed_login_count = 0
        user.locked_at = None
    db.flush()
    db.refresh(user)
    after = {
        "is_active": user.is_active,
        "role_codes": user.role_codes,
        "failed_login_count": user.failed_login_count,
        "locked_at": user.locked_at.isoformat() if user.locked_at else None,
    }
    old, new = changed_fields(before, after)
    if new:
        write_audit(
            db,
            actor=_admin,
            action="user.update",
            entity_type="user",
            entity_id=user.id,
            before=old,
            after=new,
        )
    db.commit()
    db.refresh(user)
    return AdminUser(
        user_id=str(user.id),
        email=user.email,
        is_active=user.is_active,
        roles=user.role_codes,
        permissions=permissions_for(user.role_codes),
    )

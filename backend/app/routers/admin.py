"""System Admin user management: activate, deactivate, change roles, unlock."""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.audit import changed_fields, write_audit
from app.authz import ROLE_NAMES, permissions_for, require_permission
from app.database import get_db
from app.models import Role, User, UserRole

router = APIRouter(prefix="/api/admin", tags=["admin"])


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
        wanted = set(payload.role_codes)
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

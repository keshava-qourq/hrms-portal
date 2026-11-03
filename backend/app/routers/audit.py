"""Read-only, System Admin-only view of the audit log. No write verbs exist."""

from datetime import datetime
from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.audit import AuditLog
from app.authz import require_permission
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/api/admin", tags=["audit"])


class AuditItem(BaseModel):
    id: int
    actor: str
    action: str
    entity_type: str
    entity_id: str
    before_values: dict[str, Any] | None
    after_values: dict[str, Any] | None
    reason_or_comment: str | None
    created_at: datetime


class AuditPage(BaseModel):
    items: list[AuditItem]
    total: int


@router.get("/audit-logs", response_model=AuditPage)
def list_audit_logs(
    _admin: Annotated[User, Depends(require_permission("audit.view"))],
    db: Annotated[Session, Depends(get_db)],
    actor: str | None = None,
    entity_type: str | None = None,
    entity_id: str | None = None,
    action: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> AuditPage:
    conds = []
    if actor:
        conds.append(AuditLog.actor == actor)
    if entity_type:
        conds.append(AuditLog.entity_type == entity_type)
    if entity_id:
        conds.append(AuditLog.entity_id == entity_id)
    if action:
        conds.append(AuditLog.action == action)
    if date_from:
        conds.append(AuditLog.created_at >= date_from)
    if date_to:
        conds.append(AuditLog.created_at <= date_to)
    total = db.scalar(select(func.count()).select_from(AuditLog).where(*conds)) or 0
    rows = db.scalars(
        select(AuditLog)
        .where(*conds)
        .order_by(AuditLog.created_at.desc(), AuditLog.id.desc())
        .limit(limit)
        .offset(offset)
    ).all()
    return AuditPage(
        items=[
            AuditItem(
                id=r.id,
                actor=r.actor,
                action=r.action,
                entity_type=r.entity_type,
                entity_id=r.entity_id,
                before_values=r.before_values,
                after_values=r.after_values,
                reason_or_comment=r.reason_or_comment,
                created_at=r.created_at,
            )
            for r in rows
        ],
        total=total,
    )

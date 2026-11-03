"""Append-only audit log: the model, the write service and the database guard.

`write_audit` is the only write path; there is no update or delete function. On
PostgreSQL a trigger also refuses UPDATE and DELETE, so even a direct SQL
attempt fails. Entries carry no foreign key, so deleting a user cannot erase them.
"""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DDL, JSON, DateTime, Integer, String, Text, Uuid, event, func
from sqlalchemy.orm import Mapped, Session, mapped_column

from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    actor_user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True, index=True)
    actor: Mapped[str] = mapped_column(String(255), nullable=False)
    action: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    entity_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    before_values: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    after_values: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    reason_or_comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )


_FUNCTION = DDL(
    """
    CREATE OR REPLACE FUNCTION audit_logs_refuse_change() RETURNS trigger AS $$
    BEGIN
        RAISE EXCEPTION 'audit_logs is append-only';
    END;
    $$ LANGUAGE plpgsql
    """
)
_TRIGGER = DDL(
    """
    CREATE TRIGGER audit_logs_append_only BEFORE UPDATE OR DELETE ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION audit_logs_refuse_change()
    """
)
event.listen(AuditLog.__table__, "after_create", _FUNCTION.execute_if(dialect="postgresql"))
event.listen(AuditLog.__table__, "after_create", _TRIGGER.execute_if(dialect="postgresql"))


def changed_fields(
    before: dict[str, Any], after: dict[str, Any]
) -> tuple[dict[str, Any], dict[str, Any]]:
    """Only the keys whose value differs, as (before, after)."""
    keys = [k for k in after if before.get(k) != after[k]]
    return {k: before.get(k) for k in keys}, {k: after[k] for k in keys}


def write_audit(
    db: Session,
    *,
    actor,  # the verified User performing the action
    action: str,
    entity_type: str,
    entity_id: Any,
    before: dict[str, Any] | None = None,
    after: dict[str, Any] | None = None,
    comment: str | None = None,
) -> AuditLog:
    """Add one entry to the caller's transaction (committed with the change itself)."""
    entry = AuditLog(
        actor_user_id=actor.id,
        actor=actor.email,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        before_values=before,
        after_values=after,
        reason_or_comment=comment,
    )
    db.add(entry)
    return entry

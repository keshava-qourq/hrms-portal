"""Project assignment: the managing Project Manager assigns and soft-unassigns employees."""

import uuid
from datetime import UTC, date, datetime
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.audit import write_audit
from app.authz import ensure_relationship, require_permission
from app.database import get_db
from app.models import Employee, Project, ProjectAssignment, User

router = APIRouter(prefix="/api/projects", tags=["project-assignments"])

Manager = Annotated[User, Depends(require_permission("assignments.manage"))]
DbSession = Annotated[Session, Depends(get_db)]


class AssignmentIn(BaseModel):
    employee_id: uuid.UUID
    allocated_hours: Decimal | None = Field(
        default=None, ge=0, max_digits=7, decimal_places=2, allow_inf_nan=False
    )


class AssignmentOut(BaseModel):
    id: str
    project_id: str
    employee_id: str
    allocated_hours: float | None
    assigned_on: date
    is_active: bool


def _uuid(value: str) -> uuid.UUID | None:
    try:
        return uuid.UUID(value)
    except ValueError:
        return None


def _managed_project(db: Session, user: User, project_id: str) -> Project:
    """The project, only when the caller manages it; otherwise one identical 403."""
    pid = _uuid(project_id)
    project = db.get(Project, pid) if pid else None
    ensure_relationship(
        project is not None
        and user.employee_id is not None
        and project.project_manager_id == user.employee_id
    )
    return project


def _unprocessable(detail: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)


def _values(a: ProjectAssignment) -> dict[str, object]:
    return {
        "project_id": str(a.project_id),
        "employee_id": str(a.employee_id),
        "allocated_hours": float(a.allocated_hours) if a.allocated_hours is not None else None,
        "assigned_on": a.assigned_on.isoformat(),
        "unassigned_on": a.unassigned_on.isoformat() if a.unassigned_on else None,
        "is_active": a.is_active,
    }


@router.post(
    "/{project_id}/assignments", response_model=AssignmentOut, status_code=status.HTTP_201_CREATED
)
def assign_employee(
    project_id: str, payload: AssignmentIn, user: Manager, db: DbSession
) -> AssignmentOut:
    project = _managed_project(db, user, project_id)
    if project.status != "active":
        raise _unprocessable("project is not active")
    emp = db.get(Employee, payload.employee_id)
    if emp is None or not emp.is_active or emp.is_erased:
        raise _unprocessable("employee not found or not active")
    existing = db.scalars(
        select(ProjectAssignment).where(
            ProjectAssignment.project_id == project.id,
            ProjectAssignment.employee_id == emp.id,
            ProjectAssignment.is_active.is_(True),
        )
    ).first()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="employee already assigned"
        )
    a = ProjectAssignment(
        project_id=project.id,
        employee_id=emp.id,
        allocated_hours=payload.allocated_hours,
        assigned_on=datetime.now(UTC).date(),
        is_active=True,
    )
    db.add(a)
    db.flush()
    write_audit(
        db,
        actor=user,
        action="project.assign",
        entity_type="project_assignment",
        entity_id=a.id,
        after=_values(a),
    )
    db.commit()
    return AssignmentOut(
        id=str(a.id),
        project_id=str(a.project_id),
        employee_id=str(a.employee_id),
        allocated_hours=float(a.allocated_hours) if a.allocated_hours is not None else None,
        assigned_on=a.assigned_on,
        is_active=a.is_active,
    )


@router.delete("/{project_id}/assignments/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def unassign_employee(
    project_id: str, assignment_id: str, user: Manager, db: DbSession
) -> Response:
    project = _managed_project(db, user, project_id)
    aid = _uuid(assignment_id)
    a = db.get(ProjectAssignment, aid) if aid else None
    ensure_relationship(a is not None and a.project_id == project.id)
    if a.is_active:
        before = _values(a)
        a.is_active = False
        a.unassigned_on = datetime.now(UTC).date()
        write_audit(
            db,
            actor=user,
            action="project.unassign",
            entity_type="project_assignment",
            entity_id=a.id,
            before=before,
            after=_values(a),
        )
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

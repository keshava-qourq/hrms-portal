"""Relationship-scoped read endpoints (US-004).

Every handler fails closed: a caller sees only the records they are entitled to,
decided server-side from the verified user, never from the request body.

  * Employees see only their own timesheets, attendance and leave.
  * A Project Manager sees hours booked to the projects they manage, and never
    hours booked to any other project.
"""

import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.authz import ensure_relationship, permissions_for
from app.database import get_db
from app.models import (
    AttendanceRecord,
    LeaveRequest,
    Project,
    ProjectAssignment,
    Timesheet,
    TimesheetEntry,
    User,
)
from app.routers.auth import current_user

router = APIRouter(prefix="/api", tags=["scoped"])

CurrentUser = Annotated[User, Depends(current_user)]
DbSession = Annotated[Session, Depends(get_db)]
Limit = Annotated[int, Query(ge=1, le=200)]
Offset = Annotated[int, Query(ge=0)]


class ProjectOut(BaseModel):
    id: str
    code: str
    name: str
    status: str


class ProjectPage(BaseModel):
    items: list[ProjectOut]
    total: int


class TimesheetEntryOut(BaseModel):
    id: str
    timesheet_id: str
    employee_id: str
    project_id: str
    work_date: date
    hours: Decimal
    status: str


class TimesheetEntryPage(BaseModel):
    items: list[TimesheetEntryOut]
    total: int


class AttendanceOut(BaseModel):
    id: str
    employee_id: str
    work_date: date
    clock_in_at: datetime | None
    clock_out_at: datetime | None
    worked_minutes: int | None
    is_regularised: bool


class AttendancePage(BaseModel):
    items: list[AttendanceOut]
    total: int


class LeaveRequestOut(BaseModel):
    id: str
    employee_id: str
    leave_type_id: str
    start_date: date
    end_date: date
    day_count: Decimal
    status: str


class LeaveRequestPage(BaseModel):
    items: list[LeaveRequestOut]
    total: int


@router.get("/my/projects", response_model=ProjectPage)
def my_projects(
    user: CurrentUser,
    db: DbSession,
    limit: Limit = 50,
    offset: Offset = 0,
) -> ProjectPage:
    """Projects the caller manages or is actively assigned to."""
    if user.employee_id is None:
        return ProjectPage(items=[], total=0)
    assigned = (
        select(ProjectAssignment.project_id)
        .where(
            ProjectAssignment.employee_id == user.employee_id,
            ProjectAssignment.is_active.is_(True),
        )
        .scalar_subquery()
    )
    conds = (Project.project_manager_id == user.employee_id) | (Project.id.in_(assigned))
    total = db.scalar(select(func.count()).select_from(Project).where(conds)) or 0
    rows = db.scalars(
        select(Project).where(conds).order_by(Project.name).limit(limit).offset(offset)
    ).all()
    return ProjectPage(
        items=[ProjectOut(id=str(p.id), code=p.code, name=p.name, status=p.status) for p in rows],
        total=total,
    )


@router.get("/timesheets", response_model=TimesheetEntryPage)
def list_timesheets(
    user: CurrentUser,
    db: DbSession,
    project_id: uuid.UUID | None = None,
    employee_id: uuid.UUID | None = None,
    limit: Limit = 50,
    offset: Offset = 0,
) -> TimesheetEntryPage:
    """Timesheet hours, scoped to what the caller is entitled to see.

    With `project_id`, a Project Manager sees only hours booked to a project
    they manage. Otherwise the caller sees only their own hours; asking for
    another employee's hours is refused.
    """
    perms = set(permissions_for(user.role_codes))
    query = select(TimesheetEntry, Timesheet).join(
        Timesheet, TimesheetEntry.timesheet_id == Timesheet.id
    )
    if project_id is not None:
        project = db.get(Project, project_id)
        ensure_relationship(
            project is not None
            and "project.timesheets.review" in perms
            and user.employee_id is not None
            and project.project_manager_id == user.employee_id
        )
        query = query.where(TimesheetEntry.project_id == project_id)
    else:
        target = employee_id if employee_id is not None else user.employee_id
        ensure_relationship(user.employee_id is not None and target == user.employee_id)
        query = query.where(Timesheet.employee_id == target)

    count_q = select(func.count()).select_from(query.subquery())
    total = db.scalar(count_q) or 0
    rows = db.execute(query.order_by(TimesheetEntry.work_date).limit(limit).offset(offset)).all()
    return TimesheetEntryPage(
        items=[
            TimesheetEntryOut(
                id=str(e.id),
                timesheet_id=str(e.timesheet_id),
                employee_id=str(ts.employee_id),
                project_id=str(e.project_id),
                work_date=e.work_date,
                hours=e.hours,
                status=ts.status,
            )
            for e, ts in rows
        ],
        total=total,
    )


@router.get("/timesheets/{entry_id}", response_model=TimesheetEntryOut)
def get_timesheet_entry(
    entry_id: str,
    user: CurrentUser,
    db: DbSession,
) -> TimesheetEntryOut:
    """One timesheet entry, readable only by the employee who owns it.

    The refusal is one identical 403 whether the id is unknown, malformed or
    simply not the caller's, and it is raised before any record data is loaded
    into the response (fails closed)."""
    try:
        eid: uuid.UUID | None = uuid.UUID(entry_id)
    except ValueError:
        eid = None
    row = (
        db.execute(
            select(TimesheetEntry, Timesheet)
            .join(Timesheet, TimesheetEntry.timesheet_id == Timesheet.id)
            .where(TimesheetEntry.id == eid)
        ).first()
        if eid is not None
        else None
    )
    ensure_relationship(
        row is not None
        and user.employee_id is not None
        and row[1].employee_id == user.employee_id
    )
    entry, ts = row
    return TimesheetEntryOut(
        id=str(entry.id),
        timesheet_id=str(entry.timesheet_id),
        employee_id=str(ts.employee_id),
        project_id=str(entry.project_id),
        work_date=entry.work_date,
        hours=entry.hours,
        status=ts.status,
    )


@router.get("/attendance", response_model=AttendancePage)
def list_attendance(
    user: CurrentUser,
    db: DbSession,
    employee_id: uuid.UUID | None = None,
    limit: Limit = 50,
    offset: Offset = 0,
) -> AttendancePage:
    """The caller's own attendance records; another employee's is refused."""
    target = employee_id if employee_id is not None else user.employee_id
    ensure_relationship(user.employee_id is not None and target == user.employee_id)
    conds = [AttendanceRecord.employee_id == target]
    total = db.scalar(select(func.count()).select_from(AttendanceRecord).where(*conds)) or 0
    rows = db.scalars(
        select(AttendanceRecord)
        .where(*conds)
        .order_by(AttendanceRecord.work_date.desc())
        .limit(limit)
        .offset(offset)
    ).all()
    return AttendancePage(
        items=[
            AttendanceOut(
                id=str(a.id),
                employee_id=str(a.employee_id),
                work_date=a.work_date,
                clock_in_at=a.clock_in_at,
                clock_out_at=a.clock_out_at,
                worked_minutes=a.worked_minutes,
                is_regularised=a.is_regularised,
            )
            for a in rows
        ],
        total=total,
    )


@router.get("/attendance/{record_id}", response_model=AttendanceOut)
def get_attendance(
    record_id: str,
    user: CurrentUser,
    db: DbSession,
) -> AttendanceOut:
    """One attendance record, readable only by the employee it belongs to.

    Unknown, malformed or foreign ids are refused with one identical 403,
    before any record data is loaded (fails closed)."""
    try:
        rid: uuid.UUID | None = uuid.UUID(record_id)
    except ValueError:
        rid = None
    record = db.get(AttendanceRecord, rid) if rid is not None else None
    ensure_relationship(
        record is not None
        and user.employee_id is not None
        and record.employee_id == user.employee_id
    )
    return AttendanceOut(
        id=str(record.id),
        employee_id=str(record.employee_id),
        work_date=record.work_date,
        clock_in_at=record.clock_in_at,
        clock_out_at=record.clock_out_at,
        worked_minutes=record.worked_minutes,
        is_regularised=record.is_regularised,
    )


@router.get("/leave-requests", response_model=LeaveRequestPage)
def list_leave_requests(
    user: CurrentUser,
    db: DbSession,
    employee_id: uuid.UUID | None = None,
    limit: Limit = 50,
    offset: Offset = 0,
) -> LeaveRequestPage:
    """The caller's own leave requests; another employee's is refused."""
    target = employee_id if employee_id is not None else user.employee_id
    ensure_relationship(user.employee_id is not None and target == user.employee_id)
    conds = [LeaveRequest.employee_id == target]
    total = db.scalar(select(func.count()).select_from(LeaveRequest).where(*conds)) or 0
    rows = db.scalars(
        select(LeaveRequest)
        .where(*conds)
        .order_by(LeaveRequest.start_date.desc())
        .limit(limit)
        .offset(offset)
    ).all()
    return LeaveRequestPage(
        items=[
            LeaveRequestOut(
                id=str(lr.id),
                employee_id=str(lr.employee_id),
                leave_type_id=str(lr.leave_type_id),
                start_date=lr.start_date,
                end_date=lr.end_date,
                day_count=lr.day_count,
                status=lr.status,
            )
            for lr in rows
        ],
        total=total,
    )


@router.get("/leave-requests/{request_id}", response_model=LeaveRequestOut)
def get_leave_request(
    request_id: str,
    user: CurrentUser,
    db: DbSession,
) -> LeaveRequestOut:
    """One leave request, readable only by the employee who filed it.

    Unknown, malformed or foreign ids are refused with one identical 403,
    before any record data is loaded (fails closed)."""
    try:
        lid: uuid.UUID | None = uuid.UUID(request_id)
    except ValueError:
        lid = None
    lr = db.get(LeaveRequest, lid) if lid is not None else None
    ensure_relationship(
        lr is not None
        and user.employee_id is not None
        and lr.employee_id == user.employee_id
    )
    return LeaveRequestOut(
        id=str(lr.id),
        employee_id=str(lr.employee_id),
        leave_type_id=str(lr.leave_type_id),
        start_date=lr.start_date,
        end_date=lr.end_date,
        day_count=lr.day_count,
        status=lr.status,
    )

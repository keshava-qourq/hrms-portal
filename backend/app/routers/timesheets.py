"""Weekly timesheet grid: read a week and save its project/day cells.

Only the caller's own timesheet is ever read or written; identity comes from the
verified session. Hours are Decimal throughout and leave the API as numbers.
"""

import uuid
from datetime import date, timedelta
from decimal import Decimal
from typing import Annotated

from dateutil.relativedelta import relativedelta
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.authz import ensure_relationship
from app.database import get_db
from app.models import Project, ProjectAssignment, Timesheet, TimesheetEntry, User
from app.routers.auth import current_user

router = APIRouter(prefix="/api/timesheets", tags=["timesheets"])

CurrentUser = Annotated[User, Depends(current_user)]
DbSession = Annotated[Session, Depends(get_db)]

DAILY_MAX = Decimal(24)
LOCKED = {"submitted", "approved"}


class WeekProject(BaseModel):
    id: str
    code: str
    name: str
    status: str
    pickable: bool


class WeekEntry(BaseModel):
    project_id: str
    work_date: date
    hours: float


class WeekTotals(BaseModel):
    by_project: dict[str, float]
    by_day: dict[str, float]
    week: float


class WeekOut(BaseModel):
    week_start: date
    week_end: date
    status: str
    editable: bool
    timesheet_id: str | None
    projects: list[WeekProject]
    entries: list[WeekEntry]
    totals: WeekTotals


class EntryIn(BaseModel):
    project_id: uuid.UUID
    work_date: date
    hours: Decimal = Field(ge=0, le=DAILY_MAX, max_digits=4, decimal_places=2, allow_inf_nan=False)


class EntriesIn(BaseModel):
    entries: list[EntryIn]


def _unprocessable(loc: list, msg: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=[{"loc": loc, "msg": msg}]
    )


def _check_monday(week_start: date) -> None:
    if week_start.weekday() != 0:
        raise _unprocessable(["path", "week_start"], "week_start must be a Monday")


def _find_timesheet(db: Session, employee_id: uuid.UUID, week_start: date) -> Timesheet | None:
    return db.scalars(
        select(Timesheet).where(
            Timesheet.employee_id == employee_id, Timesheet.week_start_date == week_start
        )
    ).first()


def _week(db: Session, employee_id: uuid.UUID, week_start: date) -> WeekOut:
    ts = _find_timesheet(db, employee_id, week_start)
    rows = (
        db.scalars(select(TimesheetEntry).where(TimesheetEntry.timesheet_id == ts.id)).all()
        if ts
        else []
    )
    rows = sorted(rows, key=lambda e: (e.work_date, str(e.project_id)))
    assigned = set(
        db.scalars(
            select(ProjectAssignment.project_id).where(
                ProjectAssignment.employee_id == employee_id,
                ProjectAssignment.is_active.is_(True),
            )
        )
    )
    ids = assigned | {e.project_id for e in rows}
    projects = (
        db.scalars(select(Project).where(Project.id.in_(ids)).order_by(Project.name)).all()
        if ids
        else []
    )
    by_project: dict[str, Decimal] = {}
    by_day: dict[str, Decimal] = {}
    for e in rows:
        pid, day = str(e.project_id), e.work_date.isoformat()
        by_project[pid] = by_project.get(pid, Decimal(0)) + e.hours
        by_day[day] = by_day.get(day, Decimal(0)) + e.hours
    state = ts.status if ts else "draft"
    return WeekOut(
        week_start=week_start,
        week_end=week_start + timedelta(days=6),
        status=state,
        editable=state not in LOCKED,
        timesheet_id=str(ts.id) if ts else None,
        projects=[
            WeekProject(
                id=str(p.id),
                code=p.code,
                name=p.name,
                status=p.status,
                pickable=p.status == "active" and p.id in assigned,
            )
            for p in projects
        ],
        entries=[
            WeekEntry(project_id=str(e.project_id), work_date=e.work_date, hours=float(e.hours))
            for e in rows
        ],
        totals=WeekTotals(
            by_project={k: float(v) for k, v in by_project.items()},
            by_day={k: float(v) for k, v in by_day.items()},
            week=float(sum(by_project.values(), Decimal(0))),
        ),
    )


@router.get("/week/{week_start}", response_model=WeekOut)
def get_week(week_start: date, user: CurrentUser, db: DbSession) -> WeekOut:
    _check_monday(week_start)
    ensure_relationship(user.employee_id is not None)
    return _week(db, user.employee_id, week_start)


@router.put("/week/{week_start}/entries", response_model=WeekOut)
def put_week_entries(
    week_start: date, payload: EntriesIn, user: CurrentUser, db: DbSession
) -> WeekOut:
    _check_monday(week_start)
    ensure_relationship(user.employee_id is not None)
    employee_id = user.employee_id
    week_end = week_start + relativedelta(days=6)

    for i, e in enumerate(payload.entries):
        if not week_start <= e.work_date <= week_end:
            raise _unprocessable(
                ["body", "entries", i, "work_date"], "work_date must be inside the week"
            )

    ts = _find_timesheet(db, employee_id, week_start)
    if ts is not None and ts.status in LOCKED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"Timesheet is {ts.status}"
        )
    existing = {
        (e.project_id, e.work_date): e
        for e in (
            db.scalars(select(TimesheetEntry).where(TimesheetEntry.timesheet_id == ts.id)).all()
            if ts
            else []
        )
    }

    wanted: dict[tuple[uuid.UUID, date], Decimal] = {}
    last_index: dict[date, int] = {}
    for i, e in enumerate(payload.entries):
        wanted[(e.project_id, e.work_date)] = e.hours
        last_index[e.work_date] = i

    assigned = set(
        db.scalars(
            select(ProjectAssignment.project_id).where(
                ProjectAssignment.employee_id == employee_id,
                ProjectAssignment.is_active.is_(True),
            )
        )
    )
    for (pid, day), hours in wanted.items():
        project = db.get(Project, pid)
        old = existing[(pid, day)].hours if (pid, day) in existing else Decimal(0)
        if project is None:
            allowed = False
        elif project.status != "active":
            allowed = hours == old
        else:
            allowed = pid in assigned
        ensure_relationship(allowed)

    cells = {k: v.hours for k, v in existing.items()}
    for key, hours in wanted.items():
        cells[key] = hours
    day_totals: dict[date, Decimal] = {}
    for (_, day), hours in cells.items():
        day_totals[day] = day_totals.get(day, Decimal(0)) + hours
    for day in sorted(last_index):
        if day_totals.get(day, Decimal(0)) > DAILY_MAX:
            total = day_totals[day].normalize()
            raise _unprocessable(
                ["body", "entries", last_index[day], "hours"],
                f"Daily maximum is 24 hours ({day:%a} {day} would total {total:f})",
            )

    if ts is None:
        ts = Timesheet(employee_id=employee_id, week_start_date=week_start, status="draft")
        db.add(ts)
        db.flush()
    for key, hours in wanted.items():
        row = existing.get(key)
        if hours == 0:
            if row is not None:
                db.delete(row)
        elif row is not None:
            row.hours = hours
        else:
            db.add(
                TimesheetEntry(
                    timesheet_id=ts.id, project_id=key[0], work_date=key[1], hours=hours
                )
            )
    ts.total_hours = sum((h for h in cells.values()), Decimal(0))
    db.commit()
    return _week(db, employee_id, week_start)

"""Employee records and the manager's team view.

HR Admin creates and edits employee records; every field change is written to
the append-only audit log with its before and after value. `/api/my/team` is
exactly the employees whose reporting manager is the caller.
"""

import uuid
from datetime import UTC, date, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session, object_session

from app.audit import changed_fields, write_audit
from app.authz import ensure_relationship, permissions_for, require_permission
from app.database import get_db
from app.models import Department, Employee, LeaveRequest, Timesheet, User
from app.routers.auth import current_user
from app.security import SESSION_KEY_PREFIX, get_redis

router = APIRouter(prefix="/api", tags=["employees"])


class DepartmentOut(BaseModel):
    id: str
    name: str
    created_at: datetime


class EmployeeOut(BaseModel):
    id: str
    employee_number: str
    full_name: str
    work_email: str
    mobile_number: str | None
    personal_contact: str | None
    department_id: str
    reporting_manager_id: str | None
    start_date: date
    end_date: date | None
    is_active: bool
    department_name: str | None = None
    reporting_manager_name: str | None = None

    @classmethod
    def of(cls, e: Employee) -> "EmployeeOut":
        session = object_session(e)
        dept = session.get(Department, e.department_id) if session else None
        mgr = (
            session.get(Employee, e.reporting_manager_id)
            if session and e.reporting_manager_id
            else None
        )
        return cls(
            department_name=dept.name if dept else None,
            reporting_manager_name=mgr.full_name if mgr else None,
            id=str(e.id),
            employee_number=e.employee_number,
            full_name=e.full_name,
            work_email=e.work_email,
            mobile_number=e.mobile_number,
            personal_contact=e.personal_contact,
            department_id=str(e.department_id),
            reporting_manager_id=str(e.reporting_manager_id) if e.reporting_manager_id else None,
            start_date=e.start_date,
            end_date=e.end_date,
            is_active=e.is_active,
        )


class EmployeePage(BaseModel):
    items: list[EmployeeOut]
    total: int


class EmployeeCreate(BaseModel):
    """Every field here is mandatory; omitting one is a 422 naming it (AC-033)."""

    employee_number: str = Field(min_length=1, max_length=32)
    full_name: str = Field(min_length=1, max_length=160)
    work_email: str = Field(min_length=3, max_length=255)
    department_id: uuid.UUID
    reporting_manager_id: uuid.UUID
    start_date: date


class EmployeePatch(BaseModel):
    employee_number: str | None = Field(default=None, min_length=1, max_length=32)
    full_name: str | None = Field(default=None, min_length=1, max_length=160)
    work_email: str | None = Field(default=None, min_length=3, max_length=255)
    mobile_number: str | None = Field(default=None, max_length=32)
    personal_contact: str | None = Field(default=None, max_length=255)
    department_id: uuid.UUID | None = None
    reporting_manager_id: uuid.UUID | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_active: bool | None = None


OWN_EDITABLE = {"mobile_number", "personal_contact"}


def _require_department(db: Session, department_id: uuid.UUID) -> None:
    if db.get(Department, department_id) is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="department not found",
        )


def _require_manager(db: Session, manager_id: uuid.UUID) -> None:
    if db.get(Employee, manager_id) is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="reporting manager not found",
        )


def _audit_values(e: Employee) -> dict[str, object]:
    return {
        "employee_number": e.employee_number,
        "full_name": e.full_name,
        "work_email": e.work_email,
        "mobile_number": e.mobile_number,
        "personal_contact": e.personal_contact,
        "department_id": str(e.department_id),
        "reporting_manager_id": str(e.reporting_manager_id) if e.reporting_manager_id else None,
        "start_date": e.start_date.isoformat(),
        "end_date": e.end_date.isoformat() if e.end_date else None,
        "is_active": e.is_active,
    }


def _drop_sessions(user_ids: set[str]) -> None:
    """Best effort: delete live sessions of the given users."""
    try:
        r = get_redis()
        for key in r.scan_iter(SESSION_KEY_PREFIX + "*"):
            raw = r.get(key)
            if raw and any(f'"{u}"' in raw for u in user_ids):
                r.delete(key)
    except Exception:  # noqa: BLE001 -- inactive users are refused anyway
        pass


def _deactivate_user(db: Session, employee_id: uuid.UUID, scrub: bool = False) -> None:
    users = db.scalars(select(User).where(User.employee_id == employee_id)).all()
    for u in users:
        u.is_active = False
        if scrub:
            u.email = f"erased-{u.id}@erased.invalid"
    db.flush()
    _drop_sessions({str(u.id) for u in users})


class DepartmentCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)


@router.get("/departments", response_model=list[DepartmentOut])
def list_departments(
    _user: Annotated[User, Depends(current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[DepartmentOut]:
    rows = db.scalars(select(Department).order_by(Department.name)).all()
    return [DepartmentOut(id=str(d.id), name=d.name, created_at=d.created_at) for d in rows]


@router.post("/departments", response_model=DepartmentOut, status_code=status.HTTP_201_CREATED)
def create_department(
    payload: DepartmentCreate,
    hr: Annotated[User, Depends(require_permission("departments.manage"))],
    db: Annotated[Session, Depends(get_db)],
) -> DepartmentOut:
    name = payload.name.strip()
    if db.scalars(select(Department).where(func.lower(Department.name) == name.lower())).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="department name already in use"
        )
    dept = Department(name=name)
    db.add(dept)
    db.flush()
    write_audit(
        db,
        actor=hr,
        action="department.create",
        entity_type="department",
        entity_id=dept.id,
        after={"name": dept.name},
    )
    db.commit()
    db.refresh(dept)
    return DepartmentOut(id=str(dept.id), name=dept.name, created_at=dept.created_at)


@router.delete("/departments/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_department(
    department_id: str,
    hr: Annotated[User, Depends(require_permission("departments.manage"))],
    db: Annotated[Session, Depends(get_db)],
):
    try:
        did = uuid.UUID(department_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Department not found"
        ) from None
    dept = db.get(Department, did)
    if dept is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")
    assigned = (
        db.scalar(select(func.count()).select_from(Employee).where(Employee.department_id == did))
        or 0
    )
    if assigned:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"department has {assigned} assigned employees and cannot be deleted",
        )
    db.delete(dept)
    write_audit(
        db,
        actor=hr,
        action="department.delete",
        entity_type="department",
        entity_id=dept.id,
        before={"name": dept.name},
    )
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/employees", response_model=EmployeePage)
def list_employees(
    _hr: Annotated[User, Depends(require_permission("employees.manage"))],
    db: Annotated[Session, Depends(get_db)],
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> EmployeePage:
    total = db.scalar(select(func.count()).select_from(Employee)) or 0
    rows = db.scalars(
        select(Employee).order_by(Employee.full_name).limit(limit).offset(offset)
    ).all()
    return EmployeePage(items=[EmployeeOut.of(e) for e in rows], total=total)


@router.post("/employees", response_model=EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(
    payload: EmployeeCreate,
    hr: Annotated[User, Depends(require_permission("employees.manage"))],
    db: Annotated[Session, Depends(get_db)],
) -> EmployeeOut:
    _require_department(db, payload.department_id)
    _require_manager(db, payload.reporting_manager_id)

    email = str(payload.work_email).strip().lower()
    clash = db.scalars(
        select(Employee).where(
            (func.lower(Employee.work_email) == email)
            | (Employee.employee_number == payload.employee_number)
        )
    ).first()
    if clash is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="employee_number or work_email already in use",
        )

    employee = Employee(
        employee_number=payload.employee_number,
        full_name=payload.full_name,
        work_email=email,
        department_id=payload.department_id,
        reporting_manager_id=payload.reporting_manager_id,
        start_date=payload.start_date,
        is_active=True,
        is_erased=False,
    )
    db.add(employee)
    db.flush()
    write_audit(
        db,
        actor=hr,
        action="employee.create",
        entity_type="employee",
        entity_id=employee.id,
        after=_audit_values(employee),
    )
    db.commit()
    db.refresh(employee)
    return EmployeeOut.of(employee)


@router.patch("/employees/{employee_id}", response_model=EmployeeOut)
def patch_employee(
    employee_id: str,
    payload: EmployeePatch,
    hr: Annotated[User, Depends(current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> EmployeeOut:
    perms = set(permissions_for(hr.role_codes))
    fields = payload.model_dump(exclude_unset=True)
    is_hr = "employees.manage" in perms
    if not is_hr:
        # Own-profile edit: refuse before anything is loaded or saved.
        ensure_relationship(
            "profile.own" in perms
            and hr.employee_id is not None
            and employee_id.lower() == str(hr.employee_id)
            and set(fields) <= OWN_EDITABLE
        )
    try:
        eid = uuid.UUID(employee_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
        ) from None
    employee = db.get(Employee, eid)
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    if "department_id" in fields and fields["department_id"] is not None:
        _require_department(db, fields["department_id"])
    if "reporting_manager_id" in fields and fields["reporting_manager_id"] is not None:
        if fields["reporting_manager_id"] == employee.id:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="an employee cannot report to themselves",
            )
        _require_manager(db, fields["reporting_manager_id"])

    leaving = fields.get("is_active") is False and employee.is_active
    if (
        fields.get("is_active") is False
        and (fields.get("end_date") if "end_date" in fields else employee.end_date) is None
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="end_date is required when marking a leaver",
        )

    before = _audit_values(employee)
    for key, value in fields.items():
        if key == "work_email" and value is not None:
            value = str(value).strip().lower()
        setattr(employee, key, value)
    db.flush()
    if leaving:
        _deactivate_user(db, employee.id)
    db.refresh(employee)
    after = _audit_values(employee)

    old, new = changed_fields(before, after)
    if new:
        write_audit(
            db,
            actor=hr,
            action="employee.update",
            entity_type="employee",
            entity_id=employee.id,
            before=old,
            after=new,
        )
    db.commit()
    db.refresh(employee)
    return EmployeeOut.of(employee)


@router.post("/employees/{employee_id}/erase", response_model=EmployeeOut)
def erase_employee(
    employee_id: str,
    hr: Annotated[User, Depends(require_permission("employees.manage"))],
    db: Annotated[Session, Depends(get_db)],
) -> EmployeeOut:
    try:
        eid = uuid.UUID(employee_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
        ) from None
    employee = db.get(Employee, eid)
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    if employee.is_active or employee.is_erased:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="only a leaver that is not yet erased can be erased",
        )
    employee.full_name = "Erased"
    employee.work_email = f"erased-{employee.id}@erased.invalid"
    employee.mobile_number = None
    employee.personal_contact = None
    employee.is_erased = True
    employee.erased_at = datetime.now(UTC)
    db.flush()
    _deactivate_user(db, employee.id, scrub=True)
    write_audit(
        db,
        actor=hr,
        action="employee.erase",
        entity_type="employee",
        entity_id=employee.id,
    )
    db.commit()
    db.refresh(employee)
    return EmployeeOut.of(employee)


@router.get("/employees/{employee_id}", response_model=EmployeeOut)
def get_employee(
    employee_id: str,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> EmployeeOut:
    """One employee record, scoped to the caller's relationship to it.

    HR Admin sees any record; a Reporting Manager sees a direct report; an
    Employee sees only their own. For a relationship-scoped caller the refusal
    is one identical 403 whether the id is unknown, malformed or simply not
    theirs (AC-015), and it is raised before any record data reaches the
    response (NFR-004).
    """
    perms = set(permissions_for(user.role_codes))
    try:
        eid: uuid.UUID | None = uuid.UUID(employee_id)
    except ValueError:
        eid = None

    if "employees.manage" in perms:
        employee = db.get(Employee, eid) if eid else None
        if employee is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
        return EmployeeOut.of(employee)

    employee = db.get(Employee, eid) if eid else None
    allowed = employee is not None and (
        employee.id == user.employee_id
        or ("team.view" in perms and employee.reporting_manager_id == user.employee_id)
    )
    ensure_relationship(allowed)
    return EmployeeOut.of(employee)


@router.get("/my/team/{employee_id}", response_model=EmployeeOut)
def my_team_member(
    employee_id: str,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> EmployeeOut:
    """One direct report, readable only by their reporting manager.

    An id that is unknown, malformed or not one of the caller's reports is
    refused with one identical 403, before any record data reaches the response
    (fails closed)."""
    try:
        eid: uuid.UUID | None = uuid.UUID(employee_id)
    except ValueError:
        eid = None
    employee = db.get(Employee, eid) if eid else None
    ensure_relationship(
        employee is not None
        and user.employee_id is not None
        and employee.reporting_manager_id == user.employee_id
    )
    return EmployeeOut.of(employee)


class TeamMemberOut(BaseModel):
    id: str
    employee_number: str
    full_name: str
    work_email: str
    department_id: str
    department_name: str | None
    reporting_manager_id: str | None
    start_date: date
    end_date: date | None
    is_active: bool
    leave_status: str
    timesheet_status: str


class TeamPage(BaseModel):
    items: list[TeamMemberOut]
    total: int


@router.get("/my/team", response_model=TeamPage)
def my_team(
    user: Annotated[User, Depends(current_user)],
    db: Annotated[Session, Depends(get_db)],
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> TeamPage:
    if user.employee_id is None:
        return TeamPage(items=[], total=0)
    today = datetime.now(UTC).date()
    week_start = today - timedelta(days=today.weekday())
    conds = [
        Employee.reporting_manager_id == user.employee_id,
        Employee.is_active.is_(True),
        Employee.is_erased.is_(False),
    ]
    total = db.scalar(select(func.count()).select_from(Employee).where(*conds)) or 0
    on_leave = (
        select(LeaveRequest.id)
        .where(
            LeaveRequest.employee_id == Employee.id,
            LeaveRequest.status == "approved",
            LeaveRequest.start_date <= today,
            LeaveRequest.end_date >= today,
        )
        .exists()
    )
    ts_status = (
        select(Timesheet.status)
        .where(Timesheet.employee_id == Employee.id, Timesheet.week_start_date == week_start)
        .order_by(Timesheet.status)
        .limit(1)
        .scalar_subquery()
    )
    rows = db.execute(
        select(Employee, Department.name, on_leave.label("on_leave"), ts_status.label("ts"))
        .join(Department, Department.id == Employee.department_id)
        .where(*conds)
        .order_by(Employee.full_name, Employee.id)
        .limit(limit)
        .offset(offset)
    ).all()
    return TeamPage(
        items=[
            TeamMemberOut(
                id=str(e.id),
                employee_number=e.employee_number,
                full_name=e.full_name,
                work_email=e.work_email,
                department_id=str(e.department_id),
                department_name=dept_name,
                reporting_manager_id=str(e.reporting_manager_id),
                start_date=e.start_date,
                end_date=e.end_date,
                is_active=e.is_active,
                leave_status="on_leave" if leave else "available",
                timesheet_status=ts or "not_started",
            )
            for e, dept_name, leave, ts in rows
        ],
        total=total,
    )

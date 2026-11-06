"""Demo accounts: one sign-in per role, for local development and the demo deployment.

Runs on startup only when SEED_DEMO_ACCOUNTS=true (the deployed image sets it in
the Dockerfile), and by hand via `scripts/seed_demo.py`. Every account uses
DEMO_PASSWORD and does not have to change it on first sign-in. Re-running is
safe: existing demo accounts get their password, roles and lockout state reset.

| Email                    | Role              | Reports to   |
|--------------------------|-------------------|--------------|
| sysadmin@demo.test       | System Admin      | --           |
| hradmin@demo.test        | HR Admin          | --           |
| manager@demo.test        | Reporting Manager | --           |
| pm@demo.test             | Project Manager   | manager      |
| employee@demo.test       | Employee          | manager      |
| employee2@demo.test      | Employee          | manager      |
"""

from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.authz import ROLE_NAMES
from app.database import SessionLocal
from app.models import (
    Department,
    Employee,
    Project,
    ProjectAssignment,
    Role,
    User,
    UserRole,
)
from app.security import hash_password

DEMO_PASSWORD = "DemoPass123!"
DEPARTMENT = "Demo Engineering"
START = date(2025, 1, 6)

# (email, full name, employee number, role codes, manager email)
ACCOUNTS = [
    ("sysadmin@demo.test", "Sam Sysadmin", "DEMO-001", ["SYSTEM_ADMIN"], None),
    ("hradmin@demo.test", "Harper HR", "DEMO-002", ["HR_ADMIN"], None),
    ("manager@demo.test", "Morgan Manager", "DEMO-003", ["REPORTING_MANAGER"], None),
    ("pm@demo.test", "Parker PM", "DEMO-004", ["PROJECT_MANAGER"], "manager@demo.test"),
    ("employee@demo.test", "Emery Employee", "DEMO-005", ["EMPLOYEE"], "manager@demo.test"),
    ("employee2@demo.test", "Ellis Employee", "DEMO-006", ["EMPLOYEE"], "manager@demo.test"),
]


def _roles(db: Session) -> dict[str, Role]:
    existing = {r.code: r for r in db.scalars(select(Role))}
    # A SMALLINT primary key does not autoincrement on SQLite, so ids are given
    # there; elsewhere the database assigns them, keeping its sequence in step.
    sqlite = db.get_bind().dialect.name == "sqlite"
    next_id = max((r.id for r in existing.values()), default=0) + 1
    for code, name in ROLE_NAMES.items():
        if code not in existing:
            existing[code] = Role(code=code, name=name)
            if sqlite:
                existing[code].id = next_id
                next_id += 1
            db.add(existing[code])
    db.flush()
    return existing


def seed_demo_accounts() -> None:
    """Create or reset the demo accounts, their employee records and a demo project."""
    with SessionLocal() as db:
        roles = _roles(db)

        dept = db.scalar(select(Department).where(Department.name == DEPARTMENT))
        if dept is None:
            dept = Department(name=DEPARTMENT)
            db.add(dept)
            db.flush()

        employees: dict[str, Employee] = {}
        for email, full_name, number, codes, manager_email in ACCOUNTS:
            emp = db.scalar(select(Employee).where(Employee.work_email == email))
            if emp is None:
                emp = Employee(
                    employee_number=number,
                    full_name=full_name,
                    work_email=email,
                    department_id=dept.id,
                    start_date=START,
                )
                db.add(emp)
            emp.reporting_manager_id = employees[manager_email].id if manager_email else None
            emp.is_active = True
            db.flush()
            employees[email] = emp

            user = db.scalar(select(User).where(User.email == email))
            if user is None:
                user = User(email=email, password_hash="")
                db.add(user)
            user.employee_id = emp.id
            user.password_hash = hash_password(DEMO_PASSWORD)
            user.must_change_password = False
            user.is_active = True
            user.failed_login_count = 0
            user.locked_at = None
            user.roles = [UserRole(role_id=roles[code].id) for code in codes]
            db.flush()

        pm = employees["pm@demo.test"]
        project = db.scalar(select(Project).where(Project.code == "DEMO-PRJ"))
        if project is None:
            project = Project(
                code="DEMO-PRJ", name="Demo Project", project_manager_id=pm.id, start_date=START
            )
            db.add(project)
            db.flush()
        for email in ("employee@demo.test", "employee2@demo.test"):
            emp_id = employees[email].id
            assigned = db.scalar(
                select(ProjectAssignment).where(
                    ProjectAssignment.project_id == project.id,
                    ProjectAssignment.employee_id == emp_id,
                )
            )
            if assigned is None:
                db.add(
                    ProjectAssignment(project_id=project.id, employee_id=emp_id, assigned_on=START)
                )

        db.commit()

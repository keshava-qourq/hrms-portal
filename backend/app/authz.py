"""Fixed roles, their permission sets, and the reusable authorization dependencies.

Exactly five roles exist (NFR-021); permissions are a union over held roles.
Roles are read from the database on every request, so a removed role stops
granting access on the very next call (AC-012). Everything fails closed.
"""

from collections.abc import Callable
from typing import Annotated

from fastapi import Depends, HTTPException, status

from app.models import User
from app.routers.auth import current_user

ROLE_NAMES = {
    "EMPLOYEE": "Employee",
    "REPORTING_MANAGER": "Reporting Manager",
    "HR_ADMIN": "HR Admin",
    "PROJECT_MANAGER": "Project Manager",
    "SYSTEM_ADMIN": "System Admin",
}

_EMPLOYEE = {
    "profile.own", "timesheet.own", "leave.own", "holidays.view", "approvals.track",
}

ROLE_PERMISSIONS: dict[str, frozenset[str]] = {
    "EMPLOYEE": frozenset(_EMPLOYEE),
    "REPORTING_MANAGER": frozenset(
        _EMPLOYEE | {"team.view", "team.approve", "team.reports"}
    ),
    "HR_ADMIN": frozenset(
        {"employees.manage", "departments.manage", "leave.policy", "holidays.manage",
         "attendance.manage", "reports.org", "approvals.reopen"}
    ),
    "PROJECT_MANAGER": frozenset(
        {"projects.manage", "assignments.manage", "project.timesheets.review",
         "project.utilization"}
    ),
    "SYSTEM_ADMIN": frozenset(
        {"users.manage", "roles.assign", "settings.manage", "audit.view"}
    ),
}


def permissions_for(role_codes: list[str]) -> list[str]:
    """Sorted union of the permissions of the given roles; unknown codes grant nothing."""
    union: set[str] = set()
    for code in role_codes:
        union |= ROLE_PERMISSIONS.get(code, frozenset())
    return sorted(union)


def forbidden() -> HTTPException:
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")


def require_permission(*needed: str) -> Callable[..., User]:
    """Dependency: the user must hold at least one of the permissions, else 403."""

    def dependency(user: Annotated[User, Depends(current_user)]) -> User:
        if not set(needed) & set(permissions_for(user.role_codes)):
            raise forbidden()
        return user

    return dependency


def ensure_relationship(allowed: bool) -> None:
    """Second check for record-level access (own record, own team, own project).

    Call after the role check, with the result of the relationship test; refuses
    with 403 before any record data is loaded into the response.
    """
    if not allowed:
        raise forbidden()

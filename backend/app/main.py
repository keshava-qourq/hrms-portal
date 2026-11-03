"""Application entrypoint.

Generated from the approved architecture: one router per component that owns
endpoints, one route per endpoint the API spec declares. Every generated route
is a stub that returns a typed placeholder, so the service starts, serves its
OpenAPI document and passes its tests before a single handler is implemented.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import (
    audit,  # noqa: F401 -- registers the audit_logs table
    models,  # noqa: F401 -- imported so the tables register before create_all
)
from app.config import settings
from app.database import Base, engine
from app.routers import admin, auth
from app.routers import audit as audit_router
from app.services import configured_services

app = FastAPI(
    title="HRMS portal",
    description="Develop a modern, responsive HRMS portal with secure login and role-based access for Employees, Managers, HR, and Admins.\n\nEmployee Management: Manage employee profiles, departments, reporting managers, and project assignments.\n\nTimesheet Management: Allow employees to log daily/weekly working hours, select projects, submit timesheets, and track approval status.\n\nLeave Management: Enable employees to apply for leave, check leave balances, view leave history, and track requests.\n\nApproval Workflows: Allow managers to approve/reject timesheets and leave requests with comments and notifications.\n\n## HRMS Portal \u2013 User Roles and Permissions\n\n| Role              | Permissions                                                                                                                                         |\n| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |\n| Employee          | View/update own profile, submit daily/weekly timesheets, apply for leave, check leave balances, view holidays, and track approval status.           |\n| Reporting Manager | All employee permissions, view team members, approve/reject team timesheets and leave requests, monitor team availability, and access team reports. |\n| HR Admin          | Manage employee records, departments, leave policies, leave balances, holiday calendars, attendance records, and organization-wide HR reports.      |\n| Project Manager   | Create/manage projects, assign employees to projects, review project-specific timesheets, and monitor project utilization and allocated hours.      |\n| System Admin      | Manage users, roles, permissions, organization settings, system configurations, and audit logs with full administrative access.                     |\n\n### Role-Based Access Control (RBAC) Requirements\n\n1. Users must log in securely and access only features permitted for their roles.\n2. Employees can",  # noqa: E501 -- the approved project description is kept verbatim
    version="0.1.0",
)

# The SPA runs on a different origin than the API, so the browser refuses its calls
# unless that origin is allowed here. In development that is the Vite dev server; when
# deployed, the platform injects the frontend's real URL as ALLOWED_ORIGINS (comma
# separated). Point ALLOWED_ORIGINS at the real thing and nothing else has to change.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The scaffold ships no migrations, so the tables are created from the models on
# startup. Replace this with Alembic before anything holds data worth keeping.
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(audit_router.router)


@app.get("/health")
async def health() -> dict[str, object]:
    """Liveness probe, and the only route here that is not a stub."""
    return {"status": "ok", "services": configured_services()}

# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /api/admin/audit-logs | list_audit_logs | `backend/app/routers/audit.py:36` | — |
| PATCH | /api/admin/users/{user_id} | patch_user | `backend/app/routers/admin.py:33` | — |
| POST | /api/auth/login | login | `backend/app/routers/auth.py:71` | Authenticate and open a Redis-backed session. |
| POST | /api/auth/logout | logout | `backend/app/routers/auth.py:103` | Invalidate the session behind the bearer token. Always 204. |
| GET | /api/me | me | `backend/app/routers/auth.py:110` | The authenticated user. |
| GET | /health | health | `backend/app/main.py:49` | Liveness probe, and the only route here that is not a stub. |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /api/projects/{id}/assignments/{assignment_id}
- GET /api/approvals/pending
- GET /api/attendance
- GET /api/dashboard
- GET /api/departments
- GET /api/employees
- GET /api/holidays
- GET /api/leave-balances
- GET /api/leave-requests
- GET /api/my/projects
- GET /api/my/team
- GET /api/notifications
- GET /api/projects
- GET /api/timesheets
- GET /api/timesheets/week/{week_start}
- PATCH /api/attendance/{id}/regularise
- PATCH /api/employees/{id}
- POST /api/admin/holidays
- POST /api/admin/leave-types
- POST /api/admin/users
- POST /api/admin/users/{user_id}/password-reset
- POST /api/approvals/{item_type}/{item_id}/approve
- POST /api/approvals/{item_type}/{item_id}/reject
- POST /api/approvals/{item_type}/{item_id}/reopen
- POST /api/attendance/clock-in
- POST /api/attendance/clock-out
- POST /api/auth/change-password
- POST /api/departments
- POST /api/employees
- POST /api/employees/{id}/erase
- POST /api/leave-requests
- POST /api/notifications/{id}/read
- POST /api/projects
- POST /api/projects/{id}/assignments
- POST /api/timesheets/{id}/submit
- PUT /api/admin/leave-balances/{employee_id}/{leave_type_id}
- PUT /api/timesheets/week/{week_start}/entries
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `3726b65`
<!-- sdlc:auto:end source -->

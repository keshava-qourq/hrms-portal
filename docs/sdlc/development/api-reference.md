# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /health | health | `backend/app/main.py:43` | Liveness probe, and the only route here that is not a stub. |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /api/projects/{id}/assignments/{assignment_id}
- GET /api/admin/audit-logs
- GET /api/approvals/pending
- GET /api/attendance
- GET /api/dashboard
- GET /api/departments
- GET /api/employees
- GET /api/holidays
- GET /api/leave-balances
- GET /api/leave-requests
- GET /api/me
- GET /api/my/projects
- GET /api/my/team
- GET /api/notifications
- GET /api/projects
- GET /api/timesheets
- GET /api/timesheets/week/{week_start}
- PATCH /api/admin/users/{user_id}
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
- POST /api/auth/login
- POST /api/auth/logout
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
Generated from commit `85590ef`
<!-- sdlc:auto:end source -->

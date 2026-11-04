# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /api/admin/audit-logs | list_audit_logs | `backend/app/routers/audit.py:36` | — |
| POST | /api/admin/users | create_user | `backend/app/routers/admin.py:60` | — |
| PATCH | /api/admin/users/{user_id} | patch_user | `backend/app/routers/admin.py:147` | — |
| POST | /api/admin/users/{user_id}/password-reset | reset_password | `backend/app/routers/admin.py:116` | — |
| GET | /api/attendance | list_attendance | `backend/app/routers/scoped.py:220` | — |
| GET | /api/attendance/{record_id} | get_attendance | `backend/app/routers/scoped.py:257` | — |
| POST | /api/auth/change-password | change_password | `backend/app/routers/auth.py:89` | — |
| POST | /api/auth/login | login | `backend/app/routers/auth.py:113` | Authenticate and open a Redis-backed session. |
| POST | /api/auth/logout | logout | `backend/app/routers/auth.py:145` | Invalidate the session behind the bearer token. Always 204. |
| GET | /api/departments | list_departments | `backend/app/routers/employees.py:163` | — |
| POST | /api/departments | create_department | `backend/app/routers/employees.py:172` | — |
| DELETE | /api/departments/{department_id} | delete_department | `backend/app/routers/employees.py:199` | — |
| GET | /api/employees | list_employees | `backend/app/routers/employees.py:236` | — |
| POST | /api/employees | create_employee | `backend/app/routers/employees.py:250` | — |
| GET | /api/employees/{employee_id} | get_employee | `backend/app/routers/employees.py:412` | — |
| PATCH | /api/employees/{employee_id} | patch_employee | `backend/app/routers/employees.py:297` | — |
| POST | /api/employees/{employee_id}/erase | erase_employee | `backend/app/routers/employees.py:372` | — |
| GET | /api/leave-requests | list_leave_requests | `backend/app/routers/scoped.py:288` | — |
| GET | /api/leave-requests/{request_id} | get_leave_request | `backend/app/routers/scoped.py:325` | — |
| GET | /api/me | me | `backend/app/routers/auth.py:152` | The authenticated user. |
| GET | /api/my/projects | my_projects | `backend/app/routers/scoped.py:99` | — |
| GET | /api/my/team | my_team | `backend/app/routers/employees.py:491` | — |
| GET | /api/my/team/{employee_id} | my_team_member | `backend/app/routers/employees.py:447` | — |
| GET | /api/timesheets | list_timesheets | `backend/app/routers/scoped.py:128` | — |
| GET | /api/timesheets/{entry_id} | get_timesheet_entry | `backend/app/routers/scoped.py:181` | — |
| GET | /health | health | `backend/app/main.py:51` | Liveness probe, and the only route here that is not a stub. |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /api/projects/{id}/assignments/{assignment_id}
- GET /api/approvals/pending
- GET /api/dashboard
- GET /api/holidays
- GET /api/leave-balances
- GET /api/notifications
- GET /api/projects
- GET /api/timesheets/week/{week_start}
- PATCH /api/attendance/{id}/regularise
- PATCH /api/employees/{id}
- POST /api/admin/holidays
- POST /api/admin/leave-types
- POST /api/approvals/{item_type}/{item_id}/approve
- POST /api/approvals/{item_type}/{item_id}/reject
- POST /api/approvals/{item_type}/{item_id}/reopen
- POST /api/attendance/clock-in
- POST /api/attendance/clock-out
- POST /api/employees/{id}/erase
- POST /api/leave-requests
- POST /api/notifications/{id}/read
- POST /api/projects
- POST /api/projects/{id}/assignments
- POST /api/timesheets/{id}/submit
- PUT /api/admin/leave-balances/{employee_id}/{leave_type_id}
- PUT /api/timesheets/week/{week_start}/entries

**Code only:**

- DELETE /api/departments/{department_id}
- GET /api/attendance/{record_id}
- GET /api/employees/{employee_id}
- GET /api/leave-requests/{request_id}
- GET /api/my/team/{employee_id}
- GET /api/timesheets/{entry_id}
- PATCH /api/employees/{employee_id}
- POST /api/employees/{employee_id}/erase
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `688a7f9`
<!-- sdlc:auto:end source -->

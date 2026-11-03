# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

Delivery plan version 1 is approved. It has 9 sprints of capacity 20 each, covering 9 epics and 40 user stories. Some stories have sub-tasks.

Sprint goals:
- Sprint 1: Foundations: sign-in, fixed role model, append-only audit service, departments, and consistent date/time and language handling.
- Sprint 2: Employee records, administrator-created accounts, and server-side relationship-scoped access.
- Sprint 3: Session timeout and lockout, admin password reset, own profile, team view, and leaver handling.
- Sprint 4: Projects, assignments, and timesheet entry through the weekly grid.
- Sprint 5: Timesheet submission and status, browser clock-in/out, and HR leave configuration.
- Sprint 6: Leave requests, half-days, validation, balances, holiday calendar, and HR punch correction.
- Sprint 7: In-app alerts, pending approvals list, and approving timesheets and leave.
- Sprint 8: Rejection, self-approval escalation, reopen, resubmission, and leave history.
- Sprint 9: Employee home dashboard, phone-browser layouts, and the user guides.

Epics:
- EPIC-001: Secure Access, Accounts and Role-Based Permissions (US-001 to US-007)
- EPIC-002: Employee Profiles, Departments and Reporting Lines (US-008 to US-012)
- EPIC-003: Projects and Employee Assignments (US-013 to US-015)
- EPIC-004: Timesheet Entry and Submission (US-016 to US-019)
- EPIC-005: Attendance Clock-In and Clock-Out (US-020 to US-022)
- EPIC-006: Leave Requests, Balances and Holiday Calendar (US-023 to US-029; sub-tasks US-029-T1 to T3)
- EPIC-007: Single-Step Approval of Timesheets and Leave (US-030 to US-035; sub-tasks US-031-T1 to T3)
- EPIC-008: Employee Home Dashboard and Mobile-Responsive Portal (US-036 to US-038)
- EPIC-009: Portal User Guide (US-039, US-040)

The plan assigns each story to backend-agent, frontend-agent or security-agent. US-004 goes to security-agent. The sub-tasks include one assigned to qa-agent (US-031-T3, concurrency tests for balance deduction).

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009

- ⚠ The plan does not state which sprint each story belongs to, only the sprint goals, so story-to-sprint mapping cannot be documented.
- ⚠ Sprint start and end dates are not provided.
- ⚠ The project description and RBAC requirements in the input are truncated ('2. Employees can'), so the full RBAC requirement list could not be cross-checked against the plan.
- ⚠ The project description lists 5 roles (Employee, Reporting Manager, HR Admin, Project Manager, System Admin). The plan refers to a 'fixed role model' without naming the roles. Alignment is unconfirmed.

### DEV-RUN-STATUS · draft · source: dev:run

The development run is reported as 'completed'. Only 5 of 40 stories have delivered tickets. No ticket records exist for the other 35 stories or for any sub-task.

Delivered tickets: US-001, US-003, US-007, US-011, US-038.

Stories with no ticket record: US-002, US-004, US-005, US-006, US-008, US-009, US-010, US-012 to US-037, US-039, US-040.

Sub-tasks with no ticket record: US-029-T1, US-029-T2, US-029-T3, US-031-T1, US-031-T2, US-031-T3.

The five delivered tickets cover sign-in, multi-role permission union, the audit log, department maintenance, and single-language/date-time display. Based on the plan, no capability for timesheets, leave, attendance, projects, approvals, alerts, dashboard, mobile layout or user guides has a delivery record.

**Related:** US-001, US-003, US-007, US-011, US-038

- ⚠ Discrepancy: run status is 'completed', but 35 of 40 planned stories have no delivered ticket. It is unclear whether they were descoped, deferred, failed, or never attempted.
- ⚠ No statuses (blocked, failed, skipped) are given for undelivered stories.
- ⚠ Several core features appear undelivered, including administrator-created accounts (US-002), relationship-scoped access (US-004), session timeout and lockout (US-005), and the timesheet and leave workflows. Confirm whether the run ended early.
- ⚠ US-039 and US-040 (user guides) are not delivered. Treat any user-guide content as unavailable.

### DEV-US-001 · draft · source: dev:US-001

Ticket US-001 'Sign in with email and password' is delivered under commit 4329c5466ce7455d0e2c1589c5038eebd664ae9b. It is a 5-point story assigned to backend-agent under EPIC-001.

- Ticket: US-001, Sign in with email and password.
- Status: delivered.
- Commit: 4329c5466ce7455d0e2c1589c5038eebd664ae9b.
- Plan: 5 points, backend-agent, EPIC-001 (Secure Access, Accounts and Role-Based Permissions).
- This commit differs from the one shared by US-003, US-007 and US-011.
- The input does not describe the implementation, such as password hashing, session mechanism or endpoints.

**Related:** US-001, EPIC-001

- ⚠ No implementation details, acceptance criteria or test results were provided for this ticket.
- ⚠ Delivery depends on account creation (US-002) and on session timeout and lockout (US-005), which have no delivery records. Whether sign-in is usable end to end is unconfirmed.

### DEV-US-003 · draft · source: dev:US-003

Ticket US-003 'Permissions combine as a union across multiple roles' is delivered under commit 55abc29c3ffdfbc7a7bccbf39f4b07d6785c5123. It is a 5-point backend-agent story under EPIC-001.

- Ticket: US-003, Permissions combine as a union across multiple roles.
- Status: delivered.
- Commit: 55abc29c3ffdfbc7a7bccbf39f4b07d6785c5123 (shared with US-007 and US-011).
- Plan: 5 points, backend-agent, EPIC-001.
- This relates to the Sprint 1 goal 'fixed role model', but the input does not say so explicitly.
- The input does not describe the role-to-permission mapping or how the union is computed.

**Related:** US-003, EPIC-001

- ⚠ No implementation details, role-permission matrix or test results were provided.
- ⚠ The ticket shares a commit with two other tickets, so changes cannot be attributed to this ticket alone.
- ⚠ Relationship-scoped access (US-004) has no delivery record, so access control is incomplete at the role level only.

### DEV-US-007 · draft · source: dev:US-007

Ticket US-007 'Immutable audit log of approvals, changes and admin actions' is delivered under commit 55abc29c3ffdfbc7a7bccbf39f4b07d6785c5123. It is a 5-point backend-agent story under EPIC-001.

- Ticket: US-007, Immutable audit log of approvals, changes and admin actions.
- Status: delivered.
- Commit: 55abc29c3ffdfbc7a7bccbf39f4b07d6785c5123 (shared with US-003 and US-011).
- Plan: 5 points, backend-agent, EPIC-001.
- The Sprint 1 goal mentions an 'append-only audit service'.
- The input does not describe the storage design, the events captured, or how immutability is enforced.

**Related:** US-007, EPIC-001

- ⚠ No implementation details or tests proving immutability were provided.
- ⚠ The audit log covers 'approvals, changes and admin actions'. The approval and admin-account features that would emit those events (US-002, US-031 and others) have no delivery records, so actual event coverage is unconfirmed.
- ⚠ No retention policy or viewer for the audit log is described.

### DEV-US-011 · draft · source: dev:US-011

Ticket US-011 'HR Admin maintains departments' is delivered under commit 55abc29c3ffdfbc7a7bccbf39f4b07d6785c5123. It is a 2-point backend-agent story under EPIC-002.

- Ticket: US-011, HR Admin maintains departments.
- Status: delivered.
- Commit: 55abc29c3ffdfbc7a7bccbf39f4b07d6785c5123 (shared with US-003 and US-007).
- Plan: 2 points, backend-agent, EPIC-002 (Employee Profiles, Departments and Reporting Lines).
- The input does not say which department operations (create, edit, deactivate) were built.

**Related:** US-011, EPIC-002

- ⚠ The operations supported are not stated.
- ⚠ No front-end screen for departments is recorded. The ticket is backend-assigned and no frontend ticket exists.
- ⚠ Employee records (US-009), which would use departments, have no delivery record.

### DEV-US-038 · draft · source: dev:US-038

Ticket US-038 'Single-language interface and consistent date/time display' is delivered under commit b38ae141ca7f82cb681a72d6a7e7d50d0e613ea2. It is a 2-point frontend-agent story under EPIC-008.

- Ticket: US-038, Single-language interface and consistent date/time display.
- Status: delivered.
- Commit: b38ae141ca7f82cb681a72d6a7e7d50d0e613ea2.
- Plan: 2 points, frontend-agent, EPIC-008 (Employee Home Dashboard and Mobile-Responsive Portal).
- The Sprint 1 goal mentions 'consistent date/time and language handling', but the input does not explicitly link the ticket to that sprint.
- The input does not say which language, date format or time zone convention was adopted.

**Related:** US-038, EPIC-008

- ⚠ The chosen interface language, date format and time zone handling are not stated.
- ⚠ The other EPIC-008 stories (the dashboard US-036 and the phone layout US-037) have no delivery records, and few other screens are known to exist yet to apply this to.
<!-- sdlc:auto:end narrative -->

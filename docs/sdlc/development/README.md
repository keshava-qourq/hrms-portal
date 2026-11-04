# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-v3 · approved · source: plan:v3

Plan version 3 is approved. It has 10 sprints of capacity 20 each, 9 epics and 46 stories, plus tasks under US-029 and US-031. Sprint goals run from foundations and access control through timesheets, leave and approvals to the dashboard, mobile layouts and user guides. Sprint 10 covers change request CHG-001.

Sprint goals:
- Sprint 1: Foundations: sign-in, fixed role model, append-only audit service, departments, consistent date/time and language handling.
- Sprint 2: Employee records, administrator-created accounts, server-side relationship-scoped access.
- Sprint 3: Session timeout and lockout, admin password reset, own profile, team view, leaver handling.
- Sprint 4: Projects, assignments, timesheet entry through the weekly grid.
- Sprint 5: Timesheet submission and status, browser clock-in/out, HR leave configuration.
- Sprint 6: Leave requests, half-days, validation, balances, holiday calendar, HR punch correction.
- Sprint 7: In-app alerts, pending approvals list, approving timesheets and leave.
- Sprint 8: Rejection, self-approval escalation, reopen, resubmission, leave history.
- Sprint 9: Employee home dashboard, phone-browser layouts, user guides.
- Sprint 10: Change requests (CHG-001).

Epics and stories:
- EPIC-001 Secure Access, Accounts and RBAC: US-001 to US-007 (sign-in, admin-created accounts, union of roles, relationship-scoped access, session timeout/lockout, admin password reset, immutable audit log).
- EPIC-002 Profiles, Departments, Reporting Lines: US-008 to US-012.
- EPIC-003 Projects and Assignments: US-013 to US-015.
- EPIC-004 Timesheet Entry and Submission: US-016 to US-019.
- EPIC-005 Attendance Clock-In/Out: US-020 to US-022.
- EPIC-006 Leave, Balances, Holiday Calendar: US-023 to US-029. US-029 has tasks T1 (leave type and holiday admin endpoints), T2 (opening balance set/adjust endpoint) and T3 (HR leave configuration screens).
- EPIC-007 Single-Step Approval: US-030 to US-035. US-031 has tasks T1 (atomic approve endpoint), T2 (approve action on pending detail screen) and T3 (concurrency tests for balance deduction).
- EPIC-008 Home Dashboard and Mobile: US-036 to US-038.
- EPIC-009 Portal User Guide: US-039, US-040.
- Additional stories: US-041 (sign-in screen reads session_token from login response), US-042 (backend change-password endpoint), US-043 (frontend sign-in test using real login response), US-044 (backend admin password reset endpoint), US-045 (Users & roles 'Issue password reset' button calls backend), US-046 (automated tests for admin password reset).

Story points range from 1 to 8. Roles are assigned per item: backend-agent, frontend-agent, security-agent (US-004) and qa-agent (US-043, US-046, US-031-T3).

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019, US-020, US-021, US-022, US-023, US-024, US-025, US-026, US-027, US-028, US-029, US-030, US-031, US-032, US-033, US-034, US-035, US-036, US-037, US-038, US-039, US-040, US-041, US-042, US-043, US-044, US-045, US-046

- ⚠ The input does not map individual stories to sprints; only sprint goals are given.
- ⚠ US-041 to US-046 are not tied to any named sprint or epic. Sprint 10 mentions CHG-001, but the input does not say these stories belong to it.
- ⚠ The project description is truncated at RBAC requirement 2 ('Employees can'), so the full RBAC requirements cannot be checked against the plan.
- ⚠ The plan refers to a 'fixed role model', but the description lists five roles (Employee, Reporting Manager, HR Admin, Project Manager, System Admin). The input does not confirm how the plan's role model maps to these five.
- ⚠ No dates, plan approver or approval date, or version history (v1, v2) is provided.

### DEV-RUN-STATUS · draft · source: dev:run

The development run status is 'completed'. Only 5 of the 46 planned stories have a delivered ticket with a commit hash.

Delivered tickets with commits:
- US-005: 9d1e4a86249097e5e71e0d9ef4603016a93c270c
- US-006: dd39a18b75bd89e13d7f93e0379c73daf38ce1d5
- US-008: 2a64fee51c4126a79b9452c349a7cc04a218f801
- US-010: eae5063b59a1cdaf1f2dbc6c632596dd3792556b
- US-012: eae5063b59a1cdaf1f2dbc6c632596dd3792556b (same commit as US-010)

No ticket records were provided for any other story or task in the plan.

**Related:** US-005, US-006, US-008, US-010, US-012

- ⚠ The run is 'completed' but 41 of 46 planned stories (e.g. US-001 to US-004, US-007, US-009, US-011, US-013 to US-040) have no ticket or commit. It is unclear whether they were not attempted, are out of this run's scope, or were not reported.
- ⚠ Epics and tasks (e.g. US-029-T1 to T3, US-031-T1 to T3) have no delivery records.
- ⚠ No test, review or QA results are provided for any delivered ticket.

### DEV-US-005 · draft · source: dev:US-005

US-005 'Session timeout and account lockout' is delivered under commit 9d1e4a86249097e5e71e0d9ef4603016a93c270c. It is a backend-agent story of 5 points in EPIC-001.

- Ticket: US-005, status delivered.
- Commit: 9d1e4a86249097e5e71e0d9ef4603016a93c270c.
- Plan: the Sprint 3 goal mentions 'session timeout and lockout'.

**Related:** US-005

- ⚠ No details of the implementation are provided, such as timeout duration, lockout threshold or unlock behaviour.
- ⚠ No test results or review/approval are recorded.
- ⚠ The input does not explicitly state this ticket's sprint.
- ⚠ Dependency US-001 (sign-in) has no delivery record.

### DEV-US-006 · draft · source: dev:US-006

US-006 'Administrator-issued password reset' is delivered under commit dd39a18b75bd89e13d7f93e0379c73daf38ce1d5. It is a backend-agent story of 3 points in EPIC-001.

- Ticket: US-006, status delivered.
- Commit: dd39a18b75bd89e13d7f93e0379c73daf38ce1d5.
- Plan: the Sprint 3 goal mentions 'admin password reset'.
- Related stories in the plan are US-042 (change-password endpoint), US-044 (backend admin reset endpoint), US-045 (frontend 'Issue password reset' button) and US-046 (automated tests for admin reset). None has a delivery record.

**Related:** US-006, US-042, US-044, US-045, US-046

- ⚠ No details of the implementation are provided.
- ⚠ The input does not say how US-044 to US-046 relate to US-006. They may be follow-ups, but this is inferred from titles only.
- ⚠ No test results or review are recorded, and US-046 (admin reset tests) has no delivery record.
- ⚠ The input does not confirm whether a frontend for the reset exists, since US-045 is not delivered.

### DEV-US-008 · draft · source: dev:US-008

US-008 'View and update my own profile' is delivered under commit 2a64fee51c4126a79b9452c349a7cc04a218f801. It is a frontend-agent story of 3 points in EPIC-002.

- Ticket: US-008, status delivered.
- Commit: 2a64fee51c4126a79b9452c349a7cc04a218f801.
- Plan: the Sprint 3 goal mentions 'own profile'.

**Related:** US-008

- ⚠ The input does not state which profile fields are viewable or editable.
- ⚠ The backend supporting the profile (e.g. US-009 HR records) has no delivery record.
- ⚠ No test results or review are recorded.

### DEV-US-010 · draft · source: dev:US-010

US-010 'HR Admin corrects or erases a leaver's record' is delivered under commit eae5063b59a1cdaf1f2dbc6c632596dd3792556b. It is a backend-agent story of 5 points in EPIC-002.

- Ticket: US-010, status delivered.
- Commit: eae5063b59a1cdaf1f2dbc6c632596dd3792556b.
- The same commit is recorded for US-012.
- Plan: the Sprint 3 goal mentions 'leaver handling'.

**Related:** US-010, US-012

- ⚠ No details are provided on what 'correct' and 'erase' do, such as retention rules or audit entries.
- ⚠ The commit is shared with US-012, so the changes for each ticket cannot be separated from the input.
- ⚠ US-007 (audit log) has no delivery record, so audit coverage of erasure is unconfirmed.
- ⚠ No test results or review are recorded.

### DEV-US-012 · draft · source: dev:US-012

US-012 'Manager views their direct reports' is delivered under commit eae5063b59a1cdaf1f2dbc6c632596dd3792556b. It is a backend-agent story of 3 points in EPIC-002.

- Ticket: US-012, status delivered.
- Commit: eae5063b59a1cdaf1f2dbc6c632596dd3792556b.
- The same commit is recorded for US-010.
- Plan: the Sprint 3 goal mentions 'team view'.

**Related:** US-012, US-010

- ⚠ No details of the implementation are provided.
- ⚠ The commit is shared with US-010, so the changes for each ticket cannot be separated from the input.
- ⚠ The dependency on relationship-scoped access (US-004) has no delivery record.
- ⚠ No test results or review are recorded.
<!-- sdlc:auto:end narrative -->

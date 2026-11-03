# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V2 · approved · source: plan:v2

The development plan is at version 2 and approved. It has 10 sprints of capacity 20 each, covering 9 epics with their stories and tasks. Sprint goals run from foundations and access control through timesheets, leave and approvals to the dashboard, user guides and a change request.

Sprint goals:
- Sprint 1: sign-in, fixed role model, append-only audit service, departments, consistent date/time and language handling.
- Sprint 2: employee records, administrator-created accounts, server-side relationship-scoped access.
- Sprint 3: session timeout and lockout, admin password reset, own profile, team view, leaver handling.
- Sprint 4: projects, assignments, timesheet entry via the weekly grid.
- Sprint 5: timesheet submission and status, browser clock-in/out, HR leave configuration.
- Sprint 6: leave requests, half-days, validation, balances, holiday calendar, HR punch correction.
- Sprint 7: in-app alerts, pending approvals list, approving timesheets and leave.
- Sprint 8: rejection, self-approval escalation, reopen, resubmission, leave history.
- Sprint 9: employee home dashboard, phone-browser layouts, user guides.
- Sprint 10: change requests (CHG-001).

Epics:
- EPIC-001: Secure Access, Accounts and Role-Based Permissions (US-001 to US-007).
- EPIC-002: Employee Profiles, Departments and Reporting Lines (US-008 to US-012).
- EPIC-003: Projects and Employee Assignments (US-013 to US-015).
- EPIC-004: Timesheet Entry and Submission (US-016 to US-019).
- EPIC-005: Attendance Clock-In and Clock-Out (US-020 to US-022).
- EPIC-006: Leave Requests, Balances and Holiday Calendar (US-023 to US-029, with tasks US-029-T1 to T3).
- EPIC-007: Single-Step Approval of Timesheets and Leave (US-030 to US-035, with tasks US-031-T1 to T3).
- EPIC-008: Employee Home Dashboard and Mobile-Responsive Portal (US-036 to US-038).
- EPIC-009: Portal User Guide (US-039, US-040).

Unassigned to any listed epic: US-041 (sign-in screen reads session_token from the login response, frontend, 1 pt), US-042 (backend endpoint to change a password, backend, 3 pts) and US-043 (frontend sign-in test using the real login response, qa, 2 pts).

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009, CHG-001

- ⚠ The input does not map items to sprints, so which sprint each story belongs to cannot be confirmed.
- ⚠ Sprint 10 (CHG-001) has no identified items; it is unclear whether US-041 to US-043 belong to it.
- ⚠ US-041, US-042 and US-043 are not under any epic in the input, and no stated requirement ties them to a parent feature.
- ⚠ Several RBAC items are not in the plan as separate stories. The description lists Project Manager and System Admin roles with permissions such as managing roles, organization settings and system configuration, while Sprint 1 refers only to a 'fixed role model'. The role definitions and how they map to the plan are unconfirmed.
- ⚠ The project description is cut off at 'RBAC Requirements ... 2. Employees can', so the full RBAC requirement list was not available.

### DEV-US-002 · draft · source: dev:US-002

The ticket for administrator-created user accounts, with no public self-registration, is recorded as delivered with a commit. It is a 5-point backend story assigned to backend-agent.

- Ticket: US-002, Administrator creates user accounts — no public self-registration.
- Status: delivered.
- Commit: f75fe8452849476dd954bb08ec1b7f8db81bc7f4.
- Plan: 5 points, role backend-agent, under EPIC-001.
- The Sprint 2 goal mentions administrator-created accounts, which appears to match this ticket. The input does not state the mapping explicitly.

**Related:** US-002, EPIC-001

- ⚠ No description of the implementation (endpoints, data model, validation) was provided.
- ⚠ No review, test result or approval is recorded for this ticket.
- ⚠ The delivery date was not provided.
- ⚠ Delivered status is not confirmed by any test evidence.

### DEV-US-004 · draft · source: dev:US-004

The ticket for access scoped by relationship, not only by role, is recorded as delivered with a commit. It is an 8-point story assigned to security-agent.

- Ticket: US-004, Access scoped by relationship, not only by role.
- Status: delivered.
- Commit: 250127ce478c4a85eb6715e3b3b09a7382e58758.
- Plan: 8 points, role security-agent, under EPIC-001.
- The Sprint 2 goal mentions server-side relationship-scoped access, which appears to match this ticket. The input does not state the mapping explicitly.

**Related:** US-004, EPIC-001

- ⚠ No description of how relationship scoping was implemented (e.g. manager to direct reports, project to assignees) was provided.
- ⚠ No security review, test result or approval is recorded.
- ⚠ The delivery date was not provided.
- ⚠ US-003 (union of permissions across multiple roles) has no delivery record, but relationship-scoped access plausibly depends on it. The dependency is not stated in the input.

### DEV-US-009 · draft · source: dev:US-009

The ticket for HR Admin maintenance of employee records is recorded as delivered with a commit. It is a 5-point backend story assigned to backend-agent.

- Ticket: US-009, HR Admin maintains employee records.
- Status: delivered.
- Commit: 52e9b8c7ceb12106896c0643be4efee735b157ca.
- Plan: 5 points, role backend-agent, under EPIC-002.
- The Sprint 2 goal mentions employee records, which appears to match this ticket. The input does not state the mapping explicitly.

**Related:** US-009, EPIC-002

- ⚠ No description of the supported record fields or operations was provided.
- ⚠ No frontend work or ticket for HR employee-record screens is recorded, so it is unknown whether HR can use this from the UI.
- ⚠ No review, test result or approval is recorded.
- ⚠ The delivery date was not provided.

### DEV-RUN-STATUS · draft · source: dev:run

The development run is reported as completed, but only 3 of the 43 stories (US-002, US-004, US-009) have a recorded ticket. The remaining work has no delivery evidence in the input, so it cannot be documented as built.

Items in the plan with no ticket or delivery record:
- EPIC-001: US-001, US-003, US-005, US-006, US-007.
- EPIC-002: US-008, US-010, US-011, US-012.
- EPIC-003: US-013, US-014, US-015.
- EPIC-004: US-016 to US-019.
- EPIC-005: US-020 to US-022.
- EPIC-006: US-023 to US-029; tasks US-029-T1, US-029-T2, US-029-T3.
- EPIC-007: US-030 to US-035; tasks US-031-T1, US-031-T2, US-031-T3 (including the concurrency tests for balance deduction).
- EPIC-008: US-036, US-037, US-038.
- EPIC-009: US-039, US-040.
- Unassigned: US-041, US-042, US-043.

Nothing is stated about these items beyond their plan entries.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009

- ⚠ Run status 'completed' conflicts with only 3 of 43 stories having a delivered ticket. It is unclear whether the remaining items were not built, not reported, or out of scope for this run.
- ⚠ US-001 (sign-in) has no delivery record, although many delivered items depend on authentication.
- ⚠ No delivery status was recorded for the tasks US-029-T1 to T3 and US-031-T1 to T3.
- ⚠ No test or QA results, code review outcomes or approvals are provided for any ticket.
- ⚠ No delivery dates or sprint assignment of delivered work was provided.
- ⚠ The application's screens (screen keys such as SCR-001) were not provided, so usage documentation cannot be derived from this input.
<!-- sdlc:auto:end narrative -->

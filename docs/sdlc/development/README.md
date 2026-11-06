# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V3 · approved · source: plan:v3

Delivery plan version 3 is approved. It defines 10 sprints, each with a capacity of 20. Sprints 1-9 cover the product build and Sprint 10 covers change request CHG-001.

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

- ⚠ The input does not map stories to sprints; only sprint goals are given.
- ⚠ Sprint 10 names CHG-001, but no change request content is provided.
- ⚠ No sprint start or end dates were provided.
- ⚠ The plan approver and approval date are not recorded.

### DEV-BACKLOG · approved · source: plan:v3

The approved backlog has 9 epics and stories US-001 to US-046. Some stories are split into tasks and each item has an assigned agent role.

- EPIC-001 Secure Access, Accounts and RBAC: US-001 sign-in (backend); US-002 admin-created accounts, no self-registration (backend); US-003 union of permissions across roles (backend); US-004 relationship-scoped access (security-agent); US-005 session timeout and lockout (backend); US-006 admin-issued password reset (backend); US-007 immutable audit log (backend).
- EPIC-002 Profiles, Departments, Reporting Lines: US-008 own profile (frontend); US-009 HR maintains employee records (backend); US-010 HR corrects/erases leaver record (backend); US-011 departments (backend); US-012 manager views direct reports (backend).
- EPIC-003 Projects and Assignments: US-013 project records (backend); US-014 assign employees (backend); US-015 employee sees own assignments (frontend).
- EPIC-004 Timesheets: US-016 log daily hours (backend); US-017 weekly timesheet (frontend); US-018 submit and track status (backend); US-019 correct and resubmit rejected timesheet (backend).
- EPIC-005 Attendance: US-020 clock in/out from any browser (backend); US-021 own attendance history (backend); US-022 HR views/corrects punches (backend).
- EPIC-006 Leave: US-023 apply by type and date range (backend); US-024 half-day (backend); US-025 validation against weekends, holidays and balance (backend); US-026 balances (backend); US-027 leave history and status (frontend); US-028 holiday calendar (frontend); US-029 HR configures leave types, entitlements, holidays (backend), with tasks T1 endpoints (backend), T2 opening balance endpoint (backend), T3 HR configuration screens (frontend).
- EPIC-007 Approvals: US-030 pending list for direct reports (backend); US-031 approve (backend), with tasks T1 atomic approve endpoint (backend), T2 approve action on detail screen (frontend), T3 concurrency tests for balance deduction (qa); US-032 reject with mandatory comment (backend); US-033 no self-approval for multi-role users (backend); US-034 HR reopens approved item (backend); US-035 in-app alerts (backend).
- EPIC-008 Dashboard and Mobile: US-036 home dashboard (frontend); US-037 phone browser (frontend); US-038 single language and consistent date/time (frontend).
- EPIC-009 User Guide: US-039 employee guide (frontend); US-040 administrator guide (frontend).
- Additional stories: US-041 sign-in screen reads session_token from login response (frontend); US-042 backend change-password endpoint (backend); US-043 frontend sign-in test with real login response (qa); US-044 backend admin password reset endpoint (backend); US-045 Users & roles 'Issue password reset' button calls backend (frontend); US-046 automated tests for admin password reset (qa).

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009

- ⚠ Epics have no points or role assigned in the input.
- ⚠ The source of US-041 to US-046 (e.g. whether they come from CHG-001 or a defect) is not stated.
- ⚠ The project description was truncated in the input (RBAC requirement 2 is cut off), so the full RBAC requirements could not be cross-checked against the backlog.

### DEV-RUN · draft · source: dev:run

The development run is reported as 'completed', but ticket outcomes exist for only five of the planned stories. Four tickets were delivered and one was skipped.

- Run status: completed.
- Tickets with a recorded outcome: US-013, US-014, US-015, US-016, US-017.
- Delivered: US-013, US-014 (commit eac0b9dc6bd960555ec5188e62e9b86ccecbf705); US-016, US-017 (commit 18927b6478eaaaa6385085eb98a3c07169633dd2).
- Skipped: US-015, with no commit.
- The five tickets match the Sprint 4 goal (projects, assignments, weekly-grid timesheet entry). The input does not state that they were run as Sprint 4.

**Related:** US-013, US-014, US-015, US-016, US-017

- ⚠ Discrepancy: the run is 'completed', yet most planned stories (see DEV-UNTRACKED) have no ticket outcome and US-015 was skipped.
- ⚠ Tickets are not tied to sprints in the input.
- ⚠ No dates or test or QA results were provided for any ticket.

### DEV-US-013 · draft · source: dev:US-013

US-013, create and manage project records (backend, 3 points), is delivered in commit eac0b9dc.

- Ticket status: delivered.
- Commit: eac0b9dc6bd960555ec5188e62e9b86ccecbf705, shared with US-014.
- Part of EPIC-003 Projects and Employee Assignments.

**Related:** US-013, EPIC-003, DEV-RUN

- ⚠ No details of what was implemented (endpoints, fields, permissions) were provided.
- ⚠ No review, test or approval outcome was provided.
- ⚠ Delivered ticket status is the only evidence; acceptance criteria were not supplied.

### DEV-US-014 · draft · source: dev:US-014

US-014, assign employees to projects (backend, 3 points), is delivered in commit eac0b9dc, the same commit as US-013.

- Ticket status: delivered.
- Commit: eac0b9dc6bd960555ec5188e62e9b86ccecbf705, shared with US-013.
- Part of EPIC-003 Projects and Employee Assignments.

**Related:** US-014, US-013, EPIC-003, DEV-RUN

- ⚠ No implementation details were provided.
- ⚠ No review, test or approval outcome was provided.
- ⚠ The assignment-related behaviour that depends on employee records (US-009) cannot be confirmed, as no ticket outcome for US-009 was provided.

### DEV-US-015 · draft · source: dev:US-015

US-015, employee sees their own project assignments (frontend, 2 points), was skipped. No commit exists, so this functionality is not recorded as built.

- Ticket status: skipped.
- Commit: none.
- It is the only frontend story in EPIC-003. Backend assignment creation (US-014) is delivered, but no screen is recorded for an employee to view their assignments.

**Related:** US-015, US-014, EPIC-003, DEV-RUN

- ⚠ The reason for skipping is not stated.
- ⚠ It is unknown whether the story is deferred, descoped or covered elsewhere.
- ⚠ Without this story, the project selection used by the weekly timesheet (US-016/US-017) may depend on another source; this cannot be confirmed from the input.

### DEV-US-016 · draft · source: dev:US-016

US-016, log daily hours against assigned projects (backend, 5 points), is delivered in commit 18927b64, shared with US-017.

- Ticket status: delivered.
- Commit: 18927b6478eaaaa6385085eb98a3c07169633dd2, shared with US-017.
- Part of EPIC-004 Timesheet Entry and Submission.

**Related:** US-016, EPIC-004, US-014, DEV-RUN

- ⚠ No implementation details were provided (validation rules, limits, data model).
- ⚠ No review, test or approval outcome was provided.
- ⚠ It is not confirmed how 'assigned projects' is enforced, given that US-015 was skipped.

### DEV-US-017 · draft · source: dev:US-017

US-017, enter and review a weekly timesheet (frontend, 2 points per plan listing 5), is delivered in commit 18927b64, shared with US-016.

- Ticket status: delivered.
- Commit: 18927b6478eaaaa6385085eb98a3c07169633dd2, shared with US-016.
- Part of EPIC-004 Timesheet Entry and Submission. The Sprint 4 goal refers to the weekly grid.

**Related:** US-017, US-016, EPIC-004, DEV-RUN

- ⚠ No implementation details of the weekly grid screen were provided.
- ⚠ No review, test or approval outcome was provided.
- ⚠ Submission and status (US-018) have no recorded ticket, so how the weekly timesheet is submitted is not documented.

### DEV-UNTRACKED · draft · source: plan:v3

The stories listed in the related ids are in the approved plan but have no ticket status or commit in the development input. Their delivery state is unknown and is not documented as done.

- Covered by no recorded ticket: all of EPIC-001 (US-001 to US-007), EPIC-002 (US-008 to US-012), US-018 and US-019, EPIC-005 (US-020 to US-022), EPIC-006 (US-023 to US-029 and tasks US-029-T1 to T3), EPIC-007 (US-030 to US-035 and tasks US-031-T1 to T3), EPIC-008 (US-036 to US-038), EPIC-009 (US-039, US-040) and US-041 to US-046.
- Nothing is documented for these items beyond their plan entries in DEV-BACKLOG.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-018, US-019, US-020, US-021, US-022, US-023, US-024, US-025, US-026, US-027, US-028, US-029, US-030, US-031, US-032, US-033, US-034, US-035, US-036, US-037, US-038, US-039, US-040, US-041, US-042, US-043, US-044, US-045, US-046

- ⚠ Confirm whether tickets for these stories were run, are pending, or were omitted from the report.
- ⚠ Confirm the discrepancy between run status 'completed' and the absence of these tickets.
- ⚠ The secure sign-in, role-based access and audit foundations (EPIC-001) have no recorded delivery, so the security behaviour of the build cannot be documented.
- ⚠ No testing, review or QA evidence exists for any story, including the qa-agent tasks US-031-T3, US-043 and US-046.
- ⚠ Because most functionality is not confirmed as built, a user guide cannot yet be reliably documented from this input.
<!-- sdlc:auto:end narrative -->

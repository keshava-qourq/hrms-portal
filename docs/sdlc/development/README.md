# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN · approved · source: plan

Approved development plan (version 2) organizing the HRMS portal build into 10 sprints of capacity 20 each. Sprints progress from security/foundations through employee records, projects, timesheets, attendance, leave, approvals, dashboard/mobile, user guides, and change requests.

Sprint goals as stated:
- Sprint 1: Foundations — sign-in, fixed role model, append-only audit service, departments, consistent date/time and language handling.
- Sprint 2: Employee records, administrator-created accounts, server-side relationship-scoped access.
- Sprint 3: Session timeout and lockout, admin password reset, own profile, team view, leaver handling.
- Sprint 4: Projects, assignments, timesheet entry via weekly grid.
- Sprint 5: Timesheet submission and status, browser clock-in/out, HR leave configuration.
- Sprint 6: Leave requests, half-days, validation, balances, holiday calendar, HR punch correction.
- Sprint 7: In-app alerts, pending approvals list, approving timesheets and leave.
- Sprint 8: Rejection, self-approval escalation, reopen, resubmission, leave history.
- Sprint 9: Employee home dashboard, phone-browser layouts, user guides.
- Sprint 10: Change requests (CHG-001).

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009

- ⚠ Input does not map individual stories to specific sprints; sprint-to-story assignment is inferred only from goal wording, not stated.
- ⚠ CHG-001 (Sprint 10) is named but no change-request details are provided.

### EPIC-001 · approved · source: plan:EPIC-001

Epic: Secure Access, Accounts and Role-Based Permissions. Covers secure sign-in, admin-created accounts, role union permissions, relationship-scoped access, session/lockout, admin password reset, and immutable audit log.

Stories: US-001 Sign in with email/password (backend); US-002 admin creates accounts, no public self-registration (backend); US-003 permissions union across roles (backend); US-004 access scoped by relationship not only role (security); US-005 session timeout and lockout (backend); US-006 admin-issued password reset (backend); US-007 immutable audit log of approvals/changes/admin actions (backend). Related supporting stories: US-041 sign-in reads session_token, US-042 backend change-password endpoint.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-041, US-042

- ⚠ No delivery status recorded for US-001 through US-007; only US-041 shows a ticket as delivered.

### EPIC-002 · approved · source: plan:EPIC-002

Epic: Employee Profiles, Departments and Reporting Lines. Covers self-service profile, HR record maintenance, leaver correction/erasure, departments, and manager view of direct reports.

Stories: US-008 view/update own profile (frontend); US-009 HR Admin maintains employee records (backend); US-010 HR Admin corrects/erases a leaver's record (backend); US-011 HR Admin maintains departments (backend); US-012 manager views direct reports (backend).

**Related:** US-008, US-009, US-010, US-011, US-012

- ⚠ No per-story delivery status, commits, or results recorded.

### EPIC-003 · approved · source: plan:EPIC-003

Epic: Projects and Employee Assignments. Covers project record management, employee assignment, and employee view of own assignments.

Stories: US-013 create/manage project records (backend); US-014 assign employees to projects (backend); US-015 employee sees own project assignments (frontend).

**Related:** US-013, US-014, US-015

- ⚠ No per-story delivery status recorded.

### EPIC-004 · approved · source: plan:EPIC-004

Epic: Timesheet Entry and Submission. Covers daily hours against projects, weekly timesheet entry/review, submission with on-screen status, and correction/resubmission of rejected timesheets.

Stories: US-016 log daily hours against assigned projects (backend); US-017 enter/review weekly timesheet (frontend); US-018 submit timesheet and track status (backend); US-019 correct and resubmit a rejected timesheet (backend).

**Related:** US-016, US-017, US-018, US-019

- ⚠ No per-story delivery status recorded.

### EPIC-005 · approved · source: plan:EPIC-005

Epic: Attendance Clock-In and Clock-Out. Covers browser clock-in/out, own attendance history, and HR Admin correction of punches.

Stories: US-020 clock in/out from any browser (backend); US-021 view own attendance history (backend); US-022 HR Admin views/corrects attendance punches (backend).

**Related:** US-020, US-021, US-022

- ⚠ No per-story delivery status recorded.

### EPIC-006 · approved · source: plan:EPIC-006

Epic: Leave Requests, Balances and Holiday Calendar. Covers leave application by type/date, half-day increments, validation, balances, history/status, holiday calendar, and HR leave configuration.

Stories: US-023 apply for leave by type/date range (backend); US-024 half-day as smallest increment (backend); US-025 validate against weekends/holidays/balance (backend); US-026 view leave balances (backend); US-027 view leave history and status (frontend); US-028 view company holiday calendar (frontend); US-029 HR Admin configures leave types, entitlements, holidays (backend). US-029 tasks: T1 leave type/holiday admin endpoints, T2 opening balance set/adjust endpoint, T3 HR leave configuration screens.

**Related:** US-023, US-024, US-025, US-026, US-027, US-028, US-029

- ⚠ No per-story or per-task delivery status recorded.

### EPIC-007 · approved · source: plan:EPIC-007

Epic: Single-Step Approval of Timesheets and Leave. Covers reviewing pending items, atomic approval, mandatory-comment rejection, no self-approval, HR reopen, and in-app alerts.

Stories: US-030 review pending timesheets/leave for direct reports (backend); US-031 approve a submitted item (backend); US-032 reject with mandatory comment (backend); US-033 no self-approval for multi-role users (backend); US-034 HR Admin reopens an approved item (backend); US-035 in-app alerts for submissions/decisions (backend). US-031 tasks: T1 atomic approve endpoint, T2 approve action on pending detail screen, T3 concurrency tests for balance deduction.

**Related:** US-030, US-031, US-032, US-033, US-034, US-035

- ⚠ No per-story or per-task delivery status recorded.

### EPIC-008 · approved · source: plan:EPIC-008

Epic: Employee Home Dashboard and Mobile-Responsive Portal. Covers a combined timesheet/attendance/leave dashboard, phone-browser support, and single-language/consistent date-time display.

Stories: US-036 combined home dashboard (frontend); US-037 use portal on phone browser (frontend); US-038 single-language interface and consistent date/time display (frontend).

**Related:** US-036, US-037, US-038

- ⚠ No per-story delivery status recorded.

### EPIC-009 · approved · source: plan:EPIC-009

Epic: Portal User Guide. Covers employee and administrator user guides.

Stories: US-039 employee user guide (frontend); US-040 administrator user guide (frontend).

**Related:** US-039, US-040

- ⚠ No per-story delivery status recorded; user-guide artifacts themselves are not included in the input.

### US-041 · approved · source: dev:US-041

Sign-in screen reads the session_token from the login response. This is the only ticket in the development run with a recorded delivery status.

Ticket US-041 'Sign-in screen reads session_token from the login response' — status=delivered, commit=1a5197f86981363d35e46531954d377e7e5f4683. Story points=1, role=frontend-agent. Relates to the sign-in flow (US-001) within EPIC-001.

**Related:** US-001, EPIC-001

### DEV-RUN-STATUS · draft · source: dev:run

The development run is marked 'completed', but only one ticket (US-041) carries a delivered status and commit. No delivery evidence is present for the other 42 stories or the supporting tasks.

Discrepancy: run status = completed, yet the only itemized delivery record is US-041 (delivered, commit 1a5197...). All other stories (US-001–US-040, US-042, US-043) and all tasks (US-029-T1/T2/T3, US-031-T1/T2/T3) have no recorded ticket status, commit, or result. Per the no-fabrication rule, delivery of these items cannot be asserted from the input.

- ⚠ Run labeled 'completed' conflicts with the absence of delivery records for 42 of 43 stories — needs human confirmation of actual build completeness.
- ⚠ No commits/test results provided for US-001 through US-040, US-042, US-043.
- ⚠ US-043 (frontend sign-in test using real login response, qa-agent) and US-029/US-031 QA tasks have no recorded outcome.
- ⚠ CHG-001 change-request work (Sprint 10) has no delivery evidence.

### DEV-COMPLIANCE · draft · source: plan

No industry or domain skill with named regulations was supplied with this phase's input, so regulation-to-control tracing cannot be performed here. Several stories imply security/privacy intent but are not mapped to any named regulation.

The input does not name an industry or a domain skill listing specific regulations, so no regulation controls can be traced in a traceability_matrix for this phase. Security/privacy-relevant stories observed (not attributed to any stated regulation): US-004 relationship-scoped access, US-005 session timeout/lockout, US-007 immutable audit log, US-010 leaver record correction/erasure, US-033 no self-approval. These are noted for a human to confirm against any applicable compliance framework.

**Related:** US-004, US-007, US-010, US-033

- ⚠ No industry/domain skill with regulations provided; compliance tracing to named controls could not be done.
<!-- sdlc:auto:end narrative -->

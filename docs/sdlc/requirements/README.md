# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-STACK · approved · source: requirements:technology-stack

The product owner approved the stack: FastAPI 0.115, React 19, PostgreSQL 16, AWS, and Redis 7 (queue and cache) in a redis:7-alpine container. Design must use exactly these. The approved REDIS_URL is the only API key listed.

Approved stack (do not substitute):
- Backend: FastAPI 0.115. This replaces the analyst's Node/TypeScript assumption, because Node cannot be built on this platform. Stated reasons: the hard parts are rules (relationship-scoped permissions, self-approval escalation, leave maths, spreadsheet handling), and tens of users at week-end peaks is within FastAPI's reach.
- Frontend: React 19. One responsive interface for desktop and phone browsers, built from one shared set of screens that show or hide sections by role.
- Database: PostgreSQL 16. System of record for people, hours, attendance and leave balances. Relational integrity must prevent double-deducting a balance when an approval and an HR correction land together. It also keeps the immutable audit log append-only and searchable. Load is about 500 employees.
- Cloud: AWS. One managed region inside the company's own country, daily automated backups, managed PostgreSQL with daily snapshots and point-in-time restore, and encryption at rest.

Approved services (runtime_needs must include exactly these):
- Queue: Redis (as a queue), container redis:7-alpine. Background and retried work.
- Cache: Redis, container redis:7-alpine. Holds login sessions (so session timeout and lockout work reliably) and caches dashboard figures (team availability, project utilisation, leave liability).

API keys: REDIS_URL.

- ⚠ Conflict: the queue rationale cites bulk spreadsheet import, month-end CSV/Excel payroll export and nightly pending-approval reminders. Bulk import and CSV/Excel export are not in the lightweight capability set, and reminder emails are out of scope because email was removed. Which background jobs the queue actually serves is unclear.
- ⚠ The FastAPI rationale cites accrual/carry-over maths and CSV/Excel handling, and the cloud rationale cites SES. None of these is in scope for this version.
- ⚠ The cache rationale cites team availability, project utilisation and leave liability dashboards, but EPIC-007 says manager dashboards and reports are not in this scope.
- ⚠ The in-country data-residency, daily automated backup and point-in-time restore requirements appear only in the stack rationale. No user story or acceptance criterion covers them.
- ⚠ Redis session store and queue share one Redis instance. No persistence or availability expectation is stated.

### REQ-SCOPE · draft · source: requirements:scope

Requirements v3 uses the lightweight delivery scope. It lists in-scope capabilities and a firm out-of-scope list. The interface is a single-language, mobile-responsive web portal, with accounts created only by an administrator.

In scope:
- Email/password sign-in; administrator-created accounts, no public self-registration.
- Employee profiles with department and reporting manager.
- Projects and employee-to-project assignments.
- Daily and weekly timesheet entry against assigned projects, with submission and on-screen status.
- Browser clock-in/clock-out, stamped by the server clock, with no geofencing or location check.
- Leave requests by type and date range, with half-day as the smallest increment.
- Personal leave balance and history, and the company holiday calendar.
- Employee home dashboard.
- Mobile-responsive screens.
- Single-language interface (English / the local language).
- Portal user guide for employees and administrators.

Out of scope (do not design or build):
- Single sign-on (Google Workspace, Microsoft 365, Azure AD).
- Automatic payroll integration.
- Multi-country support (holiday calendars, leave rules, timezones) and multi-language UI.
- Biometric clock-in and badge/RFID terminals.
- Native iOS/Android apps, offline clock-in and push notifications.
- Payroll/salary processing, recruitment, performance reviews, expense claims, and employee document storage.
- Email (SendGrid was removed from the stack).

Beyond the out-of-scope list, these were assumed in the confirmed understanding but are not in the Lightweight MVP capability set:
- Bulk CSV/Excel import.
- Payroll CSV/Excel export.
- Leave accrual and carry-over automation.
- Attendance reports.
- Manager dashboards and reports.

**Related:** US-001, US-008, US-013, US-016, US-020, US-023, US-036, US-037, US-039

- ⚠ 'English / the local language' is ambiguous: which single language is configured is not stated.
- ⚠ The scope-reduction decisions (no bulk import, no export, no accrual/carry-over, no email, no dashboards) are marked 'to confirm' in the epics, and no confirmation is recorded.

### REQ-RBAC · draft · source: requirements:project-description

The project description defines five roles: Employee, Reporting Manager, HR Admin, Project Manager and System Admin. Its permission table is broader than what the lightweight user stories cover.

Role permissions as given in the description:
- Employee: view/update own profile, submit daily/weekly timesheets, apply for leave, check balances, view holidays, track approval status.
- Reporting Manager: all Employee permissions, plus view team members, approve/reject team timesheets and leave, monitor team availability, access team reports.
- HR Admin: manage employee records, departments, leave policies, leave balances, holiday calendars, attendance records, and organisation-wide HR reports.
- Project Manager: create/manage projects, assign employees, review project-specific timesheets, monitor project utilisation and allocated hours.
- System Admin: manage users, roles, permissions, organisation settings, system configuration and audit logs, with full administrative access.

RBAC requirement 1 as given: users log in securely and access only features permitted for their roles. Per EPIC-001: five fixed roles, a user may hold several roles (permissions are a union), and access is also scoped by relationship.

**Related:** US-002, US-003, US-004, US-012, US-013, US-014, US-022, US-029, US-031, US-007

- ⚠ The project description is truncated at 'RBAC requirement 2 (Employees can ...)'. The remaining RBAC requirements were not provided.
- ⚠ The description gives Reporting Managers 'monitor team availability' and 'team reports', HR Admins 'organization-wide HR reports', and Project Managers 'monitor project utilization'. EPIC-005 and EPIC-007 exclude attendance reports and manager dashboards from this scope.
- ⚠ The description says System Admin has 'full administrative access', 'permissions' and 'organization settings'. US-002 and EPIC-001 say admins assign roles but cannot toggle individual permissions or create custom roles. No story defines organisation settings or system configuration screens.
- ⚠ The description says Project Managers 'review project-specific timesheets'. No story defines a screen or workflow for this, beyond the visibility rule in AC-014.
- ⚠ The description lists notifications for approvals, but v3 delivers in-app alerts only.

### REQ-EPIC-001 · draft · source: requirements:EPIC-001

Secure sign-in, administrator-only account creation, five fixed roles combined as a union, and relationship-scoped access. It also covers session timeout, lockout, administrator-issued password reset (plus its API and UI follow-ups) and an immutable audit log.

Stories:
- US-001 [critical] Sign in with email and password (AC-001 to AC-004). Correct credentials lead to the home dashboard. A wrong password gives a generic 'email or password is incorrect' message that does not reveal whether the email exists. A deactivated account is refused with a 'contact an administrator' message. Only a salted one-way hash is stored, and plaintext appears nowhere, including logs.
- US-002 [critical] Administrator creates accounts (AC-005 to AC-009). A System Admin creates a user with an email, a linked employee record and one or more roles. There is no self-registration screen, and unauthenticated users are redirected to sign-in. A duplicate email is rejected. HR Admins cannot open user or role management. Creating, editing or deactivating an account is audit-logged.
- US-003 [high] Permissions are a union across roles (AC-010 to AC-012). Navigation shows the union of screens. An Employee-only user sees no admin screens, and direct URLs are refused. Removing a role takes effect on the next load.
- US-004 [critical] Access scoped by relationship (AC-013 to AC-016). A Reporting Manager sees only direct reports. A Project Manager sees only hours booked to their own projects. An Employee cannot access any record that is not their own. An HR Admin has organisation-wide people data but no access to accounts, roles or system configuration.
- US-005 [high] Session timeout and lockout (AC-017 to AC-020). An idle session expires. An account locks after the configured number of consecutive failed sign-ins, even if the password is then correct. A System Admin can unlock it, and the unlock is audit-logged. Sign-out invalidates the session, and the back button does not show protected pages.
- US-006 [high] Administrator-issued password reset (AC-021 to AC-024). No emailed reset links are built. The sign-in screen tells users to contact an administrator. A System Admin issues a one-time password, shown once, and the stored hash is replaced. The user must set a new password at next sign-in. The reset is audit-logged.
- US-007 [high] Immutable audit log (AC-025 to AC-028). It records approvals and rejections (actor, action, record, comment, timestamp) and HR edits, punch corrections and reopens (before/after values). No interface or API allows edit or delete, and attempts are refused. Only System Admins can read the log.
- US-041 [critical] Sign-in screen reads session_token (AC-142 to AC-144). SignIn.tsx stores `session_token` from the login response, with `token` then `access_token` as fallbacks. It never stores an empty string when `session_token` is present. A refused login stores no token and shows the generic message.
- US-042 [high] POST /api/auth/change-password (AC-145 to AC-149). It requires an authenticated session. It replaces the hash, clears must_change_password, and refuses a wrong current password or an invalid or empty new password. No password appears in responses or logs. An unauthenticated call is refused. The old password stops working. The change is audit-logged without any password or hash.
- US-043 [medium] Frontend sign-in test against the real login response shape (AC-150 to AC-152). The test fails if the field name differs, and it covers the refusal path.
- US-044 [high] POST /api/admin/users/{id}/reset-password (AC-153 to AC-158). System Admin only. It generates a random one-time password, replaces the hash, sets must_change_password=true, and returns the plaintext once. The plaintext is never stored or logged. The reset is audit-logged without secrets. Non-admins are refused (forbidden or unauthenticated). An unknown id returns not-found and writes no audit entry. Signing in with the one-time password succeeds and the account stays flagged must_change_password.
- US-045 [high] Users & roles 'Issue password reset' button calls the backend (AC-159 to AC-161). It shows the real returned password once, not a hard-coded mock value. The password is not shown after the dialog is reopened and is not kept in browser storage. An API error shows a clear message and no password.
- US-046 [medium] Automated tests for the reset flow (AC-162, AC-163). The backend test asserts the hash changed, the flag is set, the password is returned once, an audit entry exists and a non-admin is refused. The frontend test asserts the API is called and the returned password is displayed.

Assumptions listed for confirmation: application-managed email/password auth; administrator-issued resets instead of emailed links (a conflict with the confirmed understanding, because email was removed); fixed roles; SSO out of scope; employee data is personal data, encrypted in transit and at rest, with no special-category data; audit logging at a minimal level but firm.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-041, US-042, US-043, US-044, US-045, US-046

- ⚠ Conflict with the confirmed understanding: password reset by emailed link was assumed, but v3 delivers administrator-issued resets only. This needs confirmation.
- ⚠ Session timeout duration and the lockout failed-attempt threshold are only 'configured'. No values are given, and no configuration screen or owner is defined.
- ⚠ Lockout duration or auto-unlock is not stated. AC-019 implies a manual System Admin unlock only.
- ⚠ Whether the current password is required for the forced change after a one-time password is ambiguous (AC-145 and AC-146 vs AC-023). The one-time password flow implies it might be supplied.
- ⚠ The one-time password policy (length, complexity, expiry) and new-password rules are not defined.
- ⚠ US-041 to US-046 read as defect-fix or technical stories. Their link to originally reported failures is not recorded in the input.
- ⚠ The audit log's retention period and search/filter needs are not stated.
- ⚠ US-004 does not say whether a Project Manager who creates a project is automatically 'assigned' to it for visibility.

### REQ-EPIC-002 · draft · source: requirements:EPIC-002

Employee profiles with department and reporting manager. Employees edit permitted contact details, while HR Admins maintain records, departments and leavers, and Reporting Managers see their direct reports.

Stories:
- US-008 [high] View and update own profile (AC-029 to AC-031). 'My Profile' shows name, employee ID, department, reporting manager, work email and contact details. Employee-editable fields such as mobile number can be saved, and the change is audit-logged. Department, reporting manager and employee ID are read-only, and direct update requests are refused.
- US-009 [critical] HR Admin maintains employee records (AC-032 to AC-035). Create with name, employee ID, work email, department, reporting manager and start date. Missing mandatory fields (department, reporting manager) block the save and are flagged. Changing the reporting manager moves the employee between team lists. Every field edit is audit-logged with old and new values, actor and timestamp.
- US-010 [medium] HR Admin corrects or erases a leaver's record (AC-036 to AC-038). Marking a leaver (with an end date) removes them from active lists and pickers and deactivates their account. Erasure irreversibly removes identifying fields, while the audit log retains who erased and when. Non-HR users are refused.
- US-011 [medium] HR Admin maintains departments (AC-039 to AC-041). Add a department and it becomes selectable. Deletion is refused when employees are assigned, naming the count. There is one shared list with no per-country or per-entity variants.
- US-012 [high] Manager views direct reports (AC-042, AC-043). 'My Team' lists exactly the direct reports with department and current leave/timesheet status. Other employees are not listed or reachable.

Assumptions: data is personal data with role/relationship-restricted access and HR correction or erasure for leavers; the split of employee-editable versus HR-only fields (contact details editable, employment data HR-only) is assumed; bulk import of employees, departments and opening balances is NOT in scope, so records are created one at a time in-portal; document storage is out of scope.

**Related:** US-008, US-009, US-010, US-011, US-012

- ⚠ Which profile fields are employee-editable versus HR-only is assumed and needs confirmation.
- ⚠ Bulk import was assumed in the confirmed understanding but is excluded. Creating several hundred records manually at launch is flagged as onerous and needs confirmation.
- ⚠ The full profile field list is not defined beyond the fields named in the acceptance criteria.
- ⚠ Conflict risk: erasure removes personal fields, yet the audit log retains before/after values of edits (AC-026, AC-035), which may contain personal data. How erasure treats existing audit entries is not specified.
- ⚠ Whether an employee record can exist without a linked user account, and whether a reporting manager must also be an active employee, are not stated.
- ⚠ Reporting-line rules such as a top-level employee with no manager are not defined here, although AC-116 assumes some managers have none. This sits against AC-033, which makes reporting manager mandatory.
- ⚠ Who can see a leaver's history after the end date is not stated.
- ⚠ 'Current leave/timesheet status' on My Team is not defined further.

### REQ-EPIC-003 · draft · source: requirements:EPIC-003

Project records and employee assignments. Assignments determine what an employee can book hours against and what a Project Manager can see.

Stories:
- US-013 [high] Create and manage project records (AC-044 to AC-046). A Project Manager creates a project with name, code, start date and status 'active', and it becomes available for assignment. A Project Manager sees only their assigned projects, and opening another by ID is refused. Closing a project removes it from timesheet pickers while historic hours stay visible on submitted timesheets.
- US-014 [high] Assign employees to projects (AC-047 to AC-049). Assign with an optional allocated-hours figure, and the project then appears in that employee's picker. Unassigning removes it from the picker for new entries while recorded hours are retained. Assigning to a project the user does not manage is refused.
- US-015 [medium] Employee sees own assignments (AC-050, AC-051). 'My Projects' lists name, code and status of assigned projects. If there are none, an empty-state message says a Project Manager must assign the employee first.

Assumptions: Project Managers see only projects they are assigned to; allocated hours are captured so allocated-vs-actual can be compared later, but the reporting dashboards are not in this scope.

**Related:** US-013, US-014, US-015

- ⚠ How a Project Manager becomes 'assigned' to a project (including the creator) is not stated.
- ⚠ The project end date and the full list of statuses beyond 'active' and 'closed' are not defined.
- ⚠ Whether an assignment has start/end dates is not stated, only an optional allocated-hours figure.
- ⚠ No allocated-vs-actual view exists in this scope, so allocated hours have no visible use yet.
- ⚠ Whether an employee already on leave or marked as a leaver can be assigned is not stated, beyond leavers being removed from assignment pickers (AC-036).

### REQ-EPIC-004 · draft · source: requirements:EPIC-004

Daily and weekly timesheet entry against assigned active projects, submission, on-screen status (Draft, Submitted, Approved, Rejected) and correction/resubmission of rejected timesheets.

Stories:
- US-016 [critical] Log daily hours (AC-052 to AC-055). Entries are saved as drafts against a date. The picker lists only active, currently assigned projects. A day's total above 24 hours is rejected with a message stating the maximum. Negative or non-numeric values are rejected and flagged.
- US-017 [high] Weekly grid (AC-056 to AC-058). Projects are rows and days are columns, with row, column and week totals. Saved values persist after reload. The previous/next week navigation shows that week's entries and status.
- US-018 [critical] Submit and track status (AC-059 to AC-062). Submitting a draft with at least one entry sets it to 'Submitted', makes entries read-only, and adds it to the reporting manager's pending list. An empty timesheet cannot be submitted. The timesheet list shows Draft, Submitted, Approved or Rejected with decision date and manager comment. A Submitted timesheet cannot be edited until the manager rejects it or an HR Admin reopens it.
- US-019 [high] Correct and resubmit a rejected timesheet (AC-063 to AC-065). A rejected timesheet shows the manager's comment and is editable again. Resubmission returns it to Submitted and to the manager's pending list. History lists the rejection with its comment and the resubmission, in order, with timestamps.

Assumptions: the timesheet period is a calendar week, with hours entered per day per project; validation limits such as 24 hours/day are assumed; timesheet hours (project effort) are deliberately separate from attendance punches and not reconciled automatically; CSV/Excel payroll export is not in scope.

**Related:** US-016, US-017, US-018, US-019

- ⚠ Validation limits (e.g. 24 hours/day maximum) are assumed and need confirmation.
- ⚠ The 24-hour limit is stated per day across all projects (AC-054). The 8-hour example in that criterion is not a limit.
- ⚠ Whether hours entered on days of approved leave, weekends or holidays are blocked or warned is not specified.
- ⚠ Whether one timesheet covers all projects for a week, or whether a partial-week or cross-month period is possible, is not stated.
- ⚠ Whether hours can be entered in decimals other than 0.5 steps (e.g. 7.5 is shown in AC-052) is not defined.
- ⚠ No reconciliation between timesheet hours and attendance by design. This is flagged for confirmation.
- ⚠ Payroll export was assumed in the confirmed understanding but is excluded. This needs confirmation.
- ⚠ How far back or forward a timesheet can be entered is not stated.

### REQ-EPIC-005 · draft · source: requirements:EPIC-005

A distinct attendance module with browser clock-in/clock-out stamped by the server clock. Employees can view their own history and HR Admins correct missed punches. There is no geofencing and no attendance reports.

Stories:
- US-020 [critical] Clock in and out (AC-066 to AC-070). Clock in creates today's record with an arrival time from the server clock. Clock out records the departure time and shows the worked duration. After clocking in, the Clock in action is unavailable and the arrival time is shown. The server time is stored even if the device clock is wrong. Phone punches are accepted from any network or location with no location, geofence or device check.
- US-021 [high] View own attendance history (AC-071 to AC-073). 'My Attendance' lists each day with arrival, departure and worked duration. A clock-in without clock-out is flagged as an incomplete punch with no duration. An Employee cannot request others' attendance.
- US-022 [high] HR Admin views and corrects punches (AC-074 to AC-077). Opening a date lists all employees' arrival and departure times with incomplete punches flagged. HR sets a departure time with a reason. The record is marked 'regularised' and the duration recalculated. The correction is audit-logged with original value, corrected value, reason and timestamp. Reporting Managers and Employees without the HR Admin role are refused.

Assumptions: one clock-in and one clock-out per calendar day, with no mid-day breaks punched; biometric and badge/RFID are out of scope; attendance reports (late arrivals, early departures, absent days, hours per period) are not in this scope.

**Related:** US-020, US-021, US-022

- ⚠ HR Admins can set a departure time for an incomplete punch (AC-075). Correcting a missed clock-in, or creating a record for a day with no punches, is not explicitly covered.
- ⚠ The one-punch-per-day assumption needs confirmation. How shifts crossing midnight are handled is not stated.
- ⚠ The company timezone is not named, and day boundaries for 'today' depend on it.
- ⚠ Reporting Managers have no attendance view of their team in any story, although the role table mentions team availability.
- ⚠ Attendance reports (late, early, absent, hours per period) are excluded. This needs confirmation.
- ⚠ Whether a forgotten clock-out auto-closes at end of day is not stated.

### REQ-EPIC-006 · draft · source: requirements:EPIC-006

Leave requests by type and date range with half-day support. Requests are validated against weekends, holidays and balance. Employees get balances, history and the holiday calendar, and HR Admins configure leave types, balances and holidays.

Stories:
- US-023 [critical] Apply for leave (AC-078 to AC-081). A request with sufficient balance is created as 'Submitted', shows the deducted day count, and appears in the manager's pending list. An end date earlier than the start date is refused. A request overlapping an approved or submitted one is refused, naming the overlap. Only active leave types are offered.
- US-024 [high] Half-day (AC-082 to AC-084). A single day can be a half-day, first half or second half, counting 0.5 days. No smaller increment is offered. Approval deducts exactly 0.5 days.
- US-025 [high] Validation against weekends, holidays and balance (AC-085 to AC-088). Weekend days and holiday-calendar dates are excluded from the deducted total and shown as non-working in the breakdown. A request over the available balance is refused, stating the balance and shortfall. An HR Admin may apply an override, the negative balance is shown, and the override is audit-logged.
- US-026 [critical] View balances (AC-089 to AC-091). Per leave type: entitlement, taken, remaining (e.g. 20 / 5 / 15). Submitted requests show separately as pending and are not yet deducted. On approval, days move from pending to taken.
- US-027 [high] Leave history (AC-092 to AC-094). Lists type, dates, day count, status and decision date, most recent first. A rejected request shows the manager's comment and timestamp. The list can be filtered by leave type and status.
- US-028 [medium] Holiday calendar (AC-095 to AC-097). Lists date, weekday and name. A single shared calendar with no country or region selector. A year selector shows other years that exist.
- US-029 [critical] HR Admin configures (AC-098 to AC-102). Create a leave type with an annual entitlement and active flag. An unpaid type has no balance check. Setting or adjusting an opening balance is audit-logged with old and new values. Holiday add, edit and remove take effect for future calculations and are audit-logged. Reporting Managers without HR Admin are refused.

Assumptions: balances deduct on approval; half-day is the smallest increment; requests beyond balance are blocked unless an HR Admin overrides; entitlement is an annual figure per employee, with no automated accrual or carry-over; one shared holiday calendar and policy set for one country and timezone; no medical certificates or health detail for sickness leave.

**Related:** US-023, US-024, US-025, US-026, US-027, US-028, US-029

- ⚠ Accrual and carry-over were assumed in the confirmed understanding but are excluded. This needs confirmation, and year-end balance treatment is not defined.
- ⚠ How the 'pending' amount is held against the balance for the shortfall check on a second request is not stated.
- ⚠ How an HR override is applied (before or after submission, and by whom initiating it) is ambiguous in AC-088.
- ⚠ No story lets an employee cancel or withdraw a submitted or approved leave request.
- ⚠ A leave request rejected by a manager 'returns as an editable draft' (AC-111), but no leave edit/resubmit story or criterion exists, unlike US-019 for timesheets.
- ⚠ The working-week definition (Saturday and Sunday as weekends) is assumed, not stated.
- ⚠ Entitlement per employee versus per leave type: how HR sets individual entitlements (the annual figure per employee) is not fully specified beyond opening balances (AC-100).
- ⚠ A multi-day range with a half-day at the start or end is not addressed, only a single-day half-day (AC-082).
- ⚠ The deletion or deactivation of holidays and leave types already in use is not addressed.

### REQ-EPIC-007 · draft · source: requirements:EPIC-007

Single-step approval by the Reporting Manager for timesheets and leave. A rejection comment is mandatory, there is no self-approval, and HR Admins can reopen approved items. Notifications are in-app only.

Stories:
- US-030 [critical] Pending list (AC-103 to AC-105). One list of direct reports' submitted timesheets and leave requests, showing employee, item type, period/dates and submission date. Other employees' items are not listed and cannot be opened by URL. A timesheet detail is read-only with approve and reject actions.
- US-031 [critical] Approve (AC-106 to AC-109). A timesheet becomes Approved, locked and leaves the pending list. A leave request becomes Approved and the days are deducted from the balance. The employee gets an in-app alert, and the item shows the approver and decision timestamp. The approval is audit-logged.
- US-032 [critical] Reject with mandatory comment (AC-110 to AC-113). Rejection without a comment is refused. After rejection the item becomes Rejected, returns as an editable draft and leaves the pending list. A rejected leave request deducts no days. The employee gets an in-app alert, and the comment is visible on the item.
- US-033 [high] No self-approval (AC-114 to AC-117). A multi-role user's own submission is not in their own pending list, and a direct approve attempt is refused. It is routed to the next manager up the reporting line, or to the HR Admin queue if there is none. The escalation and the routed approver are audit-logged.
- US-034 [medium] HR Admin reopens an approved item (AC-118 to AC-121). A reopened timesheet returns to Draft, is editable and no longer counts as approved. A reopened leave request returns the deducted days. The reversal is audit-logged with reason and previous status. Managers without HR Admin are refused.
- US-035 [medium] In-app alerts (AC-122 to AC-125). Managers get an alert and a pending-count indicator. Employees get decision alerts stating item, outcome and comment. Opening an alert marks it read and lowers the unread count. No email or SMS is sent.

Assumptions (flagged as the most important to check): approval is single-step with no multi-level chains; approved items lock and can only be reopened by an HR Admin; self-approval escalates up the reporting line or to HR; notifications are in-app only (a conflict with the confirmed understanding, which assumed email plus in-app alerts); there are no manager dashboards or reports, only a pending list.

**Related:** US-030, US-031, US-032, US-033, US-034, US-035

- ⚠ Conflict with the confirmed understanding: transactional email notifications and pending-approval reminder emails are removed. This needs confirmation.
- ⚠ Single-step approval and no self-approval escalation rules are flagged for confirmation.
- ⚠ The 'HR Admin queue' (AC-116) is not defined: no story gives HR Admins an approvals list or approval permission for submissions routed to them.
- ⚠ AC-115 describes the manager's own reporting manager; the behaviour when that manager is on leave or deactivated is not defined.
- ⚠ Whether the escalated approver sees the item in the same pending list (US-030) is implied but not stated.
- ⚠ Reopened leave: the resulting status of the leave request is not specified (AC-119 only returns days).
- ⚠ No bulk approve action and no delegation or out-of-office approver are described.
- ⚠ Whether alerts persist indefinitely or are cleared is not stated.

### REQ-EPIC-008 · draft · source: requirements:EPIC-008

A home dashboard for the signed-in employee covering timesheet, attendance and leave. Screens are mobile-responsive and the interface is single-language with one date/time format and timezone.

Stories:
- US-036 [high] Home dashboard (AC-126 to AC-129). Shows current timesheet status, today's clock-in state, remaining leave balances and pending leave requests. A draft timesheet shows a prompt with a direct link to complete and submit it. A 'Clock in' action is available if not yet clocked in. A user who is also a Reporting Manager sees a count of items awaiting their approval.
- US-037 [high] Phone browser use (AC-130 to AC-133). At a 360px viewport the dashboard, clock-in, leave request and timesheet screens have no horizontal scrolling or overlap. Clock-in and submit-leave controls are tap-sized and work. The weekly timesheet grid uses a mobile-appropriate layout. No native app is offered and there is no offline clock-in.
- US-038 [low] Single language and consistent date/time (AC-134, AC-135). No language selector. All timestamps display in the company's single timezone in one consistent format.

Assumptions: single-language English / the local language; browser-based mobile responsiveness only; dates and times in the company's single timezone.

**Related:** US-036, US-037, US-038

- ⚠ The company timezone and the date/time display format are not specified.
- ⚠ The dashboard content for users with other roles (HR Admin, Project Manager, System Admin) is not defined, apart from the manager approval count.
- ⚠ Supported browsers and their minimum versions are not stated.
- ⚠ Accessibility requirements are not stated.

### REQ-EPIC-009 · draft · source: requirements:EPIC-009

In-portal Help pages for employees and administrators, in one language, covering only the capabilities built in this version. The administrator section also states the launch setup order.

Stories:
- US-039 [medium] Employee guide (AC-136 to AC-138). 'Help' covers signing in, the dashboard, timesheets, clocking in/out, leave, half-day leave, balances, history and the holiday calendar. Task look-ups such as 'correct a rejected timesheet' give step-by-step instructions matching the built screens. The guide is readable on a phone without horizontal scrolling.
- US-040 [medium] Administrator guide (AC-139 to AC-141). Covers creating accounts and assigning roles, maintaining employees and departments, projects and assignments, leave types and holidays, balances, correcting punches, approving and reopening items, and the audit log. A launch-setup section states the order: departments, leave types and holidays, employees and reporting lines, accounts and roles, then projects and assignments. An Employee-only user sees only the employee section.

Assumptions: delivered as in-portal help pages in the single configured language; covers this version's capabilities only; no video or interactive training.

**Related:** US-039, US-040

- ⚠ The guide covers 'the capabilities built in this version', so its content depends on what is actually built.
- ⚠ The launch-setup order puts employees before accounts, but accounts require a linked employee record (AC-005). The order is consistent with that. The order places leave types and holidays before employees, yet balances need employees, so where opening-balance setup falls is not stated.
- ⚠ Who maintains the guide content after release is not stated.
- ⚠ The administrator section's visibility for each administrative role (HR Admin, Project Manager, System Admin) is not distinguished beyond 'administrative role'.
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v3  
**Delivery scope:** lightweight  
**Approved:** 2026-11-04

**Capabilities in scope:** Employee sign-in with email and password, Employee profile records with department and reporting manager, Project records and employee-to-project assignments, Daily and weekly timesheet entry against assigned projects, Timesheet submission with on-screen status, Browser clock-in and clock-out of arrival and departure times, Leave request submission by leave type and date range, Personal leave balance and leave history view, Company holiday calendar view, Employee home dashboard for own timesheet, attendance and leave, Mobile-responsive screens usable on a phone browser, Portal user guide for employees and administrators, Accounts created by an administrator — no public self-registration, Clock-in from any browser, with no geofencing or location check, Punch times stamped by the server clock, Single-language interface in English / the local language, Half-day as the smallest leave increment

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | This changes the Node/TypeScript assumption the analyst recorded — Node is not something this platform can build with, and FastAPI (Python) is the closest equivalent available. Nothing you said argues against it: the hard work here is rules, not raw throughput — relationship-scoped permissions, the self-approval escalation up the reporting line, leave accrual and carry-over maths, and CSV/Excel import and export. Python is especially strong at spreadsheet handling and date arithmetic, and tens of users at week-end peaks is well within FastAPI's reach. |
| cloud | AWS | You asked for one managed region inside the company's own country with daily automated backups, and AWS has the widest spread of in-country regions, so the data-residency promise to your staff is simple to keep. It also supplies what this portal needs out of the box: managed PostgreSQL with daily snapshots and point-in-time restore, encryption at rest, and Amazon SES close at hand if you ever prefer it to SendGrid for the approval emails. |
| database | PostgreSQL | Exactly as assumed, and the right call: this is the company's system of record for people, hours, attendance and leave balances. It is all tightly related data — employees to managers to projects to timesheet lines — and a balance must never be double-deducted when an approval and an HR correction land at once. PostgreSQL enforces those relationships, keeps the immutable audit log append-only and searchable, and 500 employees' punches and timesheets is a light load for it. |
| frontend | React | This is what the stack assumption already named, and it fits: one responsive interface that has to work both on a desk machine for HR Admins doing bulk imports and corrections, and on a phone browser for an employee tapping clock-in at the office door. React handles the interactive parts of this product well — timesheet grids, leave calendars, approval queues with filters — and the five-role interface can be built from one shared set of screens that show or hide sections depending on which roles a person holds. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Secure Access, Accounts and Role-Based Permissions

Email-and-password sign-in to the portal, with accounts created only by an administrator. Five fixed roles (Employee, Reporting Manager, HR Admin, Project Manager, System Admin) with predefined permission sets; a user may hold several roles and permissions combine as a union. Access is scoped by relationship as well as role.

OPEN ASSUMPTIONS TO CONFIRM:
- Authentication is email and password managed by the application: hashed passwords, session timeout, and account lockout after repeated failed attempts. There is no public self-registration.
- CONFLICT WITH CONFIRMED UNDERSTANDING: the understanding assumed password reset by emailed link, but transactional email (SendGrid/SES) has been removed from the chosen scope. This version therefore delivers administrator-issued password resets instead of self-service emailed reset links. This needs confirmation.
- The five roles are fixed with predefined permission sets. System Admins assign and combine roles per user; they do not create custom roles or toggle individual permission flags.
- Company SSO (Google Workspace / Microsoft 365 / Azure AD) is explicitly out of scope.
- Employee records are treated as personal data: access restricted by role and relationship, encryption in transit and at rest. No special-category data (health records, medical certificates, biometrics) is stored.
- Audit logging is included at a minimal level for this scope (approvals, rejections, record changes, administrative actions, attendance corrections) because the confirmed understanding records it as a firm requirement rather than an assumption.

### US-001: Sign in with email and password

**Priority:** critical

> As a portal user, I want to sign in with my work email address and password, so that I can reach my own timesheet, attendance and leave records securely.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I have an active account with email 'user@company.com' | I enter that email and the correct password on the sign-in screen and submit | I am authenticated and taken to my home dashboard |
| AC-002 | I have an active account | I submit the correct email with an incorrect password | sign-in is refused with a generic 'email or password is incorrect' message that does not reveal whether the email exists |
| AC-003 | my account has been deactivated by an administrator | I submit my correct email and password | sign-in is refused and I am told to contact an administrator |
| AC-004 | a password is stored for my account | an administrator or developer inspects the user record in the database | only a salted one-way hash is present and the plaintext password is nowhere in the record or in application logs |

### US-002: Administrator creates user accounts — no public self-registration

**Priority:** critical

> As a System Admin, I want to create portal accounts and assign one or more roles to each user, so that only authorised staff can access the portal and each person gets the permissions their job requires.

| ID | Given | When | Then |
|---|---|---|---|
| AC-005 | I am signed in as a System Admin | I create a user with an email address, a linked employee record and the roles 'Employee' and 'Reporting Manager' | the account is created in an active state and holds both roles |
| AC-006 | I am not signed in | I try to reach any account-creation or registration URL | no self-registration screen exists and I am redirected to the sign-in page |
| AC-007 | a user account already exists with email 'user@company.com' | I try to create a second account with the same email | creation is rejected with a message that the email is already in use |
| AC-008 | I am signed in as an HR Admin but not a System Admin | I attempt to open user account or role management | access is refused, because HR Admins manage people data but not security settings |
| AC-009 | I have created, edited or deactivated a user account | a System Admin opens the audit log | an entry records the actor, the action, the affected account and the server timestamp |

### US-003: Permissions combine as a union across multiple roles

**Priority:** high

> As a user who holds more than one role, I want my permissions to be the combined set of all roles I hold, so that I can act as both an employee and a manager without switching accounts.

| ID | Given | When | Then |
|---|---|---|---|
| AC-010 | I hold the roles 'Employee' and 'Project Manager' | I sign in | the navigation shows both my personal timesheet/leave/attendance screens and my project management screens |
| AC-011 | I hold only the role 'Employee' | I sign in | no project management, HR administration or system administration screens are shown, and direct navigation to their URLs is refused |
| AC-012 | a System Admin removes the 'Project Manager' role from my account | I next load the portal | project management screens are no longer available to me |

### US-004: Access scoped by relationship, not only by role

**Priority:** critical

> As a the company, I want managers, project managers and employees to see only the records their relationship entitles them to, so that personal data is not exposed beyond the people responsible for it.

| ID | Given | When | Then |
|---|---|---|---|
| AC-013 | I am a Reporting Manager with two direct reports | I open my team list | only those two direct reports are listed, and requesting another employee's record by ID returns an authorisation error |
| AC-014 | I am a Project Manager assigned to Project A only | I open project timesheet data | only hours booked to Project A are visible and Project B data is not returned |
| AC-015 | I am an Employee with no other role | I request any timesheet, attendance or leave record that is not my own | the request is refused with an authorisation error and no record data is returned |
| AC-016 | I am an HR Admin | I open employee records | I can view and maintain people data across the organisation but cannot open user accounts, roles or system configuration |

### US-005: Session timeout and account lockout

**Priority:** high

> As a System Admin, I want idle sessions to expire and accounts to lock after repeated failed sign-in attempts, so that an unattended or attacked account cannot be used to reach employee data.

| ID | Given | When | Then |
|---|---|---|---|
| AC-017 | I am signed in and have been inactive for longer than the configured session timeout | I next interact with the portal | my session is ended and I am returned to the sign-in screen |
| AC-018 | an account has had the configured number of consecutive failed sign-in attempts | a further sign-in is attempted with that email | the account is locked and sign-in is refused even if the password is correct |
| AC-019 | an account is locked | a System Admin unlocks it | the user can sign in again with their existing password and the unlock is written to the audit log |
| AC-020 | I am signed in | I choose 'sign out' | my session is invalidated and pressing the browser back button does not show protected pages |

### US-006: Administrator-issued password reset

**Priority:** high

> As a user who has forgotten my password, I want an administrator to be able to issue me a new password, so that I can regain access without a self-service email link.

| ID | Given | When | Then |
|---|---|---|---|
| AC-021 | ASSUMPTION — transactional email is out of scope for this version, so emailed self-service reset links are not built | a user cannot sign in | the only reset path offered in the portal is an administrator-issued reset, and the sign-in screen tells the user to contact an administrator |
| AC-022 | I am a System Admin | I issue a password reset for a user account | a one-time password is generated and displayed to me once for secure hand-off, and the stored password hash is replaced |
| AC-023 | my password has been reset by an administrator | I sign in with the one-time password | I am required to set a new password before I can reach any other screen |
| AC-024 | an administrator has issued a password reset | a System Admin opens the audit log | the reset is recorded with the acting administrator, the affected account and the timestamp |

### US-007: Immutable audit log of approvals, changes and admin actions

**Priority:** high

> As a System Admin, I want every approval, rejection, record change and administrative action written to a log I can read but nobody can alter, so that the company can account for who changed people, time and leave data.

| ID | Given | When | Then |
|---|---|---|---|
| AC-025 | a manager approves or rejects a timesheet or leave request | I open the audit log | an entry records the actor, the action, the affected record, any comment and the server timestamp |
| AC-026 | an HR Admin edits an employee record, corrects an attendance punch or reopens an approved item | I open the audit log | an entry records the actor, the affected record and the before and after values of the changed fields |
| AC-027 | audit entries exist | any user including a System Admin attempts to edit or delete an entry | no interface or API permits it and the attempt is itself refused |
| AC-028 | I am signed in with any role other than System Admin | I attempt to open the audit log | access is refused |

### US-041: Sign-in screen reads session_token from the login response

**Priority:** critical

> As a portal user, I want the Sign in button to log me in when I submit correct credentials, so that I can reach my home dashboard instead of being stuck on the sign-in screen.

| ID | Given | When | Then |
|---|---|---|---|
| AC-142 | I have an active account and the login API responds with the token in the field `session_token` | I enter my correct email and password on the sign-in screen and press Sign in | SignIn.tsx stores the value of `session_token` as the session token and I am taken to my home dashboard |
| AC-143 | the login response contains `session_token` | SignIn.tsx processes the response | the token is taken from `session_token` first, with `token` and then `access_token` accepted only as fallbacks, and an empty string is never stored when `session_token` is present |
| AC-144 | I submit a wrong password | the API refuses the sign-in | no session token is stored and the generic 'email or password is incorrect' message is still shown |

### US-042: Backend endpoint to change a password

**Priority:** high

> As a portal user, I want to set a new password through the portal, so that the 'Set a new password' step works, including after an administrator has issued me a one-time password.

| ID | Given | When | Then |
|---|---|---|---|
| AC-145 | I am signed in with a valid session and my account requires a password change | I POST a new password to /api/auth/change-password | the stored password is replaced by a new salted one-way hash, must_change_password is cleared, and I can reach other screens |
| AC-146 | I am signed in and my current password is required for the change | I POST a new password with an incorrect current password, or with an empty or invalid new password | the request is refused with a clear error, the stored hash is unchanged, and no password appears in the response or in application logs |
| AC-147 | I am not signed in | I POST to /api/auth/change-password | the request is refused as unauthenticated |
| AC-148 | I have changed my password | I sign out and sign in again with the new password | sign-in succeeds with the new password and is refused with the old one |
| AC-149 | I have changed my password | a System Admin opens the audit log | an entry records the password change with the actor, the affected account and the server timestamp, but no password or hash value |

### US-043: Frontend sign-in test using the real login response

**Priority:** medium

> As a developer, I want an automated frontend test that signs in using the real login API response shape, so that a mismatch between the API's response fields and the sign-in screen is caught before release.

| ID | Given | When | Then |
|---|---|---|---|
| AC-150 | a test fixture that matches the actual /api/auth/login success response, with the token in `session_token` | the SignIn component test submits valid credentials against that response | the test asserts the session token is set to the `session_token` value and the user is navigated to the dashboard |
| AC-151 | the sign-in screen reads a field name that differs from the real login response | the frontend test suite runs | the sign-in test fails |
| AC-152 | the login API returns a refusal response | the sign-in test submits the form | no token is stored and the generic error message is displayed |

### US-044: Backend endpoint to issue an administrator password reset

**Priority:** high

> As a System Admin, I want an API endpoint that resets a user's password to a random one-time password and returns it once, so that a new or locked-out user can be given working credentials without email.

| ID | Given | When | Then |
|---|---|---|---|
| AC-153 | I am signed in as a System Admin and an active user account exists | I POST to /api/admin/users/{id}/reset-password for that user | a random one-time password is generated, only its salted one-way hash replaces users.password_hash, users.must_change_password is set to true, and the plaintext password is returned once in the response |
| AC-154 | a reset has just been issued for a user | the same user's reset response is not repeated and I inspect the user record, the database and application logs | the plaintext one-time password is not stored or logged anywhere and cannot be retrieved again |
| AC-155 | a reset has been issued for a user | a System Admin opens the audit log | an entry records the acting administrator, the affected account, the action and the server timestamp, with no password or hash value |
| AC-156 | I am signed in as an HR Admin, another non-System-Admin role, or not signed in | I POST to /api/admin/users/{id}/reset-password | the request is refused as forbidden or unauthenticated, no password is changed and no password is returned |
| AC-157 | I am signed in as a System Admin | I POST to /api/admin/users/{id}/reset-password with an id that does not exist | the request is refused with a not-found error and nothing is written to the audit log |
| AC-158 | a new account has been created by a System Admin and then reset | the user signs in with the one-time password | sign-in succeeds and the account is flagged must_change_password |

### US-045: Users & roles 'Issue password reset' button calls the backend

**Priority:** high

> As a System Admin, I want the 'Issue password reset' button in Users & roles to call the reset endpoint and show me the real one-time password once, so that I can hand a working password to the user instead of a meaningless mock code.

| ID | Given | When | Then |
|---|---|---|---|
| AC-159 | I am a System Admin viewing a user in Users & roles | I press 'Issue password reset' | the screen calls POST /api/admin/users/{id}/reset-password and displays the one-time password returned by the API, not a value from a hard-coded list |
| AC-160 | the one-time password is displayed | I close or leave the dialog and reopen the user | the password is no longer shown and is not kept in browser storage |
| AC-161 | the reset API returns an error | I press 'Issue password reset' | a clear error message is shown and no password is displayed |

### US-046: Automated tests for the administrator password reset

**Priority:** medium

> As a developer, I want automated backend and frontend tests for the reset flow using the real API response shape, so that a mock or a mismatch between the reset API and the Users & roles screen is caught before release.

| ID | Given | When | Then |
|---|---|---|---|
| AC-162 | a test System Admin and a test user | the backend test calls the reset endpoint | it asserts the hash changed, must_change_password is true, the response contains the password once, an audit entry exists, and a non-admin caller is refused |
| AC-163 | a frontend fixture matching the real reset response | the Users & roles test presses 'Issue password reset' | it asserts the API is called and the returned password is displayed |

## EPIC-002: Employee Profiles, Departments and Reporting Lines

Employee profile records holding core people data, each belonging to a department and pointing at a reporting manager. Employees maintain permitted details on their own profile; HR Admins maintain the records and the organisation structure.

OPEN ASSUMPTIONS TO CONFIRM:
- Employee data is personal data: access is role- and relationship-restricted, and HR Admins can correct or erase a leaver's record. No special-category data is stored.
- Which profile fields an employee may edit themselves versus which are HR-only is assumed (contact details employee-editable; employment data HR-only) and needs confirmation.
- Bulk import of employees, departments and opening balances from CSV/Excel was assumed in the confirmed understanding, but is NOT part of the chosen Lightweight MVP capability set. For this version records are created in-portal one at a time. This needs confirmation, as creating several hundred records manually at launch is onerous.
- Employee document storage (contracts, payslips) is explicitly out of scope.

### US-008: View and update my own profile

**Priority:** high

> As a Employee, I want to see my profile and update my permitted personal details, so that the company holds accurate contact information for me.

| ID | Given | When | Then |
|---|---|---|---|
| AC-029 | I am signed in as an Employee | I open 'My Profile' | my name, employee ID, department, reporting manager, work email and contact details are displayed |
| AC-030 | I am viewing my own profile | I change an employee-editable field such as my mobile number and save | the change is stored, confirmed on screen and written to the audit log |
| AC-031 | I am viewing my own profile | I attempt to change my department, reporting manager or employee ID | those fields are read-only and any direct update request is refused |

### US-009: HR Admin maintains employee records

**Priority:** critical

> As a HR Admin, I want to create and edit employee records including department and reporting manager, so that the portal is an accurate system of record for the workforce.

| ID | Given | When | Then |
|---|---|---|---|
| AC-032 | I am an HR Admin | I create an employee record with name, employee ID, work email, department, reporting manager and start date | the record is saved and appears in the employee directory |
| AC-033 | I am creating an employee record | I omit a mandatory field such as department or reporting manager | the record is not saved and the missing fields are flagged on screen |
| AC-034 | an employee record exists | I change its reporting manager | the employee moves to the new manager's team list and disappears from the previous manager's team list |
| AC-035 | I edit any employee record field | a System Admin reviews the audit log | the change is recorded with the field, old value, new value, actor and timestamp |

### US-010: HR Admin corrects or erases a leaver's record

**Priority:** medium

> As a HR Admin, I want to mark an employee as a leaver and to correct or erase their personal data on request, so that the company meets its personal-data obligations.

| ID | Given | When | Then |
|---|---|---|---|
| AC-036 | an employee has left the company | I mark the record as a leaver with an end date | the employee no longer appears in active team lists or assignment pickers, and their linked portal account is deactivated |
| AC-037 | a leaver has asked for their personal data to be erased | I perform an erasure on the record | identifying personal fields are irreversibly removed while the audit log retains the record of who performed the erasure and when |
| AC-038 | I am not an HR Admin | I attempt to mark a leaver or erase a record | the action is refused |

### US-011: HR Admin maintains departments

**Priority:** medium

> As a HR Admin, I want to maintain the single list of company departments, so that every employee can be placed in the correct part of the organisation.

| ID | Given | When | Then |
|---|---|---|---|
| AC-039 | I am an HR Admin | I add a department with a name | it becomes selectable on employee records |
| AC-040 | a department has employees assigned to it | I attempt to delete it | deletion is refused with a message naming the number of employees still assigned |
| AC-041 | the company operates in a single country with one organisation structure | I maintain departments | there is one shared department list with no per-country or per-entity variants |

### US-012: Manager views their direct reports

**Priority:** high

> As a Reporting Manager, I want to see the list of employees who report to me, so that I know whose timesheets, attendance and leave I am responsible for.

| ID | Given | When | Then |
|---|---|---|---|
| AC-042 | three employees have me set as their reporting manager | I open 'My Team' | exactly those three employees are listed with their department and current leave/timesheet status |
| AC-043 | an employee does not report to me | I open 'My Team' | that employee is not listed and their profile is not reachable from my screens |

## EPIC-003: Projects and Employee Assignments

Project records and the assignment of employees to projects, which determines what an employee may book hours against and what a Project Manager may see.

OPEN ASSUMPTIONS TO CONFIRM:
- Project Managers see only the projects they are assigned to.
- Allocated hours per assignment are captured so that allocated-versus-actual comparison is possible later; the reporting dashboards themselves are not part of this Lightweight MVP scope.

### US-013: Create and manage project records

**Priority:** high

> As a Project Manager, I want to create and maintain project records, so that employees have accurate projects to book their hours against.

| ID | Given | When | Then |
|---|---|---|---|
| AC-044 | I am a Project Manager | I create a project with a name, code, start date and status 'active' | the project is saved and becomes available for employee assignment |
| AC-045 | I am a Project Manager assigned to Project A only | I open the project list | only Project A is shown and attempting to open Project B by ID is refused |
| AC-046 | a project has hours booked against it | I set its status to 'closed' | it no longer appears in timesheet project pickers while the historic hours remain visible on submitted timesheets |

### US-014: Assign employees to projects

**Priority:** high

> As a Project Manager, I want to assign and unassign employees on my projects, so that only the right people can book time to a project.

| ID | Given | When | Then |
|---|---|---|---|
| AC-047 | I manage an active project | I assign an employee to it with an optional allocated hours figure | the assignment is saved and the project appears in that employee's timesheet project picker |
| AC-048 | an employee is assigned to my project | I remove the assignment | the project no longer appears in their picker for new entries, while hours already recorded are retained |
| AC-049 | I attempt to assign an employee to a project I do not manage | I submit the assignment | the action is refused with an authorisation error |

### US-015: Employee sees their own project assignments

**Priority:** medium

> As a Employee, I want to see which projects I am assigned to, so that I know where my hours should be booked.

| ID | Given | When | Then |
|---|---|---|---|
| AC-050 | I am assigned to two active projects | I open 'My Projects' | both projects are listed with name, code and status |
| AC-051 | I am assigned to no projects | I open 'My Projects' | an empty-state message explains that a Project Manager must assign me before I can log project hours |

## EPIC-004: Timesheet Entry and Submission

Daily and weekly entry of working hours against assigned projects, submission for approval, and on-screen status tracking.

OPEN ASSUMPTIONS TO CONFIRM:
- The timesheet period is a calendar week; hours are entered per day per project.
- Validation limits (for example a maximum of 24 hours per day) are assumed and need confirmation.
- Timesheet hours are project effort and are deliberately separate from attendance clock-in/clock-out times; the two are not reconciled automatically in this version.
- CSV/Excel export of approved timesheet data for payroll was assumed in the confirmed understanding but is not part of the chosen Lightweight MVP capability set.

### US-016: Log daily hours against assigned projects

**Priority:** critical

> As a Employee, I want to enter the hours I worked each day against the projects I am assigned to, so that my project effort is recorded accurately.

| ID | Given | When | Then |
|---|---|---|---|
| AC-052 | I am assigned to Project A | I enter 7.5 hours against Project A for today and save | the entry is stored as a draft and shown against that date |
| AC-053 | I am entering hours | I open the project picker | only active projects I am currently assigned to are listed |
| AC-054 | I have already entered 8 hours on one project for a day | I add a further entry that takes the day's total above 24 hours | the entry is rejected with a message stating the daily maximum |
| AC-055 | I enter a negative or non-numeric value in an hours field | I save | the entry is rejected and the invalid field is flagged |

### US-017: Enter and review a weekly timesheet

**Priority:** high

> As a Employee, I want to see and fill in my whole week on one grid of projects by days, so that I can complete my timesheet quickly at the end of the week.

| ID | Given | When | Then |
|---|---|---|---|
| AC-056 | I open my timesheet for a given week | the grid loads | each assigned project appears as a row, each day of the week as a column, and row, column and week totals are calculated |
| AC-057 | I am viewing a weekly timesheet | I change hours in any cell and save | the totals recalculate and the saved values persist after I reload the page |
| AC-058 | I am viewing a weekly timesheet | I navigate to the previous or next week | that week's entries and status are displayed |

### US-018: Submit a timesheet and track its status on screen

**Priority:** critical

> As a Employee, I want to submit my completed timesheet and see its approval status, so that I know whether it is still with my manager or has been decided.

| ID | Given | When | Then |
|---|---|---|---|
| AC-059 | my weekly timesheet is in draft with at least one hours entry | I submit it | its status changes to 'Submitted', the entries become read-only, and it appears in my reporting manager's pending list |
| AC-060 | my weekly timesheet has no hours entered | I attempt to submit it | submission is refused with a message that at least one entry is required |
| AC-061 | a timesheet has been submitted, approved or rejected | I open my timesheet list | each period shows its current status of Draft, Submitted, Approved or Rejected together with the decision date and any manager comment |
| AC-062 | a timesheet has status 'Submitted' | I try to edit a cell | editing is blocked until the manager rejects it or an HR Admin reopens it |

### US-019: Correct and resubmit a rejected timesheet

**Priority:** high

> As a Employee, I want a rejected timesheet to come back to me as an editable draft, so that I can fix what my manager flagged and submit it again.

| ID | Given | When | Then |
|---|---|---|---|
| AC-063 | my manager has rejected my timesheet with a comment | I open it | its status is 'Rejected', the manager's comment is displayed, and the entries are editable again |
| AC-064 | I have corrected a rejected timesheet | I submit it again | its status returns to 'Submitted' and it reappears in my manager's pending list |
| AC-065 | a timesheet has been rejected and resubmitted | I view its history | both the rejection with its comment and the resubmission are listed in order with timestamps |

## EPIC-005: Attendance Clock-In and Clock-Out

A distinct attendance module, separate from timesheets: employees record their actual arrival and departure each day through the responsive web portal, timestamped by the server clock.

OPEN ASSUMPTIONS TO CONFIRM:
- Clock-in and clock-out happen in the browser, including a phone browser, and are timestamped by the server clock rather than the device clock. There is no geofencing or location check on punches.
- Biometric clock-in and physical badge/RFID terminals are explicitly out of scope.
- One clock-in and one clock-out per calendar day is assumed; mid-day breaks are not punched.
- HR correction of missed punches (regularisation) is included at a minimal level because missed punches are operationally certain; the attendance reports described in the confirmed understanding (late arrivals, early departures, absent days, hours per period) are NOT part of this Lightweight MVP scope.

### US-020: Clock in and clock out from any browser

**Priority:** critical

> As a Employee, I want to clock in when I arrive and clock out when I leave, from a desktop or phone browser, so that my actual working day is recorded.

| ID | Given | When | Then |
|---|---|---|---|
| AC-066 | I have not yet clocked in today | I press 'Clock in' | an attendance record is created for today with an arrival time set from the server clock and the screen shows me as clocked in |
| AC-067 | I am clocked in today | I press 'Clock out' | the departure time is recorded from the server clock and the worked duration for the day is displayed |
| AC-068 | I have already clocked in today | I view the attendance screen | the 'Clock in' action is unavailable and my recorded arrival time is shown instead |
| AC-069 | my device clock is set to an incorrect time | I clock in | the stored arrival time is the server time, not the device time |
| AC-070 | I am using a phone browser from any network or location | I clock in | the punch is accepted with no location, geofence or device check applied |

### US-021: View my own attendance history

**Priority:** high

> As a Employee, I want to see my recorded arrival and departure times for recent days, so that I can check my attendance and spot a missed punch.

| ID | Given | When | Then |
|---|---|---|---|
| AC-071 | I have attendance records for the current month | I open 'My Attendance' | each day is listed with arrival time, departure time and worked duration |
| AC-072 | I clocked in on a day but never clocked out | I view that day | it is flagged as an incomplete punch with no worked duration calculated |
| AC-073 | I am an Employee with no other role | I request another employee's attendance records | the request is refused |

### US-022: HR Admin views and corrects attendance punches

**Priority:** high

> As a HR Admin, I want to view daily attendance and correct or regularise missed punches, so that attendance data is accurate despite forgotten clock-ins and clock-outs.

| ID | Given | When | Then |
|---|---|---|---|
| AC-074 | I am an HR Admin | I open the attendance screen for a given date | all employees' arrival and departure times for that date are listed, with incomplete punches flagged |
| AC-075 | an employee has an incomplete punch | I set a departure time and save the correction with a reason | the record is updated, marked as regularised, and the worked duration is recalculated |
| AC-076 | I have corrected an attendance record | a System Admin opens the audit log | an entry records me as the actor with the original value, the corrected value, the reason and the timestamp |
| AC-077 | I am a Reporting Manager or Employee without the HR Admin role | I attempt to edit an attendance punch | the action is refused |

## EPIC-006: Leave Requests, Balances and Holiday Calendar

Employees apply for leave by leave type and date range, see their balances and history, and view the shared company holiday calendar. HR Admins configure leave types and set balances.

OPEN ASSUMPTIONS TO CONFIRM:
- Leave types (annual, sick, unpaid, etc.) each carry an annual entitlement. Balances deduct on approval, support half-days as the smallest increment, validate against weekends and the holiday calendar, and block requests that exceed the available balance unless an HR Admin overrides.
- Accrual and carry-over rules were assumed in the confirmed understanding; for this Lightweight MVP scope entitlement is set as an annual figure per employee and automated accrual/carry-over processing is NOT included. This needs confirmation.
- One shared holiday calendar and one set of leave policies for a single country and timezone; multi-country calendars and per-country rules are explicitly out of scope.
- No special-category data is stored, so sickness leave carries no medical certificate or health detail.

### US-023: Apply for leave by type and date range

**Priority:** critical

> As a Employee, I want to request leave by choosing a leave type and a date range, so that my absence is recorded and sent to my manager for a decision.

| ID | Given | When | Then |
|---|---|---|---|
| AC-078 | I have sufficient annual leave balance | I submit a request for leave type 'Annual' from 10 to 12 March with a reason | the request is created with status 'Submitted', shows the deducted day count, and appears in my manager's pending list |
| AC-079 | I am creating a leave request | I set the end date earlier than the start date | submission is refused and the date fields are flagged |
| AC-080 | I already have an approved or submitted leave request covering 11 March | I submit another request that includes 11 March | submission is refused with a message naming the overlapping request |
| AC-081 | I select a leave type | the form loads | only leave types configured as active by an HR Admin are offered |

### US-024: Request a half-day as the smallest leave increment

**Priority:** high

> As a Employee, I want to request a half-day of leave, so that I can take a morning or afternoon off without using a full day.

| ID | Given | When | Then |
|---|---|---|---|
| AC-082 | I am requesting a single day of leave | I choose the half-day option and select 'first half' or 'second half' | the request is created for 0.5 days and the chosen half is shown on the request |
| AC-083 | I am requesting leave | I attempt to enter a quarter-day or any increment smaller than a half-day | no such option is offered and the smallest selectable unit is 0.5 days |
| AC-084 | a half-day request is approved | my balance is recalculated | exactly 0.5 days is deducted from the relevant leave type |

### US-025: Leave requests validate against weekends, holidays and available balance

**Priority:** high

> As a Employee, I want the system to exclude non-working days and stop me over-drawing my balance, so that my leave request reflects the days I will actually be absent.

| ID | Given | When | Then |
|---|---|---|---|
| AC-085 | my requested range spans a weekend | the day count is calculated | weekend days are excluded from the deducted total and shown as non-working in the request breakdown |
| AC-086 | my requested range includes a date on the company holiday calendar | the day count is calculated | that public holiday is excluded from the deducted total |
| AC-087 | I have 2 days of annual leave remaining | I submit a request for 4 days of annual leave | submission is refused with a message stating the available balance and the shortfall |
| AC-088 | an employee needs leave beyond their balance and an HR Admin agrees | the HR Admin applies an override to the request | the request is permitted to proceed, the resulting negative balance is shown, and the override is written to the audit log |

### US-026: View my leave balances

**Priority:** critical

> As a Employee, I want to see my remaining balance for each leave type, so that I know how much leave I can still take before I apply.

| ID | Given | When | Then |
|---|---|---|---|
| AC-089 | I have an annual entitlement of 20 days and 5 days approved | I open 'My Leave Balances' | annual leave shows entitlement 20, taken 5 and remaining 15 |
| AC-090 | I have a submitted request of 3 days awaiting a decision | I view my balances | the 3 days are shown separately as pending and are not yet deducted from the taken figure |
| AC-091 | a leave request of mine is approved | I reload my balances | the approved days have moved from pending to taken and the remaining figure has reduced accordingly |

### US-027: View my leave history and request status

**Priority:** high

> As a Employee, I want to see all my past and pending leave requests with their outcomes, so that I can track what has been decided and why.

| ID | Given | When | Then |
|---|---|---|---|
| AC-092 | I have submitted several leave requests | I open 'My Leave History' | each request is listed with leave type, dates, day count, status and decision date, most recent first |
| AC-093 | one of my requests was rejected with a comment | I open that request | the manager's comment and the rejection timestamp are displayed |
| AC-094 | I have many requests | I filter the list by leave type or status | only matching requests are listed |

### US-028: View the company holiday calendar

**Priority:** medium

> As a Employee, I want to see the company's public holidays for the year, so that I can plan my leave around days the office is already closed.

| ID | Given | When | Then |
|---|---|---|---|
| AC-095 | holidays have been configured for the current year | I open the holiday calendar | each holiday is listed with its date, day of the week and name |
| AC-096 | the company operates in one country and timezone | I open the holiday calendar | a single shared calendar is shown with no country or region selector |
| AC-097 | I am viewing the holiday calendar | I select a different year for which holidays exist | that year's holidays are displayed |

### US-029: HR Admin configures leave types, entitlements and holidays

**Priority:** critical

> As a HR Admin, I want to define the leave types with their entitlements and maintain the holiday calendar and opening balances, so that leave requests are measured against the company's actual policy.

| ID | Given | When | Then |
|---|---|---|---|
| AC-098 | I am an HR Admin | I create a leave type named 'Annual' with an annual entitlement of 20 days and mark it active | it becomes selectable on employee leave requests and appears in balance views |
| AC-099 | I create a leave type marked as unpaid | an employee requests it | no entitlement balance check is applied to that type |
| AC-100 | I am an HR Admin | I set or adjust an employee's opening balance for a leave type | their remaining balance updates and the adjustment is written to the audit log with the old and new values |
| AC-101 | I am an HR Admin | I add, edit or remove a date on the company holiday calendar | the change takes effect for future leave day-count calculations and is written to the audit log |
| AC-102 | I am a Reporting Manager without the HR Admin role | I attempt to open leave type or holiday configuration | access is refused |

## EPIC-007: Single-Step Approval of Timesheets and Leave

Reporting Managers approve or reject their direct reports' timesheets and leave requests, with a comment required on rejection, and the employee is alerted in the portal.

OPEN ASSUMPTIONS TO CONFIRM (the confirmed understanding flagged these two as the most important to check):
- Approval is SINGLE-STEP: the employee's Reporting Manager decides. Rejected items return to the employee as editable drafts for resubmission; approved items lock and can only be reopened by an HR Admin, with the reversal audit-logged. No multi-level or sequential approval chains are built.
- A user who holds multiple roles CANNOT approve their own submission; such requests escalate to the next manager up the reporting line, or to an HR Admin where no such manager exists.
- CONFLICT WITH CONFIRMED UNDERSTANDING: the understanding assumed in-app alerts PLUS transactional email, but email has been removed from the chosen scope. Notifications in this version are in-app only. There is therefore no emailed submission/approval/rejection notice and no pending-approval reminder email; this needs confirmation.
- Manager dashboards and reports (team availability, project utilisation, headcount, leave liability) are not part of this Lightweight MVP scope; managers see a pending-items list only.

### US-030: Review pending timesheets and leave for my direct reports

**Priority:** critical

> As a Reporting Manager, I want one list of everything from my team awaiting my decision, so that I can clear approvals without hunting through screens.

| ID | Given | When | Then |
|---|---|---|---|
| AC-103 | two of my direct reports have submitted timesheets and one has submitted a leave request | I open my pending approvals list | all three items are listed with employee name, item type, period or dates and submission date |
| AC-104 | an employee who does not report to me has submitted a timesheet | I open my pending approvals list | that item is not listed and cannot be opened by direct URL |
| AC-105 | I open a pending timesheet from the list | the detail loads | the per-day, per-project hours and the period total are shown read-only alongside approve and reject actions |

### US-031: Approve a submitted timesheet or leave request

**Priority:** critical

> As a Reporting Manager, I want to approve a submitted item so it is final, so that the data can be relied on for payroll and planning.

| ID | Given | When | Then |
|---|---|---|---|
| AC-106 | a direct report's timesheet has status 'Submitted' | I approve it | its status becomes 'Approved', it is locked against editing by the employee, and it leaves my pending list |
| AC-107 | a direct report's leave request has status 'Submitted' | I approve it | its status becomes 'Approved' and the requested days are deducted from the employee's balance for that leave type |
| AC-108 | I approve an item | the employee next opens the portal | an in-app alert tells them the item was approved, and the item shows my name and the decision timestamp |
| AC-109 | I approve an item | a System Admin opens the audit log | the approval is recorded with my identity, the affected item and the timestamp |

### US-032: Reject an item with a mandatory comment

**Priority:** critical

> As a Reporting Manager, I want to reject a submission and be required to say why, so that the employee knows what to correct before resubmitting.

| ID | Given | When | Then |
|---|---|---|---|
| AC-110 | a direct report's timesheet has status 'Submitted' | I choose to reject it without entering a comment | the rejection is refused and the comment field is flagged as required |
| AC-111 | I have entered a rejection comment | I confirm the rejection | the item's status becomes 'Rejected', it returns to the employee as an editable draft, and it leaves my pending list |
| AC-112 | I reject a leave request | the employee views their balances | no days have been deducted for that request |
| AC-113 | I reject an item | the employee next opens the portal | an in-app alert tells them the item was rejected and the comment is visible on the item |

### US-033: No self-approval for multi-role users

**Priority:** high

> As a the company, I want a user who is also a manager to be unable to approve their own submission, so that every submission is decided by someone other than its author.

| ID | Given | When | Then |
|---|---|---|---|
| AC-114 | I hold both the Employee and Reporting Manager roles and I have submitted my own timesheet | I open my pending approvals list | my own submission is not listed and any direct attempt to approve it is refused |
| AC-115 | I am a Reporting Manager who has submitted my own leave request and my own reporting manager is set | the request is submitted | it appears in my reporting manager's pending list instead of my own |
| AC-116 | I am a Reporting Manager with no reporting manager of my own | I submit a timesheet or leave request | it is routed to the HR Admin queue for decision |
| AC-117 | a submission has been escalated because the submitter could not approve it | a System Admin opens the audit log | the escalation and the approver it was routed to are recorded |

### US-034: HR Admin reopens an approved item

**Priority:** medium

> As a HR Admin, I want to reopen an item that was approved in error, so that a genuine mistake can be corrected without editing locked data behind the scenes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-118 | a timesheet has status 'Approved' and is locked | I reopen it with a reason | its status returns to 'Draft', the employee can edit it again, and it is no longer counted as approved |
| AC-119 | an approved leave request is reopened | the reopen is saved | the previously deducted days are returned to the employee's balance |
| AC-120 | I reopen an approved item | a System Admin opens the audit log | the reversal is recorded with my identity, the reason, the previous status and the timestamp |
| AC-121 | I am a Reporting Manager without the HR Admin role | I attempt to reopen an approved item | the action is refused |

### US-035: In-app alerts for submissions and decisions

**Priority:** medium

> As a portal user, I want in-app alerts when something is submitted to me or decided for me, so that I notice approvals waiting and outcomes without being told verbally.

| ID | Given | When | Then |
|---|---|---|---|
| AC-122 | a direct report submits a timesheet or leave request to me | I next load the portal | an in-app alert and a pending-count indicator show that an item awaits my decision |
| AC-123 | my submission has been approved or rejected | I next load the portal | an in-app alert states the item, the outcome and any comment |
| AC-124 | I have unread alerts | I open an alert | it is marked as read and the unread count decreases |
| AC-125 | ASSUMPTION — transactional email was removed from the chosen scope | any submission, approval, rejection or pending item occurs | the notification is delivered in-app only and no email or SMS is sent |

## EPIC-008: Employee Home Dashboard and Mobile-Responsive Portal

A single home dashboard for the signed-in employee covering their own timesheet, attendance and leave, on screens that work on a phone browser as well as a desktop.

OPEN ASSUMPTIONS TO CONFIRM:
- The interface is single-language in English / the local language; a multi-language UI is explicitly out of scope.
- The portal is mobile-responsive in the browser; native iOS/Android apps, offline clock-in and push notifications are explicitly out of scope.
- Dates and times are displayed in the company's single timezone.

### US-036: See my timesheet, attendance and leave on one home dashboard

**Priority:** high

> As a Employee, I want a home screen summarising my current timesheet, today's attendance and my leave position, so that I can see what needs my attention as soon as I sign in.

| ID | Given | When | Then |
|---|---|---|---|
| AC-126 | I sign in as an Employee | my home dashboard loads | it shows the status of my current timesheet period, my clock-in state for today, my remaining leave balances and any pending leave requests |
| AC-127 | my current timesheet is still in draft | I view the dashboard | a prompt and a direct link to complete and submit it are shown |
| AC-128 | I have not clocked in today | I view the dashboard | a 'Clock in' action is available directly from the dashboard |
| AC-129 | I also hold the Reporting Manager role | my home dashboard loads | a count of items awaiting my approval is shown alongside my own employee summary |

### US-037: Use the portal on a phone browser

**Priority:** high

> As a Employee away from my desk, I want the portal screens to work on my phone browser, so that I can clock in, apply for leave and check my status without a laptop.

| ID | Given | When | Then |
|---|---|---|---|
| AC-130 | I open the portal in a mobile browser at a 360px-wide viewport | I navigate to the dashboard, clock-in, leave request and timesheet screens | all content and actions are reachable with no horizontal scrolling and no overlapping elements |
| AC-131 | I am on a phone browser | I press the clock-in or submit-leave actions | the controls are large enough to tap accurately and the action completes successfully |
| AC-132 | I am on a phone browser | I open the weekly timesheet grid | the grid remains usable through a mobile-appropriate layout rather than a cropped desktop table |
| AC-133 | the portal is mobile-responsive in the browser | I look for an app to install | no native iOS or Android app is offered and no offline clock-in is available |

### US-038: Single-language interface and consistent date/time display

**Priority:** low

> As a Employee, I want all portal screens in one language with consistent date and time formats, so that there is no ambiguity about when something happened.

| ID | Given | When | Then |
|---|---|---|---|
| AC-134 | I use any screen in the portal | labels, messages and errors are displayed | they appear in the single configured language with no language selector present |
| AC-135 | all employees share one country and timezone | a punch, submission or decision timestamp is displayed | it is rendered in the company's single timezone using one consistent date and time format across every screen |

## EPIC-009: Portal User Guide

Written guidance so employees and administrators can use the portal without being trained person-to-person.

OPEN ASSUMPTIONS TO CONFIRM:
- The guide is delivered as in-portal help pages in the single configured language, covering the capabilities built in this version only.
- Video or interactive training material is not included.

### US-039: Employee user guide

**Priority:** medium

> As a Employee, I want a guide explaining how to use the portal for my own tasks, so that I can submit timesheets, clock in and request leave correctly without asking HR.

| ID | Given | When | Then |
|---|---|---|---|
| AC-136 | I am signed in as an Employee | I open 'Help' | a guide is available covering signing in, the home dashboard, entering and submitting timesheets, clocking in and out, requesting leave, half-day leave, balances, history and the holiday calendar |
| AC-137 | I am reading the employee guide | I look up a task such as 'correct a rejected timesheet' | step-by-step instructions matching the screens actually built are shown |
| AC-138 | I open the guide on a phone browser | the page loads | it is readable and navigable without horizontal scrolling |

### US-040: Administrator user guide

**Priority:** medium

> As a HR Admin, Project Manager or System Admin, I want a guide covering the administrative tasks in the portal, so that I can set the system up and run it correctly.

| ID | Given | When | Then |
|---|---|---|---|
| AC-139 | I hold an administrative role | I open 'Help' | an administrator section covers creating accounts and assigning roles, maintaining employees and departments, creating projects and assignments, configuring leave types and holidays, setting balances, correcting attendance punches, approving and reopening items, and reading the audit log |
| AC-140 | I am a new HR Admin setting the system up | I follow the guide's launch-setup section | it states the required order of setup — departments, leave types and holidays, employees and reporting lines, accounts and roles, then projects and assignments |
| AC-141 | I hold only the Employee role | I open 'Help' | only the employee section is shown and administrative instructions are not exposed |
<!-- sdlc:auto:end epics -->

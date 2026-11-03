# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-OVERVIEW · draft · source: requirements:overview

HRMS portal: a responsive web portal with secure login and role-based access for Employees, Reporting Managers, HR Admins, Project Managers and System Admins. Requirements version 2 is delivered as a 'lightweight' scope. This entry lists the in-scope capabilities, the roles and the explicit exclusions.

PROJECT: HRMS portal. Delivery scope: lightweight. Requirements version: 2.

ROLES (from project description; fixed set, predefined permissions, union across multiple roles per EPIC-001):
- Employee: view/update own profile, submit daily/weekly timesheets, apply for leave, check balances, view holidays, track approval status.
- Reporting Manager: all Employee permissions, view team members, approve/reject team timesheets and leave, monitor team availability, access team reports.
- HR Admin: manage employee records, departments, leave policies, leave balances, holiday calendars, attendance records, org-wide HR reports.
- Project Manager: create/manage projects, assign employees, review project-specific timesheets, monitor project utilisation and allocated hours.
- System Admin: manage users, roles, permissions, organisation settings, system configuration, audit logs.

CAPABILITIES IN SCOPE:
- Employee sign-in with email and password
- Employee profile records with department and reporting manager
- Project records and employee-to-project assignments
- Daily and weekly timesheet entry against assigned projects
- Timesheet submission with on-screen status
- Browser clock-in and clock-out of arrival and departure times
- Leave request submission by leave type and date range
- Personal leave balance and leave history view
- Company holiday calendar view
- Employee home dashboard (own timesheet, attendance, leave)
- Mobile-responsive screens usable on a phone browser
- Portal user guide for employees and administrators
- Accounts created by an administrator; no public self-registration
- Clock-in from any browser, no geofencing or location check
- Punch times stamped by the server clock
- Single-language interface (English / the local language)
- Half-day as the smallest leave increment

OUT OF SCOPE (do not design or build):
- Single sign-on (Google Workspace / Microsoft 365 / Azure AD)
- Automatic payroll system integration
- Multi-country support (per-country holidays, leave rules, timezones) and multi-language UI
- Biometric clock-in and badge/RFID terminal integration
- Native iOS/Android apps (incl. offline clock-in, push notifications)
- Payroll/salary processing, recruitment/ATS, performance reviews, expense claims, employee document storage
- Email (the suggested SendGrid was removed from the stack)

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009

- ⚠ Project description text is truncated at 'RBAC Requirements ... 2. Employees can', so RBAC requirement items beyond item 1 were not provided.
- ⚠ Project description lists Reporting Manager 'monitor team availability' and 'team reports', HR Admin 'organization-wide HR reports' and Project Manager 'monitor project utilization', but EPIC-003, EPIC-005 and EPIC-007 state dashboards and reports are NOT in this lightweight scope. Descriptions and scope conflict; confirm that these are deferred.
- ⚠ Project description says approval workflows include 'notifications'; this version delivers in-app notifications only (email removed). Confirm.
- ⚠ Project description assigns Project Managers the ability to 'review project-specific timesheets', but no user story defines a project timesheet review screen. Only AC-014 mentions visibility of hours booked to the PM's own project.
- ⚠ No approval of the requirements by a named person or date is recorded in the input beyond the product owner approving the technology stack and services.

### REQ-STACK · approved · source: requirements:technology-stack

The product owner approved FastAPI 0.115 (backend), React 19 (frontend), PostgreSQL 16 (database) and AWS (cloud). Redis 7 is approved as both queue and cache. Design must use exactly these with no substitution; REDIS_URL is the required API key/config.

APPROVED STACK (design against exactly these):
- Backend: FastAPI 0.115. Replaces the Node/TypeScript assumption recorded by the analyst, because Node cannot be built with on this platform. Rationale given: the hard work is rules (relationship-scoped permissions, self-approval escalation up the reporting line, leave accrual/carry-over maths, CSV/Excel import/export), and tens of users at week-end peaks is within FastAPI's reach.
- Cloud: AWS. Rationale given: one managed region inside the company's own country with daily automated backups; managed PostgreSQL with daily snapshots and point-in-time restore; encryption at rest; Amazon SES mentioned as an option if email is preferred over SendGrid.
- Database: PostgreSQL 16. Rationale given: system of record for people, hours, attendance and leave balances; enforces relationships; prevents double-deduction when approval and HR correction coincide; keeps the immutable audit log append-only and searchable; 500 employees is a light load.
- Frontend: React 19. Rationale given: one responsive interface for desktop (HR bulk work) and phone browser (clock-in); one shared set of screens that show or hide sections by role.

APPROVED SERVICES (include exactly these in runtime_needs):
- Queue: Redis (as a queue), container redis:7-alpine. Stated purpose: spreadsheet import of employees/opening balances, month-end CSV/Excel exports for payroll, nightly pending-approval reminders, with retry.
- Cache: Redis, container redis:7-alpine. Stated purpose: login sessions (session timeout, lockout after failed attempts) and cached dashboard figures (team availability, project utilisation, leave liability).

API KEYS / CONFIG: REDIS_URL.

**Related:** US-005, US-007, US-023, US-030, US-036

- ⚠ The Redis queue rationale (bulk spreadsheet import, payroll CSV/Excel export, nightly pending-approval reminder emails) refers to capabilities that other inputs exclude from this version: bulk import (EPIC-002 assumptions), CSV/Excel export (EPIC-004 assumptions), and email reminders (EPIC-007, out-of-scope list). The queue's purpose in this version is unclear; confirm.
- ⚠ Cache rationale mentions team availability, project utilisation and leave liability dashboards, which are not in the lightweight scope (EPIC-003, EPIC-007).
- ⚠ Stack rationale mentions Amazon SES as an option, while email is declared out of scope. Confirm SES is not to be provisioned.
- ⚠ Scale is stated inconsistently: 'tens of users at week-end peaks' versus '500 employees' punches and timesheets'. Capacity expectations need confirming.
- ⚠ Session timeout duration and lockout attempt threshold are described only as 'configured'; no values are given.
- ⚠ Stack text refers to the analyst's earlier Node/TypeScript assumption; US-041/US-043 reference SignIn.tsx. Confirm the frontend is TypeScript-based React.

### REQ-EPIC-001 · draft · source: requirements:EPIC-001

Secure email/password sign-in with administrator-created accounts only, five fixed roles combined as a union, relationship-scoped access, session timeout and lockout, administrator-issued password reset, and an immutable audit log. Stories US-041 to US-043 cover a sign-in token-field fix, a change-password endpoint and a frontend sign-in test.

EPIC-001: Secure Access, Accounts and Role-Based Permissions. Five fixed roles with predefined permission sets; a user may hold several roles and permissions combine as a union; access is scoped by relationship as well as role.

US-001 [critical] Sign in with email and password.
- AC-001: correct email/password for an active account authenticates and lands on the home dashboard.
- AC-002: wrong password gives a generic 'email or password is incorrect' message that does not reveal whether the email exists.
- AC-003: deactivated account is refused and told to contact an administrator.
- AC-004: only a salted one-way hash is stored; plaintext appears nowhere in the record or application logs.

US-002 [critical] Administrator creates user accounts; no public self-registration.
- AC-005: System Admin creates a user with email, linked employee record and roles (e.g. Employee + Reporting Manager); account is active and holds both roles.
- AC-006: no self-registration screen exists; unauthenticated access to account-creation URLs redirects to sign-in.
- AC-007: duplicate email rejected with 'email already in use'.
- AC-008: HR Admin without System Admin cannot open user account/role management.
- AC-009: create/edit/deactivate is audit-logged with actor, action, affected account and server timestamp.

US-003 [high] Permissions combine as a union across roles.
- AC-010: Employee + Project Manager sees both personal and project management navigation.
- AC-011: Employee-only sees no project, HR or system admin screens; direct URL navigation is refused.
- AC-012: after a System Admin removes a role, its screens are unavailable on next load.

US-004 [critical] Access scoped by relationship, not only role.
- AC-013: Reporting Manager's team list shows only direct reports; another employee's record by ID returns an authorisation error.
- AC-014: Project Manager sees only hours booked to their assigned project(s).
- AC-015: Employee requesting a non-own timesheet/attendance/leave record is refused with no data returned.
- AC-016: HR Admin can view and maintain people data org-wide but cannot open user accounts, roles or system configuration.

US-005 [high] Session timeout and account lockout.
- AC-017: idle beyond the configured timeout ends the session and returns to sign-in.
- AC-018: the configured number of consecutive failed attempts locks the account; sign-in is refused even with the correct password.
- AC-019: System Admin unlock restores sign-in with the existing password and is audit-logged.
- AC-020: sign out invalidates the session; browser back does not show protected pages.

US-006 [high] Administrator-issued password reset.
- AC-021 (assumption): no emailed reset links; the sign-in screen tells users to contact an administrator.
- AC-022: System Admin issues a reset; a one-time password is generated, shown once, and the stored hash is replaced.
- AC-023: signing in with the one-time password forces setting a new password before any other screen.
- AC-024: reset is audit-logged with acting admin, affected account and timestamp.

US-007 [high] Immutable audit log of approvals, changes and admin actions.
- AC-025: approve/reject of timesheet or leave is logged with actor, action, record, comment and server timestamp.
- AC-026: HR edits of employee records, attendance punch corrections and reopened items are logged with before/after values.
- AC-027: no interface or API allows editing or deleting entries (including by System Admin); attempts are refused.
- AC-028: only System Admin can open the audit log.

US-041 [critical] Sign-in screen reads session_token from the login response.
- AC-142: SignIn.tsx stores the value of `session_token` and navigates to the dashboard.
- AC-143: token is taken from `session_token` first, with `token` then `access_token` as fallbacks only; an empty string is never stored when `session_token` is present.
- AC-144: wrong password stores no token and shows the generic error.

US-042 [high] Backend endpoint to change a password (/api/auth/change-password).
- AC-145: signed-in user needing a change posts a new password; a new salted hash replaces the old, must_change_password is cleared, other screens become reachable.
- AC-146: wrong current password or empty/invalid new password is refused with a clear error; hash unchanged; no password in response or logs.
- AC-147: unauthenticated request is refused.
- AC-148: after change, the new password signs in and the old one is refused.
- AC-149: change is audit-logged with actor, account and timestamp, but no password or hash.

US-043 [medium] Frontend sign-in test using the real login response.
- AC-150: component test with a fixture matching the real /api/auth/login success response asserts the token is set from `session_token` and the user is navigated to the dashboard.
- AC-151: the test fails if the sign-in screen reads a field name that differs from the real response.
- AC-152: refusal response stores no token and shows the generic error.

OPEN ASSUMPTIONS RECORDED: email/password managed by the app (hashed, timeout, lockout, no self-registration); admin-issued reset replaces emailed reset links; roles fixed (no custom roles or per-permission toggles); SSO out of scope; employee records are personal data (encryption in transit and at rest; no special-category data); minimal audit logging.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-041, US-042, US-043

- ⚠ CONFLICT with confirmed understanding: it assumed emailed password-reset links, but email was removed from scope, so only administrator-issued resets are delivered. Needs confirmation.
- ⚠ Session timeout duration and lockout attempt count are not specified ('configured'); no default values or where they are configured is stated.
- ⚠ US-007 says the audit log covers 'approvals, changes and admin actions', while the epic describes it as 'minimal level'. The exact event list should be confirmed (e.g. sign-ins, lockouts are only partly mentioned: unlock and password change are).
- ⚠ AC-027 requires immutability even against System Admin; the mechanism (e.g. DB-level append-only) is not specified in requirements.
- ⚠ US-041 to US-043 describe implementation-level defects/tests (SignIn.tsx field mapping) rather than user needs; the original source of this defect is not stated.
- ⚠ US-042 AC-146 says 'current password is required for the change' conditionally; whether the one-time-password flow also requires the current password is ambiguous.
- ⚠ No story covers viewing, unlocking or deactivating accounts beyond AC-003, AC-009 and AC-019; reactivation of a deactivated account is not described.
- ⚠ US-004 is worded 'As a the company', not a user persona; this is a minor text issue in the source.

### REQ-EPIC-002 · draft · source: requirements:EPIC-002

Employee profile records with department and reporting manager. Employees edit permitted details; HR Admins maintain records, departments and leaver handling including erasure. Managers see their direct reports.

EPIC-002: Employee Profiles, Departments and Reporting Lines.

US-008 [high] View and update my own profile.
- AC-029: 'My Profile' shows name, employee ID, department, reporting manager, work email and contact details.
- AC-030: employee-editable fields (e.g. mobile number) can be changed, are saved, confirmed on screen and audit-logged.
- AC-031: department, reporting manager and employee ID are read-only; direct update requests are refused.

US-009 [critical] HR Admin maintains employee records.
- AC-032: create with name, employee ID, work email, department, reporting manager and start date; appears in the directory.
- AC-033: missing mandatory fields (e.g. department, reporting manager) block saving and are flagged.
- AC-034: changing the reporting manager moves the employee between team lists.
- AC-035: every field edit is audit-logged with field, old/new value, actor and timestamp.

US-010 [medium] HR Admin corrects or erases a leaver's record.
- AC-036: marking as leaver with an end date removes the employee from active team lists and assignment pickers and deactivates the linked portal account.
- AC-037: erasure irreversibly removes identifying personal fields while the audit log keeps who performed it and when.
- AC-038: non-HR Admins cannot mark leavers or erase.

US-011 [medium] HR Admin maintains departments.
- AC-039: added departments become selectable on employee records.
- AC-040: deleting a department with employees is refused with the count of assigned employees.
- AC-041: one shared department list, no per-country or per-entity variants.

US-012 [high] Manager views direct reports.
- AC-042: 'My Team' lists exactly the employees reporting to the manager with department and current leave/timesheet status.
- AC-043: non-reports are not listed and their profiles are unreachable from the manager's screens.

ASSUMPTIONS RECORDED: employee data is personal data; no special-category data; employee documents out of scope.

**Related:** US-008, US-009, US-010, US-011, US-012

- ⚠ Which profile fields are employee-editable versus HR-only is assumed (contact details editable; employment data HR-only) and needs confirmation.
- ⚠ Bulk import of employees, departments and opening balances from CSV/Excel was in the confirmed understanding but is not in the lightweight scope; records are created one at a time. Confirm, since creating several hundred records manually at launch is onerous.
- ⚠ Erasure (AC-037) conflicts potentially with audit log immutability (AC-027) regarding personal data already inside audit before/after values; handling is not specified.
- ⚠ Relationship between a 'leaver' flag and a later erasure of linked records (timesheets, leave) is not defined.
- ⚠ 'Current leave/timesheet status' on 'My Team' (AC-042) is not further defined.
- ⚠ No definition of the employee directory screen's access (who may search/view all) beyond HR Admin.

### REQ-EPIC-003 · draft · source: requirements:EPIC-003

Project records and employee-to-project assignments, which control what employees may book hours against and what Project Managers may see.

EPIC-003: Projects and Employee Assignments.

US-013 [high] Create and manage project records.
- AC-044: Project Manager creates a project with name, code, start date and status 'active'; it becomes available for assignment.
- AC-045: a Project Manager sees only assigned projects; opening another project by ID is refused.
- AC-046: setting a project to 'closed' removes it from timesheet pickers while historic hours remain visible on submitted timesheets.

US-014 [high] Assign employees to projects.
- AC-047: assigning an employee to an active project with optional allocated hours adds the project to that employee's timesheet picker.
- AC-048: removing an assignment removes the project from new-entry pickers while recorded hours are retained.
- AC-049: assigning to a project the user does not manage is refused with an authorisation error.

US-015 [medium] Employee sees own project assignments.
- AC-050: 'My Projects' lists assigned active projects with name, code and status.
- AC-051: with no assignments, an empty-state message explains a Project Manager must assign the employee before logging hours.

ASSUMPTIONS RECORDED: Project Managers see only projects they are assigned to; allocated hours per assignment are captured for later allocated-versus-actual comparison; dashboards are not in this scope.

**Related:** US-013, US-014, US-015

- ⚠ Ambiguity: AC-044 has a Project Manager creating a project, yet AC-045 says PMs see only projects they are 'assigned to'. How a creator becomes the manager of a project is not specified.
- ⚠ Whether a project can have several Project Managers, and how a PM is assigned to a project, is not defined.
- ⚠ Project end date, reopening a closed project, and editing/deleting projects are not specified.
- ⚠ Allocated-versus-actual utilisation reporting is explicitly not in scope, though the Project Manager role description mentions monitoring utilisation and allocated hours.

### REQ-EPIC-004 · draft · source: requirements:EPIC-004

Daily and weekly entry of project hours, submission for approval, on-screen status tracking and correction/resubmission of rejected timesheets.

EPIC-004: Timesheet Entry and Submission.

US-016 [critical] Log daily hours against assigned projects.
- AC-052: entering 7.5 hours on an assigned project for today and saving stores a draft shown against that date.
- AC-053: the project picker lists only active projects the employee is currently assigned to.
- AC-054: an entry that takes the day's total above 24 hours is rejected with a message stating the daily maximum.
- AC-055: negative or non-numeric hours are rejected and the invalid field flagged.

US-017 [high] Enter and review a weekly timesheet.
- AC-056: grid has assigned projects as rows, days as columns, with row, column and week totals.
- AC-057: edited cells save, totals recalculate and values persist after reload.
- AC-058: previous/next week navigation shows that week's entries and status.

US-018 [critical] Submit a timesheet and track status on screen.
- AC-059: submitting a draft with at least one entry sets status 'Submitted', makes entries read-only and adds it to the reporting manager's pending list.
- AC-060: submitting with no hours is refused (at least one entry required).
- AC-061: the timesheet list shows Draft/Submitted/Approved/Rejected with decision date and manager comment.
- AC-062: editing a 'Submitted' timesheet is blocked until the manager rejects it or an HR Admin reopens it.

US-019 [high] Correct and resubmit a rejected timesheet.
- AC-063: a rejected timesheet shows status 'Rejected', the manager's comment, and is editable again.
- AC-064: resubmitting returns it to 'Submitted' and to the manager's pending list.
- AC-065: history lists the rejection with comment and the resubmission in order with timestamps.

ASSUMPTIONS RECORDED: period is a calendar week, hours per day per project; timesheet hours are project effort, separate from attendance and not reconciled automatically.

**Related:** US-016, US-017, US-018, US-019

- ⚠ Validation limits (e.g. 24 hours/day maximum) are assumed and need confirmation.
- ⚠ AC-054 example is internally unclear (8 hours already entered; the 24-hour limit would require adding over 16 hours); confirm the intended rule, including whether the limit applies across projects.
- ⚠ Status wording is inconsistent: AC-063 shows status 'Rejected' while the item is editable, whereas AC-111 says the item 'returns as an editable draft'. Confirm the status model.
- ⚠ CSV/Excel export of approved timesheets for payroll was in the confirmed understanding but is not in the lightweight scope.
- ⚠ Whether the weekly week starts on Monday or another day is not stated.
- ⚠ Behaviour for weeks that span a project assignment ending, or hours entered for holidays/leave days, is not defined.

### REQ-EPIC-005 · draft · source: requirements:EPIC-005

Attendance module separate from timesheets: browser clock-in/out stamped by the server clock with no location checks, employee attendance history, and HR correction of missed punches.

EPIC-005: Attendance Clock-In and Clock-Out.

US-020 [critical] Clock in and clock out from any browser.
- AC-066: 'Clock in' creates today's attendance record with arrival time from the server clock; screen shows clocked in.
- AC-067: 'Clock out' records departure from the server clock and shows worked duration.
- AC-068: once clocked in, 'Clock in' is unavailable and the arrival time is shown.
- AC-069: the stored arrival time is the server time even if the device clock is wrong.
- AC-070: on a phone browser from any network/location, the punch is accepted with no location, geofence or device check.

US-021 [high] View my own attendance history.
- AC-071: 'My Attendance' lists each day of the current month with arrival, departure and worked duration.
- AC-072: clock-in without clock-out is flagged as an incomplete punch with no duration calculated.
- AC-073: an Employee-only user requesting another employee's attendance is refused.

US-022 [high] HR Admin views and corrects attendance punches.
- AC-074: for a given date, all employees' arrival/departure are listed, with incomplete punches flagged.
- AC-075: HR sets a departure time with a reason; record is marked regularised and duration recalculated.
- AC-076: the correction is audit-logged with actor, original value, corrected value, reason and timestamp.
- AC-077: Reporting Managers or Employees without HR Admin cannot edit punches.

ASSUMPTIONS RECORDED: server-clock timestamps; no geofencing; biometric and badge/RFID out of scope; one clock-in and one clock-out per day.

**Related:** US-020, US-021, US-022

- ⚠ Attendance reports (late arrivals, early departures, absent days, hours per period) from the confirmed understanding are NOT in the lightweight scope.
- ⚠ One-punch-pair-per-day is assumed; confirm that mid-day breaks and multiple shifts are not needed.
- ⚠ HR correction of a missed clock-in (arrival time) or a wholly missing day is not explicitly covered (AC-075 describes setting a departure time).
- ⚠ Handling of an unclosed punch spanning midnight or an auto close-out is not specified.
- ⚠ The 'company's single timezone' value is not named.

### REQ-EPIC-006 · draft · source: requirements:EPIC-006

Leave requests by type and date range with half-day support, validation against weekends, holidays and balance, personal balances and history, a shared holiday calendar, and HR configuration of leave types, entitlements, opening balances and holidays.

EPIC-006: Leave Requests, Balances and Holiday Calendar.

US-023 [critical] Apply for leave by type and date range.
- AC-078: with sufficient balance, a request (e.g. Annual, 10-12 March, with reason) is created as 'Submitted', shows the deducted day count and appears in the manager's pending list.
- AC-079: end date before start date is refused and fields flagged.
- AC-080: overlap with an approved or submitted request is refused, naming the overlapping request.
- AC-081: only leave types marked active by HR Admin are offered.

US-024 [high] Half-day as the smallest increment.
- AC-082: a single-day request can be a half-day (first half / second half), 0.5 days, with the half shown.
- AC-083: no increment smaller than 0.5 days is offered.
- AC-084: approving a half-day deducts exactly 0.5 days from the leave type.

US-025 [high] Validation against weekends, holidays and balance.
- AC-085: weekends are excluded from the deducted total and shown as non-working.
- AC-086: dates on the holiday calendar are excluded from the deducted total.
- AC-087: a request exceeding balance (e.g. 4 days with 2 remaining) is refused stating balance and shortfall.
- AC-088: HR Admin may override to allow over-balance; negative balance is shown and the override is audit-logged.

US-026 [critical] View my leave balances.
- AC-089: shows entitlement, taken and remaining per type (e.g. 20/5/15).
- AC-090: submitted-but-undecided days appear separately as pending, not in 'taken'.
- AC-091: on approval, days move from pending to taken and remaining reduces.

US-027 [high] View my leave history and request status.
- AC-092: lists requests with type, dates, day count, status and decision date, most recent first.
- AC-093: rejected requests show manager comment and rejection timestamp.
- AC-094: filter by leave type or status.

US-028 [medium] View the company holiday calendar.
- AC-095: lists each holiday with date, weekday and name.
- AC-096: single shared calendar with no country/region selector.
- AC-097: year selector shows other years where holidays exist.

US-029 [critical] HR Admin configures leave types, entitlements and holidays.
- AC-098: create a leave type (e.g. 'Annual', 20 days, active); it is selectable and shown in balance views.
- AC-099: unpaid leave types have no entitlement balance check.
- AC-100: HR sets/adjusts an employee's opening balance; remaining updates and the change is audit-logged with old/new values.
- AC-101: holiday add/edit/remove affects future day-count calculations and is audit-logged.
- AC-102: Reporting Managers without HR Admin cannot open leave-type or holiday configuration.

ASSUMPTIONS RECORDED: leave types carry an annual entitlement; balances deduct on approval; one calendar and one policy set for one country/timezone; no medical certificate or health detail stored.

**Related:** US-023, US-024, US-025, US-026, US-027, US-028, US-029

- ⚠ Accrual and carry-over rules were in the confirmed understanding but are NOT included; entitlement is a single annual figure per employee. Needs confirmation.
- ⚠ Leave-year definition (calendar vs financial year) and what happens to balances at year end is not specified.
- ⚠ Whether a request spanning only weekends/holidays (zero deductible days) is allowed is not stated.
- ⚠ Behaviour of half-day requests on a multi-day range (e.g. half-day at start/end) is not defined; AC-082 covers single-day half-days only.
- ⚠ Where an HR override (AC-088) is applied in the flow (before or after submission/approval) and who may cancel an approved or pending leave request is not described; no employee cancellation or withdrawal story exists.
- ⚠ Pending days are shown separately (AC-090) but it is not stated whether pending days are reserved against the balance check for new requests.

### REQ-EPIC-007 · draft · source: requirements:EPIC-007

Single-step approval by the Reporting Manager of timesheets and leave, mandatory rejection comments, no self-approval with escalation, HR reopen of approved items, and in-app-only alerts.

EPIC-007: Single-Step Approval of Timesheets and Leave.

US-030 [critical] Review pending items for direct reports.
- AC-103: one pending list shows all submitted timesheets and leave requests of direct reports with employee name, item type, period/dates and submission date.
- AC-104: items from non-reports are not listed and cannot be opened by direct URL.
- AC-105: opening a pending timesheet shows per-day, per-project hours and period total read-only with approve and reject actions.

US-031 [critical] Approve a submitted item.
- AC-106: approved timesheet becomes 'Approved', locked against editing, leaves pending list.
- AC-107: approved leave becomes 'Approved' and days are deducted from the balance of that leave type.
- AC-108: employee gets an in-app alert; item shows approver name and decision timestamp.
- AC-109: approval is audit-logged.

US-032 [critical] Reject with mandatory comment.
- AC-110: rejection without a comment is refused and the field flagged.
- AC-111: with a comment, status becomes 'Rejected', returns to the employee as an editable draft and leaves pending list.
- AC-112: rejected leave deducts no days.
- AC-113: employee gets an in-app alert and the comment is visible on the item.

US-033 [high] No self-approval for multi-role users.
- AC-114: a manager's own submission is not in their own pending list; direct approval attempts are refused.
- AC-115: it routes to the manager's own reporting manager if set.
- AC-116: with no reporting manager, it routes to the HR Admin queue.
- AC-117: the escalation and the routed approver are audit-logged.

US-034 [medium] HR Admin reopens an approved item.
- AC-118: reopening an approved timesheet with a reason returns it to 'Draft', editable, no longer counted as approved.
- AC-119: reopening an approved leave request returns the deducted days to the balance.
- AC-120: reversal is audit-logged with identity, reason, previous status and timestamp.
- AC-121: Reporting Managers without HR Admin cannot reopen.

US-035 [medium] In-app alerts.
- AC-122: on next load, managers see an alert and pending-count indicator for submitted items.
- AC-123: submitters see an alert with item, outcome and any comment.
- AC-124: opening an alert marks it read and decreases the unread count.
- AC-125 (assumption): notifications are in-app only; no email or SMS.

ASSUMPTIONS RECORDED: approval is single-step (the Reporting Manager decides); approved items lock and are reopened only by HR Admin; no multi-level chains; manager dashboards/reports not in scope (pending-items list only).

**Related:** US-030, US-031, US-032, US-033, US-034, US-035

- ⚠ CONFLICT with confirmed understanding: it assumed in-app alerts plus transactional email; email was removed, so notifications are in-app only with no emailed notices or pending-approval reminder emails. Needs confirmation.
- ⚠ The confirmed understanding flagged single-step approval and the self-approval rule as the two most important points to check; their confirmation is not recorded in the input.
- ⚠ Self-approval edge cases are undefined: an HR Admin submitting their own item, a reporting chain with no eligible approver, and employees whose manager is a leaver.
- ⚠ What happens to pending items when an employee's reporting manager changes (US-009) is not defined.
- ⚠ Alert wording and retention are not specified; there is no alert history screen story.
- ⚠ Status wording conflict: 'returns to employee as an editable draft' (AC-111) versus status 'Rejected' (AC-063).
- ⚠ Manager dashboards and reports (team availability, project utilisation, headcount, leave liability) are out of scope for this version, though the Reporting Manager role description lists team availability and team reports.

### REQ-EPIC-008 · draft · source: requirements:EPIC-008

A home dashboard summarising the employee's timesheet, attendance and leave, mobile-responsive screens working at 360px, and a single-language interface with a single timezone and consistent date/time format.

EPIC-008: Employee Home Dashboard and Mobile-Responsive Portal.

US-036 [high] Home dashboard.
- AC-126: shows current timesheet period status, today's clock-in state, remaining leave balances and pending leave requests.
- AC-127: a draft timesheet shows a prompt and direct link to complete and submit.
- AC-128: if not clocked in, a 'Clock in' action is available on the dashboard.
- AC-129: a user who is also a Reporting Manager sees a count of items awaiting approval alongside the employee summary.

US-037 [high] Phone browser use.
- AC-130: at 360px width, dashboard, clock-in, leave request and timesheet screens are reachable with no horizontal scrolling or overlapping elements.
- AC-131: clock-in and submit-leave controls are large enough to tap and complete successfully.
- AC-132: weekly timesheet grid uses a mobile-appropriate layout rather than a cropped desktop table.
- AC-133: no native iOS/Android app is offered and no offline clock-in is available.

US-038 [low] Single-language interface and consistent date/time display.
- AC-134: all labels, messages and errors appear in the single configured language, with no language selector.
- AC-135: all timestamps are shown in the company's single timezone in one consistent format on every screen.

ASSUMPTIONS RECORDED: single-language English / the local language; mobile-responsive in browser only; dates and times in the company's single timezone.

**Related:** US-036, US-037, US-038

- ⚠ 'English / the local language' is ambiguous: which single language and which local language/timezone are used is not specified.
- ⚠ The date/time display format is not defined.
- ⚠ Only the 360px viewport is stated as a responsive target; other breakpoints and supported browsers are not listed.
- ⚠ Dashboard content for roles other than Employee/Reporting Manager (HR Admin, Project Manager, System Admin) is not defined.

### REQ-EPIC-009 · draft · source: requirements:EPIC-009

In-portal Help pages in the single configured language, with an employee guide and a role-restricted administrator guide covering only capabilities built in this version.

EPIC-009: Portal User Guide.

US-039 [medium] Employee user guide.
- AC-136: 'Help' contains a guide covering signing in, the home dashboard, entering and submitting timesheets, clocking in/out, requesting leave, half-day leave, balances, history and the holiday calendar.
- AC-137: tasks such as 'correct a rejected timesheet' have step-by-step instructions that match the built screens.
- AC-138: the guide is readable and navigable on a phone without horizontal scrolling.

US-040 [medium] Administrator user guide.
- AC-139: for administrative roles, 'Help' has an administrator section covering account creation and role assignment, employees and departments, projects and assignments, leave types and holidays, balances, attendance corrections, approving and reopening items, and the audit log.
- AC-140: a launch-setup section states the required order: departments, leave types and holidays, employees and reporting lines, accounts and roles, then projects and assignments.
- AC-141: Employee-only users see only the employee section.

ASSUMPTIONS RECORDED: delivered as in-portal help pages in the single configured language; video and interactive training are not included.

**Related:** US-039, US-040

- ⚠ The administrator guide must also cover the Reporting Manager approval tasks; US-040 lists approving items but names HR Admin, Project Manager and System Admin as audiences, not Reporting Manager. Confirm which section a Reporting Manager sees.
- ⚠ The guide must reflect the built screens only; because bulk import, email and reports are excluded, the guide content depends on confirmation of those scope items.
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v2  
**Delivery scope:** lightweight  
**Approved:** 2026-11-03

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

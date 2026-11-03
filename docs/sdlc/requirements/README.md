# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-SCOPE-001 · approved · source: requirements:delivery-scope-v1

Delivery scope is 'lightweight', requirements version 1. The in-scope capability list and an explicit out-of-scope list were both fixed by the product owner. Several capabilities named in the original project description sit outside this MVP.

In scope (as listed):
- Email/password sign-in; accounts created by an administrator only (no public self-registration).
- Employee profile records with department and reporting manager.
- Project records and employee-to-project assignments.
- Daily and weekly timesheet entry against assigned projects; submission with on-screen status.
- Browser clock-in/clock-out; punch times stamped by the server clock; no geofencing or location check.
- Leave request by type and date range; personal balance and history; half-day as smallest increment.
- Company holiday calendar view.
- Employee home dashboard (own timesheet, attendance, leave).
- Mobile-responsive screens usable on a phone browser.
- Single-language interface (English / the local language).
- In-portal user guide for employees and administrators.

Explicitly out of scope — do not design or build:
- SSO with company accounts (Google Workspace / Microsoft 365 / Azure AD).
- Automatic payroll system integration.
- Multi-country support (per-country calendars, leave rules, timezones) and multi-language UI.
- Biometric clock-in and badge/RFID terminal integration.
- Native iOS/Android apps, offline clock-in, push notifications.
- Payroll/salary processing, recruitment/ATS, performance reviews, expense claims, employee document storage.
- Email entirely (SendGrid was removed from the stack).

**Related:** REQ-STACK-001, REQ-E001, REQ-E002, REQ-E003, REQ-E004, REQ-E005, REQ-E006, REQ-E007, REQ-E008, REQ-E009

- ⚠ Project description's role table promises team reports, organisation-wide HR reports and project utilisation monitoring; these reporting dashboards are excluded from the lightweight MVP (EPIC-003, EPIC-007 notes) — conflict to confirm with the product owner.
- ⚠ Project description's RBAC requirement list is truncated mid-sentence ('2. Employees can') — the remaining numbered RBAC rules were never supplied.
- ⚠ No target launch date, milestone dates or release train recorded for this version.

### REQ-STACK-001 · approved · source: requirements:approved-technology-stack

The product owner approved an exact stack and an exact service list; substitutions are not permitted. Redis serves double duty as background queue and as session/dashboard cache. REDIS_URL is the only API key/config secret named.

Approved stack (design against exactly these):
- Frontend: React 19 — one responsive interface for desk (HR bulk work) and phone browser (clock-in); handles timesheet grids, leave calendars, approval queues; one shared screen set that shows/hides sections per role.
- Backend: FastAPI 0.115 — replaces the analyst's Node/TypeScript assumption (Node is not buildable on this platform). Rationale cites rules-heavy work: relationship-scoped permissions, self-approval escalation up the reporting line, leave accrual/carry-over maths, CSV/Excel import and export; Python is strong at spreadsheets and date arithmetic; tens of users at week-end peaks is within reach.
- Database: PostgreSQL 16 — system of record for people, hours, attendance and leave balances; enforces the employee→manager→project→timesheet-line relationships, prevents double-deducted balances, keeps the audit log append-only and searchable; 500 employees is a light load.
- Cloud: AWS — one managed region inside the company's own country for data residency; managed PostgreSQL with daily snapshots and point-in-time restore; encryption at rest; SES available if email is ever re-scoped.

Approved services (must appear in runtime needs):
- Queue: Redis as a queue (container redis:7-alpine) — background work: spreadsheet import of employees/opening balances at launch, month-end CSV/Excel payroll exports, nightly pending-approval reminders; with retries.
- Cache: Redis (container redis:7-alpine) — login sessions (so session timeout and failed-attempt lockout work reliably) and caching heavier dashboard figures (team availability, project utilisation, leave liability) during the month-end rush.

Secrets/keys required: REDIS_URL.

**Related:** REQ-SCOPE-001, REQ-NFR-COMP-001, REQ-NFR-OPS-001

- ⚠ Stack rationale justifies FastAPI and the Redis queue partly on CSV/Excel import and month-end export — but NFR-020 and the EPIC-002/EPIC-004 notes exclude bulk import and payroll export from this version. Conflict: confirm whether import/export is in or out.
- ⚠ Queue rationale names 'nightly pending-approval reminders' sent by email, but email is out of scope and NFR-019 states no reminders are sent. Conflict to resolve.
- ⚠ Stack rationale names 'leave accrual and carry-over maths', but EPIC-006 excludes automated accrual/carry-over from this version. Conflict to resolve.
- ⚠ Queue and cache rationale references team-availability / project-utilisation / leave-liability dashboards that EPIC-007 places out of MVP scope.
- ⚠ The specific AWS region (the 'company's own country') is not named in the input.

### REQ-E001 · draft · source: requirements:EPIC-001

EPIC-001 covers secure access, administrator-created accounts and role-based permissions. Five fixed roles whose permissions combine as a union, with access additionally scoped by reporting/project relationship. Includes session timeout, lockout, administrator-issued password reset and an immutable audit log.

Stories:
- US-001 [critical] Sign in with email and password (AC-001..AC-004): correct credentials → home dashboard; wrong password → generic 'email or password is incorrect'; deactivated account → refused, told to contact an administrator; only a salted one-way hash is stored, never plaintext in the record or logs.
- US-002 [critical] System Admin creates accounts, no self-registration (AC-005..AC-009): account created active, linked to an employee record, may hold several roles; no registration screen exists and signed-out users are redirected to sign-in; duplicate email rejected; HR Admins refused access to account/role management; create/edit/deactivate written to the audit log with actor, action, account, server timestamp.
- US-003 [high] Permissions combine as a union (AC-010..AC-012): Employee + Project Manager sees both screen sets; Employee-only sees no admin screens and direct URLs are refused; removing a role removes its screens on next load.
- US-004 [critical] Access scoped by relationship (AC-013..AC-016): manager sees only direct reports (other IDs → authorisation error); Project Manager sees only their own project's hours; Employee sees only own records; HR Admin maintains people data org-wide but cannot open accounts, roles or system configuration.
- US-005 [high] Session timeout and lockout (AC-017..AC-020): idle session ends and returns to sign-in; N consecutive failed attempts locks the account even for the correct password; System Admin unlock restores access and is audit-logged; sign-out invalidates the session so browser-back shows no protected pages.
- US-006 [high] Administrator-issued password reset (AC-021..AC-024): no emailed self-service link; System Admin generates a one-time password shown once and the stored hash is replaced; user must set a new password before reaching any other screen; reset recorded in the audit log.
- US-007 [high] Immutable audit log (AC-025..AC-028): approvals/rejections record actor, action, record, comment, server timestamp; HR edits, punch corrections and reopens record before/after values; no interface or API can edit or delete an entry; only System Admins may read it.

Epic assumptions recorded as needing confirmation: app-managed email/password auth with hashing, timeout and lockout; five fixed roles with predefined permission sets (no custom roles, no per-permission toggles); SSO out of scope; employee data is personal data with no special-category data; minimal audit logging is a firm requirement rather than an assumption.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, REQ-NFR-SEC-001, REQ-NFR-COMP-001

- ⚠ CONFLICT: the confirmed understanding assumed password reset by emailed link; this version delivers administrator-issued resets because email was removed from scope (AC-021, NFR-018). Needs product-owner confirmation.
- ⚠ Numeric values unspecified: session timeout duration, number of failed attempts before lockout, one-time-password validity window.
- ⚠ Audit log retention period, export format and search/filter capability are not specified.
- ⚠ Account-unlock path when no System Admin is available is not described.
- ⚠ Whether a locked account also notifies anyone in-app is not stated.

### REQ-E002 · draft · source: requirements:EPIC-002

EPIC-002 covers employee profile records, the shared department list and reporting lines. Employees self-maintain permitted contact details; HR Admins own the records, the org structure, leaver marking and personal-data erasure. Reporting managers get a team list derived from the reporting-manager field.

Stories:
- US-008 [high] View/update my own profile (AC-029..AC-031): profile shows name, employee ID, department, reporting manager, work email, contact details; editable contact fields save with on-screen confirmation and an audit entry; department, reporting manager and employee ID are read-only and direct update requests are refused.
- US-009 [critical] HR Admin maintains employee records (AC-032..AC-035): create/edit with name, employee ID, work email, department, reporting manager, start date; missing mandatory fields flagged and nothing saved; changing reporting manager moves the employee between team lists; every field change logged with field, old value, new value, actor, timestamp.
- US-010 [medium] Leavers and erasure (AC-036..AC-038): marking a leaver with an end date removes them from active team lists and assignment pickers and deactivates their portal account; erasure irreversibly removes identifying personal fields while the audit log retains who erased and when; non-HR actors refused.
- US-011 [medium] Department list (AC-039..AC-041): HR Admin adds departments that become selectable on employee records; deletion refused while employees are assigned, with the count named; one shared list, no per-country/per-entity variants.
- US-012 [high] Manager views direct reports (AC-042..AC-043): 'My Team' lists exactly the employees whose reporting manager is the signed-in user, with department and current leave/timesheet status; non-reports are neither listed nor reachable.

Epic assumptions recorded as needing confirmation: employee data is personal data with role/relationship restriction and HR correction/erasure rights; the split of employee-editable (contact) vs HR-only (employment) fields; bulk import from CSV/Excel was in the confirmed understanding but is NOT in the lightweight capability set — records are created one at a time in-portal; document storage is out of scope.

**Related:** US-008, US-009, US-010, US-011, US-012, REQ-NFR-PRIV-001

- ⚠ Field-level edit matrix (which profile fields an employee may change vs HR-only) is assumed, not confirmed.
- ⚠ Bulk import exclusion is flagged by the input itself as onerous for several hundred launch records — confirmation required.
- ⚠ The exact set of 'identifying personal fields' removed on erasure is not enumerated.
- ⚠ Circular or missing reporting-manager cases (e.g. the CEO, a manager who leaves) are not covered by any acceptance criterion.
- ⚠ No department hierarchy or department-head concept is defined — flat list only.

### REQ-E003 · draft · source: requirements:EPIC-003

EPIC-003 covers project records and employee-to-project assignments, which drive both what an employee can book hours against and what a Project Manager can see. Allocated hours are captured for later comparison but no utilisation reporting is in this version.

Stories:
- US-013 [high] Create and manage projects (AC-044..AC-046): create with name, code, start date, status 'active'; a Project Manager sees only their own projects and opening another by ID is refused; setting a project to 'closed' removes it from timesheet pickers while historic hours remain visible on submitted timesheets.
- US-014 [high] Assign employees to projects (AC-047..AC-049): assignment with optional allocated-hours figure puts the project in that employee's timesheet picker; removing an assignment stops new entries but retains recorded hours; assigning to a project the user does not manage is refused with an authorisation error.
- US-015 [medium] Employee sees own assignments (AC-050..AC-051): 'My Projects' lists name, code, status; with no assignments an empty-state message explains a Project Manager must assign them before project hours can be logged.

Epic assumptions recorded as needing confirmation: Project Managers see only projects they are assigned to; allocated hours per assignment are captured so allocated-vs-actual is possible later, but the reporting dashboards are not in this MVP.

**Related:** US-013, US-014, US-015, REQ-E004

- ⚠ Who assigns a Project Manager to a project (System Admin, HR Admin, or another PM) is not stated in any story.
- ⚠ Project uniqueness rules (duplicate project codes) and end-date handling are not specified.
- ⚠ No story covers what happens to an employee's assignments when they are marked a leaver, beyond removal from assignment pickers (US-010).

### REQ-E004 · draft · source: requirements:EPIC-004

EPIC-004 covers daily and weekly timesheet entry against assigned projects, submission for approval, on-screen status tracking and the correct-and-resubmit loop after a rejection. Timesheet hours are project effort and are deliberately separate from attendance punches.

Stories:
- US-016 [critical] Log daily hours (AC-052..AC-055): e.g. 7.5 hours against an assigned project saves as a draft shown against that date; the picker lists only active projects the user is currently assigned to; entries pushing a day's total above 24 hours are rejected with a daily-maximum message; negative or non-numeric values are rejected and the field flagged.
- US-017 [high] Weekly grid (AC-056..AC-058): row per assigned project, column per day, with row, column and week totals; edited cells save and persist across reload; previous/next week navigation shows that week's entries and status.
- US-018 [critical] Submit and track status (AC-059..AC-062): submitting a draft with at least one entry sets status 'Submitted', makes entries read-only and places it in the reporting manager's pending list; an empty timesheet cannot be submitted; the timesheet list shows Draft/Submitted/Approved/Rejected with decision date and manager comment; a Submitted timesheet cannot be edited until rejected or reopened by HR.
- US-019 [high] Correct and resubmit (AC-063..AC-065): a rejected timesheet shows status 'Rejected' with the manager's comment and becomes editable; resubmission returns it to 'Submitted' and to the manager's pending list; item history lists the rejection with its comment and the resubmission in order with timestamps.

Epic assumptions recorded as needing confirmation: the timesheet period is a calendar week with hours per day per project; validation limits such as 24 hours/day; timesheet hours are not reconciled with attendance punches in this version; CSV/Excel export of approved timesheets for payroll is not in this capability set.

**Related:** US-016, US-017, US-018, US-019, REQ-E003, REQ-E007

- ⚠ Weekly period and the 24-hour daily cap are assumptions awaiting confirmation.
- ⚠ No submission deadline, late-week reminder or period-locking rule is defined.
- ⚠ No story lets an employee withdraw or recall a Submitted timesheet before a decision.
- ⚠ Payroll export of approved hours is excluded, so the downstream consumption path for approved data is undefined.
- ⚠ Behaviour when a project is closed or an assignment is removed mid-week (partially filled grid) is only partly covered.

### REQ-E005 · draft · source: requirements:EPIC-005

EPIC-005 covers browser-based attendance: one clock-in and one clock-out per calendar day, stamped by the server clock, with personal attendance history and HR correction of missed punches. It is a module distinct from timesheets.

Stories:
- US-020 [critical] Clock in/out from any browser (AC-066..AC-070): 'Clock in' creates today's record with a server-clock arrival time and shows the user as clocked in; 'Clock out' records departure and displays the worked duration; once clocked in, the Clock-in action is unavailable and the arrival time is shown; an incorrect device clock has no effect; a phone browser on any network is accepted with no location, geofence or device check.
- US-021 [high] My attendance history (AC-071..AC-073): the current month lists each day with arrival, departure and worked duration; a day with a clock-in and no clock-out is flagged incomplete with no duration; requesting another employee's attendance is refused.
- US-022 [high] HR views and corrects punches (AC-074..AC-077): HR Admin opens a date and sees every employee's arrival/departure with incomplete punches flagged; setting a missing time with a reason marks the record regularised and recalculates the worked duration; the correction is audit-logged with actor, original value, corrected value, reason and timestamp; Reporting Managers and Employees without HR Admin are refused.

Epic assumptions recorded as needing confirmation: punches are browser-based and server-stamped with no geofencing; biometrics and badge/RFID terminals are out of scope; one clock-in and one clock-out per calendar day with no break punches; HR regularisation is included minimally while the attendance reports in the confirmed understanding (late arrivals, early departures, absent days, hours per period) are NOT in this MVP.

**Related:** US-020, US-021, US-022, REQ-NFR-SEC-001

- ⚠ One-punch-pair-per-day and no break punching are assumptions awaiting confirmation.
- ⚠ No rule for an overnight shift or a clock-out that falls on the next calendar day.
- ⚠ No auto-close or escalation for a clock-in that is never followed by a clock-out.
- ⚠ Employees cannot request a regularisation themselves — only HR can correct; no request path is defined.
- ⚠ Attendance reporting is excluded, so there is no in-portal view of absence/lateness trends.

### REQ-E006 · draft · source: requirements:EPIC-006

EPIC-006 covers leave requests by type and date range, half-day increments, day-count validation against weekends/holidays/balance, personal balances and history, the shared holiday calendar, and HR configuration of leave types, entitlements, opening balances and holidays.

Stories:
- US-023 [critical] Apply for leave (AC-078..AC-081): type + date range + reason creates a 'Submitted' request showing the deducted day count and appearing in the manager's pending list; end date before start date is refused with the date fields flagged; a range overlapping an existing submitted/approved request is refused naming the overlap; only HR-active leave types are offered.
- US-024 [high] Half-day leave (AC-082..AC-084): for a single day the user picks 'first half' or 'second half' and the request is 0.5 days with the chosen half shown; nothing smaller than 0.5 days is selectable; approval deducts exactly 0.5 days.
- US-025 [high] Day-count and balance validation (AC-085..AC-088): weekend days excluded from the deducted total and shown as non-working in the breakdown; dates on the company holiday calendar excluded; a request above the remaining balance is refused stating available days and the shortfall; an HR Admin override lets it proceed, shows the resulting negative balance and is audit-logged.
- US-026 [critical] My leave balances (AC-089..AC-091): per type, entitlement / taken / remaining (e.g. 20 / 5 / 15); days on an undecided request show separately as pending and are not yet in 'taken'; on approval pending moves to taken and remaining reduces.
- US-027 [high] My leave history (AC-092..AC-094): all requests most recent first with type, dates, day count, status, decision date; a rejected request shows the manager's comment and rejection timestamp; filterable by leave type or status.
- US-028 [medium] Company holiday calendar (AC-095..AC-097): holidays listed with date, day of week and name; one shared calendar with no country/region selector; another year selectable where holidays exist.
- US-029 [critical] HR configuration (AC-098..AC-102): create a leave type with annual entitlement and active flag so it appears on requests and balance views; unpaid types skip the balance check; setting or adjusting an employee's opening balance updates remaining and is logged with old and new values; adding/editing/removing holiday dates affects future day-count calculations and is logged; Reporting Managers without HR Admin are refused.

Epic assumptions recorded as needing confirmation: each leave type carries an annual entitlement, balances deduct on approval, half-day is the smallest increment, and over-balance requests are blocked unless HR overrides; accrual and carry-over were in the confirmed understanding but automated accrual/carry-over processing is NOT included — entitlement is an annual figure per employee; one shared holiday calendar and one policy set for a single country/timezone; no special-category data, so sickness leave carries no medical certificate or health detail.

**Related:** US-023, US-024, US-025, US-026, US-027, US-028, US-029, REQ-NFR-OPS-001

- ⚠ Automated accrual and carry-over are excluded from this version — explicitly flagged as needing confirmation.
- ⚠ The leave-year boundary (calendar year vs financial year) and what happens to unused entitlement at year end are undefined.
- ⚠ No story covers an employee cancelling or amending a submitted or already-approved leave request.
- ⚠ Interaction between approved leave and attendance/timesheets (e.g. whether a leave day blocks a punch or a timesheet entry) is not specified.
- ⚠ Whether a half-day can be combined with a multi-day range (half-day start or end) is not stated — AC-082 covers a single day only.

### REQ-E007 · draft · source: requirements:EPIC-007

EPIC-007 covers single-step approval of timesheets and leave by the Reporting Manager, with a mandatory rejection comment, in-app alerts, a no-self-approval escalation rule, and HR Admin reopening of approved items. This epic carries the two assumptions the confirmed understanding flagged as most important to check.

Stories:
- US-030 [critical] Pending approvals list (AC-103..AC-105): one list of all direct-report submissions with employee name, item type, period/dates, submission date; items from non-reports are not listed and cannot be opened by direct URL; opening a pending timesheet shows per-day, per-project hours and the period total read-only beside approve/reject.
- US-031 [critical] Approve (AC-106..AC-109): approving a timesheet sets 'Approved', locks it against employee editing and clears it from the pending list; approving leave deducts the days from the relevant balance; the employee sees an in-app alert and the approver's name and decision timestamp on the item; the approval is audit-logged.
- US-032 [critical] Reject with mandatory comment (AC-110..AC-113): rejection without a comment is refused and the field flagged; confirming sets 'Rejected', returns the item to the employee as an editable draft and clears the pending list; a rejected leave request deducts no days; the employee gets an in-app alert and sees the comment on the item.
- US-033 [high] No self-approval (AC-114..AC-117): a multi-role user never sees their own submission in their pending list and a direct approve attempt is refused; their item routes to their own reporting manager; where they have none it routes to the HR Admin queue; the escalation and the approver it was routed to are audit-logged.
- US-034 [medium] HR reopens an approved item (AC-118..AC-121): reopening with a reason returns a timesheet to 'Draft' and makes it editable and no longer counted as approved; a reopened leave request returns the deducted days to the balance; the reversal is logged with actor, reason, previous status and timestamp; Reporting Managers without HR Admin are refused.
- US-035 [medium] In-app alerts (AC-122..AC-125): a submission raises an alert and pending-count indicator for the approver; a decision raises an alert stating the item, outcome and any comment; opening an alert marks it read and reduces the unread count; notifications are in-app only — no email or SMS.

Epic assumptions recorded as needing confirmation: approval is SINGLE-STEP with no multi-level chains; rejected items return as editable drafts and approved items lock until HR reopens with an audit-logged reversal; multi-role users cannot approve their own submissions and these escalate up the reporting line or to HR; manager dashboards and reports (team availability, project utilisation, headcount, leave liability) are not in this MVP — managers see a pending-items list only.

**Related:** US-030, US-031, US-032, US-033, US-034, US-035, REQ-E004, REQ-E006

- ⚠ CONFLICT: the confirmed understanding assumed in-app alerts PLUS transactional email; email has been removed, so this version is in-app only with no submission/decision emails and no pending-approval reminder emails (AC-125, NFR-019). Needs confirmation.
- ⚠ Single-step approval and the self-approval escalation rule are the two assumptions explicitly flagged as highest priority to confirm.
- ⚠ No story describes the HR Admin approval queue screen that escalated items land in (AC-116) — only that items route there.
- ⚠ No delegation or out-of-office cover is defined when a reporting manager is absent.
- ⚠ No SLA, ageing indicator or auto-escalation for items left undecided.

### REQ-E008 · draft · source: requirements:EPIC-008

EPIC-008 covers the employee home dashboard summarising timesheet, attendance and leave, plus mobile-responsive behaviour at a 360px viewport and a single-language, single-timezone presentation.

Stories:
- US-036 [high] Home dashboard (AC-126..AC-129): shows current timesheet period status, today's clock-in state, remaining leave balances and pending leave requests; a draft timesheet raises a prompt with a direct link to complete and submit; a 'Clock in' action appears when today has no punch; users who also hold Reporting Manager see a count of items awaiting their approval alongside their own summary.
- US-037 [high] Phone browser use (AC-130..AC-133): at a 360px viewport the dashboard, clock-in, leave request and timesheet screens are fully reachable with no horizontal scrolling and no overlapping elements; clock-in and submit-leave controls are large enough to tap and complete successfully; the weekly grid uses a mobile-appropriate layout rather than a cropped desktop table; no native app is offered and no offline clock-in exists.
- US-038 [low] Single language and consistent date/time (AC-134..AC-135): all labels, messages and errors in the single configured language with no language selector; punch, submission and decision timestamps rendered in the company's single timezone with one consistent format on every screen.

Epic assumptions recorded as needing confirmation: single-language interface (English / the local language) with multi-language out of scope; mobile-responsive browser only, with native apps, offline clock-in and push notifications out of scope; dates and times displayed in the company's single timezone.

**Related:** US-036, US-037, US-038, REQ-NFR-UX-001

- ⚠ The configured language and the company timezone are never named in the input.
- ⚠ The date/time format to be used consistently is not specified.
- ⚠ No supported-browser matrix and no accessibility (e.g. WCAG) requirement is stated.
- ⚠ Dashboard content for HR Admin, Project Manager and System Admin roles is not described — only the employee view plus a manager approval count.

### REQ-E009 · draft · source: requirements:EPIC-009

EPIC-009 requires in-portal help pages: an employee guide for personal tasks and an administrator guide for setup and administration, including a prescribed launch-setup order. The administrator section is hidden from Employee-only users.

Stories:
- US-039 [medium] Employee guide (AC-136..AC-138): 'Help' covers signing in, the home dashboard, entering and submitting timesheets, clocking in and out, requesting leave, half-day leave, balances, history and the holiday calendar; task lookups such as 'correct a rejected timesheet' give step-by-step instructions matching the screens actually built; readable on a phone browser without horizontal scrolling.
- US-040 [medium] Administrator guide (AC-139..AC-141): covers creating accounts and assigning roles, maintaining employees and departments, creating projects and assignments, configuring leave types and holidays, setting balances, correcting attendance punches, approving and reopening items, and reading the audit log; the launch-setup section states the required order — departments, leave types and holidays, employees and reporting lines, accounts and roles, then projects and assignments; users holding only the Employee role see the employee section only.

Epic assumptions recorded as needing confirmation: the guide is delivered as in-portal help pages in the single configured language and covers only the capabilities built in this version; video and interactive training material are not included.

**Related:** US-039, US-040, REQ-E008

- ⚠ AC-137 requires instructions matching the screens actually built, but no screens exist yet — the guide cannot be written or verified until development produces them.
- ⚠ No owner is named for authoring and maintaining the help content, and no update trigger when screens change.
- ⚠ No searchability or contextual-help requirement is stated for the help pages.

### REQ-NFR-SEC-001 · approved · source: requirements:NFR-001..NFR-006,NFR-008

Seven security non-functional requirements govern credential storage, sign-in messaging, absence of a registration route, server-side permission checks, session invalidation, server-clock punches and encryption.

- NFR-001 Passwords stored only as salted one-way hashes; never in the user record, any DB field or application logs (US-001, US-006).
- NFR-002 Failed sign-in returns a single generic 'email or password is incorrect' so account existence cannot be probed (US-001).
- NFR-003 No publicly reachable registration or account-creation page; signed-out attempts land on sign-in (US-002).
- NFR-004 Permissions enforced server-side on every request — hiding menus is not enough; requests for another person's record, another manager's team, another project's hours or another queue's approvals by direct address or ID are refused with an authorisation error and no data (US-003, US-004, US-013, US-014, US-021, US-022, US-030, US-033, US-034).
- NFR-005 Sessions invalidated server-side on timeout and sign-out; protected pages unviewable including via browser back (US-005).
- NFR-006 Punch times stamped from the server clock, not the device (US-020).
- NFR-008 All browser↔portal traffic and all stored employee, timesheet, attendance and leave data encrypted in transit and at rest (whole system).

**Related:** REQ-E001, REQ-E005, US-001, US-002, US-003, US-004, US-005, US-006, US-020

- ⚠ No specified hashing algorithm or work factor for NFR-001.
- ⚠ No penetration test, security review or vulnerability-scanning requirement is recorded.
- ⚠ No rate-limiting requirement on sign-in beyond account lockout (US-005).

### REQ-NFR-PRIV-001 · approved · source: requirements:NFR-007,NFR-009

Two privacy non-functional requirements restrict who may see personal records and make leaver erasure irreversible yet accountable.

- NFR-007 Employee, timesheet, attendance and leave records are personal data, visible only to the subject, their reporting manager, a project manager for that project's hours, and HR Admins; no special-category data (health records, medical certificates, biometrics) is stored anywhere in the portal (US-004, US-021, US-023).
- NFR-009 HR erasure of a leaver's identifying fields must be irreversible, while the audit log still shows who carried out the erasure and when (US-010).

**Related:** REQ-E002, US-004, US-010, US-021, US-023

- ⚠ No data-retention schedule is defined for employee, timesheet, attendance or leave records after an employee leaves.
- ⚠ No subject-access-request (data export to the employee) capability is specified.
- ⚠ No named data-protection regulation was supplied with the project, so these privacy controls are not traced to a specific legal obligation.

### REQ-NFR-COMP-001 · approved · source: requirements:NFR-010,NFR-011

Two compliance non-functional requirements: an append-only, System-Admin-only audit log covering all consequential actions, and single-region hosting inside the company's own country for data residency.

- NFR-010 Every approval, rejection, escalation, record change, balance adjustment, attendance correction and administrative action is written with actor, action, affected record, before/after values where a field changed, and the server timestamp; no interface or service call may edit or delete an entry; only System Admins may read it (US-007, US-002, US-009, US-022, US-029, US-031, US-034).
- NFR-011 The portal and its database run in a single managed cloud region inside the company's own country, to keep the data-residency promise made to staff (whole system).

**Related:** REQ-E001, REQ-STACK-001, US-002, US-007, US-009, US-022, US-029, US-031, US-034

- ⚠ The company's country and the specific AWS region are not named.
- ⚠ No audit-log retention period, archival or tamper-evidence mechanism (e.g. hashing/WORM storage) is specified beyond 'append-only'.
- ⚠ No industry or domain compliance skill was provided with this project, so no named regulation has been mapped to these controls.

### REQ-NFR-OPS-001 · approved · source: requirements:NFR-012..NFR-015

Four operational non-functional requirements cover daily backups with point-in-time restore, an accepted single-region no-failover risk, sizing for 100-500 employees with week-end peaks, and transactional integrity of leave balances.

- NFR-012 Daily automated backups of the system-of-record database with point-in-time restore (whole system).
- NFR-013 (accepted risk) Standard single-region deployment with no HA or failover — a regional or database outage takes the portal offline until restored (whole system).
- NFR-014 Sized for roughly 100-500 employees and tens of concurrent users, peaking at week-end timesheet submission and month-end approval; no horizontal scaling required (whole system).
- NFR-015 A leave balance must never be double-deducted or left half-updated when an approval and an HR correction/override coincide; balance and status changes applied as a single all-or-nothing update (US-025, US-026, US-031, US-034).

**Related:** REQ-STACK-001, REQ-E006, US-025, US-026, US-031, US-034

- ⚠ No RTO/RPO figures accompany the backup requirement, and no backup-restore test cadence is defined.
- ⚠ No response-time or page-load performance targets are stated, only user and record volumes.
- ⚠ No monitoring, alerting or uptime-target requirement is recorded.

### REQ-NFR-UX-001 · approved · source: requirements:NFR-016..NFR-020

Five usability non-functional requirements, three of which are explicitly accepted risks arising from the removal of email and bulk import from scope.

- NFR-016 Every screen a working employee needs (dashboard, clock-in, leave request, weekly timesheet, help pages) fully usable at a 360px mobile viewport: no horizontal scrolling, no overlapping elements, tap-accurate controls (US-037, US-039, US-020, US-036).
- NFR-017 One configured language with no language selector; one timezone and one date/time format on every screen (US-038).
- NFR-018 (accepted risk) No self-service password reset link; users wait for a System Admin to issue and hand over a one-time password — accepted as slower (US-006).
- NFR-019 (accepted risk) Notifications are in-app only; no email, SMS or push and no pending-approval reminders, so waiting items are only discovered on next sign-in (US-035, US-030, US-031, US-032).
- NFR-020 (accepted risk) No bulk import: employees, departments, leave types, holidays and opening balances are created one at a time — accepted as onerous for several hundred launch records (US-009, US-011, US-029).

**Related:** REQ-E008, REQ-E009, US-006, US-009, US-011, US-020, US-029, US-030, US-031, US-032, US-035, US-036, US-037, US-038, US-039

- ⚠ NFR-018, NFR-019 and NFR-020 are accepted risks that directly contradict parts of the confirmed understanding and parts of the stack rationale — see top-level conflicts.
- ⚠ No accessibility standard accompanies the mobile usability target.

### REQ-NFR-MAINT-001 · approved · source: requirements:NFR-021,NFR-022

Two maintainability non-functional requirements fix the role model and confine the product to a single organisation.

- NFR-021 Five fixed roles (Employee, Reporting Manager, HR Admin, Project Manager, System Admin) with predefined permission sets that combine as a union; System Admins assign and combine roles but cannot create roles or toggle individual permissions (US-002, US-003).
- NFR-022 Single organisation: one shared department list, one set of leave policies, one holiday calendar; no client onboarding, workspace isolation or per-country variation (US-011, US-028).

**Related:** REQ-E001, REQ-E002, US-002, US-003, US-011, US-028

- ⚠ The authoritative permission matrix per role is described narratively across stories but is not recorded as a single consolidated table in the requirements input.
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
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

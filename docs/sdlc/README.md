# HRMS portal — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
Develop a modern, responsive HRMS portal with secure login and role-based access for Employees, Managers, HR, and Admins.

Employee Management: Manage employee profiles, departments, reporting managers, and project assignments.

Timesheet Management: Allow employees to log daily/weekly working hours, select projects, submit timesheets, and track approval status.

Leave Management: Enable employees to apply for leave, check leave balances, view leave history, and track requests.

Approval Workflows: Allow managers to approve/reject timesheets and leave requests with comments and notifications.

## HRMS Portal – User Roles and Permissions

| Role              | Permissions                                                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Employee          | View/update own profile, submit daily/weekly timesheets, apply for leave, check leave balances, view holidays, and track approval status.           |
| Reporting Manager | All employee permissions, view team members, approve/reject team timesheets and leave requests, monitor team availability, and access team reports. |
| HR Admin          | Manage employee records, departments, leave policies, leave balances, holiday calendars, attendance records, and organization-wide HR reports.      |
| Project Manager   | Create/manage projects, assign employees to projects, review project-specific timesheets, and monitor project utilization and allocated hours.      |
| System Admin      | Manage users, roles, permissions, organization settings, system configurations, and audit logs with full administrative access.                     |

### Role-Based Access Control (RBAC) Requirements

1. Users must log in securely and access only features permitted for their roles.
2. Employees can

**Documentation version:** v14
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v2 approved |
| [Architecture](architecture/README.md) | 22 entries |
| [Development](development/README.md) | 5 entries |
| [Testing](testing/README.md) | 3 entries |
| [Deployment](deployment/README.md) | 1 entry |
| [Maintenance](maintenance/README.md) | 1 entry |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 10 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 23 routes |
| [Test report](testing/test-report.md) | running |
| [Tests](testing/test-cases.md) | 116 tests |
| [Deployment guide](deployment/deployment-guide.md) | deployed |
| [Runbook](deployment/runbook.md) | deployed |
| [Release notes](deployment/release-notes.md) | 4 releases |
| [Traceability matrix](traceability-matrix.md) | 43 requirements |
| [Changelog](CHANGELOG.md) | 14 versions |
<!-- sdlc:auto:end contents -->

## Open gaps

<!-- sdlc:auto:start open-gaps -->
### Requirements

- Project description text is truncated at 'RBAC Requirements ... 2. Employees can', so RBAC requirement items beyond item 1 were not provided.
- Project description lists Reporting Manager 'monitor team availability' and 'team reports', HR Admin 'organization-wide HR reports' and Project Manager 'monitor project utilization', but EPIC-003, EPIC-005 and EPIC-007 state dashboards and reports are NOT in this lightweight scope. Descriptions and scope conflict; confirm that these are deferred.
- Project description says approval workflows include 'notifications'; this version delivers in-app notifications only (email removed). Confirm.
- Project description assigns Project Managers the ability to 'review project-specific timesheets', but no user story defines a project timesheet review screen. Only AC-014 mentions visibility of hours booked to the PM's own project.
- No approval of the requirements by a named person or date is recorded in the input beyond the product owner approving the technology stack and services.
- The Redis queue rationale (bulk spreadsheet import, payroll CSV/Excel export, nightly pending-approval reminder emails) refers to capabilities that other inputs exclude from this version: bulk import (EPIC-002 assumptions), CSV/Excel export (EPIC-004 assumptions), and email reminders (EPIC-007, out-of-scope list). The queue's purpose in this version is unclear; confirm.
- Cache rationale mentions team availability, project utilisation and leave liability dashboards, which are not in the lightweight scope (EPIC-003, EPIC-007).
- Stack rationale mentions Amazon SES as an option, while email is declared out of scope. Confirm SES is not to be provisioned.
- Scale is stated inconsistently: 'tens of users at week-end peaks' versus '500 employees' punches and timesheets'. Capacity expectations need confirming.
- Session timeout duration and lockout attempt threshold are described only as 'configured'; no values are given.
- Stack text refers to the analyst's earlier Node/TypeScript assumption; US-041/US-043 reference SignIn.tsx. Confirm the frontend is TypeScript-based React.
- CONFLICT with confirmed understanding: it assumed emailed password-reset links, but email was removed from scope, so only administrator-issued resets are delivered. Needs confirmation.
- Session timeout duration and lockout attempt count are not specified ('configured'); no default values or where they are configured is stated.
- US-007 says the audit log covers 'approvals, changes and admin actions', while the epic describes it as 'minimal level'. The exact event list should be confirmed (e.g. sign-ins, lockouts are only partly mentioned: unlock and password change are).
- AC-027 requires immutability even against System Admin; the mechanism (e.g. DB-level append-only) is not specified in requirements.
- US-041 to US-043 describe implementation-level defects/tests (SignIn.tsx field mapping) rather than user needs; the original source of this defect is not stated.
- US-042 AC-146 says 'current password is required for the change' conditionally; whether the one-time-password flow also requires the current password is ambiguous.
- No story covers viewing, unlocking or deactivating accounts beyond AC-003, AC-009 and AC-019; reactivation of a deactivated account is not described.
- US-004 is worded 'As a the company', not a user persona; this is a minor text issue in the source.
- Which profile fields are employee-editable versus HR-only is assumed (contact details editable; employment data HR-only) and needs confirmation.
- Bulk import of employees, departments and opening balances from CSV/Excel was in the confirmed understanding but is not in the lightweight scope; records are created one at a time. Confirm, since creating several hundred records manually at launch is onerous.
- Erasure (AC-037) conflicts potentially with audit log immutability (AC-027) regarding personal data already inside audit before/after values; handling is not specified.
- Relationship between a 'leaver' flag and a later erasure of linked records (timesheets, leave) is not defined.
- 'Current leave/timesheet status' on 'My Team' (AC-042) is not further defined.
- No definition of the employee directory screen's access (who may search/view all) beyond HR Admin.
- Ambiguity: AC-044 has a Project Manager creating a project, yet AC-045 says PMs see only projects they are 'assigned to'. How a creator becomes the manager of a project is not specified.
- Whether a project can have several Project Managers, and how a PM is assigned to a project, is not defined.
- Project end date, reopening a closed project, and editing/deleting projects are not specified.
- Allocated-versus-actual utilisation reporting is explicitly not in scope, though the Project Manager role description mentions monitoring utilisation and allocated hours.
- Validation limits (e.g. 24 hours/day maximum) are assumed and need confirmation.
- AC-054 example is internally unclear (8 hours already entered; the 24-hour limit would require adding over 16 hours); confirm the intended rule, including whether the limit applies across projects.
- Status wording is inconsistent: AC-063 shows status 'Rejected' while the item is editable, whereas AC-111 says the item 'returns as an editable draft'. Confirm the status model.
- CSV/Excel export of approved timesheets for payroll was in the confirmed understanding but is not in the lightweight scope.
- Whether the weekly week starts on Monday or another day is not stated.
- Behaviour for weeks that span a project assignment ending, or hours entered for holidays/leave days, is not defined.
- Attendance reports (late arrivals, early departures, absent days, hours per period) from the confirmed understanding are NOT in the lightweight scope.
- One-punch-pair-per-day is assumed; confirm that mid-day breaks and multiple shifts are not needed.
- HR correction of a missed clock-in (arrival time) or a wholly missing day is not explicitly covered (AC-075 describes setting a departure time).
- Handling of an unclosed punch spanning midnight or an auto close-out is not specified.
- The 'company's single timezone' value is not named.
- Accrual and carry-over rules were in the confirmed understanding but are NOT included; entitlement is a single annual figure per employee. Needs confirmation.
- Leave-year definition (calendar vs financial year) and what happens to balances at year end is not specified.
- Whether a request spanning only weekends/holidays (zero deductible days) is allowed is not stated.
- Behaviour of half-day requests on a multi-day range (e.g. half-day at start/end) is not defined; AC-082 covers single-day half-days only.
- Where an HR override (AC-088) is applied in the flow (before or after submission/approval) and who may cancel an approved or pending leave request is not described; no employee cancellation or withdrawal story exists.
- Pending days are shown separately (AC-090) but it is not stated whether pending days are reserved against the balance check for new requests.
- CONFLICT with confirmed understanding: it assumed in-app alerts plus transactional email; email was removed, so notifications are in-app only with no emailed notices or pending-approval reminder emails. Needs confirmation.
- The confirmed understanding flagged single-step approval and the self-approval rule as the two most important points to check; their confirmation is not recorded in the input.
- Self-approval edge cases are undefined: an HR Admin submitting their own item, a reporting chain with no eligible approver, and employees whose manager is a leaver.
- What happens to pending items when an employee's reporting manager changes (US-009) is not defined.
- Alert wording and retention are not specified; there is no alert history screen story.
- Status wording conflict: 'returns to employee as an editable draft' (AC-111) versus status 'Rejected' (AC-063).
- Manager dashboards and reports (team availability, project utilisation, headcount, leave liability) are out of scope for this version, though the Reporting Manager role description lists team availability and team reports.
- 'English / the local language' is ambiguous: which single language and which local language/timezone are used is not specified.
- The date/time display format is not defined.
- Only the 360px viewport is stated as a responsive target; other breakpoints and supported browsers are not listed.
- Dashboard content for roles other than Employee/Reporting Manager (HR Admin, Project Manager, System Admin) is not defined.
- The administrator guide must also cover the Reporting Manager approval tasks; US-040 lists approving items but names HR Admin, Project Manager and System Admin as audiences, not Reporting Manager. Confirm which section a Reporting Manager sees.
- The guide must reflect the built screens only; because bulk import, email and reports are excluded, the guide content depends on confirmation of those scope items.

### Architecture

- Input does not say who approved the architecture or when.
- The summary says Redis has 'two approved roles' but the Redis component also lists the job queue as a third function. Confirm the intended count.
- NFR-008, NFR-012 and NFR-015 are cited but their definitions were not provided.
- No requirement ids are linked to this component in the input.
- Retry policy (attempts, backoff) and failure handling for jobs that keep failing are not specified.
- Backup retention period and RPO/RTO are not stated.
- Session idle TTL value and lockout threshold/duration are not specified.
- Redis persistence/availability behaviour is not described. A Redis loss would affect sessions and lockout counters.
- No user story ids are linked in the input for this path (only NFR-001, NFR-002, NFR-005).
- Behaviour when no one above the submitter exists and no HR Admin is configured is not specified.
- Handling of shifts crossing midnight is not addressed. The one-punch-pair-per-calendar-day rule implies it is not supported, but this is not stated.
- Status value sets for timesheets and leave_requests (e.g. Draft/Submitted/Approved/Rejected) are only partly implied by endpoint text and not enumerated.
- The five role codes are not listed in the entities. The endpoint text says 'five fixed roles'.
- Only Draft, Submitted, approved and rejected-as-draft are implied. Whether rejected items keep a distinct status is unclear.
- How employees.is_erased interacts with audit_logs (which keeps who erased and when) is described only at a high level.
- No password policy (length/complexity/expiry) is specified.
- No self-service forgotten-password flow is listed. Only administrator reset exists.
- No user story ids are linked to these endpoints in the input.
- A department delete endpoint is not listed, yet deletion behaviour is described under POST /api/departments.
- No endpoint is listed for editing or closing a project, or for editing assignment allocated hours after creation.
- No endpoint is listed for employees to view or edit their own profile beyond PATCH /api/employees/{id}.
- The role description grants Project Managers 'monitor project utilization and allocated hours' and 'review project-specific timesheets'. No dedicated endpoint for these is listed.
- The role description grants HR Admin 'manage departments' and Reporting Managers 'monitor team availability'. Only team status is covered (GET /api/my/team).
- Hours granularity (decimal places) for timesheet cells is not stated.
- The project description mentions daily/weekly timesheets. Only a weekly grid is specified (daily entry is via day columns).
- No endpoint is listed for HR-wide attendance reports beyond the single-date query.
- No endpoint is listed for an employee to cancel or withdraw a pending leave request, although the project description says to 'track requests'.
- How an HR override is supplied on POST /api/leave-requests (field or separate call) is not specified.
- Carry-forward or year-rollover of leave balances is not described.
- Single shared holiday calendar: regional or per-location calendars are not supported or discussed.
- Approval is single-step only. Multi-level approval is not supported.
- The project description asks for approval 'notifications'. The architecture provides in-app alerts only, with no email/SMS/push. Confirm this meets the requirement.
- Manager behaviour when away or unavailable (delegation) is not described.
- Production/staging deployment nodes are not itemised. Only dev nodes are listed.
- The specific AWS region/country is not named.
- The dev nodes use a Redis container while the cloud decision names ElastiCache. This is consistent in intent but not explicitly mapped.
- No CI/CD, environment promotion, monitoring or logging approach is described.
- AC-054 and AC-055 are cited but are not in the supplied requirement keys, and their content was not provided.
- Expected data volume and user count are referenced ('at this volume') but not stated.
- The company's country and the chosen region are not named, so the in-country claim cannot be verified from the input.
- Discrepancy: the project description's headline names four groups (Employees, Managers, HR, Admins) but its permissions table lists five roles (adds Project Manager). The architecture follows five.
- Conflict: the permissions table gives Reporting Managers 'access team reports' and HR Admin 'organization-wide HR reports'. The architecture excludes reporting dashboards and lists no report endpoints. Confirm whether a limited report is intended.
- The project description text is truncated at 'RBAC Requirements ... 2. Employees can', so RBAC requirements beyond item 1 could not be traced.
- The description lists 'attendance records' for HR Admin. Only a per-date attendance query and regularisation are specified.
- No endpoint covers role/permission management beyond assigning the five fixed roles, although System Admin is described as managing 'permissions' and 'organization settings and system configurations'. No settings endpoint is listed.
- US-001 to US-040 are known requirement keys, but the architecture input only cites US-018, US-020 to US-026, US-031 and US-033. The remaining stories have no explicit architecture linkage in the input.

### Development

- The input does not map items to sprints, so which sprint each story belongs to cannot be confirmed.
- Sprint 10 (CHG-001) has no identified items; it is unclear whether US-041 to US-043 belong to it.
- US-041, US-042 and US-043 are not under any epic in the input, and no stated requirement ties them to a parent feature.
- Several RBAC items are not in the plan as separate stories. The description lists Project Manager and System Admin roles with permissions such as managing roles, organization settings and system configuration, while Sprint 1 refers only to a 'fixed role model'. The role definitions and how they map to the plan are unconfirmed.
- The project description is cut off at 'RBAC Requirements ... 2. Employees can', so the full RBAC requirement list was not available.
- No description of the implementation (endpoints, data model, validation) was provided.
- No review, test result or approval is recorded for this ticket.
- The delivery date was not provided.
- Delivered status is not confirmed by any test evidence.
- No description of how relationship scoping was implemented (e.g. manager to direct reports, project to assignees) was provided.
- No security review, test result or approval is recorded.
- US-003 (union of permissions across multiple roles) has no delivery record, but relationship-scoped access plausibly depends on it. The dependency is not stated in the input.
- No description of the supported record fields or operations was provided.
- No frontend work or ticket for HR employee-record screens is recorded, so it is unknown whether HR can use this from the UI.
- No review, test result or approval is recorded.
- Run status 'completed' conflicts with only 3 of 43 stories having a delivered ticket. It is unclear whether the remaining items were not built, not reported, or out of scope for this run.
- US-001 (sign-in) has no delivery record, although many delivered items depend on authentication.
- No delivery status was recorded for the tasks US-029-T1 to T3 and US-031-T1 to T3.
- No test or QA results, code review outcomes or approvals are provided for any ticket.
- No delivery dates or sprint assignment of delivered work was provided.
- The application's screens (screen keys such as SCR-001) were not provided, so usage documentation cannot be derived from this input.

### Testing

- The four checks are not named, so what was verified is unknown.
- No ticket is linked (ticket=None), so the run cannot be traced to a requirement or user story.
- No timestamp or environment is recorded for this run.
- No mapping from these checks to US-001 through US-043.
- E2E run has not finished, so there is no final outcome.
- 0/0 means no test cases have been reported; the total number of scenarios is unknown.
- No E2E scenarios are mapped to requirements (login/RBAC, employee management, timesheets, leave, approval workflows).
- No start time or run identifier is provided.
- The target is an Amplify URL; the input does not say whether it is a test/staging environment.
- No requirement-to-test traceability was provided for any of US-001 through US-043.
- No RBAC or security test results (secure login, role-restricted access for Employee, Reporting Manager, HR Admin, Project Manager, System Admin) were provided.
- No functional test results for timesheets, leave, approval workflows, or employee management were provided.
- No defects, test plan, or sign-off/approval were recorded.
- The project description is truncated at the RBAC requirements list ('2. Employees can'), so the full RBAC requirements cannot be confirmed as tested.

### Deployment

- No deployment date or timestamp recorded.
- No record of who triggered or approved the deployment.
- Environment is not named; 'live' is given but production vs. staging is not stated.
- No mapping from version 92f33dde62ab to requirements or user stories (US-001 to US-043), so no related_ids can be linked.
- No health-check, smoke-test, or post-deploy verification results provided.
- No rollback plan, previous version, or release notes provided.
- No configuration details (environment variables, database, authentication/secrets handling) provided for RBAC and secure login.
- Input does not confirm that the frontend and backend URLs are wired together or that the backend responds.
- The project description text appears truncated at 'Employees can' in the RBAC requirements, so the full requirement set could not be confirmed against this deployment.

### Maintenance

- Maintenance phase has not started — the system has not been deployed.
- No support model, on-call rota or ticket channel defined for administrator-issued password resets and account unlocks.
- No monitoring, alerting or backup-restore verification routine defined.
- No process for annual maintenance tasks implied by the scope: rolling the holiday calendar to a new year and setting new annual leave entitlements (no automated accrual/carry-over exists).
<!-- sdlc:auto:end open-gaps -->

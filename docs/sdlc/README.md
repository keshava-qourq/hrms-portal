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

**Documentation version:** v15
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v3 approved |
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
| [Test report](testing/test-report.md) | failed |
| [Tests](testing/test-cases.md) | 116 tests |
| [Deployment guide](deployment/deployment-guide.md) | deployed |
| [Runbook](deployment/runbook.md) | deployed |
| [Release notes](deployment/release-notes.md) | 4 releases |
| [Traceability matrix](traceability-matrix.md) | 46 requirements |
| [Changelog](CHANGELOG.md) | 15 versions |
<!-- sdlc:auto:end contents -->

## Open gaps

<!-- sdlc:auto:start open-gaps -->
### Requirements

- Conflict: the queue rationale cites bulk spreadsheet import, month-end CSV/Excel payroll export and nightly pending-approval reminders. Bulk import and CSV/Excel export are not in the lightweight capability set, and reminder emails are out of scope because email was removed. Which background jobs the queue actually serves is unclear.
- The FastAPI rationale cites accrual/carry-over maths and CSV/Excel handling, and the cloud rationale cites SES. None of these is in scope for this version.
- The cache rationale cites team availability, project utilisation and leave liability dashboards, but EPIC-007 says manager dashboards and reports are not in this scope.
- The in-country data-residency, daily automated backup and point-in-time restore requirements appear only in the stack rationale. No user story or acceptance criterion covers them.
- Redis session store and queue share one Redis instance. No persistence or availability expectation is stated.
- 'English / the local language' is ambiguous: which single language is configured is not stated.
- The scope-reduction decisions (no bulk import, no export, no accrual/carry-over, no email, no dashboards) are marked 'to confirm' in the epics, and no confirmation is recorded.
- The project description is truncated at 'RBAC requirement 2 (Employees can ...)'. The remaining RBAC requirements were not provided.
- The description gives Reporting Managers 'monitor team availability' and 'team reports', HR Admins 'organization-wide HR reports', and Project Managers 'monitor project utilization'. EPIC-005 and EPIC-007 exclude attendance reports and manager dashboards from this scope.
- The description says System Admin has 'full administrative access', 'permissions' and 'organization settings'. US-002 and EPIC-001 say admins assign roles but cannot toggle individual permissions or create custom roles. No story defines organisation settings or system configuration screens.
- The description says Project Managers 'review project-specific timesheets'. No story defines a screen or workflow for this, beyond the visibility rule in AC-014.
- The description lists notifications for approvals, but v3 delivers in-app alerts only.
- Conflict with the confirmed understanding: password reset by emailed link was assumed, but v3 delivers administrator-issued resets only. This needs confirmation.
- Session timeout duration and the lockout failed-attempt threshold are only 'configured'. No values are given, and no configuration screen or owner is defined.
- Lockout duration or auto-unlock is not stated. AC-019 implies a manual System Admin unlock only.
- Whether the current password is required for the forced change after a one-time password is ambiguous (AC-145 and AC-146 vs AC-023). The one-time password flow implies it might be supplied.
- The one-time password policy (length, complexity, expiry) and new-password rules are not defined.
- US-041 to US-046 read as defect-fix or technical stories. Their link to originally reported failures is not recorded in the input.
- The audit log's retention period and search/filter needs are not stated.
- US-004 does not say whether a Project Manager who creates a project is automatically 'assigned' to it for visibility.
- Which profile fields are employee-editable versus HR-only is assumed and needs confirmation.
- Bulk import was assumed in the confirmed understanding but is excluded. Creating several hundred records manually at launch is flagged as onerous and needs confirmation.
- The full profile field list is not defined beyond the fields named in the acceptance criteria.
- Conflict risk: erasure removes personal fields, yet the audit log retains before/after values of edits (AC-026, AC-035), which may contain personal data. How erasure treats existing audit entries is not specified.
- Whether an employee record can exist without a linked user account, and whether a reporting manager must also be an active employee, are not stated.
- Reporting-line rules such as a top-level employee with no manager are not defined here, although AC-116 assumes some managers have none. This sits against AC-033, which makes reporting manager mandatory.
- Who can see a leaver's history after the end date is not stated.
- 'Current leave/timesheet status' on My Team is not defined further.
- How a Project Manager becomes 'assigned' to a project (including the creator) is not stated.
- The project end date and the full list of statuses beyond 'active' and 'closed' are not defined.
- Whether an assignment has start/end dates is not stated, only an optional allocated-hours figure.
- No allocated-vs-actual view exists in this scope, so allocated hours have no visible use yet.
- Whether an employee already on leave or marked as a leaver can be assigned is not stated, beyond leavers being removed from assignment pickers (AC-036).
- Validation limits (e.g. 24 hours/day maximum) are assumed and need confirmation.
- The 24-hour limit is stated per day across all projects (AC-054). The 8-hour example in that criterion is not a limit.
- Whether hours entered on days of approved leave, weekends or holidays are blocked or warned is not specified.
- Whether one timesheet covers all projects for a week, or whether a partial-week or cross-month period is possible, is not stated.
- Whether hours can be entered in decimals other than 0.5 steps (e.g. 7.5 is shown in AC-052) is not defined.
- No reconciliation between timesheet hours and attendance by design. This is flagged for confirmation.
- Payroll export was assumed in the confirmed understanding but is excluded. This needs confirmation.
- How far back or forward a timesheet can be entered is not stated.
- HR Admins can set a departure time for an incomplete punch (AC-075). Correcting a missed clock-in, or creating a record for a day with no punches, is not explicitly covered.
- The one-punch-per-day assumption needs confirmation. How shifts crossing midnight are handled is not stated.
- The company timezone is not named, and day boundaries for 'today' depend on it.
- Reporting Managers have no attendance view of their team in any story, although the role table mentions team availability.
- Attendance reports (late, early, absent, hours per period) are excluded. This needs confirmation.
- Whether a forgotten clock-out auto-closes at end of day is not stated.
- Accrual and carry-over were assumed in the confirmed understanding but are excluded. This needs confirmation, and year-end balance treatment is not defined.
- How the 'pending' amount is held against the balance for the shortfall check on a second request is not stated.
- How an HR override is applied (before or after submission, and by whom initiating it) is ambiguous in AC-088.
- No story lets an employee cancel or withdraw a submitted or approved leave request.
- A leave request rejected by a manager 'returns as an editable draft' (AC-111), but no leave edit/resubmit story or criterion exists, unlike US-019 for timesheets.
- The working-week definition (Saturday and Sunday as weekends) is assumed, not stated.
- Entitlement per employee versus per leave type: how HR sets individual entitlements (the annual figure per employee) is not fully specified beyond opening balances (AC-100).
- A multi-day range with a half-day at the start or end is not addressed, only a single-day half-day (AC-082).
- The deletion or deactivation of holidays and leave types already in use is not addressed.
- Conflict with the confirmed understanding: transactional email notifications and pending-approval reminder emails are removed. This needs confirmation.
- Single-step approval and no self-approval escalation rules are flagged for confirmation.
- The 'HR Admin queue' (AC-116) is not defined: no story gives HR Admins an approvals list or approval permission for submissions routed to them.
- AC-115 describes the manager's own reporting manager; the behaviour when that manager is on leave or deactivated is not defined.
- Whether the escalated approver sees the item in the same pending list (US-030) is implied but not stated.
- Reopened leave: the resulting status of the leave request is not specified (AC-119 only returns days).
- No bulk approve action and no delegation or out-of-office approver are described.
- Whether alerts persist indefinitely or are cleared is not stated.
- The company timezone and the date/time display format are not specified.
- The dashboard content for users with other roles (HR Admin, Project Manager, System Admin) is not defined, apart from the manager approval count.
- Supported browsers and their minimum versions are not stated.
- Accessibility requirements are not stated.
- The guide covers 'the capabilities built in this version', so its content depends on what is actually built.
- The launch-setup order puts employees before accounts, but accounts require a linked employee record (AC-005). The order is consistent with that. The order places leave types and holidays before employees, yet balances need employees, so where opening-balance setup falls is not stated.
- Who maintains the guide content after release is not stated.
- The administrator section's visibility for each administrative role (HR Admin, Project Manager, System Admin) is not distinguished beyond 'administrative role'.

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

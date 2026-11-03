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

**Documentation version:** v6
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 22 entries |
| [Development](development/README.md) | 7 entries |
| [Testing](testing/README.md) | 1 entry |
| [Deployment](deployment/README.md) | 2 entries |
| [Maintenance](maintenance/README.md) | 1 entry |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 9 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 6 routes |
| [Test report](testing/test-report.md) | running |
| [Tests](testing/test-cases.md) | 69 tests |
| [Deployment guide](deployment/deployment-guide.md) | deployed |
| [Runbook](deployment/runbook.md) | deployed |
| [Release notes](deployment/release-notes.md) | 2 releases |
| [Traceability matrix](traceability-matrix.md) | 40 requirements |
| [Changelog](CHANGELOG.md) | 6 versions |
<!-- sdlc:auto:end contents -->

## Open gaps

<!-- sdlc:auto:start open-gaps -->
### Requirements

- Project description's role table promises team reports, organisation-wide HR reports and project utilisation monitoring; these reporting dashboards are excluded from the lightweight MVP (EPIC-003, EPIC-007 notes) — conflict to confirm with the product owner.
- Project description's RBAC requirement list is truncated mid-sentence ('2. Employees can') — the remaining numbered RBAC rules were never supplied.
- No target launch date, milestone dates or release train recorded for this version.
- Stack rationale justifies FastAPI and the Redis queue partly on CSV/Excel import and month-end export — but NFR-020 and the EPIC-002/EPIC-004 notes exclude bulk import and payroll export from this version. Conflict: confirm whether import/export is in or out.
- Queue rationale names 'nightly pending-approval reminders' sent by email, but email is out of scope and NFR-019 states no reminders are sent. Conflict to resolve.
- Stack rationale names 'leave accrual and carry-over maths', but EPIC-006 excludes automated accrual/carry-over from this version. Conflict to resolve.
- Queue and cache rationale references team-availability / project-utilisation / leave-liability dashboards that EPIC-007 places out of MVP scope.
- The specific AWS region (the 'company's own country') is not named in the input.
- CONFLICT: the confirmed understanding assumed password reset by emailed link; this version delivers administrator-issued resets because email was removed from scope (AC-021, NFR-018). Needs product-owner confirmation.
- Numeric values unspecified: session timeout duration, number of failed attempts before lockout, one-time-password validity window.
- Audit log retention period, export format and search/filter capability are not specified.
- Account-unlock path when no System Admin is available is not described.
- Whether a locked account also notifies anyone in-app is not stated.
- Field-level edit matrix (which profile fields an employee may change vs HR-only) is assumed, not confirmed.
- Bulk import exclusion is flagged by the input itself as onerous for several hundred launch records — confirmation required.
- The exact set of 'identifying personal fields' removed on erasure is not enumerated.
- Circular or missing reporting-manager cases (e.g. the CEO, a manager who leaves) are not covered by any acceptance criterion.
- No department hierarchy or department-head concept is defined — flat list only.
- Who assigns a Project Manager to a project (System Admin, HR Admin, or another PM) is not stated in any story.
- Project uniqueness rules (duplicate project codes) and end-date handling are not specified.
- No story covers what happens to an employee's assignments when they are marked a leaver, beyond removal from assignment pickers (US-010).
- Weekly period and the 24-hour daily cap are assumptions awaiting confirmation.
- No submission deadline, late-week reminder or period-locking rule is defined.
- No story lets an employee withdraw or recall a Submitted timesheet before a decision.
- Payroll export of approved hours is excluded, so the downstream consumption path for approved data is undefined.
- Behaviour when a project is closed or an assignment is removed mid-week (partially filled grid) is only partly covered.
- One-punch-pair-per-day and no break punching are assumptions awaiting confirmation.
- No rule for an overnight shift or a clock-out that falls on the next calendar day.
- No auto-close or escalation for a clock-in that is never followed by a clock-out.
- Employees cannot request a regularisation themselves — only HR can correct; no request path is defined.
- Attendance reporting is excluded, so there is no in-portal view of absence/lateness trends.
- Automated accrual and carry-over are excluded from this version — explicitly flagged as needing confirmation.
- The leave-year boundary (calendar year vs financial year) and what happens to unused entitlement at year end are undefined.
- No story covers an employee cancelling or amending a submitted or already-approved leave request.
- Interaction between approved leave and attendance/timesheets (e.g. whether a leave day blocks a punch or a timesheet entry) is not specified.
- Whether a half-day can be combined with a multi-day range (half-day start or end) is not stated — AC-082 covers a single day only.
- CONFLICT: the confirmed understanding assumed in-app alerts PLUS transactional email; email has been removed, so this version is in-app only with no submission/decision emails and no pending-approval reminder emails (AC-125, NFR-019). Needs confirmation.
- Single-step approval and the self-approval escalation rule are the two assumptions explicitly flagged as highest priority to confirm.
- No story describes the HR Admin approval queue screen that escalated items land in (AC-116) — only that items route there.
- No delegation or out-of-office cover is defined when a reporting manager is absent.
- No SLA, ageing indicator or auto-escalation for items left undecided.
- The configured language and the company timezone are never named in the input.
- The date/time format to be used consistently is not specified.
- No supported-browser matrix and no accessibility (e.g. WCAG) requirement is stated.
- Dashboard content for HR Admin, Project Manager and System Admin roles is not described — only the employee view plus a manager approval count.
- AC-137 requires instructions matching the screens actually built, but no screens exist yet — the guide cannot be written or verified until development produces them.
- No owner is named for authoring and maintaining the help content, and no update trigger when screens change.
- No searchability or contextual-help requirement is stated for the help pages.
- No specified hashing algorithm or work factor for NFR-001.
- No penetration test, security review or vulnerability-scanning requirement is recorded.
- No rate-limiting requirement on sign-in beyond account lockout (US-005).
- No data-retention schedule is defined for employee, timesheet, attendance or leave records after an employee leaves.
- No subject-access-request (data export to the employee) capability is specified.
- No named data-protection regulation was supplied with the project, so these privacy controls are not traced to a specific legal obligation.
- The company's country and the specific AWS region are not named.
- No audit-log retention period, archival or tamper-evidence mechanism (e.g. hashing/WORM storage) is specified beyond 'append-only'.
- No industry or domain compliance skill was provided with this project, so no named regulation has been mapped to these controls.
- No RTO/RPO figures accompany the backup requirement, and no backup-restore test cadence is defined.
- No response-time or page-load performance targets are stated, only user and record volumes.
- No monitoring, alerting or uptime-target requirement is recorded.
- NFR-018, NFR-019 and NFR-020 are accepted risks that directly contradict parts of the confirmed understanding and parts of the stack rationale — see top-level conflicts.
- No accessibility standard accompanies the mobile usability target.
- The authoritative permission matrix per role is described narratively across stories but is not recorded as a single consolidated table in the requirements input.

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

- The plan does not state which sprint each story belongs to, only the sprint goals, so story-to-sprint mapping cannot be documented.
- Sprint start and end dates are not provided.
- The project description and RBAC requirements in the input are truncated ('2. Employees can'), so the full RBAC requirement list could not be cross-checked against the plan.
- The project description lists 5 roles (Employee, Reporting Manager, HR Admin, Project Manager, System Admin). The plan refers to a 'fixed role model' without naming the roles. Alignment is unconfirmed.
- Discrepancy: run status is 'completed', but 35 of 40 planned stories have no delivered ticket. It is unclear whether they were descoped, deferred, failed, or never attempted.
- No statuses (blocked, failed, skipped) are given for undelivered stories.
- Several core features appear undelivered, including administrator-created accounts (US-002), relationship-scoped access (US-004), session timeout and lockout (US-005), and the timesheet and leave workflows. Confirm whether the run ended early.
- US-039 and US-040 (user guides) are not delivered. Treat any user-guide content as unavailable.
- No implementation details, acceptance criteria or test results were provided for this ticket.
- Delivery depends on account creation (US-002) and on session timeout and lockout (US-005), which have no delivery records. Whether sign-in is usable end to end is unconfirmed.
- No implementation details, role-permission matrix or test results were provided.
- The ticket shares a commit with two other tickets, so changes cannot be attributed to this ticket alone.
- Relationship-scoped access (US-004) has no delivery record, so access control is incomplete at the role level only.
- No implementation details or tests proving immutability were provided.
- The audit log covers 'approvals, changes and admin actions'. The approval and admin-account features that would emit those events (US-002, US-031 and others) have no delivery records, so actual event coverage is unconfirmed.
- No retention policy or viewer for the audit log is described.
- The operations supported are not stated.
- No front-end screen for departments is recorded. The ticket is backend-assigned and no frontend ticket exists.
- Employee records (US-009), which would use departments, have no delivery record.
- The chosen interface language, date format and time zone handling are not stated.
- The other EPIC-008 stories (the dashboard US-036 and the phone layout US-037) have no delivery records, and few other screens are known to exist yet to apply this to.

### Testing

- Testing phase has not started — no test plan, cases, runs or results recorded.
- No traceability from AC-001..AC-141 to test cases.
- No security testing recorded against NFR-001..NFR-008.
- No concurrency testing recorded against NFR-015 (double-deduction of leave balances).
- No mobile/responsive verification recorded against NFR-016 (360px viewport).
- No UAT plan or acceptance sign-off path recorded.

### Deployment

- No deployment date or timestamp was recorded.
- No deployment id, environment name (e.g. production vs. staging), or deploying person/agent was provided.
- No approval or sign-off for release to live was provided.
- No deployment method, pipeline run, or infrastructure details were provided beyond the two URLs.
- No health check, smoke test, or post-deploy verification results were provided; the live status is not backed by any recorded verification.
- No rollback plan or previous version reference was provided.
- No release notes or list of requirements (US-001 to US-040) included in this version were provided, so deployed scope cannot be linked to requirement ids.
- Version 86483a04d241 is not tied to a specific commit, build or dev ticket in the input.
- The backend URL is on a shared sslip.io wildcard-DNS host with a raw IP address; no input says whether this is intended as the permanent production endpoint, or whether a custom domain, TLS certificate ownership, or monitoring is in place.
- The project description is truncated at 'RBAC Requirements, 2. Employees can', so the full access-control requirements could not be confirmed against the deployment.
- No monitoring or alerting configuration provided.
- No backup, disaster recovery, or data retention information provided.
- No security configuration (authentication provider, secrets handling, audit log settings) provided for the live environment, although the project calls for secure login, RBAC and audit logs.
- No incident, support or on-call ownership defined.
- No known issues or post-release defects recorded.

### Maintenance

- Maintenance phase has not started — the system has not been deployed.
- No support model, on-call rota or ticket channel defined for administrator-issued password resets and account unlocks.
- No monitoring, alerting or backup-restore verification routine defined.
- No process for annual maintenance tasks implied by the scope: rolling the holiday calendar to a new year and setting new annual leave entitlements (no automated accrual/carry-over exists).
<!-- sdlc:auto:end open-gaps -->

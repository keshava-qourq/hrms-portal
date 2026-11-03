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

**Documentation version:** v1
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 1 entry |
| [Development](development/README.md) | 1 entry |
| [Testing](testing/README.md) | 1 entry |
| [Deployment](deployment/README.md) | 1 entry |
| [Maintenance](maintenance/README.md) | 1 entry |
| [Data model](architecture/data-model.md) | not generated yet |
| [API (OpenAPI)](architecture/api/openapi.yaml) | not generated yet |
| [Decisions (ADRs)](architecture/adr/README.md) | 0 decisions |
| [Sprint plan](development/sprint-plan.md) | not generated yet |
| [Developer guide](development/developer-guide.md) | not generated yet |
| [API reference](development/api-reference.md) | 0 routes |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 0 tests |
| [Deployment guide](deployment/deployment-guide.md) | not deployed yet |
| [Runbook](deployment/runbook.md) | not deployed yet |
| [Release notes](deployment/release-notes.md) | 0 releases |
| [Traceability matrix](traceability-matrix.md) | 40 requirements |
| [Changelog](CHANGELOG.md) | 1 version |
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

- Architecture phase has not started — no design documents, diagrams or decision records exist.
- No data model for employees, departments, reporting lines, projects, assignments, timesheets, punches, leave types, balances, holidays, approvals, alerts or audit entries.
- No design for server-side RBAC plus relationship scoping (NFR-004) or for the self-approval escalation routing (US-033).
- No design for append-only audit storage (NFR-010) or for transactional balance updates (NFR-015).
- No session/timeout/lockout design showing how Redis holds sessions.
- No background-job design, even though a Redis queue is mandated while its stated workloads (import, export, reminder emails) are out of scope.
- No AWS deployment topology, region choice, encryption-at-rest configuration or backup/restore design (NFR-008, NFR-011, NFR-012).

### Development

- Development phase has not started — no plan, sprints or tickets recorded.
- No mapping from user stories (US-001..US-040) to implementation tickets.
- No team, roles, capacity or schedule recorded.
- No definition of done, branching strategy or code-review process recorded.
- No record of which of the open requirement assumptions were resolved before build.

### Testing

- Testing phase has not started — no test plan, cases, runs or results recorded.
- No traceability from AC-001..AC-141 to test cases.
- No security testing recorded against NFR-001..NFR-008.
- No concurrency testing recorded against NFR-015 (double-deduction of leave balances).
- No mobile/responsive verification recorded against NFR-016 (360px viewport).
- No UAT plan or acceptance sign-off path recorded.

### Deployment

- No deployment recorded yet — no environments, pipeline, release versions or deployment history.
- The target AWS region (and therefore the data-residency commitment of NFR-011) is unconfirmed.
- No evidence that daily backups and point-in-time restore have been configured (NFR-012).
- No TLS/encryption-at-rest configuration evidence (NFR-008).
- No secrets-management approach for REDIS_URL and database credentials.
- No launch-data-loading plan, despite bulk import being excluded (NFR-020) and several hundred records needing manual entry at go-live.

### Maintenance

- Maintenance phase has not started — the system has not been deployed.
- No support model, on-call rota or ticket channel defined for administrator-issued password resets and account unlocks.
- No monitoring, alerting or backup-restore verification routine defined.
- No process for annual maintenance tasks implied by the scope: rolling the holiday calendar to a new year and setting new annual leave entitlements (no automated accrual/carry-over exists).
<!-- sdlc:auto:end open-gaps -->

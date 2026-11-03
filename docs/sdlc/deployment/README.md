# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-86483a04d241 · draft · source: deployment:86483a04d241

The HRMS portal is recorded as live at version 86483a04d241. The frontend and backend are served from separate URLs. No other deployment detail was provided.

- Status: live
- Version: 86483a04d241
- Frontend URL: https://p0b51fe7c3507.d13el1ykvx8z63.amplifyapp.com (the hostname suggests AWS Amplify hosting)
- Backend URL: https://184-198-241-75.sslip.io/apps/0b51fe7c3507/
- Scope as described in the project input: secure login and role-based access for Employees, Managers, HR and Admins. Modules are Employee Management, Timesheet Management, Leave Management and Approval Workflows.
- Roles named in the project input: Employee, Reporting Manager, HR Admin, Project Manager, System Admin.
- Nothing further (deploy date, deployer, approver, environment, pipeline, configuration) was provided, so none is stated here.

- ⚠ No deployment date or timestamp was recorded.
- ⚠ No deployment id, environment name (e.g. production vs. staging), or deploying person/agent was provided.
- ⚠ No approval or sign-off for release to live was provided.
- ⚠ No deployment method, pipeline run, or infrastructure details were provided beyond the two URLs.
- ⚠ No health check, smoke test, or post-deploy verification results were provided; the live status is not backed by any recorded verification.
- ⚠ No rollback plan or previous version reference was provided.
- ⚠ No release notes or list of requirements (US-001 to US-040) included in this version were provided, so deployed scope cannot be linked to requirement ids.
- ⚠ Version 86483a04d241 is not tied to a specific commit, build or dev ticket in the input.
- ⚠ The backend URL is on a shared sslip.io wildcard-DNS host with a raw IP address; no input says whether this is intended as the permanent production endpoint, or whether a custom domain, TLS certificate ownership, or monitoring is in place.
- ⚠ The project description is truncated at 'RBAC Requirements, 2. Employees can', so the full access-control requirements could not be confirmed against the deployment.

### DEP-MAINT-1 · draft

No post-deployment operations information was provided. Monitoring, maintenance and support arrangements are undocumented.

The input contains no monitoring setup, alerting, incident records, backup or recovery procedures, or maintenance schedule for the live system. Nothing is asserted here.

- ⚠ No monitoring or alerting configuration provided.
- ⚠ No backup, disaster recovery, or data retention information provided.
- ⚠ No security configuration (authentication provider, secrets handling, audit log settings) provided for the live environment, although the project calls for secure login, RBAC and audit logs.
- ⚠ No incident, support or on-call ownership defined.
- ⚠ No known issues or post-release defects recorded.
<!-- sdlc:auto:end narrative -->

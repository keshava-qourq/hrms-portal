# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-8dd271430d63 · approved · source: deployment:8dd271430d63

Version 8dd271430d63 of the HRMS portal is recorded as live. The frontend and backend are served at separate URLs. The input gives no date, deployer, or approval for this release.

- Status: live
- Version: 8dd271430d63
- Frontend URL: https://p0b51fe7c3507.d13el1ykvx8z63.amplifyapp.com
- Backend URL: https://184-198-241-75.sslip.io/apps/0b51fe7c3507/
- Hosting: the frontend hostname is an AWS Amplify domain (amplifyapp.com). The backend is served over an sslip.io hostname. The input does not name the hosting platform for the backend.
- Release scope: not stated. The input does not list which user stories (US-001 to US-046) are included in this version.

- ⚠ Deployment date/time is not recorded.
- ⚠ Deployer and any release approval or sign-off are not recorded.
- ⚠ Target environment (production, staging, etc.) is not named, only the status 'live'.
- ⚠ Release scope is not stated, so no requirement (US-001 to US-046) can be linked to this version.
- ⚠ No release notes or change log were provided.
- ⚠ No rollback plan or previous version was provided.
- ⚠ No post-deployment verification (smoke test, health check) results were provided, so it is unconfirmed that the live app works end to end.
- ⚠ No record of how secrets, environment configuration, or database migrations were handled.
- ⚠ The backend uses a shared sslip.io wildcard-DNS hostname rather than a dedicated domain. Whether this is intended for the long term is not stated.
- ⚠ The project description supplied is truncated at RBAC requirement 2 ('Employees can'), so the full access-control requirements could not be checked against this deployment.
<!-- sdlc:auto:end narrative -->

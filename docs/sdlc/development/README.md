# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

Approved plan, version 1, covering 10 sprints of capacity 20 each. It groups 46 stories (plus tasks under US-029 and US-031) into 9 epics.

Sprint goals:
- Sprint 1: Sign-in, role union, audit log and departments foundation.
- Sprint 2: Admin-created accounts, relationship-scoped access and employee records.
- Sprint 3: Session security, own profile, leaver handling and manager team list.
- Sprint 4: Projects, assignments and timesheet entry.
- Sprint 5: Timesheet submission, clock-in/out and leave policy configuration.
- Sprint 6: Leave requests, balances, holiday calendar and attendance correction.
- Sprint 7: Manager approvals and in-app alerts.
- Sprint 8: Rejection flow, self-approval escalation, reopen, resubmission and leave history.
- Sprint 9: Home dashboard, mobile responsiveness, user guides and change-password endpoint.
- Sprint 10: Administrator password reset endpoint, UI and automated tests.

Epics (stories as listed in the plan):
- EPIC-001 Secure Access, Accounts and Role-Based Permissions: US-001 to US-007, US-041 to US-046.
- EPIC-002 Employee Profiles, Departments and Reporting Lines: US-008 to US-012.
- EPIC-003 Projects and Employee Assignments: US-013 to US-015.
- EPIC-004 Timesheet Entry and Submission: US-016 to US-019.
- EPIC-005 Attendance Clock-In and Clock-Out: US-020 to US-022.
- EPIC-006 Leave Requests, Balances and Holiday Calendar: US-023 to US-029, with tasks US-029-T1 to T4.
- EPIC-007 Single-Step Approval of Timesheets and Leave: US-030 to US-035, with tasks US-031-T1 to T4.
- EPIC-008 Employee Home Dashboard and Mobile-Responsive Portal: US-036 to US-038.
- EPIC-009 Portal User Guide: US-039, US-040.

Agent roles assigned: backend-agent, frontend-agent, security-agent (US-004) and qa-agent (US-043, US-046).

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009

### DEV-RUN-STATUS · draft · source: dev:run

The development run is marked completed. Tickets were reported for only 5 of the 46 planned stories: 4 delivered and 1 skipped.

Reported tickets:
- US-013: delivered, commit eac0b9dc6bd960555ec5188e62e9b86ccecbf705.
- US-014: delivered, commit eac0b9dc6bd960555ec5188e62e9b86ccecbf705 (same commit as US-013).
- US-015: skipped, no commit.
- US-016: delivered, commit 18927b6478eaaaa6385085eb98a3c07169633dd2.
- US-017: delivered, commit 18927b6478eaaaa6385085eb98a3c07169633dd2 (same commit as US-016).

All reported tickets fall under EPIC-003 and EPIC-004, which matches the Sprint 4 goal (Projects, assignments and timesheet entry).

**Related:** US-013, US-014, US-015, US-016, US-017

### DEV-US-013 · draft · source: dev:US-013

Create and manage project records (3 points, backend-agent). Delivered in commit eac0b9dc.

- Ticket status: delivered.
- Commit: eac0b9dc6bd960555ec5188e62e9b86ccecbf705.
- The commit is shared with US-014.
- The plan places this story in EPIC-003, Projects and Employee Assignments.

**Related:** US-013, EPIC-003

### DEV-US-014 · draft · source: dev:US-014

Assign employees to projects (3 points, backend-agent). Delivered in commit eac0b9dc, the same commit as US-013.

- Ticket status: delivered.
- Commit: eac0b9dc6bd960555ec5188e62e9b86ccecbf705.
- Assignments depend on project records, which is consistent with US-013 sharing the commit. This is an observation only, since no rationale was given.
- The plan places this story in EPIC-003.

**Related:** US-014, US-013, EPIC-003

### DEV-US-015 · draft · source: dev:US-015

Employee sees their own project assignments (2 points, frontend-agent). The ticket was skipped and no commit exists, so this capability is not delivered.

- Ticket status: skipped.
- Commit: none.
- The plan places this story in EPIC-003.
- Backend assignments (US-014) were delivered, but no employee-facing view of them is recorded as built.

**Related:** US-015, US-014, EPIC-003

### DEV-US-016 · draft · source: dev:US-016

Log daily hours against assigned projects (5 points, backend-agent). Delivered in commit 18927b64, shared with US-017.

- Ticket status: delivered.
- Commit: 18927b6478eaaaa6385085eb98a3c07169633dd2.
- The plan places this story in EPIC-004, Timesheet Entry and Submission.

**Related:** US-016, US-014, EPIC-004

### DEV-US-017 · draft · source: dev:US-017

Enter and review a weekly timesheet (5 points, frontend-agent). Delivered in commit 18927b64, shared with the backend story US-016.

- Ticket status: delivered.
- Commit: 18927b6478eaaaa6385085eb98a3c07169633dd2.
- The plan places this story in EPIC-004.
- Submission and status tracking (US-018) and resubmission (US-019) have no ticket records.

**Related:** US-017, US-016, EPIC-004

### DEV-COVERAGE-GAP · draft · source: plan:v1

41 planned stories have no development ticket or commit in the input, so no delivery can be documented for them.

Stories with no ticket record:
- EPIC-001: US-001 to US-007, US-041 to US-046.
- EPIC-002: US-008 to US-012.
- EPIC-004: US-018, US-019.
- EPIC-005: US-020 to US-022.
- EPIC-006: US-023 to US-029, including tasks US-029-T1 to T4.
- EPIC-007: US-030 to US-035, including tasks US-031-T1 to T4.
- EPIC-008: US-036 to US-038.
- EPIC-009: US-039, US-040.

The input does not say whether this work was started, deferred or left out of the report.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-041, US-042, US-043, US-044, US-045, US-046, US-008, US-009, US-010, US-011, US-012, US-018, US-019, US-020, US-021, US-022, US-023, US-024, US-025, US-026, US-027, US-028, US-029, US-030, US-031, US-032, US-033, US-034, US-035, US-036, US-037, US-038, US-039, US-040
<!-- sdlc:auto:end narrative -->

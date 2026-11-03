# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

Development plan version 1 is marked approved. It covers 9 sprints of capacity 20 each (180 total), 9 epics and 40 stories worth 165 story points. Work is assigned to backend-agent, frontend-agent, security-agent and qa-agent.

- Plan status: approved, version 1.
- Sprints: 9, each with capacity 20.
- Epics: 9 (EPIC-001 to EPIC-009). Epics carry no points or role.
- Stories: 40 (US-001 to US-040), summing to 165 points against 180 capacity.
- Tasks: 5, under US-029 (3 tasks) and US-031 (3 tasks). Tasks carry no points of their own.
- Role split by story: backend-agent for most stories; frontend-agent for UI-oriented stories (US-008, US-015, US-017, US-027, US-028, US-036 to US-040); security-agent for US-004 only; qa-agent only on task US-031-T3.
- Story points per epic: EPIC-001 36, EPIC-002 18, EPIC-003 8, EPIC-004 18, EPIC-005 8, EPIC-006 28, EPIC-007 31, EPIC-008 12, EPIC-009 6.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019, US-020, US-021, US-022, US-023, US-024, US-025, US-026, US-027, US-028, US-029, US-030, US-031, US-032, US-033, US-034, US-035, US-036, US-037, US-038, US-039, US-040

- ⚠ Approver and approval date for plan v1 were not provided.
- ⚠ No sprint-to-item assignment is given. Only sprint goals are listed, so it is unknown which stories fall in which sprint.
- ⚠ Capacity unit (story points, hours or other) is not stated. Total points (165) vs capacity (180) is comparable only if the unit is points.
- ⚠ No implementation evidence was supplied (tickets, commits, PRs, build or deploy output). Completion of every item is unknown.
- ⚠ Application build is not confirmed complete, so the user guide cannot be written yet.
- ⚠ The project description is truncated at 'RBAC Requirements, 2. Employees can'. RBAC requirements beyond item 1 could not be traced.
- ⚠ Role names differ between the project description (Reporting Manager, HR Admin, Project Manager, System Admin) and the plan (Manager, HR Admin, Administrator, 'fixed role model'). Mapping is not confirmed.
- ⚠ The project description lists team reports, organization-wide HR reports, team availability monitoring, and project-manager timesheet review and utilization monitoring. No plan item covers these.
- ⚠ The description mentions notifications. The plan covers only in-app alerts (US-035), and it is not stated whether email or other notifications are in or out of scope.
- ⚠ Only one qa-agent item (US-031-T3) is in the plan. No other test-related work items were provided.

### DEV-SPRINT-1 · approved · source: plan:SPRINT-1

Sprint 1 goal: foundations. Sign-in, a fixed role model, an append-only audit service, departments, and consistent date/time and language handling. Capacity 20.

- Goal wording suggests scope from EPIC-001 (sign-in, roles, audit), departments (EPIC-002) and US-038 (language and date/time). This is inferred from the goal text only, not stated by the plan.
- Capacity: 20.

- ⚠ No stories are explicitly assigned to this sprint.
- ⚠ No outcome, completion or velocity data provided.

### DEV-SPRINT-2 · approved · source: plan:SPRINT-2

Sprint 2 goal: employee records, administrator-created accounts and server-side relationship-scoped access. Capacity 20.

- Goal wording suggests overlap with US-009 (employee records), US-002 (admin-created accounts) and US-004 (relationship-scoped access). This is inferred from the goal text, not stated by the plan.
- Capacity: 20.

- ⚠ No stories are explicitly assigned to this sprint.
- ⚠ No outcome, completion or velocity data provided.

### DEV-SPRINT-3 · approved · source: plan:SPRINT-3

Sprint 3 goal: session timeout and lockout, admin password reset, own profile, team view and leaver handling. Capacity 20.

- Goal wording suggests overlap with US-005, US-006, US-008, US-012 and US-010. This is inferred from the goal text, not stated by the plan.
- Capacity: 20.

- ⚠ No stories are explicitly assigned to this sprint.
- ⚠ No outcome, completion or velocity data provided.

### DEV-SPRINT-4 · approved · source: plan:SPRINT-4

Sprint 4 goal: projects, assignments and timesheet entry through the weekly grid. Capacity 20.

- Goal wording suggests overlap with EPIC-003 (US-013 to US-015) and timesheet entry (US-016, US-017). This is inferred from the goal text, not stated by the plan.
- Capacity: 20.

- ⚠ No stories are explicitly assigned to this sprint.
- ⚠ No outcome, completion or velocity data provided.

### DEV-SPRINT-5 · approved · source: plan:SPRINT-5

Sprint 5 goal: timesheet submission and status, browser clock-in/out and HR leave configuration. Capacity 20.

- Goal wording suggests overlap with US-018, US-020 and US-029 (with tasks US-029-T1 to T3). This is inferred from the goal text, not stated by the plan.
- Capacity: 20.

- ⚠ No stories are explicitly assigned to this sprint.
- ⚠ US-029 is 8 points and carries three tasks. Whether it fits within one sprint's capacity of 20 alongside other work is not stated.
- ⚠ No outcome, completion or velocity data provided.

### DEV-SPRINT-6 · approved · source: plan:SPRINT-6

Sprint 6 goal: leave requests, half-days, validation, balances, holiday calendar and HR punch correction. Capacity 20.

- Goal wording suggests overlap with US-023 to US-026, US-028 and US-022. This is inferred from the goal text, not stated by the plan.
- Capacity: 20.

- ⚠ No stories are explicitly assigned to this sprint.
- ⚠ The goal's apparent scope would total about 22 points if the inferred stories were all included, which exceeds the stated capacity of 20. This is unconfirmed because no assignment was given.
- ⚠ No outcome, completion or velocity data provided.

### DEV-SPRINT-7 · approved · source: plan:SPRINT-7

Sprint 7 goal: in-app alerts, pending approvals list and approving timesheets and leave. Capacity 20.

- Goal wording suggests overlap with US-035, US-030 and US-031 (tasks US-031-T1 to T3). This is inferred from the goal text, not stated by the plan.
- Capacity: 20.

- ⚠ No stories are explicitly assigned to this sprint.
- ⚠ No outcome, completion or velocity data provided.

### DEV-SPRINT-8 · approved · source: plan:SPRINT-8

Sprint 8 goal: rejection, self-approval escalation, reopen, resubmission and leave history. Capacity 20.

- Goal wording suggests overlap with US-032, US-033, US-034, US-019 and US-027. This is inferred from the goal text, not stated by the plan.
- Capacity: 20.

- ⚠ No stories are explicitly assigned to this sprint.
- ⚠ The goal wording says 'self-approval escalation'. US-033 is titled 'No self-approval for multi-role users', and the escalation behaviour is not described in the input.
- ⚠ No outcome, completion or velocity data provided.

### DEV-SPRINT-9 · approved · source: plan:SPRINT-9

Sprint 9 goal: employee home dashboard, phone-browser layouts and the user guides. Capacity 20.

- Goal wording suggests overlap with US-036, US-037, US-039 and US-040. This is inferred from the goal text, not stated by the plan.
- Capacity: 20.

- ⚠ No stories are explicitly assigned to this sprint.
- ⚠ No outcome, completion or velocity data provided.

### DEV-EPIC-001 · approved · source: plan:EPIC-001

Secure Access, Accounts and Role-Based Permissions. 7 stories, 36 points, mostly backend-agent, with US-004 on security-agent.

- US-001 Sign in with email and password (5, backend-agent)
- US-002 Administrator creates user accounts, no public self-registration (5, backend-agent)
- US-003 Permissions combine as a union across multiple roles (5, backend-agent)
- US-004 Access scoped by relationship, not only by role (8, security-agent)
- US-005 Session timeout and account lockout (5, backend-agent)
- US-006 Administrator-issued password reset (3, backend-agent)
- US-007 Immutable audit log of approvals, changes and admin actions (5, backend-agent)

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007

- ⚠ No implementation or completion status per story.
- ⚠ Lockout thresholds, timeout durations and password rules are not in the input.

### DEV-EPIC-002 · approved · source: plan:EPIC-002

Employee Profiles, Departments and Reporting Lines. 5 stories, 18 points.

- US-008 View and update my own profile (3, frontend-agent)
- US-009 HR Admin maintains employee records (5, backend-agent)
- US-010 HR Admin corrects or erases a leaver's record (5, backend-agent)
- US-011 HR Admin maintains departments (2, backend-agent)
- US-012 Manager views their direct reports (3, backend-agent)

**Related:** US-008, US-009, US-010, US-011, US-012

- ⚠ No implementation or completion status per story.
- ⚠ Frontend work is planned only for US-008. HR employee and department screens have no frontend item in the plan.
- ⚠ The project description mentions project assignments under employee management. These are covered by EPIC-003.

### DEV-EPIC-003 · approved · source: plan:EPIC-003

Projects and Employee Assignments. 3 stories, 8 points.

- US-013 Create and manage project records (3, backend-agent)
- US-014 Assign employees to projects (3, backend-agent)
- US-015 Employee sees their own project assignments (2, frontend-agent)

**Related:** US-013, US-014, US-015

- ⚠ No implementation or completion status per story.
- ⚠ The Project Manager role (create/manage projects, assign employees, review project timesheets, monitor utilization) is not named in these stories.
- ⚠ No plan item covers project utilization or allocated-hours monitoring.

### DEV-EPIC-004 · approved · source: plan:EPIC-004

Timesheet Entry and Submission. 4 stories, 18 points.

- US-016 Log daily hours against assigned projects (5, backend-agent)
- US-017 Enter and review a weekly timesheet (5, frontend-agent)
- US-018 Submit a timesheet and track its status on screen (5, backend-agent)
- US-019 Correct and resubmit a rejected timesheet (3, backend-agent)

**Related:** US-016, US-017, US-018, US-019

- ⚠ No implementation or completion status per story.
- ⚠ The weekly grid is named in the Sprint 4 goal. Daily-entry UI is not separately described.

### DEV-EPIC-005 · approved · source: plan:EPIC-005

Attendance Clock-In and Clock-Out. 3 stories, 8 points.

- US-020 Clock in and clock out from any browser (3, backend-agent)
- US-021 View my own attendance history (2, backend-agent)
- US-022 HR Admin views and corrects attendance punches (3, backend-agent)

**Related:** US-020, US-021, US-022

- ⚠ No implementation or completion status per story.
- ⚠ All three stories are assigned to backend-agent. No frontend item exists for the clock-in/out or attendance screens.

### DEV-EPIC-006 · approved · source: plan:EPIC-006

Leave Requests, Balances and Holiday Calendar. 7 stories, 28 points, plus three tasks under US-029.

- US-023 Apply for leave by type and date range (5, backend-agent)
- US-024 Request a half-day as the smallest leave increment (2, backend-agent)
- US-025 Leave requests validate against weekends, holidays and available balance (5, backend-agent)
- US-026 View my leave balances (3, backend-agent)
- US-027 View my leave history and request status (3, frontend-agent)
- US-028 View the company holiday calendar (2, frontend-agent)
- US-029 HR Admin configures leave types, entitlements and holidays (8, backend-agent)
  - US-029-T1 Implement leave type and holiday admin endpoints (backend-agent)
  - US-029-T2 Implement opening balance set/adjust endpoint (backend-agent)
  - US-029-T3 Build HR leave configuration screens (frontend-agent)

**Related:** US-023, US-024, US-025, US-026, US-027, US-028, US-029, US-029-T1, US-029-T2, US-029-T3

- ⚠ No implementation or completion status per story or task.
- ⚠ Tasks have no point estimates.
- ⚠ Leave application and balance views (US-023, US-026) have no frontend item.

### DEV-EPIC-007 · approved · source: plan:EPIC-007

Single-Step Approval of Timesheets and Leave. 6 stories, 31 points, plus three tasks under US-031.

- US-030 Review pending timesheets and leave for my direct reports (5, backend-agent)
- US-031 Approve a submitted timesheet or leave request (8, backend-agent)
  - US-031-T1 Implement atomic approve endpoint (backend-agent)
  - US-031-T2 Add approve action to the pending detail screen (frontend-agent)
  - US-031-T3 Write concurrency tests for balance deduction (qa-agent)
- US-032 Reject an item with a mandatory comment (3, backend-agent)
- US-033 No self-approval for multi-role users (5, backend-agent)
- US-034 HR Admin reopens an approved item (5, backend-agent)
- US-035 In-app alerts for submissions and decisions (5, backend-agent)

**Related:** US-030, US-031, US-031-T1, US-031-T2, US-031-T3, US-032, US-033, US-034, US-035

- ⚠ No implementation or completion status per story or task.
- ⚠ Tasks have no point estimates.
- ⚠ Only direct-report approval is planned. Delegation, multi-level approval and email notifications are not in the input.

### DEV-EPIC-008 · approved · source: plan:EPIC-008

Employee Home Dashboard and Mobile-Responsive Portal. 3 stories, 12 points, all frontend-agent.

- US-036 See my timesheet, attendance and leave on one home dashboard (5, frontend-agent)
- US-037 Use the portal on a phone browser (5, frontend-agent)
- US-038 Single-language interface and consistent date/time display (2, frontend-agent)

**Related:** US-036, US-037, US-038

- ⚠ No implementation or completion status per story.
- ⚠ The Sprint 1 goal mentions language and date/time handling, while US-038 is the frontend story. How the two relate is not stated.
- ⚠ Supported phone browsers and breakpoints are not specified.

### DEV-EPIC-009 · approved · source: plan:EPIC-009

Portal User Guide. 2 stories, 6 points, both frontend-agent: an employee guide and an administrator guide.

- US-039 Employee user guide (3, frontend-agent)
- US-040 Administrator user guide (3, frontend-agent)

**Related:** US-039, US-040

- ⚠ No implementation or completion status per story.
- ⚠ Guide content or location was not provided.
<!-- sdlc:auto:end narrative -->

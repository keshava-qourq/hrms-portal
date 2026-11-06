# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Sign-in, role union, audit log and departments foundation

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Sign in with email and password | 5 | backend-agent | — |
| US-003 | Story | Permissions combine as a union across multiple roles | 5 | backend-agent | US-001 |
| US-007 | Story | Immutable audit log of approvals, changes and admin actions | 5 | backend-agent | — |
| US-041 | Story | Sign-in screen reads session_token from the login response | 1 | frontend-agent | US-001 |
| US-011 | Story | HR Admin maintains departments | 2 | backend-agent | — |
| US-038 | Story | Single-language interface and consistent date/time display | 2 | frontend-agent | — |

## Sprint 2: Sprint 2

Admin-created accounts, relationship-scoped access and employee records

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-002 | Story | Administrator creates user accounts — no public self-registration | 5 | backend-agent | US-001 |
| US-004 | Story | Access scoped by relationship, not only by role | 8 | security-agent | US-002, US-003 |
| US-009 | Story | HR Admin maintains employee records | 5 | backend-agent | US-004, US-011 |

## Sprint 3: Sprint 3

Session security, own profile, leaver handling and manager team list

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-005 | Story | Session timeout and account lockout | 5 | backend-agent | US-001 |
| US-006 | Story | Administrator-issued password reset | 3 | backend-agent | US-001 |
| US-008 | Story | View and update my own profile | 3 | frontend-agent | US-001, US-009 |
| US-010 | Story | HR Admin corrects or erases a leaver's record | 5 | backend-agent | US-009 |
| US-012 | Story | Manager views their direct reports | 3 | backend-agent | US-009 |

## Sprint 4: Sprint 4

Projects, assignments and timesheet entry

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-013 | Story | Create and manage project records | 3 | backend-agent | US-004 |
| US-014 | Story | Assign employees to projects | 3 | backend-agent | US-013, US-009 |
| US-015 | Story | Employee sees their own project assignments | 2 | frontend-agent | US-014 |
| US-016 | Story | Log daily hours against assigned projects | 5 | backend-agent | US-014 |
| US-017 | Story | Enter and review a weekly timesheet | 5 | frontend-agent | US-016 |

## Sprint 5: Sprint 5

Timesheet submission, clock-in/out and leave policy configuration

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-018 | Story | Submit a timesheet and track its status on screen | 5 | backend-agent | US-017 |
| US-020 | Story | Clock in and clock out from any browser | 3 | backend-agent | US-001 |
| US-021 | Story | View my own attendance history | 2 | backend-agent | US-020 |
| US-029 | Story | HR Admin configures leave types, entitlements and holidays | 8 | backend-agent | US-009, US-007 |
| ↳ US-029-T1 | Task | Add leave_types, leave_balances and holidays tables | — | backend-agent | — |
| ↳ US-029-T2 | Task | Implement leave type and opening balance endpoints | — | backend-agent | — |
| ↳ US-029-T3 | Task | Implement holiday calendar admin endpoint | — | backend-agent | — |
| ↳ US-029-T4 | Task | Build HR leave configuration screens | — | frontend-agent | — |

## Sprint 6: Sprint 6

Leave requests, balances, holiday calendar and attendance correction

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-022 | Story | HR Admin views and corrects attendance punches | 3 | backend-agent | US-021, US-009 |
| US-023 | Story | Apply for leave by type and date range | 5 | backend-agent | US-029, US-009 |
| US-024 | Story | Request a half-day as the smallest leave increment | 2 | backend-agent | US-023 |
| US-025 | Story | Leave requests validate against weekends, holidays and available balance | 5 | backend-agent | US-023, US-029 |
| US-026 | Story | View my leave balances | 3 | backend-agent | US-029 |
| US-028 | Story | View the company holiday calendar | 2 | frontend-agent | US-029 |

## Sprint 7: Sprint 7

Manager approvals and in-app alerts

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-030 | Story | Review pending timesheets and leave for my direct reports | 5 | backend-agent | US-018, US-023, US-012 |
| US-031 | Story | Approve a submitted timesheet or leave request | 8 | backend-agent | US-030 |
| ↳ US-031-T1 | Task | Implement timesheet approval transition | — | backend-agent | — |
| ↳ US-031-T2 | Task | Implement leave approval with transactional balance deduction | — | backend-agent | — |
| ↳ US-031-T3 | Task | Write approval events and audit entries | — | backend-agent | — |
| ↳ US-031-T4 | Task | Add approve action to the pending approvals screen | — | frontend-agent | — |
| US-035 | Story | In-app alerts for submissions and decisions | 5 | backend-agent | US-030, US-031 |

## Sprint 8: Sprint 8

Rejection flow, self-approval escalation, reopen, resubmission and leave history

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-019 | Story | Correct and resubmit a rejected timesheet | 3 | backend-agent | US-018, US-032 |
| US-027 | Story | View my leave history and request status | 3 | frontend-agent | US-023, US-032 |
| US-032 | Story | Reject an item with a mandatory comment | 3 | backend-agent | US-030 |
| US-033 | Story | No self-approval for multi-role users | 5 | backend-agent | US-030, US-031 |
| US-034 | Story | HR Admin reopens an approved item | 5 | backend-agent | US-031 |

## Sprint 9: Sprint 9

Home dashboard, mobile responsiveness, user guides and change-password endpoint

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-042 | Story | Backend endpoint to change a password | 3 | backend-agent | US-001, US-006 |
| US-036 | Story | See my timesheet, attendance and leave on one home dashboard | 5 | frontend-agent | US-018, US-020, US-026, US-030 |
| US-037 | Story | Use the portal on a phone browser | 5 | frontend-agent | US-036, US-017, US-020, US-023 |
| US-039 | Story | Employee user guide | 3 | frontend-agent | US-019, US-027 |
| US-040 | Story | Administrator user guide | 3 | frontend-agent | US-034, US-029 |

## Sprint 10: Sprint 10

Administrator password reset endpoint, UI and automated tests

Capacity: 20 points · Committed: 9

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-043 | Story | Frontend sign-in test using the real login response | 2 | qa-agent | US-041 |
| US-044 | Story | Backend endpoint to issue an administrator password reset | 3 | backend-agent | US-002, US-006 |
| US-045 | Story | Users & roles 'Issue password reset' button calls the backend | 2 | frontend-agent | US-044 |
| US-046 | Story | Automated tests for the administrator password reset | 2 | qa-agent | US-044, US-045 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->

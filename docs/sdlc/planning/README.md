# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### EPIC-001 · approved · source: planning:EPIC-001

Email-and-password sign-in with accounts created only by an administrator. Five fixed roles with predefined permission sets, combined as a union when a user holds several. Access is scoped by relationship as well as by role.

- Goal: secure access, admin-managed accounts, RBAC, audit logging and password management.
- Roles: Employee, Reporting Manager, HR Admin, Project Manager, System Admin.
- Scope also covers password change, the administrator password-reset endpoint and its UI, and automated tests for the sign-in and reset flows.
- Open assumptions to confirm:
  - Authentication is application-managed email and password: hashed passwords, session timeout, lockout after repeated failures. No public self-registration.
  - CONFLICT with confirmed understanding: the understanding assumed emailed reset links, but transactional email (SendGrid/SES) was removed from scope. This version delivers administrator-issued password resets instead.
  - Roles are fixed. System Admins assign and combine roles per user and cannot create custom roles or toggle individual permissions.
  - Company SSO (Google Workspace / Microsoft 365 / Azure AD) is out of scope.
  - Employee records are personal data: restricted by role and relationship, encrypted in transit and at rest. No special-category data is stored.
  - Audit logging is minimal (approvals, rejections, record changes, admin actions, attendance corrections). It is recorded as a firm requirement in the confirmed understanding.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-041, US-042, US-043, US-044, US-045, US-046

### EPIC-002 · approved · source: planning:EPIC-002

Employee profile records holding core people data, each tied to a department and a reporting manager. Employees maintain permitted details on their own profile. HR Admins maintain the records and the organisation structure.

- Goal: an accurate system of record for the workforce, departments and reporting lines.
- Open assumptions to confirm:
  - Employee data is personal data. Access is role- and relationship-restricted, and HR Admins can correct or erase a leaver's record. No special-category data is stored.
  - Assumed split of profile fields: contact details are employee-editable, employment data is HR-only. This needs confirmation.
  - CONFLICT with confirmed understanding: bulk CSV/Excel import of employees, departments and opening balances was assumed, but it is NOT in the Lightweight MVP capability set. Records are created in-portal one at a time. Creating several hundred records manually at launch is onerous, so this needs confirmation.
  - Employee document storage (contracts, payslips) is out of scope.

**Related:** US-008, US-009, US-010, US-011, US-012

### EPIC-003 · approved · source: planning:EPIC-003

Project records and the assignment of employees to projects. Assignments determine what an employee may book hours against and what a Project Manager may see.

- Goal: project management and employee-to-project assignment.
- Open assumptions to confirm:
  - Project Managers see only the projects they are assigned to.
  - Allocated hours per assignment are captured so allocated-versus-actual comparison is possible later. The reporting dashboards themselves are not in the Lightweight MVP scope.

**Related:** US-013, US-014, US-015

### EPIC-004 · approved · source: planning:EPIC-004

Daily and weekly entry of working hours against assigned projects, submission for approval, and on-screen status tracking.

- Goal: timesheet entry, submission, status tracking and resubmission after rejection.
- Open assumptions to confirm:
  - The timesheet period is a calendar week, with hours entered per day per project.
  - Validation limits (e.g. a maximum of 24 hours per day) are assumed and need confirmation.
  - Timesheet hours are project effort and are deliberately separate from attendance clock times. They are not reconciled automatically in this version.
  - CONFLICT with confirmed understanding: CSV/Excel export of approved timesheets for payroll was assumed, but it is not in the Lightweight MVP capability set.

**Related:** US-016, US-017, US-018, US-019

### EPIC-005 · approved · source: planning:EPIC-005

A distinct attendance module, separate from timesheets. Employees record actual arrival and departure each day through the responsive web portal, timestamped by the server clock.

- Goal: attendance clock-in/clock-out, personal attendance history and HR correction of punches.
- Open assumptions to confirm:
  - Punches are made in the browser, including a phone browser, and are timestamped by the server clock. There is no geofencing or location check.
  - Biometric clock-in and physical badge/RFID terminals are out of scope.
  - One clock-in and one clock-out per calendar day is assumed. Mid-day breaks are not punched.
  - HR correction of missed punches (regularisation) is included at a minimal level.
  - Attendance reports (late arrivals, early departures, absent days, hours per period) were described in the confirmed understanding but are NOT in this Lightweight MVP scope.

**Related:** US-020, US-021, US-022

### EPIC-006 · approved · source: planning:EPIC-006

Employees apply for leave by type and date range, see their balances and history, and view the shared holiday calendar. HR Admins configure leave types and set balances.

- Goal: leave requests, balances, history, holiday calendar and HR leave configuration.
- Open assumptions to confirm:
  - Each leave type carries an annual entitlement. Balances deduct on approval and support half-days as the smallest increment. Requests are validated against weekends and the holiday calendar, and blocked when they exceed the available balance unless an HR Admin overrides.
  - Accrual and carry-over rules were assumed in the confirmed understanding. In this scope, entitlement is an annual figure per employee and automated accrual/carry-over is NOT included. This needs confirmation.
  - One shared holiday calendar and one set of leave policies for a single country and timezone. Multi-country calendars and per-country rules are out of scope.
  - No special-category data is stored, so sickness leave carries no medical certificate or health detail.

**Related:** US-023, US-024, US-025, US-026, US-027, US-028, US-029

### EPIC-007 · approved · source: planning:EPIC-007

Reporting Managers approve or reject their direct reports' timesheets and leave requests. A comment is required on rejection, and the employee is alerted in the portal.

- Goal: single-step approval, rejection, self-approval prevention, HR reopening and in-app alerts.
- Open assumptions to confirm (the confirmed understanding flagged the first two as the most important to check):
  - Approval is SINGLE-STEP: the employee's Reporting Manager decides. Rejected items return to the employee as editable drafts. Approved items lock and can only be reopened by an HR Admin, with the reversal audit-logged. No multi-level approval chains are built.
  - A multi-role user cannot approve their own submission. It escalates to the next manager up the reporting line, or to an HR Admin where none exists.
  - CONFLICT with confirmed understanding: in-app alerts plus transactional email were assumed, but email was removed from scope. Notifications are in-app only, with no emailed notices and no pending-approval reminder email. This needs confirmation.
  - Manager dashboards and reports (team availability, project utilisation, headcount, leave liability) are not in this Lightweight MVP scope. Managers see a pending-items list only.

**Related:** US-030, US-031, US-032, US-033, US-034, US-035

### EPIC-008 · approved · source: planning:EPIC-008

A single home dashboard for the signed-in employee covering their own timesheet, attendance and leave. The screens work on a phone browser as well as a desktop.

- Goal: employee home dashboard, mobile-responsive layouts, and a single-language interface with consistent date/time display.
- Open assumptions to confirm:
  - The interface is single-language (English / the local language). A multi-language UI is out of scope.
  - The portal is mobile-responsive in the browser. Native iOS/Android apps, offline clock-in and push notifications are out of scope.
  - Dates and times are displayed in the company's single timezone.

**Related:** US-036, US-037, US-038

### EPIC-009 · approved · source: planning:EPIC-009

Written guidance so employees and administrators can use the portal without person-to-person training.

- Goal: an employee guide and an administrator guide.
- Open assumptions to confirm:
  - The guide is delivered as in-portal help pages in the single configured language, covering only the capabilities built in this version.
  - Video or interactive training material is not included.

**Related:** US-039, US-040

### SPRINT-1 · draft · source: plan:SPRINT-1

Sprint 1 of the generated plan (version 15). Goal: sign-in, role union, audit log and departments foundation.

- Goal: Sign-in, role union, audit log and departments foundation.
- Capacity: 20.
- Plan status: generated, version 15.

### SPRINT-2 · draft · source: plan:SPRINT-2

Sprint 2 of the generated plan (version 15). Goal: admin-created accounts, relationship-scoped access and employee records.

- Goal: Admin-created accounts, relationship-scoped access and employee records.
- Capacity: 20.
- Plan status: generated, version 15.

### SPRINT-3 · draft · source: plan:SPRINT-3

Sprint 3 of the generated plan (version 15). Goal: session security, own profile, leaver handling and manager team list.

- Goal: Session security, own profile, leaver handling and manager team list.
- Capacity: 20.
- Plan status: generated, version 15.

### SPRINT-4 · draft · source: plan:SPRINT-4

Sprint 4 of the generated plan (version 15). Goal: projects, assignments and timesheet entry.

- Goal: Projects, assignments and timesheet entry.
- Capacity: 20.
- Plan status: generated, version 15.

### SPRINT-5 · draft · source: plan:SPRINT-5

Sprint 5 of the generated plan (version 15). Goal: timesheet submission, clock-in/out and leave policy configuration.

- Goal: Timesheet submission, clock-in/out and leave policy configuration.
- Capacity: 20.
- Plan status: generated, version 15.

### SPRINT-6 · draft · source: plan:SPRINT-6

Sprint 6 of the generated plan (version 15). Goal: leave requests, balances, holiday calendar and attendance correction.

- Goal: Leave requests, balances, holiday calendar and attendance correction.
- Capacity: 20.
- Plan status: generated, version 15.

### SPRINT-7 · draft · source: plan:SPRINT-7

Sprint 7 of the generated plan (version 15). Goal: manager approvals and in-app alerts.

- Goal: Manager approvals and in-app alerts.
- Capacity: 20.
- Plan status: generated, version 15.

### SPRINT-8 · draft · source: plan:SPRINT-8

Sprint 8 of the generated plan (version 15). Goal: rejection flow, self-approval escalation, reopen, resubmission and leave history.

- Goal: Rejection flow, self-approval escalation, reopen, resubmission and leave history.
- Capacity: 20.
- Plan status: generated, version 15.

### SPRINT-9 · draft · source: plan:SPRINT-9

Sprint 9 of the generated plan (version 15). Goal: home dashboard, mobile responsiveness, user guides and change-password endpoint.

- Goal: Home dashboard, mobile responsiveness, user guides and change-password endpoint.
- Capacity: 20.
- Plan status: generated, version 15.

### SPRINT-10 · draft · source: plan:SPRINT-10

Sprint 10 of the generated plan (version 15). Goal: administrator password reset endpoint, UI and automated tests.

- Goal: Administrator password reset endpoint, UI and automated tests.
- Capacity: 20.
- Plan status: generated, version 15.
<!-- sdlc:auto:end narrative -->

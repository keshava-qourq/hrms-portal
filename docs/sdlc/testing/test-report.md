# Test Report

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start e2e -->
**Status:** failed
**Target:** sandbox
**Date:** 2026-11-06

Passed: 37 · Failed: 5 · Skipped: 0 · Flaky: 0 · Total: 42

| Spec | Status |
|---|---|
| [US-009-3] missing mandatory field shows inline validation, then create succeeds and appears in the directory | passed |
| the app loads | passed |
| [AC-021] sign-in tells the user to contact an administrator and offers no self-service reset | passed |
| [AC-023] one-time password sign-in is forced to change password before any other screen | passed |
| [AC-029] My Profile displays name, employee ID, department, manager, work email and contact details | passed |
| [AC-031] department, reporting manager and employee ID are read-only | passed |
| [AC-030] changing the mobile number saves, sends only editable fields and confirms on screen | passed |
| [AC-042] My Team lists exactly the three reports with department and leave/timesheet status | passed |
| [AC-043] a non-report is not listed on My Team | passed |
| [AC-043] a non-report's profile is not reachable from the screen | passed |
| [AC-042] a manager with no reports sees the empty state | passed |
| [AC-010] multi-role user sees both the employee and the manager/admin menus | passed |
| [AC-011] Employee-only user sees neither Team & Approvals nor Administration menus | failed |
| [AC-011] Employee-only user cannot reach /administration by direct address | passed |
| [AC-011] Employee-only user cannot reach /approvals by direct address | failed |
| [AC-006] visiting /register unauthenticated redirects to sign-in with no registration form | passed |
| [AC-006] visiting /registration unauthenticated redirects to sign-in with no registration form | passed |
| [AC-006] visiting /signup unauthenticated redirects to sign-in with no registration form | passed |
| [AC-006] visiting /sign-up unauthenticated redirects to sign-in with no registration form | passed |
| [AC-006] visiting /create-account unauthenticated redirects to sign-in with no registration form | passed |
| [AC-006] visiting /account/new unauthenticated redirects to sign-in with no registration form | passed |
| [AC-006] visiting /admin/users/new unauthenticated redirects to sign-in with no registration form | passed |
| [AC-006] visiting /administration/users/new unauthenticated redirects to sign-in with no registration form | passed |
| [AC-006] visiting /users/new unauthenticated redirects to sign-in with no registration form | passed |
| [AC-006] the sign-in screen itself exposes no self-registration affordance | passed |
| [AC-134] no language selector on the sign-in screen | passed |
| [AC-134] no language selector and single-language labels on /home | passed |
| [AC-134] no language selector and single-language labels on /timesheet | passed |
| [AC-134] no language selector and single-language labels on /leave | passed |
| [AC-134] no language selector and single-language labels on /approvals | passed |
| [AC-134] no language selector and single-language labels on /administration | passed |
| [AC-135] timestamps on /home use the one canonical format "dd MMM yyyy, HH:mm" | failed |
| [AC-135] timestamps on /timesheet use the one canonical format "dd MMM yyyy, HH:mm" | passed |
| [AC-135] timestamps on /approvals use the one canonical format "dd MMM yyyy, HH:mm" | failed |
| [AC-135] timestamps on /leave use the one canonical format "dd MMM yyyy, HH:mm" | passed |
| [AC-135] the same instant renders identically across screens and in company timezone | passed |
| [AC-135] [NFR-017] company-timezone formatting is independent of browser timezone | passed |
| [AC-056] grid shows each assigned project as a row, Mon–Sun columns and row/day/week totals | passed |
| [AC-057] editing a cell and clicking Save draft recalculates totals and persists after reload | passed |
| [AC-058] Previous and Next week show that week's entries and status; an empty week is a blank draft | passed |
| [AC-055] a negative value is flagged inline with a message and is not saved | passed |
| [AC-054] a day total above 24 is flagged inline with a message and is not saved | failed |
<!-- sdlc:auto:end e2e -->

<!-- sdlc:auto:start unit -->
**Coverage:** backend 86.4% · frontend 60.8%

**Test cases:** 0 / 161 written

**Lines written:** 0

**Files deferred:** 0
<!-- sdlc:auto:end unit -->

<!-- sdlc:auto:start dev-checks -->
### Sprint 4

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-06 |

### Sprint 3

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-04 |

### Sprint 2

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-03 |

### Sprint 1

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-03 |

### Sprint 1

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-03 |
<!-- sdlc:auto:end dev-checks -->

# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-CHECKS-1 · draft · source: testing:run_checks

The run_checks step succeeded with 6 of 6 checks passing. It is not linked to any ticket.

- Result: succeeded
- Detail: 6/6 checks passed
- Ticket: none recorded
- The input does not say which 6 checks ran (e.g. lint, unit tests, build).

- ⚠ The names and scope of the 6 checks are not provided, so what this pass covers cannot be documented.
- ⚠ No run date or build/commit identifier was provided.
- ⚠ No ticket is associated with this run.

### TEST-E2E-1 · draft · source: testing:e2e_latest

The latest E2E run on the sandbox failed, with 37 of 42 checks passing and 5 failing. The failures cover three acceptance criteria.

- Result: failed
- Passed: 37 / 42
- Target: sandbox
- Failed checks (5):
  - AC-011: Employee-only user sees neither Team & Approvals nor Administration menus
  - AC-011: Employee-only user cannot reach /approvals by direct address
  - AC-135: timestamps on /home use the canonical format "dd MMM yyyy, HH:mm"
  - AC-135: timestamps on /approvals use the canonical format "dd MMM yyyy, HH:mm"
  - AC-054: a day total above 24 is flagged inline with a message and is not saved
- The 5 failures match the 42 − 37 difference.
- The 6/6 run_checks pass (TEST-CHECKS-1) and this E2E failure are different checks, not a conflict. The input does not say whether run_checks covers any of the failing criteria.

**Related:** AC-011, AC-135, AC-054

- ⚠ No run date, build/version or run id was provided.
- ⚠ The 37 passing checks are not listed, so coverage of the other requirements cannot be documented.
- ⚠ Failure causes are not provided.
- ⚠ No re-run or fix is recorded, so the failures are unresolved as far as the input shows.
- ⚠ No sign-off or release decision was provided.

### TEST-FAIL-AC-011 · draft · source: testing:e2e_latest

Two E2E checks for AC-011 failed: menu visibility for an Employee-only user, and direct access to /approvals. Both concern role-based access control.

- Failed: Employee-only user sees neither Team & Approvals nor Administration menus. The expected behavior was not observed.
- Failed: Employee-only user cannot reach /approvals by direct address. The expected behavior was not observed.
- Context: the project's RBAC goal is that users access only features permitted for their role, and Employees do not hold approval permissions.
- Because the second check covers the direct URL, this is a possible access-control gap and not only a display issue. It needs human triage; the input does not confirm the actual behavior or cause.

**Related:** AC-011, TEST-E2E-1

- ⚠ The observed behavior is not stated (e.g. whether the menus were shown, or whether /approvals loaded or returned an error).
- ⚠ The requirement ids (US-xxx) behind AC-011 are not given, so the link to specific requirements is unconfirmed.
- ⚠ The RBAC requirements text in the project description is truncated at "2. Employees can", so the full RBAC rules could not be cross-checked.
- ⚠ No defect ticket or fix is recorded.

### TEST-FAIL-AC-135 · draft · source: testing:e2e_latest

Two E2E checks for AC-135 failed: timestamps on /home and /approvals do not match the canonical format "dd MMM yyyy, HH:mm".

- Failed: timestamps on /home use the one canonical format "dd MMM yyyy, HH:mm".
- Failed: timestamps on /approvals use the one canonical format "dd MMM yyyy, HH:mm".
- The expected format is a single canonical format across screens.
- Whether other screens meet this criterion is not stated.

**Related:** AC-135, TEST-E2E-1

- ⚠ The actual formats observed are not provided.
- ⚠ The requirement ids (US-xxx) behind AC-135 are not given.
- ⚠ Whether other screens were checked for this format is unknown.
- ⚠ No defect ticket or fix is recorded.

### TEST-FAIL-AC-054 · draft · source: testing:e2e_latest

The E2E check for AC-054 failed. A day total above 24 hours was not confirmed to be flagged inline with a message and blocked from saving.

- Failed: a day total above 24 is flagged inline with a message and is not saved.
- The check sits in the timesheet-entry area, where employees log daily hours.
- The input does not say which part failed: the inline message, the save-blocking, or both.

**Related:** AC-054, TEST-E2E-1

- ⚠ It is unclear whether the failure is a missing message, the entry being saved, or both.
- ⚠ The requirement ids (US-xxx) behind AC-054 are not given.
- ⚠ No defect ticket or fix is recorded.
<!-- sdlc:auto:end narrative -->

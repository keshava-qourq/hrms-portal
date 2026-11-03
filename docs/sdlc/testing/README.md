# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-GAP-001 · draft

No testing input was provided. No test plan, test cases, execution results or defects exist, even though the requirements supply 141 acceptance criteria that are directly testable.

Each story carries explicit Given/When/Then acceptance criteria (AC-001..AC-141) that would form the basis of functional test cases, and the non-functional requirements imply security tests (server-side authorisation on every request, generic sign-in errors, hash-only password storage), concurrency tests (leave balance integrity, NFR-015) and responsive-layout tests at a 360px viewport (NFR-016). None of this has been planned or run.

**Related:** REQ-SCOPE-001, REQ-NFR-SEC-001, REQ-NFR-UX-001

- ⚠ Testing phase has not started — no test plan, cases, runs or results recorded.
- ⚠ No traceability from AC-001..AC-141 to test cases.
- ⚠ No security testing recorded against NFR-001..NFR-008.
- ⚠ No concurrency testing recorded against NFR-015 (double-deduction of leave balances).
- ⚠ No mobile/responsive verification recorded against NFR-016 (360px viewport).
- ⚠ No UAT plan or acceptance sign-off path recorded.
<!-- sdlc:auto:end narrative -->

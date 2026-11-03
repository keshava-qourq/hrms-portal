# Maintenance

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### MAINT-GAP-001 · draft

No post-deployment or maintenance input was provided. The system is not live, so there are no incidents, support requests, monitoring observations or change records.

Known operational commitments carried from requirements: single-region deployment with no failover is an accepted outage risk (NFR-013); administrator-issued password resets create an ongoing System Admin support load (NFR-018); in-app-only notifications mean approvals are discovered only on sign-in (NFR-019); manual record creation is expected to be onerous at launch (NFR-020). None of these has an operational owner or process documented.

**Related:** REQ-NFR-OPS-001, REQ-NFR-UX-001

- ⚠ Maintenance phase has not started — the system has not been deployed.
- ⚠ No support model, on-call rota or ticket channel defined for administrator-issued password resets and account unlocks.
- ⚠ No monitoring, alerting or backup-restore verification routine defined.
- ⚠ No process for annual maintenance tasks implied by the scope: rolling the holiday calendar to a new year and setting new annual leave entitlements (no automated accrual/carry-over exists).
<!-- sdlc:auto:end narrative -->

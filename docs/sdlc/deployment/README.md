# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEPLOY-GAP-001 · draft

No deployment input was provided. No environments, releases, deployment attempts or runbooks are recorded.

Requirements mandate AWS hosting in a single managed region inside the company's own country (NFR-011), encryption in transit and at rest (NFR-008), daily automated backups with point-in-time restore (NFR-012), and accept a single-region deployment with no failover (NFR-013). The only configuration secret named is REDIS_URL. Nothing has been provisioned, configured or released.

**Related:** REQ-STACK-001, REQ-NFR-COMP-001, REQ-NFR-OPS-001

- ⚠ No deployment recorded yet — no environments, pipeline, release versions or deployment history.
- ⚠ The target AWS region (and therefore the data-residency commitment of NFR-011) is unconfirmed.
- ⚠ No evidence that daily backups and point-in-time restore have been configured (NFR-012).
- ⚠ No TLS/encryption-at-rest configuration evidence (NFR-008).
- ⚠ No secrets-management approach for REDIS_URL and database credentials.
- ⚠ No launch-data-loading plan, despite bulk import being excluded (NFR-020) and several hundred records needing manual entry at go-live.
<!-- sdlc:auto:end narrative -->

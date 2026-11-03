# Architecture

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Overview

### ARCH-GAP-001 · draft

No architecture phase input was provided. The only architecture-relevant material available is the product-owner-approved stack and service list captured under requirements. Nothing has been designed, reviewed or approved.

Available as constraints only (from REQ-STACK-001): React 19 frontend, FastAPI 0.115 backend, PostgreSQL 16, AWS single in-country region, Redis 7-alpine used as both queue and session/dashboard cache, REDIS_URL as the required secret. No component diagram, data model, API contract, authentication/session design, RBAC enforcement design, audit-log design, deployment topology or ADRs have been supplied.

**Related:** REQ-STACK-001, REQ-NFR-SEC-001, REQ-NFR-COMP-001, REQ-NFR-OPS-001

- ⚠ Architecture phase has not started — no design documents, diagrams or decision records exist.
- ⚠ No data model for employees, departments, reporting lines, projects, assignments, timesheets, punches, leave types, balances, holidays, approvals, alerts or audit entries.
- ⚠ No design for server-side RBAC plus relationship scoping (NFR-004) or for the self-approval escalation routing (US-033).
- ⚠ No design for append-only audit storage (NFR-010) or for transactional balance updates (NFR-015).
- ⚠ No session/timeout/lockout design showing how Redis holds sessions.
- ⚠ No background-job design, even though a Redis queue is mandated while its stated workloads (import, export, reminder emails) are out of scope.
- ⚠ No AWS deployment topology, region choice, encryption-at-rest configuration or backup/restore design (NFR-008, NFR-011, NFR-012).
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start building-blocks -->
## Building Block View

_No architecture generated yet._
<!-- sdlc:auto:end building-blocks -->

<!-- sdlc:auto:start runtime -->
## Runtime View

_No architecture generated yet._
<!-- sdlc:auto:end runtime -->

<!-- sdlc:auto:start deployment-view -->
## Deployment View

_No architecture generated yet._
<!-- sdlc:auto:end deployment-view -->

<!-- sdlc:auto:start decisions -->
## Architecture Decisions

_No architecture generated yet._
<!-- sdlc:auto:end decisions -->

<!-- sdlc:auto:start links -->
## Related Documents

_No architecture generated yet._
<!-- sdlc:auto:end links -->

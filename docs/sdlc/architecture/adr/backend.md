<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-11-03

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Django REST Framework
- Flask
- Express

## Decision Outcome

Chosen option: FastAPI 0.115, because The weight of this system is rules, not throughput, and they all land in the API: relationship-scoped authorisation applied as one shared dependency on every route, self-approval escalation up the reporting line, half-day leave arithmetic that skips weekends and holiday dates, and transactional balance updates. FastAPI's dependency injection expresses the 'resolve session, union the roles, narrow by relationship' check once and attaches it everywhere, Pydantic models give the validation that AC-054 and AC-055 need at the edge, and Python's decimal and date handling keeps 0.5-day leave maths exact.

## Consequences

Async endpoints with a synchronous ORM session need discipline about blocking calls; at tens of concurrent users this is comfortable either way. Business rules live in service modules rather than framework-provided admin screens, so HR and admin CRUD screens must be built by hand - more work than Django's admin would be, but the relationship-scoped rules here would have had to override most of that admin anyway.
<!-- sdlc:auto:end adr -->
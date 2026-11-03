<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-11-03

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- MySQL 8
- SQL Server
- MongoDB

## Decision Outcome

Chosen option: PostgreSQL 16, because This is the company's system of record and everything in it is tightly related - employees to managers to projects to timesheet lines to balances - so foreign keys and unique constraints carry real business rules (one punch pair per employee per day, one timesheet per employee per week, one account per email). The correctness requirement in NFR-015 is met directly with SELECT FOR UPDATE inside a single transaction when an approval and an HR correction collide. The append-only audit log is a plain table with INSERT/SELECT-only grants and a trigger that refuses UPDATE and DELETE, with jsonb holding before/after values, and its queries stay fast at this volume.

## Consequences

Row locking on a balance row serialises simultaneous decisions for the same employee and leave type, which is precisely the intent and invisible at this scale. One managed instance with no read replica means reporting-style queries share the transactional instance - fine for 100-500 employees, and heavier dashboard aggregates are cached in Redis for the month-end rush.
<!-- sdlc:auto:end adr -->
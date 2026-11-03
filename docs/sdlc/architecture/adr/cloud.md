<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-11-03

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v1.

## Considered Options

- AWS
- Azure
- Google Cloud
- On-premise hosting

## Decision Outcome

Chosen option: AWS, because The data-residency promise is kept by running every node - CloudFront-fronted S3, ECS Fargate tasks, RDS and ElastiCache - in one region inside the company's own country, and AWS has the widest spread of in-country regions to choose from. It supplies the non-functional requirements as managed features rather than code: RDS daily automated snapshots with point-in-time restore (NFR-012), KMS encryption at rest and TLS in transit (NFR-008), and Secrets Manager for the database and Redis credentials.

## Consequences

Single-AZ, single-region with no failover is an accepted outage risk (NFR-013) and keeps cost and operational surface small. Fargate plus RDS plus ElastiCache is more moving parts than a single VM, but it removes patching and backup operations from a small team. SES sits close at hand if transactional email is ever brought back into scope - nothing in this design depends on it today.
<!-- sdlc:auto:end adr -->
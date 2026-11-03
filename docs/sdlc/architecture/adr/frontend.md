<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-11-03

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- React 19
- Vue 3
- Angular 18
- Server-rendered Jinja templates

## Decision Outcome

Chosen option: React 19, because One responsive component set covers all five roles here: the navigation and dashboard render from the permissions returned by /api/me, so a user holding Employee plus Reporting Manager sees both their own summary and the approval count from the same shell. The interactive parts of this product - the week-by-project timesheet grid with live row/column totals, the leave date-range picker with its non-working-day breakdown, and the filterable approval queue - are exactly what React's component and state model handles well, and the same build serves a 360px phone browser for clock-in.

## Consequences

As a client-rendered SPA it ships JavaScript before first paint, which is acceptable for an authenticated internal portal with no SEO need. Role-based hiding in React is cosmetic only, so every screen it hides is independently refused by the API (NFR-004) - the team must resist treating the UI as the access control. Mobile usability at 360px (NFR-016) needs explicit component work, notably a stacked day-card layout for the weekly grid rather than a cropped table.
<!-- sdlc:auto:end adr -->
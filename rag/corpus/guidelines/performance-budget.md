---
id: guidelines-performance-budget
title: Performance budget
lang: en
tags: [guideline, performance, budget]
---

# Performance budget

A performance budget sets measurable limits that every change must respect. It keeps the application responsive as features accumulate.

## Backend budget

For all **GET endpoints**, the 95th percentile (p95) of the response time must stay **below 300 ms**, measured at the API gateway under normal load. The budget excludes the first request after a deployment, when caches are cold. Endpoints that cannot meet the budget, such as large exports, must be documented as exceptions and handled asynchronously where possible.

### How it is measured

- Latency is recorded per endpoint and shown on the service dashboard.
- A load test in the integration environment runs weekly and compares results with the budget.
- A regression of more than 10 % against the previous week is investigated before the next release.

## Frontend budget

The **initial JavaScript bundle** must stay **below 500 kB** (compressed). The build fails if the limit is exceeded. Code that is not needed on the first screen is loaded lazily through route-level splitting.

| Item | Limit |
|---|---|
| GET endpoint latency, p95 | 300 ms |
| Initial JS bundle | 500 kB |
| Largest image on start page | 200 kB |

## Staying within budget

- Avoid N+1 queries; use fetch joins or batch loading.
- Cache read-heavy reference data such as the room list.
- Paginate every list endpoint.
- Review new third-party libraries for their size before adopting them.

## Exceptions

A change that exceeds a limit needs a justification in the change request and an agreement from the owning team. The exception is recorded and revisited at the next quarterly review.

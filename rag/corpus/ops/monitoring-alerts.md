---
id: ops-monitoring-alerts
title: Monitoring and alerting
lang: en
tags: [ops, monitoring, alerting]
---

# Monitoring and alerting

This page describes which signals the Raumreservation platform watches and when a human is woken up.

## Dashboards

All dashboards live in the metrics tool "RR Insight". Each team (Atlas, Boreal, Cirrus) owns one folder, and there is a shared folder named "Platform" that every on-call person should know by heart. It contains:

- API overview: request rate, latency percentiles, error rate
- Database: connections in use, slow queries, storage growth
- Calendar sync: duration and failures of synchronisation runs
- Infrastructure: CPU and memory per instance, instance count

Dashboards are reviewed during the quarterly capacity review. Panels that nobody looks at are removed.

## Paging rules

The on-call person is paged when either of the following conditions holds:

| Signal | Condition |
|--------|-----------|
| API latency | p95 latency of the API exceeds 800 ms for 10 minutes |
| Error rate | more than 2 % of requests fail for 5 minutes |

Both rules are evaluated against production traffic only. Health-check calls from the platform itself are excluded from the calculation.

Everything else creates a ticket or a chat message instead of a page. Examples are a slow nightly job, a certificate that is close to expiry, or disk usage above the warning level.

### Acknowledgement

A page must be acknowledged in the alert tool. If nobody acknowledges within the agreed window, the alert escalates to the backup person and then to the team lead. Details of the rotation are in the on-call document.

## Alert hygiene

- Every alert has a linked runbook. An alert without a runbook is not allowed in production.
- A noisy alert is fixed or deleted within two weeks; it is never muted permanently.
- After each S1 or S2 incident, the postmortem checks whether the alert fired early enough.

## Synthetic checks

A probe books and cancels a test slot in room "Pilatus" every five minutes in the int environment and reads the room list in production. Failures of the probe create a ticket and, if repeated, count towards the error-rate rule.

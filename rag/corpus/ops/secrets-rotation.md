---
id: ops-secrets-rotation
title: Secret rotation
lang: en
tags: [ops, secrets, rotation]
---

# Secret rotation

Secrets are values that grant access to systems: API keys, service credentials, signing material and tokens. This page describes how they are handled in the Raumreservation platform.

## Storage

All secrets are stored in the vault. They never appear in the source repository, in build logs, in tickets or in chat messages. Applications read them at start-up through the vault integration of the platform. Access to the vault is granted per team and per environment; the dev and int environments use separate secrets that are worthless in production.

## Regular rotation

All secrets and API keys are rotated every 90 days. The rotation is scheduled by the platform team and announced one week in advance. A typical rotation follows these steps:

1. Create the new secret in the vault next to the old one.
2. Deploy consumers so that they accept both values.
3. Switch the producing side to the new value.
4. Remove the old value after a short grace period.
5. Record the rotation in the ticket.

Because consumers accept both values for a while, rotation does not require downtime and can be done outside the weekly maintenance window.

| Item | Interval |
|------|----------|
| Application secrets | 90 days |
| API keys for integrations | 90 days |
| Emergency rotation | within 24 h |

## Emergency rotation

If a leak is suspected, for example because a value appeared in a log, a screenshot or a public repository, the affected secret is rotated within 24 h. The person who notices the problem informs the on-call person, who opens an S2 incident. Until the new value is active, the old one is revoked if the integration allows it.

### After the emergency

The audit log is searched for use of the leaked value. Findings are documented in the postmortem together with the question of how the value reached the wrong place, and an action item is created to prevent a repeat.

## Responsibilities

Each secret has an owning team, listed in the vault metadata. The owner makes sure rotation works and updates the runbook when an integration changes. Atlas owns calendar-related secrets, Boreal the directory integration, and Cirrus the mail relay.

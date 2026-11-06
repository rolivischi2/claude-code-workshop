---
id: architecture-adr-001-database
title: "ADR-001: Database choice"
lang: en
tags: [architecture, adr, database]
---

# ADR-001: Database choice

Status: accepted

## Context

Raumreservation needs a relational store for rooms, bookings and users. The team wants fast local development, reliable automated tests and a production database that is operated professionally without extra effort from the application teams. Bookings require transactions and constraints, for instance to prevent two overlapping bookings of the same room.

## Decision

- **H2** is used for local development and for automated tests, in in-memory mode.
- A **managed relational database** is used in production and in the integration environment.

Schema changes are applied by versioned migration scripts that run unchanged against both databases. Features specific to one product are avoided in application code.

## Alternatives considered

### Same database everywhere

Running the production product locally, for example in a container, gives the highest fidelity. It was rejected because it slows down developer machines and test runs and requires a container runtime on every laptop.

### Document store

A document store was considered for flexibility. It was rejected because the domain is relational and the consistency guarantees of transactions are needed for bookings.

### Self-operated database in production

Operating the database ourselves would give full control. It was rejected because backups, patching and failover would become a recurring burden for the teams.

## Consequences

- Tests start in seconds and need no external services.
- Differences between H2 and the production product can hide errors. To limit that risk, the integration environment uses the production product, and migrations are always run there before production.
- SQL dialect features are restricted to the common subset; the team reviews migrations for this.
- Backup and restore are provided by the managed service and described in the operations handbook.

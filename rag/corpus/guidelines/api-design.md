---
id: guidelines-api-design
title: API design guidelines
lang: en
tags: [guideline, api, rest]
---

# API design guidelines

These rules keep the HTTP API of Raumreservation consistent, so that clients and tests can rely on predictable behaviour.

## Resources and paths

- Resource names are **plural nouns**: `/rooms`, `/bookings`, `/users`.
- Paths use **kebab-case**: `/room-equipment`, `/recurring-bookings`.
- Identifiers appear as path segments (`/rooms/{id}`), filters as query parameters (`/bookings?room=eiger`).
- Verbs are avoided in paths; use HTTP methods instead. Actions that do not fit CRUD are modelled as sub-resources, for example `POST /bookings/{id}/cancellation`.

### HTTP methods and status codes

| Method | Use | Success |
|---|---|---|
| GET | read | 200 |
| POST | create | 201 with `Location` header |
| PUT | replace | 200 |
| PATCH | partial update | 200 |
| DELETE | remove | 204 |

## Date and time

All date-times are **ISO-8601 local date-times** without offset, for example `2026-03-17T09:30:00`, interpreted in the time zone of the site. Durations use ISO-8601 duration syntax such as `PT4H`.

## Errors

Errors are returned as **RFC 7807 problem details** (`application/problem+json`). Each response contains `type`, `title`, `status`, `detail` and a custom `code` property carrying the application error code, for example `RR-4091`. Clients branch on `code`, never on the text of `detail`. Stack traces are never part of a response.

## Pagination and versioning

- Lists are paginated with `page` and `size`; the response contains the total count.
- Breaking changes are introduced under a new path prefix (`/v2`); additive changes are made in place.
- Fields are never removed without a deprecation period announced in the release notes.

## Documentation

Every endpoint is described in the OpenAPI file of the module, including all error codes it can return.

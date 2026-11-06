---
id: errors-server-errors-rr50xx
title: Error codes RR-50xx
lang: en
tags: [errors, api, server]
---

# Error codes RR-50xx

Codes in the RR-50xx range indicate problems on the server side. The client request was valid, but the Raumreservation could not process it. All of them are returned as problem details with a `code` property and are logged with a correlation id.

## Overview

| Code | HTTP | Meaning | Action |
|------|------|---------|--------|
| RR-5000 | 500 | Unexpected error | Note the correlation id and open a ticket; check the logs of the affected instance |
| RR-5031 | 503 | Database connection pool exhausted | Follow the runbook for the connection pool; consider a temporary increase of the pool size |
| RR-5042 | 504 | Calendar sync timed out | Check the calendar dashboard; the next sync run retries automatically |

## Details

### RR-5000

This is the catch-all code of the global exception handler. It means that no more specific mapping exists. The response never contains a stack trace; the details are only in the logs. A recurring RR-5000 for the same endpoint is a defect and should be fixed with a dedicated, more specific code.

### RR-5031

The application could not obtain a database connection within the configured wait time. Users see a failure when booking or when loading the room list. The usual cause is a long-running transaction. Because it blocks the whole service, an alert is raised when the error rate crosses its threshold. See the runbook for the exact steps.

### RR-5042

The call to the calendar service did not answer within the configured limit. Bookings are not affected, only the entry in the personal calendar is delayed. Ticket priority is low unless the error persists for hours.

## Severity mapping

| Code | Typical severity |
|------|------------------|
| RR-5000 | S3, higher if widespread |
| RR-5031 | S1 or S2 |
| RR-5042 | S3 |

## Notes for developers

Do not invent new codes in the RR-50xx range without agreement in the team. Codes follow the scheme RR-<HTTP status><running number>, and each new code is added to this page together with its action.

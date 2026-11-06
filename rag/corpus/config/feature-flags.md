---
id: config-feature-flags
title: Feature flags
lang: en
tags: [config, feature-flags]
---

# Feature flags

Feature flags let the teams ship code before a function is visible to users. This page lists the flags currently defined for the Raumreservation, with their default values per environment.

## Flags

| Key | Default | Description |
|-----|---------|-------------|
| `ff.waitlist.enabled` | false in prod, true in int | Enables the waitlist for fully booked slots |
| `ff.csv-export.enabled` | true | Enables the CSV export for room admins |
| `ff.room-search.enabled` | false | Enables the search by capacity, floor and equipment |
| `ff.calendar-sync.enabled` | true | Enables one-way synchronisation to personal calendars |
| `ff.new-booking-dialog.enabled` | false | Enables the redesigned booking dialog |

## Notes

### Waitlist

The waitlist is switched on in int so that testers can exercise the full flow, including the notification e-mails. In production, `ff.waitlist.enabled` is false; users therefore do not see any waitlist button. Switching it on in prod requires the approval of the release managers and a communication to users.

### CSV export

The export is enabled everywhere. Only room admins can use it; the flag does not change who is allowed to see it.

### Room search

`ff.room-search.enabled` is false in all environments except dev. It is a work in progress and returns incomplete results.

### Lifecycle

Every flag has an owning team and a removal date. The guideline on flag usage describes how flags are cleaned up after the function is fully active. A flag that has been true everywhere for two releases is removed from the code.

## Changing a flag

1. Open a change request with the new value and the reason.
2. Get approval from the owning team and a release manager.
3. Roll out in the normal maintenance window.
4. Observe the dashboards in RR Insight for 30 minutes.

Flags are read at start-up, so a restart of the instances is needed for a change to take effect.

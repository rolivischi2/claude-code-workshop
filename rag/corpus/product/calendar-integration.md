---
id: product-calendar-integration
title: Calendar integration
lang: en
tags: [product, calendar, sync]
---

# Calendar integration

Raumreservation can place bookings into the personal calendar of the organiser, so that rooms and appointments appear in one place.

## How the sync works

When a booking is created, changed or cancelled, the service writes a matching entry to the personal calendar of the organiser. The sync is one-way: changes made in Raumreservation are pushed to the calendar, but edits made directly in the calendar are not read back. If an entry is moved in the calendar, the booking in Raumreservation stays where it was.

### What is transferred

- title of the booking,
- room name as location,
- start and end time,
- a link back to the booking.

Attendee lists are not transferred, and no invitations are sent by the sync itself.

## Conflicts in the personal calendar

Conflicts in the personal calendar are not checked. If the organiser already has another appointment at the same time, the booking is still created and the calendar simply shows both entries. Only conflicts between two bookings of the same room are detected, and those are handled by the booking rules.

## Timing and failures

The sync runs in the background and usually completes within a few minutes. If the calendar service is slow or unreachable, the sync is retried; a persistent failure is reported with error code RR-5042 in the logs. A failed sync never blocks the booking itself.

## Enabling and disabling

Users enable the integration once in their profile. Disabling it stops further updates but does not remove entries that were already created. Administrators can switch the integration off globally through a configuration setting.

## Privacy

Only the data listed above leaves the service. The calendar entry never contains information about other participants.

---
id: product-waitlist-concept
title: Waitlist concept
lang: en
tags: [product, waitlist, concept]
---

# Waitlist concept

This document describes the concept of the waitlist for the Raumreservation. The function is controlled by a feature flag and is not yet available in production.

## Purpose

When a room is fully booked for a time slot, users currently have to check back repeatedly. The waitlist lets them register their interest once and be told automatically when the slot becomes free.

## Rules

### Order

The waitlist works strictly on a first come, first served basis. Every entry has a timestamp, and the entry with the earliest timestamp is served first. There is no priority for roles, teams or seniority.

### Capacity

A slot can have at most 5 entries on its waitlist. Further requests are rejected with a short message that the waitlist is full. The limit keeps the process manageable and avoids long chains of notifications.

### Freed slot

When a booking for the slot is cancelled or released, the first person on the waitlist is notified by e-mail. That person has 30 minutes to confirm. During this time the slot is held and cannot be booked by anybody else.

- If the person confirms, a booking is created and the remaining entries stay on the list for the next slot that frees up.
- If the person declines or does not answer within 30 minutes, the notification passes to the next person on the list, who again has 30 minutes.
- If nobody confirms, the slot is released for general booking.

| Step | Outcome |
|------|---------|
| Slot becomes free | First entry is notified |
| Confirmation within 30 minutes | Booking is created |
| No reaction | Next entry is notified |
| List exhausted | Slot is open to all |

## Edge cases

A notification is never sent for a slot that starts in less than the cancellation threshold, because the person would not have enough time. Entries are deleted when the slot has passed. A person can have only one entry per slot, and the entry can be withdrawn at any time.

## Rollout

The flag `ff.waitlist.enabled` is true in int and false in prod. Teams Atlas and Cirrus will run acceptance tests in int before the flag is switched on in production.

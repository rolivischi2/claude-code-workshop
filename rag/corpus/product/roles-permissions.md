---
id: product-roles-permissions
title: Roles and permissions
lang: en
tags: [product, roles, permissions]
---

# Roles and permissions

Raumreservation knows three roles. A user holds exactly one role at a time; roles are assigned by the facility team and synchronised with the staff directory.

## Roles

| Role | Typical holder | Purpose |
|---|---|---|
| `member` | every employee | book rooms and manage own bookings |
| `room-admin` | team assistants, floor coordinators | manage bookings and settings of assigned rooms |
| `facility-manager` | building operations | manage rooms, equipment and role assignments |

### member

A member can search rooms, create bookings, cancel their own bookings before the cancellation deadline, and view the public room list. A member cannot see or change bookings created by other people, except that occupied time slots are visible.

### room-admin

A room admin has all member permissions and, for the rooms assigned to them, can:

- cancel any booking at any time,
- release no-show bookings manually,
- export bookings of a period as CSV,
- block a room for maintenance.

A room admin cannot create or delete rooms.

### facility-manager

A facility manager has all room-admin permissions for every room. In addition they can create, rename, deactivate and delete rooms, edit capacity and equipment, and assign the room-admin role.

## Authorization failures

If a user attempts an action that their role does not allow, the API answers with error RR-4103. The message names the missing permission but never reveals details about other users' bookings.

## Changes to roles

Role changes take effect at the next login. Every change is written to the audit log. Requests for a new role are made through the ticket system and approved by the facility manager responsible for the building.

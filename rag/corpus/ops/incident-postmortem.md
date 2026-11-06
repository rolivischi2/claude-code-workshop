---
id: ops-incident-postmortem
title: Postmortems
lang: en
tags: [ops, incident, postmortem]
---

# Postmortems

A postmortem is a written review of an incident. Its purpose is to learn, not to find someone to blame.

## When a postmortem is required

A blameless postmortem is held within 5 working days after every S1 and S2 incident. For S3 incidents it is optional and left to the judgement of the owning team. The incident commander, usually the on-call person, schedules the meeting and appoints a facilitator who was not involved in the fix.

## Blameless principle

The review describes what happened, what information people had at the time, and why their decisions made sense. It never names individuals as the cause. Roles are used instead: "the on-call person", "the release manager", "the reviewer". If a process allowed a mistake to reach production, the process is the finding.

## Template

Every postmortem uses the same template, stored in the team wiki. The sections are:

1. **Summary** - two or three sentences for readers who stop early
2. **Impact** - affected functions, number of bookings or users, start and end time
3. **Timeline** - events in order, with times in local time
4. **Root cause and contributing factors**
5. **Detection** - how the incident was noticed and whether alerting worked
6. **Response** - what helped, what slowed things down
7. **Action items**
8. **Lessons learned**

## Action items

Each action item is recorded in the ticket system and has exactly one owner and a due date. Items without an owner are not accepted. Typical items are a new alert, a missing runbook step, an additional test, or a change to the pipeline.

The release manager reviews open action items every month. Items that are overdue are escalated to the team leads of Atlas, Boreal and Cirrus. When an item is closed, the postmortem document is updated with a link to the change.

## Sharing

Postmortems are published internally to all three teams. Sensitive details, such as credentials or personal data, are never included.

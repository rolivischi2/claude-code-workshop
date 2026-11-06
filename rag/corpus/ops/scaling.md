---
id: ops-scaling
title: Scaling
lang: en
tags: [ops, scaling, autoscaling]
---

# Scaling

This document explains how the Raumreservation backend adapts to load.

## Autoscaling range

The backend runs on a platform that adds and removes instances automatically. The number of instances stays between 2 and 6. The lower bound of two guarantees that one instance can fail or be replaced without an interruption. The upper bound protects the database from too many parallel connections; see the runbook on connection pool exhaustion.

## Scale-out rule

A new instance is started when the average CPU load of the running instances stays at 70 % or more for 5 minutes. Starting an instance takes a short while, so the platform adds one instance at a time and waits before it evaluates the rule again.

| Parameter | Value |
|-----------|-------|
| Minimum instances | 2 |
| Maximum instances | 6 |
| Scale-out threshold | 70 % CPU |
| Observation window | 5 minutes |

## Scale-in

Instances are removed again when CPU stays well below the threshold for a longer cooldown period. Removal is conservative on purpose, because Monday morning usually brings a second wave of traffic shortly after the first.

## Manual scaling

During an incident the on-call person may change the instance count by hand, for example to the maximum of 6 while a slow query is being analysed. Manual changes:

- are only allowed inside the configured range,
- must be announced in the on-call channel,
- are reset by the platform after the incident, so a ticket is created for any lasting change.

Changing the range itself requires a decision of the quarterly capacity review and a normal deployment.

## Limits and caveats

Scaling out does not help when the bottleneck is the database or the external calendar service. Before adding instances, check the database dashboard in RR Insight. If connections are exhausted, more instances make the problem worse.

Load tests in the int environment use a reduced range of 1 to 2 instances and must not be compared directly with production numbers.

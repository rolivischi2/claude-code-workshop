---
id: config-cache-settings
title: Cache configuration
lang: en
tags: [config, cache, performance]
---

# Cache configuration

This page lists the configuration keys that control the in-memory caches of the Raumreservation backend. Caches reduce database load for data that changes rarely, mainly the room list and its equipment.

## Keys

| Key | Default | Description |
|-----|---------|-------------|
| `rr.cache.rooms.ttl` | PT10M | Time to live of cached room data (ISO-8601 duration, here ten minutes) |
| `rr.cache.max-entries` | 5000 | Maximum number of entries per cache before the oldest are evicted |
| `rr.cache.enabled` | true | Master switch for all caches |
| `rr.cache.stats` | true | Publish hit and miss counters to RR Insight |
| `rr.cache.directory.ttl` | PT1H | Time to live of data read from the staff directory |

## Notes

### Time to live

With the default `rr.cache.rooms.ttl` of PT10M, a change to a room, for example new equipment, becomes visible to every instance within ten minutes at the latest. Each instance keeps its own cache, so for a short time two users can see different values. A lower value reduces this effect but increases the database load. Bookings themselves are never cached, because conflict checks must always read current data.

### Size limit

`rr.cache.max-entries` caps memory use. With four rooms in the current installation the limit is far from being reached; it exists mainly to protect the application if the data model grows. When the limit is reached, the least recently used entries are removed first.

### Troubleshooting

- A low hit rate in RR Insight suggests that the time to live is too short or that the cache keys are not stable.
- Stale room data after a deployment is expected until the time to live has expired. If this is not acceptable, restart the instances one by one.
- Setting `rr.cache.enabled` to false is a diagnostic aid only and must not stay active in production, since it increases database load noticeably.

## Change process

Changes to cache settings follow the normal configuration process. Teams Atlas and Boreal review them together, because they affect the capacity assumptions of the quarterly review.

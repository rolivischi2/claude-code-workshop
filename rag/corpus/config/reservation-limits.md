---
id: config-reservation-limits
title: Konfiguration Reservationslimiten
lang: de
tags: [config, limiten, belegung]
---

# Konfiguration Reservationslimiten

Diese Seite beschreibt die Schlüssel, mit denen die Raumreservation festlegt, welche Belegungen zulässig sind. Die Regeln selbst sind im Produktdokument zu den Belegungsregeln erklärt; hier stehen nur die technischen Werte.

## Schlüssel

| Schlüssel | Standardwert | Beschreibung |
|-----------|--------------|--------------|
| `rr.reservation.max-duration` | PT4H | Maximale Länge einer einzelnen Belegung (vier Stunden, von Beginn bis Ende) |
| `rr.reservation.max-advance-days` | 90 | Wie viele Tage im Voraus eine Belegung höchstens erfasst werden kann |
| `rr.reservation.min-gap` | PT0M | Mindestabstand zwischen zwei Belegungen im selben Raum |
| `rr.reservation.slot-granularity` | PT15M | Raster, auf das Beginn und Ende ausgerichtet sein müssen |
| `rr.reservation.max-series-count` | 12 | Höchstzahl an Wiederholungen einer Serie |
| `rr.reservation.past-tolerance` | PT0S | Toleranz für Beginnzeiten knapp in der Vergangenheit |

## Hinweise

### Maximale Länge

Wird `rr.reservation.max-duration` überschritten, lehnt die Anwendung die Anfrage mit dem Fehlercode RR-4001 ab. Der Wert ist als ISO-8601-Zeitspanne angegeben; PT4H bedeutet vier Stunden.

### Vorlauf

Mit `rr.reservation.max-advance-days` wird verhindert, dass Räume über ein Quartal hinaus blockiert werden. Der Wert 90 gilt für alle Räume und alle Rollen.

### Mindestabstand

Der Standardwert PT0M erlaubt aneinandergrenzende Belegungen: Endet eine um 11:00 Uhr und beginnt die nächste um 11:00 Uhr, ist das zulässig. Wer Reinigungs- oder Umbauzeiten einplanen will, setzt einen höheren Wert. Eine Änderung gilt nur für neue Belegungen; bestehende bleiben unberührt.

### Raster

Das Raster dient der Übersicht im Kalender. Es hat keinen Einfluss auf die Konfliktprüfung.

## Änderungen

Änderungen an diesen Werten betreffen alle Nutzenden und werden im Voraus über die Teams Atlas, Boreal und Cirrus angekündigt. Sie werden nur im Wartungsfenster ausgerollt.

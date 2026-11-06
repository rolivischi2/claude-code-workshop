---
id: errors-client-errors-rr40xx
title: Fehlercodes RR-40xx
lang: de
tags: [fehler, api, validierung]
---

# Fehlercodes RR-40xx

Diese Codes beschreiben Fehler, die auf eine ungültige Anfrage des Clients zurückgehen. Sie werden als Problem Details mit der Eigenschaft `code` ausgeliefert. Die Anwendung zeigt der Benutzerin oder dem Benutzer eine verständliche Meldung; die Tabelle nennt die Massnahme.

## Übersicht

| Code | HTTP | Bedeutung | Massnahme |
|------|------|-----------|-----------|
| RR-4000 | 400 | Das Ende liegt nicht nach dem Beginn | Zeiten korrigieren; Ende muss später als Beginn sein |
| RR-4001 | 400 | Die Belegung ist länger als 4 Stunden | Belegung kürzen oder auf mehrere Belegungen aufteilen |
| RR-4002 | 400 | Der Beginn liegt nicht in der Zukunft | Einen späteren Beginn wählen |
| RR-4091 | 409 | Buchungskonflikt: Der Zeitraum überschneidet sich mit einer bestehenden Belegung | Anderen Zeitraum oder anderen Raum wählen |

## Erläuterungen

### RR-4000

Der Code wird gemeldet, wenn Beginn und Ende identisch sind oder das Ende früher liegt. Häufigste Ursache sind Zeitzonenfehler in externen Clients. Die Anwendung selbst verwendet lokale Zeit nach ISO-8601.

### RR-4001

Die Obergrenze entspricht dem Konfigurationswert `rr.reservation.max-duration`. Der Fehler tritt auch bei Serienbuchungen auf, wenn eine einzelne Wiederholung die Grenze überschreitet.

### RR-4002

Der Beginn muss in der Zukunft liegen. Als Referenz dient die Uhr des Servers; die Prüfung verwendet eine injizierbare Uhr, damit sie in Tests reproduzierbar ist.

### RR-4091

Dieser Code zeigt an, dass sich der gewünschte Zeitraum mit einer bereits erfassten Belegung desselben Raums überschneidet. Aneinandergrenzende Zeiträume, bei denen eine Belegung endet, wenn die nächste beginnt, lösen den Fehler nicht aus. Die Antwort enthält, soweit möglich, den Zeitraum der kollidierenden Belegung, jedoch keine Angaben zu den Personen.

## Hinweise für den Support

- Ein gehäuftes Auftreten von RR-4091 in kurzer Zeit kann auf gleichzeitige Anfragen hindeuten; siehe das Architekturdokument zu parallelen Buchungen.
- RR-40xx-Fehler sind keine Störungen des Systems und lösen keinen Alarm aus.
- Neue Codes werden fortlaufend vergeben und hier ergänzt.

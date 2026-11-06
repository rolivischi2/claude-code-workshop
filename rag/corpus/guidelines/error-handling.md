---
id: guidelines-error-handling
title: Fehlerbehandlung
lang: de
tags: [richtlinie, fehler, backend]
---

# Fehlerbehandlung

Fehler werden im gesamten Backend einheitlich behandelt und an Clients gemeldet. Dies erleichtert die Suche nach Ursachen und verhindert, dass interne Details nach aussen gelangen.

## Format der Antworten

Alle Fehlerantworten verwenden das Format Problem Details (RFC 7807) mit dem Medientyp `application/problem+json`. Zusätzlich zu den Standardfeldern enthält jede Antwort die Eigenschaft `code` mit dem Fehlercode der Anwendung. Die Begründung dieses Entscheids steht im Architekturentscheid zu Problem Details.

## Schema der Fehlercodes

Fehlercodes folgen dem Schema `RR-<HTTP-Status><laufende Nummer>`. Die Nummer ist innerhalb eines Status fortlaufend und zweistellig. Beispiele:

| Code | Bedeutung des Aufbaus |
|---|---|
| RR-4091 | Status 409, laufende Nummer 91 |
| RR-5031 | Status 503, laufende Nummer 1 |

Neue Codes werden in der jeweiligen Fehlertabelle der Dokumentation eingetragen, bevor sie verwendet werden. Codes werden nie wiederverwendet.

## Keine Stacktraces an Clients

Stacktraces, SQL-Fehlermeldungen und interne Klassennamen gelangen nie in eine Antwort. Sie werden nur in den Journalen festgehalten. Die Antwort enthält eine Korrelations-ID, mit der sich der Eintrag im Journal finden lässt.

## Globaler Exception-Handler

Ein globaler Exception-Handler (`@RestControllerAdvice`) übersetzt Ausnahmen in Problem Details. Fachliche Ausnahmen tragen ihren Fehlercode selbst; unbekannte Ausnahmen werden zu RR-5000.

### Regeln für Entwickelnde

- Keine leeren `catch`-Blöcke.
- Ausnahmen nicht zum Steuern des normalen Ablaufs verwenden.
- Fachliche Fehler mit eigener Ausnahmeklasse und Code modellieren.
- Fehlermeldungen für Benutzende sind verständlich formuliert und enthalten keine technischen Begriffe.

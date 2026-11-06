---
id: guidelines-documentation
title: Dokumentation
lang: de
tags: [richtlinie, dokumentation, adr]
---

# Dokumentation

Gute Dokumentation spart dem Team Zeit und erleichtert den Einstieg neuer Mitarbeitender. Sie liegt beim Code und wird mit ihm zusammen gepflegt.

## Architekturentscheide als ADR

Wichtige technische Entscheide werden als **ADR** (Architecture Decision Record) unter `docs/adr` festgehalten. Ein ADR ist kurz und folgt einer festen Gliederung:

1. Kontext: Ausgangslage und Rahmenbedingungen,
2. Entscheid: was wurde beschlossen,
3. Alternativen: was wurde verworfen und warum,
4. Konsequenzen: Folgen für Betrieb und Entwicklung.

Dateinamen tragen eine laufende Nummer: `adr-001-database.md`. Ein ADR wird nie umgeschrieben; ändert sich der Entscheid, entsteht ein neues ADR, das das alte ersetzt und darauf verweist.

## README pro Modul

Jedes Modul hat eine `README.md` im eigenen Verzeichnis. Sie beantwortet:

- Wozu dient das Modul?
- Wie baut und testet man es lokal?
- Welche Konfiguration ist nötig?
- Wer ist verantwortlich?

### Pflege

Wer Verhalten oder Konfiguration ändert, aktualisiert die README im selben Änderungsantrag. Das Review achtet darauf.

## Betriebsdokumentation

Runbooks und Prozesse werden im Handbuch gepflegt. Jedes Runbook nennt Symptome, Schritte und Eskalationswege. Nach einem Postmortem werden betroffene Runbooks angepasst.

## Stil

- Kurze Sätze, aktive Sprache.
- Beispiele statt abstrakter Beschreibungen.
- Keine echten Namen, Hostnamen oder Zugangsdaten; Beispiele verwenden Adressen unter `example.invalid`.
- Jedes Dokument hat einen Titel und eine kurze Einleitung.

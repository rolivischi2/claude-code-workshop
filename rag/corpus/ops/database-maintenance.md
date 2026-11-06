---
id: ops-database-maintenance
title: Datenbankwartung
lang: de
tags: [ops, datenbank, wartung]
---

# Datenbankwartung

Die Datenbank der Raumreservation braucht regelmässige Pflege, damit Abfragen auch bei wachsendem Datenbestand zügig bleiben. Dieses Dokument beschreibt die wiederkehrenden Aufgaben.

## Reindexierung

Die Datenbank wird monatlich reindexiert, und zwar am ersten Sonntag des Monats. Der Lauf beginnt frühmorgens, wenn kaum Zugriffe stattfinden, und wird automatisch gestartet. Während der Reindexierung kann die Antwortgeschwindigkeit leicht sinken; ein Unterbruch ist nicht vorgesehen. Dauert der Lauf ungewöhnlich lange oder bricht er ab, erstellt die Pikett-Person ein Ticket für das zuständige Team.

## Statistiken

Die Statistiken der Datenbank werden wöchentlich aktualisiert. Sie helfen dem Abfrageplaner, gute Ausführungspläne zu wählen. Veraltete Statistiken zeigen sich oft zuerst durch langsame Abfragen auf der Reservationstabelle. Bei einem solchen Verdacht darf die Aktualisierung ausserhalb des Plans von Hand angestossen werden.

## Grösse überwachen

Das Wachstum der Datenbank wird laufend überwacht. Im Dashboard "Database" in RR Insight sind folgende Werte sichtbar:

- belegter Speicherplatz der Datenbank insgesamt
- Wachstum pro Woche
- grösste Tabellen
- Anzahl offener Verbindungen

Ein Warnhinweis erscheint, wenn der Speicher zu 80 Prozent belegt ist. Dann plant das Team gemeinsam mit der Infrastruktur eine Erweiterung. Die Grösse der Datenbank ist zudem ein Thema der quartalsweisen Kapazitätsrevue.

## Verantwortlichkeiten

| Aufgabe | Rhythmus | Verantwortlich |
|---------|----------|----------------|
| Reindexierung | monatlich, erster Sonntag | Team der laufenden Pikett-Woche |
| Statistiken | wöchentlich | automatisch, Kontrolle durch Atlas |
| Grössenkontrolle | laufend | alle Teams |

### Hinweise

Wartungsarbeiten an der Datenbank werden nie gleichzeitig mit einer Produktivsetzung ausgeführt. Änderungen am Schema folgen den Richtlinien für Migrationen.

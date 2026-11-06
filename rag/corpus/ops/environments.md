---
id: ops-environments
title: Umgebungen
lang: de
tags: [ops, umgebungen, testdaten]
---

# Umgebungen

Die Raumreservation wird in drei Umgebungen betrieben. Dieses Dokument erklärt ihre Aufgaben und die Regeln für Daten.

## Übersicht

| Umgebung | Zweck | Zugriff |
|----------|-------|---------|
| dev | Entwicklung und lokale Tests der Teams | Entwicklungsteams |
| int | Integrationstests, Abnahme, Probeläufe | Entwicklungsteams, Fachtester |
| prod | Produktivbetrieb für alle Nutzenden | eingeschränkt, nur über Bastion-Host |

Die Reihenfolge entspricht der Pipeline: Änderungen wandern von dev über int nach prod. Details zu den Pipeline-Stufen stehen im Dokument zur Produktivsetzung.

## Daten

Ausserhalb von prod werden ausschliesslich synthetische Testdaten verwendet. Echte Buchungen, echte Namen oder Kopien der Produktionsdatenbank dürfen nie in dev oder int gelangen. Die Testdaten bestehen aus erfundenen Organisationseinheiten, erfundenen Personenkennungen und den vier Räumen Eiger, Moench, Jungfrau und Pilatus mit ausgedachten Buchungen.

### Neubefüllung von int

Die Umgebung int wird nachts aus Skripten neu befüllt. Der Lauf löscht den bestehenden Datenbestand und erzeugt einen frischen, reproduzierbaren Satz synthetischer Daten. Daher gehen Änderungen, die Testende tagsüber in int vornehmen, über Nacht verloren. Wer ein Szenario dauerhaft braucht, ergänzt das Skript über einen normalen Änderungsantrag.

## Konfiguration

Jede Umgebung hat eigene Konfigurationswerte, eigene Zugangsdaten und eigene Hostnamen nach dem Muster `<dienst>.<umgebung>.rr.example.invalid`. Feature-Schalter können je Umgebung abweichen; die Warteliste ist zum Beispiel in int aktiv, in prod nicht.

## Regeln

- Zugangsdaten einer Umgebung werden nie in einer anderen verwendet.
- Fehlerreproduktionen aus prod erfolgen mit nachgebauten, synthetischen Daten.
- Lasttests laufen nur in int und werden vorher im Kanal angekündigt.
- In dev darf jedes Team frei experimentieren, in int gelten die Regeln der Release-Verantwortlichen.

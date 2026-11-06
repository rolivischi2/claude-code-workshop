---
id: ops-status-page
title: Statusseite
lang: de
tags: [ops, kommunikation, statusseite]
---

# Statusseite

Die Statusseite informiert Nutzende und Teams über den Zustand der Raumreservation. Sie läuft unabhängig von der Anwendung, damit sie auch bei einem Totalausfall erreichbar bleibt.

## Adresse und Zweck

Die Seite ist unter `status.rr.example.invalid` erreichbar. Sie zeigt den aktuellen Zustand jeder Funktion (Buchung, Kalender-Synchronisation, Export) sowie eine Liste vergangener Störungen. Eine Anmeldung ist nicht nötig.

## Aktualisierungsrhythmus

Bei Störungen der Schweregrade S1 und S2 wird die Statusseite alle 30 Minuten aktualisiert, auch wenn es keine Neuigkeiten gibt. In diesem Fall genügt der Hinweis, dass die Analyse weiterläuft. Die Aktualisierung gehört zu den Aufgaben der Pikett-Person, die sie bei längeren Einsätzen an eine andere Person aus dem Team delegieren darf.

Die Seite wird erst geschlossen, wenn die Funktion nachweislich wieder normal arbeitet. Danach wird ein kurzer Abschlusseintrag veröffentlicht.

## Textbausteine

Damit Meldungen einheitlich und rasch verfasst sind, gibt es Textbausteine. Sie enthalten keine Schuldzuweisungen und keine technischen Details, die Nutzende verunsichern könnten.

| Phase | Baustein |
|-------|----------|
| Untersuchung | "Wir untersuchen eine Störung der Buchungsfunktion. Weitere Informationen folgen." |
| Ursache bekannt | "Die Ursache wurde erkannt. Wir arbeiten an der Behebung." |
| Behebung läuft | "Eine Korrektur wird eingespielt. Einzelne Anfragen können noch fehlschlagen." |
| Abgeschlossen | "Die Störung ist behoben. Alle Funktionen stehen wieder zur Verfügung." |

## Regeln für den Inhalt

- Meldungen sind kurz, sachlich und in verständlicher Sprache gehalten.
- Es werden keine Namen von Personen und keine internen Hostnamen genannt.
- Zeitangaben erfolgen in lokaler Zeit.
- Meldungen werden auf Deutsch und Französisch veröffentlicht.

## Nach der Störung

Die Postmortem-Verantwortlichen prüfen, ob die Statusseite rechtzeitig und verständlich aktualisiert wurde, und halten Verbesserungen als Massnahme fest.

---
id: guidelines-code-review
title: Code-Review
lang: de
tags: [richtlinie, review, qualität]
---

# Code-Review

Jede Änderung am Code wird vor der Integration von einer zweiten Person begutachtet. Dieses Dokument legt fest, wie das Review abläuft und was dabei erwartet wird.

## Vier-Augen-Prinzip

Jeder Änderungsantrag braucht die Freigabe von mindestens einer zweiten Person aus dem Team. Bei Sicherheitsthemen (Authentifizierung, Berechtigungen, Umgang mit Secrets, Eingabevalidierung) sind es zwei Freigaben, davon mindestens eine aus einem anderen Team. Autorinnen und Autoren geben ihre eigenen Änderungen nie selbst frei.

## Umfang eines Änderungsantrags

Ein Änderungsantrag umfasst maximal 400 geänderte Zeilen. Generierte Dateien und reine Umbenennungen zählen nicht mit. Grössere Vorhaben werden in mehrere aufeinander aufbauende Anträge aufgeteilt, damit sie sich sorgfältig begutachten lassen.

## Reaktionszeit

Ein Review erfolgt innert 1 Arbeitstag nach Eingang des Antrags. Ist das nicht möglich, meldet die angefragte Person dies im Teamkanal, damit jemand anderes übernimmt.

## Worauf geachtet wird

- Stimmt das Verhalten mit der Beschreibung des Tickets überein?
- Gibt es Tests für neue Logik und Fehlerfälle?
- Sind Namen, Struktur und Schichtung konsistent mit den Konventionen?
- Werden Eingaben geprüft und keine Secrets oder Personendaten eingecheckt?
- Sind Datenbankänderungen rückwärtskompatibel?

### Umgang mit Rückmeldungen

Kommentare sind sachlich und konkret. Wer eine Änderung verlangt, begründet sie. Kleinigkeiten werden als «Vorschlag» gekennzeichnet und blockieren die Freigabe nicht.

## Abschluss

Sobald alle Kommentare geklärt, die Pipeline grün und die nötigen Freigaben erteilt sind, bringt die Autorin oder der Autor die Änderung gemäss Git-Workflow ein. Das Review wird nicht durch KI-Werkzeuge ersetzt; generierter Code durchläuft denselben Ablauf.

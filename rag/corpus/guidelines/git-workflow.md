---
id: guidelines-git-workflow
title: Git-Workflow
lang: de
tags: [richtlinie, git, workflow]
---

# Git-Workflow

Alle Teams arbeiten nach demselben einfachen Ablauf mit kurzlebigen Branches und einer geschützten Hauptlinie.

## Branch-Namen

Branches tragen das Muster `feature/RR-123-kurzbeschreibung`, wobei `RR-123` die Ticketnummer ist. Für Korrekturen wird `fix/` als Präfix verwendet, für reine Aufräumarbeiten `chore/`. Die Kurzbeschreibung besteht aus wenigen Wörtern in Kleinbuchstaben, getrennt durch Bindestriche, zum Beispiel `feature/RR-214-csv-export-semikolon`.

## Der Hauptbranch ist geschützt

`main` ist geschützt. Direkte Pushes sind nicht möglich, auch nicht für Release-Verantwortliche. Änderungen gelangen ausschliesslich über einen Änderungsantrag in `main`. Voraussetzungen:

- die Pipeline-Stufe «build» ist erfolgreich,
- die erforderlichen Freigaben aus dem Review liegen vor,
- der Branch ist auf dem Stand von `main`.

## Integrieren mit Squash

Änderungsanträge werden mit **Squash** integriert: Alle Commits des Branches werden zu einem einzigen Commit auf `main` zusammengefasst. Die Historie von `main` bleibt dadurch linear und lesbar; jedes Ticket entspricht einem Commit. Die Commit-Meldung folgt den Regeln im Dokument zu Commit-Messages.

## Aufräumen

Nach der Integration wird der Branch gelöscht. Branches, die länger als zwei Wochen nicht bewegt wurden, werden vom Team besprochen und entweder weitergeführt oder gelöscht.

### Kleine, häufige Änderungen

Kurzlebige Branches reduzieren Konflikte. Wer an grossen Vorhaben arbeitet, hinterlegt unfertige Funktionen hinter einem Feature-Flag und bringt Teilschritte laufend ein.

## Releases

Releases werden aus `main` mit einem Tag erzeugt. Die Produktivsetzung folgt dem Betriebsprozess.

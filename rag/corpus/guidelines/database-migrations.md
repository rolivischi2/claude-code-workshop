---
id: guidelines-database-migrations
title: Datenbankmigrationen
lang: de
tags: [richtlinie, datenbank, migration]
---

# Datenbankmigrationen

Änderungen am Datenbankschema werden als versionierte Migrationsskripte im Repository abgelegt und automatisch bei der Produktivsetzung ausgeführt. Damit Rollbacks ohne Wiederherstellung der Daten möglich bleiben, gelten strenge Regeln.

## Expand/Contract

Strukturänderungen werden in zwei getrennten Schritten durchgeführt:

1. **Expand:** Neue Spalten, Tabellen oder Indizes werden hinzugefügt. Der bisherige Code funktioniert unverändert weiter. Der neue Code schreibt in beide Strukturen oder liest mit Rückfall auf die alte.
2. **Contract:** Erst in einer späteren Produktivsetzung, wenn kein Code mehr die alte Struktur benötigt, wird diese entfernt.

### Beispiel: Spalte umbenennen

Statt `ALTER ... RENAME` wird zuerst die neue Spalte angelegt, dann werden die Daten kopiert, anschliessend liest und schreibt der Code die neue Spalte, und erst eine Produktivsetzung später wird die alte Spalte gelöscht.

## Rückwärtskompatibel

Migrationen sind immer rückwärtskompatibel: Die vorherige Anwendung muss mit dem neuen Schema lauffähig bleiben. Damit lässt sich eine Produktivsetzung zurücknehmen, ohne die Datenbank zurückzusetzen. Verboten sind in einem einzelnen Schritt:

- Spalten oder Tabellen löschen, die noch gelesen werden,
- Pflichtspalten ohne Standardwert hinzufügen,
- Datentypen einschränken,
- Spalten umbenennen.

## Praxis

- Eine Migration enthält eine einzige, überschaubare Änderung.
- Migrationen werden gegen eine Kopie realistischer, anonymisierter Datenmengen getestet; lange Sperren auf grossen Tabellen sind zu vermeiden.
- Bereits ausgeführte Migrationen werden nie nachträglich bearbeitet.
- Das Review prüft jede Migration auf Rückwärtskompatibilität.

## Datenkorrekturen

Reine Datenkorrekturen in Produktion folgen dem Vier-Augen-Prinzip und werden protokolliert.

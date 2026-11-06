---
id: guidelines-testing-backend
title: Tests im Backend
lang: de
tags: [richtlinie, tests, backend]
---

# Tests im Backend

Das Backend wird mit automatisierten Tests abgesichert, die bei jedem Build laufen. Dieses Dokument beschreibt Werkzeuge und Regeln.

## Werkzeuge

- **JUnit 5** als Testframework.
- **MockMvc** für Tests der Controller, ohne einen echten Server zu starten.
- **AssertJ** für lesbare Prüfungen.
- Repository-Tests laufen gegen die eingebettete Entwicklungsdatenbank.

## Zeitregeln mit injizierter Uhr

Viele Regeln hängen von der aktuellen Zeit ab, etwa die Anforderung, dass ein Beginn in der Zukunft liegen muss. Die Uhr (`java.time.Clock`) wird deshalb injiziert und in Tests auf einen festen Zeitpunkt gesetzt. Aufrufe von `LocalDateTime.now()` ohne Clock sind nicht erlaubt.

### Beispiel

Ein Test setzt die Uhr auf einen Dienstag, 09:00, legt eine Belegung mit Beginn um 08:00 an und erwartet den Fehlercode RR-4002.

## Laufzeit

Ein einzelner Test läuft in weniger als 20 Sekunden. Die gesamte Pipeline-Stufe «build» soll in wenigen Minuten abgeschlossen sein. Tests, die länger brauchen, werden überarbeitet oder in eine eigene Gruppe verschoben, die nur nachts läuft.

## Testdaten

Tests verwenden keine echten Daten. Namen, E-Mail-Adressen und Kennungen sind erfunden und stammen aus Hilfsklassen (Test-Builder). Datenbankinhalte werden pro Test aufgebaut und danach zurückgesetzt, damit die Reihenfolge der Tests keine Rolle spielt.

## Namensgebung und Struktur

- Testklasse heisst wie die Klasse unter Test mit Suffix `Test`.
- Methodennamen beschreiben das erwartete Verhalten: `lehntUeberschneidendeBelegungAb`.
- Aufbau: Vorbereitung, Aktion, Prüfung.

## Abdeckung

Neue Fachlogik wird mit Tests für den Normalfall, die Grenzen und die Fehlerfälle geliefert. Ein Änderungsantrag ohne Tests wird im Review zurückgewiesen.

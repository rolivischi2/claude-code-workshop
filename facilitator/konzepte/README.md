# Konzept-Szenen für die Input-Teile

Animierte Schemata für die kurzen Inputs zwischen den Übungen. Gleicher Motor und gleiche Tasten
wie `rag/viz/`: statisch, offline, kein Build. `index.html` im Browser öffnen (Doppelklick genügt).
Ausgelegt für 1920×1080, `f` schaltet Vollbild.

| Szene | Wann | Inhalt | Tipp-Runde |
|-------|------|--------|-----------|
| 1 Landkarte | 0:00 Einstieg | Agentic Loop, dann Kontext, Steuerung, Erweitern: wo jede Übung sitzt | – |
| 2 Kontext | 0:10 Block A | Kontextfenster füllt sich, jeder Turn sendet alles, `/compact`, Skill-Text erst bei Bedarf | Startbelegung aus Übung 00 |
| 3 Leitplanken | 0:45 Block B | Vier Tool-Aufrufe laufen durch Hook, deny, ask, allow. Danach `/rewind` | allow im Projekt gegen deny beim User |
| 4 MCP | 1:35 Block C | Ein Stecker für viele Werkzeuge, Feedback-Loop | – |
| 5 Skalieren | 2:15 Demo D | Subagent mit eigenem Kontext, zwei Worktrees | Wie stark wächst der Hauptkontext? |
| 6 Rückblick | 2:22 Abschluss | Landkarte mit allen Teilen, Schlussfrage | – |

## Bedienung

`→` / Leertaste nächster Schritt, `←` zurück, `1`–`6` Szene, `r` Animation nochmals, `f` Vollbild, `?` Hilfe.

**Tipp-Runden:** Vor einem Schritt erscheint eine Frage. Das Publikum stimmt per Handzeichen ab,
`→` löst auf, nochmals `→` fährt weiter. `g` schaltet alle Tipp-Runden aus oder wieder ein
(Zeitreserve: rund 30 Sekunden pro Runde).

## Anpassen

- Alles steht in `scenes-konzepte.js`. Eine Szene ist ein Objekt mit `render`, `beats` und optional `step` und `guess`.
- Die Breiten in Szene 2 (`SEG`) sind **schematisch**. Nach dem Dry-Run die Werte aus `/context` eintragen.
- Die Schlussfrage steht in `VIZ.defs.rueckblick`.
- Aussagen zu Reihenfolgen und Verhalten sind gegen die Doku geprüft (Stand 2026-11-10):
  PreToolUse-Hooks laufen **vor** den Permission-Regeln, deny vor ask vor allow über alle Scopes,
  Checkpoint vor jedem Prompt, Skill-Text erst beim Aufruf, MCP-Toolnamen beim Start und Schemas bei Bedarf.
  Bei einem Update von Claude Code kurz gegenprüfen.

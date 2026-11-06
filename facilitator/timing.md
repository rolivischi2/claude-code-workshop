# Zeitplan und Rollen

Rollen: **Manager** (Moderation, Konzepte, Teamregeln), **Co** (Co-Facilitator, Unterstützung im Raum),
**Roland** (Hands-on-Demos, RAG-Block, Skalieren, Capstone).

| Zeit | Block | Inhalt | Lead | Übungen |
|------|-------|--------|------|---------|
| 09:00 | Einstieg | Anatomie der Harness (Konzeptlandkarte), Setup-Check, `/model sonnet` | Manager | 00 |
| 09:30 | A – Kontext | Context Engineering, Persistentes Wissen (Live-Demo vorher/nachher), Progressive Disclosure | Manager, Roland Demo 02 | 01, 02, 03 |
| 10:45 | Pause | | | |
| 11:00 | B – Steuerung & Sicherheit | Planen vs. Ausführen, Autonomiestufen, Hooks, Reversibilität | Co / Manager | 04, 05, 06, 07 |
| 12:15 | Mittag | Roland startet vorher eine längere Aufgabe und steuert sie per Remote Control vom Handy | Roland | 14 (Demo) |
| 13:15 | C – Verifizieren & Erweitern | Feedback-Loops, MCP (Playwright), Vertrauensgrenzen | Co, Roland für 10 | 08, 09, 10 |
| 14:30 | Pause | | | |
| 14:45 | R – Retrieval | Agentic Search vs. RAG, gemessen | Roland | 11 |
| 15:45 | D – Skalieren | Subagents, Parallelisierung | Roland | 12, 13 |
| 16:20 | Capstone | Team-Plugin | Roland | 15 |
| 16:45 | Abschluss | Modell- und Aufwandswahl (`/model`, `/effort`, günstige Subagents), Konzeptlandkarte, erste Teamregeln (Review-Pflicht, Umgang mit Kunden- und Projektdaten, gemeinsame CLAUDE.md und Settings im Repo), nächste Schritte | Manager | |
| 17:00 | Ende | | | |

## Pro Übung: Aufwand

Gemessen bei einem Dry-Run mit einem **Pro-Konto auf Sonnet**. Spalten «Turns» und «Nutzung»
werden beim Dry-Run ausgefüllt. Alles über 10 Turns muss vereinfacht werden.

| Übung | Zeitbudget | Turns (Dry-Run) | Nutzung 5h-Fenster (Dry-Run) | Bemerkung |
|-------|-----------|-----------------|------------------------------|-----------|
| 00 Setup-Check | 10' | zu messen | zu messen | nur Slash-Commands |
| 01 Kontext | 20' | zu messen | zu messen | Schritt 2 absichtlich teuer |
| 02 Persistentes Wissen | 25' | zu messen | zu messen | 2 Feature-Prompts + `/init` |
| 03 Progressive Disclosure | 25' | zu messen | zu messen | |
| 04 Planen vs. Ausführen | 30' | zu messen | zu messen | grösste Code-Übung am Vormittag |
| 05 Permissions | 20' | zu messen | zu messen | |
| 06 Hooks | 30' | zu messen | zu messen | |
| 07 Reversibilität | 15' | zu messen | zu messen | kaum Modellnutzung |
| 08 Feedback-Loops | 20' | zu messen | zu messen | |
| 09 MCP | 30' | zu messen | zu messen | Browser-Snapshots sind teuer |
| 10 Vertrauensgrenzen | 25' | zu messen | zu messen | |
| 11 RAG | 60' | zu messen | zu messen | R1 ist der teuerste Teil |
| 12 Subagents | 20' | zu messen | zu messen | Reviewer auf Haiku |
| 13 Parallelisierung | 25' | zu messen | zu messen | zwei Sessions gleichzeitig |
| 14 Remote Control | 10' | – | – | Demo |
| 15 Team-Plugin | 25' | zu messen | zu messen | |

## Puffer

Der Tag ist dicht. Kandidaten zum Kürzen, falls die Zeit davonläuft:

- 07 als 5-Minuten-Demo statt Übung
- 11: R1 nur als Demo am Beamer, Teilnehmende machen R2–R4
- 13 als Demo, Teilnehmende schauen zu
- 14 nur über Mittag, kein eigener Slot

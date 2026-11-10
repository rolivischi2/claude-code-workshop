# Ablauf – Nachmittag mit einem Facilitator

Ergänzt [timing.md](timing.md) (Zeitplan und Aufwand pro Übung) und [demo-scripts.md](demo-scripts.md)
(exakte Abläufe der Demos R und D). Hier steht, **was** in jedem Block passiert und **was vorher bereit sein muss**.

## 1. Von der Tagesversion zum Nachmittag

Die Tagesversion (Git-Tag `archive/fullday-v1`, 16 Übungen, drei Facilitators) ist auf
2,5 Stunden und einen Facilitator verdichtet:

| Tagesversion | Nachmittag | Wie |
|--------------|------------|-----|
| 00 Setup-Check | 00 | Setup als Hausaufgabe, im Workshop nur 5' |
| 01 Kontext, 02 Persistentes Wissen | 01 | zusammengelegt: `/context` + `CLAUDE.md` vorher/nachher |
| 03 Progressive Disclosure | 02 | unverändert als Skill-Übung |
| 04 Planen vs. Ausführen | 03 | kleineres Feature («Abgabenbetrag korrigieren») |
| 05 Permissions, 06 Hooks | 04 | zusammengelegt, Formatier-Hook als Vorlage |
| 07 Reversibilität | 05 | unverändert |
| 08 Feedback-Loops, 09 MCP | 06 | Browser über MCP, Verifikation inklusive |
| 10 Vertrauensgrenzen | – | ein Satz in Demo R, Frage im Abschluss |
| 11 RAG | Demo R | vorberechnet, echte BAZG-Dokumentation, animiert |
| 12 Subagents, 13 Parallelisierung | Demo D | 7' live |
| 14 Remote Control, 15 Team-Plugin | – | entfallen |

Neu: Die Übungs-App ist eine **synthetische Transit-App** (Zollstellen, Sicherheiten,
Transitanmeldungen). Damit teilen App und RAG-Demo denselben Projektkontext.

## 2. Vorbereitung

**Eine Woche vorher**

- [ ] Setup-Mail an die Teilnehmenden mit Link auf `SETUP.md` (Frist: 2 Tage vorher `check-setup` grün). Devcontainer als Variante B erwähnen.
- [ ] Dry-Run aller Übungen 00–06 mit einem **Pro-Konto auf Sonnet**, Turns und `/usage` in `timing.md` eintragen.
- [ ] `scripts/verify-all.sh --e2e` grün.
- [ ] Fragen in `rag/eval/questions.yaml` fachlich prüfen (Header «Entwurf» danach entfernen), Quellenliste `rag/sources.yaml` prüfen.

**Am Vortag**

- [ ] RAG-Pipeline laufen lassen und `rag/viz/index.html` einmal komplett durchklicken (siehe demo-scripts.md, Demo R).
- [ ] Demo-Klon für D: `git clone --branch solution/final . ../demo-d`, darin `scripts/setup.sh`.
- [ ] Plan B auf USB-Stick: gepacktes Repo inkl. `node_modules`, `rag/.cache/` und `rag/viz/data.js`.

**Am Morgen**

- [ ] Terminal- und Browser-Schrift gross, zwei Terminals nebeneinander, Benachrichtigungen aus.
- [ ] `/usage` auf dem eigenen Konto: genug Reserve für Demo D und Hilfe am Platz?
- [ ] Backend und Frontend einmal starten (Port 8080/4200 frei?), Playwright-MCP am eigenen Rechner einmal verbinden.

## 3. Blöcke im Detail

### Einstieg (0:00–0:10)

| Min | Was |
|-----|-----|
| 0–5 | Konzeptlandkarte (`facilitator/konzepte/`, Szene 1): Modell, Tools, Kontext, Steuerung, Agentic Loop. Wo welcher Block des Nachmittags sitzt. |
| 5–10 | Alle: `/status`, `/model sonnet`, `/usage`, `/context`. Wer rot ist: Nachbar oder Devcontainer, nicht jetzt debuggen. |

### A – Kontext und Skills (0:10–0:45)

| Min | Was |
|-----|-----|
| 0–5 | Input: Kontext ist ein Budget. Was immer geladen ist (CLAUDE.md), was bei Bedarf (Skills, MCP-Tools). |
| 5–20 | Übung 01 |
| 20–35 | Übung 02. Nach 10' fragen: «Bei wem wurde der Skill automatisch geladen? Wie lautet eure description?» |

Botschaft: Die CLAUDE.md macht den Unterschied in den Details, die nicht im Code stehen. Skills halten den Kontext klein.

### B – Steuerung (0:45–1:25)

| Min | Was |
|-----|-----|
| 0–5 | Input mit Szene 3 «Leitplanken» (eine Tipp-Runde): Autonomie braucht Leitplanken. Plan (billig korrigieren), Permissions (Grenzen), Hooks (Garantien), Rewind (Netz). |
| 5–20 | Übung 03. Nach der Plan-Kritik kurz fragen: «Wer hat den Fehler bei genau 500 Franken gefunden?» |
| 20–35 | Übung 04 |
| 35–40 | Übung 05 (bei Zeitnot als Demo am Beamer) |

### Pause (1:25–1:35)

Backend und Frontend für Übung 06 starten die Teilnehmenden **vor** der Pause (letzter Schritt von Übung 05). Die Pause ist Pause.

### C – Browser über MCP (1:35–1:55)

| Min | Was |
|-----|-----|
| 0–3 | Input mit Szene 4 «MCP»: MCP als Standard-Steckdose. Feedback-Loop: Ein Agent, der sein Ergebnis selbst sieht, braucht weniger Kontrolle. |
| 3–20 | Übung 06. Wer fertig ist: `/mcp` anschauen, wie viel Kontext belegen die Tool-Definitionen? |

### R – Agentic Search vs. RAG (1:55–2:15)

Siehe demo-scripts.md, Demo R. Überleitung: «Bis jetzt hat Claude im Code gesucht. Was, wenn
das Wissen in 267 Seiten Zolldokumentation steht?»

### D – Skalieren (2:15–2:22)

Siehe demo-scripts.md, Demo D. Szene 5 «Skalieren» auf dem Beamer. Den Reviewer-Subagent starten alle
selbst ([exercises/demo-d-reviewer](../exercises/demo-d-reviewer/README.md), 3'), die Worktrees nur zeigen.

### Abschluss (2:22–2:30)

- Szene 6 «Rückblick»: die Landkarte vom Anfang mit allen Teilen, dazu die Schlussfrage.
- Modell- und Aufwandswahl: `/model`, `/effort`, günstige Subagents (Haiku).
- Erste Teamregeln sammeln: Review-Pflicht, Umgang mit Kunden- und Projektdaten,
  gemeinsame `CLAUDE.md` und `.claude/settings.json` im Repo.
- Falls Zeit: «Welche MCP-Server würdet ihr anbinden, und welche davon sehen fremde Inhalte?»
- Nächste Schritte und Links aus dem README.

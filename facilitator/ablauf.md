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

Neu: Die Übungs-App ist eine **synthetische Transit-App** (Zollstellen, Garantien,
Transitanmeldungen). Damit teilen App und RAG-Demo denselben Projektkontext.

## 2. Vorbereitung

**Eine Woche vorher**

- [ ] Setup-Mail an die Teilnehmenden mit Link auf `SETUP.md` (Frist: 2 Tage vorher `check-setup` grün). Devcontainer als Variante B erwähnen.
- [ ] Dry-Run aller Übungen 00–06 mit einem **Pro-Konto auf Sonnet**, Turns und `/usage` in `timing.md` eintragen.
- [ ] `scripts/verify-all.sh --e2e` grün.
- [ ] Fragen in `rag/eval/questions.yaml` fachlich prüfen (Header «Entwurf» danach entfernen), Quellenliste `rag/sources.yaml` prüfen.

**Am Vortag**

- [ ] RAG-Pipeline laufen lassen und `praesentation/index.html` einmal komplett durchklicken (siehe demo-scripts.md, Demo R).
- [ ] Demo-Klon für D: `git clone --branch solution/final . ../demo-d`, darin `scripts/setup.sh`.
- [ ] Plan B auf USB-Stick: gepacktes Repo inkl. `node_modules`, `rag/.cache/` und `praesentation/data.js`.

**Am Morgen**

- [ ] Terminal- und Browser-Schrift gross, zwei Terminals nebeneinander, Benachrichtigungen aus.
- [ ] `/usage` auf dem eigenen Konto: genug Reserve für Demo D und Hilfe am Platz?
- [ ] Backend und Frontend einmal starten (Port 8080/4200 frei?), Playwright-MCP am eigenen Rechner einmal verbinden.

## 3. Blöcke im Detail

### Einstieg (0:00–0:10)

| Min | Was |
|-----|-----|
| 0–5 | Konzeptlandkarte (`praesentation/`, Folie «Überblick»): Modell, Tools, Kontext, Steuerung, Agentic Loop. Wo welcher Block des Nachmittags sitzt. Dann kurz die Folie «Setup»: Repo-Adresse und `reset-exercise`. |
| 5–10 | Alle: `/status`, `/model sonnet`, `/usage`, `/context`. Wer rot ist: Nachbar oder Devcontainer, nicht jetzt debuggen. |

### A – Kontext und Skills (0:10–0:41)

| Min | Was |
|-----|-----|
| 0–5 | Input: Kontext ist ein Budget. Was immer geladen ist (CLAUDE.md), was bei Bedarf (Skills, MCP-Tools). |
| 5–20 | Übung 01 |
| 20–28 | Übung 02: Skill aus der Referenzlösung übernehmen, lesen, automatischen Aufruf prüfen. Zusatzaufgabe: Skill selbst bauen. |
| 28–31 | Teamfrage: Welche Regel aus eurem Projekt müsste in die CLAUDE.md? |

Botschaft: Die CLAUDE.md macht den Unterschied in den Details, die nicht im Code stehen. Skills halten den Kontext klein.

### B – Steuerung (0:41–1:21)

| Min | Was |
|-----|-----|
| 0–5 | Input mit der Folie «Leitplanken» (eine Schätzfrage): Autonomie braucht Leitplanken. Plan (billig korrigieren), Permissions (Grenzen), Hooks (Garantien). Rewind (Netz) hat eine eigene Folie direkt vor der Demo. |
| 5–20 | Übung 03. Nach der Plan-Kritik kurz fragen: «Wer hat den Fehler bei genau 500 Franken gefunden?» |
| 20–35 | Übung 04. Prompt 5 ist freiwillig. Zusatzaufgabe: Übung 05 selbst. |
| 35–37 | Folie «Rewind», dann Demo 05 am Beamer in der eigenen, vorbereiteten Session. |
| 37–40 | Teamfrage: Welche Datei oder welcher Befehl braucht eine Deny-Regel oder einen Hook? |

### Pause (1:21–1:31)

Backend und Frontend für Übung 06 starten die Teilnehmenden **vor** der Pause. Die Befehle stehen auf der Pausenfolie. Die Pause ist Pause.

### C – Browser über MCP (1:31–1:54)

| Min | Was |
|-----|-----|
| 0–3 | Input mit der Folie «MCP»: MCP als Standard-Steckdose. Feedback-Loop: Ein Agent, der sein Ergebnis selbst sieht, braucht weniger Kontrolle. |
| 3–20 | Übung 06. Zusatzaufgabe: `/mcp` und `/context`, was von Playwright ist geladen? |
| 20–23 | Teamfrage: Welches System würdet ihr per MCP anbinden, und sieht Claude dort fremde Inhalte? |

### R – Agentic Search vs. RAG (1:54–2:17)

Siehe demo-scripts.md, Demo R. Überleitung: «Bis jetzt hat Claude im Code gesucht. Was, wenn
das Wissen in 267 Seiten Zolldokumentation steht?» Am Schluss 3 Minuten Teamfrage:
Wo sucht ihr heute in Dokumentation, und würde dort eine Textsuche reichen? Bei Zeitnot fällt sie zuerst weg.

### D – Skalieren (2:17–2:24)

Siehe demo-scripts.md, Demo D. Zuerst die Folien «Skalieren» und «Demo», dann die Live-Demo im eigenen Terminal, danach die Folie «Ablauf»
(Bildschirm teilen). Die Teilnehmenden schauen zu, sie machen hier nichts selbst.

### Abschluss (2:24–2:30)

- Folie «Rückblick»: der Überblick vom Anfang mit allen Teilen.
- Modell- und Aufwandswahl: `/model`, `/effort`, günstige Subagents (Haiku).
- Erste Teamregeln sammeln: Review-Pflicht, Umgang mit Kunden- und Projektdaten,
  gemeinsame `CLAUDE.md` und `.claude/settings.json` im Repo.
- Folie «Ausblick» (1 Minute): Remote Control, Claude Code on the web, `claude -p`, Scheduled Tasks. Keine Demo.
- Nächste Schritte und Links aus dem README.

# Demo D zum Mitmachen – Reviewer-Subagent

**Block:** D – Skalieren · **Zeitbudget:** 3 Minuten, alle gleichzeitig mit dem Beamer

## Ziel

Sehen, dass ein Subagent viel liest und euren Kontext trotzdem kaum belastet.

## Konzept

Ein Subagent hat ein **eigenes Kontextfenster** und kann ein **eigenes Modell** nutzen (hier Haiku).
In eure Session kommt nur sein Bericht zurück. Projekt-Subagents liegen in `.claude/agents/`.

## Aufgabe

1. Vorlage übernehmen (lesen lohnt sich: Es sind die Review-Kriterien des Teams):
   ```bash
   mkdir -p .claude/agents && cp exercises/demo-d-reviewer/vorlage/reviewer.md .claude/agents/
   ```
2. `claude` neu starten (Subagents werden beim Start geladen), dann `/context`: Zahl merken.
3. Prompt unten absetzen.
4. Wieder `/context`: Um wie viel ist euer Kontext gewachsen?

## Vorgeschlagene Prompts

```
Nutze den reviewer-Subagent, um die Änderungen seit start/03 unter app/backend/src zu reviewen
(git diff start/03 -- app/backend/src). Fasse sein Ergebnis in 5 Zeilen zusammen.
```

## Erfolgskriterium

Der Subagent liefert Befunde mit Datei und Zeile und ein Urteil (APPROVE oder REQUEST CHANGES).
Euer Hauptkontext ist nur um den Bericht gewachsen, nicht um den ganzen Diff.

## Token-Tipp

Lesen und Suchen an einen günstigen Subagent delegieren: Das schont Kontext **und** Kontingent.

## Doku

- [Create custom subagents](https://code.claude.com/docs/en/sub-agents)

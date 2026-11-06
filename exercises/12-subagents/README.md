# Übung 12 – Delegation mit Kontextisolation: Subagents

**Block:** D – Skalieren · **Zeitbudget:** 20 Minuten

## Ziel

Einen Review-Subagent mit euren Review-Kriterien definieren und auf die Änderungen des Tages ansetzen.

## Konzept

Eine breite Suche oder ein Review würde den Hauptkontext füllen. Ein Subagent arbeitet in
einem eigenen Kontext und liefert nur das Ergebnis zurück (Orchestrator-Worker-Muster).
Subagents haben einen eigenen Prompt, eigene Tools und ein eigenes Modell. Für ein Review
reicht oft ein kleineres, günstigeres Modell.

## Aufgabe

1. `.claude/agents/reviewer.md` anlegen (Vorlage unten) und die Kriterien an euer Team anpassen.
2. Neue Session. Mit `/context` den Kontext notieren.
3. Review mit Prompt 1 starten.
4. Danach wieder `/context`: Wie stark ist der Hauptkontext gewachsen, verglichen mit der Grösse des Diffs?

```markdown
---
name: reviewer
description: Reviews code changes in this repository against the team's review criteria. Use after implementing a feature or before committing.
tools: Read, Grep, Glob, Bash
model: haiku
---
You are a strict but pragmatic reviewer for the Raumreservation codebase.
Review only the changes you are given (use `git diff`). For each finding report:
file:line, severity (blocker / should-fix / nit) and a one-line suggestion.

Review criteria:
1. Layering: controller -> service -> repository; no logic in controllers.
2. DTOs are records mapped by a *Mapper; entities never leave the service layer.
3. Errors are BusinessRuleException/NotFoundException with an RR-<status><nr> code (RFC 7807).
4. Time comes from the injected Clock, never LocalDateTime.now() without it.
5. Every behaviour change has a service unit test and a controller test.
6. No secrets, no real personal data, no disabled tests.

End with a verdict: APPROVE or REQUEST CHANGES, and at most 10 findings, most severe first.
```

## Vorgeschlagene Prompts

Prompt 1:
```
Nutze den reviewer-Subagent, um alle Änderungen unter app/backend/src seit dem Tag start/00
zu reviewen (git diff start/00 -- app/backend/src). Fasse sein Ergebnis in 5 Zeilen zusammen.
```

## Erfolgskriterium

Ein Review-Report mit Verdict und Findings liegt vor, und der Hauptkontext ist deutlich kleiner geblieben als der Diff.

<details>
<summary>Hinweise</summary>

- Explizit aufrufen: «Nutze den reviewer-Subagent …» oder `@agent-reviewer`. Mit einer guten
  `description` delegiert Claude auch von selbst.
- `tools` beschränkt den Reviewer: Er kann nichts editieren. `model: haiku` macht ihn günstig.
- Edits von Subagents erfasst `/rewind` nicht (Übung 07). Ein reiner Lese-Reviewer ist deshalb doppelt angenehm.

</details>

## Token-Tipp

Haiku für Reviews, Sonnet für die Hauptarbeit. Der Subagent liest den Diff in **seinem** Kontext, zurück kommt nur das Fazit.

## Doku

- [Create custom subagents](https://code.claude.com/docs/en/sub-agents) · [Run agents in parallel](https://code.claude.com/docs/en/agents) (Überblick)
- Lernen: [Introduction to subagents](https://anthropic.skilljar.com/introduction-to-subagents) (Anthropic Academy)

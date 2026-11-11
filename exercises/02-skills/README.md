# Übung 02 – Progressive Disclosure mit Skills

**Block:** A – Kontext und Skills · **Zeitbudget:** 15 Minuten

## Ziel

Einen Skill «Neuer REST-Endpoint nach Teamstandard» bauen und prüfen, ob Claude ihn von sich aus nutzt.

## Konzept

Alles vorab in den Kontext zu laden, verschwendet Budget. Besser ist: Nur eine kurze
Beschreibung ist immer sichtbar, der Inhalt wird erst geladen, wenn er gebraucht wird.
Bei Skills stehen nur Name und Beschreibung im Kontext. Die `SKILL.md` liest Claude erst bei
Bedarf. Dasselbe Prinzip gilt für MCP-Tools.

## Aufgabe

1. Skill anlegen unter `.claude/skills/rest-endpoint/SKILL.md`, am besten mit Claude zusammen (Prompt 1).
2. Die **Beschreibung** im Frontmatter kritisch lesen. Sie entscheidet, ob Claude den Skill findet.
3. Neue Session (`/clear`). Den Feature-Prompt (Prompt 2) absetzen, **ohne** den Skill zu erwähnen.
4. Beobachten: Erscheint im Verlauf ein `Skill`-Aufruf? Falls nicht: Beschreibung schärfen und nochmals.

### Anforderung an den Endpoint

`GET /api/guarantees/{grn}/balance` liefert den Saldo einer Garantie. Offen sind nur
Transitanmeldungen mit Status `OPEN`:

```json
{ "grn": "26CH1000000000033", "referenceAmount": 10000.00, "openAmount": 9500.00, "available": 500.00 }
```

Unbekannte Garantie → 404 als Problem Detail.

## Vorgeschlagene Prompts

Prompt 1 (Skill bauen):
```
Erstelle einen Project Skill unter .claude/skills/rest-endpoint/SKILL.md. Er beschreibt
Schritt für Schritt, wie in diesem Backend ein neuer REST-Endpoint nach unserem Teamstandard
entsteht (Schichten, DTO-Record + Mapper, Fehler als Problem Details, Tests). Verweise auf
bestehende Dateien als Vorlage statt Code zu kopieren. Die description im Frontmatter soll
klar sagen, wann der Skill zu verwenden ist.
```

Prompt 2 (Feature, neue Session):
```
Wir brauchen den Endpoint GET /api/guarantees/{grn}/balance. Er liefert den Saldo einer
Garantie (Format siehe exercises/02-skills/README.md).
```

## Erfolgskriterium

```bash
cd app/backend && ./mvnw -q test        # grün, inkl. neuer Tests
```

Und: Der Skill ist ohne Erwähnung geladen worden, der Endpoint hält sich an die Checkliste aus Übung 01.

<details>
<summary>Hinweise</summary>

- Gute `description`: *was* der Skill tut **und** *wann* er gilt, mit den Worten, die ein
  Mensch im Prompt verwenden würde («neuer Endpoint», «REST», «API erweitern»).
- Explizit aufrufen geht auch: `/rest-endpoint`. Ziel der Übung ist aber der automatische Aufruf.
- Skill vs. CLAUDE.md: CLAUDE.md ist immer geladen (Fakten, Regeln). Ein Skill ist ein bei
  Bedarf geladenes Rezept (Abläufe, Vorlagen).
- Mit `/context` seht ihr: Vom Skill liegt nur die Beschreibung im Kontext, bis er gebraucht wird.

</details>

## Token-Tipp

Verweist im Skill auf bestehende Dateien («siehe OfficeController als Vorlage»), statt Code
hineinzukopieren. Das hält den Skill kurz, und Claude liest nur, was es braucht.

## Doku

- [Extend Claude with skills](https://code.claude.com/docs/en/skills)
- Lernen: [Introduction to agent skills](https://anthropic.skilljar.com/introduction-to-agent-skills) (Anthropic Academy) · [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (Anthropic Engineering Blog)

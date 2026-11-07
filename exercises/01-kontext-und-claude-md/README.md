# Übung 01 – Kontext und CLAUDE.md

**Block:** A – Kontext und Skills · **Zeitbudget:** 15 Minuten

## Ziel

Sehen, was Kontext kostet, und erleben, was eine gute `CLAUDE.md` am Ergebnis ändert:
derselbe Prompt zuerst ohne, dann mit Teamkonventionen.

## Konzept

Das Kontextfenster ist begrenzt, und die Qualität sinkt, je voller es wird. Kontext ist ein
Budget: sichtbar mit `/context`, aufräumen mit `/clear` (neu anfangen) und `/compact`
(zusammenfassen). Gezielte `@`-Referenzen sind günstiger als «lies alles».

Gleichzeitig beginnt das Modell jede Session ohne Wissen über das Projekt. Konventionen,
Befehle und Architekturregeln, die nicht im Code stehen, gehören deshalb in die `CLAUDE.md`.
Sie wird in **jeder** Session geladen. `/init` erzeugt einen Startpunkt.

## Aufgabe

**Teil A – Kontext messen und ohne CLAUDE.md arbeiten**

1. Frische Session. `/context` aufrufen und die Startbelegung notieren (aus Übung 00).
2. Prompt 1 absetzen (gezielte `@`-Referenz), danach wieder `/context`. Was ist gewachsen?
3. `/clear`, dann Prompt 2 (Feature) absetzen. Ergebnis mit der Checkliste unten vergleichen und notieren, was fehlt.
4. Änderungen verwerfen: `git restore . && git clean -fd app/`

**Teil B – mit CLAUDE.md**

5. `/init` ausführen und die erzeugte `CLAUDE.md` lesen.
6. Den Abschnitt «Teamkonventionen» unten in die `CLAUDE.md` übernehmen, kürzen und anpassen.
7. `/clear`, Prompt 2 nochmals absetzen und mit Teil A vergleichen.
8. Endpoint wieder verwerfen (wie in Schritt 4). Die `CLAUDE.md` behaltet ihr und committet sie:
   `git add CLAUDE.md && git commit -m "Add CLAUDE.md with team conventions"`

### Checkliste «Teamstandard»

- [ ] Controller → Service → Repository, keine Logik im Controller
- [ ] Antwort als DTO (Record) über eine `*Mapper`-Klasse, keine Entity nach aussen
- [ ] Unbekannte Sicherheit → `NotFoundException` → 404 als Problem Detail, keine Fehlerbehandlung im Controller
- [ ] Service-Unit-Test **und** MockMvc-Test
- [ ] `./mvnw -q test` grün

### Teamkonventionen (Vorlage)

```markdown
## Teamkonventionen
- Backend: Schichten Controller → Service → Repository. Controller enthalten keine Logik.
- DTOs sind Java-Records, Mapping über eine *Mapper-Klasse (@Component). Entities verlassen nie den Service.
- Fehler: Exceptions aus common/ werfen (NotFoundException, BusinessRuleException mit Code TR-<HTTP-Status><Nr>).
  Der GlobalExceptionHandler macht daraus Problem Details (RFC 7807).
- Beträge immer als BigDecimal in CHF. Zeit immer über die injizierte java.time.Clock, nie now() ohne Clock.
- Jede neue Funktion: Service-Unit-Test (Mockito) + Controller-Test (@WebMvcTest/MockMvc).
- Code, Kommentare und Commits auf Englisch. UI-Texte und Fehlermeldungen auf Deutsch (Schweizer Rechtschreibung: ss statt Eszett).

## Befehle
- Backend testen: `cd app/backend && ./mvnw -q test` (Windows: `mvnw.cmd`)
- Formatieren übernimmt ab Übung 04 ein Hook (nie das ganze Projekt formatieren)
- Frontend testen: `cd app/frontend && npm test` · Lint: `npm run lint`
```

## Vorgeschlagene Prompts

Prompt 1 (Teil A):
```
@app/backend/src/main/java/com/example/transit/common/GlobalExceptionHandler.java
Welche HTTP-Status und Fehlercodes kann die API zurückgeben?
```

Prompt 2 (Teil A und B identisch):
```
Füge einen Endpoint GET /api/guarantees/{grn} hinzu, der eine einzelne Sicherheit liefert.
Gibt es die Sicherheit nicht, soll ein 404 kommen.
```

## Erfolgskriterium

Das Ergebnis aus Teil B erfüllt die Checkliste deutlich besser als Teil A, und die `CLAUDE.md` ist committet:

```bash
git log --oneline -1 -- CLAUDE.md
```

Ihr könnt erklären: Was kostet am meisten Kontext, eure Prompts, die Antworten oder die Tool-Ergebnisse?

<details>
<summary>Hinweise</summary>

- Schaut auf das Mapping: Der bestehende `GuaranteeService` baut sein DTO direkt. Ohne
  `CLAUDE.md` kopiert Claude meist dieses Muster. Mit `CLAUDE.md` entsteht ein `GuaranteeMapper`.
  Genau dafür ist sie da: Regeln, die man **nicht** aus dem Code ablesen kann.
- `/compact Behalte nur …` fasst den Verlauf mit Fokus zusammen. Claude kompaktiert auch
  automatisch, wenn das Fenster voll wird. Besser ist es, vorher selbst aufzuräumen.
- `@` mit Tab vervollständigt Pfade. Die Datei landet direkt im Kontext, ohne Such-Turns.
- Jede Zeile der CLAUDE.md wird in **jeder** Session geladen. Kurz halten! Lange Doku besser
  als Skill (Übung 02) oder per `@docs/...`-Import.
- Persönliches gehört in `CLAUDE.local.md` (nicht committet) oder `~/.claude/CLAUDE.md`.

</details>

## Token-Tipp

Teil A und B sind je **ein** Feature-Prompt. Lasst Claude nicht iterieren: Es geht um den
Vergleich der ersten Antwort. Und nie «lies das ganze Projekt», sondern gezielt referenzieren.

## Doku

- [Explore the context window](https://code.claude.com/docs/en/context-window) (interaktive Simulation) · [How Claude remembers your project](https://code.claude.com/docs/en/memory) · [Manage costs effectively](https://code.claude.com/docs/en/costs)
- Lernen: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (Anthropic Engineering Blog) · [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) (Anthropic Academy)

# Übung 02 – Persistentes Wissen

**Block:** A – Kontext · **Zeitbudget:** 25 Minuten (inkl. Live-Demo)

## Ziel

Erleben, was eine gute `CLAUDE.md` am Ergebnis ändert: zuerst ohne, dann mit Teamkonventionen.

## Konzept

Das Modell beginnt jede Session ohne Wissen über das Projekt. Konventionen, Build-Befehle und
Architekturregeln müssen deshalb dauerhaft abgelegt werden. Dafür gibt es die
CLAUDE.md-Hierarchie (User, Projekt, lokal), Imports mit `@pfad` und Auto Memory.
`/init` erzeugt einen Startpunkt.

## Aufgabe

**Teil A – ohne CLAUDE.md**

1. Neue Session (`/clear`), dann den Prompt unten absetzen.
2. Ergebnis anschauen. Hält es sich an die Checkliste unten? Notiert, was fehlt.
3. Änderungen verwerfen: `git restore . && git clean -fd app/`

**Teil B – mit CLAUDE.md**

4. `/init` ausführen und die erzeugte `CLAUDE.md` lesen.
5. Den Abschnitt «Teamkonventionen» unten in die `CLAUDE.md` übernehmen, kürzen und anpassen.
6. Neue Session (`/clear`), denselben Prompt nochmals absetzen und mit Teil A vergleichen.
7. Endpoint wieder verwerfen (wie in Schritt 3). Die `CLAUDE.md` behaltet ihr und committet sie:
   `git add CLAUDE.md && git commit -m "Add CLAUDE.md with team conventions"`

### Checkliste «Teamstandard»

- [ ] Controller → Service → Repository, keine Logik im Controller
- [ ] Antwort als DTO (Record) über einen Mapper, keine Entity nach aussen
- [ ] Fehler als Problem Details (RFC 7807) mit `code` im Schema `RR-<Status><Nr>`
- [ ] Service-Unit-Test **und** MockMvc-Test
- [ ] `./mvnw -q test` grün

### Teamkonventionen (Vorlage)

```markdown
## Teamkonventionen
- Backend: Schichten Controller → Service → Repository. Controller enthalten keine Logik.
- DTOs sind Java-Records, Mapping über eine *Mapper-Klasse (@Component). Entities verlassen nie den Service.
- Fehler: Exceptions aus common/ werfen (NotFoundException, BusinessRuleException mit Code RR-<HTTP-Status><Nr>).
  Der GlobalExceptionHandler macht daraus Problem Details (RFC 7807).
- Zeit immer über die injizierte java.time.Clock, nie LocalDateTime.now() ohne Clock.
- Jede neue Funktion: Service-Unit-Test (Mockito) + Controller-Test (@WebMvcTest/MockMvc).
- Code, Kommentare und Commits auf Englisch. UI-Texte auf Deutsch (Schweizer Rechtschreibung: ss statt Eszett).

## Befehle
- Backend testen: `cd app/backend && ./mvnw -q test` (Windows: `mvnw.cmd`)
- Backend formatieren: `./mvnw -q spotless:apply`
- Frontend testen: `cd app/frontend && npm test` · Lint: `npm run lint`
```

## Vorgeschlagene Prompts

```
Füge einen Endpoint GET /api/rooms/{id}/reservations hinzu, der alle Reservationen eines
Raums liefert. Gibt es den Raum nicht, soll ein 404 kommen.
```

## Erfolgskriterium

Das Ergebnis aus Teil B erfüllt die Checkliste deutlich besser als Teil A, und die
`CLAUDE.md` ist committet.

<details>
<summary>Hinweise</summary>

- Was gehört in eine CLAUDE.md? Alles, was Claude **nicht selbst aus dem Code** ableiten kann:
  Konventionen, Befehle, Fallstricke. Nicht hinein gehören lange Doku (besser `@docs/...`
  importieren oder als Skill, siehe Übung 03) und Dinge, die sich oft ändern.
- Jede Zeile der CLAUDE.md wird in **jeder** Session geladen. Kurz halten!
- Persönliches gehört in `CLAUDE.local.md` (nicht committet) oder `~/.claude/CLAUDE.md`.
- Gemerkt hat sich Claude selbst etwas? Das steht im Auto Memory, mit `/memory` anschauen.

</details>

## Token-Tipp

Teil A und B sind je ein Prompt. Lasst Claude nicht iterieren: Es geht um den Vergleich der ersten Antwort.

## Doku

- [How Claude remembers your project](https://code.claude.com/docs/en/memory) · [Set up Claude Code in a monorepo or large codebase](https://code.claude.com/docs/en/large-codebases)
- Lernen: [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) (Anthropic Academy)

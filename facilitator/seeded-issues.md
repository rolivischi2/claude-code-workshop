# Präparierte Fehler und Lücken (nur für den Facilitator)

Diese Stellen sind **absichtlich** im Repo. In den Übungsblättern stehen höchstens Hinweise darauf.

| # | Wo | Was | Gebraucht in | Aufgelöst in |
|---|----|-----|--------------|--------------|
| 1 | `app/backend/.../declaration/DeclarationService.java`, Methode `exceedsReferenceAmount` | Vergleich mit `>= 0` statt `> 0`. Eine Anmeldung, die die Garantie **genau** ausschöpft, wird abgelehnt (409, TR-4091). Das Javadoc darüber beschreibt die richtige Absicht («up to and including»). | 03 (Plan-Kritik, letzter Punkt der Checkliste) | `solution/03` |
| 2 | `app/backend/.../declaration/DeclarationServiceTest.java`, `allowsDeclarationUpToReferenceAmount` | Test für Fall 1, mit `@Disabled("TODO")` deaktiviert | 03 | `solution/03` |
| 3 | `app/backend/.../declaration/FristFormatter.java` | Absichtlich unformatiert. Einzige Datei, die `./mvnw spotless:check` meldet. Spotless ist bewusst **nicht** an `verify` gebunden, damit der Build grün bleibt. | 04 | `solution/04` (vom Hook formatiert) |
| 4 | `app/frontend/src/app/declaration-form/declaration-form.ts`, `submit()` | `error: () => this.saving.set(false)`: Fehler vom Backend (z.B. 409) werden verschluckt, keine Meldung im Formular | 06 | `solution/06` |
| 5 | `app/frontend/src/generated/api-types.ts` | «Generierter» Code mit Do-not-edit-Header, Ziel des PreToolUse-Hooks | 04 | – (bleibt geschützt) |
| 6 | `app/backend/.../guarantee/GuaranteeService.java` | Baut sein DTO direkt statt über einen Mapper. Ohne `CLAUDE.md` kopiert Claude dieses Muster, mit `CLAUDE.md` entsteht ein `GuaranteeMapper`. | 01 | – (Vergleich, Code wird verworfen) |

## Seed-Daten (In-Memory-H2, ein Neustart des Backends setzt alles zurück)

| Garantie | GRN | Inhaber | Referenzbetrag | Offen | Verfügbar |
|------------|-----|---------|----------------|-------|-----------|
| G1 | `26CH1000000000011` | Rhein Logistik AG | 50 000.00 | 12 500.00 | 37 500.00 |
| G2 | `26CH1000000000022` | Ticino Trasporti SA | 20 000.00 | 7 800.00 | 12 200.00 |
| G3 | `26CH1000000000033` | Léman Fret Sàrl | 10 000.00 | 9 500.00 | **500.00** |

Zollstellen: `CH001234` Basel/Weil-Autobahn (BOTH), `CH002345` Chiasso-Brogeda (BOTH),
`CH003456` Zürich-Flughafen (nur Bestimmung), `CH004567` Genève-Routes (BOTH),
`CH005678` Kreuzlingen-Autobahn (nur Abgang), `CH006789` St. Margrethen (BOTH).

Rezepte:
- **TR-4091 im UI (Übung 06):** Genève-Routes → «Transitanmeldung erfassen», Bestimmung Basel/Weil-Autobahn, Garantie G3, Betrag **600**, Freigabe morgen.
- **Off-by-one (Fehler 1):** dasselbe mit Betrag **500** wird fälschlich abgelehnt («noch verfügbar: CHF 500.00»). 499 geht durch.
  Nach einem erfolgreichen 500er ist G3 bis zum Neustart des Backends ausgeschöpft.

## Bewusste Designentscheide, die wie Fehler aussehen könnten

- Test-Logging auf WARN (`logback-test.xml`), Banner aus: kurze Ausgaben sparen Kontext.
- `spotless:check` ist nicht Teil von `./mvnw verify` (siehe #3).
- `data.sql` legt Anmeldungen relativ zu `CURRENT_DATE` an, damit sie immer in der Zukunft liegen.
- Beträge erscheinen im UI im en-US-Format («CHF 50,000.00»): de-CH-Locale ist bewusst nicht registriert, um das Frontend klein zu halten.
- Die MRN ist synthetisch (`JJ` + `CH` + 13 Ziffern + Prüfzeichen). Das echte Prüfzeichenverfahren ist nicht umgesetzt.

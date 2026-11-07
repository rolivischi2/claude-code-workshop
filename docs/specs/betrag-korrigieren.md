# Spec: Abgabenbetrag korrigieren

Status: umgesetzt (Übung 03, Referenzlösung)

## Verhalten

- `PUT /api/declarations/{mrn}/amount` mit `{ "amount": 1200.00 }` → 200 mit der aktualisierten `DeclarationDto`.
- Betrag fehlt oder ≤ 0 → 400 (Bean Validation, `errors.amount`). Ungültige MRN → 400 `TR-4004`, unbekannte → 404.
- Status nicht `OPEN` → 409 `TR-4092`.
- Erhöhung: Die Garantie muss den neuen Betrag decken. Offen = Summe der `OPEN`-Anmeldungen der
  Garantie **minus alter Betrag dieser Anmeldung**. Sonst 409 `TR-4091` («noch verfügbar» = höchster zulässiger neuer Betrag).
- Senkung (oder gleicher Betrag): immer erlaubt, ohne Prüfung der Garantie.

## Dateien

| Datei | Änderung |
|-------|----------|
| `declaration/UpdateAmountRequest.java` | neu: Record mit `@NotNull @Positive BigDecimal amount` |
| `declaration/DeclarationController.java` | `@PutMapping("/{mrn}/amount")`, delegiert nur |
| `declaration/DeclarationService.java` | `updateAmount` (`@Transactional`), `requireOpen` und `requireCoverage` aus `confirmArrival` und `create` herausgelöst |
| `declaration/TransitDeclaration.java` | `changeAmount(BigDecimal)` |

## Entscheide

- Prüfung **wiederverwenden**: `exceedsReferenceAmount(guarantee, openAmount(grn) - alterBetrag, neuerBetrag)`, keine Kopie der Summe.
- Eine Transaktion: Laden, Prüfen und Ändern in `updateAmount`. Gespeichert wird per Dirty Checking.
- Gefundener Fehler: `exceedsReferenceAmount` verglich mit `>= 0`, das Javadoc sagt «up to and including».
  Korrigiert auf `> 0`, der deaktivierte Test `allowsDeclarationUpToReferenceAmount` läuft wieder.

## Tests

- `DeclarationServiceTest`: Erhöhung ok, Erhöhung zu hoch (TR-4091, Betrag unverändert), Erhöhung
  genau bis zum Referenzbetrag, Senkung trotz bereits überzogener Garantie, Status nicht `OPEN` (TR-4092).
- `DeclarationControllerTest`: 200 mit neuem Betrag, 400 bei Betrag 0, 409 `TR-4092` als Problem Detail.
- Frontend: nicht Teil dieses Features.

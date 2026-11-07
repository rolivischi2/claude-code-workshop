# Lösung 03 – Planen vs. Ausführen

- Spec: `docs/specs/betrag-korrigieren.md` (der finale Plan mit Dateien, Logik und Tests)
- Neu: `declaration/UpdateAmountRequest.java` (Record, `@Positive`)
- Geändert: `DeclarationController` (`PUT /{mrn}/amount`), `DeclarationService` (`updateAmount`,
  `requireOpen`, `requireCoverage`, Fehler in `exceedsReferenceAmount`), `TransitDeclaration` (`changeAmount`)
- Tests: fünf neue Fälle in `DeclarationServiceTest`, drei in `DeclarationControllerTest`.
  `allowsDeclarationUpToReferenceAmount` ist wieder aktiv.

Was die Plan-Kritik typischerweise verbessert:

1. **Wiederverwendung statt Kopie**: Erste Pläne schreiben oft eine zweite Summen-Schleife mit eigenem
   Vergleich. Richtig ist `exceedsReferenceAmount` zusammen mit dem Code aus Übung 02, der den offenen Betrag berechnet
   (in der Referenzlösung `openAmount(grn)`; bei euch kann er anders heissen).
2. **Alter Betrag herausrechnen**: Ohne Hinweis zählt der Plan den alten Betrag doppelt. Dann
   scheitert z.B. 9500 → 9600 auf der Garantie Léman Fret Sàrl, obwohl nur 100 dazukommen.
3. **Senkung ohne Prüfung**: Nur bei einer Erhöhung wird die Garantie geprüft. Eine Senkung
   muss auch gehen, wenn die Garantie bereits überzogen ist. Der Test deckt genau das ab.
4. **Eine Transaktion**: `@Transactional` auf `updateAmount`. Laden, Prüfen und Ändern gelingen oder scheitern gemeinsam.
5. **Seeded Bug**: `exceedsReferenceAmount` verglich mit `>= 0`, das Javadoc sagt «up to and
   including». Gute Pläne merken das beim Test «genau am Referenzbetrag». Hier ist der Fix im
   Scope, weil die Korrektur dieselbe Prüfung nutzt. Er gehört aber sichtbar in den Plan, nicht nebenbei.

Gegenprobe gegen das laufende Backend (Seed-Daten, `26CH0000000000003P` hat 9500 auf G3):
10000.00 → 200, 10000.01 → 409 `TR-4091`, Betrag 0 → 400. Das Frontend bleibt unverändert.

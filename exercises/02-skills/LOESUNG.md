# Lösung 02 – Progressive Disclosure mit Skills

- Skill: `.claude/skills/rest-endpoint/SKILL.md`
- Endpoint: `GET /api/guarantees/{grn}/balance` im Paket `guarantee/`:
  `GuaranteeBalanceController`, `GuaranteeBalanceService`, `GuaranteeBalanceDto` (Record), `GuaranteeBalanceMapper`
- Geändert: `DeclarationService` bekommt `openAmount(grn)` (Summe der `OPEN`-Anmeldungen),
  `create` nutzt dieselbe Methode statt der eigenen Schleife.
- Tests: `GuaranteeBalanceServiceTest` (Mockito), `GuaranteeBalanceControllerTest` (`@WebMvcTest`, inkl. 404 als Problem Detail),
  `DeclarationServiceTest.openAmountSumsOpenDeclarationsOfGuarantee`

Worauf es ankommt:

- Die **description** nennt *was* (neuer REST-Endpoint im Backend) und *wann* (neuer Endpoint,
  API erweitern), auch mit den deutschen Wörtern aus euren Prompts. Nur sie steht dauerhaft im Kontext.
- Der Skill **verweist auf Vorlagen** (`OfficeController`, `OfficeMapper`, `OfficeControllerTest`)
  statt Code zu kopieren. Er warnt ausdrücklich vor dem `GuaranteeService`-Muster ohne Mapper.
- **Wiederverwenden statt kopieren**: Die Summe der offenen Beträge gibt es nur einmal, in
  `DeclarationService.openAmount`. Übung 03 baut darauf auf.
- **Eigener Service statt `GuaranteeService` erweitern**: `DeclarationService` hängt schon vom
  `GuaranteeService` ab. Würde der `GuaranteeService` umgekehrt den `DeclarationService` injizieren,
  startet Spring wegen der zyklischen Abhängigkeit nicht. Ein guter Plan erkennt das vorher.
- Ein kleiner neuer Controller mit demselben Basispfad `/api/guarantees`, statt `GuaranteeController` aufzublähen.

Prüfen, ob der Skill automatisch geladen wurde: Im Verlauf erscheint ein `Skill`-Aufruf
(«rest-endpoint»), bevor Dateien angelegt werden. Gegen das laufende Backend:
`curl localhost:8080/api/guarantees/26CH1000000000033/balance` liefert `available: 500.00`.

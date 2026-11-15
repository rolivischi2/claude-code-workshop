# Feature «Abgabenbetrag korrigieren»

Wer bei einer Transitanmeldung einen falschen Abgabenbetrag erfasst hat, soll ihn korrigieren können.

- `PUT /api/declarations/{mrn}/amount` mit `{ "amount": 1200.00 }` setzt den neuen Betrag und liefert die aktualisierte Anmeldung.
- Nur Anmeldungen mit Status `OPEN` dürfen korrigiert werden, sonst 409 mit Code `TR-4092`.
- Der Betrag muss grösser als 0 sein, sonst 400.
- Die Garantie muss den **neuen** Betrag decken. Der **alte** Betrag derselben Anmeldung zählt
  dabei nicht mehr zu den offenen Beträgen. Reicht die Garantie nicht, 409 mit Code `TR-4091`.
  Die Meldung nennt den höchsten zulässigen neuen Betrag.
- Eine Senkung des Betrags ist immer erlaubt.

# Übung 03 – Planen vs. Ausführen

**Block:** B – Steuerung · **Zeitbudget:** 15 Minuten

## Ziel

Ein Feature zuerst im Plan Mode planen lassen, den Plan kritisch prüfen und erst dann umsetzen.

## Konzept

Eine falsche Richtung zu korrigieren ist im Plan billig und im Code teuer. Deshalb lohnt es
sich, Analyse und Umsetzung zu trennen. Im Plan Mode liest Claude nur und schreibt nichts.
Den Plan könnt ihr anpassen, bevor eine Zeile Code entsteht. Als Spec-Datei abgelegt, bleibt
er ein dauerhaftes Zwischenergebnis.

## Aufgabe: Feature «Abgabenbetrag korrigieren»

Wer bei einer Transitanmeldung einen falschen Abgabenbetrag erfasst hat, soll ihn korrigieren können.

- `PUT /api/declarations/{mrn}/amount` mit `{ "amount": 1200.00 }` setzt den neuen Betrag und liefert die aktualisierte Anmeldung.
- Nur Anmeldungen mit Status `OPEN` dürfen korrigiert werden, sonst 409 mit Code `TR-4092`.
- Der Betrag muss grösser als 0 sein, sonst 400.
- Die Garantie muss den **neuen** Betrag decken. Der **alte** Betrag derselben Anmeldung zählt
  dabei nicht mehr zu den offenen Beträgen. Reicht die Garantie nicht, 409 mit Code `TR-4091`.
  Die Meldung nennt den höchsten zulässigen neuen Betrag.
- Eine Senkung des Betrags ist immer erlaubt.

Ablauf:

1. Neue Session, **Shift+Tab** so oft drücken, bis unten «plan mode» steht (die Taste schaltet reihum durch die Modi).
2. Prompt 1 absetzen und den Plan lesen.
3. Plan mit der Checkliste unten kritisieren und mit **einem** Prompt nachschärfen (Prompt 2).
4. Plan als Spec-Datei ablegen lassen und erst dann die Umsetzung freigeben (Prompt 3).

### Checkliste für die Plan-Kritik

- [ ] Wird die bestehende Prüfung der Garantie (`DeclarationService`) **wiederverwendet** statt kopiert?
- [ ] Wird der alte Betrag der Anmeldung aus den offenen Beträgen **herausgerechnet**?
- [ ] Läuft alles in **einer** Transaktion?
- [ ] Sind Tests geplant: Erhöhung ok, Erhöhung zu hoch, Senkung, Status nicht `OPEN`?
- [ ] Bleiben Änderungen auf das Feature beschränkt?
- [ ] Ist an der bestehenden Prüfung der Garantie etwas auffällig? (Tipp: Was gilt genau **am** Referenzbetrag?)

## Vorgeschlagene Prompts

Prompt 1 (im Plan Mode):
```
Plane das Feature «Abgabenbetrag korrigieren» gemäss exercises/03-plan-mode/README.md.
Zeig mir betroffene Dateien, die Logik der Prüfung gegen die Garantie und die geplanten Tests.
```

Prompt 2 (Kritik, Beispiel):
```
Bitte überarbeite den Plan: Nutze exceedsReferenceAmount wieder, rechne den alten Betrag der
Anmeldung aus den offenen Beträgen heraus und ergänze einen Test für einen Betrag, der die
Garantie genau ausschöpft. Prüf dabei, ob exceedsReferenceAmount zu seinem Javadoc passt.
```

Prompt 3 (vor der Freigabe):
```
Speichere den finalen Plan als docs/specs/betrag-korrigieren.md und setze ihn dann um.
```

## Erfolgskriterium

```bash
cd app/backend && ./mvnw -q test        # grün, inkl. neuer Tests
```

Dazu existiert `docs/specs/betrag-korrigieren.md`. Habt ihr den Fehler in der bestehenden
Prüfung gefunden und mit Test behoben, umso besser.

<details>
<summary>Hinweise</summary>

- Plan Mode verlassen: Beim Freigeben des Plans fragt Claude, wie es weitergehen soll
  (z.B. mit «auto-accept edits»). Wieder hinein geht es mit Shift+Tab.
- Ein guter Plan ist überprüfbar: Dateien, Schritte, Tests. «Ich implementiere die Korrektur» ist kein Plan.
- Aus Übung 02 gibt es bei euch bereits Code, der den offenen Betrag einer Garantie berechnet.
  Name und Ort können von der Referenzlösung abweichen. Der Plan soll **euren** Code wiederverwenden.
- Der deaktivierte Test in `DeclarationServiceTest` hat mit dem auffälligen Punkt zu tun.
- Die Spec-Datei hilft der nächsten Session (oder Kollegin), ohne den ganzen Verlauf zu laden.

</details>

## Token-Tipp

Kritik in **einem** gesammelten Prompt statt in fünf kleinen. Jeder Turn schickt den ganzen bisherigen Kontext mit.

## Doku

- [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) (inkl. Plan Mode) · [Common workflows](https://code.claude.com/docs/en/common-workflows) · [Best practices](https://code.claude.com/docs/en/best-practices)
- Lernen: [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) (Anthropic Academy)

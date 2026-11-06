# Übung 04 – Planen vs. Ausführen

**Block:** B – Steuerung & Sicherheit · **Zeitbudget:** 30 Minuten

## Ziel

Ein Feature zuerst im Plan Mode planen lassen, den Plan kritisch prüfen und erst dann umsetzen.

## Konzept

Eine falsche Richtung zu korrigieren ist im Plan billig und im Code teuer. Deshalb lohnt es
sich, Analyse und Umsetzung zu trennen. Im Plan Mode liest Claude nur und schreibt nichts.
Den Plan könnt ihr anpassen, bevor eine Zeile Code entsteht. Als Spec-Datei abgelegt, bleibt
er ein dauerhaftes Zwischenergebnis.

## Aufgabe: Feature «Warteliste»

Ist ein Raum im Wunschzeitraum belegt, soll man sich auf eine Warteliste setzen können.

- `POST /api/waitlist` nimmt dieselben Felder wie eine Reservation entgegen und prüft dieselben Regeln (Dauer, Zukunft, Ende nach Beginn).
- Ein Eintrag ist nur erlaubt, wenn der Zeitraum **belegt** ist. Ist er frei, gibt es 400 mit Code `RR-4003` («direkt buchen»).
- Pro Raum höchstens **5** Einträge, sonst 409 mit Code `RR-4093`.
- `GET /api/waitlist?roomId=1` listet die Einträge in Reihenfolge der Anmeldung.
- Wird eine Reservation **gelöscht**, prüft das System die Warteliste dieses Raums der Reihe
  nach. Jeder Eintrag, dessen Zeitraum jetzt frei ist, wird zur Reservation und verschwindet
  von der Warteliste.

Ablauf:

1. Neue Session, mit **Shift+Tab** in den Plan Mode wechseln (Anzeige unten: «plan mode»).
2. Prompt 1 absetzen und den Plan lesen.
3. Plan mit der Checkliste unten kritisieren und mit Prompt 2 nachschärfen.
4. Plan als Spec-Datei ablegen lassen und erst dann die Umsetzung freigeben.

### Checkliste für die Plan-Kritik

- [ ] Wird die bestehende Überschneidungsprüfung **wiederverwendet** statt kopiert?
- [ ] Ist die Reihenfolge eindeutig (Anmeldezeitpunkt oder ID)?
- [ ] Laufen Löschen und Nachrücken in **einer** Transaktion?
- [ ] Sind Tests geplant: Nachrücken, Limit 5, freier Zeitraum abgelehnt?
- [ ] Bleiben Änderungen auf das Feature beschränkt?
- [ ] Ist etwas an der bestehenden Überschneidungslogik auffällig? (Nur notieren, nicht beheben.)

## Vorgeschlagene Prompts

Prompt 1 (im Plan Mode):
```
Plane das Feature «Warteliste» gemäss exercises/04-planen-vs-ausfuehren/README.md.
Zeig mir betroffene Dateien, neue Klassen, die Logik fürs Nachrücken und die geplanten Tests.
```

Prompt 2 (Kritik, Beispiel):
```
Bitte überarbeite den Plan: Nutze die bestehende Überschneidungsprüfung aus dem
ReservationService wieder, Löschen und Nachrücken in einer Transaktion, und ergänze einen
Test für das Limit von 5 Einträgen.
```

Prompt 3 (vor der Freigabe):
```
Speichere den finalen Plan als docs/specs/warteliste.md und setze ihn dann um.
```

## Erfolgskriterium

```bash
cd app/backend && ./mvnw -q test        # grün, inkl. neuer Warteliste-Tests
```

Dazu existiert `docs/specs/warteliste.md`.

<details>
<summary>Hinweise</summary>

- Plan Mode verlassen: Beim Freigeben des Plans fragt Claude, wie es weitergehen soll
  (z.B. mit «auto-accept edits»). Wieder hinein geht es mit Shift+Tab.
- Ein guter Plan ist überprüfbar: Dateien, Schritte, Tests. «Ich implementiere die Warteliste» ist kein Plan.
- Die Spec-Datei hilft der nächsten Session (oder Kollegin), ohne den ganzen Verlauf zu laden.

</details>

## Token-Tipp

Kritik in **einem** gesammelten Prompt statt in fünf kleinen. Jeder Turn schickt den ganzen bisherigen Kontext mit.

## Doku

- [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) (inkl. Plan Mode) · [Common workflows](https://code.claude.com/docs/en/common-workflows) · [Best practices](https://code.claude.com/docs/en/best-practices)
- Lernen: [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) (Anthropic Academy)

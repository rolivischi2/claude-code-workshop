# Lösung 01 – Kontext und CLAUDE.md

- `CLAUDE.md` im Repo-Root (ca. 25 Zeilen): kurze `/init`-Beschreibung (Stack, Layout, Befehle)
  plus «Teamkonventionen» und «Befehle» aus der Vorlage.
- Der Endpoint `GET /api/guarantees/{grn}` ist **nicht** Teil der Lösung. Er wird in beiden
  Teilen verworfen, es geht nur um den Vergleich.

Typische Messung mit `/context` (Grössenordnung, nicht exakt):

| Schritt | Beobachtung |
|---------|-------------|
| Start | Grundlast: System-Prompt und Tool-Definitionen (Wert aus Übung 00) |
| Prompt 1 mit `@GlobalExceptionHandler.java` | wenige tausend Tokens mehr, fast alles ist die Datei selbst (Tool-Ergebnis) |
| Prompt 2 (Feature) | deutlich mehr: Claude liest mehrere Dateien und führt die Tests aus |

Typischer Unterschied im Vorher/Nachher-Vergleich:

| Checkliste | Teil A (ohne CLAUDE.md) | Teil B (mit CLAUDE.md) |
|------------|-------------------------|------------------------|
| Mapping | `new GuaranteeDto(...)` direkt im `GuaranteeService`, wie das bestehende `findAll` | neuer `GuaranteeMapper` (@Component), oft wird auch `findAll` umgestellt |
| 404 | meist korrekt, weil `getGuarantee` schon `NotFoundException` wirft | gleich, plus Problem Detail im Controller-Test geprüft |
| Tests | oft nur ein `@WebMvcTest` oder gar keiner | Service-Unit-Test **und** Controller-Test |
| Befehl | manchmal `mvn test` statt `./mvnw -q test` | `./mvnw -q test` |

Worauf es ankommt:

- **Regeln, die man nicht aus dem Code ablesen kann**, gehören in die CLAUDE.md. Der
  `GuaranteeService` zeigt das «falsche» Muster. Ohne Regel ist Kopieren für Claude die vernünftigste Wahl.
- **Kurz halten**: Jede Zeile wird in jeder Session geladen. Keine Klassenlisten und keine
  Abläufe («so baut man einen Endpoint»): Das wird in Übung 02 ein Skill.
- **Tool-Ergebnisse** (gelesene Dateien, Testausgaben) kosten am meisten, nicht eure Prompts.
- `/clear` vor jedem neuen Versuch: Sonst sieht Claude im zweiten Durchgang die Lösung aus dem ersten.

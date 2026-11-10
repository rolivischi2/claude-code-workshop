# Präsentation: Claude Code Workshop

Eine statische Seite für den ganzen Nachmittag: Konzepte, eine Folie pro Übung, die Demo
«Suche des Agenten vs. RAG» und der Rückblick, in der Reihenfolge des Ablaufs. Kein Build, kein
Server, keine CDN, nur Systemschriften.

- **Lokal:** `index.html` öffnen (Doppelklick genügt, `file://` funktioniert, auch offline).
- **Gehostet:** Vercel liefert genau diesen Ordner aus (`vercel.json` im Repo-Root).

Ausgelegt für 1920×1080. `f` schaltet Vollbild.

## Aufbau

| Abschnitt | Szenen |
|-----------|--------|
| ▶ Start | Ablauf · Überblick · Übung 00 |
| A Kontext | Kontext · Übung 01 A · Übung 01 B · Übung 02 |
| B Steuerung | Leitplanken · Übung 03 · Übung 04 A · Übung 04 B · Rewind · Übung 05 · Pause |
| C MCP | MCP · Übung 06 |
| R Suche | Korpus · Chunking · BM25 · Vektor-DB · Vektorsuche · Hybrid · Agent · Test · Messung · Fazit |
| D Skalieren | Skalieren · Demo (Ankündigung der Live-Demo im Terminal des Facilitators) · Ablauf (Animation nach der Demo) |
| ■ Schluss | Rückblick |

Die Reihenfolge steht in `index.html` (`VIZ.SECTIONS`).

## Bedienung

| Taste | Wirkung |
|-------|---------|
| `→`, Leertaste, Bild↓ | nächster Schritt, danach nächste Szene (Presenter-Klicker funktionieren) |
| `←`, Bild↑ | Schritt zurück |
| Shift + `→` / `←` | nächster / vorheriger Abschnitt |
| `1` … `9` | Szene im aktuellen Abschnitt |
| `o` | Übersicht aller Szenen |
| `z` / `x` | Übungsfolien und Pause: Uhr starten oder pausieren / zurücksetzen |
| `q` | Abschnitt Suche: Frage wählen |
| `g` | Schätzfragen aus/ein |
| `t` | Chunking: feste Länge ↔ Überschriften |
| `r` | Animation der Szene wiederholen |
| `f` | Vollbild |
| `?` | Hilfe |

Die aktuelle Szene steht in der Adresse (`#s=bm25&q=S2`). Ein Link führt also direkt zu einer Folie.
`prefers-reduced-motion` wird respektiert.

**Schätzfragen:** Vor einem Schritt erscheint eine Frage ans Publikum (Handzeichen). `→` zeigt die
Antwort, nochmals `→` fährt weiter. Im Abschnitt Suche wird die Antwort aus `data.js` berechnet.

## Übungsfolien

Der Inhalt steht in `uebungen-daten.js`: Ziel, Aufgabe, Schritte, Prompts, Prüfung, Token-Tipp. Quelle ist
das jeweilige Blatt unter `exercises/`. Prompts, Vorlagen und Prüfbefehle müssen wörtlich übereinstimmen:

```bash
node scripts/check-slides.mjs
```

Wer ein Übungsblatt ändert, passt die Folie an und lässt die Prüfung laufen (`verify-all.sh` tut das auch).

## Dateien

| Datei | Inhalt |
|-------|--------|
| `index.html` | Gerüst, Reihenfolge der Abschnitte und Szenen |
| `viz.js`, `style.css` | Motor (Navigation, Tastatur, Schätzfragen, Bausteine) und Gestaltung |
| `scenes-konzepte.js`, `konzepte.css` | Konzept-Szenen: Überblick, Kontext, Leitplanken, Rewind, MCP, Skalieren, Demo, Ablauf, Rückblick |
| `scenes-uebungen.js`, `uebungen-daten.js` | Übungsfolien, Titelfolie mit Ablauf, Pause |
| `scenes-retrieval.js`, `scenes-results.js` | Abschnitt Suche |
| `data.js` | Daten des Suchexperiments, erzeugt mit `cd rag && uv run export-viz` (nicht von Hand bearbeiten) |
| `data.sample.js` | erfundene Beispieldaten, werden geladen, wenn `data.js` fehlt (Badge «Beispieldaten») |

`data.js` enthält kurze Textauszüge aus öffentlichen Publikationen des BAZG. Die Quellen stehen in
`rag/sources.yaml`.

Aussagen der Konzept-Szenen zu Reihenfolgen und Verhalten sind gegen die Doku von Claude Code geprüft
(Stand 2026-11-10). Bei einem Update von Claude Code kurz gegenprüfen.

## Datenvertrag (`window.DATA`)

`data.js` wird als klassisches Skript geladen (kein `fetch`), damit die Seite auch über
`file://` und offline funktioniert:

```js
window.DATA = {
  meta: {
    generated: "2026-11-07T10:00:00Z",
    variant: "heading+MiniLM",    // Variante, aus der Rankings und Karte stammen (markiert auf der Folie «Messung»)
    note: "…",                    // freier Hinweis der Pipeline, wird nicht angezeigt
    model: "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    chunking: "heading",          // "heading" | "fixed"
    k: 5,                         // Top-k für Recall@k
    rrf_k: 60,
    dims: 384,                    // Länge eines Embeddings (Szene «Vektor-DB»)
    corpus: { docs: 14, chunks: 1830, langs: { de: 1200, fr: 400, it: 230 } }
  },

  docs: [ { id: "r-14-01-de", title: "R-14-01 Gemeinsames Versandverfahren (gVV)",
            lang: "de", url: "https://www.bazg.admin.ch/...", pages: 120 } ],

  // Alle Chunks, die in irgendeiner Rangliste vorkommen (Top 10 jedes Modus jeder Frage),
  // plus eine zufällige (geseedete) Stichprobe von ~300 weiteren als Hintergrund der Karte.
  chunks: [ { id: 17, doc: "r-14-01-de", heading: "4 Sicherheitsleistung > 4.2 Gesamtbürgschaft",
              lang: "de", text: "erste ~400 Zeichen des Chunks", x: 0.12, y: -0.48,
              v: [0.02, -0.05, …] } ],   // erste 16 Werte des Embeddings; nur bei Chunks aus einer Vektor-Rangliste
  // x, y: 2D-PCA-Projektion des Embeddings, beide auf [-1, 1] skaliert.
  // Die Seite zeichnet die echten Top-k aus questions[].vector, nie Nachbarn aus x/y.

  // Ein Beispielabschnitt für die Chunking-Szene.
  chunkingDemo: {
    doc: "r-14-01-de",
    text: "~2500 Zeichen Rohtext eines Abschnitts",
    fixed:   [ { start: 0, end: 400 }, { start: 350, end: 750 } ],             // Zeichen-Offsets in text
    heading: [ { start: 0, end: 610, heading: "4 Sicherheit > 4.1 Allgemeines" } ]
  },

  questions: [ {
    id: "q01",
    category: "synonym",          // "synonym" | "cross-lingual" | "exact-identifier" | "multi-doc"
    text: "Wie hoch muss die Kaution für ein Versandverfahren sein?",
    expected_docs: ["r-14-01-de"],
    showcase: true,               // die 3–4 Fragen für die Live-Erzählung
    note: "Dokument sagt 'Sicherheit', nie 'Kaution'",   // einzeiliger Hinweis (Deutsch); erscheint in der Fragenauswahl
    note_bm25: "…", note_vector: "…",                 // Erklärung auf der Folie der jeweiligen Suche
    query_terms: ["hoch", "kaution", "versandverfahren"],  // FTS-Begriffe nach Stoppwörtern
    term_df: { kaution: 0, hinterlegen: 4 },   // in wie vielen Chunks des ganzen Index jeder Suchbegriff vorkommt (Szene BM25)
    query_xy: [0.10, -0.40],      // Frage mit derselben PCA projiziert
    query_v: [-0.01, -0.01, …],   // erste 16 Werte des Embeddings der Frage (Szene «Vektor-DB»)
    bm25:   [ { rank: 1, chunk: 17, score: 7.31, hit: true,  matched: ["versandverfahren"] } ],  // Top 10
    vector: [ { rank: 1, chunk: 17, score: 0.71, hit: true } ],                                  // Top 10
    hybrid: [ { rank: 1, chunk: 17, score: 0.0325, hit: true, from: { bm25: 3, vector: 1 } } ]   // Top 10; null wenn nicht vorhanden
    // hit = chunk.doc ist in expected_docs
  } ],

  eval: {
    k: 5,
    modes: ["bm25", "vector", "hybrid"],
    categories: ["synonym", "cross-lingual", "exact-identifier", "multi-doc"],
    // eine Zeile pro (Variante, Modus, Kategorie) plus Kategorie "all"
    rows: [ { variant: "heading+MiniLM", mode: "bm25", category: "synonym", recall: 0.40, mrr: 0.31, n: 6 } ],
    variants: ["fixed+MiniLM", "heading+MiniLM", "heading+e5-large"]   // was tatsächlich gemessen wurde
  },

  // Aufgezeichnete echte Claude-Code-Läufe (claude -p --output-format stream-json) über die
  // extrahierten Korpus-Texte, nur mit Grep/Glob/Read. Ein Eintrag pro Showcase-Frage.
  agent: [ {
    question: "q01",
    model: "claude-sonnet-...",
    turns: 7, input_tokens: 48210, output_tokens: 1320, duration_s: 41,
    found_expected: true,
    answer: "kurzer Auszug der Schlussantwort (≤ 400 Zeichen)",
    steps: [ { n: 1, tool: "Grep", input: "pattern: Sicherheit|Bürgschaft  path: corpus/",
               result_chars: 5400, context_tokens: 21000 } ]
  } ]
};
```

Alle Texte UTF-8, deutsche Texte in Schweizer Schreibweise (ss, nie ß).

### Wie die Seite mit fehlenden Teilen umgeht

- Kein `agent` oder kein Lauf für die gewählte Frage: die Folie «Agent» zeigt einen Hinweis und die
  Fragen, für die es eine Aufzeichnung gibt.
- `hybrid` ist `null`: die Folie «Hybrid» zeigt die beiden Listen und einen Hinweis statt der Fusion.
- Kein `query_xy`: Die Frage wird in die Mitte ihrer Top-k-Nachbarn gesetzt und als
  «Position geschätzt» beschriftet.
- Keine Frage mit `showcase: true`: Die Auswahl zeigt alle Fragen nach Kategorie, Start ist
  die erste Frage.
- Kein `eval` oder kein `chunkingDemo`: Die betroffene Szene zeigt einen Hinweis.
- `heading` darf leer sein. Chunks in `chunkingDemo.heading` dürfen sich überlappen
  (lange Abschnitte, die weiter zerlegt werden); Überlappungen erscheinen schraffiert.

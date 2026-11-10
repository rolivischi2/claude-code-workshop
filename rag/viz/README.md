# Visualisierung: Agentische Suche vs. RAG

Eine statische Präsentationsseite für den Block «Agentische Suche vs. RAG». Sie erzählt das
Experiment in neun Szenen und läuft offline direkt aus dem Dateisystem: kein Build, kein
Server, keine CDN, nur Systemschriften.

| Szene | Inhalt |
|-------|--------|
| 1 Korpus | Jedes Dokument als Kachel (Breite nach Seitenzahl, Muster nach Sprache), dann die zwei Wege: Index bauen oder selbst suchen |
| 2 Chunking | Ein Abschnitt wird geschnitten: feste Länge (Schnitte mitten im Wort, Überlappung) gegen Überschriftenpfad |
| 3 BM25 | Drei Schritte mit echten Werten: Frage zerlegen (Füllwörter nach der Stoppwortliste in `store.py` durchgestrichen), Seltenheit je Suchbegriff (Anzahl Chunks im ganzen Index und Gewicht), Rangliste mit Scores. Dazu ein Kasten «Was ist BM25?» |
| 4 Vektor-DB | Text → Embedding-Modell → Zahlen. Die Datenbank als Tabelle (eine Zeile pro Chunk mit den ersten 16 Werten des Embeddings), die Frage als weitere Zeile, Kosinus-Ähnlichkeit pro Zeile, Zeilen sortieren sich |
| 5 Vektorsuche | 2D-Karte der Chunks, die Frage fliegt ein, die echten Top-k-Nachbarn werden verbunden, danach Nahaufnahme |
| 6 Hybrid | Beide Ranglisten, die Karten wandern in die RRF-Reihenfolge, jede mit ihren `1/(k+Rang)`-Anteilen |
| 7 Agent | Aufgezeichneter Claude-Code-Lauf (Grep, Glob, Read) als Zeitleiste mit Turns und Kontext-Tokens |
| 8 Messung | Jede Frage ein Punkt pro Suchverfahren (voll, halb, verfehlt), dann die Varianten als drei Karten. `d` zeigt die Detail-Diagramme mit Recall@k und MRR pro Kategorie |
| 9 Fazit | Vier Kernaussagen (editierbar in `VIZ.MESSAGES` am Anfang von `viz.js`) |

## Öffnen

`index.html` im Browser öffnen (Doppelklick genügt, `file://` funktioniert). Für den Beamer
auf 1920×1080 ausgelegt, funktioniert auch auf 1280×800. Mit `f` in den Vollbildmodus.

Die Seite lädt zuerst `data.js` (erzeugt von der Pipeline mit `uv run export-viz`). Fehlt die
Datei, lädt sie `data.sample.js` und zeigt unten rechts den Hinweis **Beispieldaten**. Die
Beispieldaten sind erfunden und dienen nur der Entwicklung der Seite.

Hinweis: Fehlt `data.js`, meldet der Browser in der Konsole einmal `ERR_FILE_NOT_FOUND`. Das ist
erwartet und harmlos.

## Bedienung

| Taste | Wirkung |
|-------|---------|
| `→`, Leertaste, Bild↓ | nächster Animationsschritt, danach nächste Szene (Presenter-Klicker funktionieren) |
| `←`, Bild↑ | Schritt zurück |
| Shift + `←` / `→` | ganze Szene zurück oder vor |
| `1` … `9` | direkt zur Szene |
| `q` | Frage wählen (Showcase-Fragen zuerst, dann alle nach Kategorie) |
| `r` | Animation der aktuellen Szene nochmals abspielen |
| `f` | Vollbild ein/aus |
| `g` | Schätzfragen aus/ein |
| `t` | Szene 2: feste Länge ↔ Überschriften |
| `d` | Szene 8: Detail-Diagramme ein/aus |
| `v` | Szene 8, Detail: nächste Variante |
| `?` | Hilfe |

Die aktuelle Szene und Frage stehen in der Adresse (`#s=3&q=q01`), ein Neuladen springt
also an dieselbe Stelle. `prefers-reduced-motion` wird respektiert: dann gibt es keine
Bewegung, nur Zustandswechsel.

## Schätzfragen

In den Szenen 3, 5, 7 und 8 erscheint vor der Auflösung eine Frage ans Publikum (Handzeichen):
`→` zeigt die Frage, `→` löst auf, `→` fährt weiter. Die richtige Antwort wird **aus den Daten
berechnet** (Rang des ersten Treffers, Turns des Agents, Recall der Varianten) und stimmt darum
auch nach einem neuen `uv run export-viz`. Eine Szene definiert dafür `guess(ctx)` und liefert
`{ before, question, options, correct, reveal }`. `g` schaltet alle Runden aus.

Der Motor (`viz.js`, `style.css`) wird auch von `facilitator/konzepte/` geladen.

## Dateien

| Datei | Inhalt |
|-------|--------|
| `index.html` | Gerüst, lädt Daten und Skripte |
| `viz.js` | Zustand, Navigation, Tastatur, Fragenauswahl, Kernaussagen |
| `scenes-retrieval.js` | Szenen 1–6 |
| `scenes-results.js` | Szenen 7–9 |
| `style.css` | Gestaltung |
| `data.js` | echte Daten aus der Pipeline (nicht von Hand bearbeiten) |
| `data.sample.js` | Beispieldaten im gleichen Format |

## Datenvertrag (`window.DATA`)

`data.js` wird als klassisches Skript geladen (kein `fetch`), damit die Seite auch über
`file://` und offline funktioniert:

```js
window.DATA = {
  meta: {
    generated: "2026-11-07T10:00:00Z",
    variant: "heading+MiniLM",    // Variante, aus der Rankings und Karte stammen (markiert in Szene 8)
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

- Kein `agent` oder kein Lauf für die gewählte Frage: Szene 5 zeigt einen Hinweis und die
  Fragen, für die es eine Aufzeichnung gibt.
- `hybrid` ist `null`: Szene 4 zeigt die beiden Listen und einen Hinweis statt der Fusion.
- Kein `query_xy`: Die Frage wird in die Mitte ihrer Top-k-Nachbarn gesetzt und als
  «Position geschätzt» beschriftet.
- Keine Frage mit `showcase: true`: Die Auswahl zeigt alle Fragen nach Kategorie, Start ist
  die erste Frage.
- Kein `eval` oder kein `chunkingDemo`: Die betroffene Szene zeigt einen Hinweis.
- `heading` darf leer sein. Chunks in `chunkingDemo.heading` dürfen sich überlappen
  (lange Abschnitte, die weiter zerlegt werden); Überlappungen erscheinen schraffiert.

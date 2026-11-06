---
id: guidelines-java-conventions
title: Java-Konventionen
lang: de
tags: [richtlinie, java, backend]
---

# Java-Konventionen

Der Backend-Code ist in Java mit Spring Boot geschrieben. Einheitliche Konventionen erleichtern das Lesen und das Review.

## Formatierung

Der Code wird mit **google-java-format** formatiert. Die Formatierung wird über **Spotless** im Build erzwungen: `./gradlew spotlessApply` formatiert, `spotlessCheck` schlägt bei Abweichungen fehl. Diskussionen über Einrückung und Klammern entfallen damit im Review.

## Datentransferobjekte

DTOs werden als **Records** definiert. Sie sind unveränderlich, kompakt und eignen sich gut für die Serialisierung. Entitäten der Datenbank sind keine Records und werden nie direkt über die API ausgeliefert.

## Abhängigkeiten

Abhängigkeiten werden per **Konstruktorinjektion** bereitgestellt. Feldinjektion mit `@Autowired` ist nicht erlaubt, weil sie Tests erschwert und Abhängigkeiten versteckt. Felder mit injizierten Objekten sind `final`.

## Schichten

Die Anwendung ist in drei Schichten gegliedert:

1. **Controller:** nimmt HTTP-Anfragen entgegen, validiert Form und Format, ruft den Service auf.
2. **Service:** enthält die Fachlogik und die Prüfung der Regeln.
3. **Repository:** Zugriff auf die Datenbank.

Aufrufe gehen immer in dieser Richtung: Controller → Service → Repository. Ein Controller greift nie direkt auf ein Repository zu, und ein Repository kennt keine DTOs.

### Weitere Regeln

- Pakete nach Fachbereich gliedern (`booking`, `room`, `user`), nicht nach technischer Schicht.
- Optionale Rückgabewerte als `Optional`, nie als `null`.
- Zeit nur über eine injizierte `Clock` beziehen.
- Fachliche Ausnahmen tragen einen Fehlercode.
- Kommentare erklären das Warum, nicht das Was.

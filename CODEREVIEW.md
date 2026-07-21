# Code Review Standard — Kidashi Design

Bei jeder Fehleranalyse oder Codeüberprüfung gelten folgende Pflichtpunkte in dieser Reihenfolge:

---

## 1 · Kritische Fehler zuerst
Sicherheitslücken und crashes werden immer als erstes behandelt, noch vor allen anderen Punkten.

## 2 · Jeden Fehler dokumentieren
Für jeden gefundenen Fehler:
- **Zeile** (Datei + Zeilennummer)
- **Erklärung** (was ist falsch und warum)
- **Fix** (konkreter korrigierter Code)

## 3 · Optimierungen bewerten
Jede Optimierung erhält eine **Aufwand / Nutzen**-Bewertung:
- Aufwand: niedrig / mittel / hoch
- Nutzen: niedrig / mittel / hoch

## 4 · Abschluss
- **Gesamtbewertung**: 1–10
- **Top 3 Maßnahmen**: die drei wichtigsten Schritte, priorisiert

## 5 · Vorher / Nachher-Beispiele
Für jeden Vorschlag ein konkretes Beispiel:

```
// VORHER
[alter Code]

// NACHHER
[korrigierter Code]
```

---

*Dieses Format gilt für alle Code-Reviews und Fehleranalysen in diesem Projekt.*

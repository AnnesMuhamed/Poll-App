# Poll-App

Projektgerüst für eine schlanke Umfrage-App in **Vanilla TypeScript** (Vite,
kein Framework). Dies ist der Ausgangspunkt – die eigentliche App wird Schritt
für Schritt entwickelt, gemäß den Anforderungen in
[`docs/CHECKLIST.md`](docs/CHECKLIST.md) und den Code-Conventions in
[`docs/CONVENTIONS.md`](docs/CONVENTIONS.md).

## Erste Schritte

```bash
npm install
npm run dev      # Entwicklungsserver starten
npm run build    # Typecheck + Produktions-Build
npm run preview  # Produktions-Build lokal ansehen
```

## Projektstruktur

```
Pol-App/
├─ index.html              # Einstiegspunkt (semantisch, lang="de")
├─ public/                 # Statische Assets (Favicon, SVGs)
├─ docs/
│  ├─ CHECKLIST.md         # User Stories & Anforderungen (Entwicklungsstand)
│  └─ CONVENTIONS.md       # Coding Conventions (HTML & TypeScript)
└─ src/
   ├─ main.ts              # Entry-Point (bindet die App ans DOM)
   ├─ styles/              # Stylesheets (Darstellung getrennt von Struktur)
   ├─ types/               # Typdefinitionen (folgt)
   ├─ data/                # (Beispiel-)Daten (folgt)
   ├─ services/            # Fachlogik & Persistenz (folgt)
   ├─ components/          # UI-Bausteine (folgt)
   └─ utils/               # Hilfsfunktionen (folgt)
```

## Geplante Architektur

- **Render-Funktionen** geben HTML-Strings zurück (siehe TS-Convention).
- Ein zentraler **Controller** in `src/` hält den Zustand und verteilt Events.
- **Services** kapseln die Fachlogik und die Persistenz.

Die Ordner `types`, `data`, `services`, `components` und `utils` sind aktuell
leer (Platzhalter `.gitkeep`) und werden während der Entwicklung gefüllt.

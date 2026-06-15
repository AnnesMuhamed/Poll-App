# Coding Conventions

Verbindliche Code-Conventions für die Poll-App (HTML & TypeScript).

## HTML

### Struktur & Semantik
- Semantische Tags nutzen: `header, nav, main, section, article, aside, footer`.
- `h1`–`h6` in sinnvoller Hierarchie; `section` für thematische Abschnitte.
- `article` für eigenständige Inhalte, `aside` für Zusatzinfos (nicht für Layout).
- `figure` + `figcaption` für Bilder mit Bedeutung.

### Lesbarkeit & Wartbarkeit
- Einheitlich einrücken; keine tiefen, unübersichtlichen Verschachtelungen.
- Sprechende, englische Namen. Struktur (HTML) von Darstellung (CSS) trennen.
- So wenig `div` wie möglich, so viel wie nötig ("div-Suppe" vermeiden).

### Barrierefreiheit
- Bilder mit sinnvollen `alt`-Texten; E-Mail-Adressen mit `mailto:`.
- Tabellen mit `caption`, `th` statt nur `td`, korrekte Zeilen-/Spaltenstruktur.
- Navigation als Liste (`ul` in `nav`).

### Inhalte richtig kennzeichnen
- Wichtiges mit `strong`/`em`, nicht `b`/`i`. Inline-Text mit `span`.
- Fließtext in `p`, nicht in `div`.

### Gültigkeit & Standards
- Mit `<!DOCTYPE html>` beginnen, `<html lang="...">` setzen.
- Im `<head>`: `meta charset="UTF-8"` und `title` nicht vergessen; Favicon einbinden.

## TypeScript

### Allgemein
- Dateinamen in `kebab-case` (z. B. `poll-service.ts`).
- Max. 14 Zeilen pro Funktion – eine Aufgabe pro Funktion.
- Semikolons immer setzen, 2 Leerzeichen Einrückung.
- Kein `any` – stattdessen exakter Typ oder `unknown`.
- Keine Magic Numbers – als benannte Konstante auslagern.
- Typen und Rückgabewerte explizit angeben.

### Namensgebung
- Funktionen: `camelCase` → `function getUser()`
- Klassen / Interfaces / Typen: `PascalCase` → `interface User`
- Konstanten: `UPPER_CASE` → `const MAX_RETRIES = 3`

### Imports
Gruppieren in der Reihenfolge: Standard, Dritt-Pakete, lokal.

### Kommentare
TSDoc für jede Funktion & Methode – **immer auf Englisch** geschrieben.

```typescript
/**
 * Returns the user.
 * @param id ID of the user.
 * @returns The found user.
 */
function getUser(id: string): User {
  return findUser(id);
}
```

### Clean Code
- Lesbare Bedingungen: `if (isUserActive)` statt `if (x)`.
- HTML in eigene Render-Funktionen auslagern, nicht inline verstreuen.

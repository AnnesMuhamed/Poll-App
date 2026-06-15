# Checkliste Poll-App

Diese Checkliste hält die Anforderungen (User Stories) und Code-Conventions
des Projekts fest. Sie wird Schritt für Schritt während der Entwicklung
abgehakt. Aktuell steht nur das Projektgerüst – noch nichts umgesetzt.

## User Story 1 – Bald endende Umfragen
- [ ] Über der allgemeinen Umfragen-Liste werden "bald endende" Umfragen angezeigt.
- [ ] Die Umfragen werden chronologisch nach Enddatum sortiert (frühestes Ende zuerst).

## User Story 2 – Übersicht aller Umfragen
- [ ] Auf dem Homescreen werden die Umfragen angezeigt.
- [ ] Ein Reiter wechselt zwischen laufenden und abgeschlossenen Umfragen.
- [ ] Jede Umfrage zeigt: Titel, kurzen Beschreibungstext, Deadline.

## User Story 3 – Neue Umfrage erstellen
- [ ] Auf dem Homescreen gibt es einen "New Survey" Button.
- [ ] Klick öffnet einen Dialog / ein Modal zur Erstellung.
- [ ] Klare Trennung von Pflichtangaben (Titel, Antwortoptionen) und
      optionalen Angaben (Beschreibung, Deadline).
- [ ] Pflichtfelder sind gekennzeichnet und werden validiert.

## User Story 4 – Umfrage öffnen
- [ ] Klick auf eine Umfrage öffnet eine Detailansicht.
- [ ] Detailansicht zeigt: Fragestellung, Antwortoptionen, Zusatzinfos, Auswertung.
- [ ] Beendete Umfragen sind nicht mehr klickbar und unter "Past Survey" gelistet.

## User Story 5 – Abstimmen mit Live-Auswertung
- [ ] In der Umfrageansicht kann per Klick auf eine Option abgestimmt werden.
- [ ] Während der Abstimmung wird die aktuelle Auswertung angezeigt.
- [ ] Auswertung befindet sich rechts neben der Abstimmung (Desktop-Layout).
- [ ] Ergebnisse aktualisieren sich dynamisch nach einer abgegebenen Stimme.

## Code Conventions
- [ ] Coding Konvention für HTML eingehalten (`docs/CONVENTIONS.md`).
- [ ] Coding Konvention für TypeScript eingehalten (`docs/CONVENTIONS.md`).

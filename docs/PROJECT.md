# Hesselink87 Beta — technische Projektdokumentation

## Zweck

Hesselink87 Beta ist die aktiv weiterentwickelte Trainings-App der Hesselink87-Reihe. Sie ist eine mobile PWA für Trainingsplanung, geführte Workouts, Progression, Historie, Dashboard-Auswertungen, Backup/Restore und individuelle Plananpassung.

## Source-of-Truth-Regel

- Dieses Dokument ist die zentrale technische Projektdokumentation.
- Das zugehörige Notion-Dokument `Hesselink87 App updates` ist die Product Source of Truth für Feedback, Bugs, Wünsche, Produktentscheidungen und aktuellen Produktstatus.
- `CHANGELOG.md` enthält historische technische Änderungen und wird nicht standardmäßig vollständig gelesen.
- Der aktuelle Code ist maßgeblich dafür, was tatsächlich implementiert ist.

## Architektur

Die App ist eine weitgehend statische HTML/CSS/JavaScript-PWA mit zentraler Anwendung in `index.html`.

Wichtige Dateien und Bereiche:

- `index.html` — Hauptanwendung und wesentliche Logik/UI
- `sw.js` — Service Worker / Offline-Verhalten / Cache
- `manifest.webmanifest` — PWA-Metadaten
- `tests/` — Regressionstests
- `CHANGELOG.md` — technische Historie

## Produktprinzipien

- Mobile Nutzung im Gym steht im Vordergrund.
- Trainingshistorie und persönliche Daten dürfen bei Planänderungen nicht versehentlich verschwinden oder unzugänglich werden.
- Planänderung und echter Split-/Planwechsel sind technisch zu unterscheiden, damit Historienlinien korrekt bleiben.
- Progressionsvorschläge sollen unterstützen, nicht automatisch Training erzwingen.
- Deload-/Stagnationshinweise dürfen den Plan nicht selbstständig verändern.
- Anfänger sollen ohne unnötigen Setup-Aufwand starten können.

## Datenhaltung und Migration

Die App speichert Nutzerdaten lokal im Browser. Änderungen am Datenmodell müssen bestehende Daten und Backups berücksichtigen.

Besonders sensibel:

- Trainingshistorie
- Planversionen / Plan-Linien
- Übungsnamen und Übungszuordnung
- Backup/Restore
- Wochenziel und Setup-Einstellungen
- Migration älterer lokaler Datenstände

Vor strukturellen Änderungen immer prüfen, ob alte Daten weiterhin lesbar sind und ob bestehende Backups importiert werden können.

## PWA / iOS

- Die App soll nach mindestens einem Online-Start auch offline aus dem Home-Screen funktionieren.
- Änderungen am Service Worker müssen Cache-Invalidierung und Update-Verhalten berücksichtigen.
- iOS-Hintergrund- und Speichergrenzen nicht durch vermeintliche Web-Lösungen umgehen oder falsch dokumentieren.
- Touchflächen und mobile Lesbarkeit sind zentrale Qualitätskriterien.

## Tests

- Relevante Regressionstests vor Abschluss jeder Änderung ausführen.
- Neue Logik nach Möglichkeit mit Tests absichern.
- Keine feste Testanzahl in dauerhaften Agent-Anweisungen dokumentieren.
- Besonders absichern: Datenmigration, Planänderungen, Historienzuordnung, Progression, Datum, Backup/Restore, Offline-Verhalten und Dashboard-Regeln.

## Deployment

Die aktive Beta wird über GitHub Pages ausgeliefert. Version und Cache-Stand immer aus dem aktuellen Code ableiten. `CHANGELOG.md` darf historische Versionsstände enthalten, ist aber keine Quelle für den aktuell auszuliefernden Wert.

## Legacy-Repository

`chrisball1084-pixel/Hesselink87` ist eine ältere, deutlich kleinere Codebasis und nicht die primäre Entwicklungsquelle. Neue Features und Notion-Sync-Arbeit sollen standardmäßig gegen `Hesselink87-beta` erfolgen.

Die alte App kann weiterhin relevant sein, um frühere lokale Datenstände zu prüfen. Sie darf deshalb nicht blind gelöscht oder überschrieben werden.

## Sicherheitsregeln

- Keine API-Keys, Tokens, Passwörter oder sonstige Secrets in Git oder Notion speichern.
- Persönliche Trainingsdaten nicht unnötig ins Repository kopieren.
- Backups mit echten Nutzerdaten nur gezielt und bewusst behandeln.

## Notion-Sync-Workflow

Der Befehl **„Notion Sync durchführen“** bedeutet:

1. `AGENTS.md` bzw. `CLAUDE.md` und dieses Dokument lesen.
2. In Notion primär `CURRENT STATE`, `INBOX`, `OPEN`, `WAITING FOR ME` und relevante `PRODUCT DECISIONS` lesen.
3. Historische Notion-Implementierungsseiten und `CHANGELOG.md` nur bei tatsächlichem Bedarf lesen.
4. Neue Anforderungen gegen den aktuellen Beta-Code prüfen.
5. Bug, Feature, Verbesserung, Frage und echte Nutzerentscheidung unterscheiden.
6. Eindeutig definierte Änderungen möglichst klein implementieren.
7. Relevante Tests ausführen.
8. Dieses Dokument nur bei dauerhaft relevanten technischen Änderungen aktualisieren.
9. Notion Current State/Open/Waiting/Changelog aktualisieren und abgearbeitete Inbox leeren.
10. Abschließend Änderungen, Tests und offene Nutzerentscheidungen kurz berichten.

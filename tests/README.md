# Tests

Es gibt zwei Testläufe.

## 1. Trainingslogik (schnell, ohne Browser)

Prüft die reinen Regeln – Sätze, Volumen, Zielbereiche, Progression nach oben und unten, Übungsnotiz, Plan-Linie, Backup-Prüfungen und Datumsformate – direkt gegen den Logik-Block in `index.html`. Läuft in unter einer Sekunde und braucht weder Playwright noch Chrome.

```powershell
node tests\logik.cjs
```

Erwartete Ausgabe:

```text
PASS: Trainingslogik – Sätze, Volumen, Zielbereiche, Progression, Notiz, Plan-Linie, Backup, Datum
```

Zusätzlich wird geprüft, dass der Logik-Block sauber bleibt: kein Zugriff auf das Dokument, auf localStorage oder auf globalen Zustand der Oberfläche. Neue Funktionen in diesem Block stehen dem Test automatisch zur Verfügung.

## 2. Oberfläche und Abläufe (Browser)

Der Test startet die App lokal, emuliert mobile Viewports und prüft Backup/Wiederherstellung einschließlich älterer Live-v3-Dateien, Vorlagen und individuelle Onboarding-Pläne, zusätzliche Tagesübungen, paralleles Öffnen und Schließen mehrerer Übungen, den getrennten Übungstausch, übungsbezogene Vorwerte, Setup-Akkordeons, persistente Themes, Dashboard-Rekorde und -Planbearbeitung, Volumentrend, kompakte Historienkarten, fortlaufende Split-Rotation sowie zentrale Trainings- und Historienabläufe.

Zusätzlich wird geprüft, dass eine Planbearbeitung die Vorwerte nicht versteckt: Ein Übungstausch im Setup erzeugt eine neue Planversion, behält aber die Plan-Linie, sodass **Letztes Training** sichtbar bleibt; ein echter Splitwechsel trennt die Historie weiterhin.

Ebenfalls geprüft wird die Offline-Fähigkeit: Die App muss sich ohne Empfang öffnen lassen, ein begonnener Entwurf muss erhalten bleiben, Eingaben müssen weiter speicherbar sein, und ein zweites Öffnen darf nicht in einer Neulade-Schleife enden.

Geprüft werden außerdem die beiden Dashboard-Karten **Worauf du achten kannst** und **Monatsrückblick**: Sie bleiben verborgen, solange es nichts zu melden gibt, erscheinen bei Plateau oder Leistungsabfall, schlagen eine leichtere Woche erst ab zwei betroffenen Übungen vor – und dürfen den Trainingsplan dabei niemals selbst verändern.

Geprüft werden außerdem die Übungsnotiz, die mit ihrem Datum ins nächste Training mitwandert und ohne Inhalt nur als Knopf erscheint, sowie die Empfehlung, das Gewicht zu reduzieren, wenn zweimal hintereinander der Zielbereich unterschritten wurde.

Voraussetzungen: Node.js, Playwright und ein installiertes Google Chrome. Falls Chrome an einem anderen Ort liegt, kann der Pfad über `PLAYWRIGHT_CHROME` gesetzt werden.

```powershell
$env:NODE_PATH = "Pfad\zu\node_modules"
node tests\regression.cjs
```

Erwartete Ausgabe:

```text
PASS: Backup v5/Live-v3, Onboarding, Zusatzübungen, Dashboard-Plan, Historie, Themes und Mobile-Flows
```

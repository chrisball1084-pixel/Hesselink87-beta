# Regressionstest

Der Test startet die App lokal, emuliert mobile Viewports und prüft Backup/Wiederherstellung einschließlich älterer Live-v3-Dateien, Vorlagen und individuelle Onboarding-Pläne, zusätzliche Tagesübungen, paralleles Öffnen und Schließen mehrerer Übungen, den getrennten Übungstausch, übungsbezogene Vorwerte, Setup-Akkordeons, persistente Themes, Dashboard-Rekorde und -Planbearbeitung, Volumentrend, kompakte Historienkarten, fortlaufende Split-Rotation sowie zentrale Trainings- und Historienabläufe.

Zusätzlich wird geprüft, dass eine Planbearbeitung die Vorwerte nicht versteckt: Ein Übungstausch im Setup erzeugt eine neue Planversion, behält aber die Plan-Linie, sodass **Letztes Training** sichtbar bleibt; ein echter Splitwechsel trennt die Historie weiterhin.

Ebenfalls geprüft wird die Offline-Fähigkeit: Die App muss sich ohne Empfang öffnen lassen, ein begonnener Entwurf muss erhalten bleiben, Eingaben müssen weiter speicherbar sein, und ein zweites Öffnen darf nicht in einer Neulade-Schleife enden.

Voraussetzungen: Node.js, Playwright und ein installiertes Google Chrome. Falls Chrome an einem anderen Ort liegt, kann der Pfad über `PLAYWRIGHT_CHROME` gesetzt werden.

```powershell
$env:NODE_PATH = "Pfad\zu\node_modules"
node tests\regression.cjs
```

Erwartete Ausgabe:

```text
PASS: Backup v5/Live-v3, Onboarding, Zusatzübungen, Dashboard-Plan, Historie, Themes und Mobile-Flows
```

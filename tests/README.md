# Regressionstest

Der Test startet die App lokal, emuliert mobile Viewports und prüft Backup/Wiederherstellung einschließlich älterer Live-v3-Dateien, Vorlagen und individuelle Onboarding-Pläne, Setup-Akkordeons, persistente Themes, Dashboard-Rekorde und -Planbearbeitung, Volumentrend, kompakte Historienkarten, fortlaufende Split-Rotation sowie zentrale Trainings- und Historienabläufe.

Voraussetzungen: Node.js, Playwright und ein installiertes Google Chrome. Falls Chrome an einem anderen Ort liegt, kann der Pfad über `PLAYWRIGHT_CHROME` gesetzt werden.

```powershell
$env:NODE_PATH = "Pfad\zu\node_modules"
node tests\regression.cjs
```

Erwartete Ausgabe:

```text
PASS: Backup v5/Live-v3, Onboarding, Dashboard-Plan, Historien-Akkordeon, Themes und Mobile-Flows
```

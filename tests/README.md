# Regressionstest

Der Test startet die App lokal, emuliert mobile Viewports und prüft Backup/Wiederherstellung sowie zentrale Trainings-, Historien- und Setup-Abläufe.

Voraussetzungen: Node.js, Playwright und ein installiertes Google Chrome. Falls Chrome an einem anderen Ort liegt, kann der Pfad über `PLAYWRIGHT_CHROME` gesetzt werden.

```powershell
$env:NODE_PATH = "Pfad\zu\node_modules"
node tests\regression.cjs
```

Erwartete Ausgabe:

```text
PASS: Backup v5, v4-Kompatibilität und kritische Mobile-Flows
```

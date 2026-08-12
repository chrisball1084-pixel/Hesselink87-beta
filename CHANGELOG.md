# Hesselink87 – Änderungsprotokoll

## v1.1 Beta – lokal vorbereitet

### Was wurde verändert?

- Das Design wurde an die Hesselink Daily Coach App angeglichen.
- Eine kompakte Heute-Karte zeigt Wochenstand, letztes Training und Entwurfsstatus.
- Im Fokusmodus ist nur die aktuelle Übung vollständig geöffnet.
- Der aktuelle Satz wird hervorgehoben.
- Nach vollständiger Eingabe wechselt die App nach fünf Sekunden zum nächsten Satz.
- Nach dem letzten Satz wird die nächste Übung geöffnet.
- Vergangene Leistungen werden separat als „Letztes Training“ angezeigt.
- Gewichte aus dem letzten Training können bewusst übernommen werden.
- Planänderungen erfolgen in einem getrennten Planbearbeitungsmodus.
- Der Pausentimer berechnet die Restzeit anhand eines absoluten Endzeitpunkts.
- Das aktuelle Datum wird in lokaler Zeit statt über UTC erzeugt.
- Nur tatsächlich bearbeitete oder abgeschlossene Übungen werden als neues Workout gespeichert.
- Touchflächen und Beschriftungen wurden für die mobile Bedienung verbessert.

### Warum?

Die Änderungen reduzieren visuelle Komplexität, machen den nächsten Trainingsschritt klarer und verhindern, dass lediglich angezeigte Vorwerte versehentlich als neu absolviert gespeichert werden.

### Datenkompatibilität

Die vorhandenen `localStorage`-Schlüssel und historischen Workout-Daten bleiben unverändert kompatibel. Es gibt keine automatische Datenmigration oder Löschung.

### Getestet

- JavaScript-Syntaxprüfung
- Git-Diff-Prüfung
- mobiler Browser-Test bei 390 × 844 Pixeln
- Planbearbeitungsmodus
- automatischer Wechsel von Satz 1 zu Satz 2
- automatischer Wechsel zur nächsten Übung
- Entwurfsanzeige
- Speichern einer teilweise absolvierten Einheit
- Kontrolle, dass nur die tatsächlich bearbeitete Übung im Verlauf gespeichert wird
- Verlauf und Volumenberechnung


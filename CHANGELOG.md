# Hesselink87 – Änderungsprotokoll

## v1.1 Beta – Testpaket 2

### Was wurde verändert?

- Das Design wurde an die Hesselink Daily Coach App angeglichen.
- Eine kompakte Heute-Karte zeigt Wochenstand, letztes Training und Entwurfsstatus.
- Im Fokusmodus ist nur die aktuelle Übung vollständig geöffnet.
- Der aktuelle Satz wird hervorgehoben.
- Die Satzführung beginnt bei jeder neuen Übung mit dem Warm-up.
- Nach vollständiger Eingabe wechselt die App nach fünf Sekunden zum nächsten Satz.
- Nach Satz 2 bleibt die Übung geöffnet: Der Nutzer kann sie bewusst abschließen oder einen optionalen dritten Satz ergänzen.
- Erst „Übung abgeschlossen“ oder das Öffnen der nächsten Übung klappt die aktuelle Übung ein.
- Vergangene Leistungen werden separat als „Letztes Training“ angezeigt.
- Gewichte aus dem letzten Training können bewusst übernommen werden.
- Planänderungen erfolgen in einem getrennten Planbearbeitungsmodus.
- Der Pausentimer berechnet die Restzeit anhand eines absoluten Endzeitpunkts.
- Das aktuelle Datum wird in lokaler Zeit statt über UTC erzeugt.
- Nur tatsächlich bearbeitete oder abgeschlossene Übungen werden als neues Workout gespeichert.
- Touchflächen und Beschriftungen wurden für die mobile Bedienung verbessert.
- Die Satzzeilen sind auf kleinen iPhones stabiler und bieten mehr Platz für dreistellige Gewichte und Dezimalwerte.
- `touch-action: manipulation` verhindert unbeabsichtigtes Doppeltipp-Zoomen auf den Plus-/Minus-Tasten.
- Im Planbearbeitungsmodus können Übungen über eine durchsuchbare, nach Muskelgruppen filterbare Bibliothek ausgetauscht werden.
- Acht realistische Beta-Trainingseinheiten können als Demo-Daten geladen werden.
- Beta-Historie, Entwürfe und Pläne können unabhängig von der Live-App zurückgesetzt werden.

### Warum?

Die Änderungen reduzieren visuelle Komplexität, machen den nächsten Trainingsschritt klarer und verhindern, dass lediglich angezeigte Vorwerte versehentlich als neu absolviert gespeichert werden.

### Datenkompatibilität

Die Beta verwendet weiterhin eigene `localStorage`-Schlüssel. Historische Workout-Daten bleiben unverändert; vorhandene Planübungen erhalten lediglich eine stabile Übungs-ID. Demo-Laden oder Zurücksetzen erfolgt nur nach ausdrücklicher Bestätigung.

### Getestet

- JavaScript-Syntaxprüfung
- Git-Diff-Prüfung
- mobiler Browser-Test bei 390 × 844 Pixeln
- Planbearbeitungsmodus
- automatischer Wechsel von Warm-up zu Satz 1 und von Satz 1 zu Satz 2
- bewusstes Abschließen nach Satz 2 und optionaler Satz 3
- Start der nächsten Übung beim Warm-up
- Übungsbibliothek und Übungsaustausch
- Demo-Daten laden und Beta-Daten zurücksetzen
- Entwurfsanzeige
- Speichern einer teilweise absolvierten Einheit
- Kontrolle, dass nur die tatsächlich bearbeitete Übung im Verlauf gespeichert wird
- Verlauf und Volumenberechnung

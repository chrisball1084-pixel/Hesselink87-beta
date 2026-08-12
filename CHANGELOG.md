# Hesselink87 – Änderungsprotokoll

## v1.1 Beta – Testpaket 4

### Was wurde verändert?

- **Gewichte übernehmen** kopiert jetzt zusätzlich das Warm-up-Gewicht aus der letzten passenden Einheit.
- Die Anzahl der Arbeitssätze aus der letzten Einheit wird beim nächsten Workout automatisch wieder bereitgestellt.
- Beim manuellen Wechsel zu einer anderen Übung bleibt eine noch nicht abgeschlossene Übung geöffnet – geeignet für Supersätze und alternierende Übungen.
- Abgeschlossene Übungen werden weiterhin automatisch eingeklappt.
- Geöffnete Übungskarten werden im laufenden Entwurf gespeichert und nach einem Neuladen wiederhergestellt.

### Warum?

Supersätze sollen ohne unnötiges Auf- und Zuklappen funktionieren. Gleichzeitig sollen Warm-up und individuelle Satzanzahl beim nächsten Training weniger erneute Eingaben erfordern.

## v1.1 Beta – Testpaket 3

### Was wurde verändert?

- Arbeitssätze können ohne festes Limit über **Satz hinzufügen** ergänzt werden.
- Der jeweils letzte optionale Satz kann wieder entfernt werden; bei vorhandenen Eingaben erscheint eine Sicherheitsabfrage.
- Long-Press-Auswahl und Kontextmenüs auf Plus-/Minus-Tasten werden für iOS unterdrückt.
- Der Pausentimer speichert seinen absoluten Endzeitpunkt und läuft auch nach App-Wechsel oder Neuladen korrekt weiter.
- Verlauf, Volumen, Progression, Gewichtsübernahme und CSV-Export unterstützen dynamisch viele Sätze.
- Bestehende Einheiten mit dem bisherigen Zwei-/Drei-Satz-Datenformat bleiben kompatibel.

### Warum?

Das Training soll unterschiedliche Programme und Satzanzahlen abbilden, ohne den einfachen Ablauf für Hesselink zu verschlechtern. Gleichzeitig werden versehentliche Eingaben leichter korrigierbar und der Timer robuster auf dem iPhone.

### Datenkompatibilität

Neue Einträge speichern zusätzlich eine dynamische Satzliste. Die bisherigen Felder bleiben für Kompatibilität erhalten. Historische Workouts werden nicht automatisch verändert oder gelöscht.

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

# Hesselink87 – Änderungsprotokoll

## v1.3 Beta – Testpaket 10

### Was wurde verändert?

- Im Bearbeitungsmodus einer bereits abgeschlossenen Übung heißt der Aktionsbutton jetzt eindeutig **Änderungen speichern**.
- Nach dem Speichern wird die korrigierte Übung wieder gesperrt und automatisch zugeklappt.
- Die App springt anschließend zurück zu der Übung, an der das laufende Training vor der Korrektur fortgesetzt wurde.
- Noch ausstehende automatische Satzsprünge werden beim Bearbeiten und Speichern verworfen; dadurch kann sich die korrigierte Übung nicht verzögert erneut öffnen.
- Der Rücksprung erfolgt ohne konkurrierende Scrollanimation direkt an die zuletzt aktive Stelle.
- Falls keine vorher aktive Übung verfügbar ist, wird die nächste noch nicht abgeschlossene Übung geöffnet.
- Der angeheftete Pausentimer erhält einen dezenten warmen Farbakzent und sitzt als kompakte Leiste am unteren Bildschirmrand.
- Die Timerleiste bleibt mit Abstand direkt oberhalb von **Training beenden** und **Reset**; zusätzlicher Scrollraum verhindert, dass die letzten Inhalte verdeckt werden.

### Datenkompatibilität

Das bestehende Trainings-, Satz- und Entwurfsformat bleibt unverändert. Die Anpassungen betreffen ausschließlich Bedienlogik, Navigation und Darstellung.

### Zu testen

- eine abgeschlossene Übung öffnen und **Übung bearbeiten** wählen
- Werte verändern und den Button **Änderungen speichern** prüfen
- nach dem Speichern: korrigierte Übung zugeklappt und wieder gesperrt
- automatischer Rücksprung zur zuvor aktiven Übung
- Pausentimer im laufenden Training unten oberhalb der Abschlussbuttons prüfen

## v1.3 Beta – Testpaket 9

### Was wurde verändert?

- **Satz hinzufügen** öffnet kein Zahlenfeld und keine iPhone-Tastatur mehr.
- Der neue Arbeitssatz wird weiterhin markiert, ohne ein Eingabefeld zu fokussieren.
- Das Gewicht des unmittelbar vorherigen Arbeitssatzes wird automatisch in den neuen Satz übernommen.
- Die Wiederholungen bleiben bewusst leer und müssen für den tatsächlich absolvierten Satz erfasst werden.
- Der offene Aktionsbutton heißt jetzt **Übung abschließen**. Erst nach dem Klick zeigt er den Status **Übung abgeschlossen** an.
- Beim Wiederöffnen einer abgeschlossenen Übung sind Gewichte, Wiederholungen und Satzsteuerung zunächst gesperrt.
- **Übung bearbeiten** entsperrt die Werte bewusst; **Übung erneut abschließen** speichert den bearbeiteten Zustand und sperrt ihn wieder.
- Der Abschlussstatus und der Trainingsfortschritt bleiben während der Korrektur erhalten.
- Der angeheftete Pausentimer berücksichtigt die obere iPhone-Sicherheitszone und bleibt mit Abstand unter Statusleiste und Navigation.

### Datenkompatibilität

Das bestehende Satz- und Trainingsdatenformat bleibt unverändert. Ein automatisch übernommenes Gewicht wird wie eine normale Eingabe im laufenden Entwurf gespeichert.

### Zu testen

- Satz 3 und Satz 4 über **Satz hinzufügen** anlegen
- keine automatisch geöffnete Tastatur
- Markierung des neu angelegten Satzes
- korrekt übernommenes Gewicht aus dem jeweils vorherigen Satz
- leeres Wiederholungsfeld
- Wechsel von **Übung abschließen** zu **Übung abgeschlossen** und gesetzter Abschlussstatus
- abgeschlossene Übung zunächst schreibgeschützt öffnen
- Bearbeitungsmodus aktivieren, Werte ändern und erneut abschließen
- angehefteten Pausentimer unterhalb von iPhone-Statusleiste und Navigation prüfen

## v1.3 Beta – Testpaket 8

### Was wurde verändert?

- **Gewichte übernehmen** kopiert weiterhin Warm-up und Arbeitssatzgewichte, öffnet aber kein Zahlenfeld und keine iPhone-Tastatur mehr.
- Nach der Übernahme ist die Warm-up-Zeile statt Satz 1 markiert.
- Der Abschlussbildschirm führt über **Zur Historie** direkt zur gespeicherten Einheit; die Trainingsansicht öffnet sich nicht erneut.
- Der Menüpunkt **Verlauf** heißt jetzt durchgängig **Historie**; die Volumengrafik ist als **Volumenentwicklung** bezeichnet.

### Datenkompatibilität

Die Änderungen betreffen ausschließlich Fokussteuerung und Navigation. Trainingsdaten, Entwürfe, Pläne und historische Einheiten behalten ihre bisherigen Formate.

### Getestet

- Gewichtsübernahme inklusive Warm-up und Arbeitssätzen
- kein fokussiertes Zahlenfeld nach der Übernahme
- aktive Warm-up-Zeile statt Satz 1
- Trainingsabschluss, Erfolgsbildschirm und Navigation zur Historie
- mobile Browser-Tests bei 390 × 844 und 320 × 700 Pixeln
- kein horizontales Überlaufen mit der Bezeichnung **Historie**

## v1.3 Beta – Testpaket 7

### Was wurde verändert?

- Die Übungsbibliothek ist in klar erkennbare Muskelgruppen mit eigenen Überschriften gegliedert.
- Abgeschlossene Übungen lassen sich wieder öffnen und korrigieren, ohne ihren Abschlussstatus zu verlieren.
- Beim Hinzufügen einer weiteren Übung bleiben abgeschlossene Karten geschlossen; nach der Auswahl wird gezielt zur neuen Übung gescrollt.
- Der Pausentimer ist als gut sichtbares, mitlaufendes Feld in den Trainingsfluss integriert.
- Nach dem Abschluss einer Übung startet automatisch eine zweiminütige Pause. Zwischen Sätzen lässt sich dieselbe Pause weiterhin manuell starten und jederzeit abbrechen.
- Der Abschlussdialog nennt offene Übungen verständlich und erklärt ausdrücklich, dass sie nicht automatisch als abgeschlossen markiert werden.

### Datenkompatibilität

Trainingspläne, laufende Entwürfe, Timer-Endzeitpunkt und historische Workouts behalten ihre bisherigen Datenformate.

### Getestet

- JavaScript-Syntax und Git-Diff-Prüfung
- gruppierte Bibliothek mit Suche und Muskelgruppenfilter
- Wiederöffnen und Bearbeiten abgeschlossener Übungen
- Hinzufügen einer sechsten Übung ohne unerwartetes Aufklappen
- automatischer und manueller 2-Minuten-Timer inklusive Abbruch und Wiederherstellung
- verständliche Abschlusswarnung bei offenen Übungen
- mobile Browser-Tests bei 390 × 844 und 320 × 700 Pixeln

## v1.2 Beta – Testpaket 6

### Was wurde verändert?

- In der Planbearbeitung öffnet ein Tipp auf den Übungsnamen direkt die Übungsbibliothek; die freie Texteingabe bleibt dort als bewusste Option erhalten.
- Lange Übungsnamen wachsen automatisch auf mehrere Zeilen und bleiben dadurch auch auf kleinen iPhones vollständig lesbar.
- Bei Push / Pull / Legs stehen alle drei Trainingstage kompakt in einer Zeile.
- Das Suchfeld der Übungsbibliothek verwendet explizit 16 Pixel Schriftgröße, damit iOS beim Fokussieren nicht in die Seite hineinzoomt.
- Datum, Körpergewicht und Energie sind in einem kompakten, einklappbaren Session-Bereich zusammengefasst. Die Zusammenfassung bleibt nach dem Einklappen sichtbar.

### Datenkompatibilität

Die Änderungen betreffen Darstellung und Bedienung. Trainingspläne, laufende Entwürfe und historische Workouts behalten ihr bisheriges Datenformat.

### Getestet

- JavaScript-Syntax und Git-Diff-Prüfung
- mobile Browser-Tests bei 390 × 844 und 320 × 700 Pixeln
- Übungsauswahl und freie Eingabe in der Planbearbeitung
- mehrzeilige Übungsnamen ohne Abschneiden
- dreispaltige PPL-Tagesauswahl ohne horizontales Überlaufen
- Suchfeld ohne iOS-Schriftgrößen-Zoom
- Ein-/Ausklappen der Session-Daten inklusive Werterhalt

## v1.2 Beta – Testpaket 5

### Was wurde verändert?

- Eine neue **Übersicht** zeigt das nächste sinnvolle Training, Wochenfortschritt, Gesamtworkouts, Gesamtvolumen und den aktuellen Trainingsplan.
- Trainingstage lassen sich direkt aus dem Dashboard öffnen oder fortsetzen.
- Ein dauerhafter Menüpunkt **Setup** wurde ergänzt.
- Drei Trainingsvorlagen stehen bereit: **Ganzkörper · 2 Tage**, **Push / Pull / Legs · 3 Tage** und **Upper / Lower · 4 Tage**.
- Tagesauswahl, Wochenziel, Verlauf-Filter und App-Untertitel passen sich dynamisch an den gewählten Split an.
- Ein Splitwechsel erfolgt nur nach Sicherheitsabfrage und weist ausdrücklich auf laufende Trainingsentwürfe hin.
- Angepasste Vorlagen werden im Setup als individuell angepasster Plan gekennzeichnet.
- Plan-Metadaten und eine Planversions-ID trennen Leistungsübernahmen verschiedener Splits voneinander.
- Backup, Import und Beta-Reset berücksichtigen die neuen Split-Einstellungen.

### Datenkompatibilität

Bestehende Zwei-Tage-Pläne werden automatisch als bisheriges Ganzkörper-Setup übernommen. Historische Workouts werden beim Splitwechsel nicht verändert oder gelöscht. Ein neuer Split erhält eine eigene Planversions-ID, damit alte Day-1-/Day-2-Daten nicht irrtümlich als Vorwerte eines anderen Splits erscheinen.

### Getestet

- JavaScript-Syntax und Git-Diff-Prüfung
- Dashboard und dynamische Navigation
- 2er-, 3er- und 4er-Split inklusive Speicherung nach Neuladen
- Abbruch und Bestätigung eines Splitwechsels
- Warnung bei laufendem Trainingsentwurf
- Erhalt historischer Workouts nach Splitwechsel
- Trennung der Vorwerte verschiedener Planversionen
- mobile Browser-Tests bei 390 × 844 und 320 × 700 Pixeln
- kein horizontales Überlaufen bei vier Hauptmenüpunkten und fünf Verlauf-Filtern
- keine Browserfehler

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

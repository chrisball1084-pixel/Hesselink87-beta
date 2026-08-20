# Hesselink87 – Änderungsprotokoll

## v1.3 Beta – Testpaket 34 · Einstieg für Anfänger geöffnet (App-Version 936, lokal, noch nicht veröffentlicht)

### Was wurde verändert?

Drei Punkte aus dem Feedback-Eingang, alle in der Ersteinrichtung.

**Verständlicherer erster Schritt.** Aus „Hell oder dunkel?" mit dem knappen Satz *„Automatisch folgt der Einstellung deines iPhones"* wurde: **„Wie soll die App aussehen?"** – *Mit „Automatisch" übernimmt die App, was auf deinem iPhone eingestellt ist – damit machst du nichts falsch. Ändern kannst du das jederzeit im Setup.*

**Einmal pro Woche ist jetzt wählbar.** Bisher gab es nur 2×, 3× oder 4×. Neu stehen **1× bis 6×** zur Wahl. Für Anfänger und Wiedereinsteiger ist einmal pro Woche oft der ehrlichste Start – und wer nur diese Option nicht findet, fängt gar nicht erst an. Der begleitende Text sagt das jetzt auch: *„Wähle ein Ziel, das du wirklich schaffst – lieber einmal pro Woche verlässlich als viermal auf dem Papier."*

**Drei verschiedene Workouts müssen nicht Push/Pull/Legs sein.** Neue Vorlage **3× Ganzkörper (A / B / C)**: drei Ganzkörpereinheiten mit unterschiedlichen Übungen. Jedes Training deckt den ganzen Körper ab – fällt eine Einheit aus, fehlt keine Muskelgruppe. Damit muss niemand mehr jede Übung einzeln zusammenstellen, nur weil er drei abwechslungsreiche Ganzkörpertage möchte.

### Welches Nutzerproblem löst das?

Alle drei Punkte betreffen den allerersten Kontakt mit der App. Wer dort keine passende Option findet, richtet sich entweder etwas Falsches ein oder gibt auf. Betrifft nur Neukunden – für Hesselink ändert sich nichts.

### Datenkompatibilität

Keine Änderung. Nur Beschriftung, Auswahlumfang und eine zusätzliche Vorlage.

### Automatisiert getestet

- 1× und 5× pro Woche sind wählbar, die Auswahl umfasst sechs Optionen
- bei drei Workouts wird die Ganzkörper-Variante angeboten
- die Vorlage hat drei Einheiten, benannt als Ganzkörper A/B/C
- **neue allgemeine Absicherung:** Jede Vorlage darf ausschließlich Übungen aus der Bibliothek verwenden – gilt ab jetzt für alle Vorlagen, nicht nur die neue
- Sichtprüfung bei 320 × 700 und 390 × 844: kein Textüberlauf, Dialog passt vollständig ins Bild
- beide Testläufe grün

## v1.3 Beta – Testpaket 33 · Wiederholungsziel und ruhigerer Kartenkopf (App-Version 935, lokal, noch nicht veröffentlicht)

### Was wurde verändert?

**Ziel heute nennt jetzt auch die Wiederholungen.**

- Bisher stand dort nur dann etwas, wenn der Zielbereich ausgereizt war und ein höheres Gewicht anstand. Im Normalfall blieb die Karte stumm.
- Neu steht bei jeder Übung mit Vorgeschichte ein konkreter Vorschlag: **→ Ziel heute: 80 kg × 12 · 80 kg × 11** – gleiches Gewicht, **eine Wiederholung mehr pro Satz** als beim letzten Mal.
- Gedeckelt durch das obere Ende des Zielbereichs: Ist es erreicht, ist ohnehin das Gewicht dran und nicht noch eine Wiederholung. Dann erscheint weiterhin der Gewichtsvorschlag.
- Ruhig gehalten, weil dieser Hinweis auf fast jeder Karte steht. Er sitzt direkt über **Letztes Training** – Ziel oben, Referenz darunter.

**Der Kartenkopf ist aufgeräumt.**

- **↔ Tauschen** heißt jetzt **↔ Übung ändern** und steht klein, links und zurückhaltend direkt unter dem Übungsnamen. Die Übung zu wechseln ist ein Sonderfall, kein Hauptweg.
- Die **Jetzt**-Markierung im Kopf ist entfallen. Sie war erklärungsbedürftig, und die aktive Übung erkennt man ohnehin am Rahmen der Karte.

### Welches Nutzerproblem löst das?

Beides aus dem Feedback-Eingang. Der Wiederholungs-Vorschlag nimmt genau die Rechenarbeit ab, um die es im Kern geht: Der Nutzer soll im Gym sofort sehen, was heute dran ist, statt es sich aus der letzten Einheit herzuleiten.

### Datenkompatibilität

Keine Änderung. Es wurde nur anders angezeigt und beschriftet.

### Automatisiert getestet

- jeder Satz bekommt eine Wiederholung mehr, das Gewicht bleibt
- am oberen Ende des Zielbereichs wird nicht darüber hinaus vorgeschlagen
- ohne Zielbereich gibt es keine Deckelung, Gewicht in deutscher Schreibweise
- ohne Werte gibt es keinen Vorschlag
- ist die Obergrenze erreicht, bleibt es beim Gewichtsvorschlag
- der Knopf heißt **Übung ändern**, die **Jetzt**-Markierung ist nicht mehr vorhanden
- Sichtprüfung in Hell und Dunkel, Karte 24 Pixel kürzer als zuvor
- beide Testläufe grün

## v1.3 Beta – Testpaket 32 · Updates kommen sofort an (App-Version 934, lokal, noch nicht veröffentlicht)

### Was wurde verändert?

- **Gefunden bei der Live-Prüfung von Testpaket 31:** Die App lief dort noch mit Version 930, obwohl 933 längst ausgeliefert war.
- Ursache: GitHub Pages liefert die Seite mit **Cache-Control: max-age=600** aus, also zehn Minuten Browser-Cache. Der Service Worker holt zwar „Netz zuerst“, diese Netzanfrage bediente sich aber am HTTP-Cache und bekam die alte Fassung – und legte sie zusätzlich in seinen eigenen Speicher.
- Der Versionsabgleich der App kann das nicht bemerken: Die alte Datei meldet in sich stimmig ihre alte Nummer.
- Neu holt der Service Worker die Seite ausdrücklich am HTTP-Cache vorbei. Mit Empfang gewinnt damit immer die aktuelle Fassung; ohne Empfang bleibt es beim gespeicherten Stand.

### Einordnung

Die Verzögerung gab es **auch schon vor dem Service Worker** – der Browser cachte die Seite genauso. Neu war nur, dass der Service Worker die veraltete Fassung zusätzlich einlagerte und sie dadurch länger hielt. Der Zwischenspeicher heilt sich beim nächsten Start mit Empfang von selbst.

### Datenkompatibilität

Keine. Es wurde ausschließlich die Art geändert, wie die Programmdatei geladen wird.

### Automatisiert getestet

- Offline-Test unverändert grün: App startet ohne Empfang, Entwurf bleibt erhalten, Eingaben speicherbar, kein Neulade-Karussell
- beide Testläufe grün

## v1.3 Beta – Testpaket 31 · Abgetrennte Historie reparieren (App-Version 933, lokal, noch nicht veröffentlicht)

### Was wurde verändert?

Testpaket 30 hat die **Ursache** behoben – neue Einrichtungen trennen die Historie nicht mehr ohne Grund. Geräte, auf denen der Bruch bereits eingetreten war, blieben davon aber unberührt. Das holt dieses Paket nach.

- Beim Start prüft die App einmalig, ob die gesamte gespeicherte Historie zu einer Plan-Linie gehört, die es im aktuellen Plan nicht mehr gibt. Ist das so, wird sie wieder zugeordnet.
- **Nichts geschieht dabei unbemerkt:** Die App meldet ausdrücklich, wie viele Einheiten sie wieder zugeordnet hat.
- Die Regel ist bewusst eng gefasst – lieber nichts tun als falsch zusammenführen. Repariert wird nur, wenn es **überhaupt keine** passenden Einheiten gibt, **alle** verwaisten Einheiten aus **derselben** Linie stammen und ihre Trainingstage im aktuellen Plan noch existieren. Jeder abweichende Fall bleibt unangetastet.
- Es werden keine gespeicherten Einheiten verändert, nur die Zuordnung des Plans.

### Welches Nutzerproblem löst das?

Wer die Ersteinrichtung erneut durchlaufen hatte, sah bei allen Übungen „Noch keine Werte“ – obwohl die Historie vollständig vorhanden war. Nach einem einmaligen Öffnen der App ist der Bezug wiederhergestellt.

### Datenkompatibilität

Gespeicherte Einheiten bleiben unverändert. Angepasst wird ausschließlich die Plan-Linie in den Einstellungen (`planConfig.lineageId`).

### Automatisiert getestet

- eine vollständig abgetrennte Historie wird erkannt und wieder zugeordnet
- passt die Linie bereits, wird nichts verändert
- gibt es auch passende Einheiten, wird nichts verändert
- bei mehreren fremden Linien wird bewusst nichts zusammengeführt
- passen die Trainingstage nicht zum Plan, wird nichts angefasst
- die Meldung erscheint sichtbar und sprachlich korrekt (Einzahl/Mehrzahl)
- die Zuordnung wird dauerhaft gespeichert, die Vorwerte stehen danach wieder da
- Gegenprobe: Ohne die Reparatur schlagen beide Testläufe fehl
- beide Testläufe grün

## v1.3 Beta – Testpaket 30 · Plan-Linie und fehlende Wiederholungen (App-Version 932, lokal, noch nicht veröffentlicht)

### Was wurde verändert?

**Die Einrichtung trennt die Historie nicht mehr ohne Grund.**

- Von Chris gemeldet: Wer die Ersteinrichtung erneut durchläuft und dabei zwei Workouts behält, aber das Wochenziel von 2 auf 3 stellt, verlor sämtliche Vorwerte. **Gewichte übernehmen** und **Letztes Training** waren leer.
- Ursache war **nicht** die Umbenennung von Day 1/2 auf Ganzkörper A/B. Die Zuordnung läuft über den Tagesschlüssel und den Übungsnamen, beide unverändert. Ursache war die Plan-Linie aus Testpaket 24: Die Einrichtung vergab immer eine neue, auch wenn sich an der Struktur nichts änderte.
- Neu wechselt die Linie nur, wenn sich die **Tagesstruktur** wirklich ändert, also Anzahl oder Anordnung der Workouts. Ein anderes Wochenziel, andere Tagesnamen oder getauschte Übungen ändern nichts daran, dass Tag 1 weiterhin Tag 1 ist. Ein echter Splitwechsel trennt weiterhin.
- **Die Daten waren nie betroffen**, nur ihre Anzeige.

**Sanfte Nachfrage bei fehlenden Wiederholungen.**

- Steht in einem Satz ein Gewicht, aber keine Wiederholung, fragt die App beim Abschließen der Übung einmal nach und benennt die betroffenen Sätze. **Abschließen bleibt jederzeit möglich** – es ist ein Hinweis, keine Sperre. Wer nachtragen möchte, landet direkt im fehlenden Feld.
- Umgekehrt wird nicht gemahnt: Wiederholungen ohne Gewicht sind bei Körpergewichtsübungen normal.
- Anlass war Hesselinks echtes Backup, in dem am 17.08. genau das passiert ist.

### Datenkompatibilität

Keine Änderung am Datenformat. Die Korrektur der Plan-Linie wirkt nur auf künftige Einrichtungen; bereits getrennte Geräte werden dadurch nicht automatisch repariert.

### Automatisiert getestet

- Einrichtung mit gleicher Tagesstruktur behält die Plan-Linie, das neue Wochenziel wird trotzdem übernommen, die Vorwerte bleiben sichtbar
- echter Splitwechsel startet weiterhin eine neue Linie
- vollständig ausgefüllte Übung fragt nicht nach
- Gewicht ohne Wiederholungen fragt nach, benennt die Sätze, Abbrechen setzt den Fokus ins fehlende Feld
- trotzdem abschließen bleibt möglich
- Gegenproben für beide Änderungen
- beide Testläufe grün

## v1.3 Beta – Testpaket 29 · Stagnation, Deload-Vorschlag und Monatsrückblick (App-Version 930, lokal, noch nicht veröffentlicht)

### Was wurde verändert?

Zwei neue Karten im Dashboard. Beide bleiben **unsichtbar, solange es nichts zu sagen gibt.**

**Worauf du achten kannst**

- Erkennt pro Übung, ob es vorangeht, stillsteht oder zurückgeht – **über drei Einheiten**, nicht über eine. Eine einzelne schwache Einheit ist meist nur Tagesform und darf kein Plateau auslösen.
- Verglichen wird der aussagekräftigste Arbeitssatz: das schwerste Gewicht, bei gleichem Gewicht die meisten Wiederholungen. Mehr Gewicht **oder** mehr Wiederholungen gilt als Fortschritt.
- Gemeldet wird nur, was eindeutig ist. Bei schwankendem Bild bleibt die Karte still, statt Rauschen zu erzeugen.
- Formulierungen in einfacher Sprache, zum Beispiel: *Seit drei Einheiten unverändert. Versuch eine Wiederholung mehr – oder eine leichtere Woche.*
- **Deload-Vorschlag** erscheint erst, wenn **mindestens zwei** Übungen gleichzeitig stocken – dann ist es ein Muster und nicht bloß eine zähe Übung. Der Ton ist bewusst entlastend: *Das ist normal und kein Rückschritt.*
- **Der Plan wird dabei niemals von selbst verändert** (Briefing 15). Es ist ausschließlich ein Hinweis; ein automatisierter Test wacht darüber.

**Monatsrückblick**

- Einheiten, Volumen und neue Bestleistungen des laufenden Monats, jeweils mit dem Vormonat verglichen, dazu ein zusammenfassender Satz.

### Wo das steht – und wo nicht

Beides erscheint **ausschließlich im Dashboard**, nicht während des Trainings. Im Training bleibt die Oberfläche reduziert (Briefing 3): Dort steht weiterhin nur die unmittelbar handlungsrelevante Empfehlung für die Übung, die gerade dran ist.

### Datenkompatibilität

Keine Änderung. Beide Karten lesen ausschließlich die vorhandene Historie; es wird nichts geschrieben und kein Feld ergänzt.

### Automatisiert getestet

- Trend über drei Einheiten: Fortschritt bei mehr Gewicht, Fortschritt bei mehr Wiederholungen, Plateau bei Stillstand, Abfall bei Rückgang
- unter drei Einheiten und bei schwankendem Bild wird kein Trend behauptet
- unvollständige Werte erzeugen keinen Trend
- Deload erst ab zwei betroffenen Übungen, nicht bei einer, nicht wenn der Rest läuft
- **der Trainingsplan bleibt nach einem Deload-Vorschlag nachweislich unverändert**
- Monatsrückblick: Einheiten, Volumen, Bestleistungen, Vormonatsvergleich, Jahreswechsel, unbrauchbares Datum, Einzahl/Mehrzahl im Text
- ohne Auffälligkeiten und ohne Training im Monat bleiben beide Karten verborgen
- Sichtprüfung in Hell und Dunkel, kein horizontales Scrollen
- Gegenprobe: Ohne Trenderkennung schlagen beide Testläufe fehl
- beide Testläufe grün

## v1.3 Beta – Testpaket 28 · Trainingslogik von der Oberfläche getrennt (App-Version 929, lokal, noch nicht veröffentlicht)

### Was wurde verändert?

- Die reinen Rechen- und Regelfunktionen stehen jetzt in einem **eigenen, klar abgegrenzten Block** am Anfang von `index.html`, überschrieben mit **TRAININGSLOGIK**: Sätze und Volumen, Zielbereiche, Progression nach oben und unten, Übungsnotiz, Plan-Linie, Backup-Prüfungen und Datumsformate.
- Für diesen Block gilt eine feste Regel: **kein Zugriff auf das Dokument, auf localStorage oder auf den Zustand der Oberfläche.** Alles kommt als Parameter herein.
- Bewusst **keine zweite Datei**: `index.html` wird bei Updates mit `?_v=` am Browser-Cache vorbeigeladen. Eine separate `.js`-Datei hätte diesen Schutz nicht, sodass nach einem Update neue Oberfläche auf alte Logik treffen könnte. Die Ein-Datei-Architektur bleibt erhalten.
- **Neuer Test `tests/logik.cjs`**: prüft die Trainingslogik direkt, ohne Browser, in unter einer Sekunde. 34 Prüfungen. Er wacht außerdem darüber, dass der Block sauber bleibt, und erkennt neu hinzugefügte Funktionen automatisch.

### Welches Nutzerproblem löst das?

Für Hesselink unmittelbar keines – **das Verhalten der App ist unverändert.** Der Nutzen liegt in der Weiterentwicklung: Die geplanten Bausteine Stagnationserkennung, Deload-Vorschlag und Monatsreport sind Regelwerk, kein Bildschirm. Sie lassen sich jetzt in Sekunden prüfen statt über einen mehrminütigen Browserlauf, und ein Fehler in der Regel kann nicht mehr in der Oberfläche versteckt entstehen.

### Datenkompatibilität

Keine Änderung. Es wurde ausschließlich verschoben.

### Automatisiert getestet

- **Nachweis, dass nur verschoben wurde:** Zeilenvergleich vor und nach der Umstellung – null verlorene Codezeilen, die einzigen elf neuen Zeilen sind die Script-Klammer und der Kommentarkopf
- alle drei Script-Blöcke der Datei sind syntaktisch fehlerfrei
- keine doppelten Deklarationen zwischen Logik- und Oberflächenblock
- der Logik-Block enthält nachweislich keinen Dokument-, Speicher- oder Zustandszugriff
- 34 Prüfungen der Trainingslogik ohne Browser
- vollständige bestehende Regressionssuite grün

## v1.3 Beta – Testpaket 27 · Einstieg verständlicher (App-Version 928, lokal, noch nicht veröffentlicht)

### Was wurde verändert?

- **Der Ersteinstieg beginnt jetzt mit Hell oder Dunkel.** Drei Kacheln, **Automatisch** ist vorausgewählt und folgt der Systemeinstellung des iPhones. Änderbar bleibt es wie bisher jederzeit im Setup.
- **Die Frage nach der Anzahl der Workouts zeigt jetzt ihre Konsequenz.** Statt nur „1 / 2 / 3 / 4" steht unter jeder Option, wie sich die Workouts über die zuvor gewählten Trainingstage abwechseln würden – zum Beispiel bei drei Trainingstagen: *2 verschiedene Workouts · Woche 1: A · B · A → Woche 2: B · A · B*.
- Bleibt die Reihenfolge über die Wochen gleich, steht dort nur *Jede Woche: A · B · C* statt zweier identischer Zeilen. Bei einem einzigen Workout: *Jedes Mal dasselbe Workout · 3× pro Woche*.
- Die Einrichtung hat dadurch **fünf statt vier Schritte**.

### Welches Nutzerproblem löst das?

Aus dem Feedback vom 20.08.: Bei „dreimal pro Woche" wurde Push/Pull/Legs angezeigt, obwohl Ganzkörper A/B im Wechsel gewünscht war. Diese Option gab es technisch bereits – Schritt 1 fragt die Trainingstage, Schritt 3 die Anzahl verschiedener Workouts. Nur tippt man bei „3× pro Woche" reflexartig auch in Schritt 3 auf „3" und landet damit bei drei verschiedenen Einheiten. Die Vorschau macht den Unterschied jetzt sofort sichtbar; die zugrundeliegende Logik wurde nicht verändert.

### Datenkompatibilität

Keine. Es wurden ausschließlich Beschriftung und Ablauf der Ersteinrichtung geändert. Bestehende Nutzer sehen das Onboarding nicht erneut; Plan, Historie und Entwürfe sind nicht betroffen.

### Automatisiert getestet

- Einrichtung meldet fünf Schritte, Schritt 1 ist die Hell-/Dunkel-Wahl
- **Automatisch** ist ohne eigene Wahl vorausgewählt
- eine Wahl im Onboarding wirkt sofort auf die Darstellung
- Rotationsvorschau stimmt für 1, 2 und 3 Workouts bei drei Trainingstagen
- bei gleichbleibender Reihenfolge wird keine zweite Woche angezeigt
- Sichtprüfung bei 320 × 700 und 390 × 844 Pixeln: kein Textüberlauf, Dialog passt vollständig ins Bild
- vollständige bestehende Regressionssuite grün

## v1.3 Beta – Testpaket 26 · Übungsnotiz & Abwärts-Empfehlung (App-Version 927, lokal, noch nicht veröffentlicht)

### Was wurde verändert?

- **Notiz pro Übung, die ins nächste Training mitwandert.** Unter **Letztes Training** gibt es jetzt den Knopf **＋ Notiz fürs nächste Mal**. Was dort steht, erscheint beim nächsten Mal automatisch bei derselben Übung – mit dem Datum, an dem es geschrieben wurde, zum Beispiel **📌 Notiz vom 05.08.**
- Die Notiz **bleibt stehen**, bis sie geändert oder geleert wird. Wird sie unverändert übernommen, behält sie ihr ursprüngliches Datum; wird sie geändert, bekommt sie das aktuelle. Eine alte Notiz sieht dadurch nicht jede Woche wie frisch geschrieben aus.
- Ohne Notiz bleibt die Übungskarte unverändert ruhig: Statt eines Eingabefelds steht dort nur ein kleiner Knopf. Die Karte ist damit rund 160 Pixel kürzer als mit dauerhaft sichtbarem Feld.
- **Empfehlung jetzt auch nach unten.** Bisher schlug die App nur vor, das Gewicht zu erhöhen. Bleibt jemand **zweimal hintereinander** unter dem Zielbereich, kommt nun ein warm gehaltener Hinweis, zum Beispiel: *Zweimal unter 10 Wdh – nimm 77,5 kg und arbeite dich sauber hoch.*
- Bewusst erst ab der zweiten Einheit: Eine einzelne schwache Einheit ist meist nur Tagesform und darf keine Gewichtsreduktion auslösen.
- Gewichtsvorschläge stehen jetzt in deutscher Schreibweise (**82,5 kg** statt 82.5 kg). Das gilt auch für die bestehende Aufwärts-Empfehlung.

### Welches Nutzerproblem löst das?

Beides nimmt Hesselink Denkarbeit im Gym ab. Der Gedanke *„nächstes Mal die Sitzhöhe anders einstellen"* geht nicht mehr verloren, und er muss nicht selbst erkennen, wann ein Gewicht zu schwer für ihn ist.

### Datenkompatibilität

Rein additiv: Übungen im Trainingsverlauf können zusätzlich `exNote` und `exNoteDate` tragen. Bestehende Einträge ohne diese Felder funktionieren unverändert, ältere Backups bleiben importierbar. Eine geschriebene Notiz wird auch dann gespeichert, wenn zu der Übung keine Werte eingetragen wurden – damit sie nicht verlorengeht.

### Automatisiert getestet

- nach zwei zu schwachen Einheiten erscheint die Abwärts-Empfehlung mit konkretem Gewicht
- der Zielbereich stammt dabei aus dem aktuellen Plan, nicht aus dem alten Eintrag
- eine einzelne schwache Einheit löst sie nicht aus
- Notiz der letzten Einheit steht im nächsten Training, ausgewiesen mit ihrem Datum
- unveränderte Notiz behält ihr Datum, geänderte bekommt das heutige
- ohne Notiz zeigt die Karte nur den Knopf, kein Eingabefeld
- eine reine Notiz ohne eingetragene Werte geht beim Speichern nicht verloren
- Gegenproben: Ohne Abwärtslogik beziehungsweise ohne mitwandernde Notiz schlagen die Tests nachweislich fehl
- vollständige bestehende Regressionssuite grün

## v1.3 Beta – Testpaket 25 · Offline im Gym (App-Version 926, lokal, noch nicht veröffentlicht)

### Was wurde verändert?

- **Die App lässt sich jetzt auch ohne Empfang öffnen.** Bisher lag sie ausschließlich auf dem Server und wurde ausdrücklich nicht zwischengespeichert. Ohne Verbindung ließ sie sich deshalb gar nicht erst starten – die Trainingsdaten waren zwar sicher, aber unerreichbar.
- Ein Service Worker (`sw.js`) speichert die zuletzt erfolgreich geladene Fassung. Strategie: **Netz zuerst, Cache als Rückfall.** Mit Empfang kommt immer die frische Datei vom Server, der bestehende Versionsabgleich bleibt also voll wirksam. Ohne Empfang oder bei sehr langsamer Verbindung (über drei Sekunden) übernimmt die gespeicherte Fassung.
- **Schutz gegen Neulade-Schleifen.** Liefert der Cache ohne Empfang eine ältere Fassung als zuletzt gesehen, hätte der Versionsabgleich die App endlos neu geladen. Es gibt jetzt genau einen Versuch pro Sitzung; danach arbeitet die App mit der vorhandenen Fassung weiter.
- Ein Web-App-Manifest (`manifest.webmanifest`) und ein Icon (`icon.svg`) wurden ergänzt, damit **Zum Home-Bildschirm hinzufügen** sich wie eine eigenständige App verhält.
- Schlägt die Registrierung fehl, läuft die App unverändert wie bisher weiter.

### Welches Nutzerproblem löst das?

Trainiert Hesselink in einem Studio mit schlechtem Empfang, öffnete sich die App im Zweifel überhaupt nicht. Genau dann braucht er sie aber. Gewicht und Wiederholungen eintragen funktionierte schon immer ohne Verbindung – nur der Start nicht.

### Datenkompatibilität

Es werden keine Trainings-, Plan- oder Backupdaten berührt. Der Service Worker speichert ausschließlich die Programmdatei, nicht die Trainingsdaten; diese liegen unverändert im localStorage.

### Automatisiert getestet

- App startet ohne Empfang vollständig, inklusive Dashboard und Kopfzeile
- ein vor dem Verbindungsverlust begonnener Trainingsentwurf bleibt erhalten
- Eingaben lassen sich ohne Empfang weiter speichern
- zweites Öffnen ohne Empfang funktioniert ebenfalls – keine Neulade-Schleife
- Gegenprobe: Ohne `sw.js` schlägt der Offline-Test nachweislich fehl
- vollständige bestehende Regressionssuite grün

## v1.3 Beta – Testpaket 24 · Datenintegrität (App-Version 925, lokal, noch nicht veröffentlicht)

### Was wurde verändert?

- **Vorwerte überleben eine Planbearbeitung.** Bisher erhielt der Plan bei jeder Änderung eine neue Versions-ID. Da die Anzeige danach filtert, verschwanden nach dem Austausch einer einzigen Übung im Setup bei allen übrigen Übungen **Letztes Training** und **Gewichte übernehmen**, ebenso die Wochenzählung und der Volumentrend. Die Daten waren vorhanden, aber unsichtbar.
- Neu unterscheidet die App zwischen **Plan bearbeitet** und **Split gewechselt**. Eine zusätzliche Plan-Linie (`lineageId`) bleibt beim Bearbeiten von Übungen erhalten; nur ein echter Splitwechsel über Vorlage oder Onboarding startet eine neue Linie und trennt die Historie wie bisher bewusst ab.
- Vorwerte bleiben weiterhin **pro Trainingstag getrennt**. An diesem Verhalten ändert sich nichts.
- **Speichern kann den Trainingsfluss nicht mehr unterbrechen.** Ist der Gerätespeicher voll oder vom Browser gesperrt, erscheint ein Hinweis statt eines stillen Abbruchs mitten in der Eingabe. Der Hinweis erscheint höchstens alle zehn Sekunden.
- Der Versionsabgleich beim Start blockiert nicht mehr, wenn der Speicher nicht verfügbar ist. Die App startet dann trotzdem.

### Welches Nutzerproblem löst das?

Hesselink verliert nach einer Plananpassung nicht mehr den Bezug zur letzten Einheit. Genau diese Information – *welches Gewicht hatte ich letztes Mal* – ist der Kern der App für Trainingsanfänger.

### Datenkompatibilität

Es wird kein bestehendes Feld umbenannt oder entfernt. Gespeicherte Workouts erhalten zusätzlich `planLineageId`; ältere Einträge ohne dieses Feld greifen automatisch auf `planVersionId` zurück. Bestehende Backups bleiben unverändert importierbar.

### Automatisiert getestet

- vorhandene Leistung vor der Planbearbeitung sichtbar
- Übungstausch im Setup erzeugt eine neue Planversion, **behält** aber die Plan-Linie
- nach dem Übungstausch bleiben die Vorwerte der übrigen Übungen sichtbar
- ein echter Splitwechsel startet weiterhin eine neue Linie und trennt die Historie
- gesperrter Speicher: App läuft weiter, genau ein Hinweis statt Dauermeldung
- Gegenprobe: Der neue Test schlägt mit der alten Logik nachweislich fehl
- vollständige bestehende Regressionssuite grün

## v1.3 Beta – Testpaket 23 (lokal, noch nicht veröffentlicht)

### Was wurde verändert?

- Ein Tipp auf den Kopf beziehungsweise Namen einer Übung öffnet oder schließt im Trainingsmodus ausschließlich die Übungskarte.
- Der temporäre Austausch einer Übung ist jetzt eine klar getrennte Aktion über den kleinen Button **Tauschen** innerhalb der geöffneten Karte.
- Die feste Hauptnavigation und der iPhone-Sicherheitsbereich darüber besitzen in Hell- und Dunkelmodus einen vollständig deckenden Hintergrund. Beim Scrollen scheinen keine Inhalte mehr hindurch.
- Der Zielbereich rechts oben ist kompakter und verwendet eine kleinere Schrift, damit auch **10–15** auf schmalen iPhones vollständig sichtbar bleibt.
- **Letztes Training** und **Gewichte übernehmen** besitzen im hellen Design einen kontrastreicheren Hintergrund und lesbare Farben.
- Frühere Leistungen werden nun pro Übung aus dem letzten tatsächlich vorhandenen Historieneintrag ermittelt. Dadurch stehen **Letztes Training** und **Gewichte übernehmen** auch sofort zur Verfügung, wenn mehrere Übungen parallel geöffnet werden oder das jüngste Workout nur einen Teil der Übungen enthielt.

### Datenkompatibilität

Es werden keine Trainings- oder Backupdaten migriert. Die neue Suche liest ausschließlich die bestehende Historie genauer aus; Plan, Entwürfe und historische Einheiten bleiben unverändert.

### Automatisiert und visuell getestet

- Kartenkopf öffnet und schließt, ohne den Austauschdialog zu starten
- eigener **Tauschen**-Button öffnet den bestehenden Sicherheitsdialog
- zwei Übungen parallel geöffnet, beide mit sofort sichtbarer vorheriger Leistung
- unvollständiges jüngstes Workout greift für weitere Übungen auf den letzten passenden Historieneintrag zurück
- Zielbereich ohne Textabschnitt auf schmalem iPhone
- deckender Safe-Area-/Navigationshintergrund und lesbare Letztes-Training-Karte im Hellmodus

## v1.3 Beta – Testpaket 22 (lokal, noch nicht veröffentlicht)

### Was wurde verändert?

- Das Session-Datum wird bei einem neuen oder unvollständigen Entwurf robust mit dem lokalen Tagesdatum vorbelegt.
- Ein leeres beziehungsweise ungültiges Datumsfeld wird beim Öffnen des Trainings und vor dem Autosave erneut abgesichert.
- Datum, Körpergewicht und Energie/Schlaf verwenden im Session-Akkordeon dieselbe Label- und Feldhöhe, damit die Eingaben auf einer sauberen Grundlinie stehen.
- Bei eingeklappten Übungen wird der Zielbereich nicht mehr doppelt angezeigt. Der Badge rechts oben bleibt die eindeutige Zielangabe; die Zusatzzeile erscheint nur, wenn bereits Satzwerte vorhanden sind.

### Automatisiert und visuell getestet

- aktuelles Datum bei einem frischen Training
- Wiederherstellung des Tagesdatums nach einem leeren Feld und erneutem Öffnen
- einheitliche Feldpositionen im Session-Akkordeon
- keine doppelte Zielangabe bei unangetasteten, eingeklappten Übungen
- bestehende Zusatzübungs-, Trainings-, Backup-, Dashboard-, Historien-, Theme- und Onboarding-Flows weiterhin grün

## v1.3 Beta – Testpaket 21 (lokal, noch nicht veröffentlicht)

### Was wurde verändert?

- Unterhalb der letzten Übung steht im laufenden Training jetzt **+ Übung hinzufügen** zur Verfügung.
- Eine zusätzliche Übung kann über dieselbe Übungsbibliothek ausgewählt oder als eigene Übung frei benannt werden.
- Die Ergänzung gilt ausschließlich für das aktuelle Training und verändert den dauerhaft geplanten Trainingsplan nicht.
- Zusätzliche Übungen verwenden dieselbe Satz-, Volumen-, Timer-, Abschluss- und Autosave-Logik wie geplante Übungen.
- Laufende Ergänzungen bleiben nach Neuladen sowie in einem Backup erhalten und werden beim Speichern in die Trainingshistorie übernommen, sobald Werte eingetragen oder die Übung abgeschlossen wurden.

### Datenkompatibilität

Das Backupformat bleibt unverändert. Zusätzliche Übungen werden innerhalb des bereits vorhandenen Entwurfsfeldes für temporäre Übungsanpassungen gespeichert; bestehende Backups und Trainingspläne bleiben kompatibel.

### Automatisiert getestet

- zusätzliche Übung über die Bibliothek auswählen
- neue Übung als **Zusätzlich nur für heute** kennzeichnen
- dauerhaften Trainingsplan unverändert lassen
- zusätzliche Übung nach Neuladen wiederherstellen
- eigene Übung manuell benennen und im Entwurf speichern
- bestehende Trainings-, Backup-, Dashboard-, Historien-, Theme- und Onboarding-Flows weiterhin grün

## v1.3 Beta – Testpaket 20 (veröffentlicht am 16.08.2026)

### Was wurde verändert?

- In der Trainingsansicht öffnet der erste Tipp auf eine geschlossene Übung immer nur deren Karte – auch wenn direkt der Übungsname getroffen wird.
- Erst ein weiterer bewusster Tipp auf den Übungsnamen einer bereits geöffneten Karte startet den Ablauf **Übung nur heute ersetzen**.
- Dadurch lassen sich zwei oder mehr Übungen parallel öffnen, ohne versehentlich in der Übungsauswahl zu landen.
- Ein neu gestartetes Training zeigt zunächst alle Übungen eingeklappt. Bei einem laufenden Entwurf bleibt der zuletzt gespeicherte Öffnungszustand erhalten.
- Der Hauptbereich **Übersicht** heißt jetzt verständlicher **Dashboard**.
- Die persönlichen Rekorde stehen im Dashboard direkt unter dem Trainingsplan.
- Die bestehende Bearbeitung abgeschlossener Übungen und der Historieneditor bleiben unverändert.

### Automatisiert getestet

- geschlossene spätere Übung über den Namen öffnen
- beim ersten Tipp weder Bestätigungsdialog noch Übungsauswahl anzeigen
- beim zweiten Tipp auf den Namen der geöffneten Karte den Austauschdialog anzeigen
- frisches Training mit vollständig eingeklappten Übungen und paralleles Öffnen mehrerer Karten
- Dashboard-Beschriftung und Reihenfolge Trainingsplan → persönliche Rekorde
- bestehende Trainings-, Backup-, Dashboard-, Historien-, Theme- und Onboarding-Flows weiterhin grün

## v1.3 Beta – Testpaket 19 (veröffentlicht am 16.08.2026)

### Was wurde verändert?

- Die Historie zeigt gespeicherte Einheiten zunächst als kompakte Karten mit Datum, Übungszahl, Session-Volumen und Tagesform. Es kann immer nur eine Einheit geöffnet sein.
- In einer geöffneten Historieneinheit stehen Warm-up, jeder Arbeitssatz und das Übungsvolumen in eigenen Zeilen. Dadurch bleiben auch längere Übungsnamen bei 320 Pixel Breite lesbar.
- **Bearbeiten** und **Löschen** erscheinen erst innerhalb der geöffneten Einheit. Der bestehende Historieneditor und seine Datenlogik bleiben unverändert.
- Export, Backup, Import und Beta-Testdaten sind in einem separaten Akkordeon **Daten & Backup** gebündelt.
- Ein Klick auf einen Trainingsplan im Dashboard öffnet jetzt nur dessen Übungsvorschau. Das Training startet ausschließlich über den eigenen Button **Training starten/fortsetzen**.
- Der Plan kann direkt aus der geöffneten Dashboard-Karte bearbeitet werden. Dafür werden dieselbe Übungsbibliothek, Validierung und Speicherlogik wie im Setup verwendet.
- Im Setup gibt es unter **Darstellung** die Auswahl **Automatisch**, **Hell** und **Dunkel**. Die Einstellung wird lokal gespeichert; Automatisch folgt der Systemeinstellung des Geräts.
- Das helle Design verwendet einen ruhigen Off-White-Hintergrund, weiße Karten, dunkle Schrift und Cyan-Akzente. Das dunkle Design wurde auf Schwarz- und Anthrazittöne mit den bestehenden Akzentfarben beruhigt.

### Datenkompatibilität

Historien-, Plan-, Entwurfs- und Backupformate wurden nicht verändert. Historienkarten und Themes speichern nur Darstellungszustände; Planänderungen aus dem Dashboard durchlaufen weiterhin dieselbe bestätigte Speicherlogik wie im Setup. Bereits gespeicherte Workouts bleiben mit ihrem damaligen Inhalt erhalten.

### Automatisiert und visuell getestet

- kompakte Historie und genau eine offene Einheit
- vertikale Warm-up- und Satzdarstellung ohne Überlagerung bei 320 Pixeln
- Demo-Historie mit Day 2 und Beinpresse
- Dashboard-Plankarten öffnen, ohne das Training zu starten
- Wechsel zwischen zwei offenen Plankarten
- Planänderung im Dashboard über die gemeinsame Bibliothek und sicheres Verwerfen
- direkte und persistente Hell-/Dunkel-Umschaltung
- bestehende Backup-v5-/Live-v3-, Onboarding-, Timer-, Trainings- und Historieneditor-Tests weiterhin grün

### Auf dem iPhone zu testen

- Historie öffnen, mehrere Einheiten nacheinander auf- und zuklappen und lange Übungsnamen prüfen
- eine Historieneinheit bearbeiten, speichern und kontrollieren, dass die Historie wieder erscheint
- im Dashboard einen Plan aufklappen, Übungen prüfen und erst anschließend bewusst starten
- eine Übung über **Plan bearbeiten** austauschen und speichern
- im Setup zwischen Automatisch, Hell und Dunkel wechseln und die Lesbarkeit in allen vier Hauptbereichen prüfen

## v1.3 Beta – Testpaket 18 (veröffentlicht am 16.08.2026)

### Was wurde verändert?

- Alle Eingabe-, Such-, Auswahl- und Textfelder verwenden global mindestens 16 Pixel Schriftgröße. Dadurch darf iOS beim Fokussieren nicht mehr automatisch in die Seite hineinzoomen.
- Die Ersteinrichtung bietet zusätzlich einen **individuellen Plan** für 1 bis 4 unterschiedliche Workouts.
- Bei einem individuellen Plan lassen sich alle Workouts selbst benennen und die Übungen direkt aus der bestehenden Bibliothek auswählen, ergänzen oder entfernen.
- Split-Vorlagen und Trainingsplanbearbeitung sind im Setup jetzt zwei getrennte Akkordeons. Beide langen Bereiche bleiben zunächst eingeklappt.
- Nach der Übernahme einer Split-Vorlage schließt sich die Vorlagenauswahl und die Plananpassung öffnet sich gezielt.
- Der **Volumentrend** wurde aus der Historie ins Dashboard verschoben. Die bestehenden Filter und Berechnungen bleiben erhalten.
- Das Dashboard zeigt neu die höchsten gespeicherten Arbeitsgewichte pro Übung inklusive Wiederholungen und Datum.
- Rekorde aus dem zuletzt gespeicherten Training werden dezent als **Neu** markiert; Warm-up-Gewichte zählen ausdrücklich nicht.

### Datenkompatibilität

Es wurden keine bestehenden Historien-, Plan-, Entwurfs- oder Backupformate verändert. Individuelle Onboarding-Pläne bleiben bis zum finalen Abschluss reine Entwürfe. Persönliche Rekorde werden bei jeder Dashboard-Anzeige ausschließlich aus der vorhandenen Historie berechnet und nicht separat gespeichert.

### Automatisiert und visuell getestet

- globale Mindestschriftgröße in Setup- und Onboarding-Feldern
- Setup-Akkordeons öffnen und schließen
- bestehende Setup-Planänderung und Verwerfen
- individueller 3-Workout-Plan mit eigenen Namen und drei Übungen aus der Bibliothek
- kein horizontaler Überlauf bei 320 Pixeln
- Volumentrend ausschließlich im Dashboard
- persönliche Rekorde aus Arbeitssätzen
- bestehende Backup-v5-/Live-v3-, Historien-, Timer- und Rotationstests weiterhin grün

### Auf dem iPhone zu testen

- im Setup den Zielbereich einer Übung antippen und kontrollieren, dass kein Seitenzoom entsteht
- zusätzlich Suchfeld, Workout-Name, Körpergewicht und Kurznotiz fokussieren
- beide Setup-Bereiche mehrmals öffnen und schließen
- individuellen Plan mit eigenen Workout-Namen vollständig einrichten
- Dashboard mit echten Trainingsdaten auf Volumentrend und persönliche Rekorde prüfen

## v1.3 Beta – Testpaket 17 (veröffentlicht am 16.08.2026)

### Live-Backup-Kompatibilität

- Ältere, gültige Backups der Live-App mit `app: "hesselink"` werden zusätzlich zum Beta-Format akzeptiert.
- Die bisherige Prüfung hatte diese Dateien trotz intakter Trainingsdaten pauschal abgewiesen.
- Unbekannte App-Kennzeichen, ungültiges JSON und Dateien ohne Historienliste bleiben weiterhin gesperrt.
- Für das konkrete Live-Backup vom 16.08.2026 wurde zusätzlich eine kompatible Importkopie erstellt; das Original blieb unverändert.

### Was wurde verändert?

- Bei zwei unterschiedlichen Workouts bietet die Ersteinrichtung jetzt drei verständliche Varianten an: **Ganzkörper A/B**, **Oberkörper/Unterkörper** und **Push/Pull**.
- Die bisherige Empfehlung bleibt abhängig von Wochenziel und Anzahl der Workouts sichtbar markiert; bei drei Trainingstagen und zwei Workouts bleibt Ganzkörper A/B die Empfehlung.
- Jede Plankarte lässt sich direkt aufklappen und zeigt alle Einheiten, Übungen und Wiederholungsziele.
- Nach der Auswahl folgt eine eigene Prüfseite. Der Plan kann dort unverändert übernommen oder vor Abschluss der Einrichtung angepasst werden.
- Die direkte Anpassung verwendet dieselbe Übungsbibliothek wie das Setup, arbeitet aber in einem separaten Onboarding-Entwurf. Erst **Einrichtung abschließen** ersetzt den zukünftigen Plan.
- Für Push/Pull mit zwei Workouts wurden Beine anfängerfreundlich integriert: Beinpresse am Push-Tag und rumänisches Kreuzheben am Pull-Tag.
- Das normale Setup und seine bisherige Planbearbeitung bleiben in ihrem Ablauf unverändert.

### Datenkompatibilität

Historie, laufende Trainings und der aktive Plan werden während Auswahl, Vorschau und Anpassung nicht verändert. Erst die abschließende Übernahme speichert den neuen Plan; vorhandene laufende Workouts werden weiterhin nur nach ausdrücklicher Bestätigung verworfen. Das bestehende Daten- und Backup-Format bleibt unverändert.

### Automatisiert und visuell getestet

- kompletter Vier-Schritt-Ablauf bei 320 × 700 Pixeln
- drei auswählbare 2er-Splits und korrekte Empfehlungsmarkierung
- aufklappbare Vorschau für Oberkörper/Unterkörper
- Prüfseite mit beiden Ganzkörpereinheiten
- direkter Übungstausch über die gemeinsame Bibliothek
- normales Setup inklusive Ändern und Verwerfen weiterhin funktionsfähig
- kein horizontaler Überlauf im Onboarding-Editor
- bestehende Backup-v5-/v4-, Historien-, Timer- und Rotationstests weiterhin grün

### Auf dem iPhone zu testen

- **Setup → Einrichtung erneut starten** öffnen und 3 Trainingstage / 2 Workouts wählen
- alle drei Plankarten aufklappen und Lesbarkeit sowie Scrollverhalten prüfen
- einen Plan zunächst unverändert prüfen
- anschließend **Übungen jetzt anpassen** wählen, mehrere Tage öffnen und eine Übung austauschen
- Einrichtung abschließen und kontrollieren, dass Dashboard und Trainingsansicht den gewählten Plan zeigen
- zusätzlich prüfen, dass ein Abbruch vor dem Abschluss den bisherigen Plan unverändert lässt

## v1.3 Beta – Testpaket 16

### Was wurde verändert?

- Die Trainingsansicht wurde beruhigt: Der doppelte **Heute**-Block entfällt, Wochenfortschritt und Wochenziel bleiben im Dashboard.
- Die Trainingstage erscheinen als kompakte, horizontal angeordnete Auswahl statt als große Karten.
- Der Pausentimer liegt nicht mehr global über der Bedienoberfläche. Er sitzt dezent blau unten rechts in der aktuell aktiven Übungskarte und wandert nach einem Übungsabschluss zur nächsten aktiven Übung.
- Ein neuer Beginner-Einstieg fragt getrennt nach Trainingstagen pro Woche und Anzahl unterschiedlicher Workouts.
- Die App empfiehlt daraus einen vorbefüllten Ganzkörper-, A/B-, Push/Pull/Legs- oder Upper/Lower-Plan.
- Bestehende Nutzer werden nicht ungefragt durch das Onboarding geführt. Unter **Setup → Einrichtung erneut starten** kann es bewusst erneut geöffnet werden.
- `weeklyTarget` speichert das Wochenziel getrennt von der Anzahl unterschiedlicher Workouts.
- Die nächste Einheit rotiert anhand der zuletzt gespeicherten Einheit fortlaufend über Wochenwechsel hinweg. Ein A/B-Plan an drei Trainingstagen läuft damit A/B/A, danach B/A/B.
- Der Beta-Reset öffnet anschließend wieder den Beginner-Einstieg.

### Datenkompatibilität

Bestehende Pläne erhalten beim Laden automatisch ein Wochenziel entsprechend ihrer bisherigen Anzahl an Einheiten. Historie, Entwürfe, Planversionen und Backup-Format bleiben erhalten. Backups ohne `weeklyTarget` werden beim Import sicher ergänzt.

### Automatisiert und visuell getestet

- Beginner-Onboarding bei 320 × 700 Pixeln
- getrennte Speicherung von drei Trainingstagen und zwei unterschiedlichen Workouts
- fortlaufende A/B-Rotation
- kompakte Trainingsansicht ohne doppelten Heute-Block und ohne globalen Timer
- Timer innerhalb der aktiven Übungskarte
- kein horizontaler Überlauf bei 320 und 390 Pixeln
- bestehende Backup-v5-/v4-, Historien- und Datensicherheitstests weiterhin grün

### Auf dem iPhone zu testen

- Onboarding über **Setup → Einrichtung erneut starten** vollständig durchlaufen
- A/B mit drei Trainingstagen auswählen und Empfehlung übernehmen
- Training starten und die kompakte Tagesauswahl prüfen
- Timer zwischen Sätzen und nach Übungsabschluss starten; Position und Wechsel zur nächsten Übung prüfen
- prüfen, dass Training beenden und Reset zu keinem Zeitpunkt verdeckt werden

## v1.3 Beta – Testpaket 15

### Was wurde verändert?

- Das vollständige Backup verwendet jetzt Format 5 und enthält neben Trainingsplan und Historie auch laufende Workout-Entwürfe.
- Aktiver Trainingstag, aktuelle Übung, aktueller Satz, offene Übungskarten und Session-Angaben werden über den vorhandenen Entwurf mitgesichert.
- Nur für das aktuelle Workout ersetzte Übungen werden gesichert und nach dem Import wiederhergestellt.
- Ein noch laufender Pausentimer wird ins Backup aufgenommen; abgelaufene Timer werden beim Import bewusst nicht neu gestartet.
- Vor der Wiederherstellung erklärt eine Sicherheitsabfrage, ob lokale Trainingsentwürfe ersetzt werden.
- Historieneinträge werden weiterhin anhand ihrer ID ohne Duplikate ergänzt; bestehende lokale Einträge werden nicht überschrieben.
- Ältere Backups ohne Workout-Entwürfe bleiben importierbar und löschen vorhandene lokale Entwürfe nicht.
- Das Autosave ist während des abschließenden Import-Neuladens gesperrt, damit es den gerade wiederhergestellten Entwurf nicht überschreiben kann.
- Ein automatisierter Browser-Regressionslauf prüft Backup und Wiederherstellung sowie zentrale Trainings-, Historien- und Setup-Abläufe bei 390 × 844 und 320 × 700 Pixeln.

### Datenkompatibilität

Das neue Backup-Format ist rückwärtskompatibel. Vorhandene lokale Datenformate für Trainingsplan, Historie, Entwürfe und Timer bleiben unverändert. Backups bis einschließlich Format 4 können weiterhin importiert werden; da sie keine Entwürfe enthalten, bleiben lokale laufende Workouts dabei erhalten.

### Automatisiert getestet

- vollständiger Export eines laufenden Day-2-Workouts inklusive temporärer Ersatzübung und Timer
- Wiederherstellung des aktiven Trainingstags, des aktuellen Satzes und der gesperrten abgeschlossenen Übungen
- Warnung und kontrolliertes Ersetzen eines lokalen Entwurfskonflikts
- verlustfreie Zusammenführung der Historie ohne doppelte Einträge
- Import eines älteren Format-4-Backups ohne Löschen lokaler Entwürfe
- Historienbearbeitung mit vollständig geöffneten Übungen
- Setup-Reihenfolge und horizontaler Überlauf auf zwei mobilen Viewports
- keine Browser- oder JavaScript-Fehler im kompletten Testlauf

### Auf dem iPhone zu testen

- Day 1 teilweise ausfüllen und gegebenenfalls eine Übung nur für heute ersetzen
- Backup exportieren und die Datei sicher aufbewahren
- Beta-Daten zurücksetzen
- Backup importieren und die Sicherheitsabfrage bestätigen
- kontrollieren, dass das laufende Workout exakt an der vorherigen Stelle fortgesetzt werden kann

## v1.3 Beta – Testpaket 14

### Was wurde verändert?

- Im Setup steht die Auswahl des Trainingssplits jetzt vor der anschließenden Plananpassung.
- Eine noch offene Übung kann während des laufenden Trainings direkt über ihren Namen ausschließlich für die aktuelle Einheit ersetzt werden.
- Vor dem Austausch erscheint eine Sicherheitsabfrage; vorhandene Eingaben der betroffenen Übung werden ausdrücklich angekündigt und erst nach Bestätigung verworfen.
- Bereits abgeschlossene Übungen, deren Sätze und alle anderen offenen Übungen bleiben beim Austausch unverändert.
- Die Ersatzübung erhält einen sichtbaren Hinweis **Nur für dieses Training ersetzt**.
- Temporäre Ersetzungen werden im laufenden Entwurf gespeichert und überstehen damit Neuladen oder zwischenzeitliches Verlassen der App.
- Beim gespeicherten Workout erscheint die tatsächlich ausgeführte Ersatzübung in der Historie; der zukünftige Trainingsplan bleibt unverändert.
- Reset oder Abschluss des Workouts entfernt die temporäre Ersetzung automatisch.

### Datenkompatibilität

Temporäre Übungen werden ausschließlich im lokalen Entwurf der aktuellen Einheit gespeichert. Das Planformat und vorhandene historische Workouts werden nicht verändert.

### Zu testen

- in Einheit 1 zwei Übungen vollständig abschließen
- den Namen der dritten, noch offenen Übung antippen und den Austausch bestätigen
- beispielsweise Latzug nur für heute durch Rudern Maschine ersetzen
- prüfen, dass die ersten beiden Übungen abgeschlossen und unverändert bleiben
- App neu laden und kontrollieren, dass die temporäre Ersatzübung erhalten bleibt
- Workout speichern und Ersatzübung in der Historie prüfen
- neues Workout öffnen und kontrollieren, dass wieder die ursprüngliche Planübung erscheint
- bei bereits eingetragenen Werten die zusätzliche Verlustwarnung prüfen

## v1.3 Beta – Testpaket 13

### Was wurde verändert?

- Der technische **Plan bearbeiten**-Modus wurde vollständig aus dem laufenden Training entfernt.
- Die Plananpassung befindet sich jetzt gebündelt unter **Setup → Trainingsplan anpassen**.
- Pro Trainingstag sind alle geplanten Übungen in einer kompakten Liste sichtbar.
- Ein Tipp auf den Übungsnamen öffnet direkt die kategorisierte Übungsbibliothek.
- Übungen können hinzugefügt, entfernt oder als eigene Übung eingetragen werden; Wiederholungsziele sind direkt anpassbar.
- Planänderungen werden zunächst nur als Entwurf gehalten und erst zentral über **Plan speichern** übernommen.
- Bei laufenden Trainingsentwürfen warnt die App vor dem Speichern und verhindert eine Vermischung alter Eingaben mit dem neuen Plan.
- **Verwerfen** setzt ungespeicherte Planänderungen zurück.
- Historische Workouts bleiben mit ihren damaligen Übungen und der damaligen Planversion unverändert.

### Datenkompatibilität

Das vorhandene Plan- und Workoutformat bleibt erhalten. Beim Speichern einer Plananpassung erhält der zukünftige Plan eine neue Versions-ID; gespeicherte Trainingseinheiten werden nicht umgeschrieben.

### Zu testen

- prüfen, dass im Training kein Button oder Modus **Plan bearbeiten** mehr erscheint
- unter Setup zwischen allen Trainingstagen wechseln
- vorhandene Übung über den Namen austauschen
- Übung hinzufügen, entfernen und eine eigene Übung anlegen
- Wiederholungsziel ändern, Änderungen verwerfen und erneut prüfen
- Plan speichern und anschließend Training mit dem neuen Plan öffnen
- Warnung und Schutz bei einem bereits laufenden Trainingsentwurf prüfen
- bestehende Historie nach Planänderung kontrollieren

## v1.3 Beta – Testpaket 12

### Was wurde verändert?

- Außerhalb der Plan- und Historienbearbeitung ist der Übungsname kein fokussierbares Texteingabefeld mehr.
- Ein Tipp auf den Übungsnamen aktiviert weiterhin die zugehörige Übungskarte, löst auf dem iPhone aber weder Tastatur/Zoom noch eine gestrichelte Fokuslinie aus.
- Die Übungsauswahl in der Plan- und Historienbearbeitung bleibt unverändert verfügbar.
- Die Kategorien im Übungsauswahlfenster behalten auf kleinen iPhone-Displays ihre volle Höhe und lassen sich horizontal scrollen, ohne von der Übungsliste abgeschnitten zu werden.

### Datenkompatibilität

Es werden ausschließlich Fokus- und Touch-Verhalten der Oberfläche angepasst. Trainingspläne, Entwürfe und Historieneinträge bleiben unverändert.

### Zu testen

- Im normalen Training mehrfach auf unterschiedliche Übungsnamen tippen
- prüfen, dass die jeweilige Karte geöffnet wird, ohne Zoom, Tastatur oder Fokuslinie
- anschließend Planbearbeitung und Übungsauswahl öffnen
- Historienbearbeitung und Übungsauswahl ebenfalls kontrollieren
- Kategorien im Auswahlfenster auf schmaler und niedriger iPhone-Ansicht horizontal durchscrollen

## v1.3 Beta – Testpaket 11

### Was wurde verändert?

- Beim Bearbeiten einer gespeicherten Einheit in der **Historie** sind alle Übungskarten gleichzeitig geöffnet und direkt korrigierbar.
- Die Trainingsaktion **Übung abschließen** wird im Historien-Editor nicht angezeigt; gespeichert wird die komplette Korrektur ausschließlich über **Änderungen speichern**.
- Ein Tipp auf den Übungsnamen öffnet auch im Historien-Editor die kategorisierte Übungsbibliothek.
- Gewichte, Wiederholungen und Satzanzahl der gespeicherten Übung bleiben beim Austausch über die Bibliothek erhalten.
- Eine freie Tastatureingabe des Übungsnamens ist weiterhin über **Eigene Übung manuell eintragen** möglich.
- Der Pausentimer wird während einer Historienkorrektur ausgeblendet und verdeckt dadurch keine Eingaben.
- Der zweite Aktionsbutton heißt während der Historienkorrektur **Abbrechen** statt **Reset**.
- Nach dem Speichern oder Abbrechen schließt sich der Korrekturmodus und die App kehrt direkt zur Historie zurück.

### Datenkompatibilität

Das Format gespeicherter Workouts bleibt unverändert. Ein über die Bibliothek korrigierter Übungsname und sein Wiederholungsziel werden erst über **Änderungen speichern** in die betreffende historische Einheit geschrieben.

### Zu testen

- Historie öffnen und prüfen, dass beim Bearbeiten alle Übungskarten geöffnet sind
- Gewichte und Wiederholungen in unterschiedlichen Übungen direkt korrigieren
- prüfen, dass im Korrekturmodus keine Schaltfläche **Übung abschließen** erscheint
- auf einen Übungsnamen tippen und eine Übung aus der Bibliothek auswählen
- vorhandene Gewichte, Wiederholungen und zusätzliche Sätze nach dem Austausch prüfen
- manuelle Eingabe ausschließlich über **Eigene Übung manuell eintragen** prüfen
- Historienkorrektur speichern und anschließend erneut öffnen
- prüfen, dass die App nach dem Speichern wieder die Historie anzeigt

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

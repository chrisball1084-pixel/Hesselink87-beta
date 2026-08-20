/* Prüft die Trainingslogik direkt – ohne Browser, in unter einer Sekunde.
 *
 * Möglich wird das durch den getrennten Logik-Block in index.html: Er greift
 * weder auf das Dokument noch auf den Speicher zu, lässt sich also einfach
 * laden und befragen. Die Oberfläche prüft weiterhin tests/regression.cjs.
 *
 *   node tests\logik.cjs
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

/* Den Logik-Block anhand seiner Überschrift herausziehen. */
function logikQuelltext(){
  const lines = html.split("\n");
  const start = lines.findIndex((zeile, i) =>
    zeile.trim() === "<script>" && lines.slice(i+1, i+5).some(z => z.includes("TRAININGSLOGIK")));
  assert.ok(start >= 0, "Logik-Block in index.html nicht gefunden – fehlt die Überschrift TRAININGSLOGIK?");
  const ende = lines.findIndex((zeile, i) => i > start && zeile.trim() === "</script>");
  assert.ok(ende > start, "Der Logik-Block ist nicht abgeschlossen");
  return lines.slice(start+1, ende).join("\n");
}

const quelltext = logikQuelltext();

/* Alle Namen des Blocks einsammeln. `const` erzeugt – anders als `function` –
   keine Eigenschaft am globalen Objekt, deshalb reichen wir sie ausdrücklich
   heraus. Neue Funktionen im Block stehen dadurch automatisch zur Verfügung. */
const namen = [...quelltext.matchAll(/^(?:function|const)\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1]);
assert.ok(namen.length > 20, `Der Logik-Block wirkt unvollständig – nur ${namen.length} Namen gefunden`);

const sandbox = {};
vm.createContext(sandbox);
const L = vm.runInContext(`${quelltext}\n;({${namen.join(", ")}});`, sandbox);

/* Der Block darf sich nicht heimlich wieder mit der Oberfläche verheiraten. */
const rohcode = quelltext.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
[["document\\.", "Dokumentzugriff"], ["\\blocalStorage\\b", "Speicherzugriff"],
 ["\\bsessionStorage\\b", "Speicherzugriff"], ["querySelector", "Element-Auswahl"],
 ["(?<![.\\w])planConfig\\b", "globaler Zustand"], ["(?<![.\\w])templates\\b", "globaler Zustand"],
 ["(?<![.\\w])currentDay\\b", "globaler Zustand"]
].forEach(([muster, was]) => {
  assert.equal(new RegExp(muster).test(rohcode), false,
    `Die Trainingslogik darf keinen ${was} enthalten (${muster})`);
});

const satz = (kg, ...wdh) => ({workSets: wdh.map(r => ({kg: String(kg), reps: String(r)}))});
const verlauf = (...saetze) => saetze.map(s => ({set: s, entry: {date: "2026-08-01"}}));

/* ---- Sätze und Volumen ---- */
assert.equal(L.workSetsOf(satz(80, 10, 9)).length, 2, "Zwei Arbeitssätze müssen erkannt werden");
assert.equal(L.workSetsOf({kg1:"80", wdh1:"10", kg2:"80", wdh2:"9"}).length, 2,
  "Auch die ältere Schreibweise kg1/wdh1 muss gelesen werden");
assert.equal(L.exVolume(satz(80, 10, 9)), 1520, "Volumen ist Gewicht mal Wiederholungen über alle Arbeitssätze");
assert.equal(L.exVolume(satz(0, 0, 0)), 0, "Leere Sätze ergeben kein Volumen");
assert.equal(L.maxKg(satz(80, 10, 9)), 80, "Das schwerste Arbeitsgewicht zählt");
assert.equal(L.num("82,5"), 82.5, "Komma muss als Dezimaltrennzeichen gelten");

/* ---- Zielbereiche ---- */
assert.equal(L.goalUpper("8–12"), 12);
assert.equal(L.goalLower("8–12"), 8);
assert.equal(L.goalUpper("10-15"), 15, "Auch der einfache Bindestrich muss funktionieren");
assert.equal(L.goalUpper("frei"), null, "Ein freies Ziel hat keine Obergrenze");
assert.equal(L.goalLower("frei"), null, "Ein freies Ziel hat keine Untergrenze");

/* ---- Progression nach oben ---- */
assert.equal(L.hitTop(satz(80, 12, 12), "8–12"), true, "Beide Sätze am oberen Ende zählen als geschafft");
assert.equal(L.hitTop(satz(80, 12, 11), "8–12"), false, "Ein Satz darunter reicht nicht");
assert.equal(L.hitTop(satz(80, 12, 12), "frei"), false, "Ohne Zielbereich gibt es keine automatische Steigerung");
assert.match(L.targetText(satz(80, 12, 12), "8–12"), /82,5 kg/,
  "Der Vorschlag muss das nächste Gewicht in deutscher Schreibweise nennen");
assert.match(L.targetText(satz(80, 10, 9), "8–12"), /8–12/,
  "Ohne erreichte Obergrenze bleibt der Zielbereich stehen");

/* ---- Progression nach unten ---- */
assert.equal(L.needsWeightDrop(verlauf(satz(80, 6, 5)), "8–12"), false,
  "Eine einzelne schwache Einheit darf keine Gewichtsreduktion auslösen");
assert.equal(L.needsWeightDrop(verlauf(satz(80, 6, 5), satz(80, 7, 6)), "8–12"), true,
  "Zweimal unter dem Zielbereich muss weniger Gewicht vorschlagen");
assert.equal(L.needsWeightDrop(verlauf(satz(80, 6, 5), satz(80, 9, 8)), "8–12"), false,
  "Liegt die zweite Einheit im Zielbereich, ist alles in Ordnung");
assert.equal(L.needsWeightDrop(verlauf(satz(80, 0, 0), satz(80, 0, 0)), "8–12"), false,
  "Leere Einheiten dürfen nicht als schwach gelten");
assert.equal(L.needsWeightDrop(verlauf(satz(80, 3, 3), satz(80, 3, 3)), "frei"), false,
  "Ohne Zielbereich gibt es keine Abwärts-Empfehlung");
assert.match(L.dropText(satz(80, 6, 5), "8–12"), /77,5 kg/, "Es muss ein konkretes Gewicht genannt werden");
assert.match(L.dropText(satz(2, 6, 5), "8–12"), /etwas weniger Gewicht/,
  "Bei sehr kleinem Gewicht darf kein negativer Wert entstehen");

/* ---- Übungsnotiz ---- */
assert.deepEqual({...L.carriedNote({set:{exNote:" mehr Gewicht ", exNoteDate:"2026-08-05"}, entry:{date:"2026-08-12"}})},
  {text:"mehr Gewicht", date:"2026-08-05"}, "Die Notiz behält ihr eigenes Datum");
assert.deepEqual({...L.carriedNote({set:{exNote:"x"}, entry:{date:"2026-08-12"}})},
  {text:"x", date:"2026-08-12"}, "Ohne eigenes Datum zählt das Datum der Einheit");
assert.equal(L.carriedNote({set:{exNote:"   "}, entry:{date:"2026-08-12"}}), null, "Leerzeichen sind keine Notiz");
assert.equal(L.carriedNote(null), null, "Ohne Vorgeschichte gibt es keine Notiz");

/* ---- Plan-Linie ---- */
assert.equal(L.planLineageOf({planLineageId:"a", planVersionId:"b"}), "a", "Die Plan-Linie hat Vorrang");
assert.equal(L.planLineageOf({planVersionId:"b"}), "b", "Ältere Einträge fallen auf die Planversion zurück");
assert.equal(L.planLineageOf({}), "legacy", "Uraltdaten gelten als eigene Linie");

/* ---- Backup-Prüfungen ---- */
assert.equal(L.draftHasMeaningfulData({weight:"82"}), true, "Ein Körpergewicht macht den Entwurf bedeutsam");
assert.equal(L.draftHasMeaningfulData({}), false, "Ein leerer Entwurf ist bedeutungslos");
assert.equal(L.draftHasMeaningfulData(null), false, "Kein Entwurf ist kein Entwurf");
assert.throws(() => L.validateBackupPayload({app:"fremd"}), /Format/, "Fremde Dateien müssen abgelehnt werden");

/* ---- Datum ---- */
assert.equal(L.fmtShort("2026-08-05"), "05.08.", "Kurzdatum in deutscher Schreibweise");
assert.equal(L.weekKey("2026-08-12"), L.weekKey("2026-08-14"),
  "Zwei Tage derselben Woche müssen denselben Wochenschlüssel ergeben");
assert.notEqual(L.weekKey("2026-08-12"), L.weekKey("2026-08-20"),
  "Unterschiedliche Wochen müssen sich unterscheiden");

console.log("PASS: Trainingslogik – Sätze, Volumen, Zielbereiche, Progression, Notiz, Plan-Linie, Backup, Datum");

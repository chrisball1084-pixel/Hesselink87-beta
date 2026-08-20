const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"));

function serveApp(){
  return new Promise(resolve=>{
    const server=http.createServer((req,res)=>{
      if(req.url==="/robots.txt"){
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.end("User-agent: *\nDisallow: /");
        return;
      }
      /* Service Worker, Manifest und Icon brauchen ihren echten Inhalt und
         den richtigen Content-Type, sonst verweigert der Browser die
         Registrierung. Alles Übrige bleibt die App selbst. */
      const staticFiles={
        "/sw.js":["sw.js","text/javascript; charset=utf-8"],
        "/manifest.webmanifest":["manifest.webmanifest","application/manifest+json; charset=utf-8"],
        "/icon.svg":["icon.svg","image/svg+xml"],
      };
      const asset=staticFiles[(req.url||"").split("?")[0]];
      if(asset){
        const file=path.join(__dirname,"..",asset[0]);
        if(fs.existsSync(file)){
          res.writeHead(200,{"Content-Type":asset[1],"Cache-Control":"no-store"});
          res.end(fs.readFileSync(file));
          return;
        }
        res.writeHead(404,{"Content-Type":"text/plain"});
        res.end("not found");
        return;
      }
      res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"});
      res.end(html);
    });
    server.listen(0,"127.0.0.1",()=>resolve(server));
  });
}

function sampleSets(){
  return [
    {wkg:"65",wwdh:"12",workSets:[{kg:"77.5",reps:"12"},{kg:"77.5",reps:"11"}],setCount:2,done:true,touched:true},
    {wkg:"25",wwdh:"12",workSets:[{kg:"35",reps:"12"},{kg:"35",reps:"11"}],setCount:2,done:true,touched:true},
    {wkg:"30",wwdh:"12",workSets:[{kg:"40",reps:"10"},{kg:"40",reps:""}],setCount:2,done:false,touched:true},
    {wkg:"",wwdh:"",workSets:[{kg:"",reps:""},{kg:"",reps:""}],setCount:2,done:false,touched:false},
    {wkg:"",wwdh:"",workSets:[{kg:"",reps:""},{kg:"",reps:""}],setCount:2,done:false,touched:false},
  ];
}

function sampleDraft(weight="82"){
  return {ts:Date.now(),date:"2026-08-14",weight,energy:"🙂 Solide",note:"Backup-Test",
    activeExIdx:2,activeSetKey:"2",openExIndices:[0,1,2],
    exerciseOverrides:{2:{id:"row-machine",n:"Rudern Maschine",goal:"8–12"}},sets:sampleSets()};
}

function sampleLog(id,note){
  return {id,day:"2",dayName:"Ganzkörper B",date:"2026-08-13",weight:"82",energy:"🙂 Solide",note,
    planVersionId:"legacy",sets:[
      {name:"Beinpresse",goal:"10–15",wkg:"65",wwdh:"12",workSets:[{kg:"77.5",reps:"12"},{kg:"77.5",reps:"11"}]},
      {name:"Butterfly",goal:"8–12",wkg:"25",wwdh:"12",workSets:[{kg:"35",reps:"12"},{kg:"35",reps:"11"}]},
    ]};
}

async function importBackup(page,payload,fileName){
  const file=path.join(os.tmpdir(),fileName);
  fs.writeFileSync(file,JSON.stringify(payload,null,2));
  await page.locator("#import-file").setInputFiles(file);
  await page.locator("#modal-bg.show").waitFor();
  const warning=await page.locator("#m-txt").textContent();
  const reload=page.waitForNavigation({waitUntil:"load"});
  await page.locator("#m-ok").click();
  await reload;
  return warning;
}

(async()=>{
  const server=await serveApp();
  const address=server.address();
  const installedChrome="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROME||installedChrome});
  const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
  const page=await context.newPage();
  const errors=[];
  page.on("console",msg=>{ if(msg.type()==="error") errors.push(msg.text()); });
  page.on("pageerror",error=>errors.push(error.message));

  try{
    await page.goto(`http://127.0.0.1:${address.port}/`,{waitUntil:"load"});
    await page.evaluate(({draft,log,endAt})=>{
      localStorage.setItem("hesselink_beta_draft_v1",JSON.stringify({2:draft}));
      localStorage.setItem("hesselink_beta_log_v2",JSON.stringify([log]));
      localStorage.setItem("hesselink_beta_timer_v1",JSON.stringify({endAt,tIdx:0,timerExIdx:"2"}));
    },{draft:sampleDraft(),log:sampleLog(1,"backup"),endAt:Date.now()+300000});
    await page.reload({waitUntil:"load"});

    assert.equal(await page.locator(".tab").count(),4,"Die vier Hauptbereiche müssen erhalten bleiben");
    await page.locator("#dash-start").click();
    assert.equal(await page.locator('.day-btn.active').getAttribute("data-day"),"2","Der laufende Day-2-Entwurf muss geöffnet werden");
    assert.match(await page.locator('.ex[data-i="2"] .ex-name-inp').inputValue(),/Rudern Maschine/);
    assert.equal(await page.locator(".temporary-ex-note").count(),1,"Temporärer Übungstausch muss sichtbar sein");
    assert.equal(await page.locator('.ex[data-i="0"] .set-row input').first().isDisabled(),true,"Abgeschlossene Übungen müssen gesperrt bleiben");
    assert.equal(await page.locator("#today-card").isVisible(),false,"Der doppelte Heute-Block muss ausgeblendet bleiben");
    assert.equal(await page.locator("#timer-fab-wrap").isVisible(),false,"Der globale Pausentimer darf die Trainingsansicht nicht überlagern");
    assert.equal(await page.locator('.card-timer.show[data-card-timer="2"]').count(),1,"Der Timer muss in der aktiven Übungskarte sitzen");
    const closedExerciseHeader=page.locator('.ex[data-i="3"] .ex-top');
    assert.equal(await page.locator('.ex[data-i="3"]').getAttribute("class").then(value=>value.includes("compact")),true,"Eine spätere Übung muss zunächst geschlossen sein");
    await closedExerciseHeader.click();
    assert.equal(await page.locator('.ex[data-i="3"]').getAttribute("class").then(value=>value.includes("compact")),false,"Ein Tipp auf den Kartenkopf muss die geschlossene Karte öffnen");
    assert.equal(await page.locator("#modal-bg").isVisible(),false,"Der Kartenkopf darf keinen Übungstausch auslösen");
    await page.locator('.ex[data-i="3"] [data-swap-exercise="3"]').click();
    assert.equal(await page.locator("#modal-bg.show").isVisible(),true,"Nur der separate Tauschen-Button darf den Übungstausch anbieten");
    await page.locator("#m-cancel").click();
    await page.locator('.ex[data-i="2"] .ex-num').click();
    await page.locator('.ex[data-i="2"] .ex-num').click();
    if(process.env.VISUAL_CHECK) await page.screenshot({path:path.join(os.tmpdir(),"hesselink-training-919.png"),fullPage:true});

    await page.locator('.tab[data-view="setup"]').click();
    const setupHeadings=await page.locator('#view-setup .setup-section-copy strong').allTextContents();
    assert.deepEqual(setupHeadings,["Trainingssplit wählen","Trainingsplan anpassen","Darstellung"]);
    assert.equal(await page.locator("#setup-split-body").isHidden(),true,"Split-Vorlagen müssen zunächst eingeklappt sein");
    assert.equal(await page.locator("#setup-plan-body").isHidden(),true,"Planbearbeitung muss zunächst eingeklappt sein");
    assert.equal(await page.locator("#setup-theme-body").isHidden(),true,"Darstellung muss zunächst eingeklappt sein");
    await page.locator("#setup-split-toggle").click();
    assert.equal(await page.locator("#split-grid .split-card").first().isVisible(),true,"Split-Auswahl muss gezielt aufklappbar sein");
    await page.locator("#setup-split-toggle").click();
    await page.locator("#setup-plan-toggle").click();
    if(process.env.VISUAL_CHECK) await page.screenshot({path:path.join(os.tmpdir(),"hesselink-setup-accordion-919.png"),fullPage:false});
    const originalSetupExercise=await page.locator('[data-setup-select="0"]').textContent();
    await page.locator('[data-setup-select="0"]').click();
    await page.locator('[data-library-id="hack-squat"]').click();
    assert.match(await page.locator('[data-setup-select="0"]').textContent(),/Hackenschmidt/,"Normale Setup-Bearbeitung muss weiterhin funktionieren");
    await page.locator("#setup-plan-discard").click();
    await page.locator("#m-ok").click();
    assert.equal(await page.locator('[data-setup-select="0"]').textContent(),originalSetupExercise,"Verwerfen im Setup muss den aktiven Plan unverändert lassen");
    assert.equal(await page.locator('[data-setup-goal="0"]').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=16),true,"Setup-Felder müssen iPhone-sichere 16 px verwenden");
    await page.locator("#setup-theme-toggle").click();
    await page.locator('[data-theme-choice="light"]').click();
    assert.equal(await page.locator("html").getAttribute("data-theme"),"light","Helles Design muss direkt angewendet werden");
    assert.equal(await page.evaluate(()=>localStorage.getItem("hesselink_beta_theme_v1")),"light","Designauswahl muss gespeichert werden");
    if(process.env.VISUAL_CHECK) await page.screenshot({path:path.join(os.tmpdir(),"hesselink-setup-light-920.png"),fullPage:false});
    if(process.env.VISUAL_CHECK){ await page.locator('.tab[data-view="dashboard"]').click(); await page.screenshot({path:path.join(os.tmpdir(),"hesselink-dashboard-light-920.png"),fullPage:true}); await page.locator('.tab[data-view="setup"]').click(); }
    await page.locator('[data-theme-choice="dark"]').click();
    assert.equal(await page.locator("html").getAttribute("data-theme"),"dark","Dunkles Design muss direkt angewendet werden");
    await page.reload({waitUntil:"load"});
    assert.equal(await page.locator("html").getAttribute("data-theme"),"dark","Designauswahl muss einen Neustart überstehen");
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,"Kein horizontaler Überlauf bei 390 px");
    await page.setViewportSize({width:320,height:700});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,"Kein horizontaler Überlauf bei 320 px");
    await page.setViewportSize({width:390,height:844});

    await page.locator('.tab[data-view="dashboard"]').click();
    assert.equal((await page.locator('.tab[data-view="dashboard"]').textContent()).trim(),"Dashboard","Der Hauptbereich muss Dashboard heißen");
    assert.equal(await page.locator("#view-dashboard #chart-holder").count(),1,"Volumentrend muss im Dashboard liegen");
    assert.equal(await page.locator("#view-history #chart-holder").count(),0,"Historie darf den Volumentrend nicht mehr enthalten");
    assert.ok(await page.locator("#dash-records .record-row").count()>=1,"Dashboard muss persönliche Übungsrekorde anzeigen");
    assert.equal(await page.evaluate(()=>!!(document.querySelector("#dash-plan").closest(".card").compareDocumentPosition(document.querySelector("#dash-records").closest(".card"))&Node.DOCUMENT_POSITION_FOLLOWING)),true,"Persönliche Rekorde müssen unter dem Trainingsplan stehen");
    await page.locator('[data-dash-toggle="2"]').click();
    assert.equal(await page.locator("#view-dashboard").getAttribute("class"),"view active","Planvorschau darf nicht direkt ins Training springen");
    assert.ok(await page.locator('.dash-day-card.expanded .dash-ex-preview').count()>=1,"Aufgeklappter Plan muss seine Übungen zeigen");
    await page.locator('[data-dash-toggle="1"]').click();
    assert.equal(await page.locator('.dash-day-card.expanded').count(),1,"Nur eine Plankarte darf gleichzeitig offen sein");
    assert.equal(await page.locator('[data-dash-toggle="2"]').getAttribute("aria-expanded"),"false","Die zuvor offene Plankarte muss zuklappen");
    await page.locator('[data-dash-edit-day="1"]').click();
    const dashboardOriginal=await page.locator('.dash-plan-editor [data-dash-plan-select="0"]').textContent();
    await page.locator('.dash-plan-editor [data-dash-plan-select="0"]').click();
    await page.locator('[data-library-id="hack-squat"]').click();
    assert.match(await page.locator('.dash-plan-editor [data-dash-plan-select="0"]').textContent(),/Hackenschmidt/,"Planbearbeitung muss direkt im Dashboard funktionieren");
    await page.locator("#dash-plan-cancel").click();
    await page.locator("#m-ok").click();
    await page.locator('[data-dash-edit-day="1"]').click();
    assert.equal(await page.locator('.dash-plan-editor [data-dash-plan-select="0"]').textContent(),dashboardOriginal,"Verwerfen darf den aktiven Plan nicht verändern");
    await page.locator("#dash-plan-cancel").click();
    if(process.env.VISUAL_CHECK) await page.screenshot({path:path.join(os.tmpdir(),"hesselink-dashboard-plan-920.png"),fullPage:true});
    await page.locator("#dash-start").click();

    await page.locator('.tab[data-view="history"]').click();
    assert.equal(await page.locator('.hist-item.open').count(),0,"Historie muss zunächst kompakt sein");
    await page.locator('[data-history-toggle="1"]').click();
    assert.equal(await page.locator('.hist-item.open').count(),1,"Eine Historienkarte muss gezielt aufklappbar sein");
    assert.ok(await page.locator('.hist-item.open .hist-set').count()>=2,"Arbeitssätze müssen vertikal lesbar sein");
    if(process.env.VISUAL_CHECK) await page.screenshot({path:path.join(os.tmpdir(),"hesselink-history-accordion-920.png"),fullPage:true});
    await page.locator("#history-data-toggle").click();
    const downloadPromise=page.waitForEvent("download");
    await page.locator("#btn-backup").click();
    const download=await downloadPromise;
    const downloadPath=await download.path();
    const backup=JSON.parse(fs.readFileSync(downloadPath,"utf8"));
    assert.equal(backup.version,5);
    assert.equal(backup.activeDay,"2");
    assert.equal(backup.drafts["2"].activeExIdx,2);
    assert.equal(backup.drafts["2"].exerciseOverrides["2"].n,"Rudern Maschine");
    assert.ok(backup.timer.endAt>Date.now(),"Laufender Timer muss im Backup enthalten sein");

    backup.log.push(sampleLog(2,"imported"));
    await page.evaluate(({draft,log})=>{
      localStorage.setItem("hesselink_beta_draft_v1",JSON.stringify({2:draft}));
      localStorage.setItem("hesselink_beta_log_v2",JSON.stringify([log]));
    },{draft:sampleDraft("99"),log:sampleLog(1,"local wins")});
    const warning=await importBackup(page,backup,"hesselink-beta-v5-regression.json");
    assert.match(warning,/lokaler Trainingsentwurf wird dabei ersetzt/);

    const restored=await page.evaluate(()=>({
      drafts:JSON.parse(localStorage.getItem("hesselink_beta_draft_v1")),
      log:JSON.parse(localStorage.getItem("hesselink_beta_log_v2")),
      timer:JSON.parse(localStorage.getItem("hesselink_beta_timer_v1")),
    }));
    assert.equal(restored.drafts["2"].weight,"82","Backup-Entwurf muss lokalen Konflikt ersetzen");
    assert.deepEqual(restored.log.map(x=>x.id).sort(),[1,2],"Historie muss ohne Duplikate zusammengeführt werden");
    assert.equal(restored.log.find(x=>x.id===1).note,"local wins","Bestehende Historie darf nicht überschrieben werden");
    assert.ok(restored.timer.endAt>Date.now(),"Laufender Pausentimer muss wiederhergestellt werden");
    assert.equal(await page.evaluate(()=>restorableBackupTimer({endAt:Date.now()-1,tIdx:0,timerExIdx:"2"})),null,"Abgelaufene Timer dürfen nicht wiederhergestellt werden");

    await page.locator('.tab[data-view="history"]').click();
    await page.locator('[data-history-toggle="1"]').click();
    await page.locator('[data-edit="1"]').click();
    assert.equal(await page.locator("#ex-container .ex.compact").count(),0,"Historieneditor muss alle Übungen öffnen");
    assert.equal(await page.getByText("Übung abschließen",{exact:true}).count(),0,"Historieneditor darf keinen Übungsabschluss verlangen");
    await page.locator("#btn-clear").click();

    const beforeLegacy=await page.evaluate(()=>JSON.parse(localStorage.getItem("hesselink_beta_draft_v1")));
    const legacy={...backup,version:4};
    delete legacy.drafts; delete legacy.timer; delete legacy.activeDay;
    const legacyWarning=await importBackup(page,legacy,"hesselink-beta-v4-regression.json");
    assert.match(legacyWarning,/ältere Backup enthält keine laufenden Workouts/);
    const afterLegacy=await page.evaluate(()=>JSON.parse(localStorage.getItem("hesselink_beta_draft_v1")));
    assert.deepEqual(afterLegacy,beforeLegacy,"Ältere Backups dürfen lokale Entwürfe nicht löschen");

    const freshTrainingContext=await browser.newContext({viewport:{width:390,height:844}});
    await freshTrainingContext.addInitScript(()=>localStorage.setItem("hesselink_beta_onboarding_v1",JSON.stringify({completed:true,version:1})));
    const freshTrainingPage=await freshTrainingContext.newPage();
    const freshTrainingErrors=[];
    freshTrainingPage.on("pageerror",error=>freshTrainingErrors.push(error.message));
    await freshTrainingPage.goto(`http://127.0.0.1:${address.port}/`,{waitUntil:"load"});
    await freshTrainingPage.locator('.tab[data-view="log"]').click();
    const expectedToday=await freshTrainingPage.evaluate(()=>todayISO());
    assert.equal(await freshTrainingPage.locator("#f-date").inputValue(),expectedToday,"Ein frisches Training muss das lokale Tagesdatum vorbelegen");
    await freshTrainingPage.locator("#session-toggle").click();
    const sessionFieldTops=await freshTrainingPage.evaluate(()=>["f-date","f-weight","f-energy"].map(id=>document.getElementById(id).getBoundingClientRect().top));
    assert.ok(Math.max(...sessionFieldTops)-Math.min(...sessionFieldTops)<=1,"Datum, Körpergewicht und Energie/Schlaf müssen bündig ausgerichtet sein");
    await freshTrainingPage.evaluate(()=>document.getElementById("f-date").value="");
    await freshTrainingPage.locator('.tab[data-view="dashboard"]').click();
    await freshTrainingPage.locator('.tab[data-view="log"]').click();
    assert.equal(await freshTrainingPage.locator("#f-date").inputValue(),expectedToday,"Ein leeres Datumsfeld muss beim erneuten Öffnen abgesichert werden");
    const freshExerciseCount=await freshTrainingPage.locator("#ex-container .ex").count();
    assert.equal(await freshTrainingPage.locator("#ex-container .ex.compact").count(),freshExerciseCount,"Ein frisches Training muss mit vollständig eingeklappten Übungen starten");
    assert.equal(await freshTrainingPage.locator('.ex[data-i="1"] .ex-summary').isHidden(),true,"Der Zielbereich darf bei einer unangetasteten kompakten Übung nicht doppelt erscheinen");
    if(process.env.VISUAL_CHECK) await freshTrainingPage.screenshot({path:path.join(os.tmpdir(),"hesselink-session-layout-923.png"),fullPage:false});
    if(process.env.VISUAL_CHECK) await freshTrainingPage.screenshot({path:path.join(os.tmpdir(),"hesselink-training-collapsed-921.png"),fullPage:true});
    await freshTrainingPage.locator('.ex[data-i="0"] .ex-num').click();
    assert.equal(await freshTrainingPage.locator("#ex-container .ex:not(.compact)").count(),1,"Der erste Tipp muss genau eine Übung öffnen");
    await freshTrainingPage.locator('.ex[data-i="1"] .ex-num').click();
    assert.equal(await freshTrainingPage.locator("#ex-container .ex:not(.compact)").count(),2,"Eine zweite Übung muss parallel geöffnet werden können");
    const plannedExerciseCount=await freshTrainingPage.evaluate(()=>templates[currentDay].length);
    await freshTrainingPage.locator("#btn-add-ex").click();
    assert.equal(await freshTrainingPage.locator("#library-title").textContent(),"Zusätzliche Übung wählen","Der Hinzufügen-Button muss die gemeinsame Übungsbibliothek öffnen");
    await freshTrainingPage.locator('[data-library-id="lateral-raise"]').click();
    assert.equal(await freshTrainingPage.locator("#ex-container .ex").count(),plannedExerciseCount+1,"Die Bibliotheksübung muss als zusätzliche Trainingskarte erscheinen");
    assert.match(await freshTrainingPage.locator(`.ex[data-i="${plannedExerciseCount}"]`).textContent(),/Seitheben/);
    assert.match(await freshTrainingPage.locator(`.ex[data-i="${plannedExerciseCount}"] .temporary-ex-note`).textContent(),/Zusätzlich nur für heute/);
    if(process.env.VISUAL_CHECK) await freshTrainingPage.screenshot({path:path.join(os.tmpdir(),"hesselink-training-add-exercise-922.png"),fullPage:true});
    assert.equal(await freshTrainingPage.evaluate(()=>templates[currentDay].length),plannedExerciseCount,"Eine zusätzliche Tagesübung darf den dauerhaften Plan nicht verändern");
    assert.equal(await freshTrainingPage.evaluate(index=>JSON.parse(localStorage.getItem("hesselink_beta_draft_v1"))[currentDay].exerciseOverrides[index].n,plannedExerciseCount),"Seitheben","Zusätzliche Übung muss sofort im Entwurf gespeichert werden");
    await freshTrainingPage.reload({waitUntil:"load"});
    await freshTrainingPage.locator('.tab[data-view="log"]').click();
    assert.match(await freshTrainingPage.locator(`.ex[data-i="${plannedExerciseCount}"]`).textContent(),/Seitheben/,"Zusätzliche Übung muss nach Neuladen erhalten bleiben");
    await freshTrainingPage.locator("#btn-add-ex").click();
    await freshTrainingPage.locator("#library-custom").click();
    const customIndex=plannedExerciseCount+1;
    const customInput=freshTrainingPage.locator(`.ex[data-i="${customIndex}"] .ex-name-inp`);
    await customInput.fill("Farmer Walk");
    await customInput.blur();
    assert.equal(await freshTrainingPage.evaluate(index=>JSON.parse(localStorage.getItem("hesselink_beta_draft_v1"))[currentDay].exerciseOverrides[index].n,customIndex),"Farmer Walk","Eigene zusätzliche Übung muss im Entwurf gespeichert werden");
    await freshTrainingPage.locator(`input[data-ex="${plannedExerciseCount}"][data-f="kg1"]`).fill("12.5");
    await freshTrainingPage.locator(`input[data-ex="${plannedExerciseCount}"][data-f="wdh1"]`).fill("15");
    await freshTrainingPage.locator("#btn-save").click();
    await freshTrainingPage.locator("#m-ok").click();
    assert.equal(await freshTrainingPage.evaluate(()=>JSON.parse(localStorage.getItem("hesselink_beta_log_v2")).at(-1).sets.some(set=>set.name==="Seitheben"&&set.workSets?.[0]?.kg==="12.5")),true,"Bearbeitete zusätzliche Übung muss in der Historie gespeichert werden");
    assert.deepEqual(freshTrainingErrors,[],`Frisches Training – Browserfehler: ${freshTrainingErrors.join(" | ")}`);
    await freshTrainingContext.close();

    const parallelContext=await browser.newContext({viewport:{width:390,height:844}});
    await parallelContext.addInitScript(()=>{
      localStorage.setItem("hesselink_beta_onboarding_v1",JSON.stringify({completed:true,version:1}));
      localStorage.setItem("hesselink_beta_theme_v1","light");
    });
    const parallelPage=await parallelContext.newPage();
    const parallelErrors=[];
    parallelPage.on("pageerror",error=>parallelErrors.push(error.message));
    await parallelPage.goto(`http://127.0.0.1:${address.port}/`,{waitUntil:"load"});
    await parallelPage.locator('.tab[data-view="log"]').click();
    await parallelPage.evaluate(()=>{
      const day=planConfig.dayOrder[0], exercises=templates[day];
      const makeSet=(exercise,kg)=>({name:exercise.n,goal:exercise.goal,wkg:String(+kg-10),wwdh:"12",workSets:[{kg:String(kg),reps:"12"},{kg:String(kg),reps:"11"}],setCount:2,done:true,touched:true});
      saveLog([
        {id:100,date:"2026-08-10",day,dayName:planConfig.dayNames[day],planVersionId:planConfig.versionId,sets:[makeSet(exercises[0],77.5),makeSet(exercises[1],35)]},
        {id:101,date:"2026-08-12",day,dayName:planConfig.dayNames[day],planVersionId:planConfig.versionId,sets:[makeSet(exercises[0],80)]},
      ]);
      currentDay=day; activeExIdx=-1; openExIndices=new Set();
      renderDayPicker(); renderExercises();
    });
    await parallelPage.locator('.ex[data-i="0"] .ex-top').click();
    assert.equal(await parallelPage.locator('.ex[data-i="0"] .last-box').isVisible(),true,"Die erste offene Übung muss ihre letzte Leistung sofort zeigen");
    assert.match(await parallelPage.locator('.ex[data-i="0"] .last-v').textContent(),/80 kg/,"Die jüngste passende Leistung muss verwendet werden");
    await parallelPage.locator('.ex[data-i="1"] .ex-top').click();
    assert.equal(await parallelPage.locator('.ex[data-i="1"] .last-box').isVisible(),true,"Eine parallel geöffnete zweite Übung muss ihre letzte Leistung sofort zeigen");
    assert.match(await parallelPage.locator('.ex[data-i="1"] .last-v').textContent(),/35 kg/,"Bei einem unvollständigen jüngsten Workout muss der letzte passende Übungseintrag verwendet werden");
    assert.equal(await parallelPage.locator('#library-bg.show').count(),0,"Das parallele Öffnen darf die Übungsauswahl nicht starten");
    await parallelPage.locator('.ex[data-i="1"] .ex-top').click();
    assert.equal(await parallelPage.locator('.ex[data-i="1"]').evaluate(el=>el.classList.contains("compact")),true,"Ein weiterer Tipp auf den Kartenkopf muss die Übung einklappen");
    await parallelPage.locator('.ex[data-i="1"] .ex-top').click();
    await parallelPage.locator('.ex[data-i="1"] [data-swap-exercise="1"]').click();
    assert.equal(await parallelPage.locator("#modal-bg.show").count(),1,"Nur der Tauschen-Button darf den Sicherheitsdialog öffnen");
    await parallelPage.locator("#m-cancel").click();
    const navigationColors=await parallelPage.evaluate(()=>({tabs:getComputedStyle(document.querySelector(".tabs")).backgroundColor,safe:getComputedStyle(document.querySelector(".tabs"),"::before").backgroundColor}));
    assert.doesNotMatch(navigationColors.tabs,/rgba\([^)]*,\s*0?\.[0-9]+\)/,"Die Navigation muss vollständig deckend sein");
    assert.doesNotMatch(navigationColors.safe,/rgba\([^)]*,\s*0?\.[0-9]+\)/,"Der obere Sicherheitsbereich muss vollständig deckend sein");
    const goalBadge=await parallelPage.locator('.ex[data-i="0"] .ex-goal-badge').evaluate(el=>{
      const style=getComputedStyle(el), canvas=document.createElement("canvas"), ctx=canvas.getContext("2d");
      ctx.font=style.font;
      return {value:el.textContent,font:parseFloat(style.fontSize),width:el.getBoundingClientRect().width,textWidth:ctx.measureText(el.textContent).width,padding:parseFloat(style.paddingLeft)+parseFloat(style.paddingRight)};
    });
    assert.equal(goalBadge.value,"10–15");
    assert.ok(goalBadge.font<=10&&goalBadge.width<=48&&goalBadge.textWidth+goalBadge.padding<=goalBadge.width,`Der Zielbereich muss kompakt und vollständig sichtbar sein: ${JSON.stringify(goalBadge)}`);
    const lightContrast=await parallelPage.locator('.ex[data-i="0"] .last-box').evaluate(el=>({background:getComputedStyle(el).backgroundColor,text:getComputedStyle(el.querySelector(".last-v")).color,button:getComputedStyle(el.querySelector(".last-copy")).color}));
    assert.notEqual(lightContrast.background,lightContrast.text,"Die letzte Leistung muss im Hellmodus einen klaren Kontrast besitzen");
    if(process.env.VISUAL_CHECK) await parallelPage.screenshot({path:path.join(os.tmpdir(),"hesselink-parallel-training-light-924.png"),fullPage:false});
    assert.deepEqual(parallelErrors,[],`Paralleles Training – Browserfehler: ${parallelErrors.join(" | ")}`);
    await parallelContext.close();

    const onboardingContext=await browser.newContext({viewport:{width:320,height:700}});
    const onboardingPage=await onboardingContext.newPage();
    const onboardingErrors=[];
    onboardingPage.on("pageerror",error=>onboardingErrors.push(error.message));
    await onboardingPage.goto(`http://127.0.0.1:${address.port}/`,{waitUntil:"load"});
    await onboardingPage.locator("#onboarding-bg.show").waitFor();
    if(process.env.VISUAL_CHECK) await onboardingPage.screenshot({path:path.join(os.tmpdir(),"hesselink-onboarding-919.png"),fullPage:false});
    /* Schritt 1: Hell/Dunkel, "Automatisch" ist vorausgewählt. */
    assert.match(await onboardingPage.locator("#onboarding-step").textContent(),/Schritt 1 von 5/,
      "Die Einrichtung muss fünf Schritte haben");
    assert.equal(await onboardingPage.locator('[data-onboarding-theme="auto"].active').count(),1,
      "Ohne eigene Wahl muss der automatische Modus vorausgewählt sein");
    await onboardingPage.locator('[data-onboarding-theme="light"]').click();
    assert.equal(await onboardingPage.evaluate(()=>document.documentElement.dataset.theme),"light",
      "Die Wahl im Onboarding muss sofort wirken");
    await onboardingPage.locator("#onboarding-next").click();

    await onboardingPage.locator('[data-onboarding-days="3"]').click();
    await onboardingPage.locator("#onboarding-next").click();

    /* Schritt 3 muss zeigen, was die Anzahl konkret bedeutet. */
    assert.match(await onboardingPage.locator('[data-onboarding-workouts="2"]').textContent(),
      /Woche 1: A · B · A → Woche 2: B · A · B/,
      "Die Workout-Anzahl muss ihre Rotation über die gewählten Trainingstage zeigen");
    assert.match(await onboardingPage.locator('[data-onboarding-workouts="1"]').textContent(),
      /Jedes Mal dasselbe Workout · 3× pro Woche/,
      "Ein einzelnes Workout muss verständlich beschrieben sein");
    assert.match(await onboardingPage.locator('[data-onboarding-workouts="3"]').textContent(),
      /Jede Woche: A · B · C/,
      "Bei gleichbleibender Reihenfolge darf keine zweite Woche angezeigt werden");
    await onboardingPage.locator('[data-onboarding-workouts="2"]').click();
    await onboardingPage.locator("#onboarding-next").click();
    if(process.env.VISUAL_CHECK) await onboardingPage.screenshot({path:path.join(os.tmpdir(),"hesselink-onboarding-plans-919.png"),fullPage:false});
    assert.equal(await onboardingPage.locator("[data-onboarding-preset]").count(),4,"Bei zwei Workouts müssen drei Vorlagen und ein individueller Plan angeboten werden");
    assert.equal(await onboardingPage.locator('[data-onboarding-preset="fullbody2"] .onboarding-plan-badge').textContent(),"Empfohlen");
    await onboardingPage.locator('[data-onboarding-preset="upperlower2"]').click();
    assert.match(await onboardingPage.locator('[data-onboarding-preset="upperlower2"]').textContent(),/Oberkörper/);
    assert.match(await onboardingPage.locator('[data-onboarding-preset="upperlower2"]').textContent(),/Beinpresse/);
    await onboardingPage.locator('[data-onboarding-preset="fullbody2"]').click();
    await onboardingPage.locator("#onboarding-next").click();
    if(process.env.VISUAL_CHECK) await onboardingPage.screenshot({path:path.join(os.tmpdir(),"hesselink-onboarding-review-919.png"),fullPage:false});
    assert.equal(await onboardingPage.locator("#onboarding-bg").isVisible(),true,"Vor der Übernahme muss die Planprüfung sichtbar bleiben");
    assert.match(await onboardingPage.locator("#onboarding-preview").textContent(),/Ganzkörper A/);
    assert.match(await onboardingPage.locator("#onboarding-preview").textContent(),/Ganzkörper B/);
    assert.equal(await onboardingPage.locator("#onboarding-adjust").isVisible(),true,"Direkte Übungsanpassung muss angeboten werden");
    await onboardingPage.locator("#onboarding-adjust").click();
    if(process.env.VISUAL_CHECK) await onboardingPage.screenshot({path:path.join(os.tmpdir(),"hesselink-onboarding-editor-919.png"),fullPage:false});
    await onboardingPage.locator('[data-onboarding-select="0"]').click();
    await onboardingPage.locator('[data-library-id="hack-squat"]').click();
    assert.match(await onboardingPage.locator('[data-onboarding-select="0"]').textContent(),/Hackenschmidt/);
    assert.equal(await onboardingPage.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,"Onboarding-Editor darf bei 320 px nicht horizontal überlaufen");
    await onboardingPage.locator("#onboarding-next").click();
    await onboardingPage.locator("#onboarding-bg").waitFor({state:"hidden"});
    const onboardingPlan=await onboardingPage.evaluate(()=>JSON.parse(localStorage.getItem("hesselink_beta_plan_config_v1")));
    assert.equal(onboardingPlan.weeklyTarget,3,"Wochenziel muss unabhängig vom 2er-Split gespeichert werden");
    assert.equal(onboardingPlan.dayOrder.length,2,"Die Zahl unterschiedlicher Workouts muss erhalten bleiben");
    await onboardingPage.evaluate(()=>{
      const plan=JSON.parse(localStorage.getItem("hesselink_beta_plan_config_v1"));
      localStorage.setItem("hesselink_beta_log_v2",JSON.stringify([
        {id:1,day:"1",date:"2026-08-10",planVersionId:plan.versionId,sets:[]},
        {id:2,day:"2",date:"2026-08-12",planVersionId:plan.versionId,sets:[]},
      ]));
    });
    assert.equal(await onboardingPage.evaluate(()=>nextPlannedDay()),"1","A/B muss über den Wochenverlauf fortlaufend rotieren");
    assert.equal(await onboardingPage.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,"Onboarding darf bei 320 px nicht horizontal überlaufen");
    assert.deepEqual(onboardingErrors,[],`Onboarding-Browserfehler: ${onboardingErrors.join(" | ")}`);
    await onboardingContext.close();

    const customContext=await browser.newContext({viewport:{width:320,height:700}});
    const customPage=await customContext.newPage();
    const customErrors=[];
    customPage.on("pageerror",error=>customErrors.push(error.message));
    await customPage.goto(`http://127.0.0.1:${address.port}/`,{waitUntil:"load"});
    await customPage.locator("#onboarding-next").click();   // Theme-Schritt mit "Automatisch" übernehmen
    await customPage.locator('[data-onboarding-days="3"]').click();
    await customPage.locator("#onboarding-next").click();
    await customPage.locator('[data-onboarding-workouts="3"]').click();
    await customPage.locator("#onboarding-next").click();
    await customPage.locator('[data-onboarding-preset="custom"]').click();
    await customPage.locator("#onboarding-next").click();
    assert.equal(await customPage.locator("[data-onboarding-plan-day]").count(),3,"Individueller Plan muss die gewählte Workout-Anzahl anlegen");
    assert.equal(await customPage.locator("#onboarding-workout-name").evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=16),true,"Workout-Name darf auf dem iPhone keinen Zoom auslösen");
    await customPage.locator("#onboarding-workout-name").fill("Push individuell");
    await customPage.locator('[data-onboarding-select="0"]').click();
    await customPage.locator('[data-library-id="bench-machine"]').click();
    await customPage.locator('[data-onboarding-plan-day="2"]').click();
    await customPage.waitForTimeout(30);
    await customPage.locator("#onboarding-workout-name").fill("Pull individuell");
    await customPage.locator('[data-onboarding-select="0"]').click();
    await customPage.locator('[data-library-id="lat-wide"]').click();
    await customPage.locator('[data-onboarding-plan-day="3"]').click();
    await customPage.waitForTimeout(30);
    await customPage.locator("#onboarding-workout-name").fill("Beine individuell");
    await customPage.locator('[data-onboarding-select="0"]').click();
    await customPage.locator('[data-library-id="leg-press"]').click();
    assert.equal(await customPage.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,"Individueller Editor darf bei 320 px nicht horizontal überlaufen");
    if(process.env.VISUAL_CHECK) await customPage.screenshot({path:path.join(os.tmpdir(),"hesselink-onboarding-custom-919.png"),fullPage:false});
    await customPage.locator("#onboarding-next").click();
    await customPage.locator("#onboarding-bg").waitFor({state:"hidden"});
    const customPlan=await customPage.evaluate(()=>JSON.parse(localStorage.getItem("hesselink_beta_plan_config_v1")));
    assert.equal(customPlan.id,"custom");
    assert.deepEqual(customPlan.dayOrder,["1","2","3"]);
    assert.deepEqual(customPlan.dayNames,{"1":"Push individuell","2":"Pull individuell","3":"Beine individuell"});
    assert.deepEqual(customErrors,[],`Individuelles Onboarding – Browserfehler: ${customErrors.join(" | ")}`);
    await customContext.close();

    const historyContext=await browser.newContext({viewport:{width:320,height:700}});
    await historyContext.addInitScript(()=>localStorage.setItem("hesselink_beta_onboarding_v1",JSON.stringify({completed:true,version:1})));
    const historyPage=await historyContext.newPage();
    const historyErrors=[];
    historyPage.on("pageerror",error=>historyErrors.push(error.message));
    await historyPage.goto(`http://127.0.0.1:${address.port}/`,{waitUntil:"load"});
    await historyPage.locator('.tab[data-view="history"]').click();
    await historyPage.locator("#history-data-toggle").click();
    await historyPage.locator("#btn-demo-load").click();
    await historyPage.locator("#m-ok").click();
    await historyPage.locator('.hist-toggle',{hasText:"Day 2"}).first().click();
    assert.equal(await historyPage.locator('.hist-item.open').count(),1,"Auch Demo-Historie darf nur eine offene Einheit zeigen");
    assert.ok(await historyPage.locator('.hist-item.open .hist-warm').count()>=1,"Warm-up muss eine eigene Zeile erhalten");
    const historyLayout=await historyPage.locator('.hist-item.open .hist-ex').first().evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth,headBottom:el.querySelector('.hist-ex-head').getBoundingClientRect().bottom,warmTop:el.querySelector('.hist-warm').getBoundingClientRect().top}));
    assert.ok(historyLayout.scroll<=historyLayout.client,"Historienübungen dürfen bei 320 px nicht horizontal überlaufen");
    assert.ok(historyLayout.warmTop>=historyLayout.headBottom,"Warm-up darf den Übungsnamen nicht überlagern");
    if(process.env.VISUAL_CHECK) await historyPage.screenshot({path:path.join(os.tmpdir(),"hesselink-history-demo-320-920.png"),fullPage:true});
    assert.deepEqual(historyErrors,[],`Historien-Browserfehler: ${historyErrors.join(" | ")}`);
    await historyContext.close();

    const liveImportContext=await browser.newContext({viewport:{width:390,height:844}});
    const liveImportPage=await liveImportContext.newPage();
    const liveImportErrors=[];
    liveImportPage.on("pageerror",error=>liveImportErrors.push(error.message));
    await liveImportPage.goto(`http://127.0.0.1:${address.port}/`,{waitUntil:"load"});
    await liveImportPage.locator("#onboarding-back").click();
    await liveImportPage.locator('.tab[data-view="history"]').click();
    const syntheticLivePayload={app:"hesselink",version:3,exported:"2026-08-16T19:08:27.875Z",
      templates:{
        "1":[{n:"Beinpresse",goal:"10–15"},{n:"Bankdrücken (Maschine)",goal:"8–12"}],
        "2":[{n:"Beinpresse",goal:"10–15"},{n:"Butterfly",goal:"8–12"}],
      },
      log:[sampleLog(1786683066909,"Live-v3-Import")],
    };
    const livePayload=process.env.LIVE_BACKUP_PATH
      ? JSON.parse(fs.readFileSync(process.env.LIVE_BACKUP_PATH,"utf8"))
      : syntheticLivePayload;
    const liveWarning=await importBackup(liveImportPage,livePayload,"hesselink-live-v3-regression.json");
    assert.match(liveWarning,/ältere Backup enthält keine laufenden Workouts/);
    const liveImported=await liveImportPage.evaluate(()=>(
      {log:JSON.parse(localStorage.getItem("hesselink_beta_log_v2")),plan:JSON.parse(localStorage.getItem("hesselink_beta_plan_config_v1"))}
    ));
    assert.equal(liveImported.log.length,livePayload.log.length,"Live-v3-Historie muss vollständig importiert werden");
    if(!process.env.LIVE_BACKUP_PATH) assert.equal(liveImported.log[0].note,"Live-v3-Import");
    assert.deepEqual(liveImported.plan.dayOrder,["1","2"],"Live-v3-Vorlagen müssen als 2-Tage-Plan übernommen werden");
    assert.deepEqual(liveImportErrors,[],`Live-Import-Browserfehler: ${liveImportErrors.join(" | ")}`);
    await liveImportContext.close();

    /* Planbearbeitung darf die Vorwerte nicht verstecken.
       Vor der Plan-Linie bekam jede Bearbeitung eine neue versionId – danach stand
       bei allen Übungen "Noch keine Werte", obwohl die Historie vorhanden war. */
    const planEditContext=await browser.newContext({viewport:{width:390,height:844}});
    await planEditContext.addInitScript(()=>{
      localStorage.setItem("hesselink_beta_onboarding_v1",JSON.stringify({completed:true,version:1}));
    });
    const planEditPage=await planEditContext.newPage();
    const planEditErrors=[];
    planEditPage.on("pageerror",error=>planEditErrors.push(error.message));
    await planEditPage.goto(`http://127.0.0.1:${address.port}/`,{waitUntil:"load"});
    await planEditPage.locator('.tab[data-view="log"]').click();
    await planEditPage.evaluate(()=>{
      const day=planConfig.dayOrder[0], exercises=templates[day];
      saveLog([{id:200,date:"2026-08-12",day,dayName:planConfig.dayNames[day],
        planVersionId:planConfig.versionId,planLineageId:planConfig.lineageId,
        sets:[{name:exercises[0].n,goal:exercises[0].goal,wkg:"70",wwdh:"12",
          workSets:[{kg:"80",reps:"12"},{kg:"80",reps:"11"}],setCount:2,done:true,touched:true}]}]);
      currentDay=day; activeExIdx=-1; openExIndices=new Set();
      renderDayPicker(); renderExercises();
    });
    await planEditPage.locator('.ex[data-i="0"] .ex-top').click();
    assert.match(await planEditPage.locator('.ex[data-i="0"] .last-v').textContent(),/80 kg/,
      "Vor der Planbearbeitung muss die letzte Leistung sichtbar sein");

    const planEditIds=await planEditPage.evaluate(async()=>{
      const before={version:planConfig.versionId,lineage:planConfig.lineageId};
      resetSetupPlanDraft();
      setupPlanDraft[planConfig.dayOrder[0]][1].n="Butterfly";   // eine Übung austauschen
      setupPlanDraft[planConfig.dayOrder[0]][1].id="chest-fly";
      setupPlanDirty=true;
      const pending=saveSetupPlanChanges("setup");   // kann nach einem Dialog fragen
      await new Promise(r=>setTimeout(r,80));
      if(document.querySelector("#modal-bg.show")) document.querySelector("#m-ok").click();
      await pending;
      return {before,after:{version:planConfig.versionId,lineage:planConfig.lineageId}};
    });
    assert.notEqual(planEditIds.after.version,planEditIds.before.version,
      "Eine Planbearbeitung muss eine neue Planversion erzeugen");
    assert.equal(planEditIds.after.lineage,planEditIds.before.lineage,
      "Eine Planbearbeitung darf die Plan-Linie nicht wechseln");

    await planEditPage.locator('.tab[data-view="log"]').click();
    await planEditPage.locator('.ex[data-i="0"] .ex-top').click();
    assert.equal(await planEditPage.locator('.ex[data-i="0"] .last-box').count(),1,
      "Nach einem Übungstausch im Setup müssen die Vorwerte der übrigen Übungen sichtbar bleiben");
    assert.match(await planEditPage.locator('.ex[data-i="0"] .last-v').textContent(),/80 kg/,
      "Nach einem Übungstausch muss weiterhin die richtige letzte Leistung stehen");

    /* Ein echter Splitwechsel soll dagegen weiterhin trennen. */
    const splitLineage=await planEditPage.evaluate(async()=>{
      const before=planConfig.lineageId;
      const pending=applySplitPreset("ppl3");        // wartet auf den Sicherheitsdialog
      await new Promise(r=>setTimeout(r,80));
      if(document.querySelector("#modal-bg.show")) document.querySelector("#m-ok").click();
      await pending;
      return {before,after:planConfig.lineageId,visible:loadLog().filter(belongsToCurrentPlan).length};
    });
    assert.notEqual(splitLineage.after,splitLineage.before,"Ein Splitwechsel muss eine neue Plan-Linie starten");
    assert.equal(splitLineage.visible,0,"Nach einem Splitwechsel darf die alte Linie nicht mitgezählt werden");
    assert.deepEqual(planEditErrors,[],`Planbearbeitungs-Browserfehler: ${planEditErrors.join(" | ")}`);
    await planEditContext.close();

    /* Öffnet eine Übungskarte nur, wenn sie zugeklappt ist – nach einem
       Neuladen kann sie aus dem Entwurf bereits offen wiederhergestellt sein. */
    const openExercise=async(page,i)=>{
      const card=page.locator(`.ex[data-i="${i}"]`);
      if(await card.evaluate(el=>el.classList.contains("compact"))) await card.locator(".ex-top").click();
      await page.locator(`.ex[data-i="${i}"] input[data-f="kg1"]`).waitFor({state:"visible"});
    };

    /* Übungsnotiz wandert mit, Abwärts-Empfehlung bei zweimal zu schwach. */
    const coachContext=await browser.newContext({viewport:{width:390,height:844}});
    await coachContext.addInitScript(()=>{
      localStorage.setItem("hesselink_beta_onboarding_v1",JSON.stringify({completed:true,version:1}));
    });
    const coachPage=await coachContext.newPage();
    const coachErrors=[];
    coachPage.on("pageerror",error=>coachErrors.push(error.message));
    await coachPage.goto(`http://127.0.0.1:${address.port}/`,{waitUntil:"load"});
    await coachPage.locator('.tab[data-view="log"]').click();

    /* Zwei schwache Einheiten der ersten Übung, plus eine Notiz in der jüngeren. */
    await coachPage.evaluate(()=>{
      const day=planConfig.dayOrder[0], ex=templates[day][0];
      const weak=(reps,note)=>({name:ex.n,goal:"8–12",wkg:"60",wwdh:"10",
        workSets:[{kg:"80",reps:String(reps)},{kg:"80",reps:String(reps-1)}],setCount:2,done:true,touched:true,
        ...(note?{exNote:note,exNoteDate:"2026-08-05"}:{})});
      saveLog([
        {id:300,date:"2026-08-10",day,dayName:planConfig.dayNames[day],
          planVersionId:planConfig.versionId,planLineageId:planConfig.lineageId,sets:[weak(6)]},
        {id:301,date:"2026-08-12",day,dayName:planConfig.dayNames[day],
          planVersionId:planConfig.versionId,planLineageId:planConfig.lineageId,sets:[weak(7,"Sitzhöhe 4 einstellen")]},
      ]);
      currentDay=day; activeExIdx=-1; openExIndices=new Set();
      renderDayPicker(); renderExercises();
    });
    await openExercise(coachPage,0);

    /* Der Zielbereich stammt bewusst aus dem aktuellen Plan, nicht aus dem alten Eintrag. */
    const planLow=await coachPage.evaluate(()=>goalLower(templates[planConfig.dayOrder[0]][0].goal));
    const badge=await coachPage.locator('.ex[data-i="0"] .prog-badge').textContent();
    assert.match(badge,new RegExp(`Zweimal unter ${planLow} Wdh`),
      "Nach zwei zu schwachen Einheiten muss weniger Gewicht vorgeschlagen werden");
    assert.match(badge,/77,5 kg/,"Der Vorschlag muss ein konkretes Gewicht in deutscher Schreibweise nennen");
    assert.equal(await coachPage.locator('.ex[data-i="0"] .prog-badge.down').count(),1,
      "Die Abwärts-Empfehlung muss als solche gekennzeichnet sein");

    /* Die Notiz der letzten Einheit steht im Feld und trägt ihr ursprüngliches Datum. */
    assert.equal(await coachPage.locator('.ex[data-i="0"] .ex-note-inp').inputValue(),"Sitzhöhe 4 einstellen",
      "Die Notiz der letzten Einheit muss im nächsten Training stehen");
    assert.match(await coachPage.locator('.ex[data-i="0"] .ex-note-lbl').textContent(),/Notiz vom 05\.08\./,
      "Die Notiz muss mit ihrem ursprünglichen Datum ausgewiesen werden");
    assert.match(await coachPage.locator('.ex[data-i="1"] .ex-note-lbl').textContent(),/Notiz fürs nächste Mal/,
      "Ohne Vorgeschichte muss das Notizfeld neutral beschriftet sein");

    /* Ohne Notiz bleibt die Karte ruhig: nur ein kleiner Knopf, kein Eingabefeld. */
    await coachPage.locator('.ex[data-i="1"] .ex-top').click();
    assert.equal(await coachPage.locator('.ex[data-i="1"] .ex-note-inp').isVisible(),false,
      "Ohne Notiz darf das Eingabefeld die Übungskarte nicht aufblähen");
    assert.equal(await coachPage.locator('.ex[data-i="1"] .ex-note-add').isVisible(),true,
      "Stattdessen muss ein unaufdringlicher Knopf angeboten werden");
    await coachPage.locator('.ex[data-i="1"] .ex-note-add').click();
    assert.equal(await coachPage.locator('.ex[data-i="1"] .ex-note-inp').isVisible(),true,
      "Der Knopf muss das Notizfeld öffnen");
    assert.equal(await coachPage.locator('.ex[data-i="0"] .ex-note-inp').isVisible(),true,
      "Eine mitgewanderte Notiz muss ohne Zutun sichtbar sein");

    /* Unverändert übernommene Notiz behält ihr Datum, geänderte bekommt ein neues. */
    const noteDates=await coachPage.evaluate(()=>{
      const unchanged=readSets(0).exNoteDate;
      const inp=document.querySelector('.ex[data-i="0"] .ex-note-inp');
      inp.value="jetzt doch Sitzhöhe 5";
      return {unchanged,changed:readSets(0).exNoteDate,heute:$("#f-date").value};
    });
    assert.equal(noteDates.unchanged,"2026-08-05","Eine unveränderte Notiz darf ihr Datum nicht verlieren");
    assert.equal(noteDates.changed,noteDates.heute,"Eine geänderte Notiz muss das heutige Datum bekommen");

    /* Eine Notiz allein darf beim Speichern nicht verlorengehen. */
    const notesSurvive=await coachPage.evaluate(()=>{
      const inp=document.querySelector('.ex[data-i="1"] .ex-note-inp');
      inp.value="Gerät war belegt";
      const src=workoutExerciseSource(currentDay);
      const all=src.map((ex,i)=>Object.assign({name:ex.n,goal:ex.goal||""},readSets(i)));
      return all.filter((s,i)=>!!document.querySelector(`.ex[data-i="${i}"].done`)
        ||!!document.querySelector(`.ex[data-i="${i}"] input[type=number][data-touched="1"]`)
        ||!!s.exNote).map(s=>s.exNote).filter(Boolean);
    });
    assert.ok(notesSurvive.includes("Gerät war belegt"),
      "Eine reine Notiz ohne eingetragene Werte muss mitgespeichert werden");
    assert.deepEqual(coachErrors,[],`Notiz-/Empfehlungs-Browserfehler: ${coachErrors.join(" | ")}`);
    await coachContext.close();

    /* Hinweise und Monatsrückblick im Dashboard. */
    const trendContext=await browser.newContext({viewport:{width:390,height:844}});
    await trendContext.addInitScript(()=>{
      localStorage.setItem("hesselink_beta_onboarding_v1",JSON.stringify({completed:true,version:1}));
    });
    const trendPage=await trendContext.newPage();
    const trendErrors=[];
    trendPage.on("pageerror",error=>trendErrors.push(error.message));
    await trendPage.goto(`http://127.0.0.1:${address.port}/`,{waitUntil:"load"});

    /* Ohne Vorgeschichte darf das Dashboard nicht mit Hinweisen zutexten. */
    assert.equal(await trendPage.locator("#dash-hints-card").isVisible(),false,
      "Ohne Auffälligkeiten muss die Hinweiskarte verborgen bleiben");
    assert.equal(await trendPage.locator("#dash-month-card").isVisible(),false,
      "Ohne Training in diesem Monat darf kein Monatsrückblick erscheinen");

    /* Beinpresse dreimal unverändert, Bankdrücken zuletzt schwächer, Latzug steigert sich. */
    await trendPage.evaluate(()=>{
      const day=planConfig.dayOrder[0], ex=templates[day];
      const s=(name,kg)=>({name,goal:"8–12",wkg:"40",wwdh:"10",
        workSets:[{kg:String(kg),reps:"10"},{kg:String(kg),reps:"9"}],setCount:2,done:true,touched:true});
      const einheit=(id,datum,werte)=>({id,date:datum,day,dayName:planConfig.dayNames[day],
        planVersionId:planConfig.versionId,planLineageId:planConfig.lineageId,sets:werte});
      const heute=new Date(), iso=t=>new Date(heute.getFullYear(),heute.getMonth(),heute.getDate()-t)
        .toISOString().slice(0,10);
      saveLog([
        einheit(1,iso(21),[s(ex[0].n,80), s(ex[1].n,60), s(ex[2].n,50)]),
        einheit(2,iso(14),[s(ex[0].n,80), s(ex[1].n,62.5), s(ex[2].n,52.5)]),
        einheit(3,iso(7), [s(ex[0].n,80), s(ex[1].n,62.5), s(ex[2].n,55)]),
        einheit(4,iso(1), [s(ex[0].n,80), s(ex[1].n,57.5), s(ex[2].n,57.5)]),
      ]);
      renderDashboard();
    });

    assert.equal(await trendPage.locator("#dash-hints-card").isVisible(),true,
      "Bei Auffälligkeiten muss die Hinweiskarte erscheinen");
    const hinweise=await trendPage.locator("#dash-hints").textContent();
    assert.match(hinweise,/Seit drei Einheiten unverändert/,
      "Eine seit drei Einheiten unveränderte Übung muss gemeldet werden");
    assert.match(hinweise,/Zuletzt ging es zurück/,
      "Eine zurückgegangene Übung muss gemeldet werden");
    assert.doesNotMatch(hinweise,/Latzug/,
      "Eine Übung, die sich steigert, darf keinen Hinweis erzeugen");
    assert.equal(await trendPage.locator("#dash-hints .hint-row.deload").count(),1,
      "Bei zwei betroffenen Übungen muss eine leichtere Woche vorgeschlagen werden");
    assert.match(await trendPage.locator("#dash-hints .hint-row.deload").textContent(),/normal und kein Rückschritt/,
      "Der Deload-Vorschlag muss einen Anfänger nicht verunsichern");

    /* Der Plan darf sich davon nicht von selbst verändern (Briefing 15). */
    const planVorher=await trendPage.evaluate(()=>JSON.stringify(templates));
    await trendPage.reload({waitUntil:"load"});
    assert.equal(await trendPage.evaluate(()=>JSON.stringify(templates)),planVorher,
      "Ein Deload-Vorschlag darf den Trainingsplan niemals selbst ändern");

    assert.equal(await trendPage.locator("#dash-month-card").isVisible(),true,
      "Mit Training im laufenden Monat muss der Rückblick erscheinen");
    assert.equal(await trendPage.locator(".month-cell").count(),3,
      "Der Rückblick zeigt Einheiten, Volumen und Bestleistungen");
    assert.match(await trendPage.locator("#dash-month-note").textContent(),/Einheit/,
      "Der Rückblick muss einen verständlichen Satz enthalten");
    assert.deepEqual(trendErrors,[],`Dashboard-Browserfehler: ${trendErrors.join(" | ")}`);
    await trendContext.close();

    /* Offline: Die App muss sich im Gym auch ohne Empfang öffnen lassen. */
    const offlineContext=await browser.newContext({viewport:{width:390,height:844}});
    await offlineContext.addInitScript(()=>{
      localStorage.setItem("hesselink_beta_onboarding_v1",JSON.stringify({completed:true,version:1}));
    });
    const offlinePage=await offlineContext.newPage();
    await offlinePage.goto(`http://127.0.0.1:${address.port}/`,{waitUntil:"load"});
    await offlinePage.waitForFunction(()=>navigator.serviceWorker.controller!==null,null,{timeout:15000});

    /* Ein Training anfangen, damit auch der Entwurf offline geprüft wird. */
    await offlinePage.locator('.tab[data-view="log"]').click();
    await openExercise(offlinePage,0);
    await offlinePage.locator('.ex[data-i="0"] input[data-f="kg1"]').fill("72.5");
    await offlinePage.locator('.ex[data-i="0"] input[data-f="wdh1"]').fill("10");
    await offlinePage.evaluate(()=>saveDraftNow());

    await offlineContext.setOffline(true);
    await offlinePage.reload({waitUntil:"load"});
    assert.equal(await offlinePage.locator("#view-dashboard").count(),1,
      "Die App muss sich ohne Empfang öffnen lassen");
    assert.match(await offlinePage.locator("#brand-sub").textContent(),/Trainingstagebuch/,
      "Ohne Empfang muss die App vollständig gerendert werden");

    /* Ohne Empfang weitertrainieren und speichern. */
    await offlinePage.locator('.tab[data-view="log"]').click();
    const offlineDraft=await offlinePage.evaluate(()=>{
      const drafts=loadDrafts(), day=Object.keys(drafts)[0];
      return day?(drafts[day].sets||[]).map(s=>(s.workSets||[]).map(w=>w.kg).join(",")).join("|"):"";
    });
    assert.match(offlineDraft,/72\.5/,"Der begonnene Entwurf muss offline erhalten bleiben");
    await openExercise(offlinePage,0);
    await offlinePage.locator('.ex[data-i="0"] input[data-f="wdh2"]').fill("9");
    await offlinePage.evaluate(()=>saveDraftNow());
    assert.match(await offlinePage.evaluate(()=>JSON.stringify(loadDrafts())),/"9"/,
      "Eingaben müssen auch ohne Empfang gespeichert werden");

    /* Kein Neulade-Karussell: Die Seite darf offline nicht in einer Schleife hängen. */
    await offlinePage.reload({waitUntil:"load"});
    assert.equal(await offlinePage.locator("#view-dashboard").count(),1,
      "Auch ein zweites Öffnen ohne Empfang muss funktionieren");
    await offlineContext.setOffline(false);
    await offlineContext.close();

    assert.deepEqual(errors,[],`Browserfehler: ${errors.join(" | ")}`);
    console.log("PASS: Backup v5/Live-v3, Onboarding, Zusatzübungen, Dashboard-Plan, Historie, Themes und Mobile-Flows");
  } finally {
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{ console.error(error); process.exit(1); });

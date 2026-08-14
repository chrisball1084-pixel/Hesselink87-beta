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

    await page.locator('.tab[data-view="setup"]').click();
    const setupHeadings=await page.locator('#view-setup .card-head h2').allTextContents();
    assert.deepEqual(setupHeadings,["Trainingssplit wählen","Trainingsplan anpassen"]);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,"Kein horizontaler Überlauf bei 390 px");
    await page.setViewportSize({width:320,height:700});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,"Kein horizontaler Überlauf bei 320 px");
    await page.setViewportSize({width:390,height:844});

    await page.locator('.tab[data-view="history"]').click();
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

    assert.deepEqual(errors,[],`Browserfehler: ${errors.join(" | ")}`);
    console.log("PASS: Backup v5, v4-Kompatibilität und kritische Mobile-Flows");
  } finally {
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{ console.error(error); process.exit(1); });

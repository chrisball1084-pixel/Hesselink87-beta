/* Hesselink87 Beta – Offline-Unterstützung
 *
 * Ziel: Die App muss sich im Gym auch ohne Empfang öffnen lassen.
 *
 * Strategie: Netz zuerst, Cache als Rückfall.
 *   - Mit Empfang kommt immer die frische Datei vom Server. Der bestehende
 *     APP_VERSION-Abgleich in der App bleibt dadurch wirksam; niemand hängt
 *     auf einer alten Version fest.
 *   - Ohne Empfang (oder bei sehr langsamer Verbindung) wird die zuletzt
 *     erfolgreich geladene Fassung aus dem Cache ausgeliefert.
 *
 * Die Trainingsdaten selbst liegen unverändert im localStorage und werden
 * hiervon nicht berührt.
 */

const CACHE = "hesselink-beta-shell";
const NETWORK_TIMEOUT_MS = 3000;

/* Der Cache-Schlüssel ignoriert die Query, damit der Cache-Buster "?_v=…"
   aus dem Versionsabgleich keine Doppeleinträge erzeugt. */
const cacheKeyFor = request => new URL(request.url).origin + new URL(request.url).pathname;

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.add(new Request("./", {cache:"no-store"}))).catch(()=>{})
  );
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

/* Die Seite selbst bewusst am HTTP-Cache vorbei holen.
   GitHub Pages liefert sie mit "Cache-Control: max-age=600" aus. Ohne diesen
   Umweg bekäme auch eine Online-Anfrage bis zu zehn Minuten lang die alte
   Fassung – und der Service Worker würde sie zusätzlich einlagern. Mit
   Empfang soll aber immer die aktuelle Fassung gewinnen. */
function netzAnfrage(request){
  return request.mode === "navigate"
    ? fetch(request.url, {cache:"no-store"})
    : fetch(request);
}

function fetchWithTimeout(request){
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), NETWORK_TIMEOUT_MS);
    netzAnfrage(request).then(response => { clearTimeout(timer); resolve(response); },
                             error    => { clearTimeout(timer); reject(error); });
  });
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if(request.method !== "GET") return;
  if(new URL(request.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    const key = cacheKeyFor(request);
    try{
      const response = await fetchWithTimeout(request);
      if(response && response.ok){
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(key, copy)).catch(()=>{});
      }
      return response;
    }catch(e){
      const cached = await caches.match(key);
      if(cached) return cached;
      /* Navigation ohne Netz und ohne Cache: wenigstens die Startseite versuchen. */
      if(request.mode === "navigate"){
        const shell = await caches.match(self.location.origin + self.location.pathname.replace(/sw\.js$/, ""));
        if(shell) return shell;
      }
      throw e;
    }
  })());
});

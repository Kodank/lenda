/* Lenda minimal service worker — cache app shell for offline-ish LAN/localhost use */
const CACHE = "lenda-shell-v3-career-complete-2";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/app.js",
  "./js/ui.js",
  "./js/data.js",
  "./js/engine.js",
  "./js/sim.js",
  "./js/career.js",
  "./js/card.js",
  "./js/rng.js",
  "./js/world.js",
  "./js/more_clubs.js",
  "./img/icons/icon-192.png",
  "./img/icons/icon-512.png",
  "./img/icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    caches.match(req).then((cached) => {
      const net = fetch(req).then((res) => {
        try {
          const url = new URL(req.url);
          if (url.origin === self.location.origin && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
        } catch (_) {}
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});

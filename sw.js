/* Lenda minimal service worker — cache app shell for offline-ish LAN/localhost use */
const CACHE = "lenda-shell-v18-pitch-fifa-2";
const SHELL = [
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/app.js",
  "./js/juice.js",
  "./js/ui.js",
  "./js/dev.js",
  "./js/data.js",
  "./js/engine.js",
  "./js/fun.js",
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

function isHtmlRequest(req) {
  if (req.mode === "navigate") return true;
  try {
    const url = new URL(req.url);
    const path = url.pathname;
    return path.endsWith("/") || path.endsWith("/index.html") || path.endsWith("index.html");
  } catch (_) {
    return false;
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  /* HTML: network-first so Pages updates are not stuck behind old shell */
  if (isHtmlRequest(req)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          try {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
          } catch (_) {}
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match("./index.html") || caches.match("./"))
        )
    );
    return;
  }

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

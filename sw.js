/* Lenda minimal service worker — cache app shell for offline-ish LAN/localhost use */
const TAG = "qa-pack-1";
const CACHE = "lenda-shell-v52-" + TAG;
/* Mesmas URLs que o index.html pede (com ?v=), senão o modo offline não acha nada no cache. */
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css?v=" + TAG,
  "./js/world.js?v=" + TAG,
  "./js/more_clubs.js?v=" + TAG,
  "./js/data.js?v=" + TAG,
  "./js/rng.js?v=" + TAG,
  "./js/engine.js?v=" + TAG,
  "./js/fun.js?v=" + TAG,
  "./js/sim.js?v=" + TAG,
  "./js/career.js?v=" + TAG,
  "./js/card.js?v=" + TAG,
  "./js/juice.js?v=" + TAG,
  "./js/ui.js?v=" + TAG,
  "./js/dev.js?v=" + TAG,
  "./js/app.js?v=" + TAG,
  "./img/icons/icon-192.png",
  "./img/icons/icon-512.png",
  "./img/icons/apple-touch-icon.png"
];

/* Primeiro acerto no cache: exato → mesmo arquivo sem ?v= → shell. */
function cacheFallback(req, extra) {
  return caches.match(req).then(function (hit) {
    if (hit) return hit;
    return caches.match(req, { ignoreSearch: true }).then(function (hit2) {
      if (hit2 || !extra) return hit2;
      return caches.match("./index.html").then(function (h3) {
        return h3 || caches.match("./");
      });
    });
  });
}

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
        .catch(() => cacheFallback(req, true))
    );
    return;
  }

  /* JS/CSS: network-first so balance/UI fixes are not stuck behind SW cache */
  try {
    const u = new URL(req.url);
    const p = u.pathname;
    if (p.includes("/js/") || p.includes("/css/") || p.endsWith("/sw.js")) {
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
          .catch(() => cacheFallback(req, false))
      );
      return;
    }
  } catch (_) {}

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
      }).catch(() => cached || caches.match(req, { ignoreSearch: true }));
      return cached || net;
    })
  );
});

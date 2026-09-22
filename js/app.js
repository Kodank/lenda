(function () {
  var saved = load();
  if (saved && saved.clubId) {
    S = saved;
    if (typeof ensureDestiny === "function") ensureDestiny(S);
    if (saved.retired) UI.screen = "legacy";
    else {
      UI.event = pickEvent(saved);
      UI.screen = "decision";
    }
  } else {
    UI.screen = "home";
  }
  render();
})();

/* Register SW from script (keeps CSP free of inline handlers). */
(function registerSw() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js?v=trophies-world-1").then(function (reg) {
      try { reg.update(); } catch (e) {}
    }).catch(function () {});
  });
})();

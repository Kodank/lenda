(function boot() {
  var root = document.getElementById("app");
  function fallback(msg) {
    /* Nunca tela em branco: sempre dá pra apagar o save quebrado. */
    UI.screen = "home";
    S = null;
    if (typeof showSaveNotice === "function") showSaveNotice(msg);
    try {
      render();
    } catch (e2) {
      if (root) {
        root.innerHTML = '<div class="home"><h1>LENDA</h1><p role="alert">' + msg + '</p>' +
          '<button class="btn danger" id="boot-reset" type="button">Reiniciar tudo</button></div>';
        var b = document.getElementById("boot-reset");
        if (b) b.onclick = function () {
          if (!window.confirm("Apagar a carreira salva e recomeçar do zero?")) return;
          try { clearSave(); } catch (e3) { try { localStorage.removeItem(SAVE_KEY); } catch (e4) {} }
          location.reload();
        };
      }
    }
  }
  try {
    var saved = load();
    if (saved) {
      S = saved;
      if (typeof ensureDestiny === "function") ensureDestiny(S);
      var notes = typeof migrateSaveIds === "function" ? migrateSaveIds(S) : [];
      if (notes.length && typeof showSaveNotice === "function") showSaveNotice(notes.join(" "));
      if (saved.retired) UI.screen = "legacy";
      else nextDecision();
    } else {
      UI.screen = "home";
      if (typeof hasBrokenSave === "function" && hasBrokenSave() && typeof showSaveNotice === "function") {
        showSaveNotice("Save inválido: não deu pra carregar a carreira. Use \u201cReiniciar tudo\u201d pra começar de novo.");
      }
    }
    render();
  } catch (e) {
    try { if (window.console) console.error(e); } catch (_) {}
    fallback("Save inválido: a carreira salva não abriu nesta versão. Use \u201cReiniciar tudo\u201d pra começar de novo.");
  }
})();

/* Register SW from script (keeps CSP free of inline handlers). */
(function registerSw() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js?v=qa-pack-1").then(function (reg) {
      try { reg.update(); } catch (e) {}
    }).catch(function () {});
  });
})();

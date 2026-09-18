(function () {
  var saved = load();
  if (saved && saved.clubId) {
    S = saved;
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

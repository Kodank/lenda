function downloadCard() {
  var s = S;
  var club = iconClub(s);
  var nat = nationOf(s.nation);
  var sc = finalScore(s);
  var ver = verdict(s, sc);
  var w = 1080, h = 1350;
  var cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  var ctx = cv.getContext("2d");
  var c1 = club.colors[0], c2 = club.colors[1];
  var ink = onColor(c1);

  var g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = ink === "#ffffff" ? "rgba(0,0,0,.18)" : "rgba(255,255,255,.12)";
  ctx.beginPath();
  ctx.moveTo(w * 0.45, -80);
  ctx.lineTo(w + 80, 200);
  ctx.lineTo(w + 80, h);
  ctx.lineTo(w * 0.2, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.55;
  ctx.font = "700 28px DM Sans, sans-serif";
  ctx.fillText("LENDA", 72, 78);
  ctx.globalAlpha = 1;

  ctx.font = "800 108px Barlow Condensed, sans-serif";
  ctx.fillText(s.name, 72, 220);
  ctx.globalAlpha = 0.85;
  ctx.font = "500 32px DM Sans, sans-serif";
  ctx.fillText(s.number + "   " + POS[s.pos].name + "   " + nat.name, 72, 270);
  ctx.fillText(club.name, 72, 312);
  ctx.globalAlpha = 1;

  ctx.textAlign = "right";
  ctx.font = "800 150px Barlow Condensed, sans-serif";
  ctx.fillText(String(s.peakOvr), w - 72, 220);
  ctx.font = "700 22px DM Sans, sans-serif";
  ctx.globalAlpha = 0.7;
  ctx.fillText("PICO", w - 72, 100);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";

  var gols = s.pos === "GOL" ? s.career.cs : s.career.goals;
  var ast = s.pos === "GOL" ? s.career.ga : s.career.assists;
  var labs = s.pos === "GOL" ? ["JOGOS", "CLEAN SHEETS", "SOFRIDOS"] : ["JOGOS", "GOLS", "ASSISTÊNCIAS"];
  var vals = [s.career.apps, gols, ast];
  var boxW = 300, gap = 24, x0 = 72, y0 = 360;
  for (var i = 0; i < 3; i++) {
    var x = x0 + i * (boxW + gap);
    ctx.fillStyle = "rgba(0,0,0,.22)";
    roundRect(ctx, x, y0, boxW, 150, 16);
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.font = "800 86px Barlow Condensed, sans-serif";
    ctx.fillText(String(vals[i]), x + 24, y0 + 100);
    ctx.globalAlpha = 0.7;
    ctx.font = "700 16px DM Sans, sans-serif";
    ctx.fillText(labs[i], x + 24, y0 + 128);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = "rgba(0,0,0,.22)";
  roundRect(ctx, 72, 540, 456, 300, 18);
  ctx.fill();
  roundRect(ctx, 552, 540, 456, 300, 18);
  ctx.fill();

  ctx.fillStyle = ink;
  ctx.font = "700 18px DM Sans, sans-serif";
  ctx.globalAlpha = 0.7;
  ctx.fillText("SELEÇÃO", 96, 580);
  ctx.fillText("PRÊMIOS INDIVIDUAIS", 576, 580);
  ctx.globalAlpha = 1;
  ctx.font = "800 84px Barlow Condensed, sans-serif";
  ctx.fillText(String(s.caps), 96, 680);
  ctx.font = "500 22px DM Sans, sans-serif";
  ctx.globalAlpha = 0.8;
  ctx.fillText(s.caps ? (s.pos === "GOL" ? s.ntCs + " clean sheets" : s.ntGoals + " gols") : "não convocado", 96, 730);
  ctx.globalAlpha = 1;

  var awards = indivAwards(s);
  ctx.font = "500 22px DM Sans, sans-serif";
  if (!awards.length) {
    ctx.globalAlpha = 0.65;
    ctx.fillText("nenhum prêmio", 576, 680);
    ctx.globalAlpha = 1;
  } else {
    for (var j = 0; j < Math.min(awards.length, 5); j++) {
      ctx.fillText((awards[j].n > 1 ? awards[j].n + "× " : "") + awards[j].meta.name, 576, 650 + j * 36);
    }
  }

  ctx.textAlign = "center";
  ctx.font = "800 56px Barlow Condensed, sans-serif";
  ctx.fillText(ver.toUpperCase(), w / 2, 980);
  ctx.globalAlpha = 0.75;
  ctx.font = "500 24px DM Sans, sans-serif";
  var yrs = s.seasons.length ? s.seasons[0].year + "–" + s.seasons[s.seasons.length - 1].year : "";
  ctx.fillText(yrs, w / 2, 1024);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";

  var names = clubAppsMap(s).map(function (c) { return clubOf(c.id).name; }).join("  →  ");
  Promise.all([loadImg(club.crest), loadImg(nat.flag)]).then(function (loaded) {
    if (loaded[0]) ctx.drawImage(loaded[0], 72, 1100, 88, 88);
    if (loaded[1]) ctx.drawImage(loaded[1], 72, 1204, 48, 32);
    ctx.font = "500 22px DM Sans, sans-serif";
    ctx.fillStyle = ink;
    ctx.fillText(names, 180, 1154);
    finish();
  }).catch(finish);

  function finish() {
    var a = document.createElement("a");
    a.href = cv.toDataURL("image/png");
    a.download = "lenda-" + s.name.toLowerCase() + ".png";
    a.click();
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadImg(src) {
  return new Promise(function (res) {
    var im = new Image();
    im.onload = function () { res(im); };
    im.onerror = function () { res(null); };
    im.src = src;
  });
}

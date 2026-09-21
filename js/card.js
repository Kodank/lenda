

function cardCrestSrc(path) {
  if (typeof crestSrc === "function") return crestSrc(path);
  return path || "img/clubs/fla.png";
}

function cardCrestInitials(name) {
  if (typeof crestInitials === "function") return crestInitials(name);
  var parts = String(name || "?").replace(/[^A-Za-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  var init = parts.map(function (w) { return w[0]; }).join("").slice(0, 2);
  return (init || "?").toUpperCase();
}

function cardOvrTierStyle(ovr) {
  if (typeof ovrTierStyle === "function") return ovrTierStyle(ovr);
  var n = +ovr || 0;
  if (n >= 99) return { color: "#ffffff", border: "rgba(255,255,255,.75)" };
  if (n >= 95) return { color: "#faf5ff", border: "rgba(255,200,255,.5)" };
  if (n >= 90) return { color: "#0c1a2e", border: "rgba(255,255,255,.7)" };
  if (n >= 80) return { color: "#1a1208", border: "rgba(255,230,150,.55)" };
  if (n >= 70) return { color: "#1a1f28", border: "rgba(255,255,255,.55)" };
  return { color: "#fff8ee", border: "rgba(255,220,180,.35)" };
}

function cardUniqueTrophyItems(ids) {
  if (typeof ccUniqueTrophyItems === "function") return ccUniqueTrophyItems(ids);
  var seen = {};
  var out = [];
  for (var i = 0; i < (ids || []).length; i++) {
    var id = ids[i];
    if (seen[id]) { seen[id].n++; continue; }
    seen[id] = { id: id, n: 1, meta: trophyOf(id) };
    out.push(seen[id]);
  }
  return out;
}

function downloadCard() {
  var s = S;
  if (!s) return;
  var btn = document.getElementById("dl");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Gerando…";
  }
  drawCareerCompleteCanvas(s)
    .then(function (cv) {
      triggerPngDownload(cv, s.name);
    })
    .catch(function (err) {
      console.error("downloadCard", err);
    })
    .then(function () {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Baixar quadro";
      }
    });
}

/**
 * Renders the Copero-style Career Complete summary (player / seleção / prêmios
 * + club grid) to a PNG canvas — same visual language as viewLegacy().
 */
function drawCareerCompleteCanvas(s) {
  var nat = nationOf(s.nation);
  var pos = POS[s.pos] || { short: s.pos, name: s.pos };
  var awards = showcaseIndivAwards(s);
  var ntCups = ntTrophiesList(s);
  var stints = clubStintsCareer(s);
  var sc = finalScore(s);
  var ver = verdict(s, sc);

  /* Logical layout size; backing store is × EXPORT_SCALE for sharp PNG. */
  var W = 1200;
  var EXPORT_SCALE = 2;
  var pad = 28;
  var gap = 12;
  var topH = 300;
  var clubCols = stints.length <= 1 ? 1 : stints.length === 2 ? 2 : stints.length === 3 ? 3 : 4;
  if (stints.length > 4) clubCols = 4;
  var clubW = stints.length
    ? (W - pad * 2 - gap * (clubCols - 1)) / clubCols
    : W - pad * 2;
  var clubH = 248;
  var clubRows = stints.length ? Math.ceil(stints.length / clubCols) : 0;
  var clubsBlock = stints.length
    ? clubRows * clubH + (clubRows - 1) * gap
    : 72;
  var H = pad + 28 + gap + topH + gap + clubsBlock + gap + 44 + pad;

  var cv = document.createElement("canvas");
  cv.width = Math.round(W * EXPORT_SCALE);
  cv.height = Math.round(H * EXPORT_SCALE);
  var ctx = cv.getContext("2d");
  ctx.setTransform(EXPORT_SCALE, 0, 0, EXPORT_SCALE, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.fillStyle = "#070809";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#a8b0bc";
  ctx.font = "700 13px DM Sans, sans-serif";
  ctx.fillText("LENDA", pad, pad + 14);

  var y0 = pad + 28 + gap;
  var inner = W - pad * 2;
  var totalFr = 1.35 + 1 + 0.85;
  var wPlayer = (inner - gap * 2) * (1.35 / totalFr);
  var wNt = (inner - gap * 2) * (1 / totalFr);
  var wAw = inner - wPlayer - wNt - gap * 2;
  var xPlayer = pad;
  var xNt = xPlayer + wPlayer + gap;
  var xAw = xNt + wNt + gap;

  drawCcCard(ctx, xPlayer, y0, wPlayer, topH);
  drawCcCard(ctx, xNt, y0, wNt, topH);
  drawCcCard(ctx, xAw, y0, wAw, topH);

  /* —— Player overview —— */
  drawKicker(ctx, xPlayer + 16, y0 + 24, "CARREIRA COMPLETA", "#a8b0bc");
  ctx.fillStyle = "#f4f6f8";
  ctx.font = "800 50px Barlow Condensed, sans-serif";
  var name = String(s.name || "").toUpperCase();
  fitText(ctx, name, xPlayer + 16, y0 + 80, wPlayer - 120, "800 ", "px Barlow Condensed, sans-serif", 50, 32);

  drawPill(ctx, xPlayer + 16, y0 + 96, "#" + s.number, false);
  var pillW = measurePill("#" + s.number);
  drawPill(ctx, xPlayer + 16 + pillW + 8, y0 + 96, String(pos.short), true);

  ctx.textAlign = "right";
  ctx.fillStyle = "#a8b0bc";
  ctx.font = "700 10px DM Sans, sans-serif";
  ctx.fillText("VALOR", xPlayer + wPlayer - 86, y0 + 50);
  ctx.fillStyle = "#f4f6f8";
  ctx.font = "800 22px Barlow Condensed, sans-serif";
  ctx.fillText(fmtMoney(peakMarketValue(s)), xPlayer + wPlayer - 86, y0 + 74);
  ctx.textAlign = "left";
  drawOvrBadge(ctx, xPlayer + wPlayer - 78, y0 + 38, s.peakOvr);
  var careerSt = gkAwareStats(s, s.career.apps, s.career.goals, s.career.assists, resolveGkSaves(s.career), s.career.ga);
  drawStatsBar(ctx, xPlayer + 16, y0 + topH - 72, wPlayer - 32, careerSt.apps, careerSt.g, careerSt.a, 26, careerSt.gLab, careerSt.aLab);

  /* —— Seleção —— */
  drawKicker(ctx, xNt + 16, y0 + 24, "SELEÇÃO", "#a8b0bc");
  ctx.fillStyle = "#f4f6f8";
  ctx.font = "700 17px DM Sans, sans-serif";
  ctx.fillText(nat.name, xNt + 60, y0 + 60);
  var ntSt = gkAwareStats(s, s.caps || 0, s.ntGoals || 0, s.ntAssists || 0, resolveGkSaves({ apps: s.caps || 0, cs: s.ntCs || 0, saves: s.ntSaves }), s.ntGa || 0);
  drawStatsBar(ctx, xNt + 16, y0 + 84, wNt - 32, ntSt.apps, ntSt.g, ntSt.a, 24, ntSt.gLab, ntSt.aLab);

  /* —— Prêmios (GK → Luva; outfield → Chuteira via showcaseIndivAwards) —— */
  drawKicker(ctx, xAw + 16, y0 + 24, "PRÊMIOS", "#f5c542");

  var urls = [nat.flag];
  var i;
  for (i = 0; i < ntCups.length; i++) urls.push(ntCups[i].meta.img);
  for (i = 0; i < awards.length; i++) urls.push(awards[i].meta.img);

  var stCupsList = [];
  for (i = 0; i < stints.length; i++) {
    var club = clubOf(stints[i].id);
    urls.push(cardCrestSrc(club.crest));
    stCupsList[i] = cardUniqueTrophyItems(stints[i].trophies);
    for (var c = 0; c < stCupsList[i].length; c++) urls.push(stCupsList[i][c].meta.img);
  }

  return Promise.all(urls.map(loadImg)).then(function (loaded) {
    var idx = 0;
    var flag = loaded[idx++];
    if (flag) {
      try { ctx.drawImage(flag, xNt + 16, y0 + 42, 36, 24); } catch (e) {}
    }

    if (ntCups.length) {
      drawTrophyRow(ctx, loaded, idx, ntCups, xNt + 12, y0 + topH - 96, wNt - 24, 40, { labelMax: 56 });
    } else {
      drawEmptyVitrine(ctx, xNt + wNt / 2, y0 + topH - 40);
    }
    idx += ntCups.length;

    if (awards.length) {
      drawTrophyRow(ctx, loaded, idx, awards, xAw + 12, y0 + 72, wAw - 24, 52, { labelMax: 68, fontPx: 10 });
    } else {
      drawEmptyVitrine(ctx, xAw + wAw / 2, y0 + 140);
    }
    idx += awards.length;

    var yClubs = y0 + topH + gap;
    if (!stints.length) {
      drawCcCard(ctx, pad, yClubs, inner, 72);
      ctx.fillStyle = "#a8b0bc";
      ctx.font = "500 14px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Nenhum clube na carreira", W / 2, yClubs + 42);
      ctx.textAlign = "left";
    } else {
      for (var r = 0; r < stints.length; r++) {
        var col = r % clubCols;
        var row = Math.floor(r / clubCols);
        var x = pad + col * (clubW + gap);
        var y = yClubs + row * (clubH + gap);
        var st = stints[r];
        var cl = clubOf(st.id);
        var c1 = (cl.colors && cl.colors[0]) || cl.color || "#1a1d26";
        var crestImg = loaded[idx++];
        var stCups = stCupsList[r] || [];

        roundRect(ctx, x, y, clubW, clubH, 16);
        ctx.fillStyle = c1;
        ctx.fill();

        /* subtle crest watermark */
        if (crestImg) {
          ctx.save();
          ctx.globalAlpha = 0.14;
          var bw = Math.min(clubW * 1.15, 220);
          drawImageContain(ctx, crestImg, x + clubW * 0.2, y - 8, bw, bw);
          ctx.restore();
        }

        /* darken bottom for readability */
        var g = ctx.createLinearGradient(x, y, x, y + clubH);
        g.addColorStop(0, "rgba(0,0,0,.08)");
        g.addColorStop(1, "rgba(0,0,0,.28)");
        roundRect(ctx, x, y, clubW, clubH, 16);
        ctx.fillStyle = g;
        ctx.fill();

        if (crestImg) {
          try { drawImageContain(ctx, crestImg, x + (clubW - 56) / 2, y + 14, 56, 56); } catch (e) {}
        } else {
          roundRect(ctx, x + (clubW - 56) / 2, y + 14, 56, 56, 12);
          ctx.fillStyle = "rgba(0,0,0,.25)";
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.font = "800 16px DM Sans, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(cardCrestInitials(cl.name), x + clubW / 2, y + 48);
          ctx.textAlign = "left";
        }

        ctx.fillStyle = "#ffffff";
        ctx.font = "700 14px DM Sans, sans-serif";
        ctx.textAlign = "center";
        fitText(ctx, cl.name, x + 8, y + 92, clubW - 16, "700 ", "px DM Sans, sans-serif", 14, 11);
        ctx.textAlign = "left";

        var clubSt = gkAwareStats(s, st.apps, st.goals, st.assists, resolveGkSaves(st), st.ga);
        drawStatsBar(ctx, x + 10, y + 106, clubW - 20, clubSt.apps, clubSt.g, clubSt.a, 20, clubSt.gLab, clubSt.aLab);
        if (stCups.length) {
          drawTrophyRow(ctx, loaded, idx, stCups, x + 6, y + clubH - 72, clubW - 12, 28, { labelMax: 46, fontPx: 8 });
        }
        idx += stCups.length;
      }
    }

    ctx.fillStyle = "#a8b0bc";
    ctx.font = "800 22px Barlow Condensed, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(ver || "").toUpperCase(), W / 2, H - pad - 10);
    ctx.textAlign = "left";

    return cv;
  });
}

function drawCcCard(ctx, x, y, w, h) {
  roundRect(ctx, x, y, w, h, 16);
  ctx.fillStyle = "#14161c";
  ctx.fill();
  ctx.strokeStyle = "#2a2f3a";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawKicker(ctx, x, y, text, color) {
  ctx.fillStyle = color || "#a8b0bc";
  ctx.font = "700 10px DM Sans, sans-serif";
  ctx.fillText(text, x, y);
}

function drawEmptyVitrine(ctx, cx, cy) {
  ctx.fillStyle = "#a8b0bc";
  ctx.font = "500 12px DM Sans, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Vitrine vazia", cx, cy);
  ctx.textAlign = "left";
}

function measurePill(text) {
  return Math.max(40, String(text).length * 8 + 22);
}

function drawPill(ctx, x, y, text, isPos) {
  var tw = measurePill(text);
  roundRect(ctx, x, y, tw, 24, 12);
  ctx.fillStyle = isPos ? "rgba(232,93,117,.22)" : "rgba(255,255,255,.08)";
  ctx.fill();
  ctx.strokeStyle = isPos ? "rgba(232,93,117,.4)" : "rgba(255,255,255,.12)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = isPos ? "#f0a0ae" : "#f4f6f8";
  ctx.font = "700 12px DM Sans, sans-serif";
  ctx.fillText(text, x + 10, y + 16);
}

function drawOvrBadge(ctx, x, y, ovr) {
  var st = cardOvrTierStyle(ovr);
  var solid = "#d08a4a";
  if (ovr >= 99) solid = "#c026d3";
  else if (ovr >= 95) solid = "#8b5cf6";
  else if (ovr >= 90) solid = "#5eb8e8";
  else if (ovr >= 80) solid = "#f5b021";
  else if (ovr >= 70) solid = "#c5ceda";
  roundRect(ctx, x, y, 64, 64, 12);
  ctx.fillStyle = solid;
  ctx.fill();
  ctx.strokeStyle = st.border || "rgba(255,255,255,.4)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = st.color || "#1a1208";
  ctx.textAlign = "center";
  ctx.font = "800 10px DM Sans, sans-serif";
  ctx.fillText("OVR", x + 32, y + 20);
  ctx.font = "800 28px Barlow Condensed, sans-serif";
  ctx.fillText(String(ovr), x + 32, y + 48);
  ctx.textAlign = "left";
}

function drawStatsBar(ctx, x, y, w, apps, goals, assists, fontSize, gLab, aLab) {
  fontSize = fontSize || 24;
  var cell = w / 3;
  var h = 52;
  roundRect(ctx, x, y, w, h, 10);
  ctx.fillStyle = "rgba(0,0,0,.28)";
  ctx.fill();
  var vals = [apps, goals, assists];
  var labs = ["JOGOS", gLab || "GOLS", aLab || "ASS"];
  for (var i = 0; i < 3; i++) {
    var cx = x + i * cell;
    ctx.fillStyle = i === 1 ? "rgba(0,0,0,.22)" : "rgba(0,0,0,.18)";
    if (i === 0) {
      roundRect(ctx, cx, y, cell, h, 10);
      ctx.fill();
      ctx.fillRect(cx + 10, y, cell - 10, h);
    } else if (i === 2) {
      roundRect(ctx, cx, y, cell, h, 10);
      ctx.fill();
      ctx.fillRect(cx, y, cell - 10, h);
    } else {
      ctx.fillRect(cx, y, cell, h);
    }
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.font = "700 9px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(labs[i], cx + cell / 2, y + 15);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 " + fontSize + "px Barlow Condensed, sans-serif";
    ctx.fillText(String(vals[i] == null ? 0 : vals[i]), cx + cell / 2, y + 40);
  }
  ctx.textAlign = "left";
}

function wrapTrophyLabel(ctx, text, maxW, maxLines) {
  var words = String(text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  var lines = [];
  var cur = words[0];
  for (var i = 1; i < words.length; i++) {
    var trial = cur + " " + words[i];
    if (ctx.measureText(trial).width <= maxW) {
      cur = trial;
      continue;
    }
    lines.push(cur);
    cur = words[i];
    if (lines.length >= maxLines - 1) {
      var rest = [cur].concat(words.slice(i + 1)).join(" ");
      while (rest.length > 1 && ctx.measureText(rest).width > maxW) rest = rest.slice(0, -1);
      if (ctx.measureText(rest).width > maxW || rest !== [cur].concat(words.slice(i + 1)).join(" ")) {
        while (rest.length > 1 && ctx.measureText(rest + "…").width > maxW) rest = rest.slice(0, -1);
        rest = rest + "…";
      }
      lines.push(rest);
      return lines;
    }
  }
  lines.push(cur);
  /* single long word */
  if (lines.length === 1 && ctx.measureText(lines[0]).width > maxW) {
    var s = lines[0];
    while (s.length > 1 && ctx.measureText(s + "…").width > maxW) s = s.slice(0, -1);
    lines[0] = s + "…";
  }
  return lines.slice(0, maxLines);
}


/** object-fit: contain — center img in box without stretching (transparent pad). */
function drawImageContain(ctx, img, x, y, boxW, boxH) {
  if (!img) return;
  var nw = img.naturalWidth || img.width || 0;
  var nh = img.naturalHeight || img.height || 0;
  if (!nw || !nh) {
    try { ctx.drawImage(img, x, y, boxW, boxH); } catch (e) {}
    return;
  }
  var scale = Math.min(boxW / nw, boxH / nh);
  var dw = nw * scale;
  var dh = nh * scale;
  var dx = x + (boxW - dw) / 2;
  var dy = y + (boxH - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawTrophyRow(ctx, loaded, startIdx, items, x, y, w, size, opts) {
  if (!items || !items.length) return;
  opts = opts || {};
  var n = items.length;
  var labelMax = opts.labelMax != null ? opts.labelMax : Math.max(size + 8, 48);
  var fontPx = opts.fontPx || 9;
  var gapT = Math.max(6, Math.min(10, (w - n * labelMax) / Math.max(1, n - 1)));
  if (!isFinite(gapT) || gapT < 4) gapT = 6;
  var cellW = Math.max(size, labelMax);
  var total = n * cellW + (n - 1) * gapT;
  /* shrink cell if overflowing */
  if (total > w && n > 0) {
    cellW = Math.max(size, (w - (n - 1) * 4) / n);
    gapT = n > 1 ? Math.max(4, (w - n * cellW) / (n - 1)) : 0;
    total = n * cellW + (n - 1) * gapT;
  }
  var x0 = x + Math.max(0, (w - total) / 2);
  ctx.textAlign = "center";
  for (var i = 0; i < n; i++) {
    var it = items[i];
    var meta = it.meta || trophyOf(it.id || it);
    var tx = x0 + i * (cellW + gapT);
    var ix = tx + (cellW - size) / 2;
    var im = loaded[startIdx + i];
    if (im) {
      try { drawImageContain(ctx, im, ix, y, size, size); } catch (e) {}
    }
    if (it.n > 1) {
      roundRect(ctx, ix + size - 18, y + size - 14, 22, 14, 7);
      ctx.fillStyle = "rgba(0,0,0,.75)";
      ctx.fill();
      ctx.fillStyle = "#f5c542";
      ctx.font = "800 10px DM Sans, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("×" + it.n, ix + size - 15, y + size - 3);
      ctx.textAlign = "center";
    }
    var name = (meta && meta.name) || "";
    if (name) {
      ctx.fillStyle = "rgba(244,246,248,.82)";
      ctx.font = "600 " + fontPx + "px DM Sans, sans-serif";
      var lines = wrapTrophyLabel(ctx, name, cellW - 2, 2);
      var ly = y + size + fontPx + 1;
      for (var li = 0; li < lines.length; li++) {
        ctx.fillText(lines[li], tx + cellW / 2, ly + li * (fontPx + 1));
      }
    }
  }
  ctx.textAlign = "left";
}

function fitText(ctx, text, x, y, maxW, weightPrefix, fontSuffix, maxPx, minPx) {
  var size = maxPx;
  var align = ctx.textAlign;
  while (size > minPx) {
    ctx.font = weightPrefix + size + fontSuffix;
    if (ctx.measureText(text).width <= maxW) break;
    size -= 2;
  }
  ctx.font = weightPrefix + size + fontSuffix;
  if (align === "center") ctx.fillText(text, x + maxW / 2, y);
  else ctx.fillText(text, x, y);
}

function triggerPngDownload(cv, name) {
  var a = document.createElement("a");
  a.href = cv.toDataURL("image/png");
  a.download = safeCardFilename(name);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function safeCardFilename(name) {
  var base = String(name || "lenda").toLowerCase();
  try { base = base.normalize("NFD"); } catch (e) {}
  base = base.replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!base) base = "lenda";
  if (base.length > 40) base = base.slice(0, 40);
  return "lenda-" + base + ".png";
}

function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
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
    if (!src) return res(null);
    var im = new Image();
    im.decoding = "async";
    im.onload = function () {
      /* Prefer fully decoded bitmap before drawImage for crisp export. */
      if (typeof im.decode === "function") {
        im.decode().then(function () { res(im); }).catch(function () { res(im); });
      } else {
        res(im);
      }
    };
    im.onerror = function () { res(null); };
    im.src = src;
  });
}

function downloadSeasonCard(season) {
  var s = S;
  if (!s || !season) return;
  var btn = document.getElementById("dl-season");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Gerando…";
  }
  drawSeasonCardCanvas(s, season)
    .then(function (cv) {
      triggerPngDownload(cv, (s.name || "lenda") + "-" + (season.year || "") + "-temp");
    })
    .catch(function (err) {
      console.error("downloadSeasonCard", err);
    })
    .then(function () {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Baixar temporada";
      }
    });
}

function drawSeasonCardCanvas(s, season) {
  var club = clubOf(season.clubId);
  var nat = nationOf(s.nation);
  var pos = POS[s.pos] || { short: s.pos };
  var theme = season.themeTitle || "";
  var cups = (season.trophies || []).concat(season.awards || []);
  var W = 720;
  var H = 420;
  var EXPORT_SCALE = 2;
  var pad = 24;
  var cv = document.createElement("canvas");
  cv.width = Math.round(W * EXPORT_SCALE);
  cv.height = Math.round(H * EXPORT_SCALE);
  var ctx = cv.getContext("2d");
  ctx.setTransform(EXPORT_SCALE, 0, 0, EXPORT_SCALE, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#070809";
  ctx.fillRect(0, 0, W, H);
  drawCcCard(ctx, pad, pad, W - pad * 2, H - pad * 2);

  ctx.fillStyle = "#a8b0bc";
  ctx.font = "700 12px DM Sans, sans-serif";
  ctx.fillText("LENDA · TEMPORADA", pad + 20, pad + 36);

  if (theme) {
    ctx.fillStyle = "#f5c542";
    ctx.font = "800 22px Barlow Condensed, sans-serif";
    fitText(ctx, theme.toUpperCase(), pad + 20, pad + 68, W - pad * 2 - 140, "800 ", "px Barlow Condensed, sans-serif", 22, 14);
  }

  ctx.fillStyle = "#f4f6f8";
  ctx.font = "800 36px Barlow Condensed, sans-serif";
  fitText(ctx, String(s.name || "").toUpperCase(), pad + 20, pad + 112, W - pad * 2 - 120, "800 ", "px Barlow Condensed, sans-serif", 36, 22);

  drawPill(ctx, pad + 20, pad + 128, "#" + s.number, false);
  var pw = measurePill("#" + s.number);
  drawPill(ctx, pad + 20 + pw + 8, pad + 128, String(pos.short), true);
  drawPill(ctx, pad + 20 + pw + 8 + measurePill(String(pos.short)) + 8, pad + 128, String(season.age) + " anos", false);

  drawOvrBadge(ctx, W - pad - 86, pad + 40, season.ovr);
  ctx.fillStyle = (season.delta || 0) >= 0 ? "#3dd68c" : "#ff6b6b";
  ctx.font = "800 16px Barlow Condensed, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(fmtDelta(season.delta || 0) + " OVR", W - pad - 28, pad + 130);
  ctx.textAlign = "left";

  var urls = [cardCrestSrc(club.crest), nat.flag];
  for (var i = 0; i < cups.length; i++) urls.push(trophyOf(cups[i]).img);

  return Promise.all(urls.map(loadImg)).then(function (loaded) {
    var crest = loaded[0];
    var flag = loaded[1];
    if (crest) {
      try { drawImageContain(ctx, crest, pad + 20, pad + 168, 56, 56); } catch (e) {}
    }
    ctx.fillStyle = "#f4f6f8";
    ctx.font = "700 18px DM Sans, sans-serif";
    ctx.fillText(club.name, pad + 88, pad + 192);
    ctx.fillStyle = "#a8b0bc";
    ctx.font = "600 13px DM Sans, sans-serif";
    ctx.fillText((season.year || "") + " · #" + season.leaguePos + " · " + ROLE_NAME[season.role], pad + 88, pad + 214);

    if (flag) {
      try { ctx.drawImage(flag, pad + 20, pad + 244, 28, 18); } catch (e) {}
    }
    var seasonSt = gkAwareStats(s, season.apps, season.goals, season.assists, resolveGkSaves(season), season.ga);
    /* Short labels on season card (G/A) for outfield; DEF/GS for GK */
    var gLab = s.pos === "GOL" ? "DEF" : "G";
    var aLab = s.pos === "GOL" ? "GS" : "A";
    drawStatsBar(ctx, pad + 56, pad + 236, 280, seasonSt.apps, seasonSt.g, seasonSt.a, 22, gLab, aLab);

    var yF = pad + 290;
    if (season.nt && season.nt.path && season.nt.path.text) {
      ctx.fillStyle = "#9ad7f2";
      ctx.font = "600 13px DM Sans, sans-serif";
      ctx.fillText(season.nt.path.text, pad + 20, yF);
      yF += 22;
    }
    if (season.derby) {
      var vs = clubOf(season.derby.vs);
      ctx.fillStyle = "#f0a0ae";
      ctx.font = "600 13px DM Sans, sans-serif";
      ctx.fillText((season.derby.won ? "Clássico ganho" : "Clássico perdido") + " vs " + vs.name, pad + 20, yF);
      yF += 22;
    }
    if (cups.length) {
      var items = cups.map(function (id) { return { id: id, n: 1, meta: trophyOf(id) }; });
      drawTrophyRow(ctx, loaded, 2, items, pad + 20, H - pad - 86, W - pad * 2 - 40, 40, { labelMax: 64 });
    }
    return cv;
  });
}

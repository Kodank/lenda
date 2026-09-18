var NATION_KIT = {
  br: ["#009B3A", "#FEDF00"], ar: ["#74ACDF", "#ffffff"], uy: ["#0038A8", "#ffffff"],
  co: ["#FCD116", "#CE1126"], mx: ["#006847", "#ffffff"], pt: ["#006600", "#FF0000"],
  es: ["#AA151B", "#F1BF00"], en: ["#ffffff", "#CE1126"], fr: ["#002395", "#ED2939"],
  it: ["#009246", "#CE2B37"], de: ["#000000", "#FFCE00"], nl: ["#AE1C28", "#21468B"],
  us: ["#002868", "#BF0A30"], jp: ["#ffffff", "#BC002D"], ng: ["#008751", "#ffffff"],
  sn: ["#00853F", "#E31C23"]
};

function crestSrc(path) {
  return path || 'img/clubs/fla.png';
}
function imgCrest(path, cls) {
  return '<img class="' + (cls || 'crest') + '" src="' + crestSrc(path) + '" alt="" onerror="this.style.opacity=.25">';
}

function esc(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function onColor(hex) {
  var h = (hex || "#111").replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? "#12151a" : "#ffffff";
}

function hexLum(hex) {
  var h = (hex || "#111").replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function mixHex(a, b, t) {
  function parse(h) {
    h = (h || "#000").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  var A = parse(a), B = parse(b);
  function ch(i) {
    var v = Math.round(A[i] + (B[i] - A[i]) * t);
    return ("0" + Math.max(0, Math.min(255, v)).toString(16)).slice(-2);
  }
  return "#" + ch(0) + ch(1) + ch(2);
}

function kitPalette(c1, c2) {
  /* Copero-like white kit + dark trim; soft nation tint only */
  var body = mixHex("#f6f6f4", c1, 0.07);
  var bodyShade = mixHex("#deded9", c1, 0.10);
  var bodyHi = "#ffffff";
  var trim = "#1a1d24";
  if (hexLum(c2) < 0.35) trim = c2;
  else if (hexLum(c1) < 0.35) trim = mixHex("#12151a", c1, 0.55);
  var ink = "#12151a";
  return { body: body, bodyShade: bodyShade, bodyHi: bodyHi, trim: trim, ink: ink, accent: c1 };
}

/** Polished back-of-shirt preview — gradients, folds, collar, sleeve trim */
function shirtHtml(c1, c2, number, name) {
  var pal = kitPalette(c1 || "#f7f7f5", c2 || "#1a1d24");
  var nm = esc((name || "SILVA").toUpperCase().slice(0, 12));
  var num = esc(String(number == null ? 10 : number));
  var uid = "k" + Math.random().toString(36).slice(2, 8);
  return '<div class="shirt-stage" aria-hidden="true">' +
    '<svg class="shirt-svg" viewBox="0 0 240 270" width="210" height="236">' +
    "<defs>" +
    '<linearGradient id="' + uid + 'body" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="' + pal.bodyHi + '"/>' +
    '<stop offset="38%" stop-color="' + pal.body + '"/>' +
    '<stop offset="100%" stop-color="' + pal.bodyShade + '"/>' +
    "</linearGradient>" +
    '<linearGradient id="' + uid + 'sleeve" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0%" stop-color="' + pal.bodyHi + '"/>' +
    '<stop offset="55%" stop-color="' + pal.body + '"/>' +
    '<stop offset="100%" stop-color="' + pal.bodyShade + '"/>' +
    "</linearGradient>" +
    '<linearGradient id="' + uid + 'side" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0%" stop-color="#000" stop-opacity=".14"/>' +
    '<stop offset="18%" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="82%" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="100%" stop-color="#000" stop-opacity=".14"/>' +
    "</linearGradient>" +
    '<linearGradient id="' + uid + 'foldL" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0%" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="50%" stop-color="#000" stop-opacity=".11"/>' +
    '<stop offset="100%" stop-color="#fff" stop-opacity=".08"/>' +
    "</linearGradient>" +
    '<linearGradient id="' + uid + 'foldR" x1="1" y1="0" x2="0" y2="0">' +
    '<stop offset="0%" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="50%" stop-color="#000" stop-opacity=".09"/>' +
    '<stop offset="100%" stop-color="#fff" stop-opacity=".1"/>' +
    "</linearGradient>" +
    '<radialGradient id="' + uid + 'soft" cx="48%" cy="28%" r="70%">' +
    '<stop offset="0%" stop-color="#fff" stop-opacity=".28"/>' +
    '<stop offset="45%" stop-color="#fff" stop-opacity=".05"/>' +
    '<stop offset="100%" stop-color="#000" stop-opacity=".16"/>' +
    "</radialGradient>" +
    '<filter id="' + uid + 'blur" x="-30%" y="-30%" width="160%" height="160%">' +
    '<feGaussianBlur stdDeviation="1.6"/>' +
    "</filter>" +
    '<linearGradient id="' + uid + 'trim" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="' + mixHex(pal.trim, "#ffffff", 0.12) + '"/>' +
    '<stop offset="100%" stop-color="' + pal.trim + '"/>' +
    "</linearGradient>" +
    "</defs>" +
    '<ellipse cx="120" cy="255" rx="62" ry="10" fill="#000" opacity=".34"/>' +
    /* sleeves behind torso */
    '<path d="M66 62 C52 68 30 78 22 94 C16 108 24 142 38 152 C48 144 58 128 68 112 Z" fill="url(#' + uid + 'sleeve)" stroke="rgba(0,0,0,.14)" stroke-width="1"/>' +
    '<path d="M174 62 C188 68 210 78 218 94 C224 108 216 142 202 152 C192 144 182 128 172 112 Z" fill="url(#' + uid + 'sleeve)" stroke="rgba(0,0,0,.14)" stroke-width="1"/>' +
    /* torso */
    '<path d="M76 56 C86 38 100 30 120 30 C140 30 154 38 164 56 L182 70 C184 76 186 88 184 214 C184 226 162 236 120 236 C78 236 56 226 56 214 C54 88 56 76 58 70 Z" fill="url(#' + uid + 'body)" stroke="rgba(0,0,0,.16)" stroke-width="1.1"/>' +
    '<path d="M76 56 C86 38 100 30 120 30 C140 30 154 38 164 56 L182 70 C184 76 186 88 184 214 C184 226 162 236 120 236 C78 236 56 226 56 214 C54 88 56 76 58 70 Z" fill="url(#' + uid + 'soft)"/>' +
    '<path d="M76 56 C86 38 100 30 120 30 C140 30 154 38 164 56 L182 70 C184 76 186 88 184 214 C184 226 162 236 120 236 C78 236 56 226 56 214 C54 88 56 76 58 70 Z" fill="url(#' + uid + 'side)"/>' +
    /* fabric folds */
    '<path d="M96 78 C100 130 98 175 102 220" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="9" stroke-linecap="round" filter="url(#' + uid + 'blur)"/>' +
    '<path d="M144 78 C140 130 142 175 138 220" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="8" stroke-linecap="round" filter="url(#' + uid + 'blur)"/>' +
    '<path d="M120 74 C118 130 122 175 120 224" fill="none" stroke="rgba(0,0,0,.07)" stroke-width="14" stroke-linecap="round" filter="url(#' + uid + 'blur)"/>' +
    '<rect x="84" y="86" width="28" height="120" fill="url(#' + uid + 'foldL)" opacity=".7"/>' +
    '<rect x="128" y="86" width="28" height="120" fill="url(#' + uid + 'foldR)" opacity=".7"/>' +
    /* waist crease */
    '<path d="M70 198 C100 192 140 192 170 198" fill="none" stroke="rgba(0,0,0,.08)" stroke-width="4" filter="url(#' + uid + 'blur)"/>' +
    /* thick collar */
    '<path d="M94 38 C106 28 134 28 146 38 L138 64 C130 54 110 54 102 64 Z" fill="url(#' + uid + 'trim)"/>' +
    '<path d="M108 40 L120 62 L132 40" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M96 40 C108 32 132 32 144 40" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1.6"/>' +
    /* sleeve cuffs */
    '<path d="M22 94 C18 110 26 140 38 152 L48 142 C38 130 32 110 34 98 Z" fill="url(#' + uid + 'trim)"/>' +
    '<path d="M218 94 C222 110 214 140 202 152 L192 142 C202 130 208 110 206 98 Z" fill="url(#' + uid + 'trim)"/>' +
    /* side piping tint */
    '<path d="M64 78 L68 210" fill="none" stroke="' + pal.accent + '" stroke-opacity=".18" stroke-width="3"/>' +
    '<path d="M176 78 L172 210" fill="none" stroke="' + pal.accent + '" stroke-opacity=".18" stroke-width="3"/>' +
    /* name + number */
    '<text class="shirt-name" x="120" y="104" text-anchor="middle" fill="' + pal.ink + '" font-family="Barlow Condensed, Arial Black, sans-serif" font-size="18" font-weight="800" letter-spacing="3.5">' + nm + "</text>" +
    '<text class="shirt-num" x="120" y="178" text-anchor="middle" fill="' + pal.ink + '" font-family="Barlow Condensed, Arial Black, sans-serif" font-size="78" font-weight="800">' + num + "</text>" +
    "</svg></div>";
}

function trophyCaseHtml(s) {
  var ids = [];
  var seen = {};
  var list = (s.career && s.career.trophies) || [];
  for (var i = 0; i < list.length; i++) {
    var id = list[i];
    if (seen[id]) { seen[id]++; continue; }
    seen[id] = 1;
    ids.push(id);
  }
  if (!ids.length) {
    return '<div class="trophy-case empty-case"><div class="case-label">VITRINE VAZIA</div><div class="case-ghost">🏆</div></div>';
  }
  var cells = ids.map(function (id) {
    var meta = trophyOf(id);
    var n = seen[id];
    return '<div class="case-item"><img src="' + meta.img + '" alt=""><span>' + esc(meta.name) + (n > 1 ? " ×" + n : "") + "</span></div>";
  }).join("");
  return '<div class="trophy-case"><div class="case-label">VITRINE</div><div class="case-grid">' + cells + "</div></div>";
}

function identityStrip(s) {
  var club = clubOf(s.clubId);
  var nat = nationOf(s.nation);
  var last = (s.seasons && s.seasons.length) ? s.seasons[s.seasons.length - 1] : null;
  var apps = last ? last.apps : 0;
  var goals = last ? (s.pos === "GOL" ? last.cs : last.goals) : 0;
  var ast = last ? (s.pos === "GOL" ? last.ga : last.assists) : 0;
  var gLab = s.pos === "GOL" ? "CS" : "GOLS";
  var aLab = s.pos === "GOL" ? "GS" : "AST";
  return '<div class="id-strip">' +
    '<div class="ovr-badge"><span>OVR</span><b>' + s.ovr + "</b></div>" +
    '<div class="id-meta">' +
    '<div class="id-line">' +
    '<img class="mini-flag" src="' + nat.flag + '" alt="">' +
    '<span class="pill">#' + s.number + " " + POS[s.pos].short + "</span>" +
    '<b class="club-name">' + esc(club.name) + "</b>" +
    '<img class="crest sm" src="' + club.crest + '" alt="">' +
    "</div>" +
    '<div class="id-kpis">' +
    "<div><b>" + apps + "</b><span>APPS</span></div>" +
    "<div><b>" + goals + "</b><span>" + gLab + "</span></div>" +
    "<div><b>" + ast + "</b><span>" + aLab + "</span></div>" +
    "</div></div>" +
    '<div class="id-value"><b>' + s.age + '</b><span>idade</span>' +
    '<b class="money">' + fmtMoney(s.value) + "</b><span>valor</span></div>" +
    "</div>";
}

function render() {
  var root = document.getElementById("app");
  var html = "";
  if (UI.screen === "home") html = viewHome();
  else if (UI.screen === "create") html = viewCreate();
  else if (UI.screen === "academy") html = viewAcademy();
  else if (UI.screen === "decision") html = viewDecision();
  else if (UI.screen === "report") html = viewReport();
  else if (UI.screen === "legacy") html = viewLegacy();
  else html = viewHome();
  root.innerHTML = html;
  root.className = "screen-" + UI.screen + (UI.screen === "create" ? " step-" + ((UI.draft && UI.draft.step) || 0) : "");
  bind();
}

function viewHome() {
  var has = !!load();
  return '<div class="home">' +
    '<div class="kicker">Simulador de carreira</div>' +
    "<h1>LENDA</h1>" +
    "<p>Escolhe a origem, toma as decisões e deixa o destino virar títulos, números e um quadro para guardar.</p>" +
    '<button class="btn" data-go="create">Começar carreira</button>' +
    (has ? '<button class="btn alt" data-go="continue">Continuar</button>' : "") +
    (has ? '<button class="btn danger" data-go="reset">Reiniciar tudo</button>' : "") +
    "</div>";
}

function createProgress(step) {
  var labels = ["Camisa", "País", "Posição"];
  return '<div class="steps">' + labels.map(function (lab, i) {
    return '<span class="step-dot' + (i === step ? " on" : "") + (i < step ? " done" : "") + '">' + (i + 1) + "<i>" + lab + "</i></span>";
  }).join('<span class="step-line"></span>') + "</div>";
}

function viewCreate() {
  var d = UI.draft;
  var step = d.step || 0;
  var kit = NATION_KIT[d.nation] || ["#1f8a4c", "#111"];
  var top = '<div class="top"><div class="brand">LENDA</div><button class="ghost danger" data-go="reset">Reiniciar tudo</button></div>' +
    createProgress(step);

  if (step === 0) {
    var feet = [["D", "Destro"], ["E", "Canhoto"], ["A", "Ambidestro"]].map(function (f) {
      return '<button type="button" class="chip' + (d.foot === f[0] ? " on" : "") + '" data-foot="' + f[0] + '">' + f[1] + "</button>";
    }).join("");
    var paces = ["intensa", "normal", "expressa"].map(function (k) {
      var p = PACE[k];
      return '<button type="button" class="chip pace-chip' + (d.pace === k ? " on" : "") + '" data-pace="' + k + '">' + p.label + "</button>";
    }).join("");
    return top +
      '<div class="step-card focus-shirt">' +
      "<h2>Define a camisa</h2>" +
      '<p class="lead tight">Nome, número e perna — o resto vem depois.</p>' +
      '<div class="shirt-panel">' + shirtHtml(kit[0], kit[1], d.number, d.name || "SILVA") + "</div>" +
      '<div class="field-grid">' +
      '<div><div class="label">Sobrenome</div><input id="nm" type="text" maxlength="12" value="' + esc(d.name) + '" placeholder="SOBRENOME"></div>' +
      '<div><div class="label">Número</div><div class="dorsal compact"><button type="button" class="chip" data-num="-1">−</button><b class="num">' + d.number + '</b><button type="button" class="chip" data-num="1">+</button></div></div>' +
      "</div>" +
      '<div class="label">Perna boa</div><div class="row">' + feet + "</div>" +
      '<div class="label" style="margin-top:12px">Ritmo</div><div class="row">' + paces + "</div>" +
      '<div class="step-actions">' +
      '<button class="btn alt" data-go="home">Voltar</button>' +
      '<button class="btn" data-step="1">Continuar</button>' +
      "</div></div>";
  }

  if (step === 1) {
    var flags = NATIONS.map(function (n) {
      return '<button type="button" class="flag-row' + (d.nation === n.id ? " on" : "") + '" data-nation="' + n.id + '">' +
        '<img src="' + n.flag + '" alt=""><span>' + esc(n.name) + "</span></button>";
    }).join("");
    return top +
      '<div class="step-card focus-nation">' +
      "<h2>Nacionalidade</h2>" +
      '<p class="lead tight">Escolhe o país. A camisa ganha as cores da seleção.</p>' +
      '<div class="nation-split">' +
      '<div class="shirt-mini">' + shirtHtml(kit[0], kit[1], d.number, d.name || "SILVA") + "</div>" +
      '<div class="nation-panel"><input id="nat-search" type="text" placeholder="Buscar país…" autocomplete="off">' +
      '<div class="flag-list" id="flag-list">' + flags + "</div></div>" +
      "</div>" +
      '<div class="step-actions">' +
      '<button class="btn alt" data-step="0">Voltar</button>' +
      '<button class="btn" data-step="2">Continuar</button>' +
      "</div></div>";
  }

  /* step 2 — position */
  var slots = PITCH.map(function (p) {
    return '<button type="button" class="slot' + (d.pos === p.pos ? " on" : "") + '" data-pos="' + p.pos +
      '" style="left:' + p.x + "%;top:" + p.y + '%">' + p.pos + "</button>";
  }).join("");
  return top +
    '<div class="step-card focus-pos">' +
    "<h2>Posição</h2>" +
    '<p class="lead tight">16 anos · OVR 50 · toca no campo para escolher.</p>' +
    '<div class="pos-split">' +
    '<div class="pos-summary">' +
    '<div class="shirt-mini">' + shirtHtml(kit[0], kit[1], d.number, d.name || "SILVA") + "</div>" +
    '<div class="pos-now"><span class="label">Posição</span><b>' + POS[d.pos].name + "</b>" +
    "<small>" + POS[d.pos].short + "</small></div></div>" +
    '<div class="pitch-wrap compact"><div class="pitch"></div>' + slots + "</div>" +
    "</div>" +
    '<div class="step-actions">' +
    '<button class="btn alt" data-step="1">Voltar</button>' +
    '<button class="btn" data-go="academies">Ver academias</button>' +
    "</div></div>";
}

function viewAcademy() {
  var offers = UI.offers || [];
  var cards = offers.map(function (o) {
    var lg = leagueOf(o.club.leagueId);
    return '<button class="card offer" data-sign="' + o.club.id + '">' +
      '<img class="crest" src="' + o.club.crest + '" alt="">' +
      "<div class='bars'><b>" + esc(o.club.name) + "</b>" +
      '<div style="display:flex;gap:8px;align-items:center;margin:6px 0 10px;color:var(--muted);font-size:12px">' +
      '<img class="lg-logo" src="' + lg.logo + '" alt="">' +
      esc(lg.name) + (o.casa ? " · casa" : " · exterior") + "</div>" +
      '<div class="label">Formação</div><div class="bar"><i style="width:' + o.formacao + '%"></i></div>' +
      '<div class="label">Minutos</div><div class="bar"><i style="width:' + o.minutos + '%"></i></div>' +
      '<div class="label">Pressão</div><div class="bar"><i style="width:' + o.pressao + '%"></i></div>' +
      "</div></button>";
  }).join("");
  return '<div class="top"><div class="brand">BASE</div><button class="ghost danger" data-go="reset">Reiniciar tudo</button></div>' +
    '<div class="step-card">' +
    "<h2>Academia</h2>" +
    '<p class="lead tight">Três ofertas. A camisa grande não é sempre o caminho mais rápido.</p>' +
    '<div class="academy-grid">' + cards + "</div></div>";
}

function choiceBtn(side, ch) {
  if (!ch) return "";
  if (ch.crest) {
    var lg = ch.leagueId ? leagueOf(ch.leagueId) : null;
    var nat = ch.nation ? nationOf(ch.nation) : null;
    var cols = ch.colors || ["#222", "#111"];
    return '<button class="choice transfer" data-choice="' + side + '" style="--c1:' + cols[0] + ";--c2:" + (cols[1] || cols[0]) + '">' +
      '<img class="choice-crest" src="' + ch.crest + '" alt="">' +
      "<div class='choice-body'><b>" + esc(ch.label) + "</b><small>" + esc(ch.hint) + "</small>" +
      '<div class="choice-meta">' +
      (lg ? '<img class="lg-logo" src="' + lg.logo + '" alt="">' + esc(lg.name) : "") +
      (nat ? ' <img class="mini-flag" src="' + nat.flag + '" alt="">' : "") +
      "</div></div></button>";
  }
  return '<button class="choice" data-choice="' + side + '">' +
    "<div><b>" + esc(ch.label) + "</b><small>" + esc(ch.hint) + "</small></div></button>";
}

function timelineHtml(s, hiN, choosing) {
  var rows = s.seasons || [];
  var html = '<div class="timeline-panel"><div class="feed-h">Carreira</div><div class="timeline-scroll">';
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var club = clubOf(r.clubId);
    var g = s.pos === "GOL" ? r.cs : r.goals;
    var a = s.pos === "GOL" ? r.ga : r.assists;
    var gLab = s.pos === "GOL" ? "CS" : "G";
    var aLab = s.pos === "GOL" ? "GS" : "A";
    var hi = hiN && i >= rows.length - hiN;
    var lg = leagueOf(r.leagueId);
    var cups = (r.trophies || []).concat(r.awards || []).map(function (id) {
      return '<img class="cup-lg" src="' + trophyOf(id).img + '" title="' + esc(trophyOf(id).name) + '">';
    }).join("");
    var dlt = r.delta != null
      ? '<span class="' + (r.delta >= 0 ? "up" : "dn") + '">' + fmtDelta(r.delta) + "</span>"
      : "";
    html += '<article class="szn' + (hi ? " hi" : "") + (cups ? " won" : "") + '">' +
      '<div class="szn-agebadge">' + r.age + "</div>" +
      '<img class="szn-crest" src="' + club.crest + '" alt="">' +
      '<div class="szn-mid"><div class="szn-top"><b>' + esc(club.name) + '</b>' +
      (lg ? '<img class="szn-lg" src="' + lg.logo + '" title="' + esc(lg.name) + '" alt="">' : "") +
      "</div>" +
      '<div class="szn-stats">' + r.apps + " J · " + g + " " + gLab + " · " + a + " " + aLab + "</div>" +
      (cups ? '<div class="szn-cups">' + cups + "</div>" : "") +
      "</div>" +
      '<div class="szn-ovr"><b>' + r.ovr + "</b>" + dlt + "</div></article>";
  }
  if (choosing) {
    html += '<article class="szn choosing"><div class="szn-agebadge">' + s.age + '</div>' +
      '<div class="szn-q">?</div><div class="szn-mid"><b>Escolhendo clube…</b>' +
      '<div class="szn-stats">OVR ' + s.ovr + "</div></div></article>";
  }
  /* future age markers — compact */
  var lastAge = choosing ? s.age : (rows.length ? rows[rows.length - 1].age : s.age);
  var future = "";
  for (var age = lastAge + 2; age <= 38 && age <= lastAge + 8; age += 2) {
    future += '<div class="szn future"><div class="szn-agebadge dim">' + age + '</div><div class="szn-mid muted-line">-</div></div>';
  }
  html += future;
  var nat = nationOf(s.nation);
  html += '</div><div class="nt-row"><img class="mini-flag" src="' + nat.flag + '" alt="">' +
    "<b>Seleção</b><span>" + (s.caps || 0) + " J · " +
    (s.pos === "GOL" ? (s.ntCs || 0) + " CS" : (s.ntGoals || 0) + " G") +
    "</span></div></div>";
  return html;
}

function viewDecision() {
  var ev = UI.event;
  var s = S;
  var choices = [choiceBtn("a", ev.a), choiceBtn("b", ev.b), choiceBtn("c", ev.c)].filter(Boolean).join("");
  return '<div class="top slim"><div class="brand">LENDA</div><button class="ghost danger" data-go="reset">Reiniciar tudo</button></div>' +
    '<div class="career-dash">' +
    '<div class="career-left">' +
    identityStrip(s) +
    trophyCaseHtml(s) +
    '<div class="story compact"><div class="meta">' + esc(clubOf(s.clubId).name) + " · " + s.age + " anos</div>" +
    "<h2>" + esc(ev.title) + "</h2>" +
    "<p>" + esc(ev.text) + "</p></div>" +
    '<div class="choices-grid">' + choices + "</div>" +
    "</div>" +
    timelineHtml(s, 0, true) +
    "</div>";
}

function viewReport() {
  var reps = UI.reports || [];
  var s = S;
  var last = reps[reps.length - 1];
  var recap = "";
  if (last) {
    var club = clubOf(last.clubId);
    var cups = (last.trophies || []).concat(last.awards || []);
    var nt = last.nt && last.nt.apps
      ? " · " + (last.nt.youth ? "Sub-20" : "seleção") + " (" + last.nt.apps + " j)"
      : "";
    recap = '<div class="story compact"><div class="meta">Temporada encerrada</div>' +
      "<h2>" + esc(club.name) + "</h2>" +
      '<p class="lead tight">OVR ' + last.ovr + " (" + fmtDelta(last.delta) + ") · " +
      last.apps + " jogos · " + (s.pos === "GOL" ? last.cs + " CS" : last.goals + " gols / " + last.assists + " ast") +
      " · #" + last.leaguePos + nt + "</p>" +
      (cups.length ? '<div class="report-cups">' + cups.map(function (id) {
        return '<div class="report-cup"><img src="' + trophyOf(id).img + '" alt=""><b>' + esc(trophyOf(id).name) + "</b></div>";
      }).join("") + "</div>" : "") +
      "</div>";
  }
  var next = s.retired ? "legacy" : "decision";
  return '<div class="top slim"><div class="brand">LENDA</div><button class="ghost danger" data-go="reset">Reiniciar tudo</button></div>' +
    '<div class="career-dash">' +
    '<div class="career-left">' +
    identityStrip(s) +
    trophyCaseHtml(s) +
    recap +
    (S._lastRisk ? '<div class="risk-toast ' + (S._lastRisk.ok ? "ok" : "bad") + '">' + esc(S._lastRisk.text) + "</div>" : "") +
    '<button class="btn" data-go="' + next + '">' + (s.retired ? "Ver o quadro" : "Próxima decisão") + "</button>" +
    "</div>" +
    timelineHtml(s, reps.length, false) +
    "</div>";
}

function uniqueTrophies(s) {
  var out = [], seen = {};
  var t = s.career.trophies || [];
  for (var i = 0; i < t.length; i++) if (!seen[t[i]] && trophyOf(t[i]).kind !== "indiv") { seen[t[i]] = 1; out.push(t[i]); }
  return out;
}

function viewLegacy() {
  var s = S;
  var club = iconClub(s);
  var nat = nationOf(s.nation);
  var sc = finalScore(s);
  var ver = verdict(s, sc);
  var c1 = club.colors[0], c2 = club.colors[1];
  var on = onColor(c1);
  var years = s.seasons.length ? (s.seasons[0].year + " — " + s.seasons[s.seasons.length - 1].year) : "";
  var gols = s.pos === "GOL" ? s.career.cs : s.career.goals;
  var ast = s.pos === "GOL" ? s.career.ga : s.career.assists;
  var gLab = s.pos === "GOL" ? "Clean sheets" : "Gols";
  var aLab = s.pos === "GOL" ? "Sofridos" : "Assistências";
  var awards = indivAwards(s);
  var awHtml = awards.length
    ? awards.map(function (a) {
      return '<img src="' + a.meta.img + '" title="' + esc(a.meta.name) + (a.n > 1 ? " ×" + a.n : "") + '" alt="">';
    }).join("")
    : '<div class="empty">Nenhum prêmio individual</div>';
  var ntHtml = s.caps
    ? '<div class="big">' + s.caps + '</div><div class="muted">jogos pela seleção</div>' +
      '<div class="muted">' + (s.pos === "GOL" ? s.ntCs + " clean sheets" : s.ntGoals + " gols") +
      (countTrophy(s, "worldcup") ? " · campeão do mundo" : "") + "</div>"
    : '<div class="empty">Não chegou à seleção principal</div>';
  var clubCups = uniqueTrophies(s).map(function (id) {
    return '<div class="vitrine-item"><img src="' + trophyOf(id).img + '" alt=""><span>' + esc(trophyOf(id).name) + "</span></div>";
  }).join("");
  var path = clubAppsMap(s).map(function (c, i) {
    return (i ? "<span>→</span>" : "") + '<img src="' + clubOf(c.id).crest + '" title="' + esc(clubOf(c.id).name) + '">';
  }).join("");
  var heroBg = "background:linear-gradient(145deg," + c1 + " 0%," + c2 + " 100%)";
  return '<div class="top"><div class="brand">LENDA</div><button class="ghost danger" data-go="reset">Reiniciar tudo</button></div>' +
    '<article class="quadro" id="quadro" style="--c1:' + c1 + ";--c2:" + c2 + ";--on:" + on + ";" + heroBg + '">' +
    '<div class="quadro-hero" style="' + heroBg + '">' +
    '<img class="quadro-crest" src="' + club.crest + '" alt="">' +
    '<div class="quadro-id"><img class="flag" src="' + nat.flag + '" alt=""><h1>' + esc(s.name) + "</h1>" +
    "<p>" + s.number + " · " + POS[s.pos].name + " · " + esc(nat.name) + "</p>" +
    "<p>" + years + " · " + esc(club.name) + "</p></div>" +
    '<div class="quadro-ovr"><span>PICO</span><b>' + s.peakOvr + "</b></div></div>" +
    '<div class="quadro-stats">' +
    "<div><b>" + s.career.apps + "</b><span>Jogos</span></div>" +
    "<div><b>" + gols + "</b><span>" + gLab + "</span></div>" +
    "<div><b>" + ast + "</b><span>" + aLab + "</span></div></div>" +
    '<div class="quadro-squares">' +
    '<div class="sq"><header><img src="' + nat.flag + '" alt="">Seleção</header>' + ntHtml + "</div>" +
    '<div class="sq"><header>Prêmios individuais</header><div class="aw">' + awHtml + "</div>" +
    (awards.length ? '<div class="muted">' + awards.map(function (a) { return a.meta.name + (a.n > 1 ? " ×" + a.n : ""); }).join(" · ") + "</div>" : "") +
    "</div></div>" +
    (clubCups ? '<div class="quadro-vitrine"><h3>Títulos</h3><div class="vitrine">' + clubCups + "</div></div>" : "") +
    '<div class="quadro-path">' + path + "</div>" +
    '<div class="quadro-verdict">' + esc(ver) + "</div></article>" +
    '<div class="legacy-timeline">' + timelineHtml(s, 0, false) + "</div>" +
    '<button class="btn" id="dl">Baixar quadro</button>' +
    '<button class="btn alt" data-go="new">Outra carreira</button>' +
    '<button class="btn danger" data-go="reset">Reiniciar tudo</button>';
}

function nextDecision() {
  if (S) S._lastRisk = null;
  if (shouldRetire(S)) {
    S.retired = true;
    UI.screen = "legacy";
    return;
  }
  UI.event = pickEvent(S);
  UI.screen = "decision";
}

function syncShirtTexts() {
  var nm = document.getElementById("nm");
  if (!nm || !UI.draft) return;
  UI.draft.name = nm.value.toUpperCase().slice(0, 12);
  var el = document.querySelector(".shirt-name");
  if (el) el.textContent = UI.draft.name || "SILVA";
  var numEl = document.querySelector(".shirt-num");
  if (numEl) numEl.textContent = String(UI.draft.number);
}

function bind() {
  document.querySelectorAll("[data-go]").forEach(function (b) {
    b.onclick = function () { go(b.getAttribute("data-go")); };
  });
  document.querySelectorAll("[data-step]").forEach(function (b) {
    b.onclick = function () {
      if (!UI.draft) return;
      var nm = document.getElementById("nm");
      if (nm) UI.draft.name = nm.value.toUpperCase().slice(0, 12) || "SILVA";
      UI.draft.step = Number(b.getAttribute("data-step")) || 0;
      render();
    };
  });
  document.querySelectorAll("[data-nation]").forEach(function (b) {
    b.onclick = function () { UI.draft.nation = b.getAttribute("data-nation"); render(); };
  });
  document.querySelectorAll("[data-pos]").forEach(function (b) {
    b.onclick = function () { UI.draft.pos = b.getAttribute("data-pos"); render(); };
  });
  document.querySelectorAll("[data-foot]").forEach(function (b) {
    b.onclick = function () { UI.draft.foot = b.getAttribute("data-foot"); render(); };
  });
  document.querySelectorAll("[data-pace]").forEach(function (b) {
    b.onclick = function () { UI.draft.pace = b.getAttribute("data-pace"); render(); };
  });
  document.querySelectorAll("[data-num]").forEach(function (b) {
    b.onclick = function () {
      UI.draft.number = clamp(UI.draft.number + Number(b.getAttribute("data-num")), 1, 99);
      var label = document.querySelector(".dorsal .num");
      if (label) label.textContent = UI.draft.number;
      var numEl = document.querySelector(".shirt-num");
      if (numEl) numEl.textContent = String(UI.draft.number);
      else render();
    };
  });
  var nm = document.getElementById("nm");
  if (nm) {
    nm.oninput = function () { syncShirtTexts(); };
  }
  var search = document.getElementById("nat-search");
  if (search) {
    search.oninput = function () {
      var q = search.value.toLowerCase().trim();
      document.querySelectorAll(".flag-row").forEach(function (row) {
        var name = (row.querySelector("span") || {}).textContent || "";
        row.style.display = !q || name.toLowerCase().indexOf(q) >= 0 ? "" : "none";
      });
    };
  }
  document.querySelectorAll("[data-sign]").forEach(function (b) {
    b.onclick = function () {
      signAcademy(S, b.getAttribute("data-sign"));
      nextDecision();
      save();
      render();
    };
  });
  document.querySelectorAll("[data-choice]").forEach(function (b) {
    b.onclick = function () {
      applyChoice(S, UI.event, b.getAttribute("data-choice"));
      UI.reports = advance(S);
      UI.screen = "report";
      save();
      render();
    };
  });
  var dl = document.getElementById("dl");
  if (dl) dl.onclick = function () { downloadCard(); };
}

function go(to) {
  if (to === "home") UI.screen = "home";
  else if (to === "create") {
    UI.draft = { name: "SILVA", number: 10, foot: "D", nation: "br", pos: "ATA", pace: "normal", step: 0 };
    UI.screen = "create";
  } else if (to === "continue") {
    var s = load();
    if (s) {
      S = s;
      if (s.retired) UI.screen = "legacy";
      else nextDecision();
    }
  } else if (to === "academies") {
    var inp = document.getElementById("nm");
    if (inp) UI.draft.name = inp.value.toUpperCase().slice(0, 12) || "SILVA";
    if (UI.draft) UI.draft.step = 2;
    S = newCareer(UI.draft);
    UI.offers = academyOffers(S);
    UI.screen = "academy";
  } else if (to === "decision") nextDecision();
  else if (to === "legacy") UI.screen = "legacy";
  else if (to === "new") {
    clearSave();
    S = null;
    UI.event = null;
    UI.reports = [];
    UI.offers = null;
    UI.draft = { name: "SILVA", number: 10, foot: "D", nation: "br", pos: "ATA", pace: "normal", step: 0 };
    UI.screen = "create";
  } else if (to === "reset") {
    if (!window.confirm("Apagar a carreira salva e recomeçar do zero?")) return;
    clearSave();
    S = null;
    UI.event = null;
    UI.reports = [];
    UI.offers = null;
    UI.draft = null;
    UI.screen = "home";
    render();
    return;
  }
  if (S && S.clubId) save();
  render();
}

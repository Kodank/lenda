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

var KIT_PATTERN = {
  br: "hoops", ar: "stripes", uy: "stripes", co: "solid", mx: "solid",
  pt: "solid", es: "solid", en: "solid", fr: "solid", it: "solid",
  de: "solid", nl: "solid", us: "bars", jp: "solid", ng: "solid", sn: "solid"
};

function shirtHtml(c1, c2, number, name, on, nation) {
  on = on || onColor(c1);
  var pat = KIT_PATTERN[nation] || "solid";
  var nm = esc((name || "SILVA").toUpperCase().slice(0, 12));
  var num = esc(String(number == null ? 10 : number));
  var uid = "k" + Math.random().toString(36).slice(2, 8);
  var fillBody = "url(#" + uid + "body)";
  var patternDefs = "";
  if (pat === "stripes") {
    patternDefs =
      '<pattern id="' + uid + 'body" width="14" height="8" patternUnits="userSpaceOnUse">' +
      '<rect width="14" height="8" fill="' + c1 + '"/>' +
      '<rect x="0" width="7" height="8" fill="' + c2 + '"/>' +
      "</pattern>";
  } else if (pat === "hoops") {
    patternDefs =
      '<pattern id="' + uid + 'body" width="8" height="16" patternUnits="userSpaceOnUse">' +
      '<rect width="8" height="16" fill="' + c1 + '"/>' +
      '<rect y="0" width="8" height="8" fill="' + c2 + '"/>' +
      "</pattern>";
  } else if (pat === "bars") {
    patternDefs =
      '<pattern id="' + uid + 'body" width="8" height="18" patternUnits="userSpaceOnUse">' +
      '<rect width="8" height="18" fill="' + c1 + '"/>' +
      '<rect y="0" width="8" height="6" fill="' + c2 + '"/>' +
      '<rect y="12" width="8" height="6" fill="' + c2 + '"/>' +
      "</pattern>";
  } else {
    fillBody = c1;
  }
  return '<div class="shirt-stage" aria-hidden="true">' +
    '<svg class="shirt-svg" viewBox="0 0 200 220" width="180" height="198">' +
    "<defs>" +
    '<linearGradient id="' + uid + 'sh" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="#fff" stop-opacity=".18"/>' +
    '<stop offset="55%" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="100%" stop-color="#000" stop-opacity=".22"/>' +
    "</linearGradient>" +
    '<linearGradient id="' + uid + 'sl" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0%" stop-color="' + c2 + '"/>' +
    '<stop offset="100%" stop-color="' + c1 + '"/>' +
    "</linearGradient>" +
    patternDefs +
    "</defs>" +
    /* shadow */
    '<ellipse cx="100" cy="208" rx="52" ry="8" fill="#000" opacity=".28"/>' +
    /* left sleeve */
    '<path d="M46 52 L18 70 L28 118 L58 96 Z" fill="url(#' + uid + 'sl)" stroke="rgba(0,0,0,.25)" stroke-width="1"/>' +
    /* right sleeve */
    '<path d="M154 52 L182 70 L172 118 L142 96 Z" fill="url(#' + uid + 'sl)" stroke="rgba(0,0,0,.25)" stroke-width="1"/>' +
    /* body */
    '<path d="M62 48 C70 36 86 30 100 30 C114 30 130 36 138 48 L152 58 L148 200 L52 200 L48 58 Z" fill="' + fillBody + '" stroke="rgba(0,0,0,.3)" stroke-width="1.2"/>' +
    /* shine */
    '<path d="M62 48 C70 36 86 30 100 30 C114 30 130 36 138 48 L152 58 L148 200 L52 200 L48 58 Z" fill="url(#' + uid + 'sh)"/>' +
    /* collar */
    '<path d="M78 34 C88 28 112 28 122 34 L118 48 C110 42 90 42 82 48 Z" fill="' + c2 + '" stroke="rgba(0,0,0,.35)" stroke-width="1"/>' +
    '<path d="M92 34 L100 46 L108 34" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="2"/>' +
    /* cuffs */
    '<path d="M18 70 L28 118 L36 114 L28 72 Z" fill="' + c2 + '" opacity=".9"/>' +
    '<path d="M182 70 L172 118 L164 114 L172 72 Z" fill="' + c2 + '" opacity=".9"/>' +
    /* name + number */
    '<text x="100" y="92" text-anchor="middle" fill="' + on + '" font-family="Barlow Condensed, Arial Black, sans-serif" font-size="15" font-weight="700" letter-spacing="2">' + nm + "</text>" +
    '<text x="100" y="148" text-anchor="middle" fill="' + on + '" font-family="Barlow Condensed, Arial Black, sans-serif" font-size="64" font-weight="800">' + num + "</text>" +
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

function stripHtml(s) {
  var club = clubOf(s.clubId);
  var nat = nationOf(s.nation);
  return '<div class="strip">' +
    '<img class="crest" src="' + club.crest + '" alt="">' +
    '<div class="who"><b>' + esc(s.name) + "</b><span>" +
    '<img src="' + nat.flag + '" width="16" height="11" style="display:inline;border-radius:1px;vertical-align:-1px"> ' +
    POS[s.pos].short + " · " + s.age + " anos · " + esc(club.name) + "</span></div>" +
    '<div class="ovr"><span>OVR</span><b>' + s.ovr + "</b></div></div>";
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

function viewCreate() {
  var d = UI.draft;
  var kit = NATION_KIT[d.nation] || ["#1f8a4c", "#111"];
  var flags = NATIONS.map(function (n) {
    return '<button type="button" class="flag-btn' + (d.nation === n.id ? " on" : "") + '" data-nation="' + n.id + '">' +
      '<img src="' + n.flag + '" alt="">' + esc(n.name) + "</button>";
  }).join("");
  var slots = PITCH.map(function (p) {
    return '<button type="button" class="slot' + (d.pos === p.pos ? " on" : "") + '" data-pos="' + p.pos +
      '" style="left:' + p.x + "%;top:" + p.y + '%">' + p.pos + "</button>";
  }).join("");
  var feet = [["D", "Destro"], ["E", "Canhoto"], ["A", "Ambidestro"]].map(function (f) {
    return '<button type="button" class="chip' + (d.foot === f[0] ? " on" : "") + '" data-foot="' + f[0] + '">' + f[1] + "</button>";
  }).join("");
  var paces = ["intensa", "normal", "expressa"].map(function (k) {
    var p = PACE[k];
    return '<button type="button" class="pace' + (d.pace === k ? " on" : "") + '" data-pace="' + k + '"><b>' + p.label + "</b><small>" + p.hint + "</small></button>";
  }).join("");
  return '<div class="top"><div class="brand">LENDA</div><button class="ghost danger" data-go="reset">Reiniciar tudo</button></div>' +
    shirtHtml(kit[0], kit[1], d.number, d.name || "SILVA", null, d.nation) +
    '<div class="card"><div class="label">Nome na camisa</div>' +
    '<input id="nm" type="text" maxlength="12" value="' + esc(d.name) + '" placeholder="SOBRENOME"></div>' +
    '<div class="card"><h2>Nacionalidade</h2><div class="flags">' + flags + "</div></div>" +
    '<div class="card"><h2>Posição</h2><div class="pitch-wrap"><div class="pitch"></div>' + slots + "</div>" +
    '<p class="lead" style="margin:10px 0 0">16 anos · OVR 50 · ' + POS[d.pos].name + "</p></div>" +
    '<div class="card"><h2>Camisa</h2><div class="dorsal"><button class="chip" data-num="-1">−</button><b class="num">' + d.number + '</b><button class="chip" data-num="1">+</button></div></div>' +
    '<div class="card"><h2>Perna</h2><div class="row">' + feet + "</div></div>" +
    '<div class="card"><h2>Ritmo</h2><div class="pace-grid">' + paces + "</div></div>" +
    '<button class="btn" data-go="academies">Ver academias</button>';
}

function viewAcademy() {
  var offers = UI.offers || [];
  var cards = offers.map(function (o) {
    var lg = leagueOf(o.club.leagueId);
    var c1 = o.club.colors[0], c2 = o.club.colors[1];
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
    '<p class="lead">Três ofertas. A camisa grande não é sempre o caminho mais rápido até o primeiro time.</p>' + cards;
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

function careerLogHtml(s, hiN) {
  var rows = s.seasons || [];
  if (!rows.length) return "";
  var html = '<div class="feed"><div class="feed-h">Carreira</div>';
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
      '<div><div class="szn-top"><b>' + esc(club.name) + '</b>' +
      (lg ? '<img class="szn-lg" src="' + lg.logo + '" title="' + esc(lg.name) + '" alt="">' : "") +
      "</div>" +
      '<div class="szn-stats">' + r.apps + " J · " + g + " " + gLab + " · " + a + " " + aLab + " · #" + r.leaguePos + "</div>" +
      (cups ? '<div class="szn-cups">' + cups + "</div>" : "") +
      "</div>" +
      '<div class="szn-ovr"><b>' + r.ovr + "</b>" + dlt + "</div></article>";
  }
  return html + "</div>";
}

function viewDecision() {
  var ev = UI.event;
  var s = S;
  return '<div class="top"><div class="brand">LENDA</div><button class="ghost danger" data-go="reset">Reiniciar tudo</button></div>' +
    stripHtml(s) + trophyCaseHtml(s) +
    '<div class="story"><div class="meta">' + esc(clubOf(s.clubId).name) + " · " + s.age + " anos · " + fmtMoney(s.value) + "</div>" +
    "<h2>" + esc(ev.title) + "</h2>" +
    "<p>" + esc(ev.text) + "</p></div>" +
    choiceBtn("a", ev.a) + choiceBtn("b", ev.b) + choiceBtn("c", ev.c) +
    careerLogHtml(s, 0);
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
    recap = '<p class="lead">' + esc(club.name) + " · OVR " + last.ovr + " (" + fmtDelta(last.delta) + ") · " +
      last.apps + " jogos · " + (s.pos === "GOL" ? last.cs + " CS" : last.goals + " gols / " + last.assists + " ast") +
      " · #" + last.leaguePos + nt +
      "</p>" +
      (cups.length ? '<div class="report-cups">' + cups.map(function (id) {
        return '<div class="report-cup"><img src="' + trophyOf(id).img + '" alt=""><b>' + esc(trophyOf(id).name) + "</b></div>";
      }).join("") + "</div>" : "");
  }
  var next = s.retired ? "legacy" : "decision";
  return '<div class="top"><div class="brand">LENDA</div><button class="ghost danger" data-go="reset">Reiniciar tudo</button></div>' +
    stripHtml(s) + trophyCaseHtml(s) + recap + (S._lastRisk ? '<div class="risk-toast ' + (S._lastRisk.ok ? 'ok' : 'bad') + '">' + esc(S._lastRisk.text) + '</div>' : '') + careerLogHtml(s, reps.length) +
    '<button class="btn" data-go="' + next + '">' + (s.retired ? "Ver o quadro" : "Próxima decisão") + "</button>";
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
    return '<div class="vitrine-item"><img src="' + trophyOf(id).img + '" alt=""><span>' + esc(trophyOf(id).name) + '</span></div>';
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
    careerLogHtml(s, 0) +
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

function bind() {
  document.querySelectorAll("[data-go]").forEach(function (b) {
    b.onclick = function () { go(b.getAttribute("data-go")); };
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
      render();
    };
  });
  var nm = document.getElementById("nm");
  if (nm) {
    nm.oninput = function () {
      UI.draft.name = nm.value.toUpperCase().slice(0, 12);
      var el = document.querySelector(".shirt-name");
      if (el) el.textContent = UI.draft.name || "SILVA";
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
    UI.draft = { name: "SILVA", number: 10, foot: "D", nation: "br", pos: "ATA", pace: "normal" };
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
    UI.draft = { name: "SILVA", number: 10, foot: "D", nation: "br", pos: "ATA", pace: "normal" };
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

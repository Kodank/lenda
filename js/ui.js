var NATION_KIT = {
  /* [body, trim] — flat illustrated NT kits (Copero-like) */
  br: ["#FFDF00", "#009B3A"], ar: ["#74ACDF", "#FFFFFF"], uy: ["#0038A8", "#FFFFFF"],
  co: ["#FCD116", "#CE1126"], mx: ["#006847", "#FFFFFF"], pt: ["#006600", "#FF0000"],
  es: ["#AA151B", "#F1BF00"], en: ["#FFFFFF", "#CE1126"], fr: ["#002395", "#ED2939"],
  it: ["#0066B3", "#FFFFFF"], de: ["#FFFFFF", "#000000"], nl: ["#F36C21", "#FFFFFF"],
  us: ["#FFFFFF", "#BF0A30"], jp: ["#FFFFFF", "#BC002D"], ng: ["#008751", "#FFFFFF"],
  sn: ["#00853F", "#E31C23"]
};

/* Pattern / ink overrides by nationality */
var NATION_STYLE = {
  ar: { pattern: "stripes", stripe: "#FFFFFF", ink: "#12151a" },
  uy: { pattern: "stripes", stripe: "#FFFFFF", ink: "#12151a" },
  br: { pattern: "solid", ink: "#009B3A" },
  fr: { pattern: "solid", ink: "#FFFFFF" },
  it: { pattern: "solid", ink: "#FFFFFF" },
  es: { pattern: "solid", ink: "#FFFFFF" },
  en: { pattern: "solid", ink: "#CE1126" },
  de: { pattern: "solid", ink: "#12151a" },
  pt: { pattern: "solid", ink: "#FFFFFF" },
  nl: { pattern: "solid", ink: "#FFFFFF" },
  co: { pattern: "solid", ink: "#CE1126" },
  mx: { pattern: "solid", ink: "#FFFFFF" },
  us: { pattern: "solid", ink: "#002868" },
  jp: { pattern: "solid", ink: "#BC002D" },
  ng: { pattern: "solid", ink: "#FFFFFF" },
  sn: { pattern: "solid", ink: "#FFFFFF" }
};

function crestSrc(path) {
  return path || "img/clubs/fla.png";
}

function crestInitials(name) {
  var parts = String(name || "?").replace(/[^A-Za-zÀ-ÿ0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  var init = parts.map(function (w) { return w[0]; }).join("").slice(0, 2);
  return (init || "?").toUpperCase();
}

function crestBroken(el) {
  if (!el || el._crestFb) return;
  el._crestFb = 1;
  var s = document.createElement("span");
  s.className = ((el.className || "crest") + " crest-fallback").replace(/\s+/g, " ").trim();
  s.textContent = el.getAttribute("data-fb") || "?";
  s.setAttribute("title", el.getAttribute("title") || el.getAttribute("alt") || "");
  if (el.parentNode) el.parentNode.replaceChild(s, el);
}

function imgCrest(path, cls, name) {
  var fb = crestInitials(name);
  return '<img class="' + (cls || "crest") + '" src="' + crestSrc(path) + '" alt="" data-fb="' + esc(fb) +
    '" onerror="crestBroken(this)">';
}

function esc(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}


function ovrTier(ovr) {
  var n = +ovr || 0;
  if (n >= 99) return "ovr-99";
  if (n >= 95) return "ovr-mythic";
  if (n >= 90) return "ovr-diamond";
  if (n >= 80) return "ovr-gold";
  if (n >= 70) return "ovr-silver";
  return "ovr-copper";
}

function ovrTierStyle(ovr) {
  var t = ovrTier(ovr);
  var map = {
    "ovr-copper": {
      bg: "linear-gradient(145deg,#d08a4a 0%,#a05a28 42%,#6a3a18 100%)",
      color: "#fff8ee",
      border: "rgba(255,220,180,.35)",
      glow: "0 6px 16px rgba(0,0,0,.35)"
    },
    "ovr-silver": {
      bg: "linear-gradient(145deg,#f7f9fc 0%,#c5ceda 45%,#8a95a5 100%)",
      color: "#1a1f28",
      border: "rgba(255,255,255,.55)",
      glow: "0 6px 16px rgba(0,0,0,.3)"
    },
    "ovr-gold": {
      bg: "linear-gradient(145deg,#ffe9a8 0%,#f5b021 40%,#c86e00 100%)",
      color: "#1a1208",
      border: "rgba(255,230,150,.55)",
      glow: "0 6px 18px rgba(245,176,33,.35)"
    },
    "ovr-diamond": {
      bg: "linear-gradient(135deg,rgba(255,255,255,.65),transparent 40%),linear-gradient(145deg,#f2fbff 0%,#9ad7f2 35%,#4f84d6 72%,#eaf7ff 100%)",
      color: "#0c1a2e",
      border: "rgba(255,255,255,.7)",
      glow: "0 0 18px rgba(120,200,255,.4)"
    },
    "ovr-mythic": {
      bg: "radial-gradient(circle at 30% 20%,rgba(255,180,255,.5),transparent 45%),linear-gradient(145deg,#d4a1ff 0%,#8b5cf6 45%,#4c1d95 100%)",
      color: "#faf5ff",
      border: "rgba(255,200,255,.5)",
      glow: "0 0 22px rgba(168,85,247,.5)"
    },
    "ovr-99": {
      bg: "conic-gradient(from 120deg,#fff7ae,#ff4ecd,#7c3aed,#22d3ee,#fff7ae)",
      color: "#ffffff",
      border: "rgba(255,255,255,.75)",
      glow: "0 0 28px rgba(255,78,205,.55)"
    }
  };
  return map[t] || map["ovr-copper"];
}

function ovrBadgeHtml(ovr, label) {
  label = label || "OVR";
  var t = ovrTier(ovr);
  var st = ovrTierStyle(ovr);
  return '<div class="ovr-badge ' + t + '" style="background:' + st.bg + ";color:" + st.color +
    ";border:1px solid " + st.border + ";box-shadow:" + st.glow +
    ';width:64px;height:64px;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center">' +
    '<span style="font-size:10px;font-weight:800;letter-spacing:.12em;opacity:.9;color:inherit">' + label + "</span>" +
    '<b style="font-family:Barlow Condensed,sans-serif;font-size:32px;line-height:.9;font-weight:800;color:inherit">' + ovr + "</b></div>";
}

function ovrTlHtml(ovr, deltaHtml) {
  var st = ovrTierStyle(ovr);
  return '<span class="tl-ovr ' + ovrTier(ovr) + '" style="color:' + st.color + ';background:' + st.bg +
    ';border:1px solid ' + st.border + ';border-radius:6px;padding:0 4px;font-weight:800;' +
    'display:inline-flex;align-items:center;justify-content:center;gap:2px;' +
    'max-width:100%;height:18px;line-height:1;overflow:hidden;box-sizing:border-box">' +
    ovr + (deltaHtml || "") + "</span>";
}
function clubNameHtml(name, cls) {
  cls = cls || "club-name";
  /* inline + chip: readable even if Brave auto-dark inverts fill */
  return '<span class="' + cls + '" style="color:#f4f6f8 !important;-webkit-text-fill-color:#f4f6f8 !important;' +
    'forced-color-adjust:none;filter:none;opacity:1;display:inline-block;' +
    'font-weight:700;font-size:15px;line-height:1.25;letter-spacing:.01em">' +
    esc(name) + "</span>";
}

function enforceLightInk() {
  var sel = ".offer-name,.club-name,.tl-name,.tl-club b,.choice.transfer b,.choice .club-label,h2.club-title,.report .club-title";
  document.querySelectorAll(sel).forEach(function (el) {
    el.style.setProperty("color", "#f4f6f8", "important");
    el.style.setProperty("-webkit-text-fill-color", "#f4f6f8", "important");
    el.style.setProperty("forced-color-adjust", "none", "important");
    el.style.setProperty("filter", "none", "important");
    el.style.setProperty("opacity", "1", "important");
  });
}

function onColor(hex) {
  var h = (hex || "#111").replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.58 ? "#12151a" : "#ffffff";
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

function kitPalette(c1, c2, nation) {
  var st = (nation && NATION_STYLE[nation]) || {};
  var body = c1 || "#f6f6f4";
  var trim = c2 || "#1a1d24";
  var ink = st.ink || onColor(body);
  var crease = mixHex(body, "#000000", hexLum(body) > 0.55 ? 0.14 : 0.22);
  var shade = mixHex(body, "#000000", 0.12);
  var hi = mixHex(body, "#ffffff", 0.18);
  return {
    body: body, trim: trim, ink: ink, crease: crease, shade: shade, hi: hi,
    pattern: st.pattern || "solid",
    stripe: st.stripe || c2 || "#ffffff"
  };
}

/** Flat illustrated back-of-shirt (Copero-like): solid NT fills, stripes, subtle creases */
function shirtHtml(c1, c2, number, name, nation) {
  var pal = kitPalette(c1 || "#f7f7f5", c2 || "#1a1d24", nation);
  var nm = esc((name || "SILVA").toUpperCase().slice(0, 12));
  var num = esc(String(number == null ? 10 : number));
  var uid = "k" + Math.random().toString(36).slice(2, 8);
  var bodyPath = "M78 58 C88 36 102 28 120 28 C138 28 152 36 162 58 L178 72 C180 80 182 96 180 210 C180 224 158 236 120 236 C82 236 60 224 60 210 C58 96 60 80 62 72 Z";
  var sleeveL = "M78 58 C64 66 40 78 30 96 C24 112 30 138 42 148 C52 138 62 118 72 100 Z";
  var sleeveR = "M162 58 C176 66 200 78 210 96 C216 112 210 138 198 148 C188 138 178 118 168 100 Z";
  var clip = uid + "clip";

  var patternLayer = "";
  if (pal.pattern === "stripes") {
    /* vertical sky-blue/white NT stripes clipped to torso */
    patternLayer =
      '<g clip-path="url(#' + clip + ')">' +
      '<rect x="56" y="28" width="128" height="210" fill="' + pal.stripe + '"/>' +
      '<rect x="56" y="28" width="18" height="210" fill="' + pal.body + '"/>' +
      '<rect x="92" y="28" width="18" height="210" fill="' + pal.body + '"/>' +
      '<rect x="128" y="28" width="18" height="210" fill="' + pal.body + '"/>' +
      '<rect x="164" y="28" width="18" height="210" fill="' + pal.body + '"/>' +
      "</g>";
  }

  return '<div class="shirt-stage" aria-hidden="true">' +
    '<svg class="shirt-svg" viewBox="0 0 240 270" width="220" height="248">' +
    "<defs>" +
    '<clipPath id="' + clip + '"><path d="' + bodyPath + '"/></clipPath>' +
    '<linearGradient id="' + uid + 'soft" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="#fff" stop-opacity=".16"/>' +
    '<stop offset="45%" stop-color="#fff" stop-opacity="0"/>' +
    '<stop offset="100%" stop-color="#000" stop-opacity=".14"/>' +
    "</linearGradient>" +
    '<linearGradient id="' + uid + 'side" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0%" stop-color="#000" stop-opacity=".10"/>' +
    '<stop offset="18%" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="82%" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="100%" stop-color="#000" stop-opacity=".10"/>' +
    "</linearGradient>" +
    "</defs>" +
    /* soft ground shadow */
    '<ellipse cx="120" cy="256" rx="58" ry="8" fill="#000" opacity=".28"/>' +
    /* sleeves */
    '<path d="' + sleeveL + '" fill="' + (pal.pattern === "stripes" ? pal.stripe : pal.body) + '"/>' +
    '<path d="' + sleeveR + '" fill="' + (pal.pattern === "stripes" ? pal.stripe : pal.body) + '"/>' +
    /* torso */
    '<path d="' + bodyPath + '" fill="' + pal.body + '"/>' +
    patternLayer +
    /* soft volume */
    '<path d="' + bodyPath + '" fill="url(#' + uid + 'soft)"/>' +
    '<path d="' + bodyPath + '" fill="url(#' + uid + 'side)"/>' +
    /* fabric creases — flat illustrated, not photoreal */
    '<path d="M96 70 C100 110 98 150 102 200" fill="none" stroke="' + pal.crease + '" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>' +
    '<path d="M144 70 C140 110 142 150 138 200" fill="none" stroke="' + pal.crease + '" stroke-width="2.2" stroke-linecap="round" opacity=".45"/>' +
    '<path d="M86 64 C104 52 136 52 154 64" fill="none" stroke="' + pal.crease + '" stroke-width="1.8" stroke-linecap="round" opacity=".4"/>' +
    '<path d="M74 198 C100 190 140 190 166 198" fill="none" stroke="' + pal.crease + '" stroke-width="2" stroke-linecap="round" opacity=".35"/>' +
    '<path d="M80 214 C110 206 130 206 160 214" fill="none" stroke="' + pal.crease + '" stroke-width="1.6" stroke-linecap="round" opacity=".28"/>' +
    /* collar + cuffs (trim) */
    '<path d="M98 36 C110 26 130 26 142 36 L136 58 C128 50 112 50 104 58 Z" fill="' + pal.trim + '"/>' +
    '<path d="M30 96 C26 112 32 136 42 148 L50 138 C42 126 38 110 40 100 Z" fill="' + pal.trim + '"/>' +
    '<path d="M210 96 C214 112 208 136 198 148 L190 138 C198 126 202 110 200 100 Z" fill="' + pal.trim + '"/>' +
    /* name + number */
    '<text class="shirt-name" x="120" y="102" text-anchor="middle" fill="' + pal.ink + '" font-family="Barlow Condensed, Arial Black, sans-serif" font-size="20" font-weight="800" letter-spacing="4">' + nm + "</text>" +
    '<text class="shirt-num" x="120" y="176" text-anchor="middle" fill="' + pal.ink + '" font-family="Barlow Condensed, Arial Black, sans-serif" font-size="82" font-weight="800">' + num + "</text>" +
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
  var temp = tempOvrTotal(s);
  var showOvr = temp ? effectiveOvr(s) : s.ovr;
  return '<div class="id-strip" data-ovr-tier="' + ovrTier(showOvr) + '">' +
    ovrBadgeHtml(showOvr) +
    (temp
      ? '<div class="temp-ovr-tag ' + (temp < 0 ? "dn" : "up") + '">OVR tmp ' + (temp > 0 ? "+" : "") + temp + "</div>"
      : "") +
    '<div class="id-meta">' +
    '<div class="id-line">' +
    '<img class="mini-flag" src="' + nat.flag + '" alt="">' +
    '<span class="pill">#' + s.number + " " + POS[s.pos].short + "</span>" +
    clubNameHtml(club.name, "club-name") +
    imgCrest(club.crest, 'crest sm', club.name) +
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
  enforceLightInk();
  if (typeof JUICE !== "undefined") {
    JUICE.bindSoundToggle();
    if (UI.screen === "report" && S) {
      JUICE.onReportEnter(S, UI.reports || [], UI._prevOvr);
      UI._prevOvr = null;
    } else if (S && typeof JUICE.ensureJuice === "function") {
      JUICE.ensureJuice(S);
    }
  }
  if (typeof devAfterRender === "function") devAfterRender();
}


function topBarHtml(brand, slim) {
  brand = brand || "LENDA";
  return '<div class="top' + (slim ? " slim" : "") + '"><div class="brand">' + brand + "</div>" +
    '<div class="top-actions">' +
    (typeof JUICE !== "undefined" ? JUICE.soundToggleHtml() : "") +
    '<button class="ghost danger" data-go="reset">Reiniciar tudo</button>' +
    "</div></div>";
}

function viewHome() {
  var has = !!load();
  return '<div class="home">' +
    '<div class="home-top">' +
    (typeof JUICE !== "undefined" ? JUICE.soundToggleHtml() : "") +
    "</div>" +
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
  var top = topBarHtml("LENDA", false) +
    createProgress(step);

  if (step === 0) {
    var feet = [["D", "Destro"], ["E", "Canhoto"], ["A", "Ambidestro"]].map(function (f) {
      return '<button type="button" class="chip' + (d.foot === f[0] ? " on" : "") + '" data-foot="' + f[0] + '">' + f[1] + "</button>";
    }).join("");
    var paces = ["intensa", "normal", "rapido"].map(function (k) {
      var p = PACE[k];
      var extra = k === "rapido" ? '<i class="pace-new">novo</i>' : "";
      return '<button type="button" class="chip pace-chip' + (d.pace === k ? " on" : "") + (k === "rapido" ? " pace-rapido" : "") +
        '" data-pace="' + k + '" title="' + esc(p.hint) + '">' + p.label + extra + "</button>";
    }).join("");
    var paceHint = (PACE[d.pace] || PACE.normal).hint;
    return top +
      '<div class="step-card focus-shirt">' +
      "<h2>Define a camisa</h2>" +
      '<p class="lead tight">Nome, número e perna — o resto vem depois.</p>' +
      '<div class="shirt-panel">' + shirtHtml(kit[0], kit[1], d.number, d.name || "SILVA", d.nation) + "</div>" +
      '<div class="field-grid">' +
      '<div><div class="label">Sobrenome</div><input id="nm" type="text" maxlength="12" value="' + esc(d.name) + '" placeholder="SOBRENOME"></div>' +
      '<div><div class="label">Número</div><div class="dorsal compact"><button type="button" class="chip" data-num="-1">−</button><b class="num">' + d.number + '</b><button type="button" class="chip" data-num="1">+</button></div></div>' +
      "</div>" +
      '<div class="label">Perna boa</div><div class="row">' + feet + "</div>" +
      '<div class="label" style="margin-top:12px">Ritmo da carreira</div>' +
      '<div class="row pace-row">' + paces + "</div>" +
      '<div class="pace-hint">' + esc(paceHint) + "</div>" +
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
      '<div class="shirt-mini">' + shirtHtml(kit[0], kit[1], d.number, d.name || "SILVA", d.nation) + "</div>" +
      '<div class="nation-panel"><input id="nat-search" type="text" placeholder="Buscar país…" autocomplete="off">' +
      '<div class="flag-list" id="flag-list">' + flags + "</div></div>" +
      "</div>" +
      '<div class="step-actions">' +
      '<button class="btn alt" data-step="0">Voltar</button>' +
      '<button class="btn" data-step="2">Continuar</button>' +
      "</div></div>";
  }

  /* step 2 — position + career goals */
  if (!d.goalIds) d.goalIds = [];
  var slots = PITCH.map(function (p) {
    return '<button type="button" class="slot' + (d.pos === p.pos ? " on" : "") + '" data-pos="' + p.pos +
      '" style="left:' + p.x + "%;top:" + p.y + '%">' + p.pos + "</button>";
  }).join("");
  var goalPool = (typeof CAREER_GOAL_POOL !== "undefined" ? CAREER_GOAL_POOL : []);
  var goalChips = goalPool.map(function (g) {
    var on = d.goalIds.indexOf(g.id) >= 0;
    return '<button type="button" class="chip goal-pick' + (on ? " on" : "") + '" data-goal="' + g.id + '">' + esc(g.label) + "</button>";
  }).join("");
  var gCount = d.goalIds.length;
  return top +
    '<div class="step-card focus-pos">' +
    "<h2>Posição</h2>" +
    '<p class="lead tight">16 anos · OVR 50 · toca no campo para escolher.</p>' +
    '<div class="pos-split">' +
    '<div class="pos-summary">' +
    '<div class="shirt-mini">' + shirtHtml(kit[0], kit[1], d.number, d.name || "SILVA", d.nation) + "</div>" +
    '<div class="pos-now"><span class="label">Posição</span><b>' + POS[d.pos].name + "</b>" +
    "<small>" + POS[d.pos].short + "</small></div></div>" +
    '<div class="pitch-wrap compact"><div class="pitch"></div>' + slots + "</div>" +
    "</div>" +
    '<div class="goals-pick-block">' +
    '<div class="label">Metas da carreira <span class="goals-count">' + gCount + "/2</span></div>" +
    '<p class="lead tight goals-lead">Escolhe 2 objetivos — eles ficam no painel durante a carreira.</p>' +
    '<div class="row goals-pick-row">' + goalChips + "</div>" +
    "</div>" +
    '<div class="step-actions">' +
    '<button class="btn alt" data-step="1">Voltar</button>' +
    '<button class="btn" data-go="academies">Ver academias</button>' +
    "</div></div>";
}

function sortedClubsByName() {
  var list = (typeof CLUBS !== "undefined" ? CLUBS : []).slice();
  list.sort(function (a, b) {
    return String(a.name).localeCompare(String(b.name), "pt");
  });
  return list;
}

function clubPickerRowHtml(c, signAttr) {
  var nat = nationOf(c.nation);
  var attr = signAttr || "data-sign";
  return '<button type="button" class="dev-club-row" ' + attr + '="' + c.id + '" data-club-q="' +
    esc((c.name + " " + (nat ? nat.name : "") + " " + (c.city || "")).toLowerCase()) + '">' +
    imgCrest(c.crest, "dev-club-crest", c.name) +
    '<span class="dev-club-meta">' +
    clubNameHtml(c.name, "dev-club-name") +
    '<small class="dev-club-nat">' +
    (nat && nat.flag ? '<img class="mini-flag" src="' + nat.flag + '" alt="">' : "") +
    esc(nat ? nat.name : c.nation) +
    "</small></span></button>";
}

function viewDevAcademyPicker() {
  if (typeof DEV === "undefined" || !DEV.on || !DEV.on()) return "";
  var rows = sortedClubsByName().map(function (c) {
    return clubPickerRowHtml(c, "data-sign");
  }).join("");
  return '<div class="step-card dev-academy-pick">' +
    '<div class="dev-sandbox-tag">DEV · Sandbox</div>' +
    "<h2>Qualquer clube</h2>" +
    '<p class="lead tight">Busque e inicie a Base em qualquer time do banco (qualquer país).</p>' +
    '<input id="dev-academy-q" type="search" placeholder="Buscar clube, país ou cidade…" autocomplete="off">' +
    '<div class="dev-club-list" id="dev-academy-list">' + rows + "</div></div>";
}

function viewAcademy() {
  var offers = UI.offers || [];
  var cards = offers.map(function (o) {
    var lg = leagueOf(o.club.leagueId);
    return '<div class="card offer" role="button" tabindex="0" data-sign="' + o.club.id + '">' +
      imgCrest(o.club.crest, 'crest', o.club.name) +
      '<div class="bars">' +
      clubNameHtml(o.club.name, "offer-name") +
      '<div class="offer-meta">' +
      '<img class="lg-logo" src="' + lg.logo + '" alt="">' +
      '<span style="color:#c5ccd6;-webkit-text-fill-color:#c5ccd6">' +
      esc(lg.name) + (o.casa ? " · casa" : " · exterior") + "</span></div>" +
      '<div class="label" style="color:#c5ccd6;-webkit-text-fill-color:#c5ccd6">Formação</div><div class="bar"><i style="width:' + o.formacao + '%"></i></div>' +
      '<div class="label" style="color:#c5ccd6;-webkit-text-fill-color:#c5ccd6">Minutos</div><div class="bar"><i style="width:' + o.minutos + '%"></i></div>' +
      '<div class="label" style="color:#c5ccd6;-webkit-text-fill-color:#c5ccd6">Pressão</div><div class="bar"><i style="width:' + o.pressao + '%"></i></div>' +
      "</div></div>";
  }).join("");
  return topBarHtml("BASE", false) +
    '<div class="step-card">' +
    "<h2>Academia</h2>" +
    '<p class="lead tight">Três ofertas. A camisa grande não é sempre o caminho mais rápido.</p>' +
    '<div class="academy-grid">' + cards + "</div></div>" +
    viewDevAcademyPicker();
}


function outcomeBoardHtml(out) {
  if (!out) return "";
  var pills = (typeof sanitizePillsList === "function") ? sanitizePillsList(out.pills || []) : (out.pills || []);
  var pillsRow = pillsHtml(pills, "landed");
  var hasTemp = !!out.temp;
  if (!pillsRow && !hasTemp) return "";
  return '<div class="outcome-board">' +
    '<div class="outcome-label">Resultado da escolha</div>' +
    pillsRow +
    (hasTemp
      ? '<div class="temp-ovr-tag ' + (out.temp < 0 ? "dn" : "up") + '">OVR tmp ' +
        (out.temp > 0 ? "+" : "") + out.temp + "</div>"
      : "") +
    "</div>";
}

function pillsHtml(pills, mode) {
  /* Empty list → no .choice-pills container and no placeholder "Nada" pill. */
  pills = (typeof sanitizePillsList === "function") ? sanitizePillsList(pills) : (pills || []);
  if (!pills.length) return "";
  var inner = pills.map(function (p) {
    var kind = p.kind || "neutral";
    var text = String(p.text || "").trim();
    if (!text) return "";
    if (typeof isEmptyPillLabel === "function" && isEmptyPillLabel(text)) return "";
    if (typeof isAssetPathLabel === "function" && isAssetPathLabel(text)) return "";
    var cls = "fx-pill " + kind + (mode === "landed" && p.landed ? " landed" : "");
    return '<span class="' + cls + '">' + esc(text) + "</span>";
  }).join("");
  if (!inner) return "";
  return '<div class="choice-pills' + (mode === "landed" ? " resolved" : "") + '">' + inner + "</div>";
}

function choiceBtn(side, ch, ev, sideIdx) {
  if (!ch) return "";
  if (ch.crest) {
    var lg = ch.leagueId ? leagueOf(ch.leagueId) : null;
    var nat = ch.nation ? nationOf(ch.nation) : null;
    var cols = ch.colors || ["#222", "#111"];
    return '<button class="choice transfer" data-choice="' + side + '" style="--c1:' + cols[0] + ";--c2:" + (cols[1] || cols[0]) + ';--on:#ffffff">' +
      imgCrest(ch.crest, 'choice-crest', ch.label) +
      "<div class='choice-body'>" + clubNameHtml(ch.label, "club-name") + "<small>" + esc(ch.hint) + "</small>" +
      '<div class="choice-meta">' +
      (lg ? '<img class="lg-logo" src="' + lg.logo + '" alt="">' + esc(lg.name) : "") +
      (nat ? ' <img class="mini-flag" src="' + nat.flag + '" alt="">' : "") +
      "</div>" + pillsHtml(buildChoicePills(ch)) + "</div></button>";
  }
  /* No per-option image — event art lives in the story header */
  return '<button class="choice option" data-choice="' + side + '">' +
    '<div class="choice-body"><b>' + esc(ch.label) + "</b>" +
    (ch.hint ? "<small>" + esc(ch.hint) + "</small>" : "") +
    pillsHtml(buildChoicePills(ch)) +
    "</div></button>";
}

function timelineHtml(s, hiN, choosing) {
  var rows = s.seasons || [];
  var byAge = {};
  for (var i = 0; i < rows.length; i++) byAge[rows[i].age] = { row: rows[i], idx: i };
  var lastAge = rows.length ? rows[rows.length - 1].age : (START_AGE - 1);
  var html = '<div class="timeline-panel">' +
    '<div class="tl-head"><span>IDADE</span><span>CLUBE</span><span>OVR</span><span>J</span><span>G</span><span>A</span></div>' +
    '<div class="timeline-scroll">';

  for (var age = START_AGE; age < START_AGE + 24; age++) {
    var hit = byAge[age];
    var isFuture = age > lastAge && !(choosing && age === s.age);
    var isChoosing = choosing && age === s.age && !hit;
    var hi = hit && hiN && hit.idx >= rows.length - hiN;

    if (hit) {
      var r = hit.row;
      var club = clubOf(r.clubId);
      var g = s.pos === "GOL" ? r.cs : r.goals;
      var a = s.pos === "GOL" ? r.ga : r.assists;
      var cups = (r.trophies || []).concat(r.awards || []);
      var cupDot = cups.length ? '<i class="tl-cup" title="' + esc(cups.map(function (id) { return trophyOf(id).name; }).join(", ")) + '">🏆</i>' : "";
      var dlt = "";
      if (r.delta != null && r.delta !== 0) {
        var big = Math.abs(r.delta) >= 2 ? " big" : "";
        dlt = '<em class="tl-delta ' + (r.delta > 0 ? "up" : "dn") + big + '">' + fmtDelta(r.delta) + "</em>";
      } else if (r.delta === 0) {
        dlt = '<em class="tl-delta flat">0</em>';
      }
      html += '<div class="tl-row filled' + (hi ? " hi" : "") + (cups.length ? " won" : "") +
        (r.delta > 0 ? " ovr-up" : r.delta < 0 ? " ovr-dn" : "") + '">' +
        '<span class="tl-age">' + age + "</span>" +
        '<span class="tl-club">' + imgCrest(club.crest, 'tl-crest', club.name) + clubNameHtml(club.name, "tl-name") + cupDot + "</span>" +
        ovrTlHtml(r.ovr, dlt) +
        '<span class="tl-n">' + r.apps + "</span>" +
        '<span class="tl-n">' + g + "</span>" +
        '<span class="tl-n">' + a + "</span>" +
        "</div>";
    } else if (isChoosing) {
      html += '<div class="tl-row choosing">' +
        '<span class="tl-age">' + age + "</span>" +
        '<span class="tl-club choosing-lab"><span class="tl-q">?</span><b>Escolhendo clube…</b></span>' +
        ovrTlHtml(s.ovr) +
        '<span class="tl-n">—</span><span class="tl-n">—</span><span class="tl-n">—</span>' +
        "</div>";
    } else {
      /* future / empty rail — always present so the board stays 24 slots */
      var label = (age % 2 === 0 || age === START_AGE + 23) ? String(age) : "";
      html += '<div class="tl-row future' + (isFuture ? "" : " gap") + '">' +
        '<span class="tl-age dim">' + (isFuture ? label : age) + "</span>" +
        '<span class="tl-club"></span><span class="tl-ovr"></span>' +
        '<span class="tl-n"></span><span class="tl-n"></span><span class="tl-n"></span>' +
        "</div>";
    }
  }

  var nat = nationOf(s.nation);
  html += '</div><div class="nt-row"><img class="mini-flag" src="' + nat.flag + '" alt="">' +
    "<b>" + esc(nat.name) + "</b><span>" + (s.caps || 0) + " J · " +
    (s.pos === "GOL" ? (s.ntCs || 0) + " CS" : (s.ntGoals || 0) + " G") +
    "</span></div></div>";
  return html;
}



function trophyKindLabel(kind) {
  return ({
    league: "Campeão da liga",
    cup: "Campeão da copa",
    continental: "Título continental",
    nt: "Seleção",
    indiv: "Prêmio individual"
  })[kind] || "Conquista";
}

function trophiesFromReports(reps) {
  var ids = [];
  for (var i = 0; i < (reps || []).length; i++) {
    var r = reps[i];
    var list = (r.trophies || []).concat(r.awards || []);
    for (var j = 0; j < list.length; j++) ids.push(list[j]);
  }
  return ids;
}

function ensureTrophyPopRoot() {
  var el = document.getElementById("trophy-pop-root");
  if (!el) {
    el = document.createElement("div");
    el.id = "trophy-pop-root";
    document.body.appendChild(el);
  }
  return el;
}

function clearTrophyPop() {
  if (UI._trophyTimer) { clearTimeout(UI._trophyTimer); UI._trophyTimer = null; }
  var el = document.getElementById("trophy-pop-root");
  if (el) el.innerHTML = "";
}

function showTrophyHall(ids) {
  ids = (ids || []).slice();
  if (!ids.length) {
    clearTrophyPop();
    return;
  }
  var root = ensureTrophyPopRoot();
  var multi = ids.length > 1;
  var items = ids.map(function (id, i) {
    var meta = trophyOf(id);
    return '<div class="trophy-hall-item" style="animation-delay:' + (i * 0.06) + 's">' +
      '<img src="' + meta.img + '" alt="">' +
      '<div class="trophy-hall-meta">' +
      '<span class="trophy-hall-kind">' + esc(trophyKindLabel(meta.kind)) + "</span>" +
      "<b>" + esc(meta.name) + "</b></div></div>";
  }).join("");

  var title = multi ? "Sala de conquistas" : trophyOf(ids[0]).name;
  var kindLine = multi
    ? (ids.length + " títulos nesta sequência")
    : trophyKindLabel(trophyOf(ids[0]).kind);
  var bodyClass = multi ? "trophy-pop trophy-pop-multi" : "trophy-pop";

  root.innerHTML =
    '<div class="trophy-pop-backdrop" id="trophy-pop-bd">' +
    '<div class="' + bodyClass + '" role="dialog" aria-label="' + esc(title) + '">' +
    '<div class="trophy-pop-kind">' + esc(kindLine) + "</div>" +
    (multi
      ? '<h2 class="trophy-pop-name">' + esc(title) + "</h2>" +
        '<div class="trophy-hall-grid">' + items + "</div>"
      : '<img class="trophy-pop-img" src="' + trophyOf(ids[0]).img + '" alt="">' +
        '<h2 class="trophy-pop-name">' + esc(title) + "</h2>") +
    '<p class="trophy-pop-hint">toque para continuar</p>' +
    "</div></div>";

  var bd = document.getElementById("trophy-pop-bd");
  requestAnimationFrame(function () {
    if (bd) bd.classList.add("on");
  });
  if (typeof JUICE !== "undefined") JUICE.onTrophyShow(ids);
  function closePop() {
    if (UI._trophyTimer) { clearTimeout(UI._trophyTimer); UI._trophyTimer = null; }
    if (bd) {
      bd.classList.remove("on");
      bd.classList.add("out");
      setTimeout(clearTrophyPop, 200);
    } else {
      clearTrophyPop();
    }
  }
  root.onclick = function (e) { e.preventDefault(); closePop(); };
  UI._trophyTimer = setTimeout(closePop, multi ? 4200 : 2400);
}

function startTrophyQueue(ids) {
  clearTrophyPop();
  UI.trophyQueue = [];
  if (ids && ids.length) showTrophyHall(ids);
}

function retireBtnHtml(s) {
  if (!s || s.retired || s.age < 35) return "";
  return '<button class="btn alt retire-btn" data-go="retire" type="button">Aposentar</button>';
}

function goalsStripHtml(s) {
  if (!s || typeof ensureCareerGoals !== "function") return "";
  var goals = ensureCareerGoals(s);
  if (!goals.length) return "";
  return '<div class="goals-strip"><span class="goals-strip-lab">Metas</span>' + goals.map(function (g) {
    return '<span class="goal-pill' + (g.done ? " done" : "") + '">' + (g.done ? "✓ " : "○ ") + esc(g.label) + "</span>";
  }).join("") + "</div>";
}

function rivalChipHtml(s) {
  if (!s || !s.rival) return "";
  var r = s.rival;
  var gap = (s.ovr || 0) - (r.ovr || 0);
  var tone = gap >= 2 ? "up" : gap <= -2 ? "dn" : "flat";
  var gapTxt = gap > 0 ? "+" + gap : String(gap);
  return '<div class="rival-chip ' + tone + '">' +
    '<span>Rival</span><b>' + esc(r.name) + "</b>" +
    '<em>' + r.ovr + " OVR</em>" +
    '<i class="rival-gap">' + gapTxt + " vs você</i></div>";
}

function viewDecision() {
  var ev = UI.event;
  var s = S;
  var choices = [choiceBtn("a", ev.a, ev, 0), choiceBtn("b", ev.b, ev, 1), choiceBtn("c", ev.c, ev, 2)].filter(Boolean).join("");
  var hero = (typeof resolveEventImg === "function") ? resolveEventImg(ev) : "img/choices/default.png";
  return topBarHtml("LENDA", true) +
    '<div class="career-dash">' +
    '<div class="career-left">' +
    identityStrip(s) +
    trophyCaseHtml(s) +
    (typeof JUICE !== "undefined" ? JUICE.hypeBarHtml(s) : "") +
    rivalChipHtml(s) +
    (typeof JUICE !== "undefined" ? JUICE.streakChipHtml(s) : "") +
    goalsStripHtml(s) +
    '<div class="story compact">' +
    '<div class="event-hero"><img src="' + hero + '" alt="" loading="lazy" onerror="this.src=\'img/choices/default.png\'"></div>' +
    '<div class="meta">' + esc(clubOf(s.clubId).name) + " · " + s.age + " anos</div>" +
    "<h2>" + esc(ev.title) + "</h2>" +
    "<p>" + esc(ev.text) + "</p></div>" +
    '<div class="choices-grid">' + choices + "</div>" +
    retireBtnHtml(s) +
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
    var theme = last.themeTitle || (typeof pickSeasonTheme === "function" ? pickSeasonTheme(s, last) : "");
    var juiceSurprise = (typeof JUICE !== "undefined") ? JUICE.seasonSurpriseHtml(last) : "";
    var pathLine = (last.nt && last.nt.path && last.nt.path.text)
      ? '<div class="flavor-line nt-path">' + esc(last.nt.path.text) + "</div>"
      : "";
    var derbyLine = "";
    if (last.derby) {
      var vsClub = clubOf(last.derby.vs);
      derbyLine = '<div class="flavor-line derby">' + (last.derby.won ? "Clássico ganho" : "Clássico perdido") +
        " vs " + esc(vsClub.name) + (last.derby.crisis ? " · crise" : "") + "</div>";
    }
    var rivalLine = last.rivalNote ? '<div class="flavor-line rival">Rival · ' + esc(last.rivalNote) + "</div>" : "";
    recap = '<div class="story compact"><div class="meta">Temporada encerrada</div>' +
      (!juiceSurprise && theme ? '<div class="season-theme" role="status">' + esc(theme) + "</div>" : "") +
      "<h2 class=\"club-title\" style=\"color:#ffffff !important;-webkit-text-fill-color:#ffffff !important\">" + esc(club.name) + "</h2>" +
      '<p class="lead tight">OVR ' + last.ovr + " (" + fmtDelta(last.delta) + ") · " +
      last.apps + " jogos · " + (s.pos === "GOL" ? last.cs + " CS" : last.goals + " gols / " + last.assists + " ast") +
      " · #" + last.leaguePos + nt + "</p>" +
      pathLine + derbyLine + rivalLine +
      (cups.length ? '<div class="report-cups">' + cups.map(function (id) {
        return '<div class="report-cup"><img src="' + trophyOf(id).img + '" alt=""><b>' + esc(trophyOf(id).name) + "</b></div>";
      }).join("") + "</div>" : "") +
      "</div>";
  }
  var next = s.retired ? "legacy" : "decision";
  return topBarHtml("LENDA", true) +
    '<div class="career-dash">' +
    '<div class="career-left">' +
    identityStrip(s) +
    trophyCaseHtml(s) +
    (typeof JUICE !== "undefined" ? JUICE.hypeBarHtml(s) : "") +
    recap +
    (typeof JUICE !== "undefined" && last ? JUICE.seasonSurpriseHtml(last) : "") +
    rivalChipHtml(s) +
    (typeof JUICE !== "undefined" ? JUICE.streakChipHtml(s) : "") +
    goalsStripHtml(s) +
    (S._goalToast ? '<div class="goal-toast">Meta: ' + esc(S._goalToast) + "</div>" : "") +
    (S._lastRisk ? '<div class="risk-toast ' + (S._lastRisk.ok ? "ok" : "bad") + '">' + esc(S._lastRisk.text) + "</div>" : "") +
    (S._lastOutcome && S._lastOutcome.relato
      ? '<div class="mini-relato loud">' + esc(S._lastOutcome.relato) + "</div>" : "") +
    outcomeBoardHtml(S._lastOutcome) +
    '<div class="report-actions">' +
    '<button class="btn" data-go="' + next + '">' + (s.retired ? "Ver o quadro" : "Próxima decisão") + "</button>" +
    retireBtnHtml(s) +
    "</div>" +
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

function ccStatsBar(apps, goals, assists) {
  return '<div class="cc-stats">' +
    "<div><span>APPS</span><b>" + apps + "</b></div>" +
    "<div><span>GOLS</span><b>" + goals + "</b></div>" +
    "<div><span>ASS</span><b>" + assists + "</b></div></div>";
}

function ccTrophyStrip(items) {
  /* items: [{id,n,meta}] or raw trophy id list — name under each icon */
  if (!items || !items.length) {
    return '<div class="cc-empty">Vitrine vazia</div>';
  }
  var html = '<div class="cc-cups">';
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var id, n, meta;
    if (typeof it === "string") {
      id = it; n = 1; meta = trophyOf(id);
    } else {
      id = it.id; n = it.n || 1; meta = it.meta || trophyOf(id);
    }
    var label = meta.name || id;
    html += '<div class="cc-cup" title="' + esc(label) + (n > 1 ? " ×" + n : "") + '">' +
      '<div class="cc-cup-ico">' +
      '<img src="' + meta.img + '" alt="">' +
      (n > 1 ? '<i>×' + n + "</i>" : "") +
      "</div>" +
      '<span class="cc-cup-name">' + esc(label) + "</span>" +
      "</div>";
  }
  return html + "</div>";
}

function ccUniqueTrophyItems(ids) {
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

function viewLegacy() {
  var s = S;
  var nat = nationOf(s.nation);
  var pos = POS[s.pos] || { short: s.pos, name: s.pos };
  var awards = showcaseIndivAwards(s);
  var ntCups = ntTrophiesList(s);
  var stints = clubStintsCareer(s);
  var sc = finalScore(s);
  var ver = verdict(s, sc);

  var playerCard =
    '<section class="cc-card cc-player">' +
    '<div class="cc-kicker">Carreira completa</div>' +
    '<div class="cc-player-top">' +
    '<div class="cc-player-id">' +
    "<h1>" + esc(s.name) + "</h1>" +
    '<div class="cc-pills">' +
    '<span class="cc-pill">#' + s.number + "</span>" +
    '<span class="cc-pill pos">' + esc(pos.short) + "</span>" +
    "</div></div>" +
    '<div class="cc-player-right">' +
    '<div class="cc-value"><span>VALUE</span><b>' + fmtMoney(s.value) + "</b></div>" +
    ovrBadgeHtml(s.peakOvr, "OVR") +
    "</div></div>" +
    ccStatsBar(s.career.apps, s.career.goals, s.career.assists) +
    "</section>";

  var ntCard =
    '<section class="cc-card cc-nt">' +
    '<div class="cc-kicker">Seleção</div>' +
    '<div class="cc-nt-head">' +
    '<img class="cc-flag" src="' + nat.flag + '" alt="">' +
    "<b>" + esc(nat.name) + "</b></div>" +
    ccStatsBar(s.caps || 0, s.ntGoals || 0, s.ntAssists || 0) +
    '<div class="cc-vitrine">' + ccTrophyStrip(ntCups) + "</div>" +
    "</section>";

  var awCard =
    '<section class="cc-card cc-awards">' +
    '<div class="cc-kicker gold">Prêmios</div>' +
    '<div class="cc-vitrine awards">' + ccTrophyStrip(awards) + "</div>" +
    "</section>";

  var clubsHtml = stints.map(function (st) {
    var club = clubOf(st.id);
    var c1 = (club.colors && club.colors[0]) || club.color || "#1a1d26";
    var c2 = (club.colors && club.colors[1]) || c1;
    var cups = ccUniqueTrophyItems(st.trophies);
    return '<article class="cc-club" style="--c1:' + c1 + ";--c2:" + c2 + ";background:" + c1 + '">' +
      '<div class="cc-club-bg" style="background-image:url(\'' + crestSrc(club.crest) + '\')"></div>' +
      '<div class="cc-club-body">' +
      imgCrest(club.crest, "cc-club-crest", club.name) +
      "<h3>" + esc(club.name) + "</h3>" +
      ccStatsBar(st.apps, st.goals, st.assists) +
      '<div class="cc-club-cups">' + (cups.length ? ccTrophyStrip(cups) : "") + "</div>" +
      "</div></article>";
  }).join("");

  return topBarHtml("LENDA", false) +
    '<div class="cc-wrap">' +
    '<div class="cc-top">' + playerCard + ntCard + awCard + "</div>" +
    '<div class="cc-clubs">' + (clubsHtml || '<div class="cc-empty wide">Nenhum clube na carreira</div>') + "</div>" +
    '<div class="cc-verdict">' + esc(ver) + "</div>" +
    '<div class="cc-actions">' +
    '<button class="btn alt" id="dl" type="button">Baixar quadro</button>' +
    '<button class="btn" data-go="new" type="button">Jogar de novo</button>' +
    "</div></div>";
}

function nextDecision() {
  if (S) { S._lastRisk = null; S._lastOutcome = null; S._goalToast = null; }
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
  document.querySelectorAll("[data-goal]").forEach(function (b) {
    b.onclick = function () {
      if (!UI.draft) return;
      if (!UI.draft.goalIds) UI.draft.goalIds = [];
      var id = b.getAttribute("data-goal");
      var i = UI.draft.goalIds.indexOf(id);
      if (i >= 0) UI.draft.goalIds.splice(i, 1);
      else if (UI.draft.goalIds.length < 2) UI.draft.goalIds.push(id);
      else {
        UI.draft.goalIds.shift();
        UI.draft.goalIds.push(id);
      }
      render();
    };
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
  var aq = document.getElementById("dev-academy-q");
  if (aq) {
    aq.oninput = function () {
      var q = aq.value.toLowerCase().trim();
      document.querySelectorAll("#dev-academy-list .dev-club-row").forEach(function (row) {
        var hay = row.getAttribute("data-club-q") || "";
        row.style.display = !q || hay.indexOf(q) >= 0 ? "" : "none";
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
      if (UI._picking) return;
      UI._picking = true;
      var side = b.getAttribute("data-choice");
      var ch = UI.event && UI.event[side];
      var grid = document.querySelector(".choices-grid");
      if (grid) grid.classList.add("resolving");
      b.classList.add("selected");
      document.querySelectorAll("[data-choice]").forEach(function (other) {
        if (other !== b) other.classList.add("dimmed");
      });
      function finishPick() {
        UI._prevOvr = S ? S.ovr : null;
        applyChoice(S, UI.event, side);
        var out = S._lastOutcome;
        var wrap = b.querySelector(".choice-pills");
        if (wrap && out) {
          var landed = pillsHtml(out.pills || [], "landed");
          if (landed) wrap.outerHTML = landed;
          else wrap.remove();
        }
        b.classList.add("landed-pulse");
        if (typeof JUICE !== "undefined") JUICE.onAfterChoice(S, b);
        setTimeout(function () {
          UI._picking = false;
          UI.reports = advance(S);
          UI.screen = "report";
          save();
          render();
          startTrophyQueue(trophiesFromReports(UI.reports));
        }, 980);
      }
      if (typeof JUICE !== "undefined" && JUICE.riskNearMiss(ch)) {
        JUICE.runNearMiss(b, finishPick);
      } else {
        finishPick();
      }
    };
  });
  var dl = document.getElementById("dl");
  if (dl) dl.onclick = function () { downloadCard(); };
  var dls = document.getElementById("dl-season");
  if (dls) dls.onclick = function () {
    var reps = UI.reports || [];
    var season = reps.length ? reps[reps.length - 1] : null;
    if (!season && S && S.seasons && S.seasons.length) season = S.seasons[S.seasons.length - 1];
    if (season && typeof downloadSeasonCard === "function") downloadSeasonCard(season);
  };
}

function go(to) {
  if (to === "home") UI.screen = "home";
  else if (to === "create") {
    UI.draft = { name: "SILVA", number: 10, foot: "D", nation: "br", pos: "ATA", pace: "normal", goalIds: [], step: 0 };
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
  else if (to === "retire") {
    if (!S || S.age < 35) return;
    if (!window.confirm("Pendurar as chuteiras agora? A carreira será encerrada.")) return;
    S.retireForce = true;
    S.retired = true;
    UI.screen = "legacy";
    save();
    render();
    return;
  } else if (to === "legacy") UI.screen = "legacy";
  else if (to === "new") {
    clearTrophyPop();
    clearSave();
    S = null;
    UI.event = null;
    UI.reports = [];
    UI.offers = null;
    UI.draft = { name: "SILVA", number: 10, foot: "D", nation: "br", pos: "ATA", pace: "normal", goalIds: [], step: 0 };
    UI.screen = "create";
  } else if (to === "reset") {
    if (!window.confirm("Apagar a carreira salva e recomeçar do zero?")) return;
    clearTrophyPop();
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

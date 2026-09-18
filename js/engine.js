var S = null;
var UI = { screen: "home", draft: null, event: null, reports: [], toast: "" };

function nationOf(id) {
  for (var i = 0; i < NATIONS.length; i++) if (NATIONS[i].id === id) return NATIONS[i];
  return NATIONS[0];
}
function clubOf(id) {
  for (var i = 0; i < CLUBS.length; i++) if (CLUBS[i].id === id) return CLUBS[i];
  return CLUBS[0];
}
function leagueOf(id) {
  for (var i = 0; i < LEAGUES.length; i++) if (LEAGUES[i].id === id) return LEAGUES[i];
  return LEAGUES[0];
}
function trophyOf(id) {
  return TROPHIES[id] || { name: id, img: "img/trophies/copa.png", kind: "cup", w: 2 };
}

function computeOvr(attrs, pos) {
  var w = WEIGHTS[pos] || WEIGHTS.MC;
  var keys = ["pac", "sho", "pas", "dri", "def", "phy"];
  var sum = 0;
  for (var i = 0; i < keys.length; i++) sum += (attrs[keys[i]] || 50) * w[keys[i]];
  var bonus = ((attrs.skl || 2) - 1) * 0.55 + ((attrs.wf || 2) - 1) * 0.35;
  return clamp(Math.round(sum + bonus), 40, OVR_CAP);
}

function makeAttrs(pos, foot, rnd) {
  var w = WEIGHTS[pos] || WEIGHTS.MC;
  var keys = ["pac", "sho", "pas", "dri", "def", "phy"];
  var attrs = {};
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    attrs[k] = 44 + w[k] * 22 + rnd() * 6;
  }
  attrs.skl = 2 + Math.floor(rnd() * 3);
  attrs.wf = foot === "A" ? 5 : 2 + Math.floor(rnd() * 2);
  for (var t = 0; t < 6; t++) {
    var o = computeOvr(attrs, pos);
    var d = START_OVR - o;
    if (Math.abs(d) < 0.6) break;
    for (var j = 0; j < keys.length; j++) attrs[keys[j]] = clamp(attrs[keys[j]] + d * 0.85, 38, 68);
  }
  attrs.pac = Math.round(attrs.pac);
  attrs.sho = Math.round(attrs.sho);
  attrs.pas = Math.round(attrs.pas);
  attrs.dri = Math.round(attrs.dri);
  attrs.def = Math.round(attrs.def);
  attrs.phy = Math.round(attrs.phy);
  return attrs;
}


function tempOvrTotal(s) {
  var t = 0;
  var list = (s && s.tempOvr) || [];
  for (var i = 0; i < list.length; i++) t += list[i].delta || 0;
  return t;
}

function effectiveOvr(s) {
  return clamp((s.ovr || 0) + tempOvrTotal(s), 40, OVR_CAP);
}

function addTempOvr(s, spec) {
  if (!spec) return;
  var delta = typeof spec === "number" ? spec : (spec.delta || 0);
  var seasons = typeof spec === "number" ? 2 : (spec.seasons || 2);
  if (!delta || seasons <= 0) return;
  s.tempOvr = s.tempOvr || [];
  s.tempOvr.push({ delta: delta, left: seasons });
}

function tickTempOvr(s) {
  if (!s.tempOvr || !s.tempOvr.length) return;
  var next = [];
  for (var i = 0; i < s.tempOvr.length; i++) {
    var e = s.tempOvr[i];
    var left = (e.left || 1) - 1;
    if (left > 0) next.push({ delta: e.delta, left: left });
  }
  s.tempOvr = next;
}

function tempOvrLabel(s) {
  var d = tempOvrTotal(s);
  if (!d) return "";
  return "OVR tmp " + (d > 0 ? "+" : "") + d;
}

function roleOf(s, club) {
  club = club || clubOf(s.clubId);
  var gap = effectiveOvr(s) - club.level * 18;
  /* na base de gigante você é youth; em clube menor o mesmo OVR joga */
  if (s.age <= 18 && gap < -6) return "youth";
  if (s.age <= 20 && gap < -10) return "youth";
  if (gap >= 7) return "star";
  if (gap >= 1.5) return "starter";
  if (gap >= -3.5) return "rotation";
  if (gap >= -9) return "bench";
  return s.age <= 20 ? "youth" : "bench";
}

function marketValue(s) {
  /* OVR-driven curve: 70s–80s tens of mi; 90–94 hundreds; 95–98 deep hundreds; 99 = €1B+. */
  var club = clubOf(s.clubId);
  var level = club && club.level != null ? club.level : 3;
  var age = s.age || 25;
  var ageF =
    age <= 21 ? 1.22 :
    age <= 24 ? 1.32 :
    age <= 28 ? 1.15 :
    age <= 31 ? 0.78 :
    age <= 34 ? 0.48 : 0.3;
  var posFMap = {
    ATA: 1.08, PE: 1.05, PD: 1.05, MEI: 1.04, MC: 1.0,
    VOL: 0.96, LE: 0.93, LD: 0.93, ZAG: 0.9, GOL: 0.82
  };
  var posF = posFMap[s.pos] || 1.0;
  var clubF = 0.85 + level * 0.055;
  var ovr = s.ovr || 50;
  var x = Math.max(0, ovr - 52);
  var base = Math.pow(x, 2.55) * 8800;
  var high = 0;
  if (ovr >= 87) {
    var t = Math.min(1, (ovr - 87) / 7);
    high += Math.pow(t, 2.2) * 105000000;
  }
  if (ovr >= 94) {
    var u = (ovr - 94) / 4;
    high += Math.pow(Math.max(0, u), 1.45) * 375000000;
  }
  if (ovr >= 99) high += 275000000;
  var v = (base + high) * ageF * clubF * posF;
  return Math.round(v / 50000) * 50000;
}

function fmtMoney(n) {
  if (n >= 1e9) {
    var bi = n / 1e9;
    return "€" + bi.toFixed(bi >= 10 ? 1 : 2).replace(".", ",") + " bi";
  }
  if (n >= 1e6) return "€" + (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(".", ",") + " mi";
  if (n >= 1e3) return "€" + Math.round(n / 1e3) + " mil";
  return "€" + n;
}

function fmtDelta(n) {
  if (n > 0) return "+" + n;
  return String(n);
}

function newCareer(draft) {
  var seed = (Date.now() ^ hashStr(draft.name + draft.nation + draft.pos)) >>> 0;
  var rnd = mulberry32(seed);
  var attrs = makeAttrs(draft.pos, draft.foot, rnd);
  var pot = 84 + Math.floor(rnd() * 12);
  var s = {
    seed: seed,
    rndI: 0,
    name: (draft.name || "LENDA").toUpperCase().slice(0, 12),
    number: draft.number || 10,
    foot: draft.foot || "D",
    nation: draft.nation,
    pos: draft.pos,
    pace: draft.pace || "normal",
    attrs: attrs,
    ovr: START_OVR,
    pot: pot,
    peakOvr: START_OVR,
    age: START_AGE,
    year: START_YEAR,
    energy: 78,
    form: 62,
    confidence: 55,
    coach: 50,
    traits: { loyalty: 50, ambition: 50, discipline: 50, resilience: 50 },
    value: 250000,
    wage: 800,
    clubId: null,
    loanFrom: null,
    loanYears: 0,
    role: "youth",
    injuryWeeks: 0,
    tempOvr: [],
    contQual: false,
    ntNoStreak: 0,
    youthCaps: 0,
    extraYears: 0,
    retired: false,
    retireForce: false,
    caps: 0,
    ntGoals: 0,
    ntAssists: 0,
    ntCs: 0,
    career: { apps: 0, goals: 0, assists: 0, cs: 0, ga: 0, trophies: [] },
    awards: [],
    seasons: [],
    clubs: [],
    usedEvents: []
  };
  s.ovr = computeOvr(s.attrs, s.pos);
  return s;
}

function rnd(s) {
  s.rndI = (s.rndI || 0) + 1;
  return mulberry32((s.seed + s.rndI * 9973) >>> 0)();
}

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(S));
  } catch (e) {}
}
function load() {
  try {
    var raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {}
}

function countTrophy(s, id) {
  var n = 0;
  var t = s.career.trophies || [];
  for (var i = 0; i < t.length; i++) if (t[i] === id) n++;
  return n;
}

function indivAwards(s) {
  var out = [];
  var seen = {};
  var list = s.awards || [];
  for (var i = 0; i < list.length; i++) {
    var id = list[i];
    if (seen[id]) {
      seen[id].n++;
    } else {
      seen[id] = { id: id, n: 1, meta: trophyOf(id) };
      out.push(seen[id]);
    }
  }
  return out;
}

function clubAppsMap(s) {
  var map = {};
  for (var i = 0; i < s.seasons.length; i++) {
    var se = s.seasons[i];
    if (!map[se.clubId]) map[se.clubId] = { id: se.clubId, apps: 0, goals: 0, assists: 0, years: 0 };
    map[se.clubId].apps += se.apps;
    map[se.clubId].goals += se.goals;
    map[se.clubId].assists += se.assists;
    map[se.clubId].years++;
  }
  var arr = [];
  for (var k in map) arr.push(map[k]);
  arr.sort(function (a, b) { return b.apps - a.apps; });
  return arr;
}

function iconClub(s) {
  var m = clubAppsMap(s);
  if (m.length) return clubOf(m[0].id);
  return clubOf(s.clubId);
}

function addTrophy(s, id) {
  if (!id) return;
  s.career.trophies.push(id);
}

function touchTrait(obj, k, d) {
  obj[k] = clamp((obj[k] || 50) + d, 0, 100);
}

function clubStintsCareer(s) {
  /* Career-order club stints with aggregated apps/goals/assists and club trophies. */
  var order = [];
  var map = {};
  var seasons = (s && s.seasons) || [];
  for (var i = 0; i < seasons.length; i++) {
    var se = seasons[i];
    var id = se.clubId;
    if (!id) continue;
    if (!map[id]) {
      map[id] = { id: id, apps: 0, goals: 0, assists: 0, cs: 0, ga: 0, trophies: [] };
      order.push(map[id]);
    }
    var st = map[id];
    st.apps += se.apps || 0;
    st.goals += se.goals || 0;
    st.assists += se.assists || 0;
    st.cs += se.cs || 0;
    st.ga += se.ga || 0;
    var cups = se.trophies || [];
    for (var t = 0; t < cups.length; t++) {
      var tid = cups[t];
      var meta = trophyOf(tid);
      if (!meta || meta.kind === "nt" || meta.kind === "indiv") continue;
      st.trophies.push(tid);
    }
  }
  return order;
}

function ntTrophiesList(s) {
  var out = [];
  var seen = {};
  var list = (s.career && s.career.trophies) || [];
  for (var i = 0; i < list.length; i++) {
    var id = list[i];
    var meta = trophyOf(id);
    if (!meta || meta.kind !== "nt") continue;
    if (seen[id]) { seen[id].n++; continue; }
    seen[id] = { id: id, n: 1, meta: meta };
    out.push(seen[id]);
  }
  return out;
}

function showcaseIndivAwards(s) {
  /* Bola de Ouro + Chuteira (outfield) or Luva (GK); also MVP if won. */
  var allow = { balon: 1, mvp: 1 };
  if (s.pos === "GOL") allow.luva = 1;
  else allow.bota = 1;
  var out = [];
  var seen = {};
  var list = s.awards || [];
  for (var i = 0; i < list.length; i++) {
    var id = list[i];
    if (!allow[id]) continue;
    if (seen[id]) { seen[id].n++; continue; }
    seen[id] = { id: id, n: 1, meta: trophyOf(id) };
    out.push(seen[id]);
  }
  return out;
}

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
  return TROPHIES[id] || { name: id, img: "img/trophies/copa.jpg", kind: "cup", w: 2 };
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

function roleOf(s, club) {
  club = club || clubOf(s.clubId);
  var gap = s.ovr - club.level * 18;
  if (s.age <= 18 && gap < -8) return "youth";
  if (gap >= 8) return "star";
  if (gap >= 2) return "starter";
  if (gap >= -4) return "rotation";
  if (gap >= -10) return "bench";
  return s.age <= 19 ? "youth" : "bench";
}

function marketValue(s) {
  var club = clubOf(s.clubId);
  var ageF = s.age <= 23 ? 1.35 : s.age <= 28 ? 1.1 : s.age <= 32 ? 0.65 : 0.32;
  var base = Math.pow(Math.max(0, s.ovr - 44), 2.15) * 90000;
  var v = base * ageF * (0.75 + club.level * 0.09);
  return Math.round(v / 50000) * 50000;
}

function fmtMoney(n) {
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
    contQual: false,
    ntNoStreak: 0,
    youthCaps: 0,
    extraYears: 0,
    retired: false,
    retireForce: false,
    caps: 0,
    ntGoals: 0,
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

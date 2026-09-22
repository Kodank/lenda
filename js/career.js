function makeAcademyOffer(c) {
  if (!c) return null;
  return {
    club: c,
    formacao: Math.round(40 + c.level * 12),
    minutos: Math.round(100 - c.level * 14),
    pressao: Math.round(20 + c.level * 14),
    casa: true
  };
}

function academyOffers(s) {
  /* Pool = ALL clubs of the player's nation (any level). Never foreign. */
  var pool = CLUBS.filter(function (c) { return c.nation === s.nation; });
  /* Fisher–Yates shuffle seeded by career RNG */
  var shuffled = pool.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(rnd(s) * (i + 1));
    var tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  var picks = shuffled.slice(0, Math.min(3, shuffled.length));
  var seen = {};
  var out = [];
  for (var k = 0; k < picks.length; k++) {
    if (!picks[k] || seen[picks[k].id]) continue;
    seen[picks[k].id] = 1;
    var offer = makeAcademyOffer(picks[k]);
    if (offer) out.push(offer);
  }
  return out;
}

function signAcademy(s, clubId) {
  s.clubId = clubId;
  s.freeAgent = false;
  s._rescindClubId = null;
  s._rescindName = null;
  var club = clubOf(clubId);
  /* Pot sobe com a academia, mas não passa do teto do destino. */
  s.pot = clampPotToDestiny(s, s.pot + Math.round((club.level - 3.2) * 1.2));
  s.role = roleOf(s, club);
  applyMarketValue(s);
  s.clubs = [{ id: clubId, from: s.year }];
}

function eventFits(s, ev) {
  var w = ev.when || {};
  if (w.minAge != null && s.age < w.minAge) return false;
  if (w.maxAge != null && s.age > w.maxAge) return false;
  if (w.minOvr != null && s.ovr < w.minOvr) return false;
  if (w.maxOvr != null && s.ovr > w.maxOvr) return false;
  if (w.roles && w.roles.indexOf(s.role) < 0) return false;
  if (w.home && (!s.clubId || clubOf(s.clubId).nation !== s.nation)) return false;
  if (w.abroad && (!s.clubId || clubOf(s.clubId).nation === s.nation)) return false;
  if (w.wcYear && s.year % 4 !== 2) return false;
  if ((s.usedEvents || []).indexOf(ev.id) >= 0 && ev.id !== "muscle" && ev.id !== "formdip") return false;
  return true;
}

var EURO_LEAGUES = { eng: 1, esp: 1, ita: 1, ger: 1, fra: 1, por: 1, ned: 1, bel: 1, tur: 1, sco: 1 };

/*
 * World elite lists (level + reputation). Curated mega clubs — not raw SA giants.
 * Top 5: Real Madrid, Man City, Bayern, Barcelona, Liverpool.
 * Top 10: + Arsenal, PSG, Inter, Chelsea, Man United.
 */
var WORLD_TOP5_IDS = ["rma", "mci", "bay", "fcb", "liv"];
var WORLD_TOP10_IDS = ["rma", "mci", "bay", "fcb", "liv", "ars", "psg", "intm", "che", "mun"];

function clubsByIds(ids) {
  var out = [];
  for (var i = 0; i < ids.length; i++) {
    var c = clubOf(ids[i]);
    if (c && c.id === ids[i]) out.push(c);
  }
  return out;
}

/* Clube grande: top-10 mundial ou nível elite (~4.3+). */
function isBigClub(c) {
  if (!c) return false;
  if (WORLD_TOP10_IDS.indexOf(c.id) >= 0) return true;
  return c.level >= 4.3;
}

function seasonsAtCurrentClub(s) {
  if (!s.clubId || !s.seasons || !s.seasons.length) return 0;
  var n = 0;
  for (var i = s.seasons.length - 1; i >= 0; i--) {
    if (s.seasons[i].clubId !== s.clubId) break;
    n++;
  }
  return n;
}

/*
 * Queda em gigante: OVR abaixo do elenco, demotion, forma ruim, temporadas ruins.
 * Score alto = candidata a rescisão (ainda precisa do roll raro).
 */
function rescissionScore(s) {
  if (!s || !s.clubId) return 0;
  var cur = clubOf(s.clubId);
  if (!isBigClub(cur)) return 0;
  if (s.age < 19) return 0;
  if (seasonsAtCurrentClub(s) < 1) return 0;

  var need = cur.level * 18;
  var gap = s.ovr - need;
  var peakDrop = Math.max(0, (s.peakOvr || s.ovr) - s.ovr);
  var role = s.role || roleOf(s, cur);
  var score = 0;

  if (gap <= -12) score += 4;
  else if (gap <= -9) score += 3;
  else if (gap <= -6) score += 2;
  else if (gap <= -4) score += 1;

  if (peakDrop >= 10) score += 3;
  else if (peakDrop >= 7) score += 2;
  else if (peakDrop >= 4) score += 1;

  if (role === "bench" || role === "youth") score += 2;
  else if (role === "rotation" && gap <= -4) score += 1;

  if ((s.form || 50) < 38) score += 1;
  if ((s.confidence || 50) < 34) score += 1;
  if ((s.coach || 50) < 28) score += 1;

  var recent = 0;
  for (var i = s.seasons.length - 1; i >= 0 && recent < 2; i--) {
    var se = s.seasons[i];
    if (se.clubId !== s.clubId) break;
    recent++;
    if ((se.delta || 0) <= -2) score += 1;
    if ((se.apps || 0) < 12) score += 1;
    if ((se.rating || 7) < 6.15) score += 1;
  }

  return score;
}

function shouldRescind(s) {
  if (!s || !s.clubId || s.freeAgent) return false;
  if (s.lastRescindYear != null && (s.year - s.lastRescindYear) < 2) return false;
  var score = rescissionScore(s);
  if (score < 5) return false;
  /* Raro o bastante para doer: score 5 ~10%, 8 ~28%, teto ~40%. Destino não isenta. */
  var p = 0.1 + (score - 5) * 0.06;
  if (p > 0.4) p = 0.4;
  return rnd(s) < p;
}

function releaseToFreeAgent(s) {
  var cur = s.clubId ? clubOf(s.clubId) : null;
  s._rescindClubId = s.clubId || null;
  s._rescindLevel = cur ? cur.level : 3.5;
  s._rescindName = cur ? cur.name : "";
  s.clubId = null;
  clearLoanState(s);
  s.freeAgent = true;
  s.role = "bench";
  s.coach = clamp((s.coach || 40) - 12, 10, 70);
  s.confidence = clamp((s.confidence || 50) - 8, 15, 100);
  applyMarketValue(s);
}

function currentClubLevel(s) {
  if (s.clubId) return clubOf(s.clubId).level;
  if (s._rescindLevel != null) return s._rescindLevel;
  return clamp((s.ovr || 70) / 18 - 0.2, 2.2, 4.4);
}

function pickRescissionOffers(s, n) {
  n = n || 3;
  var prevLv = currentClubLevel(s);
  var dGate = destinyOf(s);
  var pool = CLUBS.filter(function (c) {
    if (s._rescindClubId && c.id === s._rescindClubId) return false;
    /* Pós-queda: opções reais em clubes menores/pares — sem outro gigante irrealista. */
    var need = c.level * 18;
    var gap = s.ovr - need;
    if (gap < -9) return false;
    if (c.level > prevLv + 0.05) return false;
    if (WORLD_TOP10_IDS.indexOf(c.id) >= 0 && gap < -4) return false;
    if (dGate.maxClubLevel != null && c.level > dGate.maxClubLevel + 0.35) return false;
    return true;
  });
  function roleOk(c) {
    var r = roleOf({ ovr: s.ovr, age: s.age, clubId: c.id }, c);
    return r === "star" || r === "starter" || r === "rotation";
  }
  var playable = pool.filter(roleOk);
  if (playable.length < 2) playable = pool.slice();

  var stepDown = playable.filter(function (c) {
    return c.level <= prevLv - 0.25 && c.level >= prevLv - 1.4;
  });
  var muchLower = playable.filter(function (c) {
    return c.level < prevLv - 1.35 && c.level >= 2.4;
  });
  var lateral = playable.filter(function (c) {
    return Math.abs(c.level - prevLv) <= 0.4 && c.level < prevLv + 0.05;
  });
  stepDown = shuffled(stepDown, s);
  muchLower = shuffled(muchLower, s);
  lateral = shuffled(lateral, s);

  var out = [];
  var seen = {};
  function add(c) {
    if (!c || seen[c.id] || out.length >= n) return false;
    seen[c.id] = 1;
    out.push(c);
    return true;
  }
  if (stepDown[0]) add(stepDown[0]);
  if (muchLower[0]) add(muchLower[0]);
  if (lateral[0]) add(lateral[0]);
  var rest = shuffled(playable, s);
  for (var i = 0; i < rest.length && out.length < n; i++) add(rest[i]);
  if (out.length < 2) {
    var any = shuffled(CLUBS.filter(function (c) {
      return (!s._rescindClubId || c.id !== s._rescindClubId) && c.level <= Math.min(prevLv, 4.2);
    }), s);
    for (var j = 0; j < any.length && out.length < n; j++) add(any[j]);
  }
  return out.slice(0, n);
}

function freeAgentOfferChoice(s, club) {
  var lg = leagueOf(club.leagueId);
  var ghost = { ovr: s.ovr, age: s.age, clubId: club.id };
  var role = roleOf(ghost, club);
  var prev = s._rescindLevel != null ? s._rescindLevel : currentClubLevel(s);
  var step = club.level - prev;
  var tag = step <= -0.55 ? "Recomeço · " : step <= -0.2 ? "Mais minutos · " : "Assinar · ";
  var euro = EURO_LEAGUES[club.leagueId] ? "Europa · " : "";
  return {
    label: tag + club.name,
    hint: euro + lg.name + " · " + ROLE_NAME[role],
    crest: club.crest,
    leagueId: club.leagueId,
    nation: club.nation,
    colors: club.colors,
    fx: { sign: club.id, ambition: step >= 0 ? 3 : -2, loyalty: 4, confidence: 6, form: 4 }
  };
}

function buildFreeAgentWindow(s) {
  var offers = pickRescissionOffers(s, 3);
  var from = s._rescindName || "o clube";
  var ev = {
    id: "rescisao",
    title: "Agente livre",
    text: "Você está sem clube após a rescisão com " + from + ". Escolha uma das propostas — não dá para ficar parado."
  };
  if (offers[0] && offers[1] && offers[2]) {
    ev.a = freeAgentOfferChoice(s, offers[0]);
    ev.b = freeAgentOfferChoice(s, offers[1]);
    ev.c = freeAgentOfferChoice(s, offers[2]);
  } else if (offers[0] && offers[1]) {
    ev.a = freeAgentOfferChoice(s, offers[0]);
    ev.b = freeAgentOfferChoice(s, offers[1]);
  } else if (offers[0]) {
    ev.a = freeAgentOfferChoice(s, offers[0]);
    ev.b = freeAgentOfferChoice(s, offers[0]);
  } else {
    /* Fallback extremo: qualquer clube jogável */
    var fb = shuffled(CLUBS.filter(function (c) { return c.level <= 3.8; }), s)[0] || CLUBS[0];
    ev.a = freeAgentOfferChoice(s, fb);
  }
  return ev;
}

function buildRescissionEvent(s) {
  var cur = clubOf(s.clubId);
  var name = cur.name;
  releaseToFreeAgent(s);
  s.lastRescindYear = s.year;
  s.rescissions = (s.rescissions || 0) + 1;
  var blurbs = [
    "A diretoria do " + name + " pediu a rescisão. Fim do vínculo — você está dispensado.",
    name + " encerrou o contrato. Sem minutos, sem confiança: você é agente livre.",
    "Rescisão. O " + name + " cortou o vínculo. Escolha um novo destino — clubes menores já ligaram."
  ];
  var ev = buildFreeAgentWindow(s);
  ev.id = "rescisao";
  ev.title = "Rescisão de contrato";
  ev.text = blurbs[Math.floor(rnd(s) * blurbs.length)];
  return ev;
}


/* Resolve conf without nationOf fallback (unknown ids must not become Brazil/conmebol). */
function nationConf(nationId) {
  for (var i = 0; i < NATIONS.length; i++) {
    if (NATIONS[i].id === nationId) return NATIONS[i].conf;
  }
  return "";
}

function clubConf(c) {
  if (!c) return "";
  var conf = nationConf(c.nation);
  if (conf) return conf;
  if (EURO_LEAGUES[c.leagueId]) return "uefa";
  var lg = leagueOf(c.leagueId);
  if (lg) {
    if (lg.continental === "ucl") return "uefa";
    if (lg.continental === "lib") return "conmebol";
    if (lg.continental === "acl") return "afc";
    if (lg.continental === "caf") return "caf";
    if (lg.continental === "concacaf") return "concacaf";
    conf = nationConf(lg.nation);
    if (conf) return conf;
  }
  return "";
}

function sameContinentClub(s, c) {
  if (!c) return false;
  if (c.nation === s.nation) return true;
  var a = nationConf(s.nation);
  var b = clubConf(c);
  return !!(a && b && a === b);
}

/* Current club's country (fallback: player nation before signing). */
function clubNationOf(s) {
  var cur = s.clubId ? clubOf(s.clubId) : null;
  return cur ? cur.nation : (s.nation || "");
}

function sameClubCountry(s, c) {
  return !!(c && c.nation && c.nation === clubNationOf(s));
}

/* Hard rule: until OVR passes 70, only the current club's country — no foreign. */
function earlyCountryLock(s) {
  return (s.ovr || 0) < 70;
}

/*
 * Market geography for early / "home" stage:
 *  - ovr < 70: current club nation only (everyone; wonderkid/elite must not bypass).
 *  - ovr ≥ 70 + current club in Europe: same conf (UEFA) — a bit more freedom.
 *  - ovr ≥ 70 + not European: existing same-continent (player home conf) rules.
 */
function marketGeoOk(s, c) {
  if (!c) return false;
  if (earlyCountryLock(s)) return sameClubCountry(s, c);
  var cur = s.clubId ? clubOf(s.clubId) : null;
  if (cur && clubConf(cur) === "uefa") {
    return clubConf(c) === "uefa" || c.nation === cur.nation;
  }
  return sameContinentClub(s, c);
}

/*
 * Wonderkid exception: young + explosive ΔOVR in 1–3 seasons unlocks elite Europe
 * despite early same-continent gate. Tuned rare — normal careers stay home.
 * Examples that pass: age≤21, OVR≥78, +24 from START_OVR in ≤3 seasons, ≥9 OVR/season.
 */
function isWonderkid(s) {
  if (s.age > 21) return false;
  if (s.ovr < 78) return false;
  var seasons = Math.max(0, (s.year || START_YEAR) - START_YEAR);
  var byAge = Math.max(0, s.age - START_AGE);
  var played = Math.max(seasons, byAge);
  if (played < 1 || played > 3) return false;
  var delta = s.ovr - START_OVR;
  if (delta < 24) return false;
  if (delta / played < 9) return false;
  return true;
}

/* Copero-like market stages by OVR (+ wonderkid exception), limitado pelo destino. */
function marketStage(s) {
  var stage;
  if (s.ovr >= 89) stage = "elite";   /* top-5 offers guaranteed */
  else if (s.ovr >= 85) stage = "world";   /* chance of top-10 */
  else if (isWonderkid(s)) stage = "wonderkid"; /* rare: big Europe may call early */
  else if (s.ovr >= 78 && s.age >= 22) stage = "open"; /* mid: other continents ok */
  else stage = "home"; /* early / low OVR: same continent (or country) only */
  return clampMarketStage(s, stage);
}


/* ---- Substâncias ilícitas (raro): auge 90+ / idade 21 / queda / nunca 80 ---- */
var SUBSTANCES = {
  boostMin: 4,
  boostMax: 8,
  catchP: 0.38,          /* chance de ser pego ao aceitar */
  appearAge21: 0.24,
  appearAuge: 0.16,
  appearCollapse: 0.22,
  appearStagnant: 0.20,  /* vários anos sem nunca chegar a 80 OVR */
  stagnantMinAge: 24,
  stagnantMinSeasons: 6,
  stagnantPeakMax: 80,   /* peakOvr < 80 */
  cooldownYears: 8       /* se recusar sem consumir id, ainda há freio temporal */
};

function careerCollapseScore(s) {
  if (!s || !s.seasons || !s.seasons.length) return 0;
  var peakDrop = Math.max(0, (s.peakOvr || s.ovr) - s.ovr);
  var score = 0;
  if (peakDrop >= 10) score += 3;
  else if (peakDrop >= 7) score += 2;
  else if (peakDrop >= 5) score += 1;

  if ((s.form || 50) < 38) score += 1;
  if ((s.confidence || 50) < 34) score += 1;
  if ((s.coach || 50) < 28) score += 1;
  if (s.role === "bench" || s.role === "youth") score += 1;

  var streak = 0;
  for (var i = s.seasons.length - 1; i >= 0 && streak < 3; i--) {
    var se = s.seasons[i];
    var bad = (se.delta || 0) <= -2 || (se.apps || 0) < 10 || (se.rating || 7) < 6.2;
    if (!bad) break;
    streak++;
  }
  score += Math.min(2, streak);

  /* Destino ruim + luta: espelha sinais da rescisão / fase ruim */
  if (s.destiny === "ruim" && (peakDrop >= 4 || (s.form || 50) < 42 || (s.confidence || 50) < 40)) {
    score += 1;
  }
  return score;
}


function isStagnantNever80(s) {
  if (!s) return false;
  var seasons = (s.seasons || []).length;
  if ((s.age || 0) < (SUBSTANCES.stagnantMinAge || 24)) return false;
  if (seasons < (SUBSTANCES.stagnantMinSeasons || 6)) return false;
  if ((s.peakOvr || s.ovr || 0) >= (SUBSTANCES.stagnantPeakMax || 80)) return false;
  return true;
}

function substancesEligibleReason(s) {
  if (!s || !s.clubId || s.freeAgent) return null;
  if ((s.usedEvents || []).indexOf("substancias") >= 0) return null;
  if (s.substancesTaken) return null;
  if (s.lastSubstancesYear != null && (s.year - s.lastSubstancesYear) < SUBSTANCES.cooldownYears) return null;
  if (s.age < 18 || s.age > 34) return null;

  if ((s.ovr || 0) >= 90 || (s.peakOvr || 0) >= 90) return "auge";
  if (s.age === 21) return "age21";
  if (s.age >= 19 && careerCollapseScore(s) >= 4) return "collapse";
  /* Carreira longa sem nunca chegar a 80 OVR — "indo mal" no longo prazo */
  if (isStagnantNever80(s)) return "stagnant";
  return null;
}

function shouldOfferSubstances(s) {
  var reason = substancesEligibleReason(s);
  if (!reason) return false;
  var p = SUBSTANCES.appearCollapse;
  if (reason === "auge") p = SUBSTANCES.appearAuge;
  else if (reason === "age21") p = SUBSTANCES.appearAge21;
  else if (reason === "stagnant") p = SUBSTANCES.appearStagnant;
  return rnd(s) < p;
}

function buildSubstancesEvent(s) {
  var reason = substancesEligibleReason(s) || "auge";
  var boost = SUBSTANCES.boostMin + Math.floor(rnd(s) * (SUBSTANCES.boostMax - SUBSTANCES.boostMin + 1));
  var catchP = SUBSTANCES.catchP;
  var safeP = Math.round((1 - catchP) * 100);
  var caughtP = 100 - safeP;

  var blurbs = {
    auge: [
      "No auge, alguém do círculo íntimo oferece um atalho químico. OVR sobe — se o exame não te pegar.",
      "Você está entre os melhores. Uma proposta ilícita promete mais um degrau. O risco é perder a temporada."
    ],
    age21: [
      "Aos 21, a pressão por explodir é absurda. Aparece a oferta proibida: salto grande de OVR, com risco de suspensão.",
      "Um intermediário te procura na base da idade de ouro. Substâncias. Boost real. Pegos, a temporada acaba."
    ],
    collapse: [
      "A carreira sangra. Surge o atalho sujo: recuperar o OVR rápido — ou ser suspenso o ano inteiro se pegarem.",
      "Na pior fase, alguém oferece substâncias. Pode salvar o overall. Pode te tirar de todos os jogos da temporada."
    ],
    stagnant: [
      "Anos de carreira e o overall nunca chegou a 80. Alguém oferece o atalho sujo — salto real, risco de suspensão.",
      "Você já jogou várias temporadas sem estourar. A proposta ilícita promete finalmente cruzar o teto. Se pegarem, o ano acaba."
    ]
  };
  var pool = blurbs[reason] || blurbs.auge;
  var text = pool[Math.floor(rnd(s) * pool.length)];

  return {
    id: "substancias",
    theme: "party",
    title: "Atalho proibido",
    text: text,
    a: {
      label: "Aceitar o atalho",
      hint: safeP + "% limpo · " + caughtP + "% suspenso (OVR fica)",
      theme: "party",
      fx: {
        ambition: 4,
        discipline: -8,
        risk: {
          p: 1 - catchP,
          win: { ovr: boost, form: 6, confidence: 6 },
          lose: { ovr: boost, suspendSeason: 1, confidence: -10, coach: -14, form: -6, discipline: -10 },
          winText: "O corpo respondeu. Ninguém desconfiou. O OVR subiu de verdade.",
          loseText: "Exame positivo. O OVR ficou — mas você está suspenso a temporada inteira."
        }
      }
    },
    b: {
      label: "Recusar na hora",
      hint: "Sem boost · consciência limpa",
      theme: "safe",
      fx: { discipline: 6, confidence: 2 }
    }
  };
}


function academyClubId(s) {
  if (!s) return null;
  if (s.clubs && s.clubs.length && s.clubs[0].id) return s.clubs[0].id;
  if (s.seasons && s.seasons.length) {
    for (var i = 0; i < s.seasons.length; i++) {
      if (s.seasons[i].clubId) return s.seasons[i].clubId;
    }
  }
  return null;
}

/* Entre clubes da MESMA nacionalidade do jogador, o que mais jogou (apps, depois anos). */
function mostPlayedHomeClubId(s) {
  if (!s || !s.nation) return null;
  var map = typeof clubAppsMap === "function" ? clubAppsMap(s) : [];
  var best = null;
  for (var i = 0; i < map.length; i++) {
    var c = clubOf(map[i].id);
    if (!c || c.nation !== s.nation) continue;
    if (!best) {
      best = map[i];
      continue;
    }
    if (map[i].apps > best.apps || (map[i].apps === best.apps && map[i].years > best.years)) best = map[i];
  }
  return best ? best.id : null;
}

/* Fim do auge: OVR já caiu do pico, idade de transição — uma vez por carreira. */
function isHomecomingWindow(s) {
  if (!s || !s.clubId || s.freeAgent) return false;
  if ((s.usedEvents || []).indexOf("homecoming") >= 0) return false;
  if (s.age < 29 || s.age > 35) return false;
  var peak = s.peakOvr || s.ovr || 0;
  if (peak < 74) return false;
  var drop = peak - (s.ovr || 0);
  if (drop < 2 && s.age < 31) return false;
  if (drop < 1 && s.age < 32) return false;
  if (!academyClubId(s)) return false;
  /* precisa de alguma história (não no primeiro ano adulto) */
  if (!s.seasons || s.seasons.length < 6) return false;
  return true;
}

function homecomingClubChoice(s, club, kind) {
  if (!club) return null;
  var lg = leagueOf(club.leagueId);
  var ghost = { ovr: s.ovr, age: s.age, clubId: club.id };
  var role = roleOf(ghost, club);
  var label;
  var hint;
  var loyalty;
  var ambition;
  if (kind === "base") {
    label = "Voltar à base · " + club.name;
    hint = "Clube onde começou a carreira · " + (ROLE_NAME[role] || role);
    loyalty = 10;
    ambition = -2;
  } else if (kind === "home") {
    label = "Clube que mais jogou · " + club.name;
    hint = "Clube que mais jogou · " + (lg ? lg.name : "");
    loyalty = 8;
    ambition = 0;
  } else {
    label = "Continuar no " + club.name;
    hint = (lg ? lg.name + " · " : "") + "continuidade";
    loyalty = 6;
    ambition = 2;
  }
  return {
    label: label,
    hint: hint,
    crest: club.crest,
    leagueId: club.leagueId,
    nation: club.nation,
    colors: club.colors,
    theme: kind === "stay" ? "safe" : "home",
    fx: kind === "stay"
      ? { loyalty: loyalty, confidence: 3, ambition: ambition }
      : { sign: club.id, loyalty: loyalty, confidence: 4, ambition: ambition, energy: 4 }
  };
}

function buildHomecomingWindow(s) {
  var baseId = academyClubId(s);
  var homeId = mostPlayedHomeClubId(s);
  var curId = s.clubId;
  var base = baseId ? clubOf(baseId) : null;
  var home = homeId ? clubOf(homeId) : null;
  var cur = curId ? clubOf(curId) : null;
  var peak = s.peakOvr || s.ovr;
  var drop = Math.max(0, peak - (s.ovr || 0));
  var blurb = drop >= 2
    ? ("O auge (" + peak + " OVR) ficou pra trás. Voltar à base, ao clube em que mais jogou no país, ou seguir no atual.")
    : ("A carreira entrou na reta pós-auge. Escolha: base, clube em que mais jogou no país, ou continuar no atual.");

  var choices = [];
  /* 1) Base — só se não for o clube atual */
  if (base && base.id !== curId) {
    choices.push(homecomingClubChoice(s, base, "base"));
  }
  /* 2) Clube do país em que mais jogou — distinto da base e do atual */
  if (home && home.id !== curId && (!base || home.id !== base.id)) {
    choices.push(homecomingClubChoice(s, home, "home"));
  }
  /* 3) Continuar no atual */
  if (cur) {
    choices.push(homecomingClubChoice(s, cur, "stay"));
  }

  if (choices.length === 1 && cur) {
    blurb = "O auge (" + peak + " OVR) passou. Você já está no endereço familiar — pode seguir nele.";
  }

  var ev = {
    id: "homecoming",
    title: "Depois do auge",
    text: blurb,
    theme: "home"
  };
  if (choices[0]) ev.a = choices[0];
  if (choices[1]) ev.b = choices[1];
  if (choices[2]) ev.c = choices[2];
  if (!ev.a) ev.a = stayChoice(s);
  if (!ev.b) {
    ev.b = {
      label: "Seguir o plano atual",
      hint: "Sem mudança de clube",
      fx: { discipline: 3, confidence: 2 }
    };
  }
  return ev;
}

function pickEvent(s) {
  /* Fim de empréstimo: Retorno / definitivo / (talvez) outro emp. */
  if (s._loanResolve && s.loanFrom) return buildLoanResolveWindow(s);
  /* Agente livre: obrigado a escolher oferta (pós-rescisão). */
  if (s.freeAgent || !s.clubId) return buildFreeAgentWindow(s);

  /* Fim do auge: base / clube do país mais jogado / ficar (1x). */
  if (isHomecomingWindow(s)) return buildHomecomingWindow(s);

  var marketP = 0.72;
  if (s.age <= 22) marketP = 0.82;
  if (s.age >= 32) marketP = 0.5;
  /* jovem engavetado em clube grande: janela quase certa (empréstimo/passo lateral) */
  var cur = s.clubId ? clubOf(s.clubId) : null;
  if (cur && s.age <= 21 && (s.role === "youth" || s.role === "bench") && cur.level >= 4.2) marketP = 0.92;
  /* Ritmo Intensa: oferta bem mais frequente (antes ~0.72–0.82 → ~0.92–0.97) */
  if (s.pace === "intensa") marketP = Math.min(0.97, marketP + 0.2);
  /* Modo Rápido: mais mercado/títulos, menos narrativa */
  if (s.pace === "rapido") marketP = Math.min(0.94, marketP + 0.18);
  if (typeof DEV !== "undefined" && DEV.on && DEV.on() && DEV.flags.forceRescind) {
    DEV.flags.forceRescind = false;
    return buildRescissionEvent(s);
  }
  if (shouldRescind(s)) return buildRescissionEvent(s);
  if (typeof DEV !== "undefined" && DEV.on && DEV.on() && DEV.flags.forceSubstances) {
    DEV.flags.forceSubstances = false;
    return buildSubstancesEvent(s);
  }
  if (shouldOfferSubstances(s)) return buildSubstancesEvent(s);
  if (typeof DEV !== "undefined" && DEV.on && DEV.on() && DEV.flags.alwaysTransfers) {
    return buildTransferWindow(s);
  }

  /* Tour de despedida (últimas 1–2 temporadas) */
  if (typeof isFarewellWindow === "function" && isFarewellWindow(s) && (s.usedEvents || []).indexOf("farewell") < 0 && rnd(s) < 0.72) {
    return buildFarewellEvent(s);
  }

  /* ~9% chance de evento raro de salto (não frequente; 1x cada id por carreira) */
  var rarePool = [];
  for (var ri = 0; ri < EVENTS.length; ri++) {
    if (!EVENTS[ri].rare) continue;
    if (!eventFits(s, EVENTS[ri])) continue;
    rarePool.push(EVENTS[ri]);
  }
  var rareP = s.pace === "rapido" ? 0.05 : 0.09;
  rareP *= destinyOf(s).rareMul || 1;
  if (rarePool.length && rnd(s) < rareP) {
    return rarePool[Math.floor(rnd(s) * rarePool.length)];
  }

  if (rnd(s) < marketP) return buildTransferWindow(s);

  /* Rápido: segunda chance de mercado em vez de narrativa */
  if (s.pace === "rapido" && rnd(s) < 0.45) return buildTransferWindow(s);

  var pool = [];
  for (var i = 0; i < EVENTS.length; i++) {
    if (!eventFits(s, EVENTS[i])) continue;
    if (EVENTS[i].rare) continue; /* raros só pelo gate acima */
    if (EVENTS[i].id === "europe" || EVENTS[i].id === "giant" || EVENTS[i].id === "midtable" || EVENTS[i].id === "loan" || EVENTS[i].id === "bench" || EVENTS[i].id === "rival") continue;
    pool.push(EVENTS[i]);
  }
  if (!pool.length) return buildTransferWindow(s);
  return pool[Math.floor(rnd(s) * pool.length)];
}

function reachableClub(s, c) {
  /* Só oferece clube onde o jogador não seria ridiculamente abaixo do elenco. */
  var need = c.level * 18;
  var gap = s.ovr - need;
  /* elite europeia exige quase o nível; clubes menores aceitam mais slack */
  var minGap = EURO_LEAGUES[c.leagueId] ? -8 : -12;
  if (c.level >= 4.6) minGap = -5;
  else if (c.level >= 4.2) minGap = -7;
  if (s.age <= 20) minGap -= 2; /* promessa ganha um pouco de crédito */
  if (s.age >= 33) minGap += 2;
  return gap >= minGap;
}

function shuffled(arr, s) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(rnd(s) * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function pickOffers(s, n) {
  /* Estilo Copero: um passo à frente, um lateral — não dois gigantes aleatórios. */
  var cur = s.clubId ? clubOf(s.clubId) : null;
  var curId = cur ? cur.id : "";
  var curLevel = currentClubLevel(s);
  var stage = marketStage(s);
  var dGate = destinyOf(s);
  var pool = CLUBS.filter(function (c) {
    if (c.id === curId || !reachableClub(s, c)) return false;
    /* Destino baixo: bloqueia gigantes (top Europa) mesmo se o OVR “aguenta”. */
    if (dGate.maxClubLevel != null && c.level > dGate.maxClubLevel + 0.001) return false;
    /* ovr < 70: hard single-country lock (current club nation). No foreign, no wonderkid bypass. */
    if (earlyCountryLock(s) && !sameClubCountry(s, c)) return false;
    /* Early career (home stage, ovr ≥ 70): continent rules via marketGeoOk. */
    if (stage === "home" && !marketGeoOk(s, c)) return false;
    /* Wonderkid: home geo OR European elite / world top-10 — but never below OVR 70. */
    if (stage === "wonderkid") {
      if (earlyCountryLock(s)) return sameClubCountry(s, c);
      if (marketGeoOk(s, c)) return true;
      if (WORLD_TOP10_IDS.indexOf(c.id) >= 0) return true;
      if (EURO_LEAGUES[c.leagueId] && c.level >= 4.3) return true;
      return false;
    }
    return true;
  });
  function expectedRole(c) {
    return roleOf({ ovr: s.ovr, age: s.age, clubId: c.id }, c);
  }
  function playable(c) {
    var r = expectedRole(c);
    return r === "star" || r === "starter" || r === "rotation" || (s.age <= 21 && (r === "bench" || r === "youth"));
  }
  var playablePool = pool.filter(playable);
  if (playablePool.length < 3) playablePool = pool.slice();

  /* Em 85–88 (world) / wonderkid: top-10 só via roll elite — não pelo passo genérico. */
  var eliteGate = (stage === "world" || stage === "wonderkid");
  function notEliteOnly(c) {
    return !eliteGate || WORLD_TOP10_IDS.indexOf(c.id) < 0;
  }
  var stepUp = playablePool.filter(function (c) {
    return notEliteOnly(c) && c.level > curLevel + 0.12 && c.level <= curLevel + 0.85;
  });
  var bigStep = playablePool.filter(function (c) {
    return notEliteOnly(c) && c.level > curLevel + 0.85 && s.ovr >= c.level * 18 - 6;
  });
  var lateral = playablePool.filter(function (c) {
    return notEliteOnly(c) && Math.abs(c.level - curLevel) <= 0.35;
  });
  var safer = playablePool.filter(function (c) {
    return notEliteOnly(c) && c.level < curLevel - 0.15 && c.level >= curLevel - 0.9;
  });
  /* empréstimos naturais para jovens engavetados */
  var loanish = [];
  if (s.age <= 21 && (s.role === "youth" || s.role === "bench")) {
    loanish = playablePool.filter(function (c) {
      return notEliteOnly(c) && c.level < curLevel - 0.2 && c.level >= 2.6;
    });
  }

  stepUp = shuffled(stepUp, s);
  bigStep = shuffled(bigStep, s);
  lateral = shuffled(lateral, s);
  safer = shuffled(safer, s);
  loanish = shuffled(loanish, s);

  var out = [];
  var seen = {};
  function add(c) {
    if (!c || seen[c.id] || out.length >= n) return false;
    seen[c.id] = 1;
    out.push(c);
    return true;
  }
  function forceElite(c) {
    /* Prefer slot 0 for guaranteed/chance elite so the window shows the mega club. */
    if (!c || seen[c.id]) return false;
    if (out.length >= n) {
      var drop = out.pop();
      if (drop) delete seen[drop.id];
    }
    seen[c.id] = 1;
    out.unshift(c);
    if (out.length > n) {
      var extra = out.pop();
      if (extra) delete seen[extra.id];
    }
    return true;
  }

  /* 85+: chance real mas modesta de top-10; 89+: top-5 quase certo (destino alto).
     Elite roll ignora maxClubLevel (destino entra só via mul) — medíocre pode sonhar pequeno.
     Wonderkid: Europa mega cedo; continente/home gates intactos no pool geral. */
  var top5 = clubsByIds(WORLD_TOP5_IDS).filter(function (c) {
    if (c.id === curId || !reachableClub(s, c)) return false;
    return true;
  });
  var top10 = clubsByIds(WORLD_TOP10_IDS).filter(function (c) {
    if (c.id === curId || !reachableClub(s, c)) return false;
    return true;
  });
  top5 = shuffled(top5, s);
  top10 = shuffled(top10, s);
  /* Base ~0.30: "um pouco difícil" em 85; mul do destino escala. */
  var dMul = dGate;
  var pTop5 = 0.3 * (dMul.top5Mul != null ? dMul.top5Mul : 1);
  var pTop10 = 0.3 * (dMul.top10Mul != null ? dMul.top10Mul : 1);
  var pWk = 0.62 * (dMul.wonderkidMul != null ? dMul.wonderkidMul : 1);
  /* Elite rolls never fire under the ovr < 70 single-country lock. */
  if (!earlyCountryLock(s)) {
    if (stage === "elite" && top5[0]) {
      if ((dMul.top5Mul != null ? dMul.top5Mul : 1) >= 0.99 || rnd(s) < Math.max(0.08, pTop5)) forceElite(top5[0]);
      else if (top10[0] && rnd(s) < pTop10) forceElite(top10[0]);
    } else if (stage === "world" && top10[0] && rnd(s) < pTop10) forceElite(top10[0]);
    else if (stage === "wonderkid" && top10[0] && rnd(s) < pWk) forceElite(top10[0]);
  }

  /* 1ª carta: passo à frente (ou big step raro se o OVR aguenta) — se ainda cabe */
  if (out.length < n) {
    if (s.ovr >= curLevel * 18 + 2 && bigStep[0] && rnd(s) < 0.28) add(bigStep[0]);
    else if (stepUp[0]) add(stepUp[0]);
    else if (loanish[0]) add(loanish[0]);
    else if (lateral[0]) add(lateral[0]);
  }

  /* 2ª carta: lateral / outro país / empréstimo — contraste com a 1ª */
  var secondWave = loanish.concat(lateral).concat(safer).concat(stepUp).concat(bigStep);
  for (var i = 0; i < secondWave.length && out.length < n; i++) add(secondWave[i]);

  /* fallback: qualquer jogável próximo do OVR */
  if (out.length < n) {
    var near = shuffled(playablePool.filter(function (c) {
      if (eliteGate && WORLD_TOP10_IDS.indexOf(c.id) >= 0) return false;
      return Math.abs(c.level * 18 - s.ovr) <= 14;
    }), s);
    for (var j = 0; j < near.length && out.length < n; j++) add(near[j]);
  }

  /* 89+ safety: re-force top-5 só se o destino permitir (mul alto). */
  if (!earlyCountryLock(s) && stage === "elite" && top5[0] && (dMul.top5Mul != null ? dMul.top5Mul : 1) >= 0.55) {
    var hasTop5 = out.some(function (c) { return WORLD_TOP5_IDS.indexOf(c.id) >= 0; });
    if (!hasTop5) forceElite(top5[0]);
  }
  return out.slice(0, n);
}

function offerChoice(s, club) {
  var lg = leagueOf(club.leagueId);
  var ghost = { ovr: s.ovr, age: s.age, clubId: club.id };
  var role = roleOf(ghost, club);
  var curLevel = currentClubLevel(s);
  var ownerLv = s.loanFrom ? clubOf(s.loanFrom).level : curLevel;
  /* Empréstimo (não "rodízio"/transferência permanente): jovens engavetados ou já em emp. */
  var loan = !!s.loanFrom || (
    s.clubId && s.age <= 22 &&
    (s.role === "youth" || s.role === "bench" || s.role === "rotation") &&
    club.level < ownerLv - 0.1
  );
  var step = club.level - curLevel;
  var tag = loan ? "Empréstimo · " : step >= 0.45 ? "Subir · " : step <= -0.35 ? "Mais minutos · " : "Mudar · ";
  var euro = EURO_LEAGUES[club.leagueId] ? "Europa · " : "";
  return {
    label: tag + club.name,
    hint: loan
      ? (euro + "Empréstimo · 1 temporada")
      : (euro + lg.name + " · " + ROLE_NAME[role]),
    crest: club.crest,
    leagueId: club.leagueId,
    nation: club.nation,
    colors: club.colors,
    fx: loan
      ? { loanTo: club.id, resilience: 4, loyalty: -2 }
      : { sign: club.id, ambition: step >= 0.3 ? 7 : 4, loyalty: step >= 0.3 ? -7 : -4 }
  };
}

function stayChoice(s) {
  if (!s.clubId) {
    return { label: "Esperar proposta", hint: "Agente livre", fx: { confidence: -2 } };
  }
  var cur = clubOf(s.clubId);
  return {
    label: "Ficar no " + cur.name,
    hint: leagueOf(cur.leagueId).name + " · continuidade",
    crest: cur.crest,
    leagueId: cur.leagueId,
    nation: cur.nation,
    colors: cur.colors,
    fx: { loyalty: 6, confidence: 3 }
  };
}

function buildTransferWindow(s) {
  var offers = pickOffers(s, 2);
  var stage = marketStage(s);
  var blurb;
  if (!offers.length) blurb = "Poucas ligações nesta janela. Ficar e trabalhar, ou esperar a próxima.";
  else if (earlyCountryLock(s)) blurb = "O mercado abriu. Propostas só do seu país — ou você permanece onde está.";
  else if (stage === "home") blurb = "O mercado abriu. Propostas do seu continente — ou você permanece onde está.";
  else if (stage === "elite") blurb = "O mercado abriu. A elite mundial ligou. Duas camisas novas — ou você permanece onde está.";
  else if (stage === "world") blurb = "O mercado abriu. Gigantes do mundo podem aparecer. Duas camisas novas — ou você permanece onde está.";
  else if (stage === "wonderkid") blurb = "O mercado abriu. Sua explosão chamou atenção na Europa. Duas camisas novas — ou você permanece onde está.";
  else blurb = "O mercado abriu. Duas camisas novas — inclusive da Europa — ou você permanece onde está.";
  var ev = {
    id: "market",
    title: "Janela de transferências",
    text: blurb
  };
  if (offers[0] && offers[1]) {
    ev.a = offerChoice(s, offers[0]);
    ev.b = offerChoice(s, offers[1]);
    ev.c = stayChoice(s);
  } else if (offers[0]) {
    ev.a = offerChoice(s, offers[0]);
    ev.b = stayChoice(s);
  } else {
    ev.a = { label: "Treinar pesado", hint: "Forma sobe", fx: { form: 8, energy: -6 } };
    ev.b = stayChoice(s);
  }
  return ev;
}

function applyChoice(s, ev, side) {
  var ch = ev[side];
  if (!ch) return;
  var fx = Object.assign({}, ch.fx || {});
  /* Eventos com trade-off: rola o risco depois da escolha */
  if (fx.risk) {
    var r = fx.risk;
    var roll = rnd(s);
    function mergeFx(src) {
      if (!src) return;
      for (var k in src) {
        if (k === "tempOvr") fx.tempOvr = src.tempOvr;
        else if (typeof src[k] === "number") fx[k] = (fx[k] || 0) + src[k];
        else fx[k] = src[k];
      }
    }
    if (roll < (r.p || 0.5)) {
      mergeFx(r.win);
      s._lastRisk = { ok: 1, text: r.winText || "Deu certo." };
    } else {
      mergeFx(r.lose);
      s._lastRisk = { ok: 0, text: r.loseText || "Saiu pela culatra." };
    }
    delete fx.risk;
  }
  s.usedEvents = s.usedEvents || [];
  if (ev.id && ev.id !== "market" && ev.id !== "rescisao" && ev.id !== "loan_resolve" && ev.id !== "quiet" && ev.id !== "muscle" && ev.id !== "formdip" && s.usedEvents.indexOf(ev.id) < 0) {
    s.usedEvents.push(ev.id);
  }
  if (fx.loyalty) touchTrait(s.traits, "loyalty", fx.loyalty);
  if (fx.ambition) touchTrait(s.traits, "ambition", fx.ambition);
  if (fx.discipline) touchTrait(s.traits, "discipline", fx.discipline);
  if (fx.resilience) touchTrait(s.traits, "resilience", fx.resilience);
  if (fx.energy) s.energy = clamp(s.energy + fx.energy, 20, 100);
  if (fx.form) s.form = clamp(s.form + fx.form, 20, 100);
  if (fx.confidence) s.confidence = clamp(s.confidence + fx.confidence, 15, 100);
  if (fx.coach) s.coach = clamp(s.coach + fx.coach, 10, 100);
  if (fx.injury && !(typeof DEV !== "undefined" && DEV.on && DEV.on() && DEV.flags.ignoreInjury)) s.injuryWeeks = (s.injuryWeeks || 0) + fx.injury;
  /* Eventos raros / breakthrough: salto de pot/OVR mais fraco em destinos baixos. */
  if (ev.rare && (fx.pot || fx.ovr)) {
    var bMul = destinyOf(s).breakMul;
    if (bMul != null && bMul < 1) {
      if (fx.pot) fx.pot = Math.max(fx.pot > 0 ? 1 : fx.pot, Math.round(fx.pot * bMul));
      if (fx.ovr) fx.ovr = Math.max(fx.ovr > 0 ? 1 : fx.ovr, Math.round(fx.ovr * bMul));
    }
  }
  if (fx.pot) {
    s.pot = clampPotToDestiny(s, (s.pot || 88) + fx.pot);
  }
  if (fx.tempOvr) addTempOvr(s, fx.tempOvr);
  if (fx.ovr) {
    applyDeltaToAttrs(s, fx.ovr);
    s.ovr = clampOvrToDestiny(s, computeOvr(s.attrs, s.pos));
    /* soft-cap sobe junto se o salto passou do potencial antigo — ainda limitado pelo destino */
    if (s.ovr > s.pot) s.pot = clampPotToDestiny(s, s.ovr);
    s.peakOvr = Math.max(s.peakOvr || s.ovr, s.ovr);
  }
  if (fx.ntNo) s.ntNoStreak = 2;
  if (fx.clubApps) s._clubAppsMod = true;
  if (fx.injuryRisk && !(typeof DEV !== "undefined" && DEV.on && DEV.on() && DEV.flags.ignoreInjury) && rnd(s) < 0.35) s.injuryWeeks = (s.injuryWeeks || 0) + 10;
  if (fx.suspendSeason) {
    s._seasonSuspended = true;
    s.substancesTaken = true;
    s.lastSubstancesYear = s.year;
  }
  if (ev.id === "substancias" && side === "a") {
    s.substancesTaken = true;
    s.lastSubstancesYear = s.year;
  }
  if (fx.retire) s.retireForce = true;
  if (fx.extraYear) s.extraYears = (s.extraYears || 0) + 2;
  if (fx.shiftPos) s.pos = neighborPos(s.pos);
  if (fx.returnLoan) returnFromLoan(s);
  if (fx.sign) moveTo(s, clubOf(fx.sign));
  if (fx.loanTo) loanTo(s, clubOf(fx.loanTo));
  if (fx.transferElite) moveTo(s, pickClub(s, "elite"));
  if (fx.transferEurope) moveTo(s, pickClub(s, "europe"));
  if (fx.transferPeer) moveTo(s, pickClub(s, "peer"));
  if (fx.transferHome) moveTo(s, pickClub(s, "home"));
  if (fx.transferDown) moveTo(s, pickClub(s, "down"));
  if (fx.transferRival) moveTo(s, pickClub(s, "rival"));
  if (fx.loan) loanTo(s, pickClub(s, "loan"));
  if (fx.farewellTour) {
    s._farewellTour = Math.max(s._farewellTour || 0, 2);
    s.farewellBonus = Math.max(s.farewellBonus || 0, 1);
  }
  s._lastOutcome = {
    side: side,
    label: ch.label,
    risk: s._lastRisk || null,
    pills: summarizeLandedPills(fx),
    temp: tempOvrTotal(s),
    relato: (typeof miniRelatoFor === "function") ? miniRelatoFor(s, ev, side) : ""
  };
}

function isAssetPathLabel(t) {
  t = String(t == null ? "" : t).trim();
  if (!t) return true;
  /* raw choice-art hashes / paths must never render as consequence pills */
  if (/\.(webp|png|jpe?g|gif|svg|avif)(\?|#|$)/i.test(t)) return true;
  if (/^(img\/|images\/|assets\/|https?:|data:|blob:)/i.test(t)) return true;
  if (/[\/\\]/.test(t) && /\.(webp|png|jpe?g|gif|svg)/i.test(t)) return true;
  if (/^[a-f0-9]{16,}\.(webp|png|jpe?g|gif|svg)$/i.test(t)) return true;
  return false;
}

function isEmptyPillLabel(t) {
  t = String(t == null ? "" : t).trim();
  if (!t) return true;
  /* Dash / "Nada" / "Nada acontece" — never user-visible pill labels */
  if (/^([—–\-−]|Nada)\b/i.test(t)) return true;
  if (/^Nada acontece$/i.test(t)) return true;
  return false;
}

function humanPillText(t) {
  t = String(t == null ? "" : t).trim();
  if (!t || isAssetPathLabel(t) || isEmptyPillLabel(t)) return "";
  return t;
}

/* Signed number helper: +5 / -3 */
function signedNum(n) {
  return (n > 0 ? "+" : "") + n;
}

/* Visible pills: OVR up/down (+ temporary) + suspensão. Other fx still apply silently. */
function isOvrPillText(t) {
  t = String(t == null ? "" : t).trim();
  if (!t || isEmptyPillLabel(t)) return false;
  return /\bOVR\b/i.test(t);
}

function isVisibleFxPill(t) {
  t = String(t == null ? "" : t).trim();
  if (!t || isEmptyPillLabel(t)) return false;
  if (isOvrPillText(t)) return true;
  if (/suspens/i.test(t)) return true;
  return false;
}

function collectFxPillParts(fx) {
  var parts = [];
  if (!fx) return parts;
  function add(kind, text) {
    text = humanPillText(text);
    if (!text) return;
    parts.push({ kind: kind, text: text });
  }
  if (typeof fx.ovr === "number" && fx.ovr) add(fx.ovr >= 0 ? "good" : "bad", signedNum(fx.ovr) + " OVR");
  if (fx.tempOvr) {
    var td = typeof fx.tempOvr === "number" ? fx.tempOvr : fx.tempOvr.delta;
    var ts = typeof fx.tempOvr === "number" ? 2 : (fx.tempOvr.seasons || 2);
    if (typeof td === "number" && td) {
      add(td >= 0 ? "temp-good" : "temp-bad", signedNum(td) + " OVR·" + ts + "t");
    }
  }
  if (fx.suspendSeason) add("bad", "Suspenso");
  return parts;
}

function summarizeLandedPills(fx) {
  var parts = collectFxPillParts(fx);
  var pills = [];
  for (var i = 0; i < parts.length; i++) {
    pills.push({ kind: parts[i].kind, text: parts[i].text, landed: 1 });
  }
  return pills;
}

/* Rewrite legacy/long custom pill strings into short facts; split A | B mega-pills */
function shortenPillText(t) {
  t = String(t == null ? "" : t).trim();
  if (!t) return "";
  t = t.replace(/\s*\|\s*/g, " · "); /* keep split handled upstream */
  t = t.replace(/OVR temporário\s*/gi, "");
  t = t.replace(/(\+|\-)?(\d+)\s*·\s*(\d+)\s*temp\.?/gi, function (_, s, d, n) {
    return (s || (String(d).indexOf("-") === 0 ? "" : "+")) + d + " OVR·" + n + "t";
  });
  t = t.replace(/(\d+)%\s*de chance:?\s*/gi, "$1% ");
  t = t.replace(/\blealdade\b/gi, "leal.");
  t = t.replace(/\bconfiança\b/gi, "conf.");
  t = t.replace(/\bambi[cç]ão\b/gi, "amb.");
  t = t.replace(/\bdisciplina\b/gi, "disc.");
  t = t.replace(/\bresili[eê]ncia\b/gi, "resil.");
  t = t.replace(/\bt[eé]cnico\b/gi, "téc.");
  t = t.replace(/\bpotencial\b/gi, "pot.");
  t = t.replace(/\bforma\b/gi, "form");
  t = t.replace(/\btransfer[eê]ncia\b/gi, "transf.");
  t = t.replace(/\bnova posi[cç]ão\b/gi, "nova pos.");
  t = t.replace(/\baposentadoria\b/gi, "aposent.");
  t = t.replace(/\+(\d+)\s*sem\.?\s*les[aã]o/gi, "+$1 lesão");
  t = t.replace(/\s{2,}/g, " ").trim();
  return t;
}

function sanitizePillsList(list) {
  var out = [];
  if (!list || !list.length) return out;
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    if (p == null) continue;
    if (typeof p === "string") {
      var raw = humanPillText(p);
      if (!raw) continue;
      /* Split pipe-joined mega-pills into separate facts */
      var chunks = raw.split(/\s*\|\s*/);
      for (var c = 0; c < chunks.length; c++) {
        var s = shortenPillText(chunks[c]);
        if (s && isVisibleFxPill(s)) out.push({ kind: "neutral", text: s });
      }
      continue;
    }
    var text = humanPillText(p.text != null ? p.text : p.label);
    if (!text) continue;
    var bits = text.split(/\s*\|\s*/);
    for (var b = 0; b < bits.length; b++) {
      var st = shortenPillText(bits[b]);
      if (st && isVisibleFxPill(st)) out.push({ kind: p.kind || "neutral", text: st, landed: p.landed });
    }
  }
  return out;
}

function buildChoicePills(ch) {
  /* Empty → []; never invent placeholder "Nada" pills (farewell / stay / flavor-only). */
  if (!ch) return [];
  if (ch.pills && ch.pills.length) {
    var custom = sanitizePillsList(ch.pills);
    if (custom.length) return custom;
  }
  var fx = ch.fx || {};
  var pills = [];
  function push(kind, text) {
    text = humanPillText(text);
    if (!text || !isVisibleFxPill(text)) return;
    pills.push({ kind: kind, text: text });
  }
  if (fx.risk) {
    var r = fx.risk;
    var pWin = Math.round((r.p || 0.5) * 100);
    var pLose = 100 - pWin;
    /* Only render risk branches that carry OVR; skip energy/form/etc. */
    function pushBranch(branch, pct) {
      var parts = collectFxPillParts(branch || {});
      for (var i = 0; i < parts.length; i++) {
        push(parts[i].kind, pct + "% " + parts[i].text);
      }
    }
    pushBranch(r.win, pWin);
    pushBranch(r.lose, pLose);
    var base = Object.assign({}, fx);
    delete base.risk;
    var baseP = collectFxPillParts(base);
    for (var i = 0; i < baseP.length; i++) push(baseP[i].kind, baseP[i].text);
    return pills;
  }
  return summarizeLandedPills(fx).map(function (p) {
    return { kind: p.kind, text: p.text };
  }).filter(function (p) {
    return p.text && isVisibleFxPill(p.text);
  });
}

function neighborPos(pos) {
  var map = { ATA: "PD", PD: "MEI", PE: "MEI", MEI: "MC", MC: "VOL", VOL: "MC", LE: "PE", LD: "PD", ZAG: "VOL", GOL: "GOL" };
  return map[pos] || pos;
}

function pickClub(s, mode) {
  var cur = clubOf(s.clubId);
  var stage = marketStage(s);
  var pool = CLUBS.filter(function (c) { return c.id !== cur.id; });
  /* ovr < 70: every mode is hard-locked to the current club's country. */
  if (earlyCountryLock(s)) pool = pool.filter(function (c) { return sameClubCountry(s, c); });
  var filtered;
  if (mode === "elite") {
    if (stage === "home" || earlyCountryLock(s)) {
      /* Early: "elite" stays on-geo big clubs, not random Europe. */
      filtered = pool.filter(function (c) {
        return marketGeoOk(s, c) && c.level >= 4.0 && c.level * 18 <= s.ovr + 10;
      });
    } else {
      /* wonderkid / open / world / elite: real elite pool */
      filtered = pool.filter(function (c) { return c.level >= 4.5 && c.level * 18 <= s.ovr + 10; });
    }
  } else if (mode === "europe") {
    if (earlyCountryLock(s)) {
      filtered = pool.filter(function (c) {
        return sameClubCountry(s, c) && reachableClub(s, c);
      });
    } else if (stage === "home" && nationConf(s.nation) !== "uefa") {
      /* SA/etc youngster: treat "europe" as continental step-up at home. */
      filtered = pool.filter(function (c) {
        return marketGeoOk(s, c) && reachableClub(s, c) && c.level >= cur.level;
      });
    } else {
      filtered = pool.filter(function (c) {
        return EURO_LEAGUES[c.leagueId] && reachableClub(s, c);
      });
    }
  } else if (mode === "home") {
    filtered = pool.filter(function (c) {
      return earlyCountryLock(s) ? sameClubCountry(s, c) : c.nation === s.nation;
    });
  } else if (mode === "down") {
    filtered = pool.filter(function (c) {
      return c.level < cur.level - 0.3 && c.level >= 2.4 && (!earlyCountryLock(s) || sameClubCountry(s, c));
    });
  } else if (mode === "loan") {
    var owner = s.loanFrom ? clubOf(s.loanFrom) : cur;
    filtered = pool.filter(function (c) {
      if (c.id === s.clubId) return false;
      if (s.loanFrom && c.id === s.loanFrom) return false;
      if (earlyCountryLock(s) && !sameClubCountry(s, c)) return false;
      return c.level < owner.level && (s.ovr - c.level * 18) >= -3;
    });
    var same = filtered.filter(function (c) { return c.nation === owner.nation; });
    if (same.length) filtered = same;
    if (earlyCountryLock(s)) {
      filtered = filtered.filter(function (c) { return sameClubCountry(s, c); });
    } else if (stage === "home") {
      var homeLoan = filtered.filter(function (c) { return marketGeoOk(s, c); });
      if (homeLoan.length) filtered = homeLoan;
    }
  } else if (mode === "rival") {
    filtered = pool.filter(function (c) { return c.leagueId === cur.leagueId && Math.abs(c.level - cur.level) < 0.8; });
  } else {
    filtered = pool.filter(function (c) {
      if (Math.abs(c.level - cur.level) >= 0.7 || c.level * 18 > s.ovr + 14) return false;
      if ((stage === "home" || earlyCountryLock(s)) && !marketGeoOk(s, c)) return false;
      return true;
    });
  }
  if (!filtered.length) {
    filtered = pool.filter(function (c) {
      if (Math.abs(c.level * 18 - s.ovr) > 14) return false;
      if ((stage === "home" || earlyCountryLock(s)) && !marketGeoOk(s, c)) return false;
      return true;
    });
  }
  if (!filtered.length) filtered = pool.filter(function (c) { return c.level <= cur.level && ((stage !== "home" && !earlyCountryLock(s)) || marketGeoOk(s, c)); });
  if (!filtered.length) filtered = (stage === "home" || earlyCountryLock(s)) ? pool.filter(function (c) { return marketGeoOk(s, c); }) : pool;
  /* Last resort: still never break the ovr < 70 country lock. */
  if (!filtered.length) filtered = earlyCountryLock(s) ? pool.slice() : pool;
  if (!filtered.length && !earlyCountryLock(s)) filtered = CLUBS.filter(function (c) { return c.id !== cur.id; });
  return filtered[Math.floor(rnd(s) * filtered.length)];
}

function clearLoanState(s) {
  s.loanFrom = null;
  s.parentClubId = null;
  s.loanYears = 0;
  s.loanSpell = 0;
  s.onLoan = false;
  s._loanResolve = false;
}

function moveTo(s, club) {
  if (!club) return;
  s.clubId = club.id;
  clearLoanState(s);
  s.freeAgent = false;
  s._rescindClubId = null;
  s._rescindName = null;
  s.coach = clamp(40 + rnd(s) * 20, 30, 70);
  s.role = roleOf(s, club);
  applyMarketValue(s);
}

function loanTo(s, club) {
  if (!club) return;
  /* Preserva o clube original em empréstimos seguidos (não sobrescreve com o clube atual de emp.). */
  if (!s.loanFrom) s.loanFrom = s.clubId;
  s.parentClubId = s.loanFrom;
  s.clubId = club.id;
  s.loanYears = 1;
  s.onLoan = true;
  s._loanResolve = false;
  s.freeAgent = false;
  s.role = roleOf(s, club);
  applyMarketValue(s);
}

function returnFromLoan(s) {
  if (!s.loanFrom) return;
  var parent = clubOf(s.loanFrom);
  s.clubId = s.loanFrom;
  clearLoanState(s);
  s.freeAgent = false;
  if (parent) s.role = roleOf(s, parent);
  applyMarketValue(s);
}

/* Bom rendimento no emp. → resolve em 2 temporadas; senão até 3. */
function loanPerfGood(s) {
  var last = s.seasons && s.seasons.length ? s.seasons[s.seasons.length - 1] : null;
  if (!last || !last.loan) return false;
  var score = 0;
  if ((last.delta || 0) >= 3) score += 2;
  else if ((last.delta || 0) >= 1) score += 1;
  if ((last.rating || 0) >= 7.05) score += 1;
  if ((last.apps || 0) >= 18) score += 1;
  if ((s.form || 50) >= 64) score += 1;
  if ((s.confidence || 50) >= 58) score += 1;
  /* notas / tema da temporada (fun packs) contam como "notes" */
  if (last.themeTitle || (last.note && String(last.note).length > 8)) score += 1;
  return score >= 3;
}

function loanSpellTarget(s) {
  return loanPerfGood(s) ? 2 : 3;
}

function pickLoanPermanentClubs(s, n) {
  n = n || 2;
  var parent = s.loanFrom ? clubOf(s.loanFrom) : null;
  var cur = s.clubId ? clubOf(s.clubId) : null;
  var parentLv = parent ? parent.level : currentClubLevel(s);
  var pool = CLUBS.filter(function (c) {
    if (!c || c.id === s.clubId) return false;
    if (s.loanFrom && c.id === s.loanFrom) return false;
    if (!reachableClub(s, c)) return false;
    /* definitivo: clube melhor que o emp. atual, ou o emp. se for forte o bastante */
    return c.level >= parentLv - 0.05 || (cur && c.id === cur.id);
  });
  /* preferir acima do clube original */
  var better = pool.filter(function (c) { return c.level >= parentLv + 0.15; });
  var wave = shuffled(better.length ? better : pool, s);
  var out = [];
  var seen = {};
  for (var i = 0; i < wave.length && out.length < n; i++) {
    if (seen[wave[i].id]) continue;
    seen[wave[i].id] = 1;
    out.push(wave[i]);
  }
  /* loan club as permanent if strong enough vs parent / OVR */
  if (cur && out.length < n && !seen[cur.id]) {
    var need = cur.level * 18;
    if (cur.level >= parentLv - 0.25 && s.ovr >= need - 6) {
      out.push(cur);
      seen[cur.id] = 1;
    }
  }
  return out;
}

function permanentOfferChoice(s, club) {
  var lg = leagueOf(club.leagueId);
  var ghost = { ovr: s.ovr, age: s.age, clubId: club.id };
  var role = roleOf(ghost, club);
  var curLevel = currentClubLevel(s);
  var step = club.level - curLevel;
  var euro = EURO_LEAGUES[club.leagueId] ? "Europa · " : "";
  return {
    label: "Definitivo · " + club.name,
    hint: euro + lg.name + " · " + ROLE_NAME[role],
    crest: club.crest,
    leagueId: club.leagueId,
    nation: club.nation,
    colors: club.colors,
    fx: { sign: club.id, ambition: step >= 0.2 ? 6 : 3, loyalty: -3, resilience: 2 }
  };
}

function buildLoanResolveWindow(s) {
  var parent = clubOf(s.loanFrom);
  var cur = clubOf(s.clubId);
  var spell = s.loanSpell || 0;
  var target = loanSpellTarget(s);
  var done = spell >= target;
  var good = loanPerfGood(s);
  var parentName = parent ? parent.name : "clube de origem";
  var curName = cur ? cur.name : "clube atual";
  var blurb;
  if (done) {
    blurb = good
      ? ("Após " + spell + " empréstimo(s) com bom rendimento, o mercado abriu. Retorno ao " + parentName + " ou contrato definitivo.")
      : ("Acabaram os " + spell + " empréstimos. Hora do Retorno ao " + parentName + " — ou um definitivo se aparecer.");
  } else {
    blurb = "Fim da temporada de empréstimo no " + curName + " (" + spell + "/" + target + "). Pode rolar outro Empréstimo, Retorno ao " + parentName + ", ou um definitivo.";
  }
  var ev = {
    id: "loan_resolve",
    title: done ? "Fim do empréstimo" : "Empréstimo · decisão",
    text: blurb
  };
  ev.a = {
    label: "Retorno · " + parentName,
    hint: "Voltar ao clube original",
    crest: parent ? parent.crest : null,
    leagueId: parent ? parent.leagueId : null,
    nation: parent ? parent.nation : null,
    colors: parent ? parent.colors : null,
    fx: { returnLoan: 1, loyalty: 5, confidence: 2 }
  };
  if (!done) {
    var nextLoan = pickClub(s, "loan");
    if (nextLoan) {
      ev.b = {
        label: "Empréstimo · " + nextLoan.name,
        hint: "Empréstimo · mais uma temporada",
        crest: nextLoan.crest,
        leagueId: nextLoan.leagueId,
        nation: nextLoan.nation,
        colors: nextLoan.colors,
        fx: { loanTo: nextLoan.id, resilience: 3 }
      };
    } else {
      ev.b = permanentOfferChoice(s, cur || parent);
    }
    var perms = pickLoanPermanentClubs(s, 1);
    if (perms[0]) ev.c = permanentOfferChoice(s, perms[0]);
    else if (good && cur) ev.c = permanentOfferChoice(s, cur);
  } else {
    var perms2 = pickLoanPermanentClubs(s, 2);
    if (perms2[0]) ev.b = permanentOfferChoice(s, perms2[0]);
    else if (cur) ev.b = permanentOfferChoice(s, cur);
    if (perms2[1]) ev.c = permanentOfferChoice(s, perms2[1]);
    else if (cur && (!ev.b || ev.b.fx.sign !== cur.id)) ev.c = permanentOfferChoice(s, cur);
  }
  /* garantir ao menos Retorno + uma alternativa */
  if (!ev.b) {
    ev.b = ev.a;
  }
  return ev;
}

function advance(s) {
  var reports = [];
  var n = (PACE[s.pace] || PACE.normal).n;
  for (var i = 0; i < n; i++) {
    if (shouldRetire(s)) {
      s.retired = true;
      break;
    }
    reports.push(simSeason(s));
    if (shouldRetire(s)) {
      s.retired = true;
      break;
    }
  }
  return reports;
}

function finalScore(s) {
  var peak = s.peakOvr;
  var titles = s.career.trophies || [];
  var tw = 0;
  for (var i = 0; i < titles.length; i++) tw += (trophyOf(titles[i]).w || 2);
  var aw = s.awards || [];
  for (var ai = 0; ai < aw.length; ai++) tw += (trophyOf(aw[ai]).w || 2);
  var ach = clamp((peak - 50) * 1.4 + tw * 1.8, 0, 100);
  var prod;
  if (s.pos === "GOL") prod = s.career.cs * 1.2 + s.career.apps * 0.04;
  else if (POS[s.pos].line === "def") prod = s.career.apps * 0.08 + tw * 0.8;
  else prod = s.career.goals * 0.12 + s.career.assists * 0.1 + (peak - 50);
  var legend = clamp(peak * 0.55 + prod * 0.35, 0, 100);
  var nClubs = clubAppsMap(s).length;
  var loyalty = clamp(s.traits.loyalty * 0.6 + (8 - nClubs) * 8, 0, 100);
  var inf = clamp(s.caps * 0.9 + s.ntGoals * 0.8 + (s.ovr - 50) * 0.3, 0, 100);
  var res = clamp(s.traits.resilience * 0.5 + (s.age - 16) * 2.2 + s.energy * 0.2, 0, 100);
  var total = Math.round(ach * 0.27 + legend * 0.25 + loyalty * 0.16 + inf * 0.16 + res * 0.16);
  if (typeof farewellLegacyBonus === "function") total = clamp(total + farewellLegacyBonus(s), 1, 99);
  else if (s.farewellBonus) total = clamp(total + 4, 1, 99);
  return { total: clamp(total, 1, 99), ach: Math.round(ach), legend: Math.round(legend), loyalty: Math.round(loyalty), inf: Math.round(inf), res: Math.round(res) };
}

function verdict(s, score) {
  var nClubs = clubAppsMap(s).length;
  if (s.peakOvr >= 92 && countTrophy(s, "worldcup") >= 1) return "Fenômeno";
  if (nClubs === 1 && s.career.apps >= 300) return "Ídolo de uma camisa";
  if (countTrophy(s, "ucl") + countTrophy(s, "libertadores") + countTrophy(s, "acl") + countTrophy(s, "caf") + countTrophy(s, "concacaf") >= 3) return "Rei de copas";
  if (s.caps >= 60 && (countTrophy(s, "worldcup") + countTrophy(s, "copaamerica") + countTrophy(s, "euro")) >= 1) return "Herói da seleção";
  if (s.age >= 36 && s.peakOvr < 74 && s.caps < 15) return "Sobrevivente";
  if (score.total >= 86) return "Lenda";
  if (score.total >= 74) return "Craque";
  if (score.total >= 60) return "Profissional";
  return "Promessa que não vingou";
}

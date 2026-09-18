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
  var club = clubOf(clubId);
  s.pot = clamp(s.pot + Math.round((club.level - 3.2) * 1.2), 82, OVR_CAP);
  s.role = roleOf(s, club);
  s.value = marketValue(s);
  s.clubs = [{ id: clubId, from: s.year }];
}

function eventFits(s, ev) {
  var w = ev.when || {};
  if (w.minAge != null && s.age < w.minAge) return false;
  if (w.maxAge != null && s.age > w.maxAge) return false;
  if (w.minOvr != null && s.ovr < w.minOvr) return false;
  if (w.maxOvr != null && s.ovr > w.maxOvr) return false;
  if (w.roles && w.roles.indexOf(s.role) < 0) return false;
  if (w.home && clubOf(s.clubId).nation !== s.nation) return false;
  if (w.abroad && clubOf(s.clubId).nation === s.nation) return false;
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

/* Copero-like market stages by OVR (+ wonderkid exception). */
function marketStage(s) {
  if (s.ovr >= 89) return "elite";   /* top-5 offers guaranteed */
  if (s.ovr >= 85) return "world";   /* chance of top-10 */
  if (isWonderkid(s)) return "wonderkid"; /* rare: big Europe may call early */
  if (s.ovr >= 78 && s.age >= 22) return "open"; /* mid: other continents ok */
  return "home"; /* early / low OVR: same continent (or country) only */
}

function pickEvent(s) {
  var marketP = 0.72;
  if (s.age <= 22) marketP = 0.82;
  if (s.age >= 32) marketP = 0.5;
  /* jovem engavetado em clube grande: janela quase certa (empréstimo/passo lateral) */
  var cur = s.clubId ? clubOf(s.clubId) : null;
  if (cur && s.age <= 21 && (s.role === "youth" || s.role === "bench") && cur.level >= 4.2) marketP = 0.92;
  /* Ritmo Intensa: oferta bem mais frequente (antes ~0.72–0.82 → ~0.92–0.97) */
  if (s.pace === "intensa") marketP = Math.min(0.97, marketP + 0.2);
  if (typeof DEV !== "undefined" && DEV.on && DEV.on() && DEV.flags.alwaysTransfers) {
    return buildTransferWindow(s);
  }

  /* ~9% chance de evento raro de salto (não frequente; 1x cada id por carreira) */
  var rarePool = [];
  for (var ri = 0; ri < EVENTS.length; ri++) {
    if (!EVENTS[ri].rare) continue;
    if (!eventFits(s, EVENTS[ri])) continue;
    rarePool.push(EVENTS[ri]);
  }
  if (rarePool.length && rnd(s) < 0.09) {
    return rarePool[Math.floor(rnd(s) * rarePool.length)];
  }

  if (rnd(s) < marketP) return buildTransferWindow(s);

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
  var cur = clubOf(s.clubId);
  var stage = marketStage(s);
  var pool = CLUBS.filter(function (c) {
    if (c.id === cur.id || !reachableClub(s, c)) return false;
    /* Early career: only same continent / country (no random Europe for SA youngster). */
    if (stage === "home" && !sameContinentClub(s, c)) return false;
    /* Wonderkid: home continent OR European elite / world top-10 only. */
    if (stage === "wonderkid") {
      if (sameContinentClub(s, c)) return true;
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

  var stepUp = playablePool.filter(function (c) {
    return c.level > cur.level + 0.12 && c.level <= cur.level + 0.85;
  });
  var bigStep = playablePool.filter(function (c) {
    return c.level > cur.level + 0.85 && s.ovr >= c.level * 18 - 6;
  });
  var lateral = playablePool.filter(function (c) {
    return Math.abs(c.level - cur.level) <= 0.35;
  });
  var safer = playablePool.filter(function (c) {
    return c.level < cur.level - 0.15 && c.level >= cur.level - 0.9;
  });
  /* empréstimos naturais para jovens engavetados */
  var loanish = [];
  if (s.age <= 21 && (s.role === "youth" || s.role === "bench")) {
    loanish = playablePool.filter(function (c) {
      return c.level < cur.level - 0.2 && c.level >= 2.6;
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

  /* 85+: chance of a world top-10 offer; 89+: always include a top-5.
     Wonderkid: high chance a European mega shows interest early. */
  var top5 = clubsByIds(WORLD_TOP5_IDS).filter(function (c) {
    return c.id !== cur.id && reachableClub(s, c);
  });
  var top10 = clubsByIds(WORLD_TOP10_IDS).filter(function (c) {
    return c.id !== cur.id && reachableClub(s, c);
  });
  top5 = shuffled(top5, s);
  top10 = shuffled(top10, s);
  if (stage === "elite" && top5[0]) forceElite(top5[0]);
  else if (stage === "world" && top10[0] && rnd(s) < 0.48) forceElite(top10[0]);
  else if (stage === "wonderkid" && top10[0] && rnd(s) < 0.62) forceElite(top10[0]);

  /* 1ª carta: passo à frente (ou big step raro se o OVR aguenta) — se ainda cabe */
  if (out.length < n) {
    if (s.ovr >= cur.level * 18 + 2 && bigStep[0] && rnd(s) < 0.28) add(bigStep[0]);
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
      return Math.abs(c.level * 18 - s.ovr) <= 14;
    }), s);
    for (var j = 0; j < near.length && out.length < n; j++) add(near[j]);
  }

  /* 89+ safety: if reachable top-5 existed but was crowded out, re-force */
  if (stage === "elite" && top5[0]) {
    var hasTop5 = out.some(function (c) { return WORLD_TOP5_IDS.indexOf(c.id) >= 0; });
    if (!hasTop5) forceElite(top5[0]);
  }
  return out.slice(0, n);
}

function offerChoice(s, club) {
  var lg = leagueOf(club.leagueId);
  var ghost = { ovr: s.ovr, age: s.age, clubId: club.id };
  var role = roleOf(ghost, club);
  var cur = clubOf(s.clubId);
  var loan = s.age <= 21 && (s.role === "youth" || s.role === "bench") && club.level < cur.level - 0.15;
  var step = club.level - cur.level;
  var tag = loan ? "Empréstimo · " : step >= 0.45 ? "Subir · " : step <= -0.35 ? "Mais minutos · " : "Mudar · ";
  var euro = EURO_LEAGUES[club.leagueId] ? "Europa · " : "";
  return {
    label: tag + club.name,
    hint: euro + lg.name + " · " + ROLE_NAME[role],
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
    if (roll < (r.p || 0.5)) {
      if (r.win) for (var wk in r.win) fx[wk] = (fx[wk] || 0) + r.win[wk];
      s._lastRisk = { ok: 1, text: r.winText || "Deu certo." };
    } else {
      if (r.lose) for (var lk in r.lose) fx[lk] = (fx[lk] || 0) + r.lose[lk];
      s._lastRisk = { ok: 0, text: r.loseText || "Saiu pela culatra." };
    }
    delete fx.risk;
  }
  s.usedEvents = s.usedEvents || [];
  if (ev.id && ev.id !== "market" && ev.id !== "quiet" && ev.id !== "muscle" && ev.id !== "formdip" && s.usedEvents.indexOf(ev.id) < 0) {
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
  if (fx.pot) {
    s.pot = clamp((s.pot || 88) + fx.pot, 82, OVR_CAP);
  }
  if (fx.ovr) {
    applyDeltaToAttrs(s, fx.ovr);
    s.ovr = clamp(computeOvr(s.attrs, s.pos), 40, OVR_CAP);
    /* soft-cap sobe junto se o salto passou do potencial antigo */
    if (s.ovr > s.pot) s.pot = Math.min(OVR_CAP, s.ovr);
    s.peakOvr = Math.max(s.peakOvr || s.ovr, s.ovr);
  }
  if (fx.ntNo) s.ntNoStreak = 2;
  if (fx.clubApps) s._clubAppsMod = true;
  if (fx.injuryRisk && !(typeof DEV !== "undefined" && DEV.on && DEV.on() && DEV.flags.ignoreInjury) && rnd(s) < 0.35) s.injuryWeeks = (s.injuryWeeks || 0) + 10;
  if (fx.retire) s.retireForce = true;
  if (fx.extraYear) s.extraYears = (s.extraYears || 0) + 2;
  if (fx.shiftPos) s.pos = neighborPos(s.pos);
  if (fx.sign) moveTo(s, clubOf(fx.sign));
  if (fx.loanTo) loanTo(s, clubOf(fx.loanTo));
  if (fx.transferElite) moveTo(s, pickClub(s, "elite"));
  if (fx.transferEurope) moveTo(s, pickClub(s, "europe"));
  if (fx.transferPeer) moveTo(s, pickClub(s, "peer"));
  if (fx.transferHome) moveTo(s, pickClub(s, "home"));
  if (fx.transferDown) moveTo(s, pickClub(s, "down"));
  if (fx.transferRival) moveTo(s, pickClub(s, "rival"));
  if (fx.loan) loanTo(s, pickClub(s, "loan"));
}

function neighborPos(pos) {
  var map = { ATA: "PD", PD: "MEI", PE: "MEI", MEI: "MC", MC: "VOL", VOL: "MC", LE: "PE", LD: "PD", ZAG: "VOL", GOL: "GOL" };
  return map[pos] || pos;
}

function pickClub(s, mode) {
  var cur = clubOf(s.clubId);
  var stage = marketStage(s);
  var pool = CLUBS.filter(function (c) { return c.id !== cur.id; });
  var filtered;
  if (mode === "elite") {
    if (stage === "home") {
      /* Early: "elite" stays on-continent big clubs, not random Europe. */
      filtered = pool.filter(function (c) {
        return sameContinentClub(s, c) && c.level >= 4.0 && c.level * 18 <= s.ovr + 10;
      });
    } else {
      /* wonderkid / open / world / elite: real elite pool */
      filtered = pool.filter(function (c) { return c.level >= 4.5 && c.level * 18 <= s.ovr + 10; });
    }
  } else if (mode === "europe") {
    if (stage === "home" && nationConf(s.nation) !== "uefa") {
      /* SA/etc youngster: treat "europe" as continental step-up at home. */
      filtered = pool.filter(function (c) {
        return sameContinentClub(s, c) && reachableClub(s, c) && c.level >= cur.level;
      });
    } else {
      filtered = pool.filter(function (c) {
        return EURO_LEAGUES[c.leagueId] && reachableClub(s, c);
      });
    }
  } else if (mode === "home") filtered = pool.filter(function (c) { return c.nation === s.nation; });
  else if (mode === "down") filtered = pool.filter(function (c) { return c.level < cur.level - 0.3 && c.level >= 2.4; });
  else if (mode === "loan") {
    filtered = pool.filter(function (c) {
      return c.level < cur.level && (s.ovr - c.level * 18) >= -3;
    });
    var same = filtered.filter(function (c) { return c.nation === cur.nation; });
    if (same.length) filtered = same;
    if (stage === "home") {
      var homeLoan = filtered.filter(function (c) { return sameContinentClub(s, c); });
      if (homeLoan.length) filtered = homeLoan;
    }
  } else if (mode === "rival") {
    filtered = pool.filter(function (c) { return c.leagueId === cur.leagueId && Math.abs(c.level - cur.level) < 0.8; });
  } else {
    filtered = pool.filter(function (c) {
      if (Math.abs(c.level - cur.level) >= 0.7 || c.level * 18 > s.ovr + 14) return false;
      if (stage === "home" && !sameContinentClub(s, c)) return false;
      return true;
    });
  }
  if (!filtered.length) {
    filtered = pool.filter(function (c) {
      if (Math.abs(c.level * 18 - s.ovr) > 14) return false;
      if (stage === "home" && !sameContinentClub(s, c)) return false;
      return true;
    });
  }
  if (!filtered.length) filtered = pool.filter(function (c) { return c.level <= cur.level && (stage !== "home" || sameContinentClub(s, c)); });
  if (!filtered.length) filtered = stage === "home" ? pool.filter(function (c) { return sameContinentClub(s, c); }) : pool;
  if (!filtered.length) filtered = pool;
  return filtered[Math.floor(rnd(s) * filtered.length)];
}

function moveTo(s, club) {
  if (!club) return;
  s.clubId = club.id;
  s.loanFrom = null;
  s.loanYears = 0;
  s.coach = clamp(40 + rnd(s) * 20, 30, 70);
  s.role = roleOf(s, club);
  s.value = marketValue(s);
}

function loanTo(s, club) {
  if (!club) return;
  s.loanFrom = s.clubId;
  s.clubId = club.id;
  s.loanYears = 1;
  s.role = roleOf(s, club);
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
  return { total: clamp(total, 1, 99), ach: Math.round(ach), legend: Math.round(legend), loyalty: Math.round(loyalty), inf: Math.round(inf), res: Math.round(res) };
}

function verdict(s, score) {
  var nClubs = clubAppsMap(s).length;
  if (s.peakOvr >= 92 && countTrophy(s, "worldcup") >= 1) return "Fenômeno";
  if (nClubs === 1 && s.career.apps >= 300) return "Ídolo de uma camisa";
  if (countTrophy(s, "ucl") + countTrophy(s, "libertadores") >= 3) return "Rei de copas";
  if (s.caps >= 60 && (countTrophy(s, "worldcup") + countTrophy(s, "copaamerica") + countTrophy(s, "euro")) >= 1) return "Herói da seleção";
  if (s.age >= 36 && s.peakOvr < 74 && s.caps < 15) return "Sobrevivente";
  if (score.total >= 86) return "Lenda";
  if (score.total >= 74) return "Craque";
  if (score.total >= 60) return "Profissional";
  return "Promessa que não vingou";
}

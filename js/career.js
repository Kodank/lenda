function academyOffers(s) {
  var home = CLUBS.filter(function (c) { return c.nation === s.nation; });
  home.sort(function (a, b) { return b.level - a.level; });
  var picks = [];
  if (home.length >= 3) {
    picks = [home[0], home[Math.min(2, home.length - 1)], home[home.length - 1]];
  } else {
    picks = home.slice();
    var foreign = CLUBS.filter(function (c) { return c.nation !== s.nation && c.level >= 3.2 && c.level <= 4.4; });
    foreign.sort(function () { return rnd(s) - 0.5; });
    while (picks.length < 3 && foreign.length) picks.push(foreign.pop());
  }
  var seen = {};
  var out = [];
  for (var i = 0; i < picks.length; i++) {
    if (!picks[i] || seen[picks[i].id]) continue;
    seen[picks[i].id] = 1;
    var c = picks[i];
    out.push({
      club: c,
      formacao: Math.round(40 + c.level * 12),
      minutos: Math.round(100 - c.level * 14),
      pressao: Math.round(20 + c.level * 14),
      casa: c.nation === s.nation
    });
  }
  return out.slice(0, 3);
}

function signAcademy(s, clubId) {
  s.clubId = clubId;
  var club = clubOf(clubId);
  s.pot = clamp(s.pot + Math.round((club.level - 3.2) * 1.2), 82, 96);
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

function pickEvent(s) {
  var marketP = 0.72;
  if (s.age <= 22) marketP = 0.82;
  if (s.age >= 32) marketP = 0.5;
  /* jovem engavetado em clube grande: janela quase certa (empréstimo/passo lateral) */
  var cur = s.clubId ? clubOf(s.clubId) : null;
  if (cur && s.age <= 21 && (s.role === "youth" || s.role === "bench") && cur.level >= 4.2) marketP = 0.92;
  if (rnd(s) < marketP) return buildTransferWindow(s);

  var pool = [];
  for (var i = 0; i < EVENTS.length; i++) {
    if (!eventFits(s, EVENTS[i])) continue;
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
  var pool = CLUBS.filter(function (c) {
    return c.id !== cur.id && reachableClub(s, c);
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
    if (!c || seen[c.id] || out.length >= n) return;
    seen[c.id] = 1;
    out.push(c);
  }

  /* 1ª carta: passo à frente (ou big step raro se o OVR aguenta) */
  if (s.ovr >= cur.level * 18 + 2 && bigStep[0] && rnd(s) < 0.28) add(bigStep[0]);
  else if (stepUp[0]) add(stepUp[0]);
  else if (loanish[0]) add(loanish[0]);
  else if (lateral[0]) add(lateral[0]);

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
  var ev = {
    id: "market",
    title: "Janela de transferências",
    text: offers.length
      ? "O mercado abriu. Duas camisas novas — inclusive da Europa — ou você permanece onde está."
      : "Poucas ligações nesta janela. Ficar e trabalhar, ou esperar a próxima."
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
  if (fx.injury) s.injuryWeeks = (s.injuryWeeks || 0) + fx.injury;
  if (fx.ovr) {
    applyDeltaToAttrs(s, fx.ovr);
    s.ovr = clamp(computeOvr(s.attrs, s.pos), 40, OVR_CAP);
  }
  if (fx.ntNo) s.ntNoStreak = 2;
  if (fx.clubApps) s._clubAppsMod = true;
  if (fx.injuryRisk && rnd(s) < 0.35) s.injuryWeeks = (s.injuryWeeks || 0) + 10;
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
  var pool = CLUBS.filter(function (c) { return c.id !== cur.id; });
  var filtered;
  if (mode === "elite") filtered = pool.filter(function (c) { return c.level >= 4.5 && c.level * 18 <= s.ovr + 10; });
  else if (mode === "europe") filtered = pool.filter(function (c) {
    return EURO_LEAGUES[c.leagueId] && reachableClub(s, c);
  });
  else if (mode === "home") filtered = pool.filter(function (c) { return c.nation === s.nation; });
  else if (mode === "down") filtered = pool.filter(function (c) { return c.level < cur.level - 0.3 && c.level >= 2.4; });
  else if (mode === "loan") {
    filtered = pool.filter(function (c) {
      return c.level < cur.level && (s.ovr - c.level * 18) >= -3;
    });
    var same = filtered.filter(function (c) { return c.nation === cur.nation; });
    if (same.length) filtered = same;
  } else if (mode === "rival") {
    filtered = pool.filter(function (c) { return c.leagueId === cur.leagueId && Math.abs(c.level - cur.level) < 0.8; });
  } else filtered = pool.filter(function (c) { return Math.abs(c.level - cur.level) < 0.7 && c.level * 18 <= s.ovr + 14; });
  if (!filtered.length) {
    filtered = pool.filter(function (c) { return Math.abs(c.level * 18 - s.ovr) <= 14; });
  }
  if (!filtered.length) filtered = pool.filter(function (c) { return c.level <= cur.level; });
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

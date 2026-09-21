/* OVR → rendimento: <75 modesto · 80–87 titular sólido · 88–92 estrela · 93–98 monstro · 99 apex */
function perfOvrFactor(ovr) {
  ovr = Number(ovr) || 50;
  if (ovr >= 99) return 2.20;
  if (ovr >= 96) return 1.82 + (ovr - 96) * 0.12;
  if (ovr >= 93) return 1.58 + (ovr - 93) * 0.08;
  if (ovr >= 88) return 1.28 + (ovr - 88) * 0.054;
  if (ovr >= 80) return 0.98 + (ovr - 80) * 0.0375;
  if (ovr >= 70) return 0.72 + (ovr - 70) * 0.026;
  return clamp(0.38 + (ovr - 45) * 0.0136, 0.32, 0.72);
}

function appsOvrBand(ovr) {
  /* elite OVR: faixa alta de jogos (quase teto); academy permanece baixa via role */
  if (ovr >= 99) return { lo: 0.97, span: 0.06 };
  if (ovr >= 95) return { lo: 0.94, span: 0.08 };
  if (ovr >= 90) return { lo: 0.90, span: 0.12 };
  if (ovr >= 80) return { lo: 0.86, span: 0.18 };
  return { lo: 0.84, span: 0.22 };
}

function titleOvrBoost(ovr) {
  if (ovr >= 99) return { power: 16, cup: 0.58, cont: 0.65, cwc: 0.68, leagueForce: 0.95 };
  if (ovr >= 96) return { power: 10, cup: 0.40, cont: 0.44, cwc: 0.38, leagueForce: 0.78 };
  if (ovr >= 93) return { power: 6, cup: 0.26, cont: 0.30, cwc: 0.26, leagueForce: 0.55 };
  if (ovr >= 90) return { power: 3.2, cup: 0.14, cont: 0.16, cwc: 0.16, leagueForce: 0.32 };
  if (ovr >= 85) return { power: 1.2, cup: 0.06, cont: 0.07, cwc: 0.08, leagueForce: 0.08 };
  return { power: 0, cup: 0, cont: 0, cwc: 0, leagueForce: 0 };
}


/* Elite club sets from static CLUBS[].level (data ranking). Cached once. */
var _eliteClubSets = null;
function eliteClubSets() {
  if (_eliteClubSets) return _eliteClubSets;
  function topIds(pred, n) {
    var list = [];
    for (var i = 0; i < CLUBS.length; i++) {
      var c = CLUBS[i];
      if (pred(c)) list.push(c);
    }
    list.sort(function (a, b) {
      if (b.level !== a.level) return b.level - a.level;
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });
    var set = {};
    for (var j = 0; j < list.length && j < n; j++) set[list[j].id] = 1;
    return set;
  }
  function isUefaClub(c) {
    var n = typeof nationOf === "function" ? nationOf(c.nation) : null;
    return !!(n && n.conf === "uefa");
  }
  function topInNation(nation, n) {
    return topIds(function (c) { return c.nation === nation; }, n);
  }
  _eliteClubSets = {
    europeTop20: topIds(isUefaClub, 20),
    brazilTop5: topInNation("br", 5),
    /* CONMEBOL non-BR: top-2 per nation keeps Mundial rare outside BR giants */
    argTop2: topInNation("ar", 2),
    uyTop2: topInNation("uy", 2),
    coTop2: topInNation("co", 2)
  };
  return _eliteClubSets;
}

function canWinUcl(club, ovr) {
  if (!club || ovr < 88) return false;
  return !!eliteClubSets().europeTop20[club.id];
}

/* Club World Cup gates after winning continental. Domestic leagues untouched. */
function canWinLibertadores(club, ovr) {
  if (!club) return false;
  /* BR: OVR acima de 80 → >= 81. Other CONMEBOL clubs: no extra OVR gate. */
  if (club.nation === "br") return ovr >= 81;
  return true;
}

function canWinClubWorldCup(club, ovr) {
  if (!club) return false;
  var elite = eliteClubSets();
  var nat = club.nation;
  var conf = (typeof nationOf === "function" && nationOf(nat)) ? nationOf(nat).conf : null;
  /* BR: top-5 + OVR acima de 85 → >= 86 */
  if (nat === "br") return !!elite.brazilTop5[club.id] && ovr >= 86;
  if (conf === "uefa") return ovr >= 90;
  if (nat === "ar") return !!elite.argTop2[club.id];
  if (nat === "uy") return !!elite.uyTop2[club.id];
  if (nat === "co") return !!elite.coTop2[club.id];
  /* Other continents: rare — need strong club + high OVR */
  return club.level >= 4.0 && ovr >= 88;
}

function simSeason(s) {
  var club = clubOf(s.clubId);
  var league = leagueOf(club.leagueId);
  var role = roleOf(s, club);
  s.role = role;
  if (s._farewellTour && s._farewellTour > 0) {
    s.confidence = clamp(s.confidence + 3, 15, 100);
    s.form = clamp(s.form + 2, 20, 100);
  }
  var inj = s.injuryWeeks || 0;
  if (typeof DEV !== "undefined" && DEV.on && DEV.on() && DEV.flags.ignoreInjury) inj = 0;
  s.injuryWeeks = 0;
  var suspended = !!s._seasonSuspended;
  if (suspended) s._seasonSuspended = false;
  var mins = ROLE_MINS[role] * (0.84 + s.energy / 550) * (1 - Math.min(0.65, inj / 40));
  if (suspended) mins = 0;
  else if (s.ovr >= 99) mins = Math.max(mins, 0.99);
  else if (s.ovr >= 95) mins = Math.max(mins, 0.97);
  else if (s.ovr >= 92) mins = Math.max(mins, 0.93);
  /* pool = liga + copa/continental; elite OVR ocupa quase o teto */
  var extra = s.contQual ? (s.ovr >= 95 ? 12 : s.ovr >= 88 ? 10 : 7) : (s.ovr >= 90 ? 5 : 3);
  var pool = league.size + extra;
  var band = appsOvrBand(s.ovr);
  var apps = Math.round(pool * mins * (band.lo + rnd(s) * band.span));
  var cap = league.size + (s.contQual ? 12 : 5);
  if (s.ovr >= 95) cap = Math.max(cap, league.size + (s.contQual ? 14 : 7));
  if (s.ovr >= 99) cap = Math.max(cap, league.size + (s.contQual ? 16 : 8));
  apps = clamp(apps, role === "youth" ? 2 : 5, cap);
  if (s._clubAppsMod) {
    apps = Math.max(2, Math.round(apps * 0.72));
    s._clubAppsMod = false;
  }
  if (suspended) {
    /* Suspensão: quase zero jogos; sem títulos/prêmios/seleção na temporada */
    apps = rnd(s) < 0.35 ? 1 : 0;
  }

  var ovrF = perfOvrFactor(effectiveOvr(s));
  var formF = 0.82 + s.form / 280;
  var pr = PROD[s.pos] || PROD.MC;
  var goals = poisson(apps * pr.g * ovrF * formF, function () { return rnd(s); });
  var assists = poisson(apps * pr.a * ovrF * formF, function () { return rnd(s); });
  var cs = 0, ga = 0, saves = 0, rating = 6.15 + ovrF * 1.35 + (rnd(s) - 0.42);
  if (s.pos === "GOL") {
    goals = rnd(s) < 0.04 ? 1 : 0;
    assists = poisson(apps * 0.02, function () { return rnd(s); });
    cs = poisson(apps * ((pr.cs || 0.28) + ovrF * 0.22), function () { return rnd(s); });
    cs = Math.min(apps, cs);
    ga = Math.max(0, Math.round(apps * (1.35 - ovrF * 0.48) + (rnd(s) - 0.5) * 6));
    /* Defesas: volume sobe com OVR (goleiro elite para mais chutes / taxa). */
    saves = poisson(apps * (2.35 + ovrF * 1.15) * formF, function () { return rnd(s); });
    saves = Math.max(saves, Math.round(ga * 1.4 + cs * 0.5));
    rating = 6.0 + (cs / Math.max(1, apps)) * 1.6 + Math.min(1.2, saves / Math.max(1, apps) * 0.22) + ovrF * 0.15;
  }
  var rateCap = s.ovr >= 96 ? 9.4 : s.ovr >= 90 ? 9.1 : 8.8;
  rating = Math.round(clamp(rating, 5.4, rateCap) * 10) / 10;

  var tBoost = titleOvrBoost(s.ovr);
  var power = club.level * 18 + ((role === "star" || role === "starter") ? (s.ovr - 68) * 0.55 : 0);
  power += tBoost.power;
  /* menos ruído no ranking quando o OVR é elite (ainda cabe upset) */
  var noise = s.ovr >= 96 ? 4 : s.ovr >= 90 ? 7 : 10;
  power += (rnd(s) - 0.5) * noise;
  var leaguePos = rankFromPower(power, league.size, s);
  /* Tier 2+: allow title force at lower club.level so Série B / Championship stars can win the league */
  var forceLvl = (league.tier && league.tier >= 2) ? 2.2 : 3.5;
  if ((role === "star" || role === "starter") && tBoost.leagueForce > 0 && club.level >= forceLvl && rnd(s) < tBoost.leagueForce) {
    leaguePos = 1;
  } else if (s.ovr >= 93 && (role === "star" || role === "starter") && leaguePos > 3 && rnd(s) < 0.55) {
    leaguePos = 1 + Math.floor(rnd(s) * 2);
  } else if (league.tier >= 2 && s.ovr >= 82 && (role === "star" || role === "starter") && leaguePos > 4 && rnd(s) < 0.4) {
    leaguePos = 1 + Math.floor(rnd(s) * Math.min(3, league.size - 1));
  }
  var trophies = [];
  var awards = [];
  if (leaguePos === 1) trophies.push(league.trophy || "brasileirao");
  var cupP = 0.04 + club.level * 0.03 + (role === "star" ? 0.06 : role === "starter" ? 0.03 : 0) + tBoost.cup;
  if (s.ovr >= 99) cupP = Math.min(0.97, cupP);
  if (rnd(s) < cupP) {
    var cupId = league.cupTrophy || (typeof NATION_CUP !== "undefined" && NATION_CUP[club.nation]) || "copa";
    trophies.push(cupId);
  }
  if (s.contQual) {
    var cont = league.continental;
    var contId = cont === "lib" ? "libertadores" : cont === "ucl" ? "ucl" : cont;
    /* Gates = eligibility only (zero below). Win chance stays rare at floor and scales with OVR. */
    var canCont = !!contId;
    if (contId === "ucl") canCont = canWinUcl(club, s.ovr);
    else if (contId === "libertadores") canCont = canWinLibertadores(club, s.ovr);
    var cP = 0.025 + club.level * 0.02 + tBoost.cont;
    if (contId === "ucl") cP += Math.min(0.14, Math.max(0, s.ovr - 88) * 0.014);
    else if (contId === "libertadores" && club.nation === "br") cP += Math.min(0.14, Math.max(0, s.ovr - 81) * 0.012);
    else if (s.ovr >= 86) cP += Math.min(0.10, (s.ovr - 86) * 0.012);
    if (s.ovr >= 99) cP = Math.min(0.82, cP);
    else if (s.ovr >= 95) cP = Math.min(0.72, cP);
    if (canCont && rnd(s) < cP) {
      trophies.push(contId);
      /* Mundial: eligibility gate + low base at floor, scales via tBoost.cwc / OVR above floor */
      var cwcP = 0.10 + tBoost.cwc;
      if (club.nation === "br") cwcP += Math.min(0.12, Math.max(0, s.ovr - 86) * 0.012);
      else if ((typeof nationOf === "function" && nationOf(club.nation) || {}).conf === "uefa") {
        cwcP += Math.min(0.12, Math.max(0, s.ovr - 90) * 0.015);
      }
      if (s.ovr >= 99) cwcP = Math.min(0.82, cwcP);
      if (canWinClubWorldCup(club, s.ovr) && rnd(s) < cwcP) trophies.push("clubworldcup");
    }
  }
  s.contQual = leaguePos <= (league.continental === "ucl" ? 4 : 3);

  /* Luva / Chuteira / Bola: só a partir de OVR 90 (temporada). Abaixo = chance zero. */
  if (s.pos === "GOL") {
    if (s.ovr >= 90) {
      var luvaNeed = s.ovr >= 95 ? Math.max(7, apps * 0.32) : Math.max(8, apps * 0.38);
      if (cs >= luvaNeed && (role === "starter" || role === "star")) awards.push("luva");
      else if (s.ovr >= 96 && (role === "starter" || role === "star") && cs >= Math.max(6, apps * 0.28) && rnd(s) < 0.55) awards.push("luva");
    }
  } else if (
    s.ovr >= 90 &&
    s.age >= 20 && s.age <= 34 &&
    (role === "starter" || role === "star")
  ) {
    var botaNeed = Math.max(10, Math.round(league.size * 0.45));
    if (s.ovr >= 96) botaNeed = Math.max(8, Math.round(league.size * 0.35));
    if (s.ovr >= 99) botaNeed = Math.max(7, Math.round(league.size * 0.28));
    /* Chuteira: artilharia + OVR; destino baixo reduz muito a chance. */
    var botaMul = destinyOf(s).botaMul != null ? destinyOf(s).botaMul : 1;
    if (goals >= botaNeed && rnd(s) < botaMul) awards.push("bota");
    else if (s.ovr >= 97 && goals >= Math.max(6, botaNeed - 4) && rnd(s) < 0.45 * botaMul) awards.push("bota");
  }
  var mvpRate = s.ovr >= 96 ? 7.0 : s.ovr >= 90 ? 7.15 : 7.3;
  if (leaguePos <= 2 && s.ovr >= 82 && (role === "star" || role === "starter") && rating >= mvpRate) awards.push("mvp");
  else if (s.ovr >= 97 && leaguePos === 1 && (role === "star" || role === "starter") && rating >= 6.9 && rnd(s) < 0.7) awards.push("mvp");

  var nt = simNational(s);
  if (nt.trophies) for (var i = 0; i < nt.trophies.length; i++) trophies.push(nt.trophies[i]);
  if (suspended) {
    apps = Math.min(apps, 1);
    goals = 0;
    assists = 0;
    cs = 0;
    ga = 0;
    saves = 0;
    rating = 5.5;
    trophies = [];
    awards = [];
    nt = { apps: 0, goals: 0, assists: 0, cs: 0, ga: 0, saves: 0, youth: false, trophies: [] };
  }

  var hasCont = trophies.indexOf("ucl") >= 0 || trophies.indexOf("libertadores") >= 0 || trophies.indexOf("worldcup") >= 0;
  /* Bola de Ouro: só OVR 90+ (temporada). Abaixo de 90 = zero chance. */
  if (s.ovr >= 90 && s.age >= 21 && s.age <= 35 && (role === "starter" || role === "star" || role === "rotation")) {
    var pBalon = 0;
    var strong = goals >= 8 || assists >= 7 || (s.pos === "GOL" && cs >= 8) || rating >= 7.3;
    var contOrTitle = hasCont || leaguePos === 1;
    if (s.ovr >= 99) {
      pBalon = (contOrTitle || strong) ? 0.96 : 0.85;
    } else if (s.ovr >= 97) {
      pBalon = contOrTitle && strong ? 0.88 : (strong || contOrTitle ? 0.70 : 0.48);
    } else if (s.ovr >= 95) {
      pBalon = contOrTitle && strong ? 0.78 : (strong || contOrTitle ? 0.55 : 0.32);
    } else if (s.ovr >= 92) {
      pBalon = contOrTitle && strong ? 0.72 : (strong || contOrTitle ? 0.50 : 0.30);
    } else {
      /* 90–91: porta de entrada do auge */
      pBalon = contOrTitle && strong ? 0.62 : (strong || contOrTitle ? 0.42 : 0.24);
    }
    if (role === "rotation") pBalon *= 0.55;
    /* Destino baixo: Bola de Ouro quase impossível; extraordinária mantém taxas atuais. */
    pBalon *= destinyOf(s).balonMul != null ? destinyOf(s).balonMul : 1;
    if (pBalon > 0 && rnd(s) < pBalon) awards.push("balon");
  }

  var delta = Math.round(developOvr(s, role, apps, league.size, inj));
  var prev = s.ovr;
  applyDeltaToAttrs(s, delta);
  s.ovr = clamp(prev + delta, 40, OVR_CAP);
  /* potencial é teto mole: no máximo +2 acima, e só por forma absurda */
  if (s.ovr > s.pot + 2) s.ovr = s.pot + 2;
  /* Destino: soft-cap de OVR (ruim ~82, medíocre ~88, muito boa ~95, extraordinária 99). */
  s.ovr = clampOvrToDestiny(s, s.ovr);
  s.pot = clampPotToDestiny(s, s.pot);
  s.peakOvr = Math.max(s.peakOvr, s.ovr);
  s.energy = clamp(s.energy + rngInt(function () { return rnd(s); }, -6, 5) - (role === "star" ? 3 : 0) + (inj > 12 ? 4 : 0), 35, 96);
  s.form = clamp(s.form + rngInt(function () { return rnd(s); }, -8, 8) + (rating >= 7.4 ? 4 : -2), 30, 96);
  s.confidence = clamp(s.confidence + (rating >= 7.2 ? 5 : rating < 6.2 ? -5 : 0), 20, 96);
  s.coach = clamp(s.coach + (role === "star" || role === "starter" ? 3 : -2), 15, 96);

  for (var t = 0; t < trophies.length; t++) addTrophy(s, trophies[t]);
  for (var a = 0; a < awards.length; a++) s.awards.push(awards[a]);

  s.career.apps += apps;
  s.career.goals += goals;
  s.career.assists += assists;
  s.career.cs += cs;
  s.career.ga += ga;
  s.career.saves = (s.career.saves || 0) + saves;
  s.caps += nt.apps;
  s.ntGoals += nt.goals;
  s.ntAssists = (s.ntAssists || 0) + (nt.assists || 0);
  s.ntCs += nt.cs;
  s.ntGa = (s.ntGa || 0) + (nt.ga || 0);
  s.ntSaves = (s.ntSaves || 0) + (nt.saves || 0);
  if (nt.youth) s.youthCaps += nt.apps;

  var onLoanSeason = !!(s.loanFrom || s.onLoan);
  if (onLoanSeason) s.loanSpell = (s.loanSpell || 0) + 1;

  if (s.loanYears > 0) {
    s.loanYears--;
    /* Fim do contrato de empréstimo: não volta sozinho — janela Retorno / definitivo / novo emp. */
    if (s.loanYears === 0 && s.loanFrom) {
      s._loanResolve = true;
      s.onLoan = true;
    }
  }

  applyMarketValue(s);
  var season = {
    age: s.age,
    year: s.year,
    clubId: s.clubId,
    role: role,
    ovr: s.ovr,
    delta: s.ovr - prev,
    value: s.value,
    apps: apps,
    goals: goals,
    assists: assists,
    rating: rating,
    cs: cs,
    ga: ga,
    saves: saves,
    leaguePos: leaguePos,
    leagueId: league.id,
    trophies: trophies.slice(),
    awards: awards.slice(),
    nt: nt,
    injuryWeeks: inj,
    suspended: suspended,
    loan: onLoanSeason,
    loanFrom: onLoanSeason ? (s.loanFrom || s.parentClubId || null) : null
  };
  if (suspended) {
    season.themeTitle = "Suspenso · temporada perdida";
    season.note = "Suspensão por substâncias — OVR mantido, jogos e títulos zerados.";
  }
  /* Promo/releg before theme so Acesso/Rebaixamento can own themeTitle */
  if (typeof resolveDivisionChange === "function" && !suspended) {
    resolveDivisionChange(s, season, club, league);
  }
  s.seasons.push(season);
  if (!s.clubs.length || s.clubs[s.clubs.length - 1].id !== s.clubId) {
    s.clubs.push({ id: s.clubId, from: s.year });
  }
  if (typeof afterSeasonFun === "function") afterSeasonFun(s, season);
  s.year++;
  s.age++;
  tickTempOvr(s);
  return season;
}

function rankFromPower(power, size, s) {
  var slot = (5.2 - power / 18) / 4.2;
  slot = clamp(slot, 0, 1);
  var pos = 1 + Math.floor(slot * (size - 1) + (rnd(s) - 0.5) * size * 0.22);
  return clamp(pos, 1, size);
}

function developOvr(s, role, apps, games, inj) {
  /* Curva justa: base cresce mesmo sem minutos; jogos aceleram; potencial puxa o teto. */
  var age = s.age;
  var lo, hi;
  if (age <= 17) { lo = 2.8; hi = 4.4; }
  else if (age <= 19) { lo = 3.0; hi = 4.8; }
  else if (age <= 21) { lo = 2.2; hi = 3.8; }
  else if (age <= 23) { lo = 1.5; hi = 2.9; }
  else if (age <= 26) { lo = 0.8; hi = 2.0; }
  else if (age <= 28) { lo = 0.25; hi = 1.25; }
  else if (age <= 30) { lo = -0.25; hi = 0.75; }
  else if (age <= 32) { lo = -0.7; hi = 0.35; }
  else if (age <= 34) { lo = -1.3; hi = -0.25; }
  else { lo = -2.1; hi = -0.7; }

  var d = lo + rnd(s) * (hi - lo);

  /* minutos: aceleram, mas a base (treino) existe para youth */
  var share = apps / Math.max(1, games);
  if (role === "youth") {
    d *= 0.9; /* ainda cresce forte na base */
    if (share < 0.15) d *= 0.92;
  } else if (role === "bench") {
    d *= 0.7 + share * 0.5;
  } else if (role === "rotation") {
    d *= 0.88 + share * 0.25;
  } else {
    d *= 0.95 + Math.min(0.2, share * 0.25);
  }

  /* longe do potencial = sobe mais; perto = freia */
  var room = s.pot - s.ovr;
  if (room > 12) d += 0.55;
  else if (room > 8) d += 0.3;
  else if (room <= 0) d = Math.min(d, 0.2);
  else if (room <= 3) d = Math.min(d, 0.7);
  else if (room <= 6) d = Math.min(d, 1.35);

  if (inj >= 16) d -= 0.6;
  else if (inj >= 8) d -= 0.25;
  if (s.form > 78) d += 0.3;
  if (s.form < 40) d -= 0.3;
  if ((role === "starter" || role === "star") && age <= 22 && room > 6 && rnd(s) < 0.14) d += 1.2;
  /* faísca rara de pico se o potencial já foi aberto (eventos de salto) */
  if (s.pot >= 94 && age >= 22 && age <= 30 && room > 2 && (role === "starter" || role === "star") && rnd(s) < 0.08) d += 1.6;
  if (typeof DEV !== "undefined" && DEV.on && DEV.on() && DEV.flags.godGrowth) {
    if (d > 0) d = d * 1.85 + 0.6;
    else d = d * 0.25;
  }
  return d;
}

function applyDeltaToAttrs(s, delta) {
  var keys = ["pac", "sho", "pas", "dri", "def", "phy"];
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var extra = 0;
    if (s.age >= 32 && (k === "pac" || k === "phy")) extra = -0.4;
    s.attrs[k] = clamp(s.attrs[k] + delta + extra, 30, 99);
  }
}

function simNational(s) {
  var nat = nationOf(s.nation);
  var cut = 74 + (nat.ntCut || 0);
  var youthCut = 58 + (nat.ntCut || 0);
  var out = { apps: 0, goals: 0, assists: 0, cs: 0, ga: 0, saves: 0, trophies: [], youth: false, team: null };
  if (s.ntNoStreak > 0) {
    s.ntNoStreak--;
    return out;
  }
  var year = s.year;
  var isWC = year % 4 === 2;
  var isCont = year % 2 === 0 && !isWC;

  var youth = s.age <= 20 && s.ovr >= youthCut && s.ovr < cut;
  var fringe = s.ovr >= cut - 2 && s.ovr < cut + 3;
  var senior = s.ovr >= cut || (s.youthCaps >= 6 && s.ovr >= cut - 4 && s.age >= 19);

  if (youth && !senior) {
    out.youth = true;
    out.team = "sub20";
    out.apps = 4 + Math.floor(rnd(s) * 5);
    if (s.pos !== "GOL") {
      out.goals = poisson(out.apps * 0.16 * ((s.ovr - 40) / 50), function () { return rnd(s); });
      out.assists = poisson(out.apps * 0.1 * ((s.ovr - 40) / 50), function () { return rnd(s); });
    } else {
      var yF = perfOvrFactor(s.ovr);
      out.cs = Math.min(out.apps, poisson(out.apps * 0.28, function () { return rnd(s); }));
      out.ga = Math.max(0, Math.round(out.apps * (1.25 - yF * 0.42) + (rnd(s) - 0.5) * 3));
      out.saves = Math.max(
        poisson(out.apps * (2.2 + yF * 1.0), function () { return rnd(s); }),
        Math.round(out.ga * 1.4)
      );
    }
    if (year % 2 === 0 && rnd(s) < 0.2) out.trophies.push("youth");
    return out;
  }
  if (!senior && !fringe) return out;
  out.team = "A";
  var starter = s.ovr >= cut + 6;
  var regular = s.ovr >= cut + 2;
  if (starter) out.apps = 7 + Math.floor(rnd(s) * 4);
  else if (regular) out.apps = 4 + Math.floor(rnd(s) * 4);
  else out.apps = 1 + Math.floor(rnd(s) * 3);
  if (isWC) out.apps += starter ? 4 : regular ? 2 : (fringe ? 1 : 0);
  if (isCont) out.apps += starter ? 3 : regular ? 1 : 0;
  if (s.pos !== "GOL") {
    var ntF = perfOvrFactor(s.ovr) * 0.72;
    out.goals = poisson(out.apps * (s.pos === "ATA" ? 0.34 : 0.12) * ntF, function () { return rnd(s); });
    out.assists = poisson(out.apps * (s.pos === "ATA" ? 0.13 : 0.14) * ntF, function () { return rnd(s); });
  } else {
    var nF = perfOvrFactor(s.ovr);
    out.cs = Math.min(out.apps, poisson(out.apps * (0.28 + nF * 0.12), function () { return rnd(s); }));
    out.ga = Math.max(0, Math.round(out.apps * (1.2 - nF * 0.4) + (rnd(s) - 0.5) * 3));
    out.saves = Math.max(
      poisson(out.apps * (2.25 + nF * 1.05), function () { return rnd(s); }),
      Math.round(out.ga * 1.4)
    );
  }
  /* NT gates = eligibility floors only; base chance rare at floor, then scales with OVR (never auto-win). */
  if (isWC && starter && s.ovr >= 86) {
    var wcP = 0.17 + (s.ovr - 86) * 0.021;
    if (s.ovr >= 95) wcP += 0.22;
    if (s.ovr >= 99) wcP += 0.26;
    if (rnd(s) < Math.min(0.90, wcP)) out.trophies.push("worldcup");
  }
  if (isCont && starter && s.ovr >= 84) {
    /* Gated ids in data: euro, copaamerica (AFCON/Asian/Gold Cup trophies not in data yet). */
    var tid = nat.conf === "uefa" ? "euro" : nat.conf === "conmebol" ? "copaamerica" : null;
    var contNatP = 0.14 + Math.max(0, s.ovr - 84) * 0.014;
    if (s.ovr >= 95) contNatP += 0.17;
    if (s.ovr >= 99) contNatP += 0.21;
    if (tid && rnd(s) < Math.min(0.85, contNatP)) out.trophies.push(tid);
  }
  return out;
}

function shouldRetire(s) {
  /* Hard stop at 40. Before that, player can choose "Aposentar" (35+) or the retire event. */
  if (s.retireForce) return true;
  if (s.age >= 40) return true;
  return false;
}

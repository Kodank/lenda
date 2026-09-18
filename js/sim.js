function simSeason(s) {
  var club = clubOf(s.clubId);
  var league = leagueOf(club.leagueId);
  var role = roleOf(s, club);
  s.role = role;
  var inj = s.injuryWeeks || 0;
  s.injuryWeeks = 0;
  var mins = ROLE_MINS[role] * (0.84 + s.energy / 550) * (1 - Math.min(0.65, inj / 40));
  var apps = Math.round(league.size * mins * (0.88 + rnd(s) * 0.24));
  var cap = league.size + (s.contQual ? 10 : 4);
  apps = clamp(apps, role === "youth" ? 2 : 5, cap);
  if (s._clubAppsMod) {
    apps = Math.max(2, Math.round(apps * 0.72));
    s._clubAppsMod = false;
  }

  var ovrF = clamp((s.ovr - 18) / 62, 0.35, 1.4);
  var formF = 0.82 + s.form / 280;
  var pr = PROD[s.pos] || PROD.MC;
  var goals = poisson(apps * pr.g * ovrF * formF, function () { return rnd(s); });
  var assists = poisson(apps * pr.a * ovrF * formF, function () { return rnd(s); });
  var cs = 0, ga = 0, rating = 6.2 + ovrF * 1.3 + (rnd(s) - 0.45);
  if (s.pos === "GOL") {
    goals = rnd(s) < 0.04 ? 1 : 0;
    assists = poisson(apps * 0.02, function () { return rnd(s); });
    cs = poisson(apps * ((pr.cs || 0.28) + ovrF * 0.18), function () { return rnd(s); });
    cs = Math.min(apps, cs);
    ga = Math.max(0, Math.round(apps * (1.35 - ovrF * 0.55) + (rnd(s) - 0.5) * 6));
    rating = 6.1 + (cs / Math.max(1, apps)) * 2.2;
  }
  rating = Math.round(clamp(rating, 5.4, 8.8) * 10) / 10;

  var power = club.level * 18 + ((role === "star" || role === "starter") ? (s.ovr - 68) * 0.4 : 0);
  power += (rnd(s) - 0.5) * 10;
  var leaguePos = rankFromPower(power, league.size, s);
  var trophies = [];
  var awards = [];
  if (leaguePos === 1) trophies.push(league.trophy || "brasileirao");
  var cupP = 0.04 + club.level * 0.03 + (role === "star" ? 0.06 : 0);
  if (rnd(s) < cupP) trophies.push("copa");
  if (s.contQual) {
    var cont = league.continental;
    var contId = cont === "lib" ? "libertadores" : cont === "ucl" ? "ucl" : cont;
    var cP = 0.03 + club.level * 0.025 + (s.ovr >= 86 ? 0.08 : 0);
    if (contId && rnd(s) < cP) {
      trophies.push(contId);
      if (rnd(s) < 0.28) trophies.push("clubworldcup");
    }
  }
  s.contQual = leaguePos <= (league.continental === "ucl" ? 4 : 3);

  if (s.pos === "GOL") {
    if (cs >= Math.max(8, apps * 0.38) && (role === "starter" || role === "star")) awards.push("luva");
  } else if (goals >= Math.max(12, Math.round(league.size * 0.55)) && role !== "youth") {
    awards.push("bota");
  }
  if (leaguePos <= 2 && s.ovr >= 82 && (role === "star" || role === "starter") && rating >= 7.3) awards.push("mvp");

  var nt = simNational(s);
  if (nt.trophies) for (var i = 0; i < nt.trophies.length; i++) trophies.push(nt.trophies[i]);

  var hasCont = trophies.indexOf("ucl") >= 0 || trophies.indexOf("libertadores") >= 0 || trophies.indexOf("worldcup") >= 0;
  if (s.ovr >= 90 && hasCont && (goals >= 18 || s.pos === "GOL" && cs >= 14) && rnd(s) < 0.45) awards.push("balon");
  else if (s.ovr >= 92 && nt.apps >= 8 && rnd(s) < 0.22) awards.push("balon");

  var delta = Math.round(developOvr(s, role, apps, league.size, inj));
  var prev = s.ovr;
  applyDeltaToAttrs(s, delta);
  s.ovr = clamp(prev + delta, 40, OVR_CAP);
  /* potencial é teto mole: no máximo +2 acima, e só por forma absurda */
  if (s.ovr > s.pot + 2) s.ovr = s.pot + 2;
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
  s.caps += nt.apps;
  s.ntGoals += nt.goals;
  s.ntCs += nt.cs;
  if (nt.youth) s.youthCaps += nt.apps;

  if (s.loanYears > 0) {
    s.loanYears--;
    if (s.loanYears === 0 && s.loanFrom) {
      s.clubId = s.loanFrom;
      s.loanFrom = null;
    }
  }

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
    leaguePos: leaguePos,
    leagueId: league.id,
    trophies: trophies.slice(),
    awards: awards.slice(),
    nt: nt,
    injuryWeeks: inj
  };
  s.seasons.push(season);
  if (!s.clubs.length || s.clubs[s.clubs.length - 1].id !== s.clubId) {
    s.clubs.push({ id: s.clubId, from: s.year });
  }
  s.value = marketValue(s);
  s.year++;
  s.age++;
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
  var out = { apps: 0, goals: 0, cs: 0, trophies: [], youth: false, team: null };
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
    if (s.pos !== "GOL") out.goals = poisson(out.apps * 0.16 * ((s.ovr - 40) / 50), function () { return rnd(s); });
    else out.cs = poisson(out.apps * 0.28, function () { return rnd(s); });
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
  if (s.pos !== "GOL") out.goals = poisson(out.apps * (s.pos === "ATA" ? 0.32 : 0.12) * ((s.ovr - 50) / 45), function () { return rnd(s); });
  else out.cs = poisson(out.apps * 0.3, function () { return rnd(s); });
  if (isWC && starter && s.ovr >= 84 && rnd(s) < 0.16 + (s.ovr - 84) * 0.015) out.trophies.push("worldcup");
  if (isCont && starter && s.ovr >= 80) {
    var tid = nat.conf === "uefa" ? "euro" : nat.conf === "conmebol" ? "copaamerica" : null;
    if (tid && rnd(s) < 0.18) out.trophies.push(tid);
  }
  return out;
}

function shouldRetire(s) {
  if (s.retireForce) return true;
  if (s.age >= 40) return true;
  if (s.age >= 38 && s.ovr < 64) return true;
  if (s.age >= 36 && s.extraYears <= 0 && s.ovr < 68) return true;
  if (s.age >= 34 && s.extraYears <= 0 && s.ovr < 62 && rnd(s) < 0.35) return true;
  return false;
}

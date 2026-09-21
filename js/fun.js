/* Lenda fun packs: drama / narrativa (no market negotiation packs 5–6) */

/* Explicit clássicos; fallback = same city + close level */
var DERBY_PAIR = {
  fla: "flu", flu: "fla",
  vas: "bot", bot: "vas",
  cor: "pal", pal: "cor",
  sao: "cor",
  gre: "inter", inter: "gre",
  cam: "cru", cru: "cam",
  rma: "fcb", fcb: "rma",
  liv: "eve", eve: "liv",
  mun: "mci", mci: "mun",
  ars: "tot", tot: "ars",
  mil: "intm", intm: "mil",
  rom: "laz", laz: "rom",
  juv: "intm",
  atm: "rma",
  ben: "spo", spo: "ben"
};

var SEASON_THEMES = {
  breakthrough: ["O ano da virada", "A temporada da explosão", "Quando tudo encaixou"],
  titles: ["O ano dos títulos", "Temporada de conquista", "A prateleira encheu"],
  awards: ["O ano do individual", "Temporada de prêmios", "Holofote no peito"],
  nt: ["Herói da seleção", "Verão de seleção", "A camisa pesada"],
  injury: ["O ano da cicatriz", "Temporada no hospital", "Corpo pediu trégua"],
  derby: ["Guerra civil", "Ano de clássico", "Derby no sangue"],
  farewell: ["A despedida", "Última volta olímpica", "Tour de adeus"],
  decline: ["O ano do freio", "Temporada de gestão", "Menos fogo, mais cabeça"],
  crisis: ["Ano de crise", "Temporada no fio", "O barco balançou"],
  solid: ["Temporada sólida", "Ano de trabalho", "Sem holofote, com entrega"],
  suspended: ["Suspenso · temporada perdida", "Ano da banimento", "Fora do gramado"]
};

function derbyOf(clubId) {
  if (!clubId) return null;
  if (DERBY_PAIR[clubId]) return DERBY_PAIR[clubId];
  var me = clubOf(clubId);
  if (!me || !me.city) return null;
  var best = null;
  var bestDiff = 99;
  for (var i = 0; i < CLUBS.length; i++) {
    var c = CLUBS[i];
    if (c.id === clubId) continue;
    if (c.city !== me.city) continue;
    if (c.leagueId !== me.leagueId) continue;
    var d = Math.abs((c.level || 3) - (me.level || 3));
    if (d < bestDiff) { bestDiff = d; best = c.id; }
  }
  return best;
}

function applyDerbySeason(s, season) {
  var vs = derbyOf(s.clubId);
  if (!vs) return;
  if (rnd(s) > 0.42) return;
  var won = rnd(s) < (0.45 + (effectiveOvr(s) - 70) * 0.008);
  var crisis = (s.form || 50) < 42 || (s.confidence || 50) < 38;
  season.derby = {
    vs: vs,
    won: won ? 1 : 0,
    crisis: crisis ? 1 : 0
  };
  if (won) {
    s.form = clamp(s.form + (crisis ? 8 : 5), 20, 100);
    s.confidence = clamp(s.confidence + 4, 15, 100);
    if (rnd(s) < 0.28) addTempOvr(s, { delta: 1, seasons: 1 });
  } else {
    s.form = clamp(s.form - (crisis ? 8 : 4), 20, 100);
    s.confidence = clamp(s.confidence - 3, 15, 100);
    if (crisis && rnd(s) < 0.35) addTempOvr(s, { delta: -1, seasons: 1 });
  }
}

function tournamentPathFlavor(s, kind, won, apps, starter) {
  /* kind: worldcup | euro | copaamerica */
  if (!apps) return null;
  var roll = rnd(s);
  var stage;
  if (won) stage = "champion";
  else if (!starter && apps <= 2) stage = "bench";
  else if (roll < 0.18) stage = "group";
  else if (roll < 0.38) stage = "r16";
  else if (roll < 0.58) stage = "qf";
  else if (roll < 0.78) stage = "sf";
  else stage = "final";

  var labels = {
    worldcup: {
      champion: "Campeão do Mundo — herói da nação",
      final: "Final da Copa — prata no peito",
      sf: "Semifinal da Copa — quase o sonho",
      qf: "Quartas da Copa — eliminação amarga",
      r16: "Oitavas da Copa — curto demais",
      group: "Eliminado na fase de grupos",
      bench: "Na lista, pouco tempo de bola"
    },
    euro: {
      champion: "Campeão da Euro — noite eterna",
      final: "Final da Euro — um passo",
      sf: "Semi da Euro — lágrimas no vestiário",
      qf: "Quartas da Euro — adeus cedo",
      r16: "Oitavas da Euro — viagem curta",
      group: "Eliminado na fase de grupos",
      bench: "Convocado, quase espectador"
    },
    copaamerica: {
      champion: "Campeão da Copa América",
      final: "Final da Copa América",
      sf: "Semi da Copa América",
      qf: "Quartas da Copa América",
      r16: "Oitavas da Copa América",
      group: "Eliminado na fase de grupos",
      bench: "Na lista, poucos minutos"
    }
  };
  var pack = labels[kind] || labels.worldcup;
  return { stage: stage, text: pack[stage] || pack.group };
}

function enhanceNationalStory(s, nt) {
  if (!nt || !nt.apps) return nt;
  var year = s.year;
  var isWC = year % 4 === 2;
  var isCont = year % 2 === 0 && !isWC;
  var starter = (s.ovr || 0) >= (nationOf(s.nation).ntCut || 0) + 74 + 6;
  /* approximate starter from apps already set */
  starter = nt.apps >= 8 || (nt.apps >= 5 && (s.ovr || 0) >= 82);
  var wonWC = (nt.trophies || []).indexOf("worldcup") >= 0;
  var wonEuro = (nt.trophies || []).indexOf("euro") >= 0;
  var wonCA = (nt.trophies || []).indexOf("copaamerica") >= 0;
  if (isWC && !nt.youth) {
    nt.path = tournamentPathFlavor(s, "worldcup", wonWC, nt.apps, starter);
  } else if (isCont && !nt.youth) {
    var nat = nationOf(s.nation);
    var kind = nat.conf === "uefa" ? "euro" : nat.conf === "conmebol" ? "copaamerica" : null;
    if (kind) {
      var won = kind === "euro" ? wonEuro : wonCA;
      nt.path = tournamentPathFlavor(s, kind, won, nt.apps, starter);
    }
  }
  return nt;
}

function isFarewellWindow(s) {
  if (!s) return false;
  if (s.age >= 37) return true;
  if (s.age >= 36 && (s.extraYears || 0) === 0) return true;
  return false;
}

function buildFarewellEvent(s) {
  var club = clubOf(s.clubId);
  return {
    id: "farewell",
    title: "Tour de despedida",
    text: "O " + club.name + " prepara a volta olímpica. A torcida quer uma última noite — e o legado pede presença.",
    theme: "retire",
    a: {
      label: "Abraçar a despedida",
      hint: "Eventos especiais · bônus de legado",
      theme: "retire",
      fx: { loyalty: 8, confidence: 6, farewellTour: 1 }
    },
    b: {
      label: "Tratar como temporada normal",
      hint: "Menos holofote",
      theme: "focus",
      fx: { discipline: 4, energy: 4 }
    }
  };
}

function pickSeasonTheme(s, season) {
  if (season.themeTitle) return season.themeTitle;
  var pool;
  if (season.suspended) pool = SEASON_THEMES.suspended;
  else if (season.farewell) pool = SEASON_THEMES.farewell;
  else if (season.nt && season.nt.path && (season.nt.path.stage === "champion" || season.nt.path.stage === "final" || season.nt.path.stage === "sf")) pool = SEASON_THEMES.nt;
  else if ((season.injuryWeeks || 0) >= 12) pool = SEASON_THEMES.injury;
  else if ((season.awards || []).length) pool = SEASON_THEMES.awards;
  else if ((season.trophies || []).length >= 1) pool = SEASON_THEMES.titles;
  else if (season.derby) pool = SEASON_THEMES.derby;
  else if ((season.delta || 0) >= 3) pool = SEASON_THEMES.breakthrough;
  else if ((season.delta || 0) <= -2) pool = SEASON_THEMES.decline;
  else if ((s.form || 50) < 40) pool = SEASON_THEMES.crisis;
  else pool = SEASON_THEMES.solid;
  var title = pool[Math.floor(rnd(s) * pool.length)];
  season.themeTitle = title;
  return title;
}

function miniRelatoFor(s, ev, side) {
  var ch = ev && ev[side];
  var out = s && s._lastOutcome;
  /* Risco já vira .risk-toast no relatório — nunca duplicar o mesmo texto no mini-relato. */
  if (s && s._lastRisk && s._lastRisk.text) return "";
  var label = (ch && ch.label) || (out && out.label) || "a escolha";
  var bits = [
    "A decisão ficou: " + label + ".",
    "Você fechou com " + label.toLowerCase() + ".",
    "No vestiário, o eco foi imediato.",
    "A torcida já tinha opinião formada.",
    "Uma linha no caderno do técnico mudou o clima."
  ];
  if (out && out.pills && out.pills.length) {
    var ovrPill = null;
    for (var i = 0; i < out.pills.length; i++) {
      if (/\bOVR\b/i.test(out.pills[i].text || "")) { ovrPill = out.pills[i].text; break; }
    }
    if (ovrPill) return "A conta bateu no placar: " + ovrPill + ".";
  }
  if (ev && ev.id === "farewell") return "A despedida ganhou um capítulo a mais.";
  return bits[Math.floor(((s && s.rndI) || 0) % bits.length)];
}

function afterSeasonFun(s, season) {
  applyDerbySeason(s, season);
  if (season.nt) enhanceNationalStory(s, season.nt);
  if (s._farewellTour) {
    season.farewell = 1;
    s._farewellTour = Math.max(0, (s._farewellTour || 0) - 1);
  }
  pickSeasonTheme(s, season);
}

function farewellLegacyBonus(s) {
  if (!s) return 0;
  var n = 0;
  var seasons = s.seasons || [];
  for (var i = 0; i < seasons.length; i++) if (seasons[i].farewell) n++;
  return n ? clamp(n * 3 + 2, 0, 8) : 0;
}

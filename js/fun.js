/* Lenda fun packs: drama / narrativa / meta (no market negotiation packs 5–6) */

var RIVAL_FIRST = [
  "Diego", "Lucas", "Mateo", "Thiago", "Gabriel", "Rafael", "Bruno", "Enzo",
  "João", "Pedro", "André", "Felipe", "Caio", "Murilo", "Igor", "Leandro",
  "Kai", "Noah", "Liam", "Omar", "Yusuf", "Kenji", "Hugo", "Nico"
];
var RIVAL_LAST = [
  "Silva", "Costa", "Santos", "Oliveira", "Ramos", "Vargas", "Mendes", "Rocha",
  "Alves", "Nunes", "Ferro", "Lima", "Souza", "Diaz", "Torres", "Cruz",
  "Berg", "Vogel", "Sato", "Kim", "Hassan", "Moreira", "Pinto", "Barros"
];

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
  rival: ["Sombra do rival", "Briga de posição", "Ano de pressão"],
  suspended: ["Suspenso · temporada perdida", "Ano da banimento", "Fora do gramado"]
};

var CAREER_GOAL_POOL = [
  { id: "ovr90", label: "Chegar a 90 OVR", check: function (s) { return s.peakOvr >= 90; }, reward: { pot: 1, confidence: 6 } },
  { id: "ovr85", label: "Chegar a 85 OVR", check: function (s) { return s.peakOvr >= 85; }, reward: { confidence: 5 } },
  { id: "lib", label: "Ganhar a Libertadores", check: function (s) { return countTrophy(s, "libertadores") >= 1; }, reward: { confidence: 8, ambition: 4 } },
  { id: "ucl", label: "Ganhar a Champions", check: function (s) { return countTrophy(s, "ucl") >= 1; }, reward: { confidence: 8, ambition: 4 } },
  { id: "wc", label: "Ser campeão do Mundo", check: function (s) { return countTrophy(s, "worldcup") >= 1; }, reward: { confidence: 10, ambition: 6 } },
  { id: "balon", label: "Vencer a Bola de Ouro", check: function (s) { return (s.awards || []).indexOf("balon") >= 0; }, reward: { confidence: 10 } },
  { id: "caps30", label: "Fazer 30 jogos pela seleção", check: function (s) { return (s.caps || 0) >= 30; }, reward: { ambition: 5 } },
  { id: "league3", label: "Ser tricampeão da liga", check: function (s) {
    var n = 0;
    var t = (s.career && s.career.trophies) || [];
    for (var i = 0; i < t.length; i++) {
      var m = trophyOf(t[i]);
      if (m && m.kind === "league") n++;
    }
    return n >= 3;
  }, reward: { loyalty: 6, confidence: 4 } },
  { id: "loyal", label: "200 jogos no mesmo clube", check: function (s) {
    var m = clubAppsMap(s);
    return m.length && m[0].apps >= 200;
  }, reward: { loyalty: 10 } },
  { id: "goals100", label: "Marcar 100 gols na carreira", check: function (s) {
    return s.pos === "GOL" ? (s.career.cs || 0) >= 80 : (s.career.goals || 0) >= 100;
  }, reward: { confidence: 6 } }
];

function pickRivalName(s) {
  var f = RIVAL_FIRST[Math.floor(rnd(s) * RIVAL_FIRST.length)];
  var l = RIVAL_LAST[Math.floor(rnd(s) * RIVAL_LAST.length)];
  var full = (f + " " + l).toUpperCase();
  if (full.indexOf(String(s.name || "").toUpperCase()) >= 0) {
    l = RIVAL_LAST[(RIVAL_LAST.indexOf(l) + 3) % RIVAL_LAST.length];
    full = (f + " " + l).toUpperCase();
  }
  return full;
}

function ensureRival(s) {
  if (!s || s.rival) return s && s.rival;
  var base = clamp((s.ovr || 50) + Math.floor(rnd(s) * 5) - 1, 48, 78);
  s.rival = {
    name: pickRivalName(s),
    pos: s.pos,
    ovr: base,
    pot: clamp(base + 8 + Math.floor(rnd(s) * 10), 82, 97),
    awards: 0,
    pressure: 0,
    clubId: null,
    bornYear: s.year || START_YEAR
  };
  return s.rival;
}

function tickRival(s) {
  var r = ensureRival(s);
  if (!r) return;
  var ageR = 16 + ((s.year || START_YEAR) - (r.bornYear || START_YEAR));
  var d;
  if (ageR <= 21) d = 1.5 + rnd(s) * 2.2;
  else if (ageR <= 26) d = 0.6 + rnd(s) * 1.6;
  else if (ageR <= 30) d = -0.2 + rnd(s) * 1.1;
  else d = -0.8 + rnd(s) * 0.6;
  if (r.ovr < r.pot - 4) d += 0.35;
  if (r.ovr >= r.pot) d = Math.min(d, 0.25);
  r.ovr = clamp(Math.round(r.ovr + d), 45, OVR_CAP);
  /* titularidade pressure when rival is close */
  var gap = (s.ovr || 50) - r.ovr;
  if (Math.abs(gap) <= 3 && (s.role === "starter" || s.role === "star" || s.role === "rotation")) {
    r.pressure = clamp((r.pressure || 0) + (gap <= 0 ? 2 : 1), 0, 10);
  } else {
    r.pressure = clamp((r.pressure || 0) - 1, 0, 10);
  }
  if (rnd(s) < 0.08 && r.ovr >= 82) r.awards = (r.awards || 0) + 1;
}

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

function buildRivalEvent(s) {
  var r = ensureRival(s);
  var gap = (s.ovr || 50) - (r.ovr || 50);
  var press = r.pressure || 0;
  if (press >= 4 || Math.abs(gap) <= 2) {
    return {
      id: "rivalspot",
      title: "Sombra na posição",
      text: r.name + " (" + r.ovr + " OVR) briga pela mesma camisa. O técnico fala em rodízio.",
      theme: "rival",
      a: {
        label: "Assumir a briga",
        hint: "Pressão · chance de OVR",
        theme: "rival",
        fx: {
          ambition: 5,
          energy: -6,
          risk: {
            p: 0.58,
            win: { ovr: 1, confidence: 8, form: 6 },
            lose: { confidence: -6, form: -6, tempOvr: { delta: -1, seasons: 1 } },
            winText: "Você fechou a posição. " + r.name + " foi ao banco.",
            loseText: r.name + " roubou a titularidade por algumas semanas."
          }
        }
      },
      b: {
        label: "Dividir minutos",
        hint: "Menos risco",
        theme: "safe",
        fx: { discipline: 4, energy: 4, loyalty: 2 }
      }
    };
  }
  return {
    id: "rivalaward",
    title: "Corrida de prêmios",
    text: "A imprensa coloca você e " + r.name + " na mesma lista de melhores da temporada.",
    theme: "media",
    a: {
      label: "Caçar o prêmio",
      hint: "Ambiente esquenta",
      theme: "media",
      fx: {
        ambition: 6,
        form: 4,
        risk: {
          p: 0.5,
          win: { confidence: 8, ovr: 1 },
          lose: { confidence: -4, energy: -6 },
          winText: "Você levou a manchete. " + r.name + " ficou na sombra.",
          loseText: r.name + " levou o holofote desta vez."
        }
      }
    },
    b: {
      label: "Focar no coletivo",
      hint: "Vestiário agradece",
      theme: "captain",
      fx: { loyalty: 6, coach: 4 }
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
  else if (season.rivalNote) pool = SEASON_THEMES.rival;
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
  var risk = s && s._lastRisk;
  if (risk && risk.text) return String(risk.text).slice(0, 120);
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
  if (ev && (ev.id === "rivalspot" || ev.id === "rivalaward") && s.rival) {
    return "A sombra de " + s.rival.name + " ficou mais nítida.";
  }
  return bits[Math.floor(((s && s.rndI) || 0) % bits.length)];
}

function ensureCareerGoals(s) {
  if (!s) return [];
  if (s.goals && s.goals.length >= 2) return s.goals;
  var have = (s.goals || []).slice();
  var haveIds = {};
  for (var h = 0; h < have.length; h++) haveIds[have[h].id] = 1;
  var pool = CAREER_GOAL_POOL.slice();
  var out = have.slice();
  var n = 2;
  while (out.length < n && pool.length) {
    var i = Math.floor(rnd(s) * pool.length);
    var g = pool.splice(i, 1)[0];
    if (haveIds[g.id]) continue;
    /* skip impossible-ish early filters lightly */
    if (g.id === "lib" && nationOf(s.nation).conf === "uefa" && rnd(s) < 0.5) continue;
    if (g.id === "ucl" && nationOf(s.nation).conf === "conmebol" && rnd(s) < 0.35) continue;
    out.push({ id: g.id, label: g.label, done: 0 });
    haveIds[g.id] = 1;
  }
  s.goals = out;
  return out;
}

function checkCareerGoals(s) {
  var list = ensureCareerGoals(s);
  var newly = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].done) continue;
    var def = null;
    for (var j = 0; j < CAREER_GOAL_POOL.length; j++) {
      if (CAREER_GOAL_POOL[j].id === list[i].id) { def = CAREER_GOAL_POOL[j]; break; }
    }
    if (!def || !def.check(s)) continue;
    list[i].done = 1;
    newly.push(list[i]);
    var fx = def.reward || {};
    if (fx.loyalty) touchTrait(s.traits, "loyalty", fx.loyalty);
    if (fx.ambition) touchTrait(s.traits, "ambition", fx.ambition);
    if (fx.confidence) s.confidence = clamp(s.confidence + fx.confidence, 15, 100);
    if (fx.pot) s.pot = clampPotToDestiny(s, (s.pot || 88) + fx.pot);
  }
  if (newly.length) s._goalToast = newly.map(function (g) { return g.label; }).join(" · ");
  return newly;
}

function afterSeasonFun(s, season) {
  ensureRival(s);
  tickRival(s);
  applyDerbySeason(s, season);
  if (s.rival && Math.abs((s.ovr || 0) - s.rival.ovr) <= 4) {
    season.rivalNote = s.rival.name + " " + s.rival.ovr + " OVR";
  }
  if (season.nt) enhanceNationalStory(s, season.nt);
  if (s._farewellTour) {
    season.farewell = 1;
    s._farewellTour = Math.max(0, (s._farewellTour || 0) - 1);
  }
  pickSeasonTheme(s, season);
  checkCareerGoals(s);
}

function farewellLegacyBonus(s) {
  if (!s) return 0;
  var n = 0;
  var seasons = s.seasons || [];
  for (var i = 0; i < seasons.length; i++) if (seasons[i].farewell) n++;
  return n ? clamp(n * 3 + 2, 0, 8) : 0;
}

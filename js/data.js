var SAVE_KEY = "lenda_v1";
var START_YEAR = 2026;
var OVR_CAP = 99;
var START_OVR = 50;
var START_AGE = 16;

/*
 * Destino oculto da carreira (rolado 1x no create).
 * Não aparece na UI normal — só tetos/portas; escolhas ainda importam dentro da faixa.
 * Pesos: 25% ruim · 35% medíocre · 25% muito boa · 15% extraordinária.
 */
var DESTINY_IDS = ["ruim", "mediocre", "muito_boa", "extraordinaria"];
var DESTINY = {
  ruim: {
    id: "ruim",
    label: "Ruim",
    weight: 25,
    potLo: 78,
    potHi: 82,
    potMax: 82,
    ovrSoftCap: 82,
    maxStage: "open",
    maxClubLevel: 4.15,
    top10Mul: 0.04,
    top5Mul: 0,
    wonderkidMul: 0.12,
    balonMul: 0.04,
    botaMul: 0.2,
    rareMul: 0.35,
    breakMul: 0.4
  },
  mediocre: {
    id: "mediocre",
    label: "Medíocre",
    weight: 35,
    potLo: 84,
    potHi: 88,
    potMax: 88,
    ovrSoftCap: 88,
    maxStage: "world",
    maxClubLevel: 4.55,
    top10Mul: 0.28,
    top5Mul: 0.05,
    wonderkidMul: 0.35,
    balonMul: 0.12,
    botaMul: 0.4,
    rareMul: 0.55,
    breakMul: 0.6
  },
  muito_boa: {
    id: "muito_boa",
    label: "Muito boa",
    weight: 25,
    potLo: 90,
    potHi: 95,
    potMax: 95,
    ovrSoftCap: 95,
    maxStage: "elite",
    maxClubLevel: 5,
    top10Mul: 1,
    top5Mul: 0.62,
    wonderkidMul: 1,
    balonMul: 0.85,
    botaMul: 0.9,
    rareMul: 1,
    breakMul: 1
  },
  extraordinaria: {
    id: "extraordinaria",
    label: "Extraordinária",
    weight: 15,
    potLo: 94,
    potHi: 99,
    potMax: 99,
    ovrSoftCap: 99,
    maxStage: "elite",
    maxClubLevel: 5,
    top10Mul: 1.15,
    top5Mul: 1,
    wonderkidMul: 1.1,
    balonMul: 1,
    botaMul: 1,
    rareMul: 1.15,
    breakMul: 1
  }
};


var PACE = {
  intensa: { n: 1, label: "Intensa", hint: "Uma decisão por temporada" },
  normal: { n: 2, label: "Normal", hint: "Uma decisão a cada duas temporadas" },
  rapido: { n: 3, label: "Rápido", hint: "Menos eventos · foco em mercado e títulos" },
  expressa: { n: 3, label: "Expressa", hint: "Uma decisão a cada três temporadas" }
};

var POS = {
  ATA: { name: "Atacante", short: "ATA", line: "ata" },
  PE: { name: "Ponta esquerda", short: "PE", line: "ata" },
  PD: { name: "Ponta direita", short: "PD", line: "ata" },
  MEI: { name: "Meia-atacante", short: "MEI", line: "mei" },
  MC: { name: "Meio-campo", short: "MC", line: "mei" },
  VOL: { name: "Volante", short: "VOL", line: "mei" },
  LE: { name: "Lateral esquerdo", short: "LE", line: "def" },
  LD: { name: "Lateral direito", short: "LD", line: "def" },
  ZAG: { name: "Zagueiro", short: "ZAG", line: "def" },
  GOL: { name: "Goleiro", short: "GOL", line: "gol" }
};

var PITCH = [
  { pos: "PE", x: 18, y: 16 },
  { pos: "ATA", x: 50, y: 10 },
  { pos: "PD", x: 82, y: 16 },
  { pos: "MEI", x: 50, y: 36 },
  { pos: "VOL", x: 30, y: 50 },
  { pos: "MC", x: 70, y: 50 },
  { pos: "LE", x: 16, y: 68 },
  { pos: "ZAG", x: 50, y: 72 },
  { pos: "LD", x: 84, y: 68 },
  { pos: "GOL", x: 50, y: 90 }
];

var WEIGHTS = {
  ATA: { pac: 0.15, sho: 0.35, pas: 0.1, dri: 0.15, def: 0.05, phy: 0.2 },
  PE: { pac: 0.25, sho: 0.2, pas: 0.15, dri: 0.25, def: 0.05, phy: 0.1 },
  PD: { pac: 0.25, sho: 0.2, pas: 0.15, dri: 0.25, def: 0.05, phy: 0.1 },
  MEI: { pac: 0.15, sho: 0.15, pas: 0.3, dri: 0.25, def: 0.05, phy: 0.1 },
  MC: { pac: 0.15, sho: 0.1, pas: 0.25, dri: 0.15, def: 0.2, phy: 0.15 },
  VOL: { pac: 0.1, sho: 0.05, pas: 0.2, dri: 0.1, def: 0.3, phy: 0.25 },
  LE: { pac: 0.25, sho: 0.05, pas: 0.15, dri: 0.15, def: 0.25, phy: 0.15 },
  LD: { pac: 0.25, sho: 0.05, pas: 0.15, dri: 0.15, def: 0.25, phy: 0.15 },
  ZAG: { pac: 0.1, sho: 0.05, pas: 0.15, dri: 0.05, def: 0.35, phy: 0.3 },
  GOL: { pac: 0.08, sho: 0.02, pas: 0.15, dri: 0.05, def: 0.4, phy: 0.3 }
};

var PROD = {
  ATA: { g: 0.42, a: 0.16 },
  PE: { g: 0.26, a: 0.26 },
  PD: { g: 0.26, a: 0.26 },
  MEI: { g: 0.18, a: 0.3 },
  MC: { g: 0.08, a: 0.16 },
  VOL: { g: 0.04, a: 0.1 },
  LE: { g: 0.05, a: 0.15 },
  LD: { g: 0.05, a: 0.15 },
  ZAG: { g: 0.04, a: 0.04 },
  GOL: { g: 0, a: 0.02, cs: 0.3 }
};

var ROLE_MINS = { youth: 0.16, bench: 0.3, rotation: 0.55, starter: 0.90, star: 0.98 };
var ROLE_NAME = { youth: "base", bench: "banco", rotation: "rodízio", starter: "titular", star: "estrela" };

var TROPHIES = {
  /* Ligas */
  brasileirao: { name: "Brasileirão", img: "img/trophies/brasileirao.png", kind: "league", w: 6 },
  serie_b: { name: "Série B", img: "img/trophies/serie_b.png", kind: "league", w: 3 },
  premier: { name: "Premier League", img: "img/trophies/premier.png", kind: "league", w: 8 },
  laliga: { name: "La Liga", img: "img/trophies/laliga.png", kind: "league", w: 8 },
  seriea: { name: "Serie A", img: "img/trophies/seriea.png", kind: "league", w: 8 },
  bundesliga: { name: "Bundesliga", img: "img/trophies/bundesliga.png", kind: "league", w: 8 },
  ligue1: { name: "Ligue 1", img: "img/trophies/ligue1.png", kind: "league", w: 8 },
  primerliga: { name: "Primeira Liga", img: "img/trophies/primerliga.png", kind: "league", w: 6 },
  ligapro: { name: "Liga Profesional", img: "img/trophies/ligapro.png", kind: "league", w: 5 },
  eredivisie: { name: "Eredivisie", img: "img/trophies/eredivisie.png", kind: "league", w: 5 },
  liga_mx: { name: "Liga MX", img: "img/trophies/liga_mx.png", kind: "league", w: 5 },
  mls: { name: "MLS Cup", img: "img/trophies/mls.png", kind: "league", w: 4 },
  j1: { name: "J1 League", img: "img/trophies/j1.png?v=sub20-hq-1", kind: "league", w: 4 },
  uruprimera: { name: "Primera División", img: "img/trophies/uruprimera.png?v=sub20-hq-1", kind: "league", w: 4 },
  colbetplay: { name: "Liga BetPlay", img: "img/trophies/colbetplay.png", kind: "league", w: 4 },
  npfl: { name: "NPFL", img: "img/trophies/npfl.png", kind: "league", w: 3 },
  senliga: { name: "Ligue 1 Sénégal", img: "img/trophies/senliga.png", kind: "league", w: 3 },
  proleague: { name: "Pro League", img: "img/trophies/proleague.png", kind: "league", w: 5 },
  superlig: { name: "Süper Lig", img: "img/trophies/superlig.png", kind: "league", w: 5 },
  scottish: { name: "Premiership", img: "img/trophies/scottish.png", kind: "league", w: 4 },
  /* Copas nacionais */
  copa: { name: "Copa nacional", img: "img/trophies/copa.png", kind: "cup", w: 4 },
  copa_br: { name: "Copa do Brasil", img: "img/trophies/copa_br.png", kind: "cup", w: 4 },
  fa_cup: { name: "FA Cup", img: "img/trophies/fa_cup.png", kind: "cup", w: 5 },
  copa_rey: { name: "Copa del Rey", img: "img/trophies/copa_rey.png", kind: "cup", w: 5 },
  coppa_ita: { name: "Coppa Italia", img: "img/trophies/coppa_ita.png", kind: "cup", w: 5 },
  dfb_pokal: { name: "DFB-Pokal", img: "img/trophies/dfb_pokal.png", kind: "cup", w: 5 },
  coupe_fr: { name: "Coupe de France", img: "img/trophies/coupe_fr.png", kind: "cup", w: 5 },
  taca_pt: { name: "Taça de Portugal", img: "img/trophies/taca_pt.png", kind: "cup", w: 4 },
  copa_arg: { name: "Copa Argentina", img: "img/trophies/copa_arg.png", kind: "cup", w: 4 },
  /* Continentais / seleção */
  libertadores: { name: "Libertadores", img: "img/trophies/libertadores.png", kind: "continental", w: 10 },
  ucl: { name: "Champions League", img: "img/trophies/ucl.png", kind: "continental", w: 12 },
  clubworldcup: { name: "Mundial de Clubes", img: "img/trophies/clubworldcup.png?v=indiv-hq-1", kind: "continental", w: 8 },
  worldcup: { name: "Copa do Mundo", img: "img/trophies/worldcup.png", kind: "nt", w: 16 },
  copaamerica: { name: "Copa América", img: "img/trophies/copaamerica.png?v=ca2", kind: "nt", w: 9 },
  euro: { name: "Eurocopa", img: "img/trophies/euro.png", kind: "nt", w: 9 },
  youth: { name: "Título Sub-20", img: "img/trophies/youth.png?v=sub20-hq-1", kind: "nt", w: 2 },
  balon: { name: "Bola de Ouro", img: "img/trophies/balon.png?v=indiv-hq-1", kind: "indiv", w: 14 },
  bota: { name: "Chuteira de Ouro", img: "img/trophies/bota.png?v=indiv-hq-1", kind: "indiv", w: 5 },
  luva: { name: "Luva de Ouro", img: "img/trophies/luva.png?v=indiv-hq-1", kind: "indiv", w: 5 },
  mvp: { name: "Melhor do campeonato", img: "img/trophies/mvp.png?v=indiv-hq-1", kind: "indiv", w: 4 }
};

/* Copa nacional por país (fallback: copa) */
var NATION_CUP = {
  br: "copa_br", en: "fa_cup", es: "copa_rey", it: "coppa_ita", de: "dfb_pokal",
  fr: "coupe_fr", pt: "taca_pt", ar: "copa_arg", uy: "copa", co: "copa", mx: "copa",
  nl: "copa", us: "copa", jp: "copa", ng: "copa", sn: "copa", be: "copa", tr: "copa", sct: "copa"
};

/* NT photo shirts + real home-kit lettering ink (name/number) */
var NATION_SHIRT = {
  br: { shirt: "img/shirts/br.png", ink: "#186531", inkShadow: "rgba(0,0,0,.22)" },
  ar: { shirt: "img/shirts/ar.png", ink: "#111111", inkShadow: "rgba(255,255,255,.18)" },
  uy: { shirt: "img/shirts/uy.png", ink: "#111111", inkShadow: "rgba(255,255,255,.15)" },
  co: { shirt: "img/shirts/co.png", ink: "#0D1B2A", inkShadow: "rgba(255,255,255,.12)" },
  mx: { shirt: "img/shirts/mx.png", ink: "#FFFFFF", inkShadow: "rgba(0,0,0,.35)" },
  pt: { shirt: "img/shirts/pt.png", ink: "#FFFFFF", inkShadow: "rgba(0,0,0,.35)" },
  es: { shirt: "img/shirts/es.png", ink: "#F1BF00", inkShadow: "rgba(0,0,0,.35)" },
  en: { shirt: "img/shirts/en.png", ink: "#0A1E46", inkShadow: "rgba(255,255,255,.2)" },
  fr: { shirt: "img/shirts/fr.png", ink: "#FFFFFF", inkShadow: "rgba(0,0,0,.35)" },
  it: { shirt: "img/shirts/it.png", ink: "#FFFFFF", inkShadow: "rgba(0,0,0,.35)" },
  de: { shirt: "img/shirts/de.png", ink: "#111111", inkShadow: "rgba(255,255,255,.2)" },
  nl: { shirt: "img/shirts/nl.png", ink: "#FFFFFF", inkShadow: "rgba(0,0,0,.3)" },
  us: { shirt: "img/shirts/us.png", ink: "#002868", inkShadow: "rgba(255,255,255,.2)" },
  jp: { shirt: "img/shirts/jp.png", ink: "#FFFFFF", inkShadow: "rgba(0,0,0,.35)" },
  ng: { shirt: "img/shirts/ng.png", ink: "#FFFFFF", inkShadow: "rgba(0,0,0,.35)" },
  sn: { shirt: "img/shirts/sn.png", ink: "#00853F", inkShadow: "rgba(255,255,255,.2)" }
};



var EVENTS = [
  { id: "giant", title: "O gigante ligou", text: "Um clube da elite europeia oferece contrato. O salário explode. Os minutos, ninguém garante.", when: { minOvr: 78, minAge: 19, maxAge: 29 }, a: { label: "Assinar com o gigante", hint: "Holofote e títulos, risco de banco", fx: { transferElite: 1, ambition: 8, loyalty: -10 } }, b: { label: "Ficar e crescer aqui", hint: "Minutos e lealdade", fx: { loyalty: 10, confidence: 6 } } },
  { id: "europe", title: "Primeira Europa", text: "Uma equipe de meio de tabela europeu quer o menino da base. Menos palco, mais jogo.", when: { minOvr: 70, maxAge: 23, home: 1 }, a: { label: "Cruzar o oceano", hint: "Salto de liga, adaptação", fx: { transferEurope: 1, ambition: 6 } }, b: { label: "Mais um ano em casa", hint: "Continuidade", fx: { loyalty: 7, energy: 4 } } },
  { id: "loan", title: "Empréstimo para jogar", text: "O técnico admite: na base você não estreia. Um clube menor pede empréstimo de um ano.", when: { maxAge: 21, roles: ["youth", "bench"] }, a: { label: "Aceitar o empréstimo", hint: "Jogos agora, clube menor", fx: { loan: 1, resilience: 4 } }, b: { label: "Ficar e brigar", hint: "Menos minutos, mais visibilidade", fx: { loyalty: 5, coach: -6, energy: -6 } } },
  { id: "rival", title: "O rival bateu", text: "O maior rival da cidade oferece o dobro e a titularidade. A torcida não perdoa.", when: { minAge: 20, minOvr: 68 }, a: { label: "Vestir o rival", hint: "Minutos e dinheiro, lealdade em ruínas", fx: { transferRival: 1, loyalty: -16, ambition: 5 } }, b: { label: "Recusar na hora", hint: "Ídolo da casa", fx: { loyalty: 12, confidence: 8, wage: -1 } } },
  { id: "home", title: "Volta pra casa", text: "Seu primeiro clube quer o ídolo de volta. Menos liga, mais amor.", when: { minAge: 28, abroad: 1 }, a: { label: "Voltar", hint: "Lealdade, liga mais fraca", fx: { transferHome: 1, loyalty: 14, energy: 8 } }, b: { label: "Seguir no exterior", hint: "Ambiente de elite", fx: { ambition: 6, loyalty: -4 } } },
  { id: "injury", title: "A joelho estalou", text: "Lesão séria. O médico fala em oito meses. O atalho é voltar no sexto.", when: { minAge: 18 },
    a: { label: "Respeitar o tempo", hint: "Temporada curta, corpo inteiro", theme: "physio", fx: { injury: 28, resilience: 8, energy: 6 } },
    b: { label: "Adiantar o retorno", hint: "Mais jogos, risco de recaída", theme: "injury", fx: { injury: 14, energy: -18, form: -10, tempOvr: { delta: -2, seasons: 2 } } } },
  { id: "muscle", title: "Estiramento", text: "Três semanas no departamento médico no meio do returno.", when: { minAge: 17 },
    a: { label: "Tratar com calma", hint: "Perde jogos, evita pior", theme: "physio", fx: { injury: 8, energy: 4 } },
    b: { label: "Injeção e jogo", hint: "Entra mais cedo, energia cai", theme: "injury", fx: { injury: 3, energy: -12, form: 4, tempOvr: { delta: -1, seasons: 1 } } } },
  { id: "spot", title: "Briga pela 10", text: "O ídolo do time não rende. O técnico pergunta se você aguenta a camisa pesada.", when: { minOvr: 72, roles: ["rotation", "starter"] }, a: { label: "Pedir a titularidade", hint: "Mais jogos, mais pressão", fx: { coach: 4, confidence: 8, energy: -8, ambition: 5 } }, b: { label: "Esperar a vez", hint: "Menos risco", fx: { loyalty: 4, coach: 2 } } },
  { id: "bench", title: "Banco longo", text: "Você virou o décimo segundo. O agente já tem duas propostas medianas.", when: { roles: ["bench", "youth"], minAge: 19 }, a: { label: "Pedir saída", hint: "Novo clube, recomeço", fx: { transferPeer: 1, loyalty: -6 } }, b: { label: "Convencer o técnico", hint: "Pode não mudar nada", fx: { coach: 8, energy: -4, loyalty: 4 } } },
  { id: "newcoach", title: "Técnico novo", text: "Mudou o treinador. Ele joga num esquema onde a sua posição some.", when: { minAge: 20 }, a: { label: "Adaptar a posição", hint: "Outra função, minutos", fx: { shiftPos: 1, resilience: 6 } }, b: { label: "Exigir o lugar de sempre", hint: "Princípio, risco de banco", fx: { coach: -8, confidence: 4 } } },
  { id: "renew", title: "A renovação", text: "O clube oferece três anos abaixo do mercado. O agente quer cláusula e aumento.", when: { minAge: 21, minOvr: 70 }, a: { label: "Assinar barato e ficar", hint: "Lealdade, salário menor", fx: { loyalty: 10, wage: -1 } }, b: { label: "Pedir o valor de mercado", hint: "Ambiente esfria se recusarem", fx: { ambition: 6, coach: -4, wage: 1 } } },
  { id: "ntfirst", title: "A primeira convocação", text: "O técnico da seleção quer você na lista da próxima data FIFA. Tem clássico de clube no mesmo fim de semana.", when: { minOvr: 70, maxAge: 23 }, a: { label: "Servir a seleção", hint: "Sonho, cansaço", fx: { ntYes: 1, energy: -6, ambition: 6 } }, b: { label: "Priorizar o clube", hint: "Técnico da seleção não esquece", fx: { ntNo: 1, loyalty: 4, coach: 6 } } },
  { id: "ntwc", title: "Ano de Copa", text: "A Copa do Mundo é daqui a dois meses. O clube quer que você poupe. A seleção quer você inteiro.", when: { wcYear: 1, minOvr: 76 }, a: { label: "Chegar inteiro à Copa", hint: "Menos club, mais seleção", fx: { energy: 10, form: 6, clubApps: -1 } }, b: { label: "Jogar tudo até junho", hint: "Risco de lesão na hora H", fx: { energy: -10, form: 4, injuryRisk: 1 } } },
  { id: "media", title: "A coletiva", text: "Um jornal pergunta se o elenco está acomodado. O microfone está na sua frente.", when: { minOvr: 74, roles: ["starter", "star"] }, a: { label: "Defender o grupo", hint: "Vestiário fecha com você", fx: { loyalty: 6, coach: 4, discipline: 4 } }, b: { label: "Falar a verdade nua", hint: "Imprensa ama, clube não", fx: { ambition: 6, coach: -8, confidence: 4 } } },
  { id: "agent", title: "O agente", text: "Ele quer 15% e uma saída a cada duas temporadas. Sem ele, as propostas somem.", when: { minAge: 18, maxAge: 24 }, a: { label: "Assinar com o agente", hint: "Mais ofertas, menos lealdade", fx: { ambition: 8, loyalty: -4 } }, b: { label: "Caminhar sozinho", hint: "Menos mercado, mais controle", fx: { discipline: 6, ambition: -2 } } },
  { id: "focus", title: "Pré-temporada", text: "O preparador oferece dois planos: explosão ou resistência.", when: { maxAge: 27 },
    a: { label: "Trabalho de explosão", hint: "Forma agora, desgaste depois", theme: "gym", fx: { form: 12, energy: -8, ovr: 1, tempOvr: { delta: 1, seasons: 1 } } },
    b: { label: "Construção de base", hint: "Energia o ano todo", theme: "training", fx: { energy: 10, form: 2, resilience: 4 } } },
  { id: "decline", title: "O corpo pede", text: "Os 32 chegaram. Um clube menor garante titularidade até o fim. O atual oferece o banco dourado.", when: { minAge: 32 }, a: { label: "Aceitar o clube menor", hint: "Jogos até o fim", fx: { transferDown: 1, energy: 8, loyalty: -4 } }, b: { label: "Ficar de reserva de luxo", hint: "Títulos, poucos minutos", fx: { loyalty: 8, energy: -4 } } },
  { id: "retire", title: "A pergunta", text: "A coletiva de encerramento já está marcada na cabeça de todo mundo. Só falta você confirmar.", when: { minAge: 34 }, a: { label: "Pendurar as chuteiras", hint: "Fecha a carreira agora", fx: { retire: 1 } }, b: { label: "Mais um ciclo", hint: "Até os 38, no máximo", fx: { extraYear: 1, energy: -6, resilience: 6 } } },
  { id: "captain", title: "A faixa", text: "O vestiário vota em você como capitão.", when: { minOvr: 80, minAge: 24, roles: ["starter", "star"] }, a: { label: "Aceitar a faixa", hint: "Peso e respeito", fx: { loyalty: 10, confidence: 8, energy: -4 } }, b: { label: "Indicar o veterano", hint: "Menos holofote", fx: { loyalty: 6, discipline: 6 } } },
  { id: "uclnight", title: "Noite europeia", text: "Mata-mata continental. O técnico pergunta se você aguenta os 120.", when: { minOvr: 80, minAge: 21 },
    a: { label: "Pedir os 90+30", hint: "Herói ou lesão", theme: "captain", fx: { form: 10, energy: -12, ovr: 1, tempOvr: { delta: -1, seasons: 1 } } },
    b: { label: "Jogar inteligente", hint: "Rendimento estável", theme: "focus", fx: { energy: 4, discipline: 4 } } },
  { id: "wage", title: "O reajuste", text: "Você é o melhor em campo e o 14º em salário. A diretoria enrola.", when: { minOvr: 82, minAge: 22 }, a: { label: "Bater na mesa", hint: "Mais dinheiro, clima ruim", fx: { wage: 1, coach: -5, ambition: 5 } }, b: { label: "Esperar a janela", hint: "Imagem de grupo", fx: { loyalty: 8, discipline: 5 } } },
  { id: "youthnt", title: "Sub-20 da seleção", text: "O mundial sub-20 cai no meio do Brasileiro. O clube não quer liberar.", when: { maxAge: 20, minOvr: 64 }, a: { label: "Ir com a seleção", hint: "Vitrine jovem", fx: { ntYes: 1, youthNt: 1, coach: -4 } }, b: { label: "Ficar no clube", hint: "Sequência de jogos", fx: { loyalty: 6, ntNo: 1 } } },
  { id: "press", title: "A foto da noite", text: "Uma foto sua numa festa vira capa. O técnico liga às sete da manhã.", when: { minAge: 18, maxAge: 26 },
    a: { label: "Pedir desculpas e treinar extra", hint: "Disciplina", theme: "gym", fx: { discipline: 8, energy: -4, coach: 4 } },
    b: { label: "Dizer que é vida de jovem", hint: "Imprensa esquenta", theme: "party", fx: { confidence: 4, coach: -8, discipline: -6, tempOvr: { delta: -1, seasons: 1 } } } },
  { id: "formdip", title: "A fase ruim", text: "Seis jogos sem brilhar. A torcida vaiou o nome.", when: { minAge: 20, roles: ["starter", "star"] }, a: { label: "Pedir banco para resetar", hint: "Forma volta, confiança treme", fx: { form: 8, confidence: -8, energy: 6 } }, b: { label: "Pedir a bola até sair", hint: "Pode virar o jogo — ou piorar", fx: { form: -4, confidence: 6, ambition: 4 } } },
  { id: "midtable", title: "Proposta sólida", text: "Um clube de meio de tabela da mesma liga oferece titularidade e três anos.", when: { minOvr: 66, maxOvr: 78, minAge: 21, maxAge: 30 }, a: { label: "Aceitar e ser dono da posição", hint: "Minutos certos", fx: { transferPeer: 1, confidence: 6 } }, b: { label: "Ficar no atual", hint: "Teto mais alto, menos garantia", fx: { loyalty: 6 } } },
  { id: "saudi", title: "O cheque em branco", text: "Uma liga distante oferece um contrato de aposentadoria aos 27. Fim da seleção, quase certo.", when: { minOvr: 82, minAge: 26, maxAge: 33 }, a: { label: "Aceitar o cheque", hint: "Dinheiro, fim da elite", fx: { transferDown: 1, wage: 2, ambition: -10, ntNo: 1 } }, b: { label: "Recusar e continuar na elite", hint: "História acima da conta", fx: { ambition: 8, loyalty: 4 } } },
  { id: "mentor", title: "O veterano", text: "O camisa 5 se aposenta e te oferece as manhãs de treino particular.", when: { maxAge: 22 }, a: { label: "Aceitar as manhãs extras", hint: "Crescimento, cansaço", fx: { ovr: 1, energy: -6, discipline: 6 } }, b: { label: "Seguir o plano do clube", hint: "Rotina estável", fx: { energy: 4 } } },
  { id: "clutch", title: "Pênalti da final", text: "Final da copa, 1 a 1. O técnico pergunta quem bate o último.", when: { minAge: 19, minOvr: 68 }, a: { label: "Eu bato", hint: "Herói ou vilão", fx: { confidence: 10, form: 6 } }, b: { label: "Deixar o especialista", hint: "Menos palco", fx: { discipline: 4, confidence: -2 } } },
  { id: "family", title: "A mala pronta", text: "A família quer que você volte para perto. O clube atual é o da sua melhor fase.", when: { minAge: 27, abroad: 1 }, a: { label: "Voltar para perto de casa", hint: "Vida, talvez menos futebol", fx: { transferHome: 1, energy: 10, loyalty: 6 } }, b: { label: "Ficar mais dois anos", hint: "Pico esportivo", fx: { ambition: 6, energy: -4 } } },
  { id: "doublesession", title: "Treino em dobro", text: "O preparador propõe dois turnos por dia. Pode virar titular mais cedo — ou o corpo fala mais alto.", when: { minAge: 17, maxAge: 24 },
    a: { label: "Treinar pesado", hint: "65% forma↑ · 35% lesão", fx: { risk: { p: 0.65, win: { form: 12, ovr: 1, energy: -6 }, lose: { injury: 8, energy: -10, form: -4 }, winText: "Explodiu nos treinos. O técnico anotou o nome.", loseText: "Estirou demais. Semanas no departamento médico." } } },
    b: { label: "Manter a carga", hint: "Menos risco, menos salto", fx: { energy: 4, discipline: 3 } } },
  { id: "crisis", title: "Crise no clube", text: "A torcida vaiou a diretoria. O vestiário se divide. Ficar é apostar na virada — ou afundar com o barco.", when: { minAge: 20, minOvr: 68, maxAge: 31 },
    a: { label: "Ficar e liderar", hint: "Lealdade · risco de ano perdido", fx: { loyalty: 10, risk: { p: 0.55, win: { confidence: 10, coach: 8, form: 6 }, lose: { confidence: -8, form: -8, energy: -6 }, winText: "Você virou o porto seguro. O time reagiu.", loseText: "A crise engoliu a temporada. Moral no chão." } } },
    b: { label: "Pedir pra sair", hint: "Novo começo", fx: { transferPeer: 1, loyalty: -8, ambition: 5 } } },
  { id: "nightout", title: "A noite longa", text: "Colegas chamam pra uma saída depois do clássico. O jogo é em 48 horas.", when: { minAge: 18, maxAge: 27 },
    a: { label: "Ir e voltar cedo", hint: "50/50", theme: "party", fx: { risk: { p: 0.5, win: { confidence: 4 }, lose: { energy: -12, discipline: -6, coach: -5, tempOvr: { delta: -1, seasons: 1 } }, winText: "Divertiu e chegou inteiro.", loseText: "O técnico sentiu o cheiro de noite mal dormida." } } },
    b: { label: "Dormir de atleta", hint: "Disciplina", theme: "safe", fx: { discipline: 6, energy: 6, form: 3 } } },
  { id: "agentpush", title: "Pressão do agente", text: "Ele quer forçar uma saída barulhenta. Pode acelerar o sonho europeu — ou queimar a ponte.", when: { minAge: 19, maxAge: 26, minOvr: 72 },
    a: { label: "Deixar ele agir", hint: "Ambiente esfria · chance de salto", fx: { ambition: 8, coach: -6, risk: { p: 0.5, win: { transferEurope: 1 }, lose: { loyalty: -8, confidence: -4 }, winText: "Uma porta europeia se abriu de verdade.", loseText: "A briga vazou. Ninguém ligou." } } },
    b: { label: "Segurar a onda", hint: "Continuidade", fx: { loyalty: 6, discipline: 4 } } },
  { id: "shift", title: "Mudança tática", text: "O novo esquema te empurra para uma função vizinha no campo.", when: { minAge: 18, maxAge: 30 }, a: { label: "Aceitar a nova função", hint: "Minutos, identidade nova", fx: { shiftPos: 1, resilience: 5 } }, b: { label: "Fincar pé na original", hint: "Pode perder lugar", fx: { coach: -5, confidence: 3 } } },
  { id: "locker", title: "Vestiário partido", text: "Dois líderes discutem no intervalo. Alguém precisa falar — ou o silêncio vira rachadura.", when: { minAge: 20, minOvr: 70, roles: ["starter", "star", "rotation"] }, theme: "captain",
    a: { label: "Mediar na hora", hint: "Peso de líder", theme: "captain", fx: { loyalty: 6, coach: 4, energy: -4 } },
    b: { label: "Deixar o técnico resolver", hint: "Menos exposição", theme: "coach", fx: { discipline: 4, coach: 2 } } },
  { id: "fans", title: "Faixa na arquibancada", text: "A torcida pendurou seu nome. O clube pergunta se você aparece no dia de sócio.", when: { minAge: 19, minOvr: 68 }, theme: "home",
    a: { label: "Ir e agradecer", hint: "Laço com a casa", theme: "home", fx: { loyalty: 8, confidence: 4, energy: -3 } },
    b: { label: "Treinar e seguir", hint: "Foco no gramado", theme: "focus", fx: { form: 4, discipline: 3 } } },
  { id: "pressroom", title: "Microfone quente", text: "Perguntam se o rival da posição merece mais minutos. A câmera não pisca.", when: { minAge: 21, minOvr: 72, roles: ["starter", "star"] }, theme: "media",
    a: { label: "Elogiar o rival", hint: "Clima leve", theme: "media", fx: { loyalty: 4, discipline: 4 } },
    b: { label: "Defender seu lugar", hint: "Ambiente esquenta", theme: "rival", fx: { confidence: 6, ambition: 4, coach: -3 } } },
  { id: "scan", title: "Exame de imagem", text: "Dorzinha chata. O médico quer exame completo. O técnico quer você no clássico.", when: { minAge: 18 }, theme: "physio",
    a: { label: "Fazer o exame", hint: "Pode perder o jogo", theme: "physio", fx: { injury: 4, resilience: 4, energy: 3 } },
    b: { label: "Segurar até domingo", hint: "Risco de piorar", theme: "injury", fx: { form: 3, risk: { p: 0.55, win: { confidence: 4 }, lose: { injury: 10, energy: -8, tempOvr: { delta: -1, seasons: 1 } }, winText: "Aguentou o clássico. Dor passou.", loseText: "O exame atrasado mostrou o óbvio. Semanas fora." } } } },
  { id: "ultras", title: "Portão 2", text: "Um grupo de ultras quer foto e discurso depois do treino. Segurança recomenda não.", when: { minAge: 20, minOvr: 74, roles: ["starter", "star"] }, theme: "home",
    a: { label: "Encontrar a torcida", hint: "Amor e pressão", theme: "home", fx: { loyalty: 7, confidence: 3, energy: -4 } },
    b: { label: "Mandar recado pelo clube", hint: "Distância segura", theme: "safe", fx: { discipline: 5, coach: 2 } } },
  { id: "recovery", title: "Protocolo de retorno", text: "Você volta de lesão. Fisioterapia lenta ou atalho com carga alta?", when: { minAge: 19 }, theme: "physio",
    a: { label: "Protocolo completo", hint: "Seguro", theme: "physio", fx: { injury: 6, energy: 6, resilience: 5 } },
    b: { label: "Acelerar a volta", hint: "Minutos cedo · risco", theme: "injury", fx: { form: 5, tempOvr: { delta: -1, seasons: 1 }, risk: { p: 0.6, win: { confidence: 5 }, lose: { injury: 8, energy: -10 }, winText: "Voltou afiado.", loseText: "A recaída veio no primeiro treino forte." } } } },
  /* Saltos raros de overall — aparecem pouco, mas podem abrir caminho ao ápice */
  { id: "breakthrough", rare: 1, title: "Janela de ouro", text: "O preparador diz que seu corpo respondeu a um protocolo novo. Duas semanas podem mudar o teto da carreira — ou te quebrar.", when: { minAge: 18, maxAge: 26, minOvr: 68, maxOvr: 88 },
    a: { label: "Entrar de cabeça no protocolo", hint: "Raro: grande salto · risco alto", theme: "breakthrough", fx: { energy: -10, risk: { p: 0.58, win: { ovr: 3, pot: 3, form: 10, confidence: 8 }, lose: { injury: 12, energy: -14, form: -8, tempOvr: { delta: -2, seasons: 2 } }, winText: "Você acordou outro jogador. O teto subiu.", loseText: "O corpo não aguentou a carga. Recuo forçado." } } },
    b: { label: "Crescer no ritmo normal", hint: "Seguro, sem milagre", theme: "safe", fx: { energy: 4, discipline: 4 } } },
  { id: "masterclass", rare: 1, title: "Aula particular", text: "Um ídolo aposentado te oferece três meses de mentoria diária. Poucos aceitam — menos ainda aproveitam.", when: { minAge: 19, maxAge: 27, minOvr: 74, maxOvr: 90 },
    a: { label: "Aceitar a mentoria", hint: "Salto acima do normal · cansaço", fx: { ovr: 2, pot: 2, energy: -8, discipline: 6, form: 6 } },
    b: { label: "Seguir só com o clube", hint: "Rotina estável", fx: { energy: 5, loyalty: 3 } } },
  { id: "worldstage", rare: 1, title: "Palco do mundo", text: "Uma sequência absurda em mata-mata continental. A imprensa já fala em outro nível. Você sente que pode estourar o teto — ou queimar.", when: { minAge: 21, maxAge: 29, minOvr: 80, maxOvr: 93 },
    a: { label: "Buscar o impossível", hint: "Chance de ápice · risco de lesão", theme: "breakthrough", fx: { ambition: 8, risk: { p: 0.5, win: { ovr: 3, pot: 2, confidence: 12, form: 10 }, lose: { injury: 10, energy: -16, form: -10, confidence: -6, tempOvr: { delta: -2, seasons: 2 } }, winText: "Você entrou no mapa dos melhores do mundo.", loseText: "O fogo apagou no hospital. Temporada comprometida." } } },
    b: { label: "Gerir a carreira com cabeça", hint: "Longevidade", theme: "safe", fx: { discipline: 8, energy: 6, resilience: 4 } } },
  { id: "lab", rare: 1, title: "Laboratório secreto", text: "Um centro de performance elite abre uma vaga experimental. Quase ninguém recebe o convite duas vezes na vida.", when: { minAge: 20, maxAge: 28, minOvr: 76, maxOvr: 91 },
    a: { label: "Topar o experimento", hint: "Potencial sobe · desgaste", fx: { pot: 4, ovr: 2, energy: -10, form: 4 } },
    b: { label: "Recusar e seguir tradicional", hint: "Sem atalho", fx: { discipline: 5, energy: 4 } } }
];


/* Copero-style choice art: theme key → rounded stock image */
var CHOICE_IMG = {
  training: "img/choices/training.png",
  gym: "img/choices/gym.png",
  party: "img/choices/party.png",
  media: "img/choices/media.png",
  injury: "img/choices/injury.png",
  physio: "img/choices/physio.png",
  transfer: "img/choices/transfer.png",
  contract: "img/choices/contract.png",
  national: "img/choices/national.png",
  breakthrough: "img/choices/breakthrough.png",
  captain: "img/choices/captain.png",
  money: "img/choices/money.png",
  home: "img/choices/home.png",
  family: "img/choices/family.png",
  retire: "img/choices/retire.png",
  focus: "img/choices/focus.png",
  penalty: "img/choices/penalty.png",
  coach: "img/choices/coach.png",
  rival: "img/choices/rival.png",
  stay: "img/choices/stay.png",
  safe: "img/choices/safe.png",
  default: "img/choices/default.png"
};

/* Default themes [a,b,c] by event id — options may override with theme/img */
var EVENT_CHOICE_THEMES = {
  giant: ["transfer", "stay"],
  europe: ["transfer", "home"],
  loan: ["transfer", "stay"],
  rival: ["rival", "captain"],
  home: ["home", "transfer"],
  injury: ["physio", "injury"],
  muscle: ["physio", "injury"],
  spot: ["captain", "safe"],
  bench: ["transfer", "coach"],
  newcoach: ["coach", "focus"],
  renew: ["contract", "money"],
  ntfirst: ["national", "stay"],
  ntwc: ["national", "captain"],
  media: ["media", "media"],
  agent: ["contract", "safe"],
  focus: ["gym", "training"],
  decline: ["home", "stay"],
  retire: ["retire", "focus"],
  captain: ["captain", "safe"],
  uclnight: ["captain", "focus"],
  wage: ["money", "stay"],
  youthnt: ["national", "stay"],
  press: ["gym", "party"],
  formdip: ["safe", "penalty"],
  midtable: ["transfer", "stay"],
  saudi: ["money", "breakthrough"],
  mentor: ["coach", "safe"],
  clutch: ["penalty", "safe"],
  family: ["family", "transfer"],
  doublesession: ["gym", "safe"],
  crisis: ["captain", "transfer"],
  nightout: ["party", "safe"],
  agentpush: ["contract", "stay"],
  shift: ["coach", "focus"],
  breakthrough: ["breakthrough", "safe"],
  masterclass: ["coach", "safe"],
  worldstage: ["breakthrough", "safe"],
  lab: ["gym", "safe"],
  locker: ["captain", "coach"],
  fans: ["home", "focus"],
  pressroom: ["media", "rival"],
  scan: ["physio", "injury"],
  ultras: ["home", "safe"],
  recovery: ["physio", "injury"],
  farewell: ["retire", "focus"],
  market: ["transfer", "transfer", "stay"],
  quiet: ["training", "safe"],
  substancias: ["party", "safe"]
};


var CHOICE_THEME_ALIAS = {
  training: "training", gym: "gym", party: "party", media: "media",
  injury: "injury", physio: "physio", transfer: "transfer", contract: "contract",
  national: "national", breakthrough: "breakthrough", captain: "captain",
  money: "money", home: "home", family: "family", retire: "retire",
  focus: "focus", penalty: "penalty", coach: "coach", rival: "rival",
  stay: "stay", safe: "safe", default: "default",
  elite: "transfer", rest: "safe", sleep: "safe",
  celebration: "breakthrough", stadium: "national", mic: "media",
  nightlife: "party", boots: "retire"
};

function choiceThemeImg(theme) {
  if (!theme) return CHOICE_IMG.default;
  if (String(theme).indexOf("img/") === 0) return theme;
  var key = (typeof CHOICE_THEME_ALIAS !== "undefined" && CHOICE_THEME_ALIAS[theme]) || theme;
  if (CHOICE_IMG[key]) return CHOICE_IMG[key];
  if (CHOICE_IMG[theme]) return CHOICE_IMG[theme];
  return CHOICE_IMG.default;
}

function resolveChoiceImg(ch, ev, sideIdx) {
  if (!ch) return CHOICE_IMG.default;
  if (ch.img) return ch.img;
  if (ch.theme) return choiceThemeImg(ch.theme);
  var themes = (ev && EVENT_CHOICE_THEMES[ev.id]) || [];
  return choiceThemeImg(themes[sideIdx] || "default");
}

/* One illustration for the QUESTION/event — not per answer option */
function resolveEventImg(ev) {
  if (!ev) return CHOICE_IMG.default;
  if (ev.img) return ev.img;
  if (ev.theme) return choiceThemeImg(ev.theme);
  var themes = EVENT_CHOICE_THEMES[ev.id] || [];
  if (themes[0]) return choiceThemeImg(themes[0]);
  return choiceThemeImg(ev.id || "default");
}


/* Compact career-timeline labels — only widely-known shorts / common forms */
var CLUB_DISPLAY_SHORT = {
  psg: "PSG",
  mun: "Man United",
  mci: "Man City",
  atm: "Atlético",
  bvb: "Dortmund",
  rbb: "Bragantino",
  nal: "Atl. Nacional",
  yok: "Yokohama FM",
  nfo: "Nott'm Forest",
  cry: "Palace",
  vgu: "Guimarães",
  ath: "Athletic",
  kaw: "Kawasaki",
  sea: "Sounders",
  amea: "América",
  amec: "América Cali",
  dep: "Dep. Cali",
  az: "AZ",
  rso: "Sociedad",
  kas: "Kashima",
  atl: "Atlanta",
  rivu: "River UY",
  gen: "Génération",
  boc: "Boca"
};

(function applyClubShortLabels() {
  if (typeof CLUBS === "undefined" || !CLUBS) return;
  for (var i = 0; i < CLUBS.length; i++) {
    var c = CLUBS[i];
    if (!c || !c.id) continue;
    if (c.displayShort || c.short) continue;
    if (CLUB_DISPLAY_SHORT[c.id]) c.short = CLUB_DISPLAY_SHORT[c.id];
  }
})();

/** Compact label for dense UI (timeline); full name elsewhere. */
function clubDisplayName(club, compact) {
  if (!club) return "";
  if (compact) {
    if (club.displayShort) return club.displayShort;
    if (club.short) return club.short;
    if (club.id && CLUB_DISPLAY_SHORT[club.id]) return CLUB_DISPLAY_SHORT[club.id];
  }
  return club.name || "";
}

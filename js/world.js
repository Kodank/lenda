/* gerado por tools/build_assets.py — não edite à mão */
var NATIONS = [
  {
    "id": "br",
    "name": "Brasil",
    "adj": "Brasileiro",
    "conf": "conmebol",
    "ntCut": 0,
    "flag": "img/flags/br.png"
  },
  {
    "id": "ar",
    "name": "Argentina",
    "adj": "Argentino",
    "conf": "conmebol",
    "ntCut": -1,
    "flag": "img/flags/ar.png"
  },
  {
    "id": "uy",
    "name": "Uruguai",
    "adj": "Uruguaio",
    "conf": "conmebol",
    "ntCut": -4,
    "flag": "img/flags/uy.png"
  },
  {
    "id": "co",
    "name": "Colômbia",
    "adj": "Colombiano",
    "conf": "conmebol",
    "ntCut": -3,
    "flag": "img/flags/co.png"
  },
  {
    "id": "mx",
    "name": "México",
    "adj": "Mexicano",
    "conf": "concacaf",
    "ntCut": -3,
    "flag": "img/flags/mx.png"
  },
  {
    "id": "pt",
    "name": "Portugal",
    "adj": "Português",
    "conf": "uefa",
    "ntCut": -2,
    "flag": "img/flags/pt.png"
  },
  {
    "id": "es",
    "name": "Espanha",
    "adj": "Espanhol",
    "conf": "uefa",
    "ntCut": 0,
    "flag": "img/flags/es.png"
  },
  {
    "id": "en",
    "name": "Inglaterra",
    "adj": "Inglês",
    "conf": "uefa",
    "ntCut": 0,
    "flag": "img/flags/en.png"
  },
  {
    "id": "fr",
    "name": "França",
    "adj": "Francês",
    "conf": "uefa",
    "ntCut": -1,
    "flag": "img/flags/fr.png"
  },
  {
    "id": "it",
    "name": "Itália",
    "adj": "Italiano",
    "conf": "uefa",
    "ntCut": 0,
    "flag": "img/flags/it.png"
  },
  {
    "id": "de",
    "name": "Alemanha",
    "adj": "Alemão",
    "conf": "uefa",
    "ntCut": 0,
    "flag": "img/flags/de.png"
  },
  {
    "id": "nl",
    "name": "Países Baixos",
    "adj": "Neerlandês",
    "conf": "uefa",
    "ntCut": -2,
    "flag": "img/flags/nl.png"
  },
  {
    "id": "us",
    "name": "Estados Unidos",
    "adj": "Americano",
    "conf": "concacaf",
    "ntCut": -6,
    "flag": "img/flags/us.png"
  },
  {
    "id": "jp",
    "name": "Japão",
    "adj": "Japonês",
    "conf": "afc",
    "ntCut": -5,
    "flag": "img/flags/jp.png"
  },
  {
    "id": "ng",
    "name": "Nigéria",
    "adj": "Nigeriano",
    "conf": "caf",
    "ntCut": -7,
    "flag": "img/flags/ng.png"
  },
  {
    "id": "sn",
    "name": "Senegal",
    "adj": "Senegalês",
    "conf": "caf",
    "ntCut": -8,
    "flag": "img/flags/sn.png"
  }
];
/* Club league placements synced to real-world seasons (see also more_clubs.js). */
var LEAGUE_SEASON = "2026"; // Brasileirão 2026 + EUR 2026/27
var LEAGUES = [
  {
    "id": "bra",
    "name": "Brasileirão",
    "nation": "br",
    "tier": 1,
    "level": 4.2,
    "continental": "lib",
    "size": 20,
    "trophy": "brasileirao",
    "logo": "img/leagues/bra.png",
    "color": "#009B3A"
  },
  {
    "id": "brb",
    "name": "Série B",
    "nation": "br",
    "tier": 2,
    "level": 2.6,
    "continental": null,
    "size": 20,
    "trophy": "copa",
    "logo": "img/leagues/brb.png",
    "color": "#1F4E79"
  },
  {
    "id": "arg",
    "name": "Liga Profesional",
    "nation": "ar",
    "tier": 1,
    "level": 3.8,
    "continental": "lib",
    "size": 28,
    "trophy": "copa",
    "logo": "img/leagues/arg.png",
    "color": "#75AADB"
  },
  {
    "id": "uru",
    "name": "Primera División",
    "nation": "uy",
    "tier": 1,
    "level": 3.0,
    "continental": "lib",
    "size": 16,
    "trophy": "copa",
    "logo": "img/leagues/uru.png",
    "color": "#0038A8"
  },
  {
    "id": "col",
    "name": "Liga BetPlay",
    "nation": "co",
    "tier": 1,
    "level": 3.1,
    "continental": "lib",
    "size": 20,
    "trophy": "copa",
    "logo": "img/leagues/col.png",
    "color": "#FCD116"
  },
  {
    "id": "mex",
    "name": "Liga MX",
    "nation": "mx",
    "tier": 1,
    "level": 3.6,
    "continental": null,
    "size": 18,
    "trophy": "copa",
    "logo": "img/leagues/mex.png",
    "color": "#006847"
  },
  {
    "id": "por",
    "name": "Liga Portugal",
    "nation": "pt",
    "tier": 1,
    "level": 3.9,
    "continental": "ucl",
    "size": 18,
    "trophy": "copa",
    "logo": "img/leagues/por.png",
    "color": "#006600"
  },
  {
    "id": "esp",
    "name": "La Liga",
    "nation": "es",
    "tier": 1,
    "level": 4.8,
    "continental": "ucl",
    "size": 20,
    "trophy": "premier",
    "logo": "img/leagues/esp.png",
    "color": "#EE334E"
  },
  {
    "id": "eng",
    "name": "Premier League",
    "nation": "en",
    "tier": 1,
    "level": 4.9,
    "continental": "ucl",
    "size": 20,
    "trophy": "premier",
    "logo": "img/leagues/eng.png",
    "color": "#3D195B"
  },
  {
    "id": "fra",
    "name": "Ligue 1",
    "nation": "fr",
    "tier": 1,
    "level": 4.4,
    "continental": "ucl",
    "size": 18,
    "trophy": "premier",
    "logo": "img/leagues/fra.png",
    "color": "#1E3A8A"
  },
  {
    "id": "ita",
    "name": "Serie A",
    "nation": "it",
    "tier": 1,
    "level": 4.6,
    "continental": "ucl",
    "size": 20,
    "trophy": "premier",
    "logo": "img/leagues/ita.png",
    "color": "#024494"
  },
  {
    "id": "ger",
    "name": "Bundesliga",
    "nation": "de",
    "tier": 1,
    "level": 4.5,
    "continental": "ucl",
    "size": 18,
    "trophy": "premier",
    "logo": "img/leagues/ger.png",
    "color": "#D20515"
  },
  {
    "id": "ned",
    "name": "Eredivisie",
    "nation": "nl",
    "tier": 1,
    "level": 3.7,
    "continental": "ucl",
    "size": 18,
    "trophy": "copa",
    "logo": "img/leagues/ned.png",
    "color": "#F36C21"
  },
  {
    "id": "usa",
    "name": "MLS",
    "nation": "us",
    "tier": 1,
    "level": 3.2,
    "continental": null,
    "size": 29,
    "trophy": "copa",
    "logo": "img/leagues/usa.png",
    "color": "#C8102E"
  },
  {
    "id": "jpn",
    "name": "J1 League",
    "nation": "jp",
    "tier": 1,
    "level": 3.0,
    "continental": null,
    "size": 18,
    "trophy": "copa",
    "logo": "img/leagues/jpn.png",
    "color": "#BC002D"
  },
  {
    "id": "nga",
    "name": "NPFL",
    "nation": "ng",
    "tier": 1,
    "level": 2.4,
    "continental": null,
    "size": 20,
    "trophy": "youth",
    "logo": "img/leagues/nga.png",
    "color": "#008751"
  },
  {
    "id": "sen",
    "name": "Ligue 1 Sénégal",
    "nation": "sn",
    "tier": 1,
    "level": 2.2,
    "continental": null,
    "size": 14,
    "trophy": "youth",
    "logo": "img/leagues/sen.png",
    "color": "#00853F"
  },
  {
    "id": "brc",
    "name": "Série C",
    "nation": "br",
    "tier": 3,
    "level": 1.8,
    "continental": null,
    "size": 20,
    "trophy": "copa",
    "logo": "img/leagues/brb.png",
    "color": "#5B8C5A"
  },
  {
    "id": "eng2",
    "name": "Championship",
    "nation": "en",
    "tier": 2,
    "level": 3.2,
    "continental": null,
    "size": 24,
    "trophy": "copa",
    "logo": "img/leagues/eng.png",
    "color": "#6C1D45"
  },
  {
    "id": "ger2",
    "name": "2. Bundesliga",
    "nation": "de",
    "tier": 2,
    "level": 3.0,
    "continental": null,
    "size": 18,
    "trophy": "copa",
    "logo": "img/leagues/ger.png",
    "color": "#D20515"
  },
  {
    "id": "fra2",
    "name": "Ligue 2",
    "nation": "fr",
    "tier": 2,
    "level": 2.8,
    "continental": null,
    "size": 18,
    "trophy": "copa",
    "logo": "img/leagues/fra.png",
    "color": "#091C3E"
  }
];
var CLUBS = [
  {
    "id": "fla",
    "name": "Flamengo",
    "city": "Rio de Janeiro",
    "nation": "br",
    "leagueId": "bra",
    "level": 4.6,
    "colors": [
      "#C41E3A",
      "#111111",
      "#FFFFFF"
    ],
    "pattern": "hoops",
    "charge": "ball",
    "youth": true,
    "crest": "img/clubs/fla.png"
  },
  {
    "id": "pal",
    "name": "Palmeiras",
    "city": "São Paulo",
    "nation": "br",
    "leagueId": "bra",
    "level": 4.5,
    "colors": [
      "#006437",
      "#FFFFFF",
      "#006437"
    ],
    "pattern": "pale",
    "charge": "flower",
    "youth": true,
    "crest": "img/clubs/pal.png"
  },
  {
    "id": "cor",
    "name": "Corinthians",
    "city": "São Paulo",
    "nation": "br",
    "leagueId": "bra",
    "level": 4.3,
    "colors": [
      "#000000",
      "#FFFFFF",
      "#000000"
    ],
    "pattern": "ring",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/cor.png"
  },
  {
    "id": "sao",
    "name": "São Paulo",
    "city": "São Paulo",
    "nation": "br",
    "leagueId": "bra",
    "level": 4.2,
    "colors": [
      "#FFFFFF",
      "#C8102E",
      "#000000"
    ],
    "pattern": "thirds",
    "charge": "cross",
    "youth": true,
    "crest": "img/clubs/sao.png"
  },
  {
    "id": "san",
    "name": "Santos",
    "city": "Santos",
    "nation": "br",
    "leagueId": "bra",
    "level": 3.6,
    "colors": [
      "#000000",
      "#FFFFFF",
      "#000000"
    ],
    "pattern": "stripes",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/san.png"
  },
  {
    "id": "gre",
    "name": "Grêmio",
    "city": "Porto Alegre",
    "nation": "br",
    "leagueId": "bra",
    "level": 4.0,
    "colors": [
      "#0A84C1",
      "#000000",
      "#FFFFFF"
    ],
    "pattern": "stripes",
    "charge": "crown",
    "youth": true,
    "crest": "img/clubs/gre.png"
  },
  {
    "id": "inter",
    "name": "Internacional",
    "city": "Porto Alegre",
    "nation": "br",
    "leagueId": "bra",
    "level": 4.0,
    "colors": [
      "#C8102E",
      "#FFFFFF",
      "#C8102E"
    ],
    "pattern": "solid",
    "charge": "flower",
    "youth": true,
    "crest": "img/clubs/inter.png"
  },
  {
    "id": "cam",
    "name": "Atlético-MG",
    "city": "Belo Horizonte",
    "nation": "br",
    "leagueId": "bra",
    "level": 4.1,
    "colors": [
      "#000000",
      "#FFFFFF",
      "#000000"
    ],
    "pattern": "stripes",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/cam.png"
  },
  {
    "id": "flu",
    "name": "Fluminense",
    "city": "Rio de Janeiro",
    "nation": "br",
    "leagueId": "bra",
    "level": 3.8,
    "colors": [
      "#7A0019",
      "#006341",
      "#FFFFFF"
    ],
    "pattern": "hoops",
    "charge": "flower",
    "youth": true,
    "crest": "img/clubs/flu.png"
  },
  {
    "id": "bot",
    "name": "Botafogo",
    "city": "Rio de Janeiro",
    "nation": "br",
    "leagueId": "bra",
    "level": 3.9,
    "colors": [
      "#000000",
      "#FFFFFF",
      "#000000"
    ],
    "pattern": "pale",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/bot.png"
  },
  {
    "id": "vas",
    "name": "Vasco",
    "city": "Rio de Janeiro",
    "nation": "br",
    "leagueId": "bra",
    "level": 3.5,
    "colors": [
      "#000000",
      "#FFFFFF",
      "#000000"
    ],
    "pattern": "bend",
    "charge": "cross",
    "youth": true,
    "crest": "img/clubs/vas.png"
  },
  {
    "id": "cap",
    "name": "Athletico-PR",
    "city": "Curitiba",
    "nation": "br",
    "leagueId": "bra",
    "level": 3.6,
    "colors": [
      "#E41937",
      "#000000",
      "#E41937"
    ],
    "pattern": "bend",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/cap.png"
  },
  {
    "id": "bah",
    "name": "Bahia",
    "city": "Salvador",
    "nation": "br",
    "leagueId": "bra",
    "level": 3.4,
    "colors": [
      "#0062A8",
      "#E31837",
      "#FFFFFF"
    ],
    "pattern": "thirds",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/bah.png"
  },
  {
    "id": "for",
    "name": "Fortaleza",
    "city": "Fortaleza",
    "nation": "br",
    "leagueId": "brb",
    "level": 3.0,
    "colors": [
      "#E31837",
      "#0062A8",
      "#FFFFFF"
    ],
    "pattern": "hoops",
    "charge": "lion",
    "youth": true,
    "crest": "img/clubs/for.png"
  },
  {
    "id": "cru",
    "name": "Cruzeiro",
    "city": "Belo Horizonte",
    "nation": "br",
    "leagueId": "bra",
    "level": 3.7,
    "colors": [
      "#2B6CB0",
      "#FFFFFF",
      "#2B6CB0"
    ],
    "pattern": "solid",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/cru.png"
  },
  {
    "id": "rbb",
    "name": "Red Bull Bragantino",
    "city": "Bragança Paulista",
    "nation": "br",
    "leagueId": "bra",
    "level": 3.4,
    "colors": [
      "#E31837",
      "#FFFFFF",
      "#E31837"
    ],
    "pattern": "solid",
    "charge": "bull",
    "youth": true,
    "crest": "img/clubs/rbb.png"
  },
  {
    "id": "spt",
    "name": "Sport",
    "city": "Recife",
    "nation": "br",
    "leagueId": "brb",
    "level": 2.8,
    "colors": [
      "#E31837",
      "#000000",
      "#E31837"
    ],
    "pattern": "hoops",
    "charge": "lion",
    "youth": true,
    "crest": "img/clubs/spt.png"
  },
  {
    "id": "cea",
    "name": "Ceará",
    "city": "Fortaleza",
    "nation": "br",
    "leagueId": "brb",
    "level": 2.7,
    "colors": [
      "#000000",
      "#FFFFFF",
      "#000000"
    ],
    "pattern": "stripes",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/cea.png"
  },
  {
    "id": "goi",
    "name": "Goiás",
    "city": "Goiânia",
    "nation": "br",
    "leagueId": "brb",
    "level": 2.6,
    "colors": [
      "#007A33",
      "#FFFFFF",
      "#007A33"
    ],
    "pattern": "pale",
    "charge": "diamond",
    "youth": true,
    "crest": "img/clubs/goi.png"
  },
  {
    "id": "gua",
    "name": "Guarani",
    "city": "Campinas",
    "nation": "br",
    "leagueId": "brc",
    "level": 2.5,
    "colors": [
      "#007A33",
      "#FFFFFF",
      "#007A33"
    ],
    "pattern": "solid",
    "charge": "bug",
    "youth": true,
    "crest": "img/clubs/gua.png"
  },
  {
    "id": "pon",
    "name": "Ponte Preta",
    "city": "Campinas",
    "nation": "br",
    "leagueId": "brb",
    "level": 2.5,
    "colors": [
      "#000000",
      "#FFFFFF",
      "#000000"
    ],
    "pattern": "stripes",
    "charge": "bridge",
    "youth": true,
    "crest": "img/clubs/pon.png"
  },
  {
    "id": "ava",
    "name": "Avaí",
    "city": "Florianópolis",
    "nation": "br",
    "leagueId": "brb",
    "level": 2.5,
    "colors": [
      "#0062A8",
      "#FFFFFF",
      "#0062A8"
    ],
    "pattern": "pale",
    "charge": "wave",
    "youth": true,
    "crest": "img/clubs/ava.png"
  },
  {
    "id": "boc",
    "name": "Boca Juniors",
    "city": "Buenos Aires",
    "nation": "ar",
    "leagueId": "arg",
    "level": 4.4,
    "colors": [
      "#0033A0",
      "#F9D616",
      "#0033A0"
    ],
    "pattern": "pale",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/boc.png"
  },
  {
    "id": "riv",
    "name": "River Plate",
    "city": "Buenos Aires",
    "nation": "ar",
    "leagueId": "arg",
    "level": 4.4,
    "colors": [
      "#FFFFFF",
      "#E31837",
      "#FFFFFF"
    ],
    "pattern": "bend",
    "charge": "band",
    "youth": true,
    "crest": "img/clubs/riv.png"
  },
  {
    "id": "rac",
    "name": "Racing",
    "city": "Avellaneda",
    "nation": "ar",
    "leagueId": "arg",
    "level": 3.7,
    "colors": [
      "#79C3E0",
      "#FFFFFF",
      "#79C3E0"
    ],
    "pattern": "stripes",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/rac.png"
  },
  {
    "id": "ind",
    "name": "Independiente",
    "city": "Avellaneda",
    "nation": "ar",
    "leagueId": "arg",
    "level": 3.6,
    "colors": [
      "#D50032",
      "#FFFFFF",
      "#D50032"
    ],
    "pattern": "solid",
    "charge": "devil",
    "youth": true,
    "crest": "img/clubs/ind.png"
  },
  {
    "id": "sla",
    "name": "San Lorenzo",
    "city": "Buenos Aires",
    "nation": "ar",
    "leagueId": "arg",
    "level": 3.5,
    "colors": [
      "#C41E3A",
      "#0033A0",
      "#FFFFFF"
    ],
    "pattern": "stripes",
    "charge": "cross",
    "youth": true,
    "crest": "img/clubs/sla.png"
  },
  {
    "id": "est",
    "name": "Estudiantes",
    "city": "La Plata",
    "nation": "ar",
    "leagueId": "arg",
    "level": 3.5,
    "colors": [
      "#E31837",
      "#FFFFFF",
      "#E31837"
    ],
    "pattern": "stripes",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/est.png"
  },
  {
    "id": "nac",
    "name": "Nacional",
    "city": "Montevidéu",
    "nation": "uy",
    "leagueId": "uru",
    "level": 3.4,
    "colors": [
      "#FFFFFF",
      "#0038A8",
      "#E31837"
    ],
    "pattern": "solid",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/nac.png"
  },
  {
    "id": "pen",
    "name": "Peñarol",
    "city": "Montevidéu",
    "nation": "uy",
    "leagueId": "uru",
    "level": 3.4,
    "colors": [
      "#000000",
      "#FFD100",
      "#000000"
    ],
    "pattern": "stripes",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/pen.png"
  },
  {
    "id": "def",
    "name": "Defensor",
    "city": "Montevidéu",
    "nation": "uy",
    "leagueId": "uru",
    "level": 2.8,
    "colors": [
      "#7A0019",
      "#7A0019",
      "#FFFFFF"
    ],
    "pattern": "solid",
    "charge": "violet",
    "youth": true,
    "crest": "img/clubs/def.png"
  },
  {
    "id": "nal",
    "name": "Atlético Nacional",
    "city": "Medellín",
    "nation": "co",
    "leagueId": "col",
    "level": 3.5,
    "colors": [
      "#007A33",
      "#FFFFFF",
      "#007A33"
    ],
    "pattern": "solid",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/nal.png"
  },
  {
    "id": "mil",
    "name": "Millonarios",
    "city": "Bogotá",
    "nation": "co",
    "leagueId": "col",
    "level": 3.3,
    "colors": [
      "#0033A0",
      "#FFFFFF",
      "#0033A0"
    ],
    "pattern": "solid",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/mil.png"
  },
  {
    "id": "amec",
    "name": "América de Cali",
    "city": "Cali",
    "nation": "co",
    "leagueId": "col",
    "level": 3.2,
    "colors": [
      "#E31837",
      "#FFFFFF",
      "#E31837"
    ],
    "pattern": "solid",
    "charge": "devil",
    "youth": true,
    "crest": "img/clubs/amec.png"
  },
  {
    "id": "amea",
    "name": "Club América",
    "city": "Cidade do México",
    "nation": "mx",
    "leagueId": "mex",
    "level": 3.8,
    "colors": [
      "#F9D616",
      "#0033A0",
      "#F9D616"
    ],
    "pattern": "solid",
    "charge": "eagle",
    "youth": true,
    "crest": "img/clubs/amea.png"
  },
  {
    "id": "chi",
    "name": "Chivas",
    "city": "Guadalajara",
    "nation": "mx",
    "leagueId": "mex",
    "level": 3.6,
    "colors": [
      "#E31837",
      "#FFFFFF",
      "#0033A0"
    ],
    "pattern": "stripes",
    "charge": "goat",
    "youth": true,
    "crest": "img/clubs/chi.png"
  },
  {
    "id": "mty",
    "name": "Monterrey",
    "city": "Monterrey",
    "nation": "mx",
    "leagueId": "mex",
    "level": 3.7,
    "colors": [
      "#0033A0",
      "#FFFFFF",
      "#0033A0"
    ],
    "pattern": "stripes",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/mty.png"
  },
  {
    "id": "tig",
    "name": "Tigres",
    "city": "Monterrey",
    "nation": "mx",
    "leagueId": "mex",
    "level": 3.7,
    "colors": [
      "#F9D616",
      "#0033A0",
      "#F9D616"
    ],
    "pattern": "pale",
    "charge": "tiger",
    "youth": true,
    "crest": "img/clubs/tig.png"
  },
  {
    "id": "ben",
    "name": "Benfica",
    "city": "Lisboa",
    "nation": "pt",
    "leagueId": "por",
    "level": 4.3,
    "colors": [
      "#E31837",
      "#FFFFFF",
      "#E31837"
    ],
    "pattern": "solid",
    "charge": "eagle",
    "youth": true,
    "crest": "img/clubs/ben.png"
  },
  {
    "id": "por",
    "name": "Porto",
    "city": "Porto",
    "nation": "pt",
    "leagueId": "por",
    "level": 4.2,
    "colors": [
      "#0033A0",
      "#FFFFFF",
      "#0033A0"
    ],
    "pattern": "solid",
    "charge": "dragon",
    "youth": true,
    "crest": "img/clubs/por.png"
  },
  {
    "id": "spo",
    "name": "Sporting",
    "city": "Lisboa",
    "nation": "pt",
    "leagueId": "por",
    "level": 4.1,
    "colors": [
      "#007A33",
      "#FFFFFF",
      "#007A33"
    ],
    "pattern": "solid",
    "charge": "lion",
    "youth": true,
    "crest": "img/clubs/spo.png"
  },
  {
    "id": "rma",
    "name": "Real Madrid",
    "city": "Madrid",
    "nation": "es",
    "leagueId": "esp",
    "level": 5.0,
    "colors": [
      "#FFFFFF",
      "#F9D616",
      "#00529F"
    ],
    "pattern": "solid",
    "charge": "crown",
    "youth": true,
    "crest": "img/clubs/rma.png"
  },
  {
    "id": "fcb",
    "name": "Barcelona",
    "city": "Barcelona",
    "nation": "es",
    "leagueId": "esp",
    "level": 4.9,
    "colors": [
      "#A50044",
      "#004D98",
      "#A50044"
    ],
    "pattern": "stripes",
    "charge": "cross",
    "youth": true,
    "crest": "img/clubs/fcb.png"
  },
  {
    "id": "atm",
    "name": "Atlético de Madrid",
    "city": "Madrid",
    "nation": "es",
    "leagueId": "esp",
    "level": 4.6,
    "colors": [
      "#C8102E",
      "#FFFFFF",
      "#C8102E"
    ],
    "pattern": "stripes",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/atm.png"
  },
  {
    "id": "sev",
    "name": "Sevilla",
    "city": "Sevilha",
    "nation": "es",
    "leagueId": "esp",
    "level": 4.2,
    "colors": [
      "#FFFFFF",
      "#D50032",
      "#FFFFFF"
    ],
    "pattern": "solid",
    "charge": "cross",
    "youth": true,
    "crest": "img/clubs/sev.png"
  },
  {
    "id": "vil",
    "name": "Villarreal",
    "city": "Vila-real",
    "nation": "es",
    "leagueId": "esp",
    "level": 4.1,
    "colors": [
      "#F9D616",
      "#00529F",
      "#F9D616"
    ],
    "pattern": "solid",
    "charge": "sub",
    "youth": true,
    "crest": "img/clubs/vil.png"
  },
  {
    "id": "rso",
    "name": "Real Sociedad",
    "city": "San Sebastián",
    "nation": "es",
    "leagueId": "esp",
    "level": 4.0,
    "colors": [
      "#0033A0",
      "#FFFFFF",
      "#0033A0"
    ],
    "pattern": "stripes",
    "charge": "crown",
    "youth": true,
    "crest": "img/clubs/rso.png"
  },
  {
    "id": "mci",
    "name": "Manchester City",
    "city": "Manchester",
    "nation": "en",
    "leagueId": "eng",
    "level": 5.0,
    "colors": [
      "#6CABDD",
      "#FFFFFF",
      "#1C2C5B"
    ],
    "pattern": "solid",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/mci.png"
  },
  {
    "id": "ars",
    "name": "Arsenal",
    "city": "Londres",
    "nation": "en",
    "leagueId": "eng",
    "level": 4.8,
    "colors": [
      "#EF0107",
      "#FFFFFF",
      "#9C824A"
    ],
    "pattern": "solid",
    "charge": "cannon",
    "youth": true,
    "crest": "img/clubs/ars.png"
  },
  {
    "id": "liv",
    "name": "Liverpool",
    "city": "Liverpool",
    "nation": "en",
    "leagueId": "eng",
    "level": 4.9,
    "colors": [
      "#C8102E",
      "#FFFFFF",
      "#00B2A9"
    ],
    "pattern": "solid",
    "charge": "bird",
    "youth": true,
    "crest": "img/clubs/liv.png"
  },
  {
    "id": "che",
    "name": "Chelsea",
    "city": "Londres",
    "nation": "en",
    "leagueId": "eng",
    "level": 4.6,
    "colors": [
      "#034694",
      "#FFFFFF",
      "#034694"
    ],
    "pattern": "solid",
    "charge": "lion",
    "youth": true,
    "crest": "img/clubs/che.png"
  },
  {
    "id": "mun",
    "name": "Manchester United",
    "city": "Manchester",
    "nation": "en",
    "leagueId": "eng",
    "level": 4.6,
    "colors": [
      "#DA291C",
      "#FBE122",
      "#000000"
    ],
    "pattern": "solid",
    "charge": "devil",
    "youth": true,
    "crest": "img/clubs/mun.png"
  },
  {
    "id": "tot",
    "name": "Tottenham",
    "city": "Londres",
    "nation": "en",
    "leagueId": "eng",
    "level": 4.4,
    "colors": [
      "#FFFFFF",
      "#132257",
      "#FFFFFF"
    ],
    "pattern": "solid",
    "charge": "bird",
    "youth": true,
    "crest": "img/clubs/tot.png"
  },
  {
    "id": "new",
    "name": "Newcastle",
    "city": "Newcastle",
    "nation": "en",
    "leagueId": "eng",
    "level": 4.3,
    "colors": [
      "#000000",
      "#FFFFFF",
      "#000000"
    ],
    "pattern": "stripes",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/new.png"
  },
  {
    "id": "psg",
    "name": "Paris Saint-Germain",
    "city": "Paris",
    "nation": "fr",
    "leagueId": "fra",
    "level": 4.8,
    "colors": [
      "#004170",
      "#E31837",
      "#FFFFFF"
    ],
    "pattern": "thirds",
    "charge": "fleur",
    "youth": true,
    "crest": "img/clubs/psg.png"
  },
  {
    "id": "mar",
    "name": "Marseille",
    "city": "Marselha",
    "nation": "fr",
    "leagueId": "fra",
    "level": 4.1,
    "colors": [
      "#2FA8E0",
      "#FFFFFF",
      "#2FA8E0"
    ],
    "pattern": "pale",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/mar.png"
  },
  {
    "id": "lyo",
    "name": "Lyon",
    "city": "Lyon",
    "nation": "fr",
    "leagueId": "fra",
    "level": 4.0,
    "colors": [
      "#0033A0",
      "#E31837",
      "#FFFFFF"
    ],
    "pattern": "stripes",
    "charge": "lion",
    "youth": true,
    "crest": "img/clubs/lyo.png"
  },
  {
    "id": "mon",
    "name": "Monaco",
    "city": "Mônaco",
    "nation": "fr",
    "leagueId": "fra",
    "level": 4.0,
    "colors": [
      "#E31837",
      "#FFFFFF",
      "#E31837"
    ],
    "pattern": "bend",
    "charge": "diamond",
    "youth": true,
    "crest": "img/clubs/mon.png"
  },
  {
    "id": "lil",
    "name": "Lille",
    "city": "Lille",
    "nation": "fr",
    "leagueId": "fra",
    "level": 3.9,
    "colors": [
      "#E31837",
      "#0033A0",
      "#FFFFFF"
    ],
    "pattern": "pale",
    "charge": "dog",
    "youth": true,
    "crest": "img/clubs/lil.png"
  },
  {
    "id": "nic",
    "name": "Nice",
    "city": "Nice",
    "nation": "fr",
    "leagueId": "fra",
    "level": 3.8,
    "colors": [
      "#000000",
      "#E31837",
      "#FFFFFF"
    ],
    "pattern": "stripes",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/nic.png"
  },
  {
    "id": "intm",
    "name": "Inter",
    "city": "Milão",
    "nation": "it",
    "leagueId": "ita",
    "level": 4.7,
    "colors": [
      "#010E80",
      "#000000",
      "#FFFFFF"
    ],
    "pattern": "stripes",
    "charge": "snake",
    "youth": true,
    "crest": "img/clubs/intm.png"
  },
  {
    "id": "miln",
    "name": "Milan",
    "city": "Milão",
    "nation": "it",
    "leagueId": "ita",
    "level": 4.6,
    "colors": [
      "#FB090B",
      "#000000",
      "#FB090B"
    ],
    "pattern": "stripes",
    "charge": "cross",
    "youth": true,
    "crest": "img/clubs/miln.png"
  },
  {
    "id": "juv",
    "name": "Juventus",
    "city": "Turim",
    "nation": "it",
    "leagueId": "ita",
    "level": 4.6,
    "colors": [
      "#000000",
      "#FFFFFF",
      "#000000"
    ],
    "pattern": "stripes",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/juv.png"
  },
  {
    "id": "nap",
    "name": "Napoli",
    "city": "Nápoles",
    "nation": "it",
    "leagueId": "ita",
    "level": 4.4,
    "colors": [
      "#12A0D7",
      "#FFFFFF",
      "#12A0D7"
    ],
    "pattern": "solid",
    "charge": "donkey",
    "youth": true,
    "crest": "img/clubs/nap.png"
  },
  {
    "id": "rom",
    "name": "Roma",
    "city": "Roma",
    "nation": "it",
    "leagueId": "ita",
    "level": 4.3,
    "colors": [
      "#8E1F2F",
      "#F0BC42",
      "#8E1F2F"
    ],
    "pattern": "solid",
    "charge": "wolf",
    "youth": true,
    "crest": "img/clubs/rom.png"
  },
  {
    "id": "laz",
    "name": "Lazio",
    "city": "Roma",
    "nation": "it",
    "leagueId": "ita",
    "level": 4.1,
    "colors": [
      "#87D8F7",
      "#FFFFFF",
      "#87D8F7"
    ],
    "pattern": "solid",
    "charge": "eagle",
    "youth": true,
    "crest": "img/clubs/laz.png"
  },
  {
    "id": "bay",
    "name": "Bayern",
    "city": "Munique",
    "nation": "de",
    "leagueId": "ger",
    "level": 5.0,
    "colors": [
      "#DC052D",
      "#FFFFFF",
      "#0066B2"
    ],
    "pattern": "solid",
    "charge": "diamond",
    "youth": true,
    "crest": "img/clubs/bay.png"
  },
  {
    "id": "bvb",
    "name": "Borussia Dortmund",
    "city": "Dortmund",
    "nation": "de",
    "leagueId": "ger",
    "level": 4.6,
    "colors": [
      "#FDE100",
      "#000000",
      "#FDE100"
    ],
    "pattern": "hoops",
    "charge": "crown",
    "youth": true,
    "crest": "img/clubs/bvb.png"
  },
  {
    "id": "rbl",
    "name": "RB Leipzig",
    "city": "Leipzig",
    "nation": "de",
    "leagueId": "ger",
    "level": 4.3,
    "colors": [
      "#E31837",
      "#FFFFFF",
      "#0A1D3B"
    ],
    "pattern": "solid",
    "charge": "bull",
    "youth": true,
    "crest": "img/clubs/rbl.png"
  },
  {
    "id": "lev",
    "name": "Leverkusen",
    "city": "Leverkusen",
    "nation": "de",
    "leagueId": "ger",
    "level": 4.3,
    "colors": [
      "#E32221",
      "#000000",
      "#FFFFFF"
    ],
    "pattern": "solid",
    "charge": "pill",
    "youth": true,
    "crest": "img/clubs/lev.png"
  },
  {
    "id": "ein",
    "name": "Eintracht",
    "city": "Frankfurt",
    "nation": "de",
    "leagueId": "ger",
    "level": 4.1,
    "colors": [
      "#E1000F",
      "#000000",
      "#FFFFFF"
    ],
    "pattern": "solid",
    "charge": "eagle",
    "youth": true,
    "crest": "img/clubs/ein.png"
  },
  {
    "id": "stu",
    "name": "Stuttgart",
    "city": "Stuttgart",
    "nation": "de",
    "leagueId": "ger",
    "level": 4.0,
    "colors": [
      "#FFFFFF",
      "#E31837",
      "#FFFFFF"
    ],
    "pattern": "hoops",
    "charge": "horse",
    "youth": true,
    "crest": "img/clubs/stu.png"
  },
  {
    "id": "aja",
    "name": "Ajax",
    "city": "Amsterdã",
    "nation": "nl",
    "leagueId": "ned",
    "level": 4.2,
    "colors": [
      "#D2122E",
      "#FFFFFF",
      "#D2122E"
    ],
    "pattern": "solid",
    "charge": "circle",
    "youth": true,
    "crest": "img/clubs/aja.png"
  },
  {
    "id": "psv",
    "name": "PSV",
    "city": "Eindhoven",
    "nation": "nl",
    "leagueId": "ned",
    "level": 4.1,
    "colors": [
      "#E31837",
      "#FFFFFF",
      "#E31837"
    ],
    "pattern": "stripes",
    "charge": "bulb",
    "youth": true,
    "crest": "img/clubs/psv.png"
  },
  {
    "id": "fey",
    "name": "Feyenoord",
    "city": "Roterdã",
    "nation": "nl",
    "leagueId": "ned",
    "level": 4.0,
    "colors": [
      "#E31837",
      "#FFFFFF",
      "#000000"
    ],
    "pattern": "thirds",
    "charge": "crest",
    "youth": true,
    "crest": "img/clubs/fey.png"
  },
  {
    "id": "mia",
    "name": "Inter Miami",
    "city": "Miami",
    "nation": "us",
    "leagueId": "usa",
    "level": 3.4,
    "colors": [
      "#F7B5CD",
      "#000000",
      "#F7B5CD"
    ],
    "pattern": "solid",
    "charge": "heron",
    "youth": true,
    "crest": "img/clubs/mia.png"
  },
  {
    "id": "laf",
    "name": "LAFC",
    "city": "Los Angeles",
    "nation": "us",
    "leagueId": "usa",
    "level": 3.3,
    "colors": [
      "#000000",
      "#C39E6D",
      "#000000"
    ],
    "pattern": "solid",
    "charge": "wing",
    "youth": true,
    "crest": "img/clubs/laf.png"
  },
  {
    "id": "atl",
    "name": "Atlanta United",
    "city": "Atlanta",
    "nation": "us",
    "leagueId": "usa",
    "level": 3.2,
    "colors": [
      "#80000B",
      "#000000",
      "#A39064"
    ],
    "pattern": "solid",
    "charge": "circle",
    "youth": true,
    "crest": "img/clubs/atl.png"
  },
  {
    "id": "ura",
    "name": "Urawa Reds",
    "city": "Saitama",
    "nation": "jp",
    "leagueId": "jpn",
    "level": 3.2,
    "colors": [
      "#E60012",
      "#FFFFFF",
      "#E60012"
    ],
    "pattern": "solid",
    "charge": "diamond",
    "youth": true,
    "crest": "img/clubs/ura.png"
  },
  {
    "id": "kas",
    "name": "Kashima Antlers",
    "city": "Kashima",
    "nation": "jp",
    "leagueId": "jpn",
    "level": 3.1,
    "colors": [
      "#E31837",
      "#0033A0",
      "#FFFFFF"
    ],
    "pattern": "solid",
    "charge": "antler",
    "youth": true,
    "crest": "img/clubs/kas.png"
  },
  {
    "id": "yok",
    "name": "Yokohama F. Marinos",
    "city": "Yokohama",
    "nation": "jp",
    "leagueId": "jpn",
    "level": 3.1,
    "colors": [
      "#0033A0",
      "#FFFFFF",
      "#E31837"
    ],
    "pattern": "solid",
    "charge": "wave",
    "youth": true,
    "crest": "img/clubs/yok.png"
  },
  {
    "id": "eny",
    "name": "Enyimba",
    "city": "Aba",
    "nation": "ng",
    "leagueId": "nga",
    "level": 2.5,
    "colors": [
      "#007A33",
      "#FFFFFF",
      "#007A33"
    ],
    "pattern": "solid",
    "charge": "elephant",
    "youth": true,
    "crest": "img/clubs/eny.png"
  },
  {
    "id": "kan",
    "name": "Kano Pillars",
    "city": "Kano",
    "nation": "ng",
    "leagueId": "nga",
    "level": 2.3,
    "colors": [
      "#F9D616",
      "#007A33",
      "#F9D616"
    ],
    "pattern": "pale",
    "charge": "pillar",
    "youth": true,
    "crest": "img/clubs/kan.png"
  },
  {
    "id": "jrf",
    "name": "Jaraaf",
    "city": "Dacar",
    "nation": "sn",
    "leagueId": "sen",
    "level": 2.2,
    "colors": [
      "#00853F",
      "#FDEF42",
      "#E31C23"
    ],
    "pattern": "solid",
    "charge": "star",
    "youth": true,
    "crest": "img/clubs/jrf.png"
  },
  {
    "id": "dia",
    "name": "Diambars",
    "city": "Saly",
    "nation": "sn",
    "leagueId": "sen",
    "level": 2.1,
    "colors": [
      "#0033A0",
      "#FFFFFF",
      "#0033A0"
    ],
    "pattern": "solid",
    "charge": "ball",
    "youth": true,
    "crest": "img/clubs/dia.png"
  }
];

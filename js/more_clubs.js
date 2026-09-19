/* Club-country nations (flags on transfer/stay cards). Not playable NT origins. */
NATIONS = NATIONS.concat([
  { id: "sct", name: "Escócia", adj: "Escocês", conf: "uefa", ntCut: -4, flag: "img/flags/sct.png", clubOnly: true },
  { id: "be", name: "Bélgica", adj: "Belga", conf: "uefa", ntCut: -3, flag: "img/flags/be.png", clubOnly: true },
  { id: "tr", name: "Turquia", adj: "Turco", conf: "uefa", ntCut: -4, flag: "img/flags/tr.png", clubOnly: true }
]);

/* LEAGUE_SEASON placements: Brasileirão 2026 + EUR 2026/27 — see LEAGUE_SEASON in world.js */
LEAGUES = LEAGUES.concat([
  { id: "bel", name: "Pro League", nation: "be", tier: 1, level: 3.6, continental: "ucl", size: 16, trophy: "premier", logo: "img/leagues/bel.png", color: "#FFD700" },
  { id: "tur", name: "Süper Lig", nation: "tr", tier: 1, level: 3.7, continental: "ucl", size: 19, trophy: "premier", logo: "img/leagues/tur.png", color: "#E30A17" },
  { id: "sco", name: "Premiership", nation: "sct", tier: 1, level: 3.3, continental: "ucl", size: 12, trophy: "copa", logo: "img/leagues/sco.png", color: "#005EB8" }
]);

function _xc(id, name, city, nation, leagueId, level, c1, c2) {
  return {
    id: id, name: name, city: city, nation: nation, leagueId: leagueId, level: level,
    colors: [c1, c2, c1], pattern: "solid", charge: "star", youth: true,
    crest: "img/clubs/" + id + ".png"
  };
}

CLUBS = CLUBS.concat([
  _xc("avl", "Aston Villa", "Birmingham", "en", "eng", 4.2, "#670E36", "#94BEE5"),
  _xc("whu", "West Ham", "Londres", "en", "eng2", 3.4, "#7A263A", "#1BB1E7"),
  _xc("bha", "Brighton", "Brighton", "en", "eng", 4.0, "#0057B8", "#FFFFFF"),
  _xc("eve", "Everton", "Liverpool", "en", "eng", 3.8, "#003399", "#FFFFFF"),
  _xc("cry", "Crystal Palace", "Londres", "en", "eng", 3.8, "#1B458F", "#C4122E"),
  _xc("ful", "Fulham", "Londres", "en", "eng", 3.8, "#000000", "#FFFFFF"),
  _xc("wol", "Wolves", "Wolverhampton", "en", "eng2", 3.3, "#FDB913", "#111111"),
  _xc("nfo", "Nottingham Forest", "Nottingham", "en", "eng", 3.9, "#DD0000", "#FFFFFF"),
  _xc("ath", "Athletic Bilbao", "Bilbao", "es", "esp", 4.1, "#EE2523", "#FFFFFF"),
  _xc("val", "Valencia", "Valência", "es", "esp", 3.9, "#EEEEEE", "#D50032"),
  _xc("bet", "Betis", "Sevilha", "es", "esp", 3.9, "#00954C", "#FFFFFF"),
  _xc("celv", "Celta", "Vigo", "es", "esp", 3.6, "#8AC3E8", "#FFFFFF"),
  _xc("ata", "Atalanta", "Bérgamo", "it", "ita", 4.2, "#1E71B8", "#000000"),
  _xc("fio", "Fiorentina", "Florença", "it", "ita", 4.0, "#482E92", "#FFFFFF"),
  _xc("bol", "Bologna", "Bolonha", "it", "ita", 3.8, "#A20A28", "#1A1A6C"),
  _xc("tor", "Torino", "Turim", "it", "ita", 3.7, "#8B1A1A", "#FFFFFF"),
  _xc("wlf", "Wolfsburg", "Wolfsburg", "de", "ger2", 3.2, "#65B32E", "#FFFFFF"),
  _xc("bmg", "Gladbach", "Mönchengladbach", "de", "ger", 3.8, "#000000", "#FFFFFF"),
  _xc("fre", "Freiburg", "Freiburg", "de", "ger", 3.8, "#000000", "#E30613"),
  _xc("hof", "Hoffenheim", "Sinsheim", "de", "ger", 3.7, "#1C63B7", "#FFFFFF"),
  _xc("renn", "Rennes", "Rennes", "fr", "fra", 3.8, "#E20E0E", "#000000"),
  _xc("len", "Lens", "Lens", "fr", "fra", 3.8, "#E30613", "#FCDD09"),
  _xc("str", "Strasbourg", "Estrasburgo", "fr", "fra", 3.6, "#009FE3", "#E30613"),
  _xc("nte", "Nantes", "Nantes", "fr", "fra2", 2.9, "#FFE200", "#00A651"),
  _xc("bra", "Braga", "Braga", "pt", "por", 3.8, "#E30613", "#FFFFFF"),
  _xc("vgu", "Vitória Guimarães", "Guimarães", "pt", "por", 3.4, "#FFFFFF", "#000000"),
  _xc("az", "AZ Alkmaar", "Alkmaar", "nl", "ned", 3.6, "#ED1C24", "#FFFFFF"),
  _xc("twt", "Twente", "Enschede", "nl", "ned", 3.5, "#E2001A", "#FFFFFF"),
  _xc("clb", "Club Brugge", "Bruges", "be", "bel", 3.9, "#0070B8", "#000000"),
  _xc("and", "Anderlecht", "Bruxelas", "be", "bel", 3.5, "#5A2D81", "#FFFFFF"),
  _xc("gal", "Galatasaray", "Istambul", "tr", "tur", 3.9, "#FDB912", "#A32521"),
  _xc("fen", "Fenerbahçe", "Istambul", "tr", "tur", 3.8, "#002F6C", "#FFED00"),
  _xc("cel", "Celtic", "Glasgow", "sct", "sco", 3.6, "#018749", "#FFFFFF"),
  _xc("ran", "Rangers", "Glasgow", "sct", "sco", 3.6, "#054C9E", "#FFFFFF")
]);

/* League trophy / cup mapping — proper names via TROPHIES ids */
(function patchLeagueTrophies() {
  var map = {
    bra: { trophy: "brasileirao", cupTrophy: "copa_br" },
    brb: { trophy: "serie_b", cupTrophy: "copa_br" },
    arg: { trophy: "ligapro", cupTrophy: "copa_arg" },
    uru: { trophy: "uruprimera", cupTrophy: "copa" },
    col: { trophy: "colbetplay", cupTrophy: "copa" },
    mex: { trophy: "liga_mx", cupTrophy: "copa" },
    por: { trophy: "primerliga", cupTrophy: "taca_pt" },
    esp: { trophy: "laliga", cupTrophy: "copa_rey" },
    eng: { trophy: "premier", cupTrophy: "fa_cup" },
    fra: { trophy: "ligue1", cupTrophy: "coupe_fr" },
    ita: { trophy: "seriea", cupTrophy: "coppa_ita" },
    ger: { trophy: "bundesliga", cupTrophy: "dfb_pokal" },
    ned: { trophy: "eredivisie", cupTrophy: "copa" },
    usa: { trophy: "mls", cupTrophy: "copa" },
    jpn: { trophy: "j1", cupTrophy: "copa" },
    nga: { trophy: "npfl", cupTrophy: "copa" },
    sen: { trophy: "senliga", cupTrophy: "copa" },
    bel: { trophy: "proleague", cupTrophy: "copa" },
    tur: { trophy: "superlig", cupTrophy: "copa" },
    sco: { trophy: "scottish", cupTrophy: "copa" },
    brc: { trophy: "copa", cupTrophy: "copa_br" },
    eng2: { trophy: "copa", cupTrophy: "fa_cup" },
    ger2: { trophy: "copa", cupTrophy: "dfb_pokal" },
    fra2: { trophy: "copa", cupTrophy: "coupe_fr" }
  };
  for (var i = 0; i < LEAGUES.length; i++) {
    var m = map[LEAGUES[i].id];
    if (!m) continue;
    LEAGUES[i].trophy = m.trophy;
    LEAGUES[i].cupTrophy = m.cupTrophy;
  }
})();

/* Lower-tier / extra clubs so thin nations always have ≥3 academy options */
CLUBS = CLUBS.concat([
  _xc("dan", "Danubio", "Montevidéu", "uy", "uru", 2.6, "#000000", "#FFFFFF"),
  _xc("rivu", "River Plate UY", "Montevidéu", "uy", "uru", 2.5, "#CE1126", "#FFFFFF"),
  _xc("jun", "Junior", "Barranquilla", "co", "col", 3.0, "#CE1126", "#FFFFFF"),
  _xc("dep", "Deportivo Cali", "Cali", "co", "col", 2.9, "#007A33", "#FFFFFF"),
  _xc("tol", "Toluca", "Toluca", "mx", "mex", 3.4, "#CE1126", "#FFFFFF"),
  _xc("paz", "Cruz Azul", "Cidade do México", "mx", "mex", 3.5, "#0033A0", "#FFFFFF"),
  _xc("sea", "Seattle Sounders", "Seattle", "us", "usa", 3.1, "#5D9732", "#0033A0"),
  _xc("nyc", "NYCFC", "Nova York", "us", "usa", 3.0, "#6CACE4", "#00285E"),
  _xc("kaw", "Kawasaki Frontale", "Kawasaki", "jp", "jpn", 3.0, "#87CEEB", "#000080"),
  _xc("cer", "Cerezo Osaka", "Osaka", "jp", "jpn", 2.8, "#CE1126", "#FF69B4"),
  _xc("rvs", "Rivers United", "Port Harcourt", "ng", "nga", 2.2, "#0033A0", "#FFFFFF"),
  _xc("ranfc", "Rangers Int'l", "Enugu", "ng", "nga", 2.1, "#FFD700", "#0033A0"),
  _xc("gen", "Génération Foot", "Dakar", "sn", "sen", 2.0, "#00853F", "#E31C23"),
  _xc("ouc", "US Ouakam", "Dakar", "sn", "sen", 1.9, "#FFFFFF", "#00853F"),
  _xc("hur", "Huracán", "Buenos Aires", "ar", "arg", 3.2, "#FFFFFF", "#CE1126"),
  _xc("vel", "Vélez", "Buenos Aires", "ar", "arg", 3.4, "#FFFFFF", "#0033A0"),
  _xc("gio", "Náutico", "Recife", "br", "brb", 2.3, "#0033A0", "#FFFFFF"),
  _xc("csa", "CSA", "Maceió", "br", "brc", 2.1, "#0033A0", "#FFFFFF"),

  /* --- synced Brasileirão 2026 (Série A promoted / missing) --- */
  _xc("mir", "Mirassol", "Mirassol", "br", "bra", 3.2, "#FFD100", "#0066B3"),
  _xc("vit", "Vitória", "Salvador", "br", "bra", 3.3, "#E31837", "#000000"),
  _xc("ctb", "Coritiba", "Curitiba", "br", "bra", 3.3, "#007A33", "#FFFFFF"),
  _xc("chp", "Chapecoense", "Chapecó", "br", "bra", 3.1, "#007A33", "#FFFFFF"),
  _xc("rem", "Remo", "Belém", "br", "bra", 3.0, "#0033A0", "#FFFFFF"),

  /* --- synced Brasileirão Série B 2026 --- */
  _xc("jve", "Juventude", "Caxias do Sul", "br", "brb", 2.9, "#007A33", "#FFFFFF"),
  _xc("lon", "Londrina", "Londrina", "br", "brb", 2.5, "#0033A0", "#FFFFFF"),
  _xc("sbe", "São Bernardo", "São Bernardo", "br", "brb", 2.5, "#FFD100", "#000000"),
  _xc("cri", "Criciúma", "Criciúma", "br", "brb", 2.7, "#FFD100", "#000000"),
  _xc("nov", "Novorizontino", "Novo Horizonte", "br", "brb", 2.6, "#FFD100", "#000000"),
  _xc("crb", "CRB", "Maceió", "br", "brb", 2.6, "#E31837", "#FFFFFF"),
  _xc("cui", "Cuiabá", "Cuiabá", "br", "brb", 2.7, "#007A33", "#FFD100"),
  _xc("ago", "Atlético-GO", "Goiânia", "br", "brb", 2.7, "#E31837", "#000000"),
  _xc("ope", "Operário-PR", "Ponta Grossa", "br", "brb", 2.5, "#000000", "#FFFFFF"),
  _xc("vna", "Vila Nova", "Goiânia", "br", "brb", 2.5, "#E31837", "#FFFFFF"),
  _xc("amg", "América-MG", "Belo Horizonte", "br", "brb", 2.8, "#007A33", "#000000"),
  _xc("athm", "Athletic-MG", "São João del-Rei", "br", "brb", 2.4, "#000000", "#FFFFFF"),
  _xc("bsp", "Botafogo-SP", "Ribeirão Preto", "br", "brb", 2.5, "#E31837", "#000000"),

  /* --- Premier League 2026/27 (promoted + missing top-flight) --- */
  _xc("cov", "Coventry", "Coventry", "en", "eng", 3.5, "#77C7F2", "#FFFFFF"),
  _xc("ips", "Ipswich", "Ipswich", "en", "eng", 3.6, "#0033A0", "#FFFFFF"),
  _xc("hul", "Hull City", "Hull", "en", "eng", 3.5, "#F5A12D", "#000000"),
  _xc("bou", "Bournemouth", "Bournemouth", "en", "eng", 3.7, "#DA291C", "#000000"),
  _xc("bre", "Brentford", "Londres", "en", "eng", 3.8, "#E30613", "#FFFFFF"),
  _xc("lee", "Leeds", "Leeds", "en", "eng", 3.8, "#FFFFFF", "#1D355E"),
  _xc("sun", "Sunderland", "Sunderland", "en", "eng", 3.6, "#E30613", "#FFFFFF"),

  /* --- Bundesliga 2026/27 promoted --- */
  _xc("s04", "Schalke", "Gelsenkirchen", "de", "ger", 3.6, "#004D95", "#FFFFFF"),
  _xc("elv", "Elversberg", "Elversberg", "de", "ger", 3.2, "#FFFFFF", "#000000"),
  _xc("pad", "Paderborn", "Paderborn", "de", "ger", 3.3, "#005CA9", "#FFFFFF"),

  /* --- Ligue 1 2026/27 promoted --- */
  _xc("tro", "Troyes", "Troyes", "fr", "fra", 3.2, "#0033A0", "#FFFFFF"),
  _xc("lem", "Le Mans", "Le Mans", "fr", "fra", 3.1, "#E30613", "#FFD100")
]);

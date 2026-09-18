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
  _xc("whu", "West Ham", "Londres", "en", "eng", 4.0, "#7A263A", "#1BB1E7"),
  _xc("bha", "Brighton", "Brighton", "en", "eng", 4.0, "#0057B8", "#FFFFFF"),
  _xc("eve", "Everton", "Liverpool", "en", "eng", 3.8, "#003399", "#FFFFFF"),
  _xc("cry", "Crystal Palace", "Londres", "en", "eng", 3.8, "#1B458F", "#C4122E"),
  _xc("ful", "Fulham", "Londres", "en", "eng", 3.8, "#000000", "#FFFFFF"),
  _xc("wol", "Wolves", "Wolverhampton", "en", "eng", 3.7, "#FDB913", "#111111"),
  _xc("nfo", "Nottingham Forest", "Nottingham", "en", "eng", 3.9, "#DD0000", "#FFFFFF"),
  _xc("ath", "Athletic Bilbao", "Bilbao", "es", "esp", 4.1, "#EE2523", "#FFFFFF"),
  _xc("val", "Valencia", "Valência", "es", "esp", 3.9, "#EEEEEE", "#D50032"),
  _xc("bet", "Betis", "Sevilha", "es", "esp", 3.9, "#00954C", "#FFFFFF"),
  _xc("celv", "Celta", "Vigo", "es", "esp", 3.6, "#8AC3E8", "#FFFFFF"),
  _xc("ata", "Atalanta", "Bérgamo", "it", "ita", 4.2, "#1E71B8", "#000000"),
  _xc("fio", "Fiorentina", "Florença", "it", "ita", 4.0, "#482E92", "#FFFFFF"),
  _xc("bol", "Bologna", "Bolonha", "it", "ita", 3.8, "#A20A28", "#1A1A6C"),
  _xc("tor", "Torino", "Turim", "it", "ita", 3.7, "#8B1A1A", "#FFFFFF"),
  _xc("wlf", "Wolfsburg", "Wolfsburg", "de", "ger", 3.8, "#65B32E", "#FFFFFF"),
  _xc("bmg", "Gladbach", "Mönchengladbach", "de", "ger", 3.8, "#000000", "#FFFFFF"),
  _xc("fre", "Freiburg", "Freiburg", "de", "ger", 3.8, "#000000", "#E30613"),
  _xc("hof", "Hoffenheim", "Sinsheim", "de", "ger", 3.7, "#1C63B7", "#FFFFFF"),
  _xc("renn", "Rennes", "Rennes", "fr", "fra", 3.8, "#E20E0E", "#000000"),
  _xc("len", "Lens", "Lens", "fr", "fra", 3.8, "#E30613", "#FCDD09"),
  _xc("str", "Strasbourg", "Estrasburgo", "fr", "fra", 3.6, "#009FE3", "#E30613"),
  _xc("nte", "Nantes", "Nantes", "fr", "fra", 3.5, "#FFE200", "#00A651"),
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

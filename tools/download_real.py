# -*- coding: utf-8 -*-
"""Baixa escudos, logos de liga e taças reais (TheSportsDB + Wikimedia)."""
import json
import os
import re
import time
import urllib.parse
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
UA = "LendaCareerSim/1.0 (local personal game; briel)"
API = "https://www.thesportsdb.com/api/v1/json/3"

CLUBS = {
    "fla": ("Flamengo", "Brazil"),
    "pal": ("Palmeiras", "Brazil"),
    "cor": ("Corinthians", "Brazil"),
    "sao": ("Sao Paulo", "Brazil"),
    "san": ("Santos FC", "Brazil"),
    "gre": ("Gremio", "Brazil"),
    "inter": ("Internacional", "Brazil"),
    "cam": ("Atletico Mineiro", "Brazil"),
    "flu": ("Fluminense", "Brazil"),
    "bot": ("Botafogo", "Brazil"),
    "vas": ("Vasco da Gama", "Brazil"),
    "cap": ("Athletico Paranaense", "Brazil"),
    "bah": ("Bahia", "Brazil"),
    "for": ("Fortaleza", "Brazil"),
    "cru": ("Cruzeiro", "Brazil"),
    "rbb": ("Red Bull Bragantino", "Brazil"),
    "spt": ("Sport Recife", "Brazil"),
    "cea": ("Ceara", "Brazil"),
    "goi": ("Goias", "Brazil"),
    "gua": ("Guarani Campinas", "Brazil"),
    "pon": ("Ponte Preta", "Brazil"),
    "ava": ("Avai", "Brazil"),
    "boc": ("Boca Juniors", "Argentina"),
    "riv": ("River Plate", "Argentina"),
    "rac": ("Racing Club", "Argentina"),
    "ind": ("Independiente", "Argentina"),
    "sla": ("San Lorenzo", "Argentina"),
    "est": ("Estudiantes de La Plata", "Argentina"),
    "nac": ("Nacional Montevideo", "Uruguay"),
    "pen": ("Penarol", "Uruguay"),
    "def": ("Defensor Sporting", "Uruguay"),
    "nal": ("Atletico Nacional Medellin", "Colombia"),
    "mil": ("Millonarios", "Colombia"),
    "amec": ("America de Cali", "Colombia"),
    "amea": ("Club America", "Mexico"),
    "chi": ("Chivas Guadalajara", "Mexico"),
    "mty": ("Monterrey", "Mexico"),
    "tig": ("Tigres UANL", "Mexico"),
    "ben": ("Benfica", "Portugal"),
    "por": ("FC Porto", "Portugal"),
    "spo": ("Sporting CP", "Portugal"),
    "rma": ("Real Madrid", "Spain"),
    "fcb": ("Barcelona", "Spain"),
    "atm": ("Atletico Madrid", "Spain"),
    "sev": ("Sevilla", "Spain"),
    "vil": ("Villarreal", "Spain"),
    "rso": ("Real Sociedad", "Spain"),
    "mci": ("Manchester City", "England"),
    "ars": ("Arsenal", "England"),
    "liv": ("Liverpool", "England"),
    "che": ("Chelsea", "England"),
    "mun": ("Manchester United", "England"),
    "tot": ("Tottenham", "England"),
    "new": ("Newcastle United", "England"),
    "psg": ("Paris SG", "France"),
    "mar": ("Marseille", "France"),
    "lyo": ("Lyon", "France"),
    "mon": ("Monaco", "France"),
    "lil": ("Lille", "France"),
    "nic": ("Nice", "France"),
    "intm": ("Inter Milan", "Italy"),
    "miln": ("AC Milan", "Italy"),
    "juv": ("Juventus", "Italy"),
    "nap": ("Napoli", "Italy"),
    "rom": ("AS Roma", "Italy"),
    "laz": ("Lazio", "Italy"),
    "bay": ("Bayern Munich", "Germany"),
    "bvb": ("Borussia Dortmund", "Germany"),
    "rbl": ("RB Leipzig", "Germany"),
    "lev": ("Bayer Leverkusen", "Germany"),
    "ein": ("Eintracht Frankfurt", "Germany"),
    "stu": ("VfB Stuttgart", "Germany"),
    "aja": ("Ajax", "Netherlands"),
    "psv": ("PSV Eindhoven", "Netherlands"),
    "fey": ("Feyenoord", "Netherlands"),
    "mia": ("Inter Miami", "USA"),
    "laf": ("Los Angeles FC", "USA"),
    "atl": ("Atlanta United", "USA"),
    "ura": ("Urawa Red Diamonds", "Japan"),
    "kas": ("Kashima Antlers", "Japan"),
    "yok": ("Yokohama F. Marinos", "Japan"),
    "eny": ("Enyimba", "Nigeria"),
    "kan": ("Kano Pillars", "Nigeria"),
    "jrf": ("ASC Jaraaf", "Senegal"),
    "dia": ("Diambars FC", "Senegal"),
}

LEAGUES = {
    "bra": ("Brazilian Serie A", "Brazil"),
    "brb": ("Brazilian Serie B", "Brazil"),
    "arg": ("Argentine Primera Division", "Argentina"),
    "uru": ("Uruguayan Primera Division", "Uruguay"),
    "col": ("Colombian Primera A", "Colombia"),
    "mex": ("Mexican Primera League", "Mexico"),
    "por": ("Portuguese Primeira Liga", "Portugal"),
    "esp": ("Spanish La Liga", "Spain"),
    "eng": ("English Premier League", "England"),
    "fra": ("French Ligue 1", "France"),
    "ita": ("Italian Serie A", "Italy"),
    "ger": ("German Bundesliga", "Germany"),
    "ned": ("Dutch Eredivisie", "Netherlands"),
    "usa": ("American Major League Soccer", "USA"),
    "jpn": ("Japanese J1 League", "Japan"),
    "nga": ("Nigerian Professional Football League", "Nigeria"),
    "sen": ("Senegalese Ligue 1", "Senegal"),
}

TROPHY_LEAGUES = {
    "brasileirao": ("Brazilian Serie A", "Brazil"),
    "premier": ("English Premier League", "England"),
    "copa": ("Copa do Brasil", "Brazil"),
    "libertadores": ("Copa Libertadores", None),
    "ucl": ("UEFA Champions League", None),
    "clubworldcup": ("FIFA Club World Cup", None),
    "worldcup": ("FIFA World Cup", None),
    "copaamerica": ("Copa America", None),
    "euro": ("UEFA European Championships", None),
    "youth": ("FIFA U-20 World Cup", None),
}

WIKI_FILES = {
    "balon": "Ballon d'Or.svg",
    "bota": "European Golden Shoe.svg",
    "luva": "Yashin Trophy.png",
    "mvp": "FIFA World Player of the Year.svg",
}


def api(path):
    url = API + path
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as resp:
        return json.loads(resp.read().decode("utf-8", "replace"))


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
        ctype = resp.headers.get("Content-Type", "")
    ext = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower()
    if ext not in (".png", ".jpg", ".jpeg", ".svg", ".webp"):
        if "png" in ctype:
            ext = ".png"
        elif "svg" in ctype:
            ext = ".svg"
        elif "webp" in ctype:
            ext = ".webp"
        else:
            ext = ".jpg"
    path = dest + ext
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)
    return path.replace("\\", "/").split("/lenda/")[-1].replace("\\", "/") if False else path


def rel(path):
    return os.path.relpath(path, ROOT).replace("\\", "/")


def pick_team(teams, country):
    if not teams:
        return None
    country = (country or "").lower()
    for t in teams:
        if (t.get("strCountry") or "").lower() == country and (t.get("strSport") or "") in ("Soccer", "Association Football", ""):
            if t.get("strBadge") or t.get("strTeamBadge"):
                return t
    for t in teams:
        if (t.get("strCountry") or "").lower() == country:
            return t
    return teams[0]


def search_team(name, country):
    q = urllib.parse.quote(name)
    d = api("/searchteams.php?t=" + q)
    return pick_team(d.get("teams") or [], country)


def search_league(name, country):
    # search_all_leagues by country, then match name
    tries = []
    if country:
        tries.append("/search_all_leagues.php?c=" + urllib.parse.quote(country))
    tries.append("/search_all_leagues.php?c=" + urllib.parse.quote(name.split()[0] if name else "World"))
    # Europe competitions
    tries.append("/search_all_leagues.php?c=Europe")
    tries.append("/search_all_leagues.php?c=World")
    want = name.lower()
    for path in tries:
        try:
            d = api(path)
        except Exception:
            continue
        leagues = d.get("countries") or d.get("leagues") or []
        for L in leagues:
            title = (L.get("strLeague") or "").lower()
            if want in title or title in want:
                return L
        # looser token match
        tokens = [t for t in re.split(r"\W+", want) if len(t) > 3]
        best = None
        best_n = 0
        for L in leagues:
            title = (L.get("strLeague") or "").lower()
            n = sum(1 for t in tokens if t in title)
            if n > best_n:
                best, best_n = L, n
        if best and best_n >= 2:
            return best
        time.sleep(0.15)
    return None


def commons(filename, dest_base):
    url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(filename) + "?width=800"
    return download(url, dest_base)


def badge_url(team):
    return team.get("strBadge") or team.get("strTeamBadge")


def main():
    paths = {"clubs": {}, "leagues": {}, "trophies": {}}
    fail = []

    print("clubs...")
    for cid, (name, country) in CLUBS.items():
        try:
            t = search_team(name, country)
            url = badge_url(t) if t else None
            if not url:
                fail.append("club " + cid + " " + name)
                print("  MISS", cid, name)
            else:
                p = download(url, os.path.join(ROOT, "img", "clubs", cid))
                paths["clubs"][cid] = rel(p)
                print("  OK", cid, paths["clubs"][cid])
            time.sleep(0.12)
        except Exception as e:
            fail.append("club " + cid + " " + str(e))
            print("  ERR", cid, e)

    print("leagues...")
    for lid, (name, country) in LEAGUES.items():
        try:
            L = search_league(name, country)
            url = None
            if L:
                url = L.get("strBadge") or L.get("strLogo")
            if not url:
                fail.append("league " + lid)
                print("  MISS", lid, name)
            else:
                p = download(url, os.path.join(ROOT, "img", "leagues", lid))
                paths["leagues"][lid] = rel(p)
                print("  OK", lid, paths["leagues"][lid])
            time.sleep(0.12)
        except Exception as e:
            fail.append("league " + lid + " " + str(e))
            print("  ERR", lid, e)

    print("trophies...")
    for tid, (name, country) in TROPHY_LEAGUES.items():
        try:
            L = search_league(name, country)
            url = None
            if L:
                url = L.get("strTrophy") or L.get("strBadge")
            if not url:
                fail.append("trophy " + tid)
                print("  MISS", tid, name)
            else:
                p = download(url, os.path.join(ROOT, "img", "trophies", tid))
                paths["trophies"][tid] = rel(p)
                print("  OK", tid, paths["trophies"][tid])
            time.sleep(0.12)
        except Exception as e:
            fail.append("trophy " + tid + " " + str(e))
            print("  ERR", tid, e)

    for tid, fname in WIKI_FILES.items():
        try:
            p = commons(fname, os.path.join(ROOT, "img", "trophies", tid))
            paths["trophies"][tid] = rel(p)
            print("  OK wiki", tid, paths["trophies"][tid])
        except Exception as e:
            fail.append("wiki " + tid + " " + str(e))
            print("  ERR wiki", tid, e)

    man = os.path.join(ROOT, "img", "real_paths.json")
    with open(man, "w", encoding="utf-8") as f:
        json.dump({"paths": paths, "fail": fail}, f, ensure_ascii=False, indent=2)
    print("wrote", man, "fails", len(fail))


if __name__ == "__main__":
    main()

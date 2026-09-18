# -*- coding: utf-8 -*-
import json, os, time, urllib.parse, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
UA = "LendaCareerSim/1.0 (local personal game)"
API = "https://www.thesportsdb.com/api/v1/json/3"

CLUBS = {
    "nal": ("Atletico Nacional", "Colombia"),
    "mil": ("Millonarios", "Colombia"),
    "amec": ("America de Cali", "Colombia"),
    "amea": ("Club America", "Mexico"),
    "chi": ("Guadalajara", "Mexico"),
    "mty": ("Monterrey", "Mexico"),
    "tig": ("Tigres", "Mexico"),
    "ben": ("Benfica", "Portugal"),
    "por": ("FC Porto", "Portugal"),
    "spo": ("Sporting Lisbon", "Portugal"),
    "rma": ("Real Madrid", "Spain"),
    "fcb": ("FC Barcelona", "Spain"),
    "atm": ("Atletico Madrid", "Spain"),
    "sev": ("Sevilla", "Spain"),
    "vil": ("Villarreal", "Spain"),
    "rso": ("Real Sociedad", "Spain"),
    "mci": ("Manchester City", "England"),
    "ars": ("Arsenal", "England"),
    "liv": ("Liverpool", "England"),
    "che": ("Chelsea", "England"),
    "mun": ("Manchester United", "England"),
    "tot": ("Tottenham Hotspur", "England"),
    "new": ("Newcastle", "England"),
    "psg": ("Paris Saint Germain", "France"),
    "mar": ("Olympique Marseille", "France"),
    "lyo": ("Olympique Lyonnais", "France"),
    "mon": ("AS Monaco", "France"),
    "lil": ("Lille", "France"),
    "nic": ("OGC Nice", "France"),
    "intm": ("Inter", "Italy"),
    "miln": ("Milan", "Italy"),
    "juv": ("Juventus", "Italy"),
    "nap": ("Napoli", "Italy"),
    "rom": ("Roma", "Italy"),
    "laz": ("Lazio", "Italy"),
    "bay": ("Bayern Munich", "Germany"),
    "bvb": ("Borussia Dortmund", "Germany"),
    "rbl": ("RB Leipzig", "Germany"),
    "lev": ("Bayer Leverkusen", "Germany"),
    "ein": ("Eintracht Frankfurt", "Germany"),
    "stu": ("Stuttgart", "Germany"),
    "aja": ("Ajax", "Netherlands"),
    "psv": ("PSV", "Netherlands"),
    "fey": ("Feyenoord", "Netherlands"),
    "mia": ("Inter Miami", "United States"),
    "laf": ("Los Angeles FC", "United States"),
    "atl": ("Atlanta United", "United States"),
    "ura": ("Urawa Reds", "Japan"),
    "kas": ("Kashima Antlers", "Japan"),
    "yok": ("Yokohama F. Marinos", "Japan"),
    "eny": ("Enyimba", "Nigeria"),
    "kan": ("Kano Pillars", "Nigeria"),
    "jrf": ("Jaraaf", "Senegal"),
    "dia": ("Diambars", "Senegal"),
}

LEAGUE_IDS = {
    "bra": 4351,
    "brb": 4404,
    "arg": 4406,
    "uru": 4459,
    "col": 4545,
    "mex": 4345,
    "por": 4344,
    "esp": 4335,
    "eng": 4328,
    "fra": 4334,
    "ita": 4332,
    "ger": 4331,
    "ned": 4337,
    "usa": 4346,
    "jpn": 4355,
    "nga": 4726,
    "sen": 4735,
}

TROPHY_IDS = {
    "brasileirao": 4351,
    "premier": 4328,
    "copa": 4484,
    "libertadores": 4482,
    "ucl": 4480,
    "clubworldcup": 4485,
    "worldcup": 4429,
    "copaamerica": 4483,
    "euro": 4428,
    "youth": 4501,
}

COMMONS_Q = {
    "balon": "Ballon d'Or trophy",
    "bota": "European Golden Shoe",
    "luva": "Yashin Trophy",
    "mvp": "FIFA The Best trophy",
    "worldcup": "FIFA World Cup Trophy",
    "ucl": "UEFA Champions League trophy",
    "libertadores": "Copa Libertadores trophy",
    "copaamerica": "Copa America trophy",
    "euro": "Henri Delaunay Trophy",
    "clubworldcup": "FIFA Club World Cup trophy",
    "brasileirao": "Troféu Campeonato Brasileiro",
    "premier": "Premier League Trophy",
    "copa": "Copa do Brasil trophy",
    "youth": "FIFA U-20 World Cup trophy",
}


def req(url, retries=6):
    last = None
    for i in range(retries):
        try:
            r = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(r, timeout=30) as resp:
                return resp.read(), resp.headers.get("Content-Type", "")
        except urllib.error.HTTPError as e:
            last = e
            if e.code == 429:
                time.sleep(8 + i * 5)
                continue
            raise
        except Exception as e:
            last = e
            time.sleep(2)
    raise last


def api(path):
    raw, _ = req(API + path)
    return json.loads(raw.decode("utf-8", "replace"))


def save_bytes(data, dest_base, url, ctype):
    ext = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower()
    if ext not in (".png", ".jpg", ".jpeg", ".svg", ".webp"):
        if "png" in (ctype or ""):
            ext = ".png"
        elif "svg" in (ctype or ""):
            ext = ".svg"
        else:
            ext = ".jpg"
    path = dest_base + ext
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)
    return os.path.relpath(path, ROOT).replace("\\", "/")


def download(url, dest_base):
    data, ctype = req(url)
    return save_bytes(data, dest_base, url, ctype)


def pick_team(teams, country):
    if not teams:
        return None
    c = (country or "").lower()
    aliases = {"united states": "usa", "usa": "united states"}
    for t in teams:
        tc = (t.get("strCountry") or "").lower()
        if tc == c or aliases.get(c) == tc or aliases.get(tc) == c:
            if t.get("strBadge"):
                return t
    return teams[0]


def main():
    paths = {"clubs": {}, "leagues": {}, "trophies": {}}
    fail = []

    print("clubs rest...")
    for cid, (name, country) in CLUBS.items():
        existing = [p for p in (cid + ".png", cid + ".jpg", cid + ".svg") if os.path.isfile(os.path.join(ROOT, "img", "clubs", p))]
        if existing:
            paths["clubs"][cid] = "img/clubs/" + existing[0]
            continue
        try:
            d = api("/searchteams.php?t=" + urllib.parse.quote(name))
            t = pick_team(d.get("teams") or [], country)
            url = (t or {}).get("strBadge")
            if not url:
                fail.append(cid)
                print(" MISS", cid, name)
            else:
                paths["clubs"][cid] = download(url, os.path.join(ROOT, "img", "clubs", cid))
                print(" OK", cid, paths["clubs"][cid])
            time.sleep(0.7)
        except Exception as e:
            fail.append(cid + " " + str(e))
            print(" ERR", cid, e)
            time.sleep(3)

    print("leagues...")
    for lid, lidn in LEAGUE_IDS.items():
        try:
            d = api("/lookupleague.php?id=" + str(lidn))
            L = (d.get("leagues") or [None])[0]
            url = None if not L else (L.get("strBadge") or L.get("strLogo"))
            if not url:
                fail.append("lg " + lid)
                print(" MISS", lid)
            else:
                paths["leagues"][lid] = download(url, os.path.join(ROOT, "img", "leagues", lid))
                print(" OK", lid, paths["leagues"][lid])
            time.sleep(0.7)
        except Exception as e:
            fail.append("lg " + lid + " " + str(e))
            print(" ERR", lid, e)
            time.sleep(4)

    print("trophies via leagues...")
    for tid, lidn in TROPHY_IDS.items():
        try:
            d = api("/lookupleague.php?id=" + str(lidn))
            L = (d.get("leagues") or [None])[0]
            url = None if not L else (L.get("strTrophy") or L.get("strBadge"))
            if not url:
                print(" MISS trophy", tid)
            else:
                paths["trophies"][tid] = download(url, os.path.join(ROOT, "img", "trophies", tid))
                print(" OK", tid, paths["trophies"][tid])
            time.sleep(0.7)
        except Exception as e:
            fail.append("tr " + tid + " " + str(e))
            print(" ERR", tid, e)
            time.sleep(4)

    print("commons fallback...")
    for tid, q in COMMONS_Q.items():
        dest_dir = os.path.join(ROOT, "img", "trophies")
        if any(os.path.isfile(os.path.join(dest_dir, tid + e)) for e in (".png", ".jpg", ".jpeg", ".svg", ".webp")):
            continue
        try:
            raw, _ = req(
                "https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&format=json&srlimit=8&srsearch="
                + urllib.parse.quote(q)
            )
            hits = json.loads(raw.decode()).get("query", {}).get("search") or []
            if not hits:
                fail.append("wiki " + tid)
                print(" MISS wiki", tid)
                continue
            title = hits[0]["title"].replace("File:", "")
            url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(title) + "?width=900"
            paths["trophies"][tid] = download(url, os.path.join(dest_dir, tid))
            print(" OK wiki", tid, title)
            time.sleep(0.5)
        except Exception as e:
            fail.append("wiki " + tid + " " + str(e))
            print(" ERR wiki", tid, e)

    man = os.path.join(ROOT, "img", "real_paths.json")
    prev = {}
    if os.path.isfile(man):
        with open(man, encoding="utf-8") as f:
            prev = json.load(f)
    merged = prev.get("paths") or {"clubs": {}, "leagues": {}, "trophies": {}}
    for k in paths:
        merged[k].update(paths[k])
    with open(man, "w", encoding="utf-8") as f:
        json.dump({"paths": merged, "fail": fail}, f, ensure_ascii=False, indent=2)
    print("fails", fail)


if __name__ == "__main__":
    main()

# -*- coding: utf-8 -*-
import os, time, urllib.parse
from download_real_rest import api, download, pick_team, ROOT

EXTRA = [
    ("avl", "Aston Villa", "England"),
    ("whu", "West Ham", "England"),
    ("bha", "Brighton", "England"),
    ("eve", "Everton", "England"),
    ("cry", "Crystal Palace", "England"),
    ("ful", "Fulham", "England"),
    ("wol", "Wolverhampton Wanderers", "England"),
    ("nfo", "Nottingham Forest", "England"),
    ("ath", "Athletic Club", "Spain"),
    ("val", "Valencia", "Spain"),
    ("bet", "Real Betis", "Spain"),
    ("celv", "Celta Vigo", "Spain"),
    ("ata", "Atalanta", "Italy"),
    ("fio", "Fiorentina", "Italy"),
    ("bol", "Bologna", "Italy"),
    ("tor", "Torino", "Italy"),
    ("wlf", "Wolfsburg", "Germany"),
    ("bmg", "Borussia Monchengladbach", "Germany"),
    ("fre", "Freiburg", "Germany"),
    ("hof", "Hoffenheim", "Germany"),
    ("renn", "Rennes", "France"),
    ("len", "Lens", "France"),
    ("str", "Strasbourg", "France"),
    ("nte", "Nantes", "France"),
    ("bra", "Braga", "Portugal"),
    ("vgu", "Vitoria Guimaraes", "Portugal"),
    ("az", "AZ Alkmaar", "Netherlands"),
    ("twt", "Twente", "Netherlands"),
    ("clb", "Club Brugge", "Belgium"),
    ("and", "Anderlecht", "Belgium"),
    ("gal", "Galatasaray", "Turkey"),
    ("fen", "Fenerbahce", "Turkey"),
    ("cel", "Celtic", "Scotland"),
    ("ran", "Rangers", "Scotland"),
]

LEAGUES = [
    ("bel", "Belgium"),
    ("tur", "Turkey"),
    ("sco", "Scotland"),
]


def main():
    for cid, name, country in EXTRA:
        dest = os.path.join(ROOT, "img", "clubs", cid + ".png")
        if os.path.isfile(dest):
            print("have", cid)
            continue
        try:
            d = api("/searchteams.php?t=" + urllib.parse.quote(name))
            teams = d.get("teams") or []
            soccer = [t for t in teams if (t.get("strSport") or "Soccer") in ("Soccer", "Association Football", "")]
            t = pick_team(soccer or teams, country)
            url = (t or {}).get("strBadge")
            if not url:
                print("MISS", cid, name)
            else:
                print("OK", cid, download(url, os.path.join(ROOT, "img", "clubs", cid)))
            time.sleep(0.7)
        except Exception as e:
            print("ERR", cid, e)
            time.sleep(4)

    for lid, country in LEAGUES:
        dest = os.path.join(ROOT, "img", "leagues", lid + ".png")
        if os.path.isfile(dest):
            print("have lg", lid)
            continue
        try:
            d = api("/search_all_leagues.php?c=" + urllib.parse.quote(country))
            leagues = d.get("countries") or []
            L = None
            for x in leagues:
                title = (x.get("strLeague") or "").lower()
                if x.get("strSport") and x.get("strSport") != "Soccer":
                    continue
                L = x
                if "pro league" in title or "super lig" in title or "süper" in title or "premiership" in title or "spl" in title:
                    break
            url = None if not L else (L.get("strBadge") or L.get("strLogo"))
            if url:
                print("OK lg", lid, download(url, os.path.join(ROOT, "img", "leagues", lid)))
            else:
                print("MISS lg", lid)
            time.sleep(0.7)
        except Exception as e:
            print("ERR lg", lid, e)


if __name__ == "__main__":
    main()

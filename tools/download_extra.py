# -*- coding: utf-8 -*-
"""Download crests for more_clubs extras via explicit TheSportsDB team IDs."""
import os, time, json, urllib.request, urllib.error
from io import BytesIO
from PIL import Image
from team_ids import TEAM_IDS

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
UA = "LendaCareerSim/1.0 (local personal game)"
API = "https://www.thesportsdb.com/api/v1/json/3"
OUT = os.path.join(ROOT, "img", "clubs")

# Extra clubs from more_clubs.js — IDs only (no fuzzy "Athletic Club" search).
EXTRA_IDS = [
    "avl", "whu", "bha", "eve", "cry", "ful", "wol", "nfo",
    "ath",  # Athletic Bilbao — MUST be 133727, never fuzzy Athletic Club
    "val", "bet", "celv",
    "ata", "fio", "bol", "tor",
    "wlf", "bmg", "fre", "hof",
    "renn", "len", "str", "nte",
    "bra", "vgu", "az", "twt",
    "clb", "and", "gal", "fen",
    "cel", "ran",
]

LEAGUE_IDS = {
    "bel": 4338,  # Belgian Pro League (best-effort; skip if missing)
    "tur": 4339,
    "sco": 4330,
}


def req(url, retries=8):
    last = None
    for i in range(retries):
        try:
            r = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(r, timeout=30) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            last = e
            if e.code == 429:
                time.sleep(12 + i * 8)
                continue
            raise
        except Exception as e:
            last = e
            time.sleep(3 + i)
    raise last


def save_badge(cid, tid, force=False):
    dest = os.path.join(OUT, cid + ".png")
    if (not force) and os.path.isfile(dest) and os.path.getsize(dest) > 2000:
        print("have", cid)
        return
    raw = req(API + f"/lookupteam.php?id={tid}")
    t = (json.loads(raw.decode()).get("teams") or [None])[0]
    url = (t or {}).get("strBadge")
    if not url:
        print("MISS", cid, tid)
        return
    data = req(url)
    im = Image.open(BytesIO(data)).convert("RGBA")
    if max(im.size) > 1024:
        im.thumbnail((512, 512), Image.Resampling.LANCZOS)
    im.save(dest, "PNG", optimize=True)
    print("OK", cid, t.get("strTeam"), t.get("strCountry"), os.path.getsize(dest))


def main():
    os.makedirs(OUT, exist_ok=True)
    for cid in EXTRA_IDS:
        tid = TEAM_IDS.get(cid)
        if not tid:
            print("NO_ID", cid)
            continue
        try:
            save_badge(cid, tid)
            time.sleep(1.0)
        except Exception as e:
            print("ERR", cid, e)
            time.sleep(4)


if __name__ == "__main__":
    main()

# -*- coding: utf-8 -*-
"""Download verified TheSportsDB badges for leagues-2026 newcomers."""
# Kept for reproducibility; identities verified 2026-09-18.
import os, time, urllib.parse, urllib.request, json
from io import BytesIO
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
UA = "LendaCareerSim/1.0 (local personal game)"
API = "https://www.thesportsdb.com/api/v1/json/3"
OUT = os.path.join(ROOT, "img", "clubs")

# id -> TheSportsDB idTeam (verified). Canonical map lives in team_ids.py.
from team_ids import TEAM_IDS
TEAMS = {k: TEAM_IDS[k] for k in (
    "mir", "nov", "chp", "rem", "jve", "lon", "sbe", "cri", "crb", "cui",
    "ago", "ope", "vna", "amg", "athm", "bsp", "vit", "ctb", "elv", "cov",
    "ips", "hul", "s04", "pad", "tro", "lem", "bou", "bre", "lee", "sun",
)}

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
                time.sleep(12 + i * 8); continue
            raise
        except Exception as e:
            last = e; time.sleep(3 + i)
    raise last

def main():
    os.makedirs(OUT, exist_ok=True)
    for cid, tid in TEAMS.items():
        dest = os.path.join(OUT, cid + ".png")
        if os.path.isfile(dest) and os.path.getsize(dest) > 2000:
            print("have", cid); continue
        raw = req(API + f"/lookupteam.php?id={tid}")
        t = (json.loads(raw.decode()).get("teams") or [None])[0]
        url = (t or {}).get("strBadge")
        if not url:
            print("MISS", cid); continue
        data = req(url)
        im = Image.open(BytesIO(data)).convert("RGBA")
        if max(im.size) > 1024:
            im.thumbnail((512, 512), Image.Resampling.LANCZOS)
        im.save(dest, "PNG", optimize=True)
        print("OK", cid, t.get("strTeam"), os.path.getsize(dest))
        time.sleep(1.2)

if __name__ == "__main__":
    main()

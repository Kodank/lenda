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

# id -> TheSportsDB idTeam (verified)
TEAMS = {
    "mir": 141181, "nov": 141182, "chp": 134464, "rem": 137818, "jve": 135887,
    "lon": 135664, "sbe": 145389, "cri": 134292, "crb": 135680, "cui": 136831,
    "ago": 134737, "ope": 136829, "vna": 134734, "amg": 134742, "athm": 147142,
    "bsp": 136830, "vit": 134280, "ctb": 134298, "elv": 138411, "cov": 133625,
    "ips": 133622, "hul": 133617, "s04": 133661, "pad": 134551, "tro": 134789,
    "lem": 133848, "bou": 134301, "bre": 134355, "lee": 133635, "sun": 133603,
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

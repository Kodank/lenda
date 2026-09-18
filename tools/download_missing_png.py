# -*- coding: utf-8 -*-
import json, os, time, urllib.parse, urllib.request
from download_real_rest import CLUBS, UA, API, req, api, download, pick_team, COMMONS_Q, ROOT

def has_png(folder, stem):
    return os.path.isfile(os.path.join(ROOT, "img", folder, stem + ".png"))

def main():
    print("missing club pngs...")
    for cid, (name, country) in CLUBS.items():
        if has_png("clubs", cid):
            continue
        try:
            d = api("/searchteams.php?t=" + urllib.parse.quote(name))
            t = pick_team(d.get("teams") or [], country)
            url = (t or {}).get("strBadge")
            if not url:
                print(" MISS", cid, name)
                continue
            print(" OK", cid, download(url, os.path.join(ROOT, "img", "clubs", cid)))
            time.sleep(0.75)
        except Exception as e:
            print(" ERR", cid, e)
            time.sleep(5)

    # Liga MX
    if not has_png("leagues", "mex"):
        try:
            d = api("/search_all_leagues.php?c=Mexico")
            leagues = d.get("countries") or []
            L = None
            for x in leagues:
                title = (x.get("strLeague") or "").lower()
                if "liga mx" in title or "mexican" in title or "primera" in title:
                    L = x
                    break
            L = L or (leagues[0] if leagues else None)
            url = None if not L else (L.get("strBadge") or L.get("strLogo"))
            if url:
                print(" OK mex", download(url, os.path.join(ROOT, "img", "leagues", "mex")))
            else:
                print(" MISS mex")
        except Exception as e:
            print(" ERR mex", e)

    print("award trophies from commons...")
    for tid in ("balon", "bota", "luva", "mvp"):
        if has_png("trophies", tid):
            continue
        q = COMMONS_Q[tid]
        try:
            raw, _ = req(
                "https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&format=json&srlimit=8&srsearch="
                + urllib.parse.quote(q)
            )
            hits = json.loads(raw.decode()).get("query", {}).get("search") or []
            if not hits:
                print(" MISS wiki", tid)
                continue
            title = hits[0]["title"].replace("File:", "")
            url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(title) + "?width=900"
            print(" OK", tid, title, download(url, os.path.join(ROOT, "img", "trophies", tid)))
            time.sleep(0.4)
        except Exception as e:
            print(" ERR wiki", tid, e)

if __name__ == "__main__":
    main()

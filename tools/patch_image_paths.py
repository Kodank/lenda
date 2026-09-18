# -*- coding: utf-8 -*-
"""Atualiza world.js e data.js para apontar aos arquivos reais baixados."""
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def find(folder, stem):
    for ext in (".png", ".jpg", ".jpeg", ".svg", ".webp"):
        p = os.path.join(ROOT, "img", folder, stem + ext)
        if os.path.isfile(p):
            return "img/" + folder + "/" + stem + ext
    return None


def patch_world():
    path = os.path.join(ROOT, "js", "world.js")
    txt = open(path, encoding="utf-8").read()

    def club_crest(m):
        cid = m.group(1)
        real = find("clubs", cid)
        if not real:
            return m.group(0)
        return '"id": "%s"' % cid + m.group(2) + '"crest": "%s"' % real

    txt = re.sub(
        r'"id": "([a-z0-9]+)"(\s*,\s*"name":[\s\S]*?)"crest": "[^"]+"',
        club_crest,
        txt,
    )

    def league_logo(m):
        lid = m.group(1)
        real = find("leagues", lid)
        if not real:
            return m.group(0)
        return m.group(0)[: m.group(0).rfind('"logo":')] + '"logo": "%s"' % real

    # simpler: replace logo paths by id looking at nearby id
    def repl_league(m):
        lid, rest = m.group(1), m.group(2)
        real = find("leagues", lid)
        if not real:
            return m.group(0)
        rest2 = re.sub(r'"logo": "[^"]+"', '"logo": "%s"' % real, rest, count=1)
        return '"id": "%s"' % lid + rest2

    txt = re.sub(
        r'"id": "([a-z]+)"(,\s*"name": [\s\S]*?"logo": "[^"]+")',
        repl_league,
        txt,
    )

    open(path, "w", encoding="utf-8").write(txt)
    print("patched world.js")


def patch_data():
    path = os.path.join(ROOT, "js", "data.js")
    txt = open(path, encoding="utf-8").read()

    def repl(m):
        tid = m.group(1)
        real = find("trophies", tid)
        if not real:
            return m.group(0)
        return '"img": "%s"' % real

    # TROPHIES entries: brasileirao: { name: "...", img: "img/trophies/brasileirao.jpg"
    txt = re.sub(
        r'(brasileirao|premier|copa|libertadores|ucl|clubworldcup|worldcup|copaamerica|euro|youth|balon|bota|luva|mvp):\s*\{\s*name:\s*"[^"]+",\s*img:\s*"[^"]+"',
        lambda m: m.group(0).rsplit("img:", 1)[0] + 'img: "' + (find("trophies", m.group(1).split(":")[0].strip()) or m.group(0).split('img: "')[-1].rstrip('"')) + '"',
        txt,
    )
    # do it more carefully
    txt = open(path, encoding="utf-8").read()
    ids = ["brasileirao", "premier", "copa", "libertadores", "ucl", "clubworldcup",
           "worldcup", "copaamerica", "euro", "youth", "balon", "bota", "luva", "mvp"]
    for tid in ids:
        real = find("trophies", tid)
        if not real:
            continue
        txt = re.sub(
            r'(%s:\s*\{\s*name:\s*"[^"]+",\s*img:\s*")[^"]+' % tid,
            r"\1" + real,
            txt,
        )
    open(path, "w", encoding="utf-8").write(txt)
    print("patched data.js")


if __name__ == "__main__":
    patch_world()
    patch_data()
    clubs = [f for f in os.listdir(os.path.join(ROOT, "img", "clubs")) if f.endswith(".png")]
    leagues = os.listdir(os.path.join(ROOT, "img", "leagues"))
    trophies = os.listdir(os.path.join(ROOT, "img", "trophies"))
    print("clubs png", len(clubs), "leagues", len(leagues), "trophies", len(trophies))

import os

root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
world = os.path.join(root, "js", "world.js")
txt = open(world, encoding="utf-8").read()
n = 0
for folder, key in (("clubs", "crest"), ("leagues", "logo")):
    d = os.path.join(root, "img", folder)
    for fn in os.listdir(d):
        stem, ext = os.path.splitext(fn)
        if ext.lower() != ".png":
            continue
        new = "img/%s/%s.png" % (folder, stem)
        for old_ext in (".svg", ".jpg", ".jpeg", ".webp"):
            old = "img/%s/%s%s" % (folder, stem, old_ext)
            a = '"%s": "%s"' % (key, old)
            b = '"%s": "%s"' % (key, new)
            if a in txt:
                txt = txt.replace(a, b)
                n += 1
open(world, "w", encoding="utf-8").write(txt)
print("world replacements", n)

data = os.path.join(root, "js", "data.js")
t = open(data, encoding="utf-8").read()
t = t.replace(
    'clubworldcup: { name: "Mundial de Clubes", img: "img/trophies/worldcup.png"',
    'clubworldcup: { name: "Mundial de Clubes", img: "img/trophies/clubworldcup.png"',
)
open(data, "w", encoding="utf-8").write(t)
print("data ok")

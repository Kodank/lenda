#!/usr/bin/env python3
"""Remove black/studio bg from NT shirt PNGs → transparent cropped assets."""
from __future__ import annotations
import os
from pathlib import Path
from PIL import Image
from rembg import remove

SRC = Path("/workspace/shirts-in")
OUT = Path("/workspace/lenda-repo/img/shirts")
OUT.mkdir(parents=True, exist_ok=True)

MAP = {
    "01-brasil.png": "br",
    "02-argentina.png": "ar",
    "03-uruguai.png": "uy",
    "04-colombia.png": "co",
    "05-mexico.png": "mx",
    "06-portugal.png": "pt",
    "07-espanha.png": "es",
    "08-inglaterra.png": "en",
    "09-franca.png": "fr",
    "10-italia.png": "it",
    "11-alemanha.png": "de",
    "12-paises-baixos.png": "nl",
    "13-estados-unidos.png": "us",
    "14-japao.png": "jp",
    "15-nigeria.png": "ng",
    "16-senegal.png": "sn",
}

def crop_alpha(im: Image.Image, pad: int = 8) -> Image.Image:
    if im.mode != "RGBA":
        im = im.convert("RGBA")
    a = im.split()[-1]
    bbox = a.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))

def sample_green_br(im: Image.Image) -> str:
    """Sample minority green from collar/cuff region (upper center of torso)."""
    w, h = im.size
    # collar zone roughly top-center of shirt body
    samples = []
    for y in range(int(h * 0.08), int(h * 0.18)):
        for x in range(int(w * 0.42), int(w * 0.58)):
            r, g, b, a = im.getpixel((x, y))
            if a < 180:
                continue
            # green-ish: G dominant, not yellow
            if g > r + 15 and g > b + 15 and g > 60:
                samples.append((r, g, b))
    # also try cuff-ish left edge mid
    for y in range(int(h * 0.35), int(h * 0.50)):
        for x in range(int(w * 0.05), int(w * 0.18)):
            r, g, b, a = im.getpixel((x, y))
            if a < 180:
                continue
            if g > r + 15 and g > b + 15 and g > 60:
                samples.append((r, g, b))
    if not samples:
        return "#006633"
    # median-ish via sort
    samples.sort(key=lambda c: c[1])
    mid = samples[len(samples) // 2]
    return "#{:02X}{:02X}{:02X}".format(*mid)

def chroma_fallback(im: Image.Image) -> Image.Image:
    """Near-black chroma key if rembg leaves dark studio."""
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r < 28 and g < 28 and b < 28:
                px[x, y] = (0, 0, 0, 0)
            elif r < 40 and g < 40 and b < 40 and a > 0:
                # soft edge
                na = max(0, int(a * ((max(r, g, b) - 18) / 22)))
                px[x, y] = (r, g, b, na)
    return im

results = {}
for src_name, nid in MAP.items():
    src = SRC / src_name
    print(f"processing {src_name} -> {nid}...")
    raw = Image.open(src).convert("RGBA")
    out = remove(raw)
    out = chroma_fallback(out)
    out = crop_alpha(out, pad=10)
    # max width ~720 for web
    if out.width > 720:
        nh = int(out.height * 720 / out.width)
        out = out.resize((720, nh), Image.Resampling.LANCZOS)
    dest = OUT / f"{nid}.png"
    out.save(dest, "PNG", optimize=True)
    info = {"path": str(dest), "size": out.size, "bytes": dest.stat().st_size}
    if nid == "br":
        info["br_green"] = sample_green_br(out)
        print(f"  BR collar green sample: {info['br_green']}")
    print(f"  saved {dest.name} {out.size} {info['bytes']}b")
    results[nid] = info

print("DONE")
for k, v in results.items():
    print(k, v)

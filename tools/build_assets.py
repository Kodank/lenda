# -*- coding: utf-8 -*-
"""Gera bandeiras, escudos, logos de liga e js/world.js."""
import json
import os
import shutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
IMG = os.path.join(ROOT, "img")
JS = os.path.join(ROOT, "js")
SESSION_IMG = os.path.join(
    os.path.expanduser("~"),
    ".grok",
    "sessions",
    "C%3A%5CUsers%5Cbriel%5C01a0ab5c-7dbc-7150-8170-51494833d274",
    "images",
)

NATIONS = [
    ("br", "Brasil", "Brasileiro", "conmebol", 0),
    ("ar", "Argentina", "Argentino", "conmebol", -1),
    ("uy", "Uruguai", "Uruguaio", "conmebol", -4),
    ("co", "Colômbia", "Colombiano", "conmebol", -3),
    ("mx", "México", "Mexicano", "concacaf", -3),
    ("pt", "Portugal", "Português", "uefa", -2),
    ("es", "Espanha", "Espanhol", "uefa", 0),
    ("en", "Inglaterra", "Inglês", "uefa", 0),
    ("fr", "França", "Francês", "uefa", -1),
    ("it", "Itália", "Italiano", "uefa", 0),
    ("de", "Alemanha", "Alemão", "uefa", 0),
    ("nl", "Países Baixos", "Neerlandês", "uefa", -2),
    ("us", "Estados Unidos", "Americano", "concacaf", -6),
    ("jp", "Japão", "Japonês", "afc", -5),
    ("ng", "Nigéria", "Nigeriano", "caf", -7),
    ("sn", "Senegal", "Senegalês", "caf", -8),
]

LEAGUES = [
    ("bra", "Brasileirão", "br", 1, 4.2, "lib", 20, "brasileirao", "#009B3A"),
    ("brb", "Série B", "br", 2, 2.6, None, 20, "copa", "#1F4E79"),
    ("arg", "Liga Profesional", "ar", 1, 3.8, "lib", 28, "copa", "#75AADB"),
    ("uru", "Primera División", "uy", 1, 3.0, "lib", 16, "copa", "#0038A8"),
    ("col", "Liga BetPlay", "co", 1, 3.1, "lib", 20, "copa", "#FCD116"),
    ("mex", "Liga MX", "mx", 1, 3.6, None, 18, "copa", "#006847"),
    ("por", "Liga Portugal", "pt", 1, 3.9, "ucl", 18, "copa", "#006600"),
    ("esp", "La Liga", "es", 1, 4.8, "ucl", 20, "premier", "#EE334E"),
    ("eng", "Premier League", "en", 1, 4.9, "ucl", 20, "premier", "#3D195B"),
    ("fra", "Ligue 1", "fr", 1, 4.4, "ucl", 18, "premier", "#1E3A8A"),
    ("ita", "Serie A", "it", 1, 4.6, "ucl", 20, "premier", "#024494"),
    ("ger", "Bundesliga", "de", 1, 4.5, "ucl", 18, "premier", "#D20515"),
    ("ned", "Eredivisie", "nl", 1, 3.7, "ucl", 18, "copa", "#F36C21"),
    ("usa", "MLS", "us", 1, 3.2, None, 29, "copa", "#C8102E"),
    ("jpn", "J1 League", "jp", 1, 3.0, None, 18, "copa", "#BC002D"),
    ("nga", "NPFL", "ng", 1, 2.4, None, 20, "youth", "#008751"),
    ("sen", "Ligue 1 Sénégal", "sn", 1, 2.2, None, 14, "youth", "#00853F"),
]

# id, name, city, nation, league, level, c1, c2, c3, pattern, charge, youth
CLUBS = [
    ("fla", "Flamengo", "Rio de Janeiro", "br", "bra", 4.6, "#C41E3A", "#111111", "#FFFFFF", "hoops", "ball", True),
    ("pal", "Palmeiras", "São Paulo", "br", "bra", 4.5, "#006437", "#FFFFFF", "#006437", "pale", "flower", True),
    ("cor", "Corinthians", "São Paulo", "br", "bra", 4.3, "#000000", "#FFFFFF", "#000000", "ring", "star", True),
    ("sao", "São Paulo", "São Paulo", "br", "bra", 4.2, "#FFFFFF", "#C8102E", "#000000", "thirds", "cross", True),
    ("san", "Santos", "Santos", "br", "bra", 3.6, "#000000", "#FFFFFF", "#000000", "stripes", "star", True),
    ("gre", "Grêmio", "Porto Alegre", "br", "bra", 4.0, "#0A84C1", "#000000", "#FFFFFF", "stripes", "crown", True),
    ("inter", "Internacional", "Porto Alegre", "br", "bra", 4.0, "#C8102E", "#FFFFFF", "#C8102E", "solid", "flower", True),
    ("cam", "Atlético-MG", "Belo Horizonte", "br", "bra", 4.1, "#000000", "#FFFFFF", "#000000", "stripes", "star", True),
    ("flu", "Fluminense", "Rio de Janeiro", "br", "bra", 3.8, "#7A0019", "#006341", "#FFFFFF", "hoops", "flower", True),
    ("bot", "Botafogo", "Rio de Janeiro", "br", "bra", 3.9, "#000000", "#FFFFFF", "#000000", "pale", "star", True),
    ("vas", "Vasco", "Rio de Janeiro", "br", "bra", 3.5, "#000000", "#FFFFFF", "#000000", "bend", "cross", True),
    ("cap", "Athletico", "Curitiba", "br", "bra", 3.6, "#E41937", "#000000", "#E41937", "bend", "star", True),
    ("bah", "Bahia", "Salvador", "br", "bra", 3.4, "#0062A8", "#E31837", "#FFFFFF", "thirds", "star", True),
    ("for", "Fortaleza", "Fortaleza", "br", "bra", 3.5, "#E31837", "#0062A8", "#FFFFFF", "hoops", "lion", True),
    ("cru", "Cruzeiro", "Belo Horizonte", "br", "bra", 3.7, "#2B6CB0", "#FFFFFF", "#2B6CB0", "solid", "star", True),
    ("rbb", "Bragantino", "Bragança Paulista", "br", "bra", 3.4, "#E31837", "#FFFFFF", "#E31837", "solid", "bull", True),
    ("spt", "Sport", "Recife", "br", "brb", 2.8, "#E31837", "#000000", "#E31837", "hoops", "lion", True),
    ("cea", "Ceará", "Fortaleza", "br", "brb", 2.7, "#000000", "#FFFFFF", "#000000", "stripes", "star", True),
    ("goi", "Goiás", "Goiânia", "br", "brb", 2.6, "#007A33", "#FFFFFF", "#007A33", "pale", "diamond", True),
    ("gua", "Guarani", "Campinas", "br", "brb", 2.5, "#007A33", "#FFFFFF", "#007A33", "solid", "bug", True),
    ("pon", "Ponte Preta", "Campinas", "br", "brb", 2.5, "#000000", "#FFFFFF", "#000000", "stripes", "bridge", True),
    ("ava", "Avaí", "Florianópolis", "br", "brb", 2.5, "#0062A8", "#FFFFFF", "#0062A8", "pale", "wave", True),
    ("boc", "Boca Juniors", "Buenos Aires", "ar", "arg", 4.4, "#0033A0", "#F9D616", "#0033A0", "pale", "star", True),
    ("riv", "River Plate", "Buenos Aires", "ar", "arg", 4.4, "#FFFFFF", "#E31837", "#FFFFFF", "bend", "band", True),
    ("rac", "Racing", "Avellaneda", "ar", "arg", 3.7, "#79C3E0", "#FFFFFF", "#79C3E0", "stripes", "star", True),
    ("ind", "Independiente", "Avellaneda", "ar", "arg", 3.6, "#D50032", "#FFFFFF", "#D50032", "solid", "devil", True),
    ("sla", "San Lorenzo", "Buenos Aires", "ar", "arg", 3.5, "#C41E3A", "#0033A0", "#FFFFFF", "stripes", "cross", True),
    ("est", "Estudiantes", "La Plata", "ar", "arg", 3.5, "#E31837", "#FFFFFF", "#E31837", "stripes", "star", True),
    ("nac", "Nacional", "Montevidéu", "uy", "uru", 3.4, "#FFFFFF", "#0038A8", "#E31837", "solid", "star", True),
    ("pen", "Peñarol", "Montevidéu", "uy", "uru", 3.4, "#000000", "#FFD100", "#000000", "stripes", "star", True),
    ("def", "Defensor", "Montevidéu", "uy", "uru", 2.8, "#7A0019", "#7A0019", "#FFFFFF", "solid", "violet", True),
    ("nal", "Atlético Nacional", "Medellín", "co", "col", 3.5, "#007A33", "#FFFFFF", "#007A33", "solid", "star", True),
    ("mil", "Millonarios", "Bogotá", "co", "col", 3.3, "#0033A0", "#FFFFFF", "#0033A0", "solid", "star", True),
    ("amec", "América de Cali", "Cali", "co", "col", 3.2, "#E31837", "#FFFFFF", "#E31837", "solid", "devil", True),
    ("amea", "Club América", "Cidade do México", "mx", "mex", 3.8, "#F9D616", "#0033A0", "#F9D616", "solid", "eagle", True),
    ("chi", "Chivas", "Guadalajara", "mx", "mex", 3.6, "#E31837", "#FFFFFF", "#0033A0", "stripes", "goat", True),
    ("mty", "Monterrey", "Monterrey", "mx", "mex", 3.7, "#0033A0", "#FFFFFF", "#0033A0", "stripes", "star", True),
    ("tig", "Tigres", "Monterrey", "mx", "mex", 3.7, "#F9D616", "#0033A0", "#F9D616", "pale", "tiger", True),
    ("ben", "Benfica", "Lisboa", "pt", "por", 4.3, "#E31837", "#FFFFFF", "#E31837", "solid", "eagle", True),
    ("por", "Porto", "Porto", "pt", "por", 4.2, "#0033A0", "#FFFFFF", "#0033A0", "solid", "dragon", True),
    ("spo", "Sporting", "Lisboa", "pt", "por", 4.1, "#007A33", "#FFFFFF", "#007A33", "solid", "lion", True),
    ("rma", "Real Madrid", "Madrid", "es", "esp", 5.0, "#FFFFFF", "#F9D616", "#00529F", "solid", "crown", True),
    ("fcb", "Barcelona", "Barcelona", "es", "esp", 4.9, "#A50044", "#004D98", "#A50044", "stripes", "cross", True),
    ("atm", "Atlético de Madrid", "Madrid", "es", "esp", 4.6, "#C8102E", "#FFFFFF", "#C8102E", "stripes", "star", True),
    ("sev", "Sevilla", "Sevilha", "es", "esp", 4.2, "#FFFFFF", "#D50032", "#FFFFFF", "solid", "cross", True),
    ("vil", "Villarreal", "Vila-real", "es", "esp", 4.1, "#F9D616", "#00529F", "#F9D616", "solid", "sub", True),
    ("rso", "Real Sociedad", "San Sebastián", "es", "esp", 4.0, "#0033A0", "#FFFFFF", "#0033A0", "stripes", "crown", True),
    ("mci", "Manchester City", "Manchester", "en", "eng", 5.0, "#6CABDD", "#FFFFFF", "#1C2C5B", "solid", "star", True),
    ("ars", "Arsenal", "Londres", "en", "eng", 4.8, "#EF0107", "#FFFFFF", "#9C824A", "solid", "cannon", True),
    ("liv", "Liverpool", "Liverpool", "en", "eng", 4.9, "#C8102E", "#FFFFFF", "#00B2A9", "solid", "bird", True),
    ("che", "Chelsea", "Londres", "en", "eng", 4.6, "#034694", "#FFFFFF", "#034694", "solid", "lion", True),
    ("mun", "Manchester United", "Manchester", "en", "eng", 4.6, "#DA291C", "#FBE122", "#000000", "solid", "devil", True),
    ("tot", "Tottenham", "Londres", "en", "eng", 4.4, "#FFFFFF", "#132257", "#FFFFFF", "solid", "bird", True),
    ("new", "Newcastle", "Newcastle", "en", "eng", 4.3, "#000000", "#FFFFFF", "#000000", "stripes", "star", True),
    ("psg", "Paris Saint-Germain", "Paris", "fr", "fra", 4.8, "#004170", "#E31837", "#FFFFFF", "thirds", "fleur", True),
    ("mar", "Marseille", "Marselha", "fr", "fra", 4.1, "#2FA8E0", "#FFFFFF", "#2FA8E0", "pale", "star", True),
    ("lyo", "Lyon", "Lyon", "fr", "fra", 4.0, "#0033A0", "#E31837", "#FFFFFF", "stripes", "lion", True),
    ("mon", "Monaco", "Mônaco", "fr", "fra", 4.0, "#E31837", "#FFFFFF", "#E31837", "bend", "diamond", True),
    ("lil", "Lille", "Lille", "fr", "fra", 3.9, "#E31837", "#0033A0", "#FFFFFF", "pale", "dog", True),
    ("nic", "Nice", "Nice", "fr", "fra", 3.8, "#000000", "#E31837", "#FFFFFF", "stripes", "star", True),
    ("intm", "Inter", "Milão", "it", "ita", 4.7, "#010E80", "#000000", "#FFFFFF", "stripes", "snake", True),
    ("miln", "Milan", "Milão", "it", "ita", 4.6, "#FB090B", "#000000", "#FB090B", "stripes", "cross", True),
    ("juv", "Juventus", "Turim", "it", "ita", 4.6, "#000000", "#FFFFFF", "#000000", "stripes", "star", True),
    ("nap", "Napoli", "Nápoles", "it", "ita", 4.4, "#12A0D7", "#FFFFFF", "#12A0D7", "solid", "donkey", True),
    ("rom", "Roma", "Roma", "it", "ita", 4.3, "#8E1F2F", "#F0BC42", "#8E1F2F", "solid", "wolf", True),
    ("laz", "Lazio", "Roma", "it", "ita", 4.1, "#87D8F7", "#FFFFFF", "#87D8F7", "solid", "eagle", True),
    ("bay", "Bayern", "Munique", "de", "ger", 5.0, "#DC052D", "#FFFFFF", "#0066B2", "solid", "diamond", True),
    ("bvb", "Borussia Dortmund", "Dortmund", "de", "ger", 4.6, "#FDE100", "#000000", "#FDE100", "hoops", "crown", True),
    ("rbl", "RB Leipzig", "Leipzig", "de", "ger", 4.3, "#E31837", "#FFFFFF", "#0A1D3B", "solid", "bull", True),
    ("lev", "Leverkusen", "Leverkusen", "de", "ger", 4.3, "#E32221", "#000000", "#FFFFFF", "solid", "pill", True),
    ("ein", "Eintracht", "Frankfurt", "de", "ger", 4.1, "#E1000F", "#000000", "#FFFFFF", "solid", "eagle", True),
    ("stu", "Stuttgart", "Stuttgart", "de", "ger", 4.0, "#FFFFFF", "#E31837", "#FFFFFF", "hoops", "horse", True),
    ("aja", "Ajax", "Amsterdã", "nl", "ned", 4.2, "#D2122E", "#FFFFFF", "#D2122E", "solid", "circle", True),
    ("psv", "PSV", "Eindhoven", "nl", "ned", 4.1, "#E31837", "#FFFFFF", "#E31837", "stripes", "bulb", True),
    ("fey", "Feyenoord", "Roterdã", "nl", "ned", 4.0, "#E31837", "#FFFFFF", "#000000", "thirds", "crest", True),
    ("mia", "Inter Miami", "Miami", "us", "usa", 3.4, "#F7B5CD", "#000000", "#F7B5CD", "solid", "heron", True),
    ("laf", "LAFC", "Los Angeles", "us", "usa", 3.3, "#000000", "#C39E6D", "#000000", "solid", "wing", True),
    ("atl", "Atlanta United", "Atlanta", "us", "usa", 3.2, "#80000B", "#000000", "#A39064", "solid", "circle", True),
    ("ura", "Urawa Reds", "Saitama", "jp", "jpn", 3.2, "#E60012", "#FFFFFF", "#E60012", "solid", "diamond", True),
    ("kas", "Kashima Antlers", "Kashima", "jp", "jpn", 3.1, "#E31837", "#0033A0", "#FFFFFF", "solid", "antler", True),
    ("yok", "Yokohama F. Marinos", "Yokohama", "jp", "jpn", 3.1, "#0033A0", "#FFFFFF", "#E31837", "solid", "wave", True),
    ("eny", "Enyimba", "Aba", "ng", "nga", 2.5, "#007A33", "#FFFFFF", "#007A33", "solid", "elephant", True),
    ("kan", "Kano Pillars", "Kano", "ng", "nga", 2.3, "#F9D616", "#007A33", "#F9D616", "pale", "pillar", True),
    ("jrf", "Jaraaf", "Dacar", "sn", "sen", 2.2, "#00853F", "#FDEF42", "#E31C23", "solid", "star", True),
    ("dia", "Diambars", "Saly", "sn", "sen", 2.1, "#0033A0", "#FFFFFF", "#0033A0", "solid", "ball", True),
]


def shield_path():
    return "M64 10 L114 28 L114 70 Q114 102 64 120 Q14 102 14 70 L14 28 Z"


def crest_svg(club):
    cid, name, city, nation, league, level, c1, c2, c3, pattern, charge, youth = club
    clip = "s" + cid
    p = shield_path()
    inner = []
    if pattern == "hoops":
        for i, col in enumerate([c1, c2, c1, c2, c1, c2, c1]):
            inner.append(f'<rect x="10" y="{8 + i * 16}" width="108" height="16" fill="{col}"/>')
    elif pattern == "stripes":
        for i in range(7):
            col = c1 if i % 2 == 0 else c2
            inner.append(f'<rect x="{10 + i * 16}" y="8" width="16" height="116" fill="{col}"/>')
    elif pattern == "pale":
        inner.append(f'<rect x="10" y="8" width="54" height="116" fill="{c1}"/>')
        inner.append(f'<rect x="64" y="8" width="54" height="116" fill="{c2}"/>')
    elif pattern == "thirds":
        inner.append(f'<rect x="10" y="8" width="108" height="38" fill="{c1}"/>')
        inner.append(f'<rect x="10" y="46" width="108" height="38" fill="{c2}"/>')
        inner.append(f'<rect x="10" y="84" width="108" height="40" fill="{c3}"/>')
    elif pattern == "bend":
        inner.append(f'<rect x="10" y="8" width="108" height="116" fill="{c1}"/>')
        inner.append(f'<polygon points="10,28 10,58 114,118 114,88" fill="{c2}"/>')
    elif pattern == "ring":
        inner.append(f'<rect x="10" y="8" width="108" height="116" fill="{c1}"/>')
        inner.append(f'<circle cx="64" cy="62" r="28" fill="none" stroke="{c2}" stroke-width="10"/>')
    else:
        inner.append(f'<rect x="10" y="8" width="108" height="116" fill="{c1}"/>')
        inner.append(f'<circle cx="64" cy="62" r="34" fill="{c2}" fill-opacity=".18"/>')

    ch = charge_svg(charge, c1, c2, c3)
    letters = "".join(ch for ch in name if ch.isalpha() and ch.upper() == ch)[:3]
    if not letters:
        letters = cid[:3].upper()
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <clipPath id="{clip}"><path d="{p}"/></clipPath>
    <linearGradient id="g{cid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".25"/>
      <stop offset="1" stop-color="#000000" stop-opacity=".25"/>
    </linearGradient>
  </defs>
  <path d="{p}" fill="#0b0b0d" transform="translate(0 2)"/>
  <g clip-path="url(#{clip})">
    {"".join(inner)}
    <rect x="10" y="8" width="108" height="116" fill="url(#g{cid})"/>
    {ch}
  </g>
  <path d="{p}" fill="none" stroke="#d4af37" stroke-width="3.2"/>
  <path d="{p}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1" transform="scale(.92) translate(5.5 6)"/>
</svg>'''


def charge_svg(charge, c1, c2, c3):
    ink = "#F7F4EE"
    if _luma(c1) > 0.65 or _luma(c2) > 0.8:
        ink = "#111111"
    if charge == "star":
        return f'<polygon points="64,34 70,52 90,52 74,64 80,84 64,72 48,84 54,64 38,52 58,52" fill="{ink}"/>'
    if charge == "ball":
        return f'<circle cx="64" cy="62" r="18" fill="{ink}" fill-opacity=".92"/><path d="M46 62h36M64 44v36M52 50c8 8 16 8 24 0M52 74c8-8 16-8 24 0" stroke="{c1}" stroke-width="2" fill="none"/>'
    if charge == "cross":
        return f'<path d="M58 38h12v20h20v12H70v20H58V70H38V58h20z" fill="{ink}"/>'
    if charge == "crown":
        return f'<path d="M40 70l8-22 16 14 16-14 8 22H40z" fill="{ink}"/><rect x="40" y="70" width="48" height="8" fill="{ink}"/>'
    if charge == "flower":
        return f'<circle cx="64" cy="62" r="7" fill="{ink}"/>' + "".join(
            f'<circle cx="{64 + int(22 * __import__("math").cos(i * 1.256))}" cy="{62 + int(22 * __import__("math").sin(i * 1.256))}" r="8" fill="{ink}" fill-opacity=".9"/>'
            for i in range(5)
        )
    if charge == "lion":
        return f'<path d="M50 80c0-18 6-28 14-34 8 6 14 16 14 34H50z" fill="{ink}"/><circle cx="64" cy="40" r="10" fill="{ink}"/>'
    if charge == "eagle":
        return f'<path d="M64 40 L96 70 L80 70 L64 86 L48 70 L32 70 Z" fill="{ink}"/>'
    if charge == "bird":
        return f'<path d="M36 64c16-18 28-10 28-10s12-8 28 10c-12 2-20-2-28 10-8-12-16-8-28-10z" fill="{ink}"/>'
    if charge == "dragon":
        return f'<path d="M40 72c8-28 28-32 40-20 4 8-2 20-10 24 12 0 22 8 22 8l-16 8c-8-4-20-4-36-20z" fill="{ink}"/>'
    if charge == "devil":
        return f'<path d="M44 44l10 8 10-16 10 16 10-8-4 40H48z" fill="{ink}"/>'
    if charge == "snake":
        return f'<path d="M44 44c24 0 24 16 0 16 20 0 28 20 4 28" fill="none" stroke="{ink}" stroke-width="6" stroke-linecap="round"/>'
    if charge == "wolf":
        return f'<path d="M40 78 L52 42 L64 58 L76 42 L88 78 Z" fill="{ink}"/>'
    if charge == "horse":
        return f'<path d="M48 86c0-20 8-28 16-36 12 4 20 16 16 28-8 4-20 8-32 8z" fill="{ink}"/>'
    if charge == "bull":
        return f'<path d="M36 50 l16 8 12-16 12 16 16-8-8 32H44z" fill="{ink}"/>'
    if charge == "tiger":
        return f'<circle cx="64" cy="60" r="20" fill="{ink}"/><path d="M48 48l-10-12M80 48l10-12" stroke="{ink}" stroke-width="5"/>'
    if charge == "goat":
        return f'<path d="M44 70c8-24 32-24 40 0H44z" fill="{ink}"/><path d="M50 46l-8-14M78 46l8-14" stroke="{ink}" stroke-width="4"/>'
    if charge == "cannon":
        return f'<rect x="38" y="56" width="52" height="12" rx="6" fill="{ink}"/><circle cx="90" cy="62" r="8" fill="{ink}"/>'
    if charge == "fleur":
        return f'<path d="M64 36c8 10 4 18 0 22-4-4-8-12 0-22zM46 58c18 0 18 0 36 0-10 8-10 16-18 28-8-12-8-20-18-28z" fill="{ink}"/>'
    if charge == "diamond":
        return f'<polygon points="64,34 92,62 64,90 36,62" fill="{ink}"/>'
    if charge == "wave":
        return f'<path d="M36 70c10-16 16-16 28 0 12 16 18 16 28 0" fill="none" stroke="{ink}" stroke-width="6"/>'
    if charge == "bridge":
        return f'<path d="M32 80 H96 M40 80 V50 H88 V80 M52 50 V80 M76 50 V80" stroke="{ink}" stroke-width="5" fill="none"/>'
    if charge == "bug":
        return f'<ellipse cx="64" cy="62" rx="16" ry="20" fill="{ink}"/>'
    if charge == "band":
        return f'<polygon points="20,40 108,88 108,104 20,56" fill="{c2 if c2 != c1 else ink}"/>'
    if charge == "circle":
        return f'<circle cx="64" cy="62" r="16" fill="{ink}"/>'
    if charge == "sub":
        return f'<rect x="40" y="54" width="48" height="16" rx="8" fill="{ink}"/>'
    if charge == "wing":
        return f'<path d="M32 70 C60 30 80 30 96 70 L64 78 Z" fill="{ink}"/>'
    if charge == "heron":
        return f'<path d="M60 36 v40 c12 0 20-12 8-24 M60 50 h16" stroke="{ink}" stroke-width="5" fill="none"/>'
    if charge == "antler":
        return f'<path d="M64 88 V48 M64 52 l-18-16 M64 52 l18-16 M50 44 l-8-12 M78 44 l8-12" stroke="{ink}" stroke-width="5" fill="none"/>'
    if charge == "elephant":
        return f'<ellipse cx="60" cy="64" rx="18" ry="16" fill="{ink}"/><path d="M76 64c12 4 16 16 8 24" stroke="{ink}" stroke-width="6" fill="none"/>'
    if charge == "pillar":
        return f'<rect x="54" y="36" width="20" height="52" fill="{ink}"/><rect x="44" y="84" width="40" height="8" fill="{ink}"/>'
    if charge == "pill":
        return f'<rect x="44" y="52" width="40" height="20" rx="10" fill="{ink}"/>'
    if charge == "bulb":
        return f'<circle cx="64" cy="56" r="16" fill="{ink}"/><rect x="58" y="72" width="12" height="12" fill="{ink}"/>'
    if charge == "crest":
        return f'<polygon points="64,36 84,84 44,84" fill="{ink}"/>'
    if charge == "donkey":
        return f'<ellipse cx="64" cy="66" rx="16" ry="14" fill="{ink}"/><path d="M50 50 l-8-16 M78 50 l8-16" stroke="{ink}" stroke-width="4"/>'
    if charge == "dog":
        return f'<ellipse cx="64" cy="66" rx="18" ry="14" fill="{ink}"/><circle cx="52" cy="52" r="8" fill="{ink}"/>'
    if charge == "violet":
        return f'<circle cx="64" cy="62" r="18" fill="{ink}"/>'
    return f'<circle cx="64" cy="62" r="14" fill="{ink}"/>'


def _luma(hexcol):
    h = hexcol.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255


FLAGS = {}


def flag_svg(code):
    w, h = 640, 448
    if code == "br":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="#009B3A"/><polygon points="320,40 600,224 320,408 40,224" fill="#FEDF00"/><circle cx="320" cy="224" r="90" fill="#002776"/><path d="M230 224c40-28 140-28 180 0" fill="none" stroke="#fff" stroke-width="10"/></svg>'''
    if code == "ar":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="#74ACDF"/><rect y="149" width="{w}" height="150" fill="#fff"/><circle cx="320" cy="224" r="40" fill="#F6B40E"/></svg>'''
    if code == "uy":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="#fff"/>{" ".join(f'<rect y="{i*56}" width="{w}" height="28" fill="#0038A8"/>' for i in range(1,8,2))}<rect width="220" height="224" fill="#fff"/><circle cx="110" cy="112" r="40" fill="#F6B40E"/></svg>'''
    if code == "co":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="#FCD116"/><rect y="224" width="{w}" height="112" fill="#003893"/><rect y="336" width="{w}" height="112" fill="#CE1126"/></svg>'''
    if code == "mx":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="213" height="{h}" fill="#006847"/><rect x="213" width="214" height="{h}" fill="#fff"/><rect x="427" width="213" height="{h}" fill="#CE1126"/><circle cx="320" cy="224" r="36" fill="#9B6B2F"/></svg>'''
    if code == "pt":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="#FF0000"/><rect width="256" height="{h}" fill="#006600"/><circle cx="256" cy="224" r="52" fill="#FFD700"/><circle cx="256" cy="224" r="28" fill="#fff"/></svg>'''
    if code == "es":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="#AA151B"/><rect y="112" width="{w}" height="224" fill="#F1BF00"/></svg>'''
    if code == "en":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="#fff"/><rect x="276" width="88" height="{h}" fill="#CE1126"/><rect y="180" width="{w}" height="88" fill="#CE1126"/></svg>'''
    if code == "fr":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="213" height="{h}" fill="#002395"/><rect x="213" width="214" height="{h}" fill="#fff"/><rect x="427" width="213" height="{h}" fill="#ED2939"/></svg>'''
    if code == "it":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="213" height="{h}" fill="#009246"/><rect x="213" width="214" height="{h}" fill="#fff"/><rect x="427" width="213" height="{h}" fill="#CE2B37"/></svg>'''
    if code == "de":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="149" fill="#000"/><rect y="149" width="{w}" height="150" fill="#DD0000"/><rect y="299" width="{w}" height="149" fill="#FFCE00"/></svg>'''
    if code == "nl":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="149" fill="#AE1C28"/><rect y="149" width="{w}" height="150" fill="#fff"/><rect y="299" width="{w}" height="149" fill="#21468B"/></svg>'''
    if code == "us":
        stars = "".join(
            f'<circle cx="{(i % 6) * 28 + 24}" cy="{(i // 6) * 22 + 20}" r="5" fill="#fff"/>' for i in range(18)
        )
        stripes = "".join(
            f'<rect y="{i * 34.5}" width="{w}" height="17.3" fill="#BF0A30"/>' for i in range(13) if i % 2 == 0
        )
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="#fff"/>{stripes}<rect width="256" height="192" fill="#002868"/>{stars}</svg>'''
    if code == "jp":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="#fff"/><circle cx="320" cy="224" r="84" fill="#BC002D"/></svg>'''
    if code == "ng":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="213" height="{h}" fill="#008751"/><rect x="213" width="214" height="{h}" fill="#fff"/><rect x="427" width="213" height="{h}" fill="#008751"/></svg>'''
    if code == "sn":
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="213" height="{h}" fill="#00853F"/><rect x="213" width="214" height="{h}" fill="#FDEF42"/><rect x="427" width="213" height="{h}" fill="#E31C23"/><polygon points="320,160 336,208 388,208 346,240 360,288 320,260 280,288 294,240 252,208 304,208" fill="#00853F"/></svg>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="#444"/></svg>'


def league_svg(lg):
    lid, name, nation, tier, level, cont, size, trophy, color = lg
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="60" fill="#0b0b0d"/>
  <circle cx="64" cy="64" r="56" fill="{color}"/>
  <circle cx="64" cy="64" r="40" fill="#0b0b0d"/>
  <circle cx="64" cy="64" r="28" fill="{color}" fill-opacity=".25"/>
  <text x="64" y="72" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="22" fill="#F7F4EE">{lid.upper()[:3]}</text>
</svg>'''


def emit_world():
    nations = []
    for i in NATIONS:
        nations.append({
            "id": i[0], "name": i[1], "adj": i[2], "conf": i[3], "ntCut": i[4],
            "flag": f"img/flags/{i[0]}.svg",
        })
    leagues = []
    for i in LEAGUES:
        leagues.append({
            "id": i[0], "name": i[1], "nation": i[2], "tier": i[3], "level": i[4],
            "continental": i[5], "size": i[6], "trophy": i[7],
            "logo": f"img/leagues/{i[0]}.svg", "color": i[8],
        })
    clubs = []
    for c in CLUBS:
        clubs.append({
            "id": c[0], "name": c[1], "city": c[2], "nation": c[3], "leagueId": c[4],
            "level": c[5], "colors": [c[6], c[7], c[8]], "pattern": c[9], "charge": c[10],
            "youth": c[11], "crest": f"img/clubs/{c[0]}.svg",
        })
    path = os.path.join(JS, "world.js")
    with open(path, "w", encoding="utf-8") as f:
        f.write("/* gerado por tools/build_assets.py — não edite à mão */\n")
        f.write("var NATIONS = " + json.dumps(nations, ensure_ascii=False, indent=2) + ";\n")
        f.write("var LEAGUES = " + json.dumps(leagues, ensure_ascii=False, indent=2) + ";\n")
        f.write("var CLUBS = " + json.dumps(clubs, ensure_ascii=False, indent=2) + ";\n")
    return len(nations), len(leagues), len(clubs)


def copy_trophies():
    mapping = {
        "1.jpg": "brasileirao.jpg",
        "2.jpg": "libertadores.jpg",
        "3.jpg": "copaamerica.jpg",
        "4.jpg": "balon.jpg",
        "5.jpg": "ucl.jpg",
        "6.jpg": "luva.jpg",
        "7.jpg": "worldcup.jpg",
        "8.jpg": "bota.jpg",
        "9.jpg": "mvp.jpg",
        "10.jpg": "youth.jpg",
        "11.jpg": "copa.jpg",
        "12.jpg": "euro.jpg",
        "13.jpg": "premier.jpg",
        "14.jpg": "clubworldcup.jpg",
    }
    dest = os.path.join(IMG, "trophies")
    os.makedirs(dest, exist_ok=True)
    n = 0
    for src_name, dst_name in mapping.items():
        src = os.path.join(SESSION_IMG, src_name)
        if os.path.isfile(src):
            shutil.copyfile(src, os.path.join(dest, dst_name))
            n += 1
    return n


def main():
    for sub in ("flags", "clubs", "leagues", "trophies", "ui"):
        os.makedirs(os.path.join(IMG, sub), exist_ok=True)
    os.makedirs(JS, exist_ok=True)
    for n in NATIONS:
        with open(os.path.join(IMG, "flags", n[0] + ".svg"), "w", encoding="utf-8") as f:
            f.write(flag_svg(n[0]))
    for c in CLUBS:
        with open(os.path.join(IMG, "clubs", c[0] + ".svg"), "w", encoding="utf-8") as f:
            f.write(crest_svg(c))
    for lg in LEAGUES:
        with open(os.path.join(IMG, "leagues", lg[0] + ".svg"), "w", encoding="utf-8") as f:
            f.write(league_svg(lg))
    nn, nl, nc = emit_world()
    nt = copy_trophies()
    print(f"nations {nn} leagues {nl} clubs {nc} trophies {nt}")


if __name__ == "__main__":
    main()

# -*- coding: utf-8 -*-
"""Verified TheSportsDB idTeam map for Lenda club crests.

Prefer lookupteam.php?id=… over fuzzy searchteams.php. Name collisions
(e.g. search "Athletic Club" → Athletic-MG BR, not Athletic Bilbao ES)
poison downloads when pick_team falls back to teams[0].

Verified 2026-09-20 via lookupteam / league roster / official team pages.
"""

# game club id -> TheSportsDB idTeam
TEAM_IDS = {
    # Athletic* collision (Bilbao ≠ Minas)
    "ath": 133727,
    "athm": 147142,

    # Bari (SSC Bari)
    "bari": 133688,

    # Inter* collision (Milan ≠ Internacional ≠ Miami)
    "intm": 133681,
    "inter": 134281,
    "mia": 137699,

    # Sporting / Sport
    "spo": 135708,
    "spt": 136250,
    "bra": 134098,

    # América*
    "amg": 134742,
    "amea": 134193,
    "amec": 137604,

    # Botafogo*
    "bot": 134285,
    "bsp": 136830,

    # Rangers*
    "ran": 133642,
    "ranfc": 139911,

    # United / City
    "mun": 133612,
    "mci": 133613,
    "atl": 135851,
    "nyc": 134630,
    "rvs": 139914,
    "lee": 133635,
    "cov": 133625,
    "hul": 133617,

    # Atlético / Athletico
    "atm": 133729,
    "cam": 134299,
    "cap": 134297,
    "ago": 134737,

    # Spain core
    "rma": 133738,
    "fcb": 133739,
    "sev": 133735,
    "vil": 133740,
    "rso": 133724,
    "val": 133725,
    "bet": 133722,
    "celv": 133937,

    # England extras
    "avl": 133601,
    "whu": 133636,
    "bha": 133619,
    "eve": 133615,
    "cry": 133632,
    "ful": 133600,
    "wol": 133599,
    "nfo": 133720,
    "ips": 133622,
    "bou": 134301,
    "bre": 134355,
    "sun": 133603,

    # Italy / Germany / France extras
    "ata": 134782,
    "fio": 133674,
    "bol": 134781,
    "tor": 133687,
    "wlf": 133655,
    "bmg": 134779,
    "fre": 133653,
    "hof": 133657,
    "renn": 133719,
    "len": 133822,
    "str": 133882,
    "nte": 133861,
    "elv": 138411,
    "s04": 133661,
    "pad": 134551,
    "tro": 134789,
    "lem": 133848,

    # Other UEFA extras
    "vgu": 134115,
    "az": 133767,
    "twt": 133774,
    "clb": 133789,
    "and": 133776,
    "gal": 133804,
    "fen": 133807,
    "cel": 133647,

    # Brazil Serie B / newcomers
    "mir": 141181,
    "nov": 141182,
    "chp": 134464,
    "rem": 137818,
    "jve": 135887,
    "lon": 135664,
    "sbe": 145389,
    "cri": 134292,
    "crb": 135680,
    "cui": 136831,
    "ope": 136829,
    "vna": 134734,
    "vit": 134280,
    "ctb": 134298,

    # Crest-fix 2026-09-21 (explicit IDs — avoid fuzzy mix-ups)
    "cre": 134224,   # Cremonese (IT)
    "parm": 135728,  # Parma Calcio (IT)
    "espy": 133734,  # RCD Espanyol (ES)
    "elc": 134384,   # Elche CF (ES)
    "levt": 133732,  # Levante UD (ES) — not Bayer Leverkusen (lev)
    "vll": 133841,   # Real Valladolid (ES)
    "lil": 133711,   # Lille OSC (FR) — not Lille HC hockey
    "new": 134777,   # Newcastle United (EN) — not Newcastle Jets
    "mon": 133823,   # AS Monaco FC (soccer) — not AS Monaco Basket
    "tig": 134197,   # Tigres UANL (MX) — not Tigres FC Colombia
    "plrm": 138166,  # Palermo FC (IT) — never "pal" (Palmeiras)
    "pal": 134465,   # Palmeiras (BR)

}

COLLISION_WARN = {
    "Athletic Club": "Use ath=133727 (Bilbao) or athm=147142 (MG) — bare search returns MG",
    "Botafogo": "Use bot=134285 (RJ) or bsp=136830 (SP)",
    "Rangers": "Use ran=133642 (Scotland) or ranfc=139911 (Nigeria)",
    "America": "Use amg/amea/amec ids — never bare America",
    "Sporting": "Use spo=135708 (CP) — not Cristal/Recife/Braga fuzzy",
    "Inter": "Use intm/inter/mia ids — never bare Inter",
    "Brighton": "Use bha=133619 (Male) — search often returns Brighton WFC",
}


def team_id(cid):
    """Return TheSportsDB idTeam for a game club id, or None."""
    return TEAM_IDS.get(cid)


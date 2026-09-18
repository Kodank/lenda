# Trophy image sources

Corrected remapping: older SportsDB IDs mixed up FA Cup / Libertadores / etc. Each file below is the canonical `img/trophies/<id>.png` referenced from `TROPHIES` in `js/data.js`.

| ID | Source |
|----|--------|
| `brasileirao` | TheSportsDB (verified league name) |
| `serie_b` | TheSportsDB (verified league name) |
| `premier` | TheSportsDB (verified league name) |
| `laliga` | TheSportsDB (verified league name) |
| `seriea` | TheSportsDB (verified league name) |
| `bundesliga` | TheSportsDB (verified league name) |
| `ligue1` | TheSportsDB (verified league name) |
| `primerliga` | TheSportsDB (verified league name) |
| `ligapro` | TheSportsDB (verified league name) |
| `eredivisie` | TheSportsDB (verified league name) |
| `liga_mx` | TheSportsDB (verified league name) |
| `mls` | TheSportsDB (verified league name) |
| `j1` | Stylized distinct generic cup (no suitable Commons photo found); style=6 |
| `uruprimera` | Stylized distinct generic cup (no suitable Commons photo found); style=5 |
| `colbetplay` | TheSportsDB (verified league name) |
| `npfl` | Stylized distinct generic cup (no suitable Commons photo found); style=7 |
| `senliga` | Stylized distinct generic cup (no suitable Commons photo found); style=4 |
| `proleague` | TheSportsDB (verified league name) |
| `superlig` | TheSportsDB (verified league name) |
| `scottish` | TheSportsDB (verified league name) |
| `copa` | Distinct stylized generic national cup (fallback; not shared with Copa do Brasil) |
| `copa_br` | TheSportsDB (verified league name) |
| `fa_cup` | TheSportsDB (verified league name) |
| `copa_rey` | TheSportsDB (verified league name) |
| `coppa_ita` | TheSportsDB (verified league name) |
| `dfb_pokal` | TheSportsDB (verified league name) |
| `coupe_fr` | TheSportsDB (verified league name) |
| `taca_pt` | TheSportsDB (verified league name) |
| `copa_arg` | TheSportsDB (verified league name) |
| `libertadores` | TheSportsDB (verified league name) |
| `ucl` | TheSportsDB (verified league name) |
| `clubworldcup` | Wikimedia Commons — CWC Trophy 2025.png |
| `worldcup` | TheSportsDB (verified league name) |
| `copaamerica` | High-res Copa América trophy cutout → transparent PNG (alpha); sourced from pngdownload.io studio cutout of the official cup (plaques / COPA AMERICA engraving), rembg + crop to match other trophies |
| `euro` | Wikimedia Commons — Henri Delaunay / Euro trophy |
| `youth` | Stylized distinct generic cup (no suitable Commons photo found); style=1 |
| `balon` | Generated Ballon d'Or-style golden ball (existing asset was a Zidane poster) |
| `bota` | Generated Golden Shoe stylized icon |
| `luva` | Generated Golden Glove / Yashin-style icon |
| `mvp` | Generated MVP star award icon |

## Notes
- Prefer TheSportsDB trophy cutouts (black bg → made transparent) when league name matched.
- Wikimedia Commons used for Euro (Henri Delaunay), Copa América, Club World Cup.
- Obscure leagues without a free Commons photo (NPFL, Senegal, J1, Uruguay after failed distinct match) use **distinct** stylized generics — never FA Cup / Libertadores / UCL.
- Individual awards (balon/bota/luva/mvp) regenerated as clean icons (old balon was a Zidane poster).

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
| `clubworldcup` | pngdownload.io FIFA Club World Cup 2025 product cutout + rembg alpha; cache-bust `?v=indiv-hq-1` — replaces prior stylized Commons Inkscape icon |
| `worldcup` | TheSportsDB (verified league name) |
| `copaamerica` | pngdownload.io studio cutout (Oct 2025 AVIF → PNG) + rembg alpha; cache-bust `?v=ca2` — replaces prior stadium-reflection cutout that still looked like the museum photo |
| `euro` | Wikimedia Commons — Henri Delaunay / Euro trophy |
| `youth` | Stylized distinct generic cup (no suitable Commons photo found); style=1 |
| `balon` | pngdownload.io Ballon d'Or studio cutout (AVIF→PNG) + rembg alpha; cache-bust `?v=indiv-hq-1` |
| `bota` | Wikimedia Commons — Messi's Golden Shoe (51937265513).jpg crop + rembg; European Golden Shoe / Chuteira de Ouro; cache-bust `?v=indiv-hq-1` |
| `luva` | adidas FIFA World Cup 2026 Golden Glove product photo (House of Heat / Sanity CDN) crop + rembg; cache-bust `?v=indiv-hq-1` |
| `mvp` | adidas FIFA Golden Ball (best player) product photo crop + rembg — used for Melhor do campeonato; cache-bust `?v=indiv-hq-1` |

## Notes
- Prefer TheSportsDB trophy cutouts (black bg → made transparent) when league name matched.
- Wikimedia Commons used for Euro (Henri Delaunay), Copa América, Club World Cup.
- Obscure leagues without a free Commons photo (NPFL, Senegal, J1, Uruguay after failed distinct match) use **distinct** stylized generics — never FA Cup / Libertadores / UCL.
- Individual awards (balon/bota/luva/mvp) + Club World Cup replaced with photoreal transparent PNGs (pngdownload / Commons photo / adidas product shots + rembg).

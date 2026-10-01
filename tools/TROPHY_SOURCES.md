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
| `j1` | TheSportsDB Japanese J1 League Schale cutout (`mbbzjn1750168223`) + rembg/chroma; cache-bust `?v=sub20-hq-1` |
| `uruprimera` | TheSportsDB Uruguayan Primera División trophy (`6b3fgj1702965059`) + rembg/chroma; cache-bust `?v=sub20-hq-1` |
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
| `knvb` | TheSportsDB Dutch KNVB Cup (`4902` / `mfvzr81611677287`) + rembg/chroma; cache-bust `?v=trophies-world-1` |
| `scottish_cup` | TheSportsDB Scottish FA Cup (`4723` / `swnyde1776706387`) + rembg/chroma; cache-bust `?v=trophies-world-1` |
| `copa_be` | TheSportsDB Belgian Cup / Croky (`5831` / `kjcazc1782151263`) + rembg/chroma; cache-bust `?v=trophies-world-1` |
| `copa_tr` | TheSportsDB Turkish Cup (`4960` / `djxbyv1776826375`) + rembg/chroma; cache-bust `?v=trophies-world-1` |
| `copa_col` | Wikimedia Commons Trofeo de copa illustration (distinct from Liga BetPlay) + rembg; cache-bust `?v=trophies-world-1` |
| `us_open` | TheSportsDB US Open Cup (`5199` / `8qs1ya1749724650`) + rembg/chroma; cache-bust `?v=trophies-world-1` |
| `emperor` | Wikimedia Commons Emperor's Cup museum photo (`IMG_5251`) crop + rembg; cache-bust `?v=trophies-world-1` |
| `copa_uy` | TheSportsDB Copa AUF Uruguay (`5526` / `1zx6st1761788930`) + rembg/chroma; cache-bust `?v=trophies-world-1` |
| `copa_mx` | Wikimedia Commons Copa MX Apertura 2012 trophy photo + rembg; cache-bust `?v=trophies-world-1` |
| `libertadores` | TheSportsDB (verified league name) |
| `ucl` | TheSportsDB (verified league name) |
| `clubworldcup` | pngdownload.io FIFA Club World Cup 2025 product cutout + rembg alpha; cache-bust `?v=indiv-hq-1` — replaces prior stylized Commons Inkscape icon |
| `worldcup` | TheSportsDB (verified league name) |
| `copaamerica` | pngdownload.io studio cutout (Oct 2025 AVIF → PNG) + rembg alpha; cache-bust `?v=ca2` — replaces prior stadium-reflection cutout that still looked like the museum photo |
| `euro` | Wikimedia Commons Henri Delaunay museum photo + rembg alpha (pedestal removed); cache-bust `?v=eurocopa-alpha-1` |
| `youth` | FIFA U-20 World Cup trophy studio cutout (pngitem 569-5697471) + rembg alpha; cache-bust `?v=sub20-hq-1` — Título Sub-20 |
| `balon` | pngdownload.io Ballon d'Or studio cutout (AVIF→PNG) + rembg alpha; cache-bust `?v=indiv-hq-1` |
| `bota` | Wikimedia Commons — Messi's Golden Shoe (51937265513).jpg crop + rembg; European Golden Shoe / Chuteira de Ouro; cache-bust `?v=indiv-hq-1` |
| `luva` | adidas FIFA World Cup 2026 Golden Glove product photo (House of Heat / Sanity CDN) crop + rembg; cache-bust `?v=indiv-hq-1` |
| `mvp` | adidas FIFA Golden Ball (best player) product photo crop + rembg — used for Melhor do campeonato; cache-bust `?v=indiv-hq-1` |

## Notes
- Prefer TheSportsDB trophy cutouts (black bg → made transparent) when league name matched.
- Wikimedia Commons used for Euro (Henri Delaunay), Copa América, Club World Cup.
- Obscure leagues without a free photo (NPFL, Senegal Ligue 1) and the shared generic `copa` (Nigeria/Senegal national-cup fallback) still use **distinct** stylized generics — never FA Cup / Libertadores / UCL.
- World cups pack (`trophies-world-1`): KNVB, Scottish Cup, Belgian Cup, Turkish Cup, US Open Cup, Copa AUF Uruguay, Copa MX, Emperor's Cup, Copa Colômbia — wired in `NATION_CUP` + league `cupTrophy`.
- J1 Schale + Uruguay Primera + FIFA U-20 World Cup replaced with photoreal transparent PNGs (TheSportsDB / pngitem + rembg).
- Individual awards (balon/bota/luva/mvp) + Club World Cup replaced with photoreal transparent PNGs (pngdownload / Commons photo / adidas product shots + rembg).

| `acl` | Stylized AFC Champions League cup (transparent); cache-bust `trophies-alpha-1` |
| `caf` | Stylized CAF Champions League cup (transparent); cache-bust `trophies-alpha-1` |
| `concacaf` | Stylized Concacaf Champions Cup (transparent); cache-bust `trophies-alpha-1` |
| `serie_c` / `championship` / `bundesliga2` / `ligue2` / `segunda` / `serie_b_ita` | Distinct copies of nearest league art for 2nd-div titles (no more generic `copa` as league trophy) |
| `copa_ng` / `copa_sn` | Distinct national-cup art for Nigeria / Senegal (no shared generic `copa`) |

## Continental wiring (trophies-alpha-1)
- UEFA leagues → `ucl`; CONMEBOL → `lib`/`libertadores`
- AFC (J1) → `acl`; CAF (NPFL, Senegal) → `caf`; CONCACAF (MLS, Liga MX) → `concacaf`
- `dev.js` `contTrophy()` never falls back null→`ucl`
- `sim.js` never invents UCL for non-UEFA; `contQual` only when `league.continental` set

## assets-fix-2 (2026-09-21)
- `acl` / `caf` / `concacaf`: photoreal transparent rembg (AFC jpg cutout / Commons CAF / CONCACAF product photo) — never ucl.png
- `npfl`: rembg from Commons Akwa United NPFL lift photo
- `senliga` / `copa_ng` / `copa_sn`: distinct photoreal cup art (no shared generic `copa`)
- `copa_col`: TheSportsDB Copa Colombia trophy cutout
- Display remap: legacy `ucl` → acl/caf/concacaf/libertadores by nation.conf for non-UEFA clubs
- SOURCE `js/world.js` league.trophy: usa→mls, jpn→j1, mex→liga_mx, nga→npfl, sen→senliga, uy→uruprimera, col→colbetplay
| `npfl` | Silver football cup (TheSportsDB Ghanaian Premier League trophy `5p82xy1758093176`) — no official NPFL cutout exists; previous asset was a team photo |
| `concacaf` | Wikimedia Commons museum photo of 1972 CONCACAF Champions' Cup (CD Olimpia) + rembg; cache `npfl-concacaf-2` |



## nations-1 (2026-09-30)

Real TheSportsDB league trophy/badge cutouts (transparent PNGs already) unless noted. Each id is its own file.

| ID | Source |
|----|--------|
| `primera_cl` | TheSportsDB Chile Primera Division trophy `pc5q211747119036` — https://r2.thesportsdb.com/images/media/league/trophy/pc5q211747119036.png |
| `copa_cl` | TheSportsDB Copa Chile trophy `ssu74w1732152889` — https://r2.thesportsdb.com/images/media/league/trophy/ssu74w1732152889.png |
| `liga_ec` | TheSportsDB Ecuadorian Serie A trophy `trq1b41716301832` — https://r2.thesportsdb.com/images/media/league/trophy/trq1b41716301832.png |
| `copa_ec` | TheSportsDB Copa Ecuador trophy `gghphb1776553146` — https://r2.thesportsdb.com/images/media/league/trophy/gghphb1776553146.png |
| `primera_py` | TheSportsDB Paraguayan Primera trophy `kio0ex1610751915` — https://r2.thesportsdb.com/images/media/league/trophy/kio0ex1610751915.png |
| `copa_py` | TheSportsDB Copa Paraguay trophy `uj9fdu1780941744` — https://r2.thesportsdb.com/images/media/league/trophy/uj9fdu1780941744.png |
| `hnl` | TheSportsDB Croatian First Football League trophy `zhp18a1715259853` — https://r2.thesportsdb.com/images/media/league/trophy/zhp18a1715259853.png |
| `slgreece` | TheSportsDB Greek Super League 1 trophy `y96u431716371640` — https://r2.thesportsdb.com/images/media/league/trophy/y96u431716371640.png |
| `greek_cup` | TheSportsDB Greek Football Cup trophy `ud36ai1781757494` — https://r2.thesportsdb.com/images/media/league/trophy/ud36ai1781757494.png |
| `rpl` | TheSportsDB Russian Premier League trophy `zg8zxb1750688658` — https://r2.thesportsdb.com/images/media/league/trophy/zg8zxb1750688658.png |
| `russian_cup` | TheSportsDB Russia Cup trophy `uf3kbo1782109484` — https://r2.thesportsdb.com/images/media/league/trophy/uf3kbo1782109484.png |
| `botola` | TheSportsDB Moroccan Championship / Botola trophy `5fjhsc1551439097` — https://r2.thesportsdb.com/images/media/league/trophy/5fjhsc1551439097.png |
| `trone` | Wikimedia Commons `File:COUPE_DU_TRONE.png` (already transparent) — https://commons.wikimedia.org/wiki/File:COUPE_DU_TRONE.png |
| `kleague` | TheSportsDB K League 1 trophy `y5ah3s1711189638` — https://r2.thesportsdb.com/images/media/league/trophy/y5ah3s1711189638.png |
| `korea_cup` | TheSportsDB Korea Cup trophy `p1ewzn1782063303` — https://r2.thesportsdb.com/images/media/league/trophy/p1ewzn1782063303.png |
| `cpl` | TheSportsDB Canadian Premier League trophy `xhb8ae1784004623` — https://r2.thesportsdb.com/images/media/league/trophy/xhb8ae1784004623.png |
| `can_champ` | TheSportsDB Canadian Championship trophy `hpmz1l1784004504` — https://r2.thesportsdb.com/images/media/league/trophy/hpmz1l1784004504.png |
| `afcon` | TheSportsDB African Cup of Nations trophy `a02gac1701102618` — https://r2.thesportsdb.com/images/media/league/trophy/a02gac1701102618.png |
| `asiancup` | TheSportsDB AFC Asian Cup trophy `9zysg71701099946` — https://r2.thesportsdb.com/images/media/league/trophy/9zysg71701099946.png |
| `goldcup` | TheSportsDB CONCACAF Gold Cup trophy `efr5us1702273097` — https://r2.thesportsdb.com/images/media/league/trophy/efr5us1702273097.png |

Not shipped: Hrvatski kup / Rabuzinovo sunce. No TheSportsDB league and no Commons cutout. Croatia league `cupTrophy` is `false` so the generic `copa.png` is not reused. League logos are TheSportsDB `strBadge` for the same competitions (flagcdn for flags). Crests are each club's TheSportsDB `og:image`, checked against the club name.

## nordic-1 (2026-10-01)

TheSportsDB transparent cutouts. Cache-bust `nordic-1`. Crests: each club's `strBadge` (Superliga 2026-27, Allsvenskan 2026, Eliteserien 2026). Flags: flagcdn official-ratio PNGs (Denmark, Sweden, Norway).

| ID | Source |
|----|--------|
| `dsliga` | TheSportsDB Danish Superliga trophy `uqywpu1422281651` (DBU championship cup) — https://r2.thesportsdb.com/images/media/league/trophy/uqywpu1422281651.png |
| `allsvenskan` | TheSportsDB Swedish Allsvenskan trophy (Lennart Johanssons Pokal) `0zpqqm1610917265` |
| `eliteserien` | TheSportsDB Norwegian Eliteserien trophy `uz9kw61778714637` |
| `svenska_cup` | TheSportsDB Svenska Cupen trophy `npi5x51779557615` |
| `nm_cup` | TheSportsDB Norwegian Cupen trophy `5df4xs1751133808` (Kongepokal, base reads KONGENS P…) |

Not shipped: Sydbank Pokalen / DBU Pokalen as its own file. The only free DBU cutout is the Superliga trophy above, so Danish league `cupTrophy` is `false` (no `copa.png` reuse).

# Lenda

Simulador de carreira de jogador de futebol no navegador (pt-BR).

Cria o jogador (país, posição, camisa, perna), escolhe a base, decide a cada ~2 temporadas e termina num quadro com as cores e o escudo do clube.

## Abrir

**Windows:** dois cliques em `abrir.bat` (sobe um servidor local na porta 8765).

**Qualquer SO:**

```bash
cd lenda-repo
python3 -m http.server 8765
```

Abra http://localhost:8765

Ou, se já houver um servidor nessa pasta, abra `index.html` via esse servidor (evite `file://` por causa de alguns browsers com módulos/assets).

## Smoke test

```bash
node tools/smoke.js
```

## Changelog (destaque)

- Ofertas de academia: 3 clubes **aleatórios** da nacionalidade escolhida (nunca estrangeiros)
- Taças com nomes reais por competição (Brasileirão, Premier League, La Liga, FA Cup, Copa do Brasil, etc.)
- Popup animado a cada conquista (liga/copa/continental/seleção/prêmios) no fim da temporada
- Timeline fixa 24 linhas (16–39): densas, scroll interno; botões de decisão ficam visíveis
- Botão **Aposentar** a partir dos 35; aposentadoria forçada só aos 40
- Camisa SVG flat ilustrada estilo Copero (cores/padrões da seleção, gola/punhos, vincos sutis)
- Bandeiras PNG reais (flagcdn) em `img/flags/`
- Escudos PNG locais; logos de liga nas ofertas e na timeline
- Progressão rebalanceada; eventos com risco/recompensa; UI escura estilo carreira


Inspiração de UX: simuladores de carreira no estilo Copero — sem copiar assets/código proprietários.

## Fontes das imagens de taças (`img/trophies/`)

Preferência: fotos reais com fundo escuro/transparente.

| Arquivo | Origem |
|---------|--------|
| `premier.png`, `ucl.png`, `libertadores.png`, `brasileirao.png`, `clubworldcup.jpg`, `copaamerica.png`, `euro.png`, `copa.png`, `mvp.png`, `youth.png` | TheSportsDB / Wikimedia (downloads anteriores do projeto) |
| `fa_cup.jpg` | Wikimedia Commons — *The FA Cup Trophy.jpg* |
| `copa_rey.png` | Wikimedia Commons — *Copa del Rey Trophy.png* |
| `bundesliga.jpg` | Wikimedia Commons — *Trophy of Fußball-Bundesliga in Singapore, 2023.jpg* |
| `worldcup.jpg` | Wikimedia Commons — *FIFA World Cup Trophy (Ank Kumar, Infosys Limited) 01.jpg* |
| `coppa_ita.jpg` | Wikimedia Commons — *Coppa Italia.jpg* |
| `laliga.png`, `seriea.png`, `ligue1.png`, `proleague.png`, `superlig.png` | provisório: reuso de `premier.png` até arte dedicada |
| `primerliga.png`, `ligapro.png`, `eredivisie.png`, `copa_br.png`, `taca_pt.png`, `copa_arg.png`, `coupe_fr.png`, `dfb_pokal.png`, `mls.png`, … | provisório: reuso de `copa.png` / `youth.png` |

Licenças: assets do Wikimedia Commons sob as licenças de cada arquivo (CC / domínio público conforme página do arquivo). TheSportsDB: uso conforme termos da API gratuita.

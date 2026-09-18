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

Uma PNG canônica por ID em `TROPHIES` (`js/data.js`). Preferência: fotos reais com fundo removido.

Ver tabela completa em [`tools/TROPHY_SOURCES.md`](tools/TROPHY_SOURCES.md).

Smoke: `python3 tools/smoke_trophies.py` (garante hashes únicos entre IDs diferentes).


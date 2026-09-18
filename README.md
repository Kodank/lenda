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

- Camisa SVG com padrões por seleção (não placeholder clip-path)
- Bandeiras PNG reais (flagcdn) em `img/flags/`
- Escudos PNG locais; logos de liga nas ofertas e na timeline
- Taças grandes na vitrine, no relatório e no quadro final
- Progressão rebalanceada: base → minutos → pico → declínio; transferências passo-a-passo
- Eventos com risco/recompensa (treino em dobro, crise no clube, etc.)
- UI escura estilo jogo de carreira (timeline, cards, vitrine)

Inspiração de UX: simuladores de carreira no estilo Copero — sem copiar assets/código proprietários.

# Lenda

Simulador de carreira de jogador de futebol no navegador (**pt-BR**).

Cria o jogador, escolhe a base, decide temporada a temporada e fecha com um quadro da carreira (clubes, taças, seleção, prêmios).

**Jogar:** https://kodank.github.io/lenda/

Inspiração de UX: simuladores no estilo [Copero](https://copero.com.ar/juegos/simulador-carrera) — sem copiar assets ou código proprietários.

---

## Como jogar

1. Abra o link acima no PC ou no celular.
2. No celular: menu do navegador → **Adicionar à tela inicial** (PWA leve).
3. Depois de atualizações no site, faça um hard refresh se a versão antiga ficar em cache.

### Rodar local (opcional)

```bash
python3 -m http.server 8765
```

Abra http://localhost:8765  
No Windows também dá para usar `abrir.bat`. Evite abrir via `file://`.

---

## O que tem

- Setup em etapas: **país → camisa → posição → base**
- Carreira 16–40 anos, com empréstimos no começo, transferências e eventos
- Taças, bandeiras e escudos reais; resumo final para baixar
- Modo DEV (sandbox) para testes

---

## Dev

```bash
node tools/smoke.js
python3 tools/smoke_trophies.py
```

Fontes das imagens de taças: [`tools/TROPHY_SOURCES.md`](tools/TROPHY_SOURCES.md)

Repo: [github.com/Kodank/lenda](https://github.com/Kodank/lenda)

#!/usr/bin/env bash
cd "$(dirname "$0")"
PORT=8765
echo "Lenda — http://127.0.0.1:$PORT/"
echo "No celular (mesma Wi-Fi):"
ip -4 addr show scope global 2>/dev/null | awk '/inet /{print "  http://"$2}' | sed 's|/.*|:8765/|' \
  || hostname -I 2>/dev/null | tr ' ' '\n' | awk 'NF{print "  http://"$1":8765/"}'
echo "PWA: no navegador do telefone, Adicionar à tela inicial."
python3 -m http.server "$PORT"

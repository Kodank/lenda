@echo off
cd /d "%~dp0"
echo.
echo  Lenda — servidor local
echo  ----------------------
echo  Neste PC:  http://127.0.0.1:8765/
echo.
echo  No celular (mesma Wi-Fi), abra:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  for /f "tokens=1" %%b in ("%%a") do echo    http://%%b:8765/
)
echo.
echo  Dica: no Chrome/Safari do telefone, use "Adicionar a tela inicial" (PWA).
echo.
start http://127.0.0.1:8765/
python -m http.server 8765

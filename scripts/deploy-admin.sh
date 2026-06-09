#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB_ROOT="${WEB_ROOT:-/var/www/app.dimaalena.ru}"

cd "$ROOT"

echo "[deploy] Installing dependencies..."
npm install

echo "[deploy] Building admin Web App..."
npm run build:admin

echo "[deploy] Publishing to $WEB_ROOT ..."
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete "$ROOT/dist-admin/" "$WEB_ROOT/"
sudo chown -R www-data:www-data "$WEB_ROOT"

echo "[deploy] Build marker:"
grep -o "Сборка:[^\"']*" "$WEB_ROOT"/assets/*.js | head -1 || true

if grep -R "Скачать Excel" "$WEB_ROOT" >/dev/null 2>&1; then
  echo "[deploy] ERROR: old build still contains Excel button text"
  exit 1
fi

echo "[deploy] Restarting API..."
if pm2 describe dimaalena-api >/dev/null 2>&1; then
  pm2 restart dimaalena-api
elif pm2 describe wedding-api >/dev/null 2>&1; then
  pm2 restart wedding-api
else
  echo "[deploy] Warning: pm2 process not found. Start API manually."
fi

echo "[deploy] Done. Open Web App from Telegram (fully close and reopen)."

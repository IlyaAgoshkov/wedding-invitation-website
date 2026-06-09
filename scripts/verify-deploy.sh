#!/bin/bash
set -eu

WEB_ROOT="${WEB_ROOT:-/var/www/app.dimaalena.ru}"
PROJECT_ROOT="${PROJECT_ROOT:-$HOME/wedding-invitation-website}"

echo "=== nginx root ==="
grep -E '^\s*root\s' /etc/nginx/sites-available/app.dimaalena.ru || true

echo
echo "=== deployed index.html ==="
head -n 25 "$WEB_ROOT/index.html" 2>/dev/null || echo "MISSING: $WEB_ROOT/index.html"

echo
echo "=== index.html sanity ==="
if grep -q '/src/main.tsx' "$WEB_ROOT/index.html" 2>/dev/null; then
  echo "BAD: dev index.html deployed (contains /src/main.tsx)"
else
  echo "OK: production index.html"
fi

echo
echo "=== deployed assets ==="
ls -la "$WEB_ROOT/assets/" 2>/dev/null || echo "MISSING: assets folder"

echo
echo "=== Excel button in deployed JS (should be empty) ==="
grep -R "Скачать Excel" "$WEB_ROOT" 2>/dev/null || echo "OK: not found"

echo
echo "=== API on :3001 ==="
curl -s http://127.0.0.1:3001/api/health || echo "API DOWN"
echo
curl -I http://127.0.0.1:3001/api/admin/dashboard 2>/dev/null | head -1

echo
echo "=== pm2 ==="
pm2 status

echo
echo "=== live site ==="
curl -I https://app.dimaalena.ru 2>/dev/null | head -5
curl -I https://app.dimaalena.ru/assets/ 2>/dev/null | head -3

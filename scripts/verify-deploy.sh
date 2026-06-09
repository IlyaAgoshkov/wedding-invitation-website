#!/usr/bin/env bash
set -euo pipefail

WEB_ROOT="${WEB_ROOT:-/var/www/app.dimaalena.ru}"
PROJECT_ROOT="${PROJECT_ROOT:-$HOME/wedding-invitation-website}"

echo "=== nginx root ==="
grep -E '^\s*root\s' /etc/nginx/sites-available/app.dimaalena.ru || true

echo
echo "=== files in nginx root ==="
ls -la "$WEB_ROOT" 2>/dev/null || echo "MISSING: $WEB_ROOT"

echo
echo "=== Excel button in deployed JS (should be empty) ==="
grep -R "Скачать Excel" "$WEB_ROOT" 2>/dev/null || echo "OK: not found"

echo
echo "=== build marker in deployed JS ==="
grep -o "Сборка:[^\"']*" "$WEB_ROOT"/assets/*.js 2>/dev/null | head -1 || echo "MISSING: old build without version marker"

echo
echo "=== API on :3001 ==="
curl -s http://127.0.0.1:3001/api/health || echo "API DOWN"
echo
curl -I http://127.0.0.1:3001/api/admin/dashboard 2>/dev/null | head -1

echo
echo "=== pm2 ==="
pm2 status

echo
echo "=== project dist-admin ==="
ls -la "$PROJECT_ROOT/dist-admin/index.html" 2>/dev/null || echo "MISSING: run npm run build:admin in project"

echo
echo "=== live site headers ==="
curl -I https://app.dimaalena.ru 2>/dev/null | head -5

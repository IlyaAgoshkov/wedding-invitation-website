import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const webRoot = process.env.WEB_ROOT || '/var/www/app.dimaalena.ru'

function run(command) {
  console.log(`[deploy] $ ${command}`)
  execSync(command, { cwd: root, stdio: 'inherit' })
}

function pm2Exists(name) {
  try {
    execSync(`pm2 describe ${name}`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

run('npm install')
run('npm run build:admin')

const indexPath = join(root, 'dist-admin/index.html')
const indexHtml = readFileSync(indexPath, 'utf8')

if (indexHtml.includes('/src/main.tsx')) {
  console.error('[deploy] ERROR: dist-admin/index.html looks like a dev file.')
  process.exit(1)
}

if (!indexHtml.includes('/assets/')) {
  console.error('[deploy] ERROR: dist-admin/index.html has no /assets/ references.')
  process.exit(1)
}

console.log(`[deploy] Publishing to ${webRoot} ...`)
run(`sudo mkdir -p ${webRoot}`)
run(`sudo rsync -a --delete ${join(root, 'dist-admin/')} ${webRoot}/`)
run(`sudo chown -R www-data:www-data ${webRoot}`)

try {
  execSync(`grep -R "Скачать Excel" ${webRoot}`, { stdio: 'ignore' })
  console.error('[deploy] ERROR: old build still contains Excel button text.')
  process.exit(1)
} catch {
  // not found — OK
}

console.log('[deploy] Restarting API...')
if (pm2Exists('dimaalena-api')) {
  run('pm2 restart dimaalena-api')
} else if (pm2Exists('wedding-api')) {
  run('pm2 restart wedding-api')
} else {
  console.warn('[deploy] Warning: pm2 process not found. Start API manually.')
}

console.log('[deploy] Done. Fully close Web App in Telegram and reopen.')

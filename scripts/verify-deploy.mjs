import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const webRoot = process.env.WEB_ROOT || '/var/www/app.dimaalena.ru'
const projectRoot = process.env.PROJECT_ROOT || join(process.env.HOME || '', 'wedding-invitation-website')

function section(title) {
  console.log(`\n=== ${title} ===`)
}

function run(command) {
  try {
    console.log(execSync(command, { encoding: 'utf8' }).trim())
  } catch (error) {
    const output = error.stdout?.toString?.() || error.stderr?.toString?.() || error.message
    console.log(output.trim())
  }
}

section('nginx root')
run("grep -E '^\\s*root\\s' /etc/nginx/sites-available/app.dimaalena.ru || true")

section('deployed index.html')
if (existsSync(join(webRoot, 'index.html'))) {
  console.log(readFileSync(join(webRoot, 'index.html'), 'utf8').split('\n').slice(0, 25).join('\n'))
} else {
  console.log(`MISSING: ${join(webRoot, 'index.html')}`)
}

section('index.html sanity')
const deployedIndex = existsSync(join(webRoot, 'index.html'))
  ? readFileSync(join(webRoot, 'index.html'), 'utf8')
  : ''

if (deployedIndex.includes('/src/main.tsx')) {
  console.log('BAD: dev index.html deployed (contains /src/main.tsx)')
} else if (deployedIndex.includes('/assets/')) {
  console.log('OK: production index.html')
} else {
  console.log('BAD: index.html has no /assets/ references')
}

section('deployed assets')
if (existsSync(join(webRoot, 'assets'))) {
  console.log(readdirSync(join(webRoot, 'assets')).join('\n'))
} else {
  console.log('MISSING: assets folder')
}

section('API on :3001')
run('curl -s http://127.0.0.1:3001/api/health')
run('curl -I http://127.0.0.1:3001/api/admin/dashboard 2>/dev/null | head -1')

section('pm2')
run('pm2 status')

section('live site')
run('curl -I https://app.dimaalena.ru 2>/dev/null | head -5')

section('project dist-admin')
if (existsSync(join(projectRoot, 'dist-admin/index.html'))) {
  console.log('OK:', join(projectRoot, 'dist-admin/index.html'))
} else {
  console.log('MISSING: run npm run build:admin in project')
}

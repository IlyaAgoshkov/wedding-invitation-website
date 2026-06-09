import crypto from 'node:crypto'
import { TELEGRAM_ADMIN_ID, TELEGRAM_BOT_TOKEN } from './config.js'

const INIT_DATA_MAX_AGE_SEC = 86400

export function validateInitData(initData) {
  if (!initData || !TELEGRAM_BOT_TOKEN) {
    return null
  }

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')

  if (!hash) {
    return null
  }

  params.delete('hash')

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(TELEGRAM_BOT_TOKEN).digest()
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  if (calculatedHash !== hash) {
    return null
  }

  const authDate = Number(params.get('auth_date'))
  if (!Number.isFinite(authDate) || Date.now() / 1000 - authDate > INIT_DATA_MAX_AGE_SEC) {
    return null
  }

  const userRaw = params.get('user')
  if (!userRaw) {
    return null
  }

  try {
    return JSON.parse(userRaw)
  } catch {
    return null
  }
}

export function isDevAuthEnabled() {
  return String(process.env.ADMIN_DEV_AUTH ?? '').trim() === 'true'
}

export function requireAdmin(req, res, next) {
  const authHeader = String(req.headers.authorization ?? '')

  if (authHeader.startsWith('tma ')) {
    const user = validateInitData(authHeader.slice(4))

    if (user && Number(user.id) === Number(TELEGRAM_ADMIN_ID)) {
      req.telegramUser = user
      next()
      return
    }
  }

  if (isDevAuthEnabled()) {
    next()
    return
  }

  res.status(401).json({ error: 'Откройте приложение через Telegram-бота.' })
}

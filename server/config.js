import dotenv from 'dotenv'

dotenv.config()

export const TELEGRAM_BOT_TOKEN = String(process.env.TELEGRAM_BOT_TOKEN ?? '').trim()
export const TELEGRAM_ADMIN_ID = Number(
  String(process.env.TELEGRAM_ADMIN_ID ?? '1179775673').trim(),
)
export const PORT = Number(process.env.PORT ?? '3001')
export const WEBAPP_URL = String(process.env.WEBAPP_URL ?? 'https://app.dimaalena.ru').trim()

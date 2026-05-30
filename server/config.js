import dotenv from 'dotenv'

dotenv.config()

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? ''
export const TELEGRAM_ADMIN_ID = Number(process.env.TELEGRAM_ADMIN_ID ?? '1179775673')
export const PORT = Number(process.env.PORT ?? '3001')

import express from 'express'
import cors from 'cors'
import { PORT, TELEGRAM_ADMIN_ID } from './config.js'
import { CHILDREN_VALUES } from './children.js'
import { addResponse } from './storage.js'
import { createBot, notifyAdminAboutRsvp, setupBotCommands } from './telegram.js'

const app = express()
const bot = createBot()

app.use(cors())
app.use(express.json({ limit: '32kb' }))

app.get('/', (_req, res) => {
  res.status(200).type('text/plain').send(
    'Wedding invitation API is running.\n\n' +
      'Open the site at http://localhost:5173 (run: npm run dev).\n' +
      'Or run both together: npm run dev:all',
  )
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/rsvp', async (req, res) => {
  try {
    const lastName = String(req.body?.lastName ?? '').trim()
    const firstName = String(req.body?.firstName ?? '').trim()
    const attendance = String(req.body?.attendance ?? '').trim()
    const comment = String(req.body?.comment ?? '').trim()
    const children = String(req.body?.children ?? 'none').trim()
    const adults = Number(req.body?.adults ?? 1)
    const favoriteSong = String(
      req.body?.favoriteSong ?? req.body?.music ?? req.body?.favoriteMusic ?? req.body?.song ?? '',
    ).trim()

    if (!lastName || lastName.length > 60) {
      res.status(400).json({ error: 'Укажите корректную фамилию.' })
      return
    }

    if (!firstName || firstName.length > 60) {
      res.status(400).json({ error: 'Укажите корректное имя.' })
      return
    }

    if (!['yes', 'no'].includes(attendance)) {
      res.status(400).json({ error: 'Выберите корректный ответ.' })
      return
    }

    if (attendance === 'yes' && !CHILDREN_VALUES.includes(children)) {
      res.status(400).json({ error: 'Выберите корректный вариант про детей.' })
      return
    }

    if (attendance === 'yes' && (!Number.isInteger(adults) || adults < 1 || adults > 4)) {
      res.status(400).json({ error: 'Укажите корректное количество взрослых.' })
      return
    }

    if (favoriteSong.length > 120) {
      res.status(400).json({ error: 'Название песни слишком длинное.' })
      return
    }

    if (comment.length > 1000) {
      res.status(400).json({ error: 'Комментарий слишком длинный.' })
      return
    }

    const entry = await addResponse({
      lastName,
      firstName,
      attendance,
      comment,
      adults: attendance === 'yes' ? adults : 0,
      children: attendance === 'yes' ? children : 'none',
      favoriteSong: attendance === 'yes' ? favoriteSong : '',
    })

    try {
      await notifyAdminAboutRsvp(bot, entry)
    } catch (error) {
      console.error('[telegram] Failed to notify admin:', error)
    }

    res.status(201).json({ ok: true })
  } catch (error) {
    console.error('[api/rsvp] Failed to save response:', error)
    res.status(500).json({ error: 'Не удалось отправить ответ. Попробуйте позже.' })
  }
})

app.listen(PORT, () => {
  console.log(`[server] API listening on http://localhost:${PORT}`)
  console.log(`[server] Telegram admin id: ${TELEGRAM_ADMIN_ID}`)
  console.log('[server] Site locally: npm run dev:all → http://localhost:5173')
})

let botRunning = false

async function startBot() {
  if (!bot) return

  try {
    const me = await bot.telegram.getMe()
    console.log(`[telegram] Authenticated as @${me.username}`)

    await bot.launch()
    botRunning = true

    try {
      await setupBotCommands(bot)
    } catch (error) {
      console.warn('[telegram] Admin menu will be set after /start:', error.message)
    }

    console.log('[telegram] Bot started')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[telegram] Bot failed to start:', message)

    if (message.includes('404')) {
      console.error('[telegram] TELEGRAM_BOT_TOKEN в .env неверный. Получите новый у @BotFather.')
    }

    if (message.includes('409')) {
      console.error(
        '[telegram] Уже запущен другой экземпляр бота. Остановите все npm start / dev:server и перезапустите.',
      )
    }

    console.warn('[telegram] RSVP API will keep working without Telegram notifications.')
  }
}

if (bot) {
  void startBot()

  const gracefulStop = (signal) => {
    if (!botRunning) {
      process.exit(0)
      return
    }

    bot
      .stop(signal)
      .catch(() => {})
      .finally(() => process.exit(0))
  }

  process.once('SIGINT', () => gracefulStop('SIGINT'))
  process.once('SIGTERM', () => gracefulStop('SIGTERM'))
}

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

    if (comment.length > 1000) {
      res.status(400).json({ error: 'Комментарий слишком длинный.' })
      return
    }

    const entry = await addResponse({
      lastName,
      firstName,
      attendance,
      comment,
      children: attendance === 'yes' ? children : 'none',
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
})

if (bot) {
  bot
    .launch()
    .then(async () => {
      try {
        await setupBotCommands(bot)
      } catch (error) {
        console.warn('[telegram] Admin menu will be set after /start:', error.message)
      }
      console.log('[telegram] Bot started')
    })
    .catch((error) => {
      console.error('[telegram] Bot failed to start:', error.message)
      console.warn('[telegram] RSVP API will keep working; stop other bot instances and restart.')
    })

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

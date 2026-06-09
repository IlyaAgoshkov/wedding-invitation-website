import { Telegraf, Input } from 'telegraf'
import { TELEGRAM_ADMIN_ID, TELEGRAM_BOT_TOKEN, WEBAPP_URL } from './config.js'
import { getStatusLabel } from './attendance.js'
import { getChildrenLabel } from './children.js'
import { buildRsvpExcelBuffer } from './excel.js'
import { readResponses } from './storage.js'
import { calculateRsvpStats, formatStatsMessage, getFullName } from './stats.js'

function isAdmin(userId) {
  return Number(userId) === Number(TELEGRAM_ADMIN_ID)
}

async function replyCommandError(ctx, command, error) {
  console.error(`[telegram] ${command} failed:`, error)
  await ctx.reply('Команда временно недоступна. Попробуйте позже или перезапустите сервер.')
}

export function createBot() {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('[telegram] TELEGRAM_BOT_TOKEN is not set. Bot and notifications are disabled.')
    return null
  }

  const bot = new Telegraf(TELEGRAM_BOT_TOKEN)

  bot.catch((error) => {
    console.error('[telegram] Unhandled bot error:', error)
  })

  bot.start(async (ctx) => {
    try {
      if (isAdmin(ctx.from?.id)) {
        try {
          await setupBotCommands(bot)
          await setupWebAppMenu(bot)
        } catch (error) {
          console.error('[telegram] Failed to set admin commands:', error)
        }

        const webAppKeyboard = WEBAPP_URL
          ? {
              inline_keyboard: [
                [{ text: '📋 Список гостей', web_app: { url: WEBAPP_URL } }],
              ],
            }
          : undefined

        await ctx.reply(
          'Бот RSVP для свадьбы Дмитрия и Алёны.\n\nКоманды:\n/stats — статистика гостей\n/export — скачать Excel-отчёт',
          webAppKeyboard ? { reply_markup: webAppKeyboard } : undefined,
        )
        return
      }

      await ctx.reply('Спасибо! Этот бот принимает ответы с сайта приглашения.')
    } catch (error) {
      await replyCommandError(ctx, '/start', error)
    }
  })

  bot.command('export', async (ctx) => {
    try {
      if (!isAdmin(ctx.from?.id)) {
        await ctx.reply('У вас нет доступа к этой команде.')
        return
      }

      const responses = await readResponses()

      if (responses.length === 0) {
        await ctx.reply('Пока нет ни одного ответа RSVP.')
        return
      }

      await ctx.reply('Готовлю Excel-отчёт...')

      const buffer = await buildRsvpExcelBuffer(responses)
      const fileBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)
      const filename = `rsvp-${new Date().toISOString().slice(0, 10)}.xlsx`

      await ctx.replyWithDocument(Input.fromBuffer(fileBuffer, filename), {
        caption: `Excel-отчёт: ${responses.length} ответ(ов)`,
      })
    } catch (error) {
      await replyCommandError(ctx, '/export', error)
    }
  })

  bot.command('stats', async (ctx) => {
    try {
      if (!isAdmin(ctx.from?.id)) {
        await ctx.reply('У вас нет доступа к этой команде.')
        return
      }

      const responses = await readResponses()

      if (responses.length === 0) {
        await ctx.reply('Пока нет ни одного ответа RSVP.')
        return
      }

      const stats = calculateRsvpStats(responses)
      await ctx.reply(formatStatsMessage(stats))
    } catch (error) {
      await replyCommandError(ctx, '/stats', error)
    }
  })

  return bot
}

export async function setupWebAppMenu(bot) {
  if (!WEBAPP_URL) {
    return
  }

  await bot.telegram.setChatMenuButton({
    chat_id: Number(TELEGRAM_ADMIN_ID),
    menu_button: {
      type: 'web_app',
      text: 'Список гостей',
      web_app: { url: WEBAPP_URL },
    },
  })
}

export async function setupBotCommands(bot) {
  await bot.telegram.setMyCommands([{ command: 'start', description: 'Начать' }], {
    scope: { type: 'default' },
  })

  await bot.telegram.setMyCommands(
    [
      { command: 'start', description: 'Начать' },
      { command: 'stats', description: 'Статистика гостей' },
      { command: 'export', description: 'Скачать Excel-отчёт RSVP' },
    ],
    {
      scope: { type: 'chat', chat_id: Number(TELEGRAM_ADMIN_ID) },
    },
  )
}

export async function notifyAdminAboutRsvp(bot, entry, { isUpdate = false } = {}) {
  if (!bot) return

  const heading = isUpdate ? '📝 Ответ обновлён' : '🎉 Новый ответ на приглашение'
  let text

  if (entry.attendance === 'yes') {
    text = [
      heading,
      '',
      `👤 Фамилия: ${entry.lastName}`,
      `👤 Имя: ${entry.firstName}`,
      `✅ Статус: ${getStatusLabel(entry.attendance)}`,
      `👥 Количество взрослых: ${entry.adults ?? 1}`,
      `🧒 Дети: ${getChildrenLabel(entry.children)}`,
      `🎵 Любимая песня: ${entry.favoriteSong || 'не указана'}`,
      entry.comment ? `💬 Комментарий: ${entry.comment}` : null,
      '',
      isUpdate ? 'Ответ успешно обновлён.' : 'Ответ успешно получен.',
    ]
      .filter(Boolean)
      .join('\n')
  } else {
    text = [
      isUpdate ? '📝 Ответ обновлён' : '📩 Новый ответ на приглашение',
      '',
      `👤 Фамилия: ${entry.lastName ?? getFullName(entry).split(' ')[0]}`,
      `👤 Имя: ${entry.firstName ?? getFullName(entry).split(' ').slice(1).join(' ')}`,
      `❌ Статус: ${getStatusLabel(entry.attendance)}`,
      entry.comment ? `💬 Комментарий: ${entry.comment}` : null,
      '',
      isUpdate ? 'Ответ успешно обновлён.' : 'Ответ успешно получен.',
    ]
      .filter(Boolean)
      .join('\n')
  }

  try {
    await bot.telegram.sendMessage(TELEGRAM_ADMIN_ID, text)
  } catch (error) {
    console.error('[telegram] Failed to send RSVP notification:', error)
  }
}

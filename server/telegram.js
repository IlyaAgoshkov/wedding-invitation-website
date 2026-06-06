import { Telegraf, Input } from 'telegraf'
import { TELEGRAM_ADMIN_ID, TELEGRAM_BOT_TOKEN } from './config.js'
import { getStatusLabel } from './attendance.js'
import { getChildrenLabel } from './children.js'
import { buildRsvpExcelBuffer } from './excel.js'
import { readResponses } from './storage.js'
import { calculateRsvpStats, formatStatsMessage, getFullName } from './stats.js'

function isAdmin(userId) {
  return userId === TELEGRAM_ADMIN_ID
}

export function createBot() {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('[telegram] TELEGRAM_BOT_TOKEN is not set. Bot and notifications are disabled.')
    return null
  }

  const bot = new Telegraf(TELEGRAM_BOT_TOKEN)

  bot.start(async (ctx) => {
    if (ctx.from.id === TELEGRAM_ADMIN_ID) {
      try {
        await setupBotCommands(bot)
      } catch (error) {
        console.error('[telegram] Failed to set admin commands:', error)
      }

      await ctx.reply(
        'Бот RSVP для свадьбы Дмитрия и Алёны.\n\nКоманды:\n/stats — статистика гостей\n/export — скачать Excel-отчёт',
      )
      return
    }

    await ctx.reply('Спасибо! Этот бот принимает ответы с сайта приглашения.')
  })

  bot.command('export', async (ctx) => {
    if (!isAdmin(ctx.from.id)) {
      await ctx.reply('У вас нет доступа к этой команде.')
      return
    }

    const responses = await readResponses()

    if (responses.length === 0) {
      await ctx.reply('Пока нет ни одного ответа RSVP.')
      return
    }

    const buffer = await buildRsvpExcelBuffer(responses)
    const filename = `rsvp-${new Date().toISOString().slice(0, 10)}.xlsx`

    await ctx.replyWithDocument(Input.fromBuffer(Buffer.from(buffer), filename), {
      caption: `Excel-отчёт: ${responses.length} ответ(ов)`,
    })
  })

  bot.command('stats', async (ctx) => {
    if (!isAdmin(ctx.from.id)) {
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
  })

  return bot
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
      scope: { type: 'chat', chat_id: TELEGRAM_ADMIN_ID },
    },
  )
}

export async function notifyAdminAboutRsvp(bot, entry) {
  if (!bot) return

  let text

  if (entry.attendance === 'yes') {
    text = [
      '🎉 Новый ответ на приглашение',
      '',
      `👤 Фамилия: ${entry.lastName}`,
      `👤 Имя: ${entry.firstName}`,
      `✅ Статус: ${getStatusLabel(entry.attendance)}`,
      `👥 Количество взрослых: ${entry.adults ?? 1}`,
      `🧒 Дети: ${getChildrenLabel(entry.children)}`,
      `🎵 Любимая песня: ${entry.favoriteSong || 'не указана'}`,
      entry.comment ? `💬 Комментарий: ${entry.comment}` : null,
      '',
      'Ответ успешно получен.',
    ]
      .filter(Boolean)
      .join('\n')
  } else {
    text = [
      '📩 Новый ответ на приглашение',
      '',
      `👤 Фамилия: ${entry.lastName ?? getFullName(entry).split(' ')[0]}`,
      `👤 Имя: ${entry.firstName ?? getFullName(entry).split(' ').slice(1).join(' ')}`,
      `❌ Статус: ${getStatusLabel(entry.attendance)}`,
      entry.comment ? `💬 Комментарий: ${entry.comment}` : null,
      '',
      'Ответ успешно получен.',
    ]
      .filter(Boolean)
      .join('\n')
  }

  await bot.telegram.sendMessage(TELEGRAM_ADMIN_ID, text)
}

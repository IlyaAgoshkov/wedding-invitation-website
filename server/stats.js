import { getChildrenCount } from './children.js'

export function getFullName(entry) {
  if (entry.lastName || entry.firstName) {
    return [entry.lastName, entry.firstName].filter(Boolean).join(' ').trim()
  }
  return entry.name ?? '—'
}

export function calculateRsvpStats(responses) {
  const confirmed = responses.filter((response) => response.attendance === 'yes')
  const adults = confirmed.reduce((sum, response) => sum + (response.adults ?? 1), 0)
  const children = confirmed.reduce(
    (sum, response) => sum + getChildrenCount(response.children),
    0,
  )

  const totalGuests = adults + children

  return {
    responsesTotal: responses.length,
    confirmedCount: totalGuests,
    declinedCount: responses.filter((response) => response.attendance === 'no').length,
    adults,
    children,
    totalGuests,
  }
}

export function formatStatsMessage(stats) {
  return [
    '📊 Статистика RSVP',
    '',
    `📝 Всего ответов: ${stats.responsesTotal}`,
    `✅ Подтвердили: ${stats.confirmedCount}`,
    `❌ Не смогут: ${stats.declinedCount}`,
    '',
    `👥 Взрослых: ${stats.adults}`,
    `🧒 Детей: ${stats.children}`,
    `👨‍👩‍👧‍👦 Всего гостей: ${stats.totalGuests}`,
  ].join('\n')
}

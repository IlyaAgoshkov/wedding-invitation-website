import { getStatusLabel } from './attendance.js'
import { getChildrenCount, getChildrenLabel } from './children.js'
import { buildRsvpExcelBuffer } from './excel.js'
import { readResponses } from './storage.js'
import { calculateRsvpStats, getFullName } from './stats.js'

function formatAdultsLabel(count) {
  const value = count ?? 1
  const mod10 = value % 10
  const mod100 = value % 100

  if (mod10 === 1 && mod100 !== 11) {
    return `${value} взрослый`
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${value} взрослых`
  }

  return `${value} взрослых`
}

function formatChildrenTag(children) {
  if (!children || children === 'none') {
    return 'Без детей'
  }

  const count = getChildrenCount(children)
  if (count === 1) {
    return '1 ребёнок'
  }

  if (count === 2) {
    return '2 ребёнка'
  }

  return '3+ детей'
}

function getAttendanceBadge(attendance) {
  switch (attendance) {
    case 'yes':
      return { label: 'Будет', tone: 'yes' }
    case 'no':
      return { label: 'Не будет', tone: 'no' }
    default:
      return { label: 'Неизвестно', tone: 'unknown' }
  }
}

function getLatestUpdatedAt(responses) {
  let latest = null

  for (const entry of responses) {
    const timestamp = entry.updatedAt ?? entry.createdAt
    if (!timestamp) {
      continue
    }

    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) {
      continue
    }

    if (!latest || date > latest) {
      latest = date
    }
  }

  return latest?.toISOString() ?? null
}

export function mapGuestForAdmin(entry) {
  const attendance = entry.attendance ?? 'unknown'
  const badge = getAttendanceBadge(attendance)

  return {
    id: entry.id,
    lastName: entry.lastName ?? '',
    firstName: entry.firstName ?? '',
    name: getFullName(entry),
    attendance,
    attendanceLabel: getStatusLabel(attendance),
    statusBadge: badge.label,
    statusTone: badge.tone,
    adults: entry.adults ?? (attendance === 'yes' ? 1 : 0),
    adultsLabel: attendance === 'yes' ? formatAdultsLabel(entry.adults ?? 1) : null,
    children: entry.children ?? 'none',
    childrenLabel: getChildrenLabel(entry.children),
    childrenTag: attendance === 'yes' ? formatChildrenTag(entry.children) : null,
    favoriteSong: entry.favoriteSong?.trim() || '',
    comment: entry.comment?.trim() || '',
    createdAt: entry.createdAt ?? null,
    updatedAt: entry.updatedAt ?? entry.createdAt ?? null,
  }
}

export async function getAdminDashboard() {
  const responses = await readResponses()
  const stats = calculateRsvpStats(responses)
  const guests = responses
    .map(mapGuestForAdmin)
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'))

  return {
    stats,
    guests,
    updatedAt: getLatestUpdatedAt(responses),
  }
}

export async function buildAdminExport() {
  const responses = await readResponses()
  const buffer = await buildRsvpExcelBuffer(responses)
  const filename = `guests-${new Date().toISOString().slice(0, 10)}.xlsx`

  return {
    buffer: Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer),
    filename,
    count: responses.length,
  }
}

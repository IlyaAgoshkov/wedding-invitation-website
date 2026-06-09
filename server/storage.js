import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const DATA_FILE = join(dirname(fileURLToPath(import.meta.url)), '../data/rsvp.json')

let writeLock = Promise.resolve()

function withWriteLock(fn) {
  const run = writeLock.then(fn)
  writeLock = run.catch(() => {})
  return run
}

function normalizeName(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

export function guestKey(entry) {
  if (entry.lastName || entry.firstName) {
    return `${normalizeName(entry.lastName)}|${normalizeName(entry.firstName)}`
  }

  return normalizeName(entry.name ?? '')
}

function matchesGuest(entry, lastName, firstName) {
  return guestKey(entry) === `${normalizeName(lastName)}|${normalizeName(firstName)}`
}

async function ensureDataFile() {
  await mkdir(dirname(DATA_FILE), { recursive: true })

  try {
    await readFile(DATA_FILE, 'utf8')
  } catch {
    await writeFile(DATA_FILE, '[]', 'utf8')
  }
}

function normalizeEntry(entry) {
  return {
    ...entry,
    adults: entry.adults ?? (entry.attendance === 'yes' ? 1 : 0),
    favoriteSong: entry.favoriteSong ?? entry.music ?? entry.favoriteMusic ?? entry.song ?? '',
  }
}

export async function readResponses() {
  await ensureDataFile()

  try {
    const raw = await readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(normalizeEntry) : []
  } catch (error) {
    console.error('[storage] Failed to read rsvp.json:', error)

    try {
      await copyFile(DATA_FILE, `${DATA_FILE}.corrupt-${Date.now()}`)
    } catch {
      // ignore backup errors
    }

    await writeFile(DATA_FILE, '[]', 'utf8')
    return []
  }
}

export async function upsertResponse({
  lastName,
  firstName,
  attendance,
  comment,
  children,
  adults = 1,
  favoriteSong = '',
}) {
  return withWriteLock(async () => {
    const responses = await readResponses()
    const now = new Date().toISOString()
    const payload = {
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      name: `${lastName.trim()} ${firstName.trim()}`.trim(),
      attendance,
      children: children ?? 'none',
      adults,
      favoriteSong: favoriteSong.trim(),
      comment: comment.trim(),
    }

    const existingIndex = responses.findIndex((entry) => matchesGuest(entry, lastName, firstName))

    if (existingIndex >= 0) {
      const existing = responses[existingIndex]
      const entry = {
        ...existing,
        ...payload,
        updatedAt: now,
      }

      responses[existingIndex] = entry
      await writeFile(DATA_FILE, `${JSON.stringify(responses, null, 2)}\n`, 'utf8')
      return { entry, isUpdate: true }
    }

    const entry = {
      id: randomUUID(),
      ...payload,
      createdAt: now,
    }

    responses.push(entry)
    await writeFile(DATA_FILE, `${JSON.stringify(responses, null, 2)}\n`, 'utf8')
    return { entry, isUpdate: false }
  })
}

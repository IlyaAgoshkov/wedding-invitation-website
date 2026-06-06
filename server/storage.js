import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const DATA_FILE = join(dirname(fileURLToPath(import.meta.url)), '../data/rsvp.json')

async function ensureDataFile() {
  await mkdir(dirname(DATA_FILE), { recursive: true })

  try {
    await readFile(DATA_FILE, 'utf8')
  } catch {
    await writeFile(DATA_FILE, '[]', 'utf8')
  }
}

export async function readResponses() {
  await ensureDataFile()
  const raw = await readFile(DATA_FILE, 'utf8')
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed)
    ? parsed.map((entry) => ({
        ...entry,
        adults: entry.adults ?? (entry.attendance === 'yes' ? 1 : 0),
        favoriteSong: entry.favoriteSong ?? entry.music ?? entry.favoriteMusic ?? entry.song ?? '',
      }))
    : []
}

export async function addResponse({
  lastName,
  firstName,
  attendance,
  comment,
  children,
  adults = 1,
  favoriteSong = '',
}) {
  const responses = await readResponses()
  const entry = {
    id: randomUUID(),
    lastName: lastName.trim(),
    firstName: firstName.trim(),
    name: `${lastName.trim()} ${firstName.trim()}`.trim(),
    attendance,
    children: children ?? 'none',
    adults,
    favoriteSong: favoriteSong.trim(),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  }

  responses.push(entry)
  await writeFile(DATA_FILE, `${JSON.stringify(responses, null, 2)}\n`, 'utf8')
  return entry
}

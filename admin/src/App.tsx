import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchDashboard } from './api'
import { FilterTabs } from './components/FilterTabs'
import { GuestCard } from './components/GuestCard'
import { SearchBar } from './components/SearchBar'
import { StatsCards } from './components/StatsCards'
import type { AttendanceFilter, DashboardResponse, Guest } from './types'

function formatUpdatedAt(value: string | null) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const day = parts.find((part) => part.type === 'day')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const hour = parts.find((part) => part.type === 'hour')?.value
  const minute = parts.find((part) => part.type === 'minute')?.value

  if (!day || !month || !hour || !minute) {
    return '—'
  }

  return `${day}.${month}, ${hour}:${minute}`
}

function matchesSearch(guest: Guest, query: string) {
  if (!query) {
    return true
  }

  const haystack = [
    guest.name,
    guest.lastName,
    guest.firstName,
    guest.favoriteSong,
    guest.comment,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

function matchesFilter(guest: Guest, filter: AttendanceFilter) {
  if (filter === 'all') {
    return true
  }

  if (filter === 'unknown') {
    return guest.statusTone === 'unknown'
  }

  return guest.attendance === filter
}

export default function App() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<AttendanceFilter>('all')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchDashboard()
      setDashboard(data)
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : 'Не удалось загрузить данные.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  const filteredGuests = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (dashboard?.guests ?? []).filter(
      (guest) => matchesSearch(guest, query) && matchesFilter(guest, filter),
    )
  }, [dashboard?.guests, filter, search])

  const isTelegram = Boolean(window.Telegram?.WebApp?.initData)

  return (
    <div className="app">
      <header className="header">
        <div className="header__intro">
          <h1 className="header__title">Список гостей</h1>
          <p className="header__updated">
            Обновлено: {formatUpdatedAt(dashboard?.updatedAt ?? null)}
          </p>
        </div>
      </header>

      {!isTelegram && (
        <div className="notice">
          Откройте приложение через кнопку «Список гостей» в Telegram-боте.
        </div>
      )}

      {error && (
        <div className="notice notice--error">
          {error}
          <button type="button" className="notice__retry" onClick={() => void loadDashboard()}>
            Повторить
          </button>
        </div>
      )}

      <StatsCards stats={dashboard?.stats ?? null} loading={loading} />

      <SearchBar value={search} onChange={setSearch} />

      <FilterTabs value={filter} onChange={setFilter} />

      <section className="guest-list">
        {loading && <p className="guest-list__state">Загружаем список...</p>}

        {!loading && filteredGuests.length === 0 && (
          <p className="guest-list__state">
            {dashboard?.guests.length ? 'Ничего не найдено.' : 'Пока нет ни одного ответа RSVP.'}
          </p>
        )}

        {!loading &&
          filteredGuests.map((guest) => <GuestCard key={guest.id} guest={guest} />)}
      </section>
    </div>
  )
}

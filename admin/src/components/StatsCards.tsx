import type { GuestStats } from '../types'

interface StatsCardsProps {
  stats: GuestStats | null
  loading: boolean
}

const cards = [
  {
    key: 'totalGuests',
    label: 'Всего гостей',
    tone: 'neutral',
    icon: 'guests',
  },
  {
    key: 'confirmedCount',
    label: 'Подтверждено',
    tone: 'pink',
    icon: 'confirmed',
  },
  {
    key: 'adults',
    label: 'Взрослых',
    tone: 'blue',
    icon: 'adults',
  },
  {
    key: 'children',
    label: 'Детей',
    tone: 'yellow',
    icon: 'children',
  },
] as const

export function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <section className="stats-grid">
      {cards.map((card) => (
        <article key={card.key} className={`stat-card stat-card--${card.tone}`}>
          <div className="stat-card__icon">
            <StatIcon name={card.icon} />
          </div>
          <div className="stat-card__content">
            <strong className="stat-card__value">
              {loading ? '…' : (stats?.[card.key] ?? 0)}
            </strong>
            <span className="stat-card__label">{card.label}</span>
          </div>
        </article>
      ))}
    </section>
  )
}

function StatIcon({ name }: { name: (typeof cards)[number]['icon'] }) {
  switch (name) {
    case 'guests':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 19a5 5 0 0 1 10 0M11 19a5 5 0 0 1 10 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'confirmed':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="m5 12 5 5 9-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'adults':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'children':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M9 8a3 3 0 1 1 6 0M7 20c0-2.8 2.2-5 5-5s5 2.2 5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      )
  }
}

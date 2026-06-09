import type { AttendanceFilter } from '../types'

interface FilterTabsProps {
  value: AttendanceFilter
  onChange: (value: AttendanceFilter) => void
}

const filters: Array<{ value: AttendanceFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'yes', label: 'Будут' },
  { value: 'no', label: 'Не будут' },
  { value: 'unknown', label: 'Неизвестно' },
]

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <div className="filters">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={`filters__button${value === filter.value ? ' filters__button--active' : ''}`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

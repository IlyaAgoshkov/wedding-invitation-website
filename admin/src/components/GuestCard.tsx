import type { Guest } from '../types'

interface GuestCardProps {
  guest: Guest
}

export function GuestCard({ guest }: GuestCardProps) {
  return (
    <article className="guest-card">
      <div className="guest-card__header">
        <h2 className="guest-card__name">{guest.name}</h2>
        <span className={`guest-card__badge guest-card__badge--${guest.statusTone}`}>
          {guest.statusTone === 'yes' && <CheckIcon />}
          {guest.statusBadge}
        </span>
      </div>

      {guest.attendance === 'yes' && (
        <div className="guest-card__tags">
          {guest.adultsLabel && <span className="guest-card__tag">{guest.adultsLabel}</span>}
          {guest.childrenTag && <span className="guest-card__tag">{guest.childrenTag}</span>}
        </div>
      )}

      {guest.favoriteSong && (
        <p className="guest-card__row">
          <MusicIcon />
          <span>{guest.favoriteSong}</span>
        </p>
      )}

      {guest.comment && (
        <p className="guest-card__row guest-card__row--comment">
          <CommentIcon />
          <span>{guest.comment}</span>
        </p>
      )}
    </article>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m5 12 4 4 10-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 18V6l10-2v12M9 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H9l-4 3v-3H7.5A2.5 2.5 0 0 1 5 13.5v-7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

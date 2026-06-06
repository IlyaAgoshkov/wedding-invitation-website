import { useId } from 'react'

type RibbonBowProps = {
  className?: string
  flip?: boolean
}

export function RibbonBow({ className = '', flip }: RibbonBowProps) {
  const uid = useId().replace(/:/g, '')
  const loopId = `bow-loop-${uid}`
  const tailId = `bow-tail-${uid}`
  const knotId = `bow-knot-${uid}`

  return (
    <svg
      className={`ribbon-bow ${className}`.trim()}
      viewBox="0 0 88 72"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <defs>
        <linearGradient id={loopId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d9e4ec" />
          <stop offset="45%" stopColor="#a3c1da" />
          <stop offset="100%" stopColor="#8eb5d4" />
        </linearGradient>
        <linearGradient id={tailId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8d4e8" />
          <stop offset="100%" stopColor="#7a9bb5" />
        </linearGradient>
        <linearGradient id={knotId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2e8d5" />
          <stop offset="100%" stopColor="#c9dce8" />
        </linearGradient>
      </defs>

      <path
        d="M44 24 C28 6 8 14 10 30 C12 42 28 36 44 28 Z"
        fill={`url(#${loopId})`}
        stroke="rgba(122, 155, 181, 0.35)"
        strokeWidth="0.8"
      />
      <path
        d="M44 24 C60 6 80 14 78 30 C76 42 60 36 44 28 Z"
        fill={`url(#${loopId})`}
        stroke="rgba(122, 155, 181, 0.35)"
        strokeWidth="0.8"
      />
      <path
        d="M44 28 C36 34 30 48 24 68 L34 58 L44 66 L54 58 L64 68 C58 48 52 34 44 28 Z"
        fill={`url(#${tailId})`}
        stroke="rgba(122, 155, 181, 0.28)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <ellipse
        cx="44"
        cy="26"
        rx="8"
        ry="7"
        fill={`url(#${knotId})`}
        stroke="rgba(122, 155, 181, 0.4)"
        strokeWidth="0.8"
      />
      <path
        d="M38 24 C40 20 44 19 48 22"
        fill="none"
        stroke="rgba(255, 255, 255, 0.65)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

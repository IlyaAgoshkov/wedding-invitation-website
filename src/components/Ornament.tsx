type OrnamentProps = {
  className?: string
  flip?: boolean
}

export function Ornament({ className = '', flip }: OrnamentProps) {
  return (
    <svg
      className={`ornament-svg ${className}`.trim()}
      viewBox="0 0 80 16"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M0 8 Q20 2 40 8 T80 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <path
        d="M32 8 Q36 4 40 8 Q44 12 48 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.5"
      />
      <circle cx="40" cy="8" r="1.5" fill="currentColor" opacity="0.45" />
    </svg>
  )
}

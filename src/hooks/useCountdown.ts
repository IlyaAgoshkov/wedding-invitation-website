import { useEffect, useState } from 'react'

const WEDDING_DATE = new Date('2026-08-29T12:00:00+03:00')

export interface CountdownValues {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getCountdown(): CountdownValues {
  const now = Date.now()
  const diff = Math.max(0, WEDDING_DATE.getTime() - now)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds }
}

export function useCountdown(): CountdownValues {
  const [values, setValues] = useState(getCountdown)

  useEffect(() => {
    const id = window.setInterval(() => setValues(getCountdown()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return values
}

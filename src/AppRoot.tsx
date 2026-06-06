import { StrictMode, useEffect } from 'react'
import App from './App'

export function AppRoot() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}

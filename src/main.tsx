import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

function Root() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)

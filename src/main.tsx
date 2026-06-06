import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRoot } from './AppRoot'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')!).render(<AppRoot />)

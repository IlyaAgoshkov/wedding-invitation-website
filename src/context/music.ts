import { createContext, useContext } from 'react'

export type MusicContextValue = {
  isPlaying: boolean
  invitationOpened: boolean
  toggleMusic: () => void
}

export const MusicContext = createContext<MusicContextValue | null>(null)

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider')
  }
  return context
}

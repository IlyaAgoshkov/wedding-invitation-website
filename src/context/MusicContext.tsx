import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type MusicContextValue = {
  isPlaying: boolean
  toggleMusic: () => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const userPausedRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [needsUnlock, setNeedsUnlock] = useState(false)

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || userPausedRef.current) return false

    try {
      if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        audio.load()
      }
      await audio.play()
      setIsPlaying(true)
      setNeedsUnlock(false)
      return true
    } catch {
      setIsPlaying(false)
      setNeedsUnlock(true)
      return false
    }
  }, [])

  const toggleMusic = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    if (!audio.paused) {
      audio.pause()
      userPausedRef.current = true
      return
    }

    userPausedRef.current = false
    await play()
  }, [play])

  const unlockMusic = useCallback(async () => {
    userPausedRef.current = false
    await play()
  }, [play])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.65

    const syncPlayingState = () => setIsPlaying(!audio.paused)
    audio.addEventListener('play', syncPlayingState)
    audio.addEventListener('pause', syncPlayingState)

    const tryAutoplay = () => {
      if (userPausedRef.current) return
      void play()
    }

    audio.addEventListener('canplay', tryAutoplay)

    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      tryAutoplay()
    }

    const resumeOnInteraction = () => {
      if (userPausedRef.current || !audio.paused) return
      void play()
    }

    const interactionEvents = ['pointerdown', 'touchstart', 'keydown'] as const
    interactionEvents.forEach((event) => {
      document.addEventListener(event, resumeOnInteraction, { capture: true })
    })

    return () => {
      audio.removeEventListener('play', syncPlayingState)
      audio.removeEventListener('pause', syncPlayingState)
      audio.removeEventListener('canplay', tryAutoplay)
      interactionEvents.forEach((event) => {
        document.removeEventListener(event, resumeOnInteraction, { capture: true })
      })
    }
  }, [play])

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" playsInline />
      {needsUnlock && (
        <button
          type="button"
          className="music-welcome"
          aria-label="Открыть приглашение и включить музыку"
          onClick={() => void unlockMusic()}
        >
          <span className="music-welcome__label">WEDDING DAY</span>
          <span className="music-welcome__title">Открыть приглашение</span>
          <span className="music-welcome__hint">Нажмите, чтобы войти</span>
        </button>
      )}
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider')
  }
  return context
}

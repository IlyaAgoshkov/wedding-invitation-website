import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { MusicContext } from './music'

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const reducedMotion = useReducedMotion()
  const userPausedRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [invitationOpened, setInvitationOpened] = useState(false)

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || userPausedRef.current) return false

    try {
      if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        audio.load()
      }
      await audio.play()
      setIsPlaying(true)
      setInvitationOpened(true)
      return true
    } catch {
      setIsPlaying(false)
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
    setInvitationOpened(true)
    await play()
  }, [play])

  const [isOpening, setIsOpening] = useState(false)

  const handleEnvelopeOpen = useCallback(() => {
    if (isOpening) return
    setIsOpening(true)
    const delay = reducedMotion ? 0 : 2600
    window.setTimeout(() => {
      void unlockMusic()
    }, delay)
  }, [isOpening, reducedMotion, unlockMusic])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.65

    const syncPlayingState = () => setIsPlaying(!audio.paused)
    audio.addEventListener('play', syncPlayingState)
    audio.addEventListener('pause', syncPlayingState)

    return () => {
      audio.removeEventListener('play', syncPlayingState)
      audio.removeEventListener('pause', syncPlayingState)
    }
  }, [])

  return (
    <MusicContext.Provider value={{ isPlaying, invitationOpened, toggleMusic }}>
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" playsInline />
      <AnimatePresence>
        {!invitationOpened ? (
          <motion.div
            className="music-welcome"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="music-welcome__glow" aria-hidden="true" />

            <div className="music-welcome__stage">
              <motion.p
                className="music-welcome__heading"
                initial={false}
                animate={
                  isOpening
                    ? { y: reducedMotion ? 0 : -120, scale: 0.78, opacity: 0.95 }
                    : { y: 0, scale: 1, opacity: 1 }
                }
                transition={{ duration: reducedMotion ? 0.01 : 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                Вам пришло приглашение
              </motion.p>

              <motion.button
                type="button"
                className={`welcome-envelope${isOpening ? ' welcome-envelope--open' : ''}`}
                aria-label="Открыть приглашение и включить музыку"
                onClick={handleEnvelopeOpen}
                disabled={isOpening}
                initial={false}
                animate={isOpening ? { y: reducedMotion ? 0 : 20 } : { y: 0 }}
                transition={{ duration: reducedMotion ? 0.01 : 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.svg
                  className="welcome-envelope__svg"
                  viewBox="0 28 400 238"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                <defs>
                  <linearGradient id="env-body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f7eed8" />
                    <stop offset="100%" stopColor="#ead9b5" />
                  </linearGradient>
                  <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbf3df" />
                    <stop offset="100%" stopColor="#e6d3aa" />
                  </linearGradient>
                  <linearGradient id="env-side" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#e6d3aa" />
                    <stop offset="100%" stopColor="#d6bf8a" />
                  </linearGradient>
                  <linearGradient id="env-paper" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f5f1e6" />
                  </linearGradient>
                  <radialGradient id="env-seal" cx="35%" cy="30%" r="80%">
                    <stop offset="0%" stopColor="#b8d4e8" />
                    <stop offset="55%" stopColor="#7aa3c2" />
                    <stop offset="100%" stopColor="#4f7a99" />
                  </radialGradient>
                  <filter id="env-shadow" x="-20%" y="-20%" width="140%" height="160%">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>

                <ellipse
                  className="welcome-envelope__ground"
                  cx="200"
                  cy="262"
                  rx="170"
                  ry="14"
                  fill="rgba(25, 52, 74, 0.22)"
                  filter="url(#env-shadow)"
                />

                <motion.g
                  className="welcome-envelope__letter"
                  initial={false}
                  animate={isOpening ? { y: -260 } : { y: 0 }}
                  transition={{
                    duration: reducedMotion ? 0.01 : 1.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: reducedMotion ? 0 : 1.05,
                  }}
                >
                  <rect
                    x="44"
                    y="60"
                    width="312"
                    height="170"
                    rx="8"
                    fill="url(#env-paper)"
                    stroke="rgba(163, 193, 218, 0.45)"
                    strokeWidth="1"
                  />
                  <rect
                    x="54"
                    y="70"
                    width="292"
                    height="150"
                    rx="4"
                    fill="none"
                    stroke="rgba(163, 193, 218, 0.28)"
                    strokeWidth="1"
                  />
                  <text
                    x="200"
                    y="92"
                    textAnchor="middle"
                    fontFamily="'Montserrat', sans-serif"
                    fontSize="11"
                    letterSpacing="4"
                    fill="rgba(74, 98, 117, 0.75)"
                  >
                    WEDDING INVITATION
                  </text>
                  <text
                    x="200"
                    y="132"
                    textAnchor="middle"
                    fontFamily="'Marck Script', 'Parisienne', cursive"
                    fontSize="36"
                    fill="#2a3d4d"
                  >
                    Дмитрий
                  </text>
                  <text
                    x="200"
                    y="160"
                    textAnchor="middle"
                    fontFamily="'Marck Script', 'Parisienne', cursive"
                    fontSize="22"
                    fill="#7aa3c2"
                  >
                    &amp;
                  </text>
                  <text
                    x="200"
                    y="194"
                    textAnchor="middle"
                    fontFamily="'Marck Script', 'Parisienne', cursive"
                    fontSize="36"
                    fill="#2a3d4d"
                  >
                    Алёна
                  </text>
                  <text
                    x="200"
                    y="218"
                    textAnchor="middle"
                    fontFamily="'Montserrat', sans-serif"
                    fontSize="9"
                    letterSpacing="3"
                    fill="rgba(74, 98, 117, 0.6)"
                  >
                    29 · 08 · 2026
                  </text>
                </motion.g>

                <path
                  className="welcome-envelope__body"
                  d="M20 40 L380 40 L380 240 Q380 252 368 252 L32 252 Q20 252 20 240 Z"
                  fill="url(#env-body)"
                  stroke="rgba(160, 132, 78, 0.45)"
                  strokeWidth="1"
                />

                <path
                  className="welcome-envelope__pocket"
                  d="M20 240 L200 150 L380 240 L380 252 Q380 252 368 252 L32 252 Q20 252 20 240 Z"
                  fill="url(#env-side)"
                  opacity="0.85"
                />

                <path
                  className="welcome-envelope__side welcome-envelope__side--left"
                  d="M20 40 L200 150 L20 240 Z"
                  fill="url(#env-side)"
                  opacity="0.55"
                />
                <path
                  className="welcome-envelope__side welcome-envelope__side--right"
                  d="M380 40 L200 150 L380 240 Z"
                  fill="url(#env-side)"
                  opacity="0.55"
                />

                <motion.g
                  className="welcome-envelope__flap-group"
                  style={{ originX: '200px', originY: '40px' }}
                  initial={false}
                  animate={
                    isOpening
                      ? { scaleY: -1, y: -4 }
                      : { scaleY: 1, y: 0 }
                  }
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.95,
                    ease: [0.65, 0, 0.35, 1],
                    delay: reducedMotion ? 0 : 0.25,
                  }}
                >
                  <path
                    className="welcome-envelope__flap"
                    d="M20 40 L380 40 L200 178 Z"
                    fill="url(#env-flap)"
                    stroke="rgba(160, 132, 78, 0.5)"
                    strokeWidth="1"
                  />
                  <path
                    className="welcome-envelope__flap-shine"
                    d="M40 48 L360 48 L200 168 Z"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.55)"
                    strokeWidth="1"
                  />
                </motion.g>

                <motion.g
                  className="welcome-envelope__seal-group"
                  style={{ originX: '200px', originY: '178px' }}
                  initial={false}
                  animate={
                    isOpening
                      ? { scale: 0, opacity: 0, rotate: -28, y: 24 }
                      : { scale: 1, opacity: 1, rotate: 0, y: 0 }
                  }
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <circle cx="200" cy="178" r="26" fill="url(#env-seal)" />
                  <circle
                    cx="200"
                    cy="178"
                    r="22"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.55)"
                    strokeWidth="1"
                  />
                  <text
                    x="200"
                    y="184"
                    textAnchor="middle"
                    fontFamily="'Cormorant Garamond', serif"
                    fontSize="18"
                    fontWeight="600"
                    fill="#fff"
                  >
                    Д&amp;А
                  </text>
                </motion.g>
              </motion.svg>
            </motion.button>

            <motion.p
              className="music-welcome__hint"
              initial={false}
              animate={isOpening ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: 'easeOut' }}
            >
              Нажмите на конверт, чтобы открыть
            </motion.p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {children}
    </MusicContext.Provider>
  )
}


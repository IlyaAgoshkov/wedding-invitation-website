import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMusic } from '../context/music'

const links = [
  { href: '#hero', label: 'Главная' },
  { href: '#countdown', label: 'До свадьбы' },
  { href: '#love-story', label: 'Наша история' },
  { href: '#program', label: 'Программа' },
  { href: '#banquet', label: 'Банкет' },
  { href: '#dress-code', label: 'Дресс-код' },
  { href: '#gifts', label: 'Подарки' },
  { href: '#rsvp', label: 'Подтверждение присутствия' },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [activeHref, setActiveHref] = useState('#hero')
  const reducedMotion = useReducedMotion()
  const { isPlaying, toggleMusic } = useMusic()

  const closeMenu = useCallback(() => setOpen(false), [])

  const handleNav = (href: string) => {
    setActiveHref(href)
    closeMenu()
    window.setTimeout(() => {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
    }, reducedMotion ? 0 : 180)
  }

  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter((section): section is Element => section !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) {
          setActiveHref(`#${visible.target.id}`)
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.12, 0.24, 0.36, 0.48],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMenu, open])

  return createPortal(
    <>
      <header className="site-header">
        <motion.button
          type="button"
          className={`menu-btn${open ? ' menu-btn--open' : ''}`}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen((value) => !value)}
          whileHover={reducedMotion ? undefined : { scale: 1.03 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span />
          <span />
          <span />
        </motion.button>

        <motion.button
          type="button"
          className={`music-btn ${isPlaying ? 'music-btn--active' : ''}`}
          aria-label={isPlaying ? 'Выключить музыку' : 'Включить музыку'}
          aria-pressed={isPlaying}
          onClick={() => void toggleMusic()}
          whileHover={reducedMotion ? undefined : { scale: 1.03 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="music-btn__icon" aria-hidden="true">
            ♪
          </span>
          <span className="music-btn__text">
            {isPlaying ? 'Выключить музыку' : 'Включить музыку'}
          </span>
        </motion.button>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              className="site-nav__backdrop"
              aria-label="Закрыть меню"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.35 }}
              onClick={closeMenu}
            />

            <motion.nav
              id="site-navigation"
              className="site-nav"
              aria-label="Навигация по сайту"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.35 }}
            >
              <motion.div
                className="site-nav__panel"
                initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: reducedMotion ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="site-nav__eyebrow">Навигация</p>

                <ul className="site-nav__list">
                  {links.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reducedMotion ? undefined : { opacity: 0, y: 10 }}
                      transition={{
                        duration: reducedMotion ? 0.01 : 0.4,
                        delay: reducedMotion ? 0 : 0.06 + index * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <a
                        href={link.href}
                        className={activeHref === link.href ? 'site-nav__link--active' : undefined}
                        aria-current={activeHref === link.href ? 'page' : undefined}
                        onClick={(event) => {
                          event.preventDefault()
                          handleNav(link.href)
                        }}
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>,
    document.body,
  )
}

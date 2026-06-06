import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useMusic } from '../context/music'
import { heroNames, staggerContainer, staggerItemFade, instant } from '../motion/variants'
import { HeroScene } from './HeroScene'

const zagsMapsUrl =
  'https://yandex.ru/maps/?text=%D0%9E%D1%84%D0%B8%D1%86%D0%B5%D1%80%D1%81%D0%BA%D0%B0%D1%8F+%D1%83%D0%BB.%2C+47%2C+%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D0%B4%D0%B0%D1%80'

type WordRevealTextProps = {
  text: string
  active: boolean
  delay?: number
}

function WordRevealText({ text, active, delay = 0 }: WordRevealTextProps) {
  const reducedMotion = useReducedMotion()
  const words = text.split(' ')

  return (
    <motion.span
      className="hero-section__word-reveal"
      aria-label={text}
      initial="hidden"
      animate={active ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: reducedMotion ? 0 : delay / 1000,
            staggerChildren: reducedMotion ? 0 : 0.075,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: reducedMotion ? 0 : 18, filter: 'blur(6px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: reducedMotion ? 0.01 : 0.72, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { invitationOpened } = useMusic()
  const itemVariants = reducedMotion ? instant : staggerItemFade
  const contentVariants = reducedMotion ? instant : staggerContainer(0.22, 0.15)
  const infoPanelVariants = reducedMotion ? instant : staggerContainer(0.16, 0.05)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', reducedMotion ? '0%' : '4%'])

  return (
    <section id="hero" className="hero-section" ref={sectionRef}>
      <motion.div
        className="hero-section__scene"
        style={reducedMotion ? undefined : { y: sceneY }}
      >
        <HeroScene />
      </motion.div>

      <motion.div
        className="hero-section__content"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        <motion.p className="hero-section__eyebrow" variants={itemVariants}>
          WEDDING DAY
        </motion.p>

        <motion.h1 className="hero-section__title" variants={reducedMotion ? instant : heroNames}>
          <motion.span
            className="hero-section__title-line"
            animate={
              reducedMotion
                ? undefined
                : { textShadow: ['0 0 18px rgba(255,255,255,0.38)', '0 0 34px rgba(255,255,255,0.72)', '0 0 18px rgba(255,255,255,0.38)'] }
            }
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            Дмитрий
          </motion.span>
          <motion.span
            className="hero-section__title-amp"
            animate={reducedMotion ? undefined : { rotate: [-4, 4, -4], scale: [1, 1.08, 1] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          >
            &
          </motion.span>
          <motion.span
            className="hero-section__title-line"
            animate={
              reducedMotion
                ? undefined
                : { textShadow: ['0 0 18px rgba(255,255,255,0.38)', '0 0 34px rgba(255,255,255,0.72)', '0 0 18px rgba(255,255,255,0.38)'] }
            }
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          >
            Алёна
          </motion.span>
        </motion.h1>

        <motion.div
          className={`hero-section__info-panel${invitationOpened ? ' hero-section__info-panel--alive' : ''}`}
          variants={infoPanelVariants}
        >
          <motion.p className="hero-section__subtitle" variants={itemVariants}>
            <WordRevealText
              text="С любовью приглашаем вас разделить самый важный день нашей жизни"
              active={invitationOpened}
              delay={1000}
            />
          </motion.p>
          <motion.p
            className="hero-section__date"
            variants={itemVariants}
            animate={reducedMotion ? undefined : { opacity: [0.92, 1, 0.92] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
          >
            29 · 08 · 2026
          </motion.p>
          <motion.p className="hero-section__time" variants={itemVariants}>
            12:00
          </motion.p>
          <motion.p className="hero-section__ceremony" variants={itemVariants}>
            <WordRevealText
              text="Церемония будет проходить в Екатерининском ЗАГСе"
              active={invitationOpened}
              delay={2600}
            />
          </motion.p>
          <motion.p className="hero-section__address" variants={itemVariants}>
            <WordRevealText
              text="Город Краснодар, Офицерская ул., 47"
              active={invitationOpened}
              delay={3400}
            />
          </motion.p>
          {invitationOpened && (
            <motion.a
              className="hero-section__qr-link"
              href={zagsMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Открыть маршрут до ЗАГСа"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              transition={{ delay: 4.2 }}
            >
              <img
                className="hero-section__qr"
                src="/zags-qr-code.png"
                alt="QR-код маршрута до ЗАГСа"
              />
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

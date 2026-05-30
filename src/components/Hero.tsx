import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { heroNames, heroTitle } from '../motion/variants'
import { HeroScene } from './HeroScene'

const zagsMapsUrl =
  'https://yandex.ru/maps/?text=%D0%9E%D1%84%D0%B8%D1%86%D0%B5%D1%80%D1%81%D0%BA%D0%B0%D1%8F+%D1%83%D0%BB.%2C+47%2C+%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D0%B4%D0%B0%D1%80'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

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

      <div className="hero-section__content">
        <motion.p
          className="hero-section__eyebrow"
          initial="hidden"
          animate="visible"
          variants={heroTitle}
        >
          WEDDING DAY
        </motion.p>

        <motion.h1
          className="hero-section__title"
          initial="hidden"
          animate="visible"
          variants={heroNames}
        >
          <span className="hero-section__title-line">Дмитрий</span>
          <span className="hero-section__title-amp">&</span>
          <span className="hero-section__title-line">Алёна</span>
        </motion.h1>

        <motion.p
          className="hero-section__subtitle"
          initial="hidden"
          animate="visible"
          variants={heroTitle}
          transition={{ delay: 0.45 }}
        >
          С любовью приглашаем вас разделить самый важный день нашей жизни
        </motion.p>

        <motion.div
          className="hero-section__details"
          initial="hidden"
          animate="visible"
          variants={heroTitle}
          transition={{ delay: 0.65 }}
        >
          <p className="hero-section__date">29 · 08 · 2026</p>
          <p className="hero-section__time">12:00</p>
          <p className="hero-section__ceremony">
            Церемония будет проходить в Екатерининском ЗАГСе
          </p>
          <p className="hero-section__address">Город Краснодар, Офицерская ул., 47</p>
          <a
            className="hero-section__qr-link"
            href={zagsMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Открыть маршрут до ЗАГСа"
          >
            <img
              className="hero-section__qr"
              src="/zags-qr-code.png"
              alt="QR-код маршрута до ЗАГСа"
            />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

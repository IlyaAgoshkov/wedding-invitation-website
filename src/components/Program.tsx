import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, staggerItemSlide, instant } from '../motion/variants'
import { ScrollReveal } from './ScrollReveal'

const items = [
  {
    id: 'ceremony',
    icon: 'ring',
    time: '12:00',
    title: 'Церемония',
    description: 'Момент, когда мы скажем друг другу самые важные слова.',
  },
  {
    id: 'buffet',
    icon: 'buffet',
    time: '12:40',
    title: 'Фуршет',
    description: 'Небольшой фуршет, поздравления и первые счастливые эмоции этого дня.',
  },
  {
    id: 'photoshoot',
    icon: 'camera',
    time: '13:00',
    title: 'Фотосессия',
    description: 'Время для памятных фотографий молодожёнов и близких родственников.',
  },
  {
    id: 'welcome',
    icon: 'welcome',
    time: '14:00',
    title: 'Welcome-зона',
    description:
      'Ждём вас в ресторане. Лёгкие закуски, напитки и приятное общение перед началом торжества.',
  },
  {
    id: 'guest-photos',
    icon: 'group',
    time: '14:00–16:00',
    title: 'Фото с гостями',
    description:
      'С удовольствием сделаем общие фотографии и сохраним самые тёплые моменты этого дня.',
  },
  {
    id: 'banquet',
    icon: 'glasses',
    time: '16:00',
    title: 'Банкет',
    description:
      'Праздничный вечер в кругу родных и друзей: ужин, развлечения, танцы и незабываемые впечатления.',
  },
]

function ProgramIcon({ type }: { type: string }) {
  if (type === 'ring') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="28" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M16 20c0-6 3.5-10 8-10s8 4 8 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="24" cy="14" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    )
  }

  if (type === 'buffet') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <ellipse cx="24" cy="30" rx="16" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 30v-4c0-4 5-8 12-8s12 4 12 8v4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 18v-4M24 16v-6M30 18v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'camera') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="8" y="16" width="32" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="27" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 16l3-5h6l3 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }

  if (type === 'welcome') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M10 38V18l14-8 14 8v20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M20 38V26h8v12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="22" r="2" fill="currentColor" opacity="0.5" />
      </svg>
    )
  }

  if (type === 'group') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="16" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 34c0-5 3.5-8 8-8s8 3 8 8M24 34c0-5 3.5-8 8-8s8 3 8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect x="21" y="8" width="6" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M12 30c0-8 6-14 12-14s12 6 12 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14 28h8M26 28h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="18" cy="30" rx="5" ry="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="30" cy="30" rx="5" ry="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function Program() {
  const reducedMotion = useReducedMotion()

  return (
    <section id="program" className="section program-section">
      <ScrollReveal>
        <h2 className="section-title section-title--simple">ПРОГРАММА ДНЯ</h2>
        <div className="section-divider" aria-hidden="true" />
      </ScrollReveal>

      <motion.div
        className="program-timeline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reducedMotion ? instant : staggerContainer(0.13, 0.1)}
      >
        {items.map((item, index) => (
          <motion.article
            key={item.id}
            className={`program-timeline__item program-timeline__item--${index % 2 === 0 ? 'left' : 'right'}`}
            variants={reducedMotion ? instant : staggerItemSlide}
          >
            <div className="program-timeline__marker" aria-hidden="true">
              <span />
            </div>
            <div className="glass-card program-card">
              <div className="program-card__icon">
                <ProgramIcon type={item.icon} />
              </div>
              <div className="program-card__content">
                <p className="program-card__time">{item.time}</p>
                <h3 className="program-card__title">{item.title}</h3>
                <p className="program-card__description">{item.description}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}

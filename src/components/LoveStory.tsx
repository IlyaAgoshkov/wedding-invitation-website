import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { staggerContainer, staggerItemFade, instant } from '../motion/variants'
import {
  GalleryCarousel,
  GalleryCarouselLightbox,
  type GalleryImage,
} from './GalleryCarousel'
import { InvitationCard } from './InvitationCard'
import { ScrollReveal } from './ScrollReveal'

const storyChapters = [
  {
    year: '2022',
    title: 'Наша история',
    text: 'Каждый общий день стал маленькой главой большой и очень тёплой истории.',
  },
  {
    year: '2025',
    title: 'Предложение',
    text: 'Момент, после которого мечта о семье стала нашим самым красивым планом.',
  },
  {
    year: '2026',
    title: 'Свадебный день',
    text: 'Мы хотим разделить эту радость с людьми, которые особенно дороги нам.',
  },
]

const galleryMoments = [
  {
    title: 'Вместе',
    subtitle: 'Тёплые вечера и долгие разговоры',
    from: '#b8d4e8',
    to: '#f2e8d5',
  },
  {
    title: 'Мечты',
    subtitle: 'Планы, которые хочется строить вдвоём',
    from: '#d9e4ec',
    to: '#ffffff',
  },
  {
    title: '29.08.2026',
    subtitle: 'День, в котором начнётся новая глава',
    from: '#a3c1da',
    to: '#f7efe1',
  },
]

function createMomentImage({ title, subtitle, from, to }: (typeof galleryMoments)[number]) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="42%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.74" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="760" fill="url(#bg)" />
      <circle cx="600" cy="320" r="310" fill="url(#glow)" />
      <path d="M260 520 C380 420 455 420 600 535 C745 420 820 420 940 520" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.64" />
      <text x="600" y="350" text-anchor="middle" fill="#2a3d4d" font-family="Georgia, serif" font-size="92" font-weight="400">${title}</text>
      <text x="600" y="430" text-anchor="middle" fill="#4a6275" font-family="Georgia, serif" font-size="32" font-style="italic">${subtitle}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export function LoveStory() {
  const reducedMotion = useReducedMotion()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const images = useMemo<GalleryImage[]>(
    () =>
      galleryMoments.map((moment) => ({
        src: createMomentImage(moment),
        alt: `${moment.title}: ${moment.subtitle}`,
      })),
    [],
  )

  return (
    <section id="love-story" className="section love-story-section">
      <AnimatePresence>
        {lightboxIndex !== null ? (
          <GalleryCarouselLightbox
            images={images}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        ) : null}
      </AnimatePresence>

      <ScrollReveal>
        <p className="section-kicker">Наша история</p>
        <h2 className="section-title section-title--simple">МАЛЕНЬКИЕ ГЛАВЫ БОЛЬШОЙ ЛЮБВИ</h2>
        <div className="section-divider" aria-hidden="true" />
      </ScrollReveal>

      <InvitationCard className="love-story-card">
        <div className="love-story-layout">
          <motion.div
            className="love-story-chapters"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reducedMotion ? instant : staggerContainer(0.12, 0.1)}
          >
            {storyChapters.map((chapter) => (
              <motion.article
                className="love-story-chapter"
                key={chapter.title}
                variants={reducedMotion ? instant : staggerItemFade}
              >
                <p className="love-story-chapter__year">{chapter.year}</p>
                <h3>{chapter.title}</h3>
                <p>{chapter.text}</p>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            className="love-story-gallery"
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <GalleryCarousel
              images={images}
              onSlideClick={setLightboxIndex}
              ariaLabel="Галерея истории пары"
            />
          </motion.div>
        </div>
      </InvitationCard>
    </section>
  )
}

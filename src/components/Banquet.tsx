import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { staggerContainer, staggerItemFade, instant } from '../motion/variants'
import { AnimatedGalleryImage } from './AnimatedGalleryImage'
import {
  GalleryCarousel,
  GalleryCarouselLightbox,
  type GalleryImage,
} from './GalleryCarousel'
import { InvitationCard } from './InvitationCard'
import { ScrollReveal } from './ScrollReveal'

const venueMapsUrl =
  'https://yandex.ru/maps/?text=%D1%83%D0%BB.%20%D0%9A%D1%83%D0%B1%D0%B0%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%20%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F%2C%205%2C%20%D0%9C%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%20%D0%A6%D0%B5%D0%BD%D1%82%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%2C%20%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D0%B4%D0%B0%D1%80'

const features = [
  'Праздничный ужин',
  'Живая атмосфера',
  'Танцы и музыка',
  'Фотозона',
]

const galleryImages: GalleryImage[] = [
  {
    src: '/banquet/hall.png',
    alt: 'Банкетный зал с сервировкой столов',
  },
  {
    src: '/banquet/piano.png',
    alt: 'Интерьер зала с роялем и цветами',
  },
  {
    src: '/banquet/photo-zone.png',
    alt: 'Фотозона на открытой террасе',
  },
]

export function Banquet() {
  const reducedMotion = useReducedMotion()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <section id="banquet" className="section banquet-section">
      <AnimatePresence>
        {lightboxIndex !== null ? (
          <GalleryCarouselLightbox
            images={galleryImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        ) : null}
      </AnimatePresence>

      <InvitationCard className="banquet-card">
        <div className="banquet-grid">
          <div className="banquet-grid__left">
            <ScrollReveal>
              <p className="banquet-eyebrow">Банкет</p>
              <h2 className="banquet-title">
                Праздничный
                <br />
                вечер
              </h2>
              <p className="banquet-text">
                После церемонии мы будем рады продолжить этот особенный день
                вместе с вами в тёплой атмосфере свадебного вечера, музыки, танцев
                и красивых воспоминаний.
              </p>
            </ScrollReveal>

            <motion.ul
              className="banquet-features"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={reducedMotion ? instant : staggerContainer(0.1, 0.12)}
            >
              {features.map((feature) => (
                <motion.li
                  key={feature}
                  className="banquet-features__item"
                  variants={reducedMotion ? instant : staggerItemFade}
                >
                  {feature}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={reducedMotion ? instant : staggerItemFade}
            >
              <GalleryCarousel
                className="banquet-gallery-carousel"
                images={galleryImages}
                onSlideClick={setLightboxIndex}
                ariaLabel="Фотографии банкетного зала"
              />
            </motion.div>
          </div>

          <div className="banquet-grid__right">
            <ScrollReveal delay={0.08} className="banquet-venue">
              <p className="banquet-venue__label">Место проведения банкета</p>
              <h3 className="banquet-venue__name">Екатериненский банкетный зал</h3>
              <p className="banquet-venue__desc">
                Просторный панорамный банкетный зал с атмосферой классической
                свадьбы в самом центре Краснодара.
              </p>
              <a
                className="banquet-venue__address"
                href={venueMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span>
                  ул. Кубанская Набережная, 5
                  <br />
                  микрорайон Центральный, Краснодар
                </span>
              </a>

              <div className="banquet-venue__qr-wrap">
                <a
                  className="banquet-venue__qr-link"
                  href={venueMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AnimatedGalleryImage
                    className="banquet-venue__qr"
                    src="/banquet/qr-code.png"
                    alt="QR-код маршрута до банкетного зала"
                  />
                </a>
                <p className="banquet-venue__qr-caption">
                  Отсканируйте QR-код, чтобы открыть маршрут до банкетного зала
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </InvitationCard>
    </section>
  )
}

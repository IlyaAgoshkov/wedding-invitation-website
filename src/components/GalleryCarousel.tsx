import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState, type TouchEvent } from 'react'

export type GalleryImage = {
  src: string
  alt: string
}

type GalleryCarouselProps = {
  images: GalleryImage[]
  initialIndex?: number
  onSlideClick?: (index: number) => void
  className?: string
  ariaLabel?: string
}

function CarouselNavButton({
  direction,
  onClick,
  label,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      className={`gallery-carousel__nav gallery-carousel__nav--${direction}`}
      onClick={onClick}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d={direction === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export function GalleryCarousel({
  images,
  initialIndex = 0,
  onSlideClick,
  className = '',
  ariaLabel = 'Галерея фотографий',
}: GalleryCarouselProps) {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(initialIndex)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  useEffect(() => {
    setIndex(initialIndex)
  }, [initialIndex])

  const goPrev = useCallback(() => {
    setIndex((current) => (current - 1 + images.length) % images.length)
  }, [images.length])

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % images.length)
  }, [images.length])

  const handleTouchStart = (event: TouchEvent) => {
    setTouchStartX(event.touches[0]?.clientX ?? null)
  }

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStartX === null) return

    const delta = event.changedTouches[0]?.clientX - touchStartX
    if (delta !== undefined && Math.abs(delta) > 48) {
      if (delta > 0) goPrev()
      else goNext()
    }

    setTouchStartX(null)
  }

  if (images.length === 0) return null

  return (
    <div className={`gallery-carousel ${className}`.trim()} aria-label={ariaLabel}>
      <div
        className="gallery-carousel__viewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="gallery-carousel__track"
          animate={{ x: `-${index * 100}%` }}
          transition={
            reducedMotion
              ? { duration: 0.01 }
              : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {images.map((image, slideIndex) => (
            <div key={image.src} className="gallery-carousel__slide">
              {onSlideClick ? (
                <button
                  type="button"
                  className="gallery-carousel__slide-button"
                  onClick={() => onSlideClick(slideIndex)}
                  aria-label={`Открыть фото: ${image.alt}`}
                >
                  <img
                    className="gallery-carousel__image"
                    src={image.src}
                    alt={image.alt}
                    loading={slideIndex === 0 ? 'eager' : 'lazy'}
                  />
                </button>
              ) : (
                <img
                  className="gallery-carousel__image"
                  src={image.src}
                  alt={image.alt}
                  loading={slideIndex === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          ))}
        </motion.div>

        {images.length > 1 ? (
          <>
            <CarouselNavButton direction="prev" onClick={goPrev} label="Предыдущее фото" />
            <CarouselNavButton direction="next" onClick={goNext} label="Следующее фото" />
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="gallery-carousel__footer">
          <div className="gallery-carousel__dots" role="tablist" aria-label="Выбор фото">
            {images.map((image, dotIndex) => (
              <button
                key={image.src}
                type="button"
                role="tab"
                className={`gallery-carousel__dot${dotIndex === index ? ' gallery-carousel__dot--active' : ''}`}
                aria-label={`Фото ${dotIndex + 1}`}
                aria-selected={dotIndex === index}
                onClick={() => setIndex(dotIndex)}
              />
            ))}
          </div>
          <p className="gallery-carousel__counter">
            {index + 1} / {images.length}
          </p>
        </div>
      ) : null}
    </div>
  )
}

type GalleryCarouselLightboxProps = {
  images: GalleryImage[]
  initialIndex: number
  onClose: () => void
}

export function GalleryCarouselLightbox({
  images,
  initialIndex,
  onClose,
}: GalleryCarouselLightboxProps) {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(initialIndex)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  useEffect(() => {
    setIndex(initialIndex)
  }, [initialIndex])

  const goPrev = useCallback(() => {
    setIndex((current) => (current - 1 + images.length) % images.length)
  }, [images.length])

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [goNext, goPrev, onClose])

  const handleTouchStart = (event: TouchEvent) => {
    setTouchStartX(event.touches[0]?.clientX ?? null)
  }

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStartX === null) return

    const delta = event.changedTouches[0]?.clientX - touchStartX
    if (delta !== undefined && Math.abs(delta) > 48) {
      if (delta > 0) goPrev()
      else goNext()
    }

    setTouchStartX(null)
  }

  const current = images[index]
  if (!current) return null

  return (
    <motion.div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр фотографий"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.35 }}
      onClick={onClose}
    >
      <button
        type="button"
        className="gallery-lightbox__close"
        aria-label="Закрыть"
        onClick={onClose}
      >
        ×
      </button>

      <div
        className="gallery-lightbox__content"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current.src}
            className="gallery-lightbox__image"
            src={current.src}
            alt={current.alt}
            initial={reducedMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        {images.length > 1 ? (
          <>
            <CarouselNavButton direction="prev" onClick={goPrev} label="Предыдущее фото" />
            <CarouselNavButton direction="next" onClick={goNext} label="Следующее фото" />
          </>
        ) : null}

        <p className="gallery-lightbox__caption">
          {current.alt}
          {images.length > 1 ? ` · ${index + 1} / ${images.length}` : ''}
        </p>
      </div>
    </motion.div>
  )
}

import { motion, useReducedMotion } from 'framer-motion'
import type { ImgHTMLAttributes } from 'react'

type AnimatedGalleryImageProps = ImgHTMLAttributes<HTMLImageElement>

export function AnimatedGalleryImage({
  className = '',
  alt = '',
  ...props
}: AnimatedGalleryImageProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className={`gallery-image-wrap ${className}`.trim()}
      whileHover={reducedMotion ? undefined : { scale: 1.05 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <img className="gallery-image" alt={alt} {...props} />
    </motion.div>
  )
}

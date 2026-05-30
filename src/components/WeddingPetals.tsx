import { motion, useReducedMotion } from 'framer-motion'

const PETALS = [
  { left: '6%', delay: 0, duration: 14, size: 10, rotate: 15 },
  { left: '18%', delay: 2, duration: 16, size: 8, rotate: -20 },
  { left: '32%', delay: 4, duration: 13, size: 12, rotate: 30 },
  { left: '48%', delay: 1, duration: 15, size: 9, rotate: -10 },
  { left: '62%', delay: 3, duration: 17, size: 11, rotate: 25 },
  { left: '78%', delay: 5, duration: 14, size: 8, rotate: -25 },
  { left: '90%', delay: 2.5, duration: 16, size: 10, rotate: 12 },
  { left: '42%', delay: 6, duration: 18, size: 7, rotate: -15 },
]

export function WeddingPetals() {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return null

  return (
    <div className="wedding-petals" aria-hidden="true">
      {PETALS.map((p, i) => (
        <motion.span
          key={i}
          className="wedding-petals__petal"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.3,
            rotate: p.rotate,
          }}
          initial={{ y: '-10vh', opacity: 0 }}
          animate={{
            y: ['-10vh', '110vh'],
            opacity: [0, 0.7, 0.5, 0],
            x: [0, 20, -10, 15, 0],
            rotate: [p.rotate, p.rotate + 45, p.rotate + 90],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

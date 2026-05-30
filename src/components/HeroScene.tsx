import { motion, useReducedMotion } from 'framer-motion'

export function HeroScene() {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className="hero-scene"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero-scene__sparkles">
        {(reducedMotion ? HERO_SPARKLES.slice(0, 4) : HERO_SPARKLES).map((s, i) => (
          <motion.span
            key={i}
            className={`hero-scene__sparkle ${s.gold ? 'hero-scene__sparkle--gold' : ''}`}
            style={{ left: s.x, top: s.y, width: s.s, height: s.s }}
            animate={
              reducedMotion
                ? undefined
                : { opacity: [0.25, 0.9, 0.25], y: [0, -8, 0], scale: [1, 1.2, 1] }
            }
            transition={{
              duration: 4 + i * 0.35,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: s.d,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

const HERO_SPARKLES = [
  { x: '28%', y: '18%', s: 6, d: 0, gold: false },
  { x: '58%', y: '14%', s: 8, d: 0.6, gold: true },
  { x: '44%', y: '28%', s: 5, d: 1.2, gold: false },
  { x: '72%', y: '22%', s: 6, d: 0.3, gold: true },
  { x: '18%', y: '32%', s: 4, d: 1.8, gold: false },
  { x: '82%', y: '30%', s: 5, d: 0.9, gold: false },
  { x: '35%', y: '12%', s: 4, d: 2.1, gold: true },
  { x: '65%', y: '38%', s: 5, d: 1.5, gold: false },
]

import { motion, useReducedMotion } from 'framer-motion'
import { WeddingPetals } from './WeddingPetals'

const BOKEH = [
  { x: '8%', y: '12%', s: 6, o: 0.45, d: 0 },
  { x: '22%', y: '28%', s: 4, o: 0.35, d: 1.2 },
  { x: '38%', y: '8%', s: 8, o: 0.5, d: 0.5 },
  { x: '55%', y: '22%', s: 5, o: 0.4, d: 2 },
  { x: '72%', y: '15%', s: 7, o: 0.48, d: 0.8 },
  { x: '88%', y: '32%', s: 4, o: 0.32, d: 1.6 },
  { x: '15%', y: '55%', s: 5, o: 0.38, d: 2.4 },
  { x: '45%', y: '48%', s: 6, o: 0.42, d: 0.3 },
  { x: '68%', y: '62%', s: 4, o: 0.36, d: 1.8 },
  { x: '82%', y: '78%', s: 7, o: 0.44, d: 1 },
  { x: '28%', y: '82%', s: 5, o: 0.4, d: 2.8 },
  { x: '52%', y: '88%', s: 9, o: 0.5, d: 0.6 },
  { x: '92%', y: '52%', s: 3, o: 0.3, d: 2.2 },
  { x: '5%', y: '72%', s: 6, o: 0.38, d: 1.4 },
  { x: '35%', y: '68%', s: 5, o: 0.42, d: 0.9 },
  { x: '75%', y: '42%', s: 8, o: 0.48, d: 1.1 },
]

const GOLD_SPARKS = [
  { x: '25%', y: '20%', s: 4 },
  { x: '70%', y: '35%', s: 3 },
  { x: '50%', y: '60%', s: 5 },
  { x: '85%', y: '70%', s: 3 },
]

export function PageAtmosphere() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="page-atmosphere" aria-hidden="true">
      <div className="page-atmosphere__photo" />
      <div className="page-atmosphere__overlay" />
      <div className="page-atmosphere__warm-glow" />
      <div className="page-atmosphere__lace" />

      <svg className="page-atmosphere__florals" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <radialGradient id="cornerRose" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="0" cy="900" rx="280" ry="200" fill="url(#cornerRose)" />
        <ellipse cx="1440" cy="900" rx="280" ry="200" fill="url(#cornerRose)" />
        <ellipse cx="0" cy="0" rx="200" ry="160" fill="url(#cornerRose)" opacity="0.4" />
        <ellipse cx="1440" cy="0" rx="200" ry="160" fill="url(#cornerRose)" opacity="0.4" />
      </svg>

      <WeddingPetals />

      {BOKEH.map((b, i) => (
        <motion.span
          key={`b-${i}`}
          className="page-atmosphere__bokeh"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            opacity: b.o,
          }}
          animate={
            reducedMotion
              ? undefined
              : { opacity: [b.o, b.o + 0.35, b.o], y: [0, -10, 0], scale: [1, 1.15, 1] }
          }
          transition={{
            duration: 5 + (i % 4),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: b.d,
          }}
        />
      ))}

      {!reducedMotion &&
        GOLD_SPARKS.map((g, i) => (
          <motion.span
            key={`g-${i}`}
            className="page-atmosphere__gold"
            style={{ left: g.x, top: g.y, width: g.s, height: g.s }}
            animate={{ opacity: [0.2, 0.75, 0.2], scale: [1, 1.3, 1] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
          />
        ))}

      <div className="page-atmosphere__vignette" />
    </div>
  )
}

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type CountdownDigitProps = {
  value: number
  label: string
}

export function CountdownDigit({ value, label }: CountdownDigitProps) {
  const reducedMotion = useReducedMotion()
  const display =
    label === 'ДНЕЙ'
      ? String(value)
      : String(value).padStart(2, '0')

  return (
    <div className="countdown-digit">
      <div className="countdown-digit__value-wrap">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={display}
            className="countdown-digit__value"
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 18, rotateX: -82, transformPerspective: 700 }
            }
            animate={
              reducedMotion
                ? { opacity: 1, y: 0, rotateX: 0 }
                : {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transformPerspective: 700,
                    textShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      '0 0 18px rgba(255,255,255,0.75)',
                      '0 0 0px rgba(255,255,255,0)',
                    ],
                  }
            }
            exit={
              reducedMotion
                ? undefined
                : { opacity: 0, y: -18, rotateX: 82, transformPerspective: 700 }
            }
            transition={{
              duration: reducedMotion ? 0.01 : 0.62,
              ease: [0.22, 1, 0.36, 1],
              textShadow: { duration: 0.7, ease: 'easeOut' },
            }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="countdown-digit__label">{label}</span>
    </div>
  )
}

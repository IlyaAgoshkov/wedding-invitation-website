import { motion, useReducedMotion } from 'framer-motion'
import { useCountdown } from '../hooks/useCountdown'
import { fadeUp, instant, staggerContainer } from '../motion/variants'
import { CountdownDigit } from './CountdownDigit'
import { InvitationCard } from './InvitationCard'
import { Ornament } from './Ornament'
import { ScrollReveal } from './ScrollReveal'

export function Countdown() {
  const values = useCountdown()
  const reducedMotion = useReducedMotion()

  return (
    <section id="countdown" className="section countdown-section">
      <ScrollReveal>
        <div className="section-title-wrap">
          <Ornament className="section-title__ornament" />
          <h2 className="section-title">ДО НАШЕЙ СВАДЬБЫ ОСТАЛОСЬ</h2>
          <Ornament className="section-title__ornament" flip />
        </div>
      </ScrollReveal>

      <InvitationCard className="countdown-card glass-card--framed">
        <motion.div
          className="countdown-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={reducedMotion ? instant : staggerContainer(0.1, 0.15)}
        >
          <motion.div variants={reducedMotion ? instant : fadeUp}>
            <CountdownDigit value={values.days} label="ДНЕЙ" />
          </motion.div>
          <motion.div variants={reducedMotion ? instant : fadeUp}>
            <CountdownDigit value={values.hours} label="ЧАСОВ" />
          </motion.div>
          <motion.div variants={reducedMotion ? instant : fadeUp}>
            <CountdownDigit value={values.minutes} label="МИНУТ" />
          </motion.div>
          <motion.div variants={reducedMotion ? instant : fadeUp}>
            <CountdownDigit value={values.seconds} label="СЕКУНД" />
          </motion.div>
        </motion.div>
      </InvitationCard>
    </section>
  )
}

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeUp, instant } from '../motion/variants'

type ScrollRevealProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  ...props
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={reducedMotion ? instant : fadeUp}
      transition={{ delay: reducedMotion ? 0 : delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

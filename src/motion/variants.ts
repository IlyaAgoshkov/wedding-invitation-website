import type { Transition, Variants } from 'framer-motion'

export const luxuryEase = [0.22, 1, 0.36, 1] as const

export const luxuryTransition = (duration = 1): Transition => ({
  duration,
  ease: luxuryEase,
})

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: luxuryTransition(1),
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: luxuryTransition(1.2),
  },
}

export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: luxuryTransition(1),
  },
}

export const heroNames: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...luxuryTransition(1.1), delay: 0.35 },
  },
}

export const invitationCard: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: luxuryTransition(1.1),
  },
}

export const staggerContainer = (stagger = 0.12, delayChildren = 0.1): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
})

export const staggerItemSlide: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: luxuryTransition(0.9),
  },
}

export const staggerItemFade: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: luxuryTransition(0.9),
  },
}

export const instant: Variants = {
  hidden: { opacity: 1, y: 0, x: 0, scale: 1 },
  visible: { opacity: 1, y: 0, x: 0, scale: 1 },
}

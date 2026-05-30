import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { invitationCard, instant } from '../motion/variants'

type InvitationCardProps = {
  children: ReactNode
  className?: string
  as?: 'section' | 'div'
  id?: string
}

export function InvitationCard({
  children,
  className = '',
  as = 'div',
  id,
}: InvitationCardProps) {
  const reducedMotion = useReducedMotion()
  const Component = motion[as]

  return (
    <Component
      id={id}
      className={`glass-card ${className}`.trim()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={reducedMotion ? instant : invitationCard}
    >
      {children}
    </Component>
  )
}

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type AnimatedButtonProps = {
  children: ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
}

export function AnimatedButton({
  children,
  className = '',
  type = 'button',
  disabled,
  onClick,
}: AnimatedButtonProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.button
      type={type}
      className={`btn-primary ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { scale: 1.03 }}
      whileTap={reducedMotion ? undefined : { scale: 1.01 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.button>
  )
}

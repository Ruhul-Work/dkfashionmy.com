import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Magnetic } from './motion-kit'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-300'

const variants = {
  primary: `${base} bg-caramel text-ivory hover:bg-caramel-deep`,
  ghost: `${base} border border-hairline bg-ivory/60 text-moss hover:border-caramel hover:text-caramel-deep`,
}

export default function CTAButton({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  className = '',
  dataCursor = 'hover',
}: {
  children: ReactNode
  to?: string
  href?: string
  onClick?: () => void
  variant?: keyof typeof variants
  className?: string
  dataCursor?: string
}) {
  const cls = `${variants[variant]} ${className}`
  const inner = <span className="relative z-10">{children}</span>

  const ripple = (
    <motion.span
      className="pointer-events-none absolute inset-0 rounded-full"
      aria-hidden
    />
  )

  if (to) {
    return (
      <Magnetic>
        <Link to={to} className={cls} data-cursor={dataCursor}>
          {inner}
          {ripple}
        </Link>
      </Magnetic>
    )
  }
  if (href) {
    return (
      <Magnetic>
        <a href={href} className={cls} data-cursor={dataCursor}>
          {inner}
          {ripple}
        </a>
      </Magnetic>
    )
  }
  return (
    <Magnetic>
      <button onClick={onClick} className={cls} data-cursor={dataCursor}>
        {inner}
        {ripple}
      </button>
    </Magnetic>
  )
}

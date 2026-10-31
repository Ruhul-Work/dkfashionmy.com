import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useMotionValue,
  useAnimate,
  type MotionProps,
} from 'framer-motion'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

/* ---------- reveal: stepped, chainable via staggerChildren ---------- */

export const easeSoft = [0.22, 0.61, 0.36, 1] as const

export const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeSoft },
  },
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 34,
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-12% 0px' }}
      transition={{ duration: 0.6, ease: easeSoft, delay }}
    >
      {children}
    </motion.div>
  )
}

/* stagger group — steps children one after another */
const groupVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export function StaggerGroup({
  children,
  className,
  step = 0.08,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  step?: number
  as?: 'div' | 'ul' | 'span'
}) {
  const MotionTag = motion[as] as typeof motion.div
  return (
    <MotionTag
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ staggerChildren: step }}
    >
      {children}
    </MotionTag>
  )
}

/* child item for use inside StaggerGroup or standalone */
export function StepItem({
  children,
  className,
  variants,
}: {
  children: ReactNode
  className?: string
  variants?: typeof fadeUp
}) {
  return (
    <motion.div className={className} variants={variants ?? fadeUp}>
      {children}
    </motion.div>
  )
}

/* ---------- split headline: word-by-word stepped reveal ---------- */

export function SplitHeadline({
  text,
  className,
  accentWords = [],
  as: Tag = 'h2',
}: {
  text: string
  className?: string
  accentWords?: string[]
  as?: 'h1' | 'h2' | 'h3'
}) {
  const MotionTag = motion[Tag]
  const words = text.split(' ')
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.055 } },
      }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pt-[0.14em] -mt-[0.14em] pb-[0.14em] -mb-[0.14em] align-bottom">
          <motion.span
            className={`inline-block ${accentWords.includes(w.replace(/[.,—]/g, '')) ? 'font-display italic text-caramel' : ''}`}
            variants={{
              hidden: { y: '110%', rotate: 4 },
              show: {
                y: '0%',
                rotate: 0,
                transition: { duration: 0.55, ease: easeSoft },
              },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </MotionTag>
  )
}

/* ---------- magnetic button ---------- */

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 16 })
  const sy = useSpring(y, { stiffness: 180, damping: 16 })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el || e.pointerType === 'touch') return
        const r = el.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- curtained image (clip-path wipe reveal) ---------- */

export function CurtainImage({
  src,
  fallbackSrc,
  alt,
  className,
  imgClassName,
  delay = 0,
  fallback,
}: {
  src: string
  fallbackSrc?: string
  alt: string
  className?: string
  imgClassName?: string
  delay?: number
  fallback?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const [ok, setOk] = useState(true)
  const [current, setCurrent] = useState(src)

  useEffect(() => {
    setCurrent(src)
    setOk(true)
  }, [src])

  const handleError = () => {
    if (fallbackSrc && current !== fallbackSrc) {
      setCurrent(fallbackSrc)
      setOk(true)
    } else {
      setOk(false)
    }
  }

  return (
    <div ref={ref} className={`relative overflow-hidden img-fallback ${className ?? ''}`}>
      <motion.img
        src={current}
        alt={alt}
        loading="lazy"
        onError={handleError}
        className={`h-full w-full object-cover ${imgClassName ?? ''}`}
        initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.14 }}
        animate={
          inView && ok
            ? { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }
            : inView
              ? { opacity: 0 }
              : { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.14 }
        }
        transition={{ duration: 0.9, ease: easeSoft, delay }}
      />
      {!ok && <div className="absolute inset-0 img-fallback" />}
      {fallback}
    </div>
  )
}

/* ---------- animated counter ---------- */

export function Counter({
  to,
  suffix = '',
  duration = 1.6,
  className,
}: {
  to: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  /* stepped suffix flip */
  return (
    <span ref={ref} className={className}>
      {val.toLocaleString()}
      {suffix && (
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: duration * 0.75, duration: 0.3 }}
        >
          {suffix}
        </motion.span>
      )}
    </span>
  )
}

/* ---------- scroll-linked parallax wrapper ---------- */

export function Parallax({
  children,
  amount = 60,
  className,
}: {
  children: ReactNode
  amount?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount])
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}

/* ---------- section heading ---------- */

export function SectionHeading({
  eyebrow,
  title,
  accentWords = [],
  align = 'center',
  className,
}: {
  eyebrow: string
  title: string
  accentWords?: string[]
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className ?? ''}`}>
      <Reveal>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-eucalyptus-deep">
          {eyebrow}
        </p>
      </Reveal>
      <SplitHeadline
        text={title}
        accentWords={accentWords}
        className={`font-display text-3xl leading-[1.08] sm:text-4xl lg:text-5xl ${align === 'center' ? 'mx-auto max-w-3xl' : ''}`}
      />
    </div>
  )
}

export { motion, useScroll, useSpring, useTransform, useInView, useMotionValue, useAnimate }
export type { MotionProps }

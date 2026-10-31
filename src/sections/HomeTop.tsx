import { useEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import { StaggerGroup, StepItem, CurtainImage, SectionHeading, Magnetic } from '../components/motion-kit'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'
import { SkeletonCard } from '../components/Skeletons'
import { useCategories, useProducts } from '../lib/hooks'
import { subcategoryImage } from '../lib/product'
import { assetUrl } from '../lib/api'
import { scrollToId } from '../components/SmoothScroll'

const easeSoft: [number, number, number, number] = [0.22, 0.61, 0.36, 1]
const easeExpo: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ---------------- HERO ---------------- */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  const words = ['Clothing', 'that', 'carries', 'calm']

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[97svh] flex-col justify-center overflow-hidden bg-moss"
    >
      {/* background video */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 will-change-transform">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/poster.jpg"
        >
          <source src="/video/brand-web.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* readability scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-moss/90 via-moss/55 to-moss/40" />

      {/* content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-32 sm:px-8 lg:pb-28 lg:pt-36"
      >
        <div className="flex flex-col gap-7">
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeExpo }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.3em] text-ivory/85">
              <span className="h-1.5 w-1.5 rounded-full bg-caramel" />
              Craft-first · For him &amp; for her
            </span>
            <span className="hidden h-px flex-1 bg-ivory/25 sm:block" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-ivory/60">
              Kuala Lumpur, Malaysia
            </span>
          </motion.div>

          <h1 className="font-display font-extrabold text-[clamp(2.75rem,9vw,7rem)] font-normal leading-[1] tracking-[-0.02em] text-ivory">
            <span className="block overflow-hidden">
              {words.slice(0, 4).map((w, i) => (
                <motion.span
                  key={w + i}
                  className="inline-block whitespace-nowrap pr-[0.25em] font-extrabold"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: easeExpo }}
                >
                  {i === 3 ? <em className="italic text-caramel">{w}</em> : w}
                </motion.span>
              ))}
            </span>
          </h1>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <motion.p
              className="max-w-xl text-base leading-relaxed text-ivory/75 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: easeExpo }}
            >
              Tailored in small batches, worn for years. Natural fabrics, quiet
              tailoring and everyday pieces made to stay in rotation.
            </motion.p>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.8, ease: easeExpo }}
            >
              <Magnetic>
                <Link
                  to="/shop"
                  data-cursor="hover"
                  className="inline-flex items-center justify-center rounded-full bg-ivory px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-moss transition-colors hover:bg-caramel hover:text-ivory"
                >
                  Shop the pieces
                </Link>
              </Magnetic>
              <Magnetic>
                <button
                  type="button"
                  onClick={() => scrollToId('categories')}
                  data-cursor="hover"
                  className="inline-flex items-center justify-center rounded-full border border-ivory/40 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:border-caramel hover:text-caramel"
                >
                  Explore
                </button>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* bottom rail: scroll cue + video toggle */}
      <div className="absolute inset-x-0 bottom-6 mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-8">
        <motion.button
          type="button"
          onClick={() => scrollToId('categories')}
          className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ivory/70 transition-colors hover:text-caramel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-ivory/25">
            <motion.span
              className="absolute inset-x-0 top-0 block h-3 bg-caramel"
              animate={{ y: ['-100%', '300%'] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          Scroll
        </motion.button>

        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="hidden text-[10px] uppercase tracking-[0.3em] text-ivory/40 sm:block">
            Est. 2026 · Kuala Lumpur
          </span>
          <button
            type="button"
            onClick={toggleVideo}
            aria-label={playing ? 'Pause background video' : 'Play background video'}
            className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ivory/70 transition-colors hover:text-caramel"
          >
            {playing ? 'Pause' : 'Play'}
            <span
              aria-hidden
              className={`flex h-6 w-10 items-center rounded-full border border-ivory/30 px-1 transition-colors group-hover:border-caramel ${
                playing ? 'justify-end' : 'justify-start'
              }`}
            >
              <span className="h-3 w-3 rounded-full bg-caramel" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------- TICKER ---------------- */
const tickerItems = [
  'Natural fabrics',
  'Small-batch tailoring',
  'For him & for her',
  'Made to last',
  'Let the fabric speak',
]

export function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-hairline bg-sand py-4">
      <motion.div
        className="flex w-max animate-marquee hover:[animation-play-state:paused]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {tickerItems.map((item, i) => (
              <span key={item + i} className="flex items-center">
                <span className="px-6 font-display text-lg italic text-moss">{item}</span>
                <Dot delay={i * 0.18} />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="inline-block h-1.5 w-1.5 rounded-full bg-caramel"
      animate={{ opacity: [0.25, 1, 0.25] }}
      transition={{ repeat: Infinity, duration: 2.4, delay, ease: 'easeInOut' }}
    />
  )
}

/* ---------------- COLLECTIONS (API-driven shelf) ---------------- */

export function Collections() {
  const { data: categories, loading, error, reload } = useCategories()
  const scroller = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState<number | null>(null)
  const [progress, setProgress] = useState(0.12)

  const tiles = useMemo(() => {
    const fromSubs = (categories ?? []).flatMap((c) =>
      (c.subcategories ?? []).map((s) => ({ cat: c, sub: s })),
    )
    if (fromSubs.length > 0) return fromSubs
    return (categories ?? []).map((c) => ({
      cat: c,
      sub: { id: c.id, name: c.name, slug: c.slug, is_active: c.is_active },
    }))
  }, [categories])

  /* shelves are rendered twice — this is the width of one copy */
  const setW = useRef(0)

  const measure = () => {
    const el = scroller.current
    if (!el) return
    setW.current = el.scrollWidth / 2
    wrap()
    updateProgress()
  }

  const updateProgress = () => {
    const el = scroller.current
    const w = setW.current
    if (!el || w <= 0) return
    const frac = (((el.scrollLeft % w) + w) % w) / w
    setProgress(0.12 + Math.min(1, frac) * 0.88)
  }

  /* fold scroll back into one copy's width — makes the shelf circular */
  const wrap = () => {
    const el = scroller.current
    const w = setW.current
    if (!el || w <= 0) return
    if (el.scrollLeft >= w) el.scrollLeft -= w
    else if (el.scrollLeft < 0) el.scrollLeft += w
  }

  const nudge = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    pausedRef.current = true
    el.scrollBy({ left: dir * 320, behavior: 'smooth' })
    setTimeout(() => {
      wrap()
      updateProgress()
      pausedRef.current = false
    }, 1400)
  }

  /* gentle auto-drift; pauses on hover / arrows */
  const pausedRef = useRef(false)
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    measure()
    window.addEventListener('resize', measure)
    const onScroll = () => {
      wrap()
      updateProgress()
    }
    let raf = 0
    const onEnter = () => (pausedRef.current = true)
    const onLeave = () => (pausedRef.current = false)
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('scroll', onScroll, { passive: true })
    const step = () => {
      if (!pausedRef.current) {
        el.scrollLeft += 0.6
        wrap()
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('scroll', onScroll)
    }
  }, [tiles.length])

  return (
    <section id="categories" className="py-24">
      <div className="mx-auto mb-10 max-w-6xl px-4 lg:px-8">
        <StaggerGroup className="flex flex-wrap items-end justify-between gap-6">
          <StepItem>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-eucalyptus-deep">
              Collections
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl">
              Browse by <em className="font-display italic text-caramel">mood</em>
            </h2>
            {/* live preview label that reacts to the hovered shelf */}
            <div className="mt-4 flex h-6 items-center gap-2 text-sm text-olive">
              <AnimatePresence mode="wait">
                {focused !== null && tiles[focused] ? (
                  <motion.span
                    key={`sub-${focused}`}
                    className="flex items-center gap-2 font-display text-lg italic text-caramel-deep"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    {tiles[focused].cat.name} · {tiles[focused].sub.name}
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Hover a shelf to preview
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </StepItem>
          <StepItem className="flex items-center gap-3">
            <p className="max-w-sm text-sm leading-relaxed text-olive">
              Every piece starts with fabric we can trace — drag, scroll by
              arrows, or just watch the shelves drift by.
            </p>
            {/* arrow controls */}
            <div className="flex gap-2">
              {([-1, 1] as const).map((dir) => (
                <motion.button
                  key={dir}
                  onClick={() => nudge(dir)}
                  aria-label={dir === -1 ? 'Scroll left' : 'Scroll right'}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-ivory text-moss shadow-soft transition-colors hover:border-caramel hover:text-caramel-deep"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {dir === -1 ? '←' : '→'}
                </motion.button>
              ))}
            </div>
          </StepItem>
        </StaggerGroup>
      </div>

      <div className="relative">
        {/* edge fades hint at continuation */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-ivory to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-ivory to-transparent" />

        {loading && (
          <div className="flex gap-6 overflow-hidden px-4 pb-6 lg:px-8" aria-hidden>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-[340px] w-[260px] shrink-0 overflow-hidden rounded-[1.7rem] img-fallback shadow-soft sm:w-[300px]"
              >
                <div className="h-full w-full animate-pulse bg-sand/80" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <EmptyState
            title="The shelves are quiet"
            hint={error}
            actionLabel="Try again"
            onAction={reload}
          />
        )}

        {!loading && !error && tiles.length > 0 && (
          <div
            ref={scroller}
            className="flex gap-6 overflow-x-auto px-4 pb-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            data-cursor="drag"
          >
            {[...tiles, ...tiles].map((t, i) => (
              <motion.div
                key={`${t.sub.slug}-${i}`}
                onMouseEnter={() => setFocused(i % tiles.length)}
                onMouseLeave={() => setFocused(null)}
                className="group relative h-[340px] w-[260px] shrink-0 overflow-hidden rounded-[1.7rem] img-fallback text-left shadow-soft transition-shadow duration-500 hover:shadow-lift sm:w-[300px]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % tiles.length) * 0.08, duration: 0.6, ease: easeSoft }}
                whileHover={{ y: -10 }}
              >
                <Link
                  to={
                    t.sub.slug && t.sub.slug !== t.cat.slug
                      ? `/shop?category=${t.cat.slug}&subcategory=${t.sub.slug}`
                      : `/shop?category=${t.cat.slug}`
                  }
                  className="absolute inset-0 z-30 block"
                  data-cursor="hover"
                />
                {subcategoryImage(t.sub) || assetUrl(t.cat.icon) ? (
                  <CurtainImage
                    src={subcategoryImage(t.sub) || assetUrl(t.cat.icon)}
                    alt={t.sub.name}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-110"
                    delay={(i % tiles.length) * 0.06}
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-moss/75 via-transparent to-transparent" />
                {/* shine sweep */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-y-20 left-[-30%] w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[420%]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-ivory">
                  <p className="font-display text-xl">{t.sub.name}</p>
                  <span className="mb-1 -translate-x-2 text-lg opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && tiles.length === 0 && (
          <p className="mx-auto max-w-6xl px-4 text-sm text-olive lg:px-8">The collections are being buttoned up — check back soon.</p>
        )}

        {/* scroll position meter */}
        <div className="mx-auto mt-2 max-w-6xl px-4 lg:px-8">
          <div className="h-1 overflow-hidden rounded-full bg-hairline">
            <motion.div
              className="h-full origin-left rounded-full bg-caramel"
              animate={{ scaleX: progress }}
              transition={{ duration: 0.25 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- PIECES (API-driven grid + see more) ---------------- */

export function Products() {
  const piecesQuery = useMemo(() => ({ sort_by: 'latest', per_page: 9 }) as const, [])
  const { data, loading, error, reload } = useProducts(piecesQuery)
  const items = data?.items ?? []

  return (
    <section id="products" className="bg-sand/60 py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="What we make"
          title="Pieces made to be lived in"
          accentWords={['lived']}
          className="mb-14"
        />

        {loading && (
          <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && !loading && (
          <EmptyState
            title="The rack slipped out of reach"
            hint={error}
            actionLabel="Try again"
            onAction={reload}
          />
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-center text-sm text-olive">Fresh pieces are still on the cutting table — check back soon.</p>
        )}

        {items.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-3 lg:gap-8">
              {items.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} stepped={false} />
              ))}
            </div>

            <div className="mt-14 flex justify-center">
              <Magnetic>
                <Link
                  to="/shop"
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 rounded-full border border-hairline bg-ivory px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-moss shadow-soft transition-colors duration-300 hover:border-caramel hover:text-caramel-deep"
                >
                  See the full shelf
                  <span aria-hidden>→</span>
                </Link>
              </Magnetic>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

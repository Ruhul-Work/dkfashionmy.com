import { useEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
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

/* ---------------- HERO ---------------- */
export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden border-y border-hairline bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-olive">
            <span className="h-1.5 w-1.5 rounded-full bg-caramel" />
            The DK edit · Kuala Lumpur
          </p>
          <h1 className="max-w-3xl font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.04em] text-moss">
            Clothing that <em className="text-caramel">carries calm.</em>
          </h1>
        </motion.div>
        <motion.div
          className="flex flex-col gap-7 lg:pb-2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          <p className="max-w-md text-base leading-relaxed text-olive sm:text-lg">
            Tailored in small batches, worn for years. Natural fabrics, quiet
            tailoring and everyday pieces made to stay in rotation.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                to="/shop"
                data-cursor="hover"
                className="inline-flex items-center justify-center rounded-full bg-moss px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-caramel"
              >
                Shop the pieces
              </Link>
            </Magnetic>
            <button
              type="button"
              onClick={() => scrollToId('categories')}
              data-cursor="hover"
              className="inline-flex items-center gap-2 px-3 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-moss transition-colors hover:text-caramel"
            >
              Explore the edit <span aria-hidden>↘</span>
            </button>
          </div>
        </motion.div>
      </div>
      <div aria-hidden className="absolute -bottom-20 -right-8 h-64 w-64 rounded-full border border-caramel/30 sm:-right-16 sm:h-96 sm:w-96" />
    </section>
  )
}

export function VideoShowcase() {
  return (
    <section id="campaign" className="relative overflow-hidden bg-moss text-ivory">
      <div className="relative min-h-[72svh]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/poster.jpg"
          aria-label="DK Fashion collection campaign"
        >
          <source src="/video/brand-web.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-moss/85 via-moss/45 to-moss/20" />
        <div className="relative mx-auto flex min-h-[72svh] max-w-6xl items-end px-4 py-12 sm:px-8 sm:py-16">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-ivory/75">
              The quiet collection · 2026
            </p>
            <h2 className="font-display text-4xl leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
              Made slowly.
              <br />
              <em className="text-caramel">Worn endlessly.</em>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/75 sm:text-base">
              A closer look at the textures, movement and everyday rhythm behind
              the DK collection.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-6 right-4 hidden text-[10px] uppercase tracking-[0.3em] text-ivory/60 sm:right-8 sm:block">
          DK / Motion study
        </div>
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

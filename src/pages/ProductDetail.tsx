import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { assetUrl, fetchProducts } from '../lib/api'
import { useProduct } from '../lib/hooks'
import { productImages } from '../lib/product'
import type { Product } from '../lib/types'
import Price from '../components/Price'
import { discountPercent, money } from '../lib/pricing'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'
import { SkeletonCard, SkeletonText } from '../components/Skeletons'
import { Magnetic } from '../components/motion-kit'

const easeSoft: [number, number, number, number] = [0.22, 0.61, 0.36, 1]
const easeExpo: [number, number, number, number] = [0.22, 1, 0.36, 1]
const WHATSAPP = 'https://wa.me/601137455473'

const SPEC_LABELS: Record<string, string> = {
  material: 'Material',
  weight_gsm: 'Weight (GSM)',
  fabric_type: 'Fabric type',
  origin_country: 'Origin',
  fabric_weave: 'Fabric weave',
  care_instructions: 'Care',
  durability_rating: 'Durability',
  transparency_text: 'Transparency',
}

function specLabel(key: string): string {
  return SPEC_LABELS[key] ?? key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}

function Breadcrumb({ product }: { product: Product | null }) {
  const cat = product?.category ?? null
  const sub = product?.subcategory ?? null
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-olive">
      <Link to="/" className="transition-colors hover:text-caramel-deep">Home</Link>
      <span aria-hidden className="text-olive/50">·</span>
      <Link to="/shop" className="transition-colors hover:text-caramel-deep">Shop</Link>
      {cat && (
        <>
          <span aria-hidden className="text-olive/50">·</span>
          <Link to={`/shop?category=${cat.slug}`} className="transition-colors hover:text-caramel-deep">{cat.name}</Link>
        </>
      )}
      {sub && (
        <>
          <span aria-hidden className="text-olive/50">·</span>
          <Link to={`/shop?category=${cat?.slug ?? ''}&subcategory=${sub.slug}`} className="transition-colors hover:text-caramel-deep">
            {sub.name}
          </Link>
        </>
      )}
    </nav>
  )
}

function Gallery({ product }: { product: Product }) {
  const images = useMemo(() => productImages(product), [product])
  const [active, setActive] = useState(0)
  const src = images[active] ?? ''
  const many = images.length > 1

  useEffect(() => setActive((n) => Math.min(n, images.length - 1)), [images.length])

  const step = (dir: 1 | -1) => {
    setActive((n) => {
      const next = n + dir
      if (next < 0) return images.length - 1
      if (next >= images.length) return 0
      return next
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        className="relative overflow-hidden rounded-[2rem] img-fallback shadow-lift"
        style={{ aspectRatio: '3 / 3.6' }}
        drag={many ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) step(1)
          else if (info.offset.x > 50) step(-1)
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={src || 'empty'}
            src={src}
            alt={`${product.name} — view ${active + 1}`}
            className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.55, ease: easeSoft }}
            onError={(e) => { e.currentTarget.style.display = 'none'; step(1) }}
          />
        </AnimatePresence>

        {many && (
          <>
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => step(dir as 1 | -1)}
                aria-label={dir === -1 ? 'Previous image' : 'Next image'}
                className={`absolute top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-ivory/90 text-moss shadow-soft transition-colors hover:border-caramel hover:text-caramel-deep ${
                  dir === -1 ? 'left-4' : 'right-4'
                }`}
              >
                {dir === -1 ? '←' : '→'}
              </button>
            ))}
            <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-moss/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ivory">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </motion.div>

      {many && (
        <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={i === active}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl img-fallback transition-all duration-300 ${
                i === active ? 'ring-2 ring-caramel ring-offset-2 ring-offset-ivory' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Variants({ items, selected, onSelect }: {
  items: Product[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  if (items.length === 0) return null
  return (
    <div>
      <p className="mb-2.5 text-[10px] uppercase tracking-[0.22em] text-eucalyptus-deep">Available in</p>
      <div className="flex flex-wrap gap-2">
        {items.map((child) => {
          const id = String(child.id)
          const isSelected = selected === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(isSelected ? '' : id)}
              aria-pressed={isSelected}
              data-cursor="hover"
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs transition-colors ${
                isSelected
                  ? 'border-caramel bg-caramel text-ivory'
                  : 'border-hairline bg-sand/60 text-moss hover:border-caramel hover:text-caramel-deep'
              }`}
            >
              {child.color?.hex && (
                <span
                  className="h-3.5 w-3.5 rounded-full border border-moss/20"
                  style={{ background: child.color.hex }}
                  title={child.color.name}
                />
              )}
              {child.size?.name && <span>{child.size.name}</span>}
              {child.size && child.color?.name && <span aria-hidden>·</span>}
              {child.color?.hex && !child.size?.name && <span>{child.color.name}</span>}
              {!child.color?.hex && !child.size?.name && <span>{child.name}</span>}
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-[11px] italic text-olive/80">You will pick the exact variant at checkout on Shopee.</p>
    </div>
  )
}

function toHtml(input: string): string {
  if (!input) return ''
  // CKEditor (and any backend) may store already-formatted HTML. Plain
  // text (no tags) is wrapped so newlines survive instead of collapsing.
  if (/<[a-z][\s\S]*>/i.test(input)) return input
  return input
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, '<br />')}</p>`)
    .join('')
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: product, loading, error, reload } = useProduct(slug)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [recommended, setRecommended] = useState<Product[]>([])
  const [recLoading, setRecLoading] = useState(true)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [chartOpen, setChartOpen] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!product) return
    let cancelled = false
    const ac = new AbortController()
    setRecLoading(true)
    const tries: Parameters<typeof fetchProducts>[0][] = []
    if (product.subcategory?.slug) tries.push({ subcategory: product.subcategory.slug, sort_by: 'latest', per_page: 10 })
    if (product.category?.slug) tries.push({ category: product.category.slug, sort_by: 'latest', per_page: 10 })
    tries.push({ sort_by: 'latest', per_page: 10 })
    void (async () => {
      for (const q of tries) {
        try {
          const d = await fetchProducts(q, ac.signal)
          const filtered = d.items.filter((x) => String(x.id) !== String(product.id))
          if (filtered.length > 0) {
            if (!cancelled) {
              setRecommended(filtered.slice(0, 8))
              setRecLoading(false)
            }
            return
          }
        } catch {
          if (ac.signal.aborted) return
        }
      }
      if (!cancelled) {
        setRecommended([])
        setRecLoading(false)
      }
    })()
    return () => {
      cancelled = true
      ac.abort()
    }
  }, [product])

  useEffect(() => {
    setSelectedId(null)
    setShowStickyBar(false)
    setChartOpen(false)
  }, [slug])

  useEffect(() => {
    const el = ctaRef.current
    if (!el || !product) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setShowStickyBar(!e.isIntersecting && e.boundingClientRect.top < 0))
      },
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [product])

  if (loading) {
    return (
      <main className="pt-36">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-8 h-3 w-64 animate-pulse rounded bg-sand" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[2rem] img-fallback shadow-lift" style={{ aspectRatio: '3 / 3.6' }}>
              <div className="h-full w-full animate-pulse bg-sand/80" />
            </div>
            <div className="flex flex-col gap-5 py-2">
              <div className="h-3 w-24 animate-pulse rounded bg-sand" />
              <SkeletonText lines={2} className="max-w-sm" />
              <SkeletonCard />
              <SkeletonText lines={4} />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="pt-36">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <EmptyState
            title="This piece wandered off"
            hint="It may be out of stock or the link is old — the full shelf is waiting."
            actionLabel="Back to the shop"
            onAction={() => navigate('/shop')}
          />
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={reload}
              className="text-xs uppercase tracking-[0.18em] text-olive underline underline-offset-4 hover:text-caramel-deep"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    )
  }

  const off = discountPercent(product.price, product.mrp)
  const specs = Object.entries(product.specifications ?? {})
    .filter(([, value]) => value !== null && value !== undefined && `${value}`.trim() !== '')
  const shortDescription = product.short_description || product.material || ''
  const longDescription = product.description || ''
  const description = shortDescription || longDescription || ''
  const sizeChart = assetUrl(product.size_chart_url)
  const buyHref = product.shopee_url ?? ''

  return (
    <main className="pt-36">
      <section className="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeSoft }}
        >
          <Breadcrumb product={product} />
          <h1 className="mt-4 font-display text-4xl leading-tight tracking-[-0.01em] text-moss sm:text-5xl">
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: easeExpo }}
              >
                {product.name}
              </motion.span>
            </span>
          </h1>
          {product.sku && (
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-olive/70">SKU {product.sku}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: easeSoft }}
          >
            <Gallery product={product} />
          </motion.div>

          <motion.div
            className="flex flex-col gap-7"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeSoft } } }}>
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <Link
                    to={`/shop?category=${product.category.slug}`}
                    className="rounded-full bg-sand px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] text-moss transition-colors hover:bg-caramel hover:text-ivory"
                  >
                    {product.category.name}
                  </Link>
                )}
                {product.subcategory && (
                  <Link
                    to={`/shop?category=${product.category?.slug ?? ''}&subcategory=${product.subcategory.slug}`}
                    className="rounded-full border border-hairline px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] text-olive transition-colors hover:border-caramel hover:text-caramel-deep"
                  >
                    {product.subcategory.name}
                  </Link>
                )}
                {product.color && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-hairline px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] text-olive">
                    <span className="h-3 w-3 rounded-full border border-moss/20" style={{ background: product.color.hex }} />
                    {product.color.name}
                  </span>
                )}
                {product.size && (
                  <span className="rounded-full border border-hairline px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] text-olive">
                    Size {product.size.name}
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeSoft } } }}>
              <div className="flex items-baseline gap-3">
                <Price price={product.price} mrp={product.mrp} size="lg" />
              </div>
              {off > 0 && (
                <p className="mt-1 text-xs text-olive">{money(product.mrp)} — you keep {money(Number(product.mrp) - Number(product.price))}</p>
              )}
            </motion.div>

            {description && (
              <motion.div
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeSoft } } }}
                className="rich-text max-w-prose text-sm leading-relaxed text-olive sm:text-[15px]"
                dangerouslySetInnerHTML={{ __html: toHtml(description) }}
              />
            )}

            {(product.children?.length ?? 0) > 0 && (
              <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeSoft } } }}>
                <Variants items={product.children ?? []} selected={selectedId} onSelect={setSelectedId} />
              </motion.div>
            )}

            <motion.div ref={ctaRef} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeSoft } } }} className="flex flex-col gap-3">
              {buyHref ? (
                <Magnetic>
                  <a
                    href={buyHref}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-caramel px-8 py-4.5 text-sm font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-caramel-deep sm:w-auto"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M6 7h12l1.5 13h-15L6 7Z" />
                      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
                    </svg>
                    Buy on Shopee
                    <span aria-hidden className="text-lg leading-none">↗</span>
                  </a>
                </Magnetic>
              ) : (
                <p className="text-sm italic text-olive">Not listed online at the moment — call us and we will reserve one.</p>
              )}
              <div className="flex items-center gap-2 text-sm text-olive">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-caramel/50 underline-offset-4 transition-colors hover:text-caramel-deep"
                >
                  Call to order
                </a>
                <span aria-hidden>·</span>
                <span>Secure checkout on Shopee · Delivered nationwide</span>
              </div>
            </motion.div>

            {specs.length > 0 && (
              <motion.dl
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeSoft } } }}
                className="flex flex-col"
              >
                {specs.map(([key, value]) => (
                  <div key={key} className="flex items-baseline justify-between gap-6 border-b border-hairline py-3">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-olive">{specLabel(key)}</dt>
                    <dd className="text-right text-sm text-moss">{`${value}`}</dd>
                  </div>
                ))}
              </motion.dl>
            )}

            {sizeChart ? (
              <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeSoft } } }}>
                <button
                  type="button"
                  onClick={() => setChartOpen((v) => !v)}
                  aria-expanded={chartOpen}
                  data-cursor="hover"
                  className="flex w-full px-3 items-center justify-between gap-4 rounded-2xl border border-hairline bg-ivory py-3.5 indent-0 text-left"
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="font-display text-lg italic text-caramel">Sizing</span>
                    <span className="text-sm text-olive">Size chart, in numbers</span>
                  </span>
                  <motion.span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline text-caramel-deep"
                    animate={{ rotate: chartOpen ? 45 : 0 }}
                    transition={{ duration: 0.35, ease: easeSoft }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {chartOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: easeSoft }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        <img
                          src={sizeChart}
                          alt={`Size chart — ${product.name}`}
                          loading="lazy"
                          className="w-full rounded-2xl img-fallback shadow-soft"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </section>

      {longDescription && (
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-eucalyptus-deep">The story</p>
                <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                  In <em className="font-display italic text-caramel">full</em>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-olive">
                  Fabric, fit and finish — everything the cutter noted down before the needle went in.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.6, ease: easeSoft }}
                className="prose-none max-w-2xl"
              >
                <div className="relative rounded-[2rem] border border-hairline bg-ivory p-8 shadow-soft sm:p-12">
                  <div className="rich-text font-display text-lg leading-relaxed text-moss sm:text-xl" dangerouslySetInnerHTML={{ __html: toHtml(longDescription) }} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-sand/60 py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-eucalyptus-deep">Keep browsing</p>
              <h2 className="font-display text-3xl sm:text-4xl">
                You may also <em className="font-display italic text-caramel">like</em>
              </h2>
            </div>
            <Link
              to={product.subcategory?.slug ? `/shop?subcategory=${product.subcategory.slug}` : product.category?.slug ? `/shop?category=${product.category.slug}` : '/shop'}
              className="text-xs uppercase tracking-[0.22em] text-olive transition-colors hover:text-caramel-deep"
            >
              View all →
            </Link>
          </div>

          {recLoading ? (
            <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} variant="tile" />
              ))}
            </div>
          ) : recommended.length === 0 ? (
            <p className="text-sm text-olive">No other pieces on this shelf yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-4">
              {recommended.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} imageClass="aspect-[3/3.4]" />
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showStickyBar && buyHref && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[75] border-t border-hairline bg-ivory/95 px-4 py-3 shadow-lift backdrop-blur-md lg:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: easeSoft }}
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-display text-sm text-moss">{product.name}</p>
                <Price price={product.price} mrp={product.mrp} size="sm" />
              </div>
              <a
                href={buyHref}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-full bg-caramel px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory"
              >
                Buy on Shopee ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

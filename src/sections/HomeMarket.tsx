import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { SectionHeading, StaggerGroup, StepItem } from '../components/motion-kit'
import { Reveal } from '../components/motion-kit'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'
import { SkeletonCard } from '../components/Skeletons'
import { useProduct, useProducts } from '../lib/hooks'
import type { Product, ProductDetail } from '../lib/types'
import { productCover, productImages } from '../lib/product'
import PolaroidLineCarousel, { type Slide } from '../components/ui/polaroid-line-carousel'
import Price from '../components/Price'
import { discountPercent, money } from '../lib/pricing'

const easeSoft: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

/* ================= NEW ARRIVALS =================
   Three columns that drift at different scroll speeds (isotope feel);
   tiles enter in staggered steps, fed by the API's newest products.   */

const COLUMN_SPLITS: number[][] = [[0, 1], [2, 3, 4], [5, 6]]

function shuffle<T>(list: T[]): T[] {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function NewArrivals() {
  const ref = useRef<HTMLElement>(null)
  const arrivalsQuery = useMemo(() => ({ sort_by: 'latest', per_page: 7 }) as const, [])
  const { data, loading, error, reload } = useProducts(arrivalsQuery)
  const items = data?.items ?? []

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -36])
  const y2 = useTransform(scrollYProgress, [0, 1], [90, -70])
  const y3 = useTransform(scrollYProgress, [0, 1], [58, -44])

  const colY = [y1, y2, y3]

  return (
    <section ref={ref} id="arrivals" className="py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Fresh off the table"
          title="New arrivals, just landed"
          accentWords={['landed']}
          className="mb-14"
        />

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={i === 1 ? 'lg:mt-10' : ''}>
                <SkeletonCard variant="tile" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <EmptyState title="The rack is on break" hint={error} actionLabel="Try again" onAction={reload} />
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {COLUMN_SPLITS.map((col, c) => (
              <motion.div key={c} style={{ y: colY[c] }} className={`flex flex-col gap-6 sm:gap-8 lg:gap-10 ${c === 1 ? 'lg:mt-10' : ''}`}>
                {col
                  .map((i) => items[i])
                  .filter((p): p is Product => Boolean(p))
                  .map((p, i) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      index={i}
                      tag="New"
                      imageClass="h-56 sm:h-64"
                      stepped={false}
                    />
                  ))}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ================= POPULAR COLLECTION =================
   A client-side shuffled pick of what came off the newest batch —
   ranked numerals and the scroll-scrubbed meter stay as decoration. */

function PopularCard({ product, rank, index }: { product: Product; rank: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  /* meter scrubs with scroll — fills as the card travels up */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end 60%'] })

  /* cursor tilt */
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 140, damping: 14 })
  const sry = useSpring(ry, { stiffness: 140, damping: 14 })

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ delay: index * 0.09, duration: 0.6, ease: easeSoft }}
      style={{ perspective: 900 }}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el || e.pointerType === 'touch') return
        const r = el.getBoundingClientRect()
        ry.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 10)
        rx.set(((e.clientY - (r.top + r.height / 2)) / r.height) * -10)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      <motion.div
        className="relative overflow-hidden rounded-[1.6rem] img-fallback shadow-soft transition-shadow duration-500 group-hover:shadow-lift"
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        whileHover={{ zIndex: 20 }}
      >
        <ProductCard product={product} index={index} imageClass="h-64 sm:h-72" stepped={false} />
        {/* rank numeral */}
        <motion.span
          className="text-outline pointer-events-none absolute -left-1 -top-3 z-10 select-none font-display text-6xl font-semibold"
          style={{ transform: 'translateZ(40px)' }}
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.09 + 0.25, duration: 0.5 }}
        >
          {rank}
        </motion.span>
      </motion.div>

      {/* scroll-scrubbed meter */}
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-hairline">
        <motion.div
          className="h-full origin-left bg-caramel"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </motion.div>
  )
}

export function PopularCollection() {
  const popularQuery = useMemo(() => ({ sort_by: 'latest', per_page: 12 }) as const, [])
  const { data, loading, error, reload } = useProducts(popularQuery)
  const picks = useMemo(() => shuffle(data?.items ?? []).slice(0, 4), [data])

  return (
    <section id="popular" className="bg-sand/60 py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <StaggerGroup className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <StepItem>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-eucalyptus-deep">
              Popular collection
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl">
              In <em className="font-display italic text-caramel">rotation</em> this season
            </h2>
          </StepItem>
          <StepItem className="max-w-sm text-sm leading-relaxed text-olive">
            Meters below each card fill as you scroll — and this shelf re-weaves
            itself with every visit.
          </StepItem>
        </StaggerGroup>

        {loading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} variant="wide" />
            ))}
          </div>
        )}

        {error && !loading && (
          <EmptyState title="The meters stalled" hint={error} actionLabel="Try again" onAction={reload} />
        )}

        {picks.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {picks.map((p, i) => (
              <PopularCard key={p.id} product={p} rank={`0${i + 1}`} index={i} />
            ))}
          </div>
        )}

        <Reveal className="mt-16 text-center">
          <p className="text-sm text-olive">
            Prices update straight from the shelf — the discount badge tells you what you keep.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

const LOCAL_PRODUCT_IMAGES = Array.from(
  { length: 6 },
  (_, index) => `/products/product-${String(index + 1).padStart(2, '0')}.jpg`,
)

export function ProductStories() {
  const storiesQuery = useMemo(() => ({ sort_by: 'latest', per_page: 6 }) as const, [])
  const { data } = useProducts(storiesQuery)
  const products = data?.items ?? []
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const slides: Slide[] = products.length > 0
    ? products.map((product, index) => ({
        image: productCover(product) || LOCAL_PRODUCT_IMAGES[index % LOCAL_PRODUCT_IMAGES.length],
        title: product.name,
        caption: product.category?.name ?? product.subcategory?.name ?? 'Made for everyday movement',
        alt: `${product.name} — DK Fashion`,
      }))
    : LOCAL_PRODUCT_IMAGES.map((image, index) => ({
        image,
        title: `DK Edit ${String(index + 1).padStart(2, '0')}`,
        caption: 'Made for everyday movement',
        alt: `DK Fashion product ${index + 1}`,
      }))

  return (
    <section id="stories" className="bg-transparent py-12 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <StaggerGroup className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <StepItem>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-eucalyptus-deep">
              The DK edit
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl">
              Pieces with a <em className="font-display italic text-caramel">story</em>
            </h2>
          </StepItem>
          <StepItem className="max-w-sm text-sm leading-relaxed text-olive">
            Browse the collection on the line. Drag a print or use the arrows to find
            the piece that feels like you.
          </StepItem>
        </StaggerGroup>

      </div>
      <Reveal className="w-full">
        <PolaroidLineCarousel
          slides={slides}
          height="min(620px, 76svh)"
          className="product-stories-carousel"
          cardWidth={280}
          sag={38}
          swing={0.75}
          autoplay={5000}
          background="transparent"
          ink="var(--color-moss)"
          string="var(--color-caramel)"
          onSelect={(index) => setSelectedProduct(products[index] ?? null)}
          ariaLabel="DK Fashion product stories"
        />
      </Reveal>

      {selectedProduct && (
        <ProductStoryModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  )
}

function ProductStoryModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { data: detail } = useProduct(product.slug)
  const fullProduct: ProductDetail = detail ?? product
  const images = productImages(fullProduct)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  const cover = images[activeImage] ?? productCover(fullProduct)
  const off = discountPercent(fullProduct.price, fullProduct.mrp)
  const description = fullProduct.description ?? fullProduct.short_description ?? ''
  const specifications = Object.entries(fullProduct.specifications ?? {})
    .filter(([, value]) => value !== null && value !== undefined && `${value}`.trim() !== '')

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-moss/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${fullProduct.name} product details`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[1.8rem] bg-ivory shadow-lift [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-ivory/90 text-lg text-moss shadow-soft"
        >
          ×
        </button>
        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-[1.5rem] img-fallback shadow-soft" style={{ aspectRatio: '3 / 3.6' }}>
              {cover ? (
                <img src={cover} alt={`${fullProduct.name} — view ${activeImage + 1}`} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full" />
              )}
              {off > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-eucalyptus px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-moss">
                  −{off}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {images.map((image, index) => (
                  <button
                    key={image + index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show product image ${index + 1}`}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl transition-all ${
                      index === activeImage ? 'ring-2 ring-caramel ring-offset-2 ring-offset-ivory' : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-5 flex flex-wrap gap-2">
              {fullProduct.category && <span className="rounded-full bg-sand px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] text-moss">{fullProduct.category.name}</span>}
              {fullProduct.subcategory && <span className="rounded-full border border-hairline px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] text-olive">{fullProduct.subcategory.name}</span>}
              {fullProduct.color && <span className="inline-flex items-center gap-2 rounded-full border border-hairline px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] text-olive"><span className="h-3 w-3 rounded-full border border-moss/20" style={{ background: fullProduct.color.hex }} />{fullProduct.color.name}</span>}
              {fullProduct.size && <span className="rounded-full border border-hairline px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] text-olive">Size {fullProduct.size.name}</span>}
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-olive/70">DK Fashion</p>
            <h3 className="mt-3 font-display text-3xl leading-tight text-moss sm:text-4xl">{fullProduct.name}</h3>
            {fullProduct.sku && <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-olive/70">SKU {fullProduct.sku}</p>}
            <Price price={fullProduct.price} mrp={fullProduct.mrp} size="lg" className="mt-6" />
            {off > 0 && <p className="mt-1 text-xs text-olive">{money(fullProduct.mrp)} — you keep {money(Number(fullProduct.mrp) - Number(fullProduct.price))}</p>}
            {fullProduct.material && (
              <p className="mt-6 text-sm leading-relaxed text-olive">
                <span className="font-semibold text-moss">Material:</span> {fullProduct.material}
              </p>
            )}
            {description && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-olive">{description}</p>}
            {specifications.length > 0 && (
              <div className="mt-6 border-t border-hairline pt-5">
                <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-eucalyptus-deep">Product details</p>
                <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  {specifications.map(([key, value]) => (
                    <div key={key} className="flex flex-col rounded-lg bg-sand/50 px-3 py-2">
                      <dt className="text-[10px] uppercase tracking-[0.14em] text-olive">{key.replace(/_/g, ' ')}</dt>
                      <dd className="mt-1 text-moss">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {fullProduct.shopee_url && (
                <a href={fullProduct.shopee_url} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-caramel px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-caramel-deep">
                  Buy on Shopee ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Product } from '../lib/types'
import { productCover, productTag } from '../lib/product'
import { discountPercent } from '../lib/pricing'
import { CurtainImage } from './motion-kit'
import Price from './Price'

const easeSoft: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

export default function ProductCard({
  product,
  index = 0,
  tag,
  imageClass = 'aspect-[3/3.8]',
  stepped = true,
}: {
  product: Product
  index?: number
  tag?: string
  imageClass?: string
  stepped?: boolean
}) {
  const cover = productCover(product)
  const off = discountPercent(product.price, product.mrp)
  const label = productTag(product)
  const to = `/product/${product.slug}`
  const initial = stepped ? { opacity: 0, y: 44 } : false

  return (
    <motion.div
      className="group relative overflow-hidden rounded-[1.6rem] img-fallback shadow-soft transition-shadow duration-500 hover:shadow-lift"
      initial={initial}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={stepped ? { once: true, margin: '-4% 0px' } : undefined}
      transition={{ delay: (index % 3) * 0.09, duration: 0.6, ease: easeSoft }}
      whileHover={{ y: -6 }}
    >
      <Link to={to} className="block" data-cursor="hover">
        {cover ? (
          <CurtainImage
            src={cover}
            alt={`${product.name} — DK Fashion ${label}`}
            className={`w-full ${imageClass}`}
            imgClassName="transition-transform duration-700 group-hover:scale-105"
            delay={(index % 3) * 0.07}
          />
        ) : (
          <div className={`w-full ${imageClass}`} />
        )}

        {tag === 'New' && (
          <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-ivory/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-caramel-deep shadow-soft">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-caramel"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            />
            New
          </span>
        )}

        {off > 0 && (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-eucalyptus px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-moss shadow-soft">
            −{off}%
          </span>
        )}

        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -inset-y-20 left-[-30%] w-1/2 rotate-12 bg-gradient-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-1000 group-hover:translate-x-[420%]" />
        </div>

        <div className="absolute inset-x-2 bottom-2 z-10 rounded-xl bg-ivory/95 px-3 py-2.5 backdrop-blur-md transition-transform duration-500 lg:inset-x-3 lg:bottom-3 lg:translate-y-16 lg:px-4 lg:py-3 lg:group-hover:translate-y-0">
          <p className="font-display text-[13px] leading-snug sm:text-base">
            {product.name.length > 20 ? `${product.name.slice(0, 20)}…` : product.name}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            {tag ? (
              <span className="text-[10px] uppercase tracking-[0.18em] text-olive">{tag}</span>
            ) : (
              label && <span className="text-[10px] uppercase tracking-[0.18em] text-olive">{label}</span>
            )}
            <Price price={product.price} mrp={product.mrp} size="sm" className="shrink-0" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

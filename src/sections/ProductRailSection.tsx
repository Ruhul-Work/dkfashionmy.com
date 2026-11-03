import { useEffect, useMemo, useState } from 'react'
import ClothingRailHero from '../components/ui/product-rail-gallery'
import type { RailGarment } from '../components/ui/product-rail-gallery'
import { Link } from 'react-router-dom'
import { fetch3DActiveProducts, fetchProduct, fetchWebsiteSettings } from '../lib/api'
import { assetUrl } from '../lib/api'
import type { Product3DActive, ProductDetail, WebsiteSettings } from '../lib/types'

// Kept for backwards compatibility / fallback reference.
export const RAIL_DEMO_ITEMS: RailGarment[] = []

function formatShipping(settings: WebsiteSettings | null, currency: string): string | undefined {
  if (!settings) return undefined
  const cur = currency.trim()
  if (settings.shipping_charge != null) return `${cur} ${settings.shipping_charge}`.trim()
  return undefined
}

function toRailGarment(product: Product3DActive, currency: string, settings: WebsiteSettings | null): RailGarment {

  const front = assetUrl(product.front_view_url) || assetUrl(product.thumbnail_url)
  const back = assetUrl(product.back_view_url) || front
  const side = assetUrl(product.side_view_url) || front
  const priceTag =
    product.price != null
      ? `${currency} ${product.price}`.trim()
      : product.mrp != null
        ? `${currency} ${product.mrp}`.trim()
        : undefined
  return {
    id: String(product.slug ?? product.id),
    name: product.name,
    kind: 'tee',
    color: undefined,
    tag: priceTag,
    price: product.price ?? null,
    mrp: product.mrp ?? null,
    mrpTag: product.mrp != null ? `${currency} ${product.mrp}`.trim() : undefined,
    category: product.category?.name ?? null,
    material: undefined,
    fit: undefined,
    care: undefined,
    colorName: product.color?.name ?? undefined,
    sku: product.sku ?? undefined,
    shipping: formatShipping(settings, currency),
    shopeeUrl: product.shopee_url ?? undefined,
    description: product.category?.name ?? undefined,
    details: [],
    image: front,
    backImage: back,
    sideImage: side,
  }
}

export default function ProductRailSection() {
  const [products, setProducts] = useState<Product3DActive[]>([])
  const [loading, setLoading] = useState(true)
  const [enriched, setEnriched] = useState<Record<number, Partial<RailGarment>>>({})
  const [currency, setCurrency] = useState<string>('')
  const [settings, setSettings] = useState<WebsiteSettings | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch3DActiveProducts(controller.signal)
      .then((items) => setProducts(items ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchWebsiteSettings(controller.signal)
      .then((s: WebsiteSettings | null) => {
        setSettings(s)
        setCurrency(s?.currency_code?.trim() ?? '')
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  useEffect(() => {
    setEnriched({})
  }, [products])

  const enrich = (index: number) => {
    const product = products[index]
    if (!product) return
    const slug = (product.slug ?? String(product.id)) as string
    fetchProduct(slug)
      .then((detail: ProductDetail) => {
        const specs = detail.specifications ?? {}
        const material = detail.material || (specs as Record<string, string | null>).material || (specs as Record<string, string | null>).fabric_type || undefined
        const care = (specs as Record<string, string | null>).care_instructions || undefined
        const details = Object.values(specs).filter((v) => v != null && `${v}`.trim() !== '') as string[]
        setEnriched((prev) => ({
          ...prev,
          [index]: {
            description: detail.short_description || detail.description || product.category?.name || undefined,
            material: material || undefined,
            care: care || undefined,
            sku: detail.sku || product.sku || undefined,
            shopeeUrl: detail.shopee_url || product.shopee_url || undefined,
            details: details.length ? details : undefined,
          },
        }))
      })
      .catch(() => {})
  }

  const items = useMemo(() => products.map((product, index) => ({ ...toRailGarment(product, currency, settings), ...(enriched[index] ?? {}) })), [products, enriched, currency, settings])

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center bg-background text-foreground py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    )
  }

  if (!items.length) return null

  return (
    <div data-rail-demo className="flex w-full items-center justify-center bg-background text-foreground">
      <ClothingRailHero
        items={items}
        hanger="none"
        eyebrow="Craft-first · For him & for her"
        heading="Clothing that carries calm"
        caption="Tailored in small batches, worn for years. Natural fabrics, quiet tailoring and everyday pieces made to stay in rotation."
        autoplay
        onOpenChange={(index) => { if (index !== null) enrich(index) }}
        action={
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-background transition-colors hover:bg-caramel hover:text-background"
          >
            Shop the pieces
          </Link>
        }
      />
    </div>
  )
}
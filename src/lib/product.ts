import { assetUrl } from './api'
import type { Product, Subcategory } from './types'

export function productImages(product: Product): string[] {
  const urls: string[] = []
  const thumb = assetUrl(product.thumbnail_url)
  if (thumb) urls.push(thumb)
  const rest = (product.image_urls ?? []).filter((u): u is string => Boolean(u)).map(assetUrl)
  for (const u of rest) {
    if (u && !urls.includes(u)) urls.push(u)
  }
  return urls
}

export function productCover(product: Product): string {
  return productImages(product)[0] ?? ''
}

export function productTag(product: Product): string {
  if (product.subcategory?.name) return product.subcategory.name
  return product.category?.name ?? ''
}

export function productSubcategorySlug(product: Product): string | null {
  return product.subcategory?.slug ?? null
}

export function subcategoryImage(sub: Subcategory): string {
  return assetUrl(sub.image ?? sub.image_url ?? sub.thumbnail_url ?? sub.icon ?? '')
}

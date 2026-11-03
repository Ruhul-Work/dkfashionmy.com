import type { Category, PagedProducts, PaginationMeta, Product, Product3DActive, ProductDetail, ProductSort, WebsiteSettings } from './types'

const rawBase = import.meta.env.VITE_API_URL ?? ''
export const API_BASE = rawBase.replace(/\/+$/, '')

export const ASSET_ORIGIN = (() => {
  if (!API_BASE) return ''
  try {
    const url = new URL(API_BASE)
    return `${url.origin}${url.pathname.replace(/\/api\/?$/, '')}`
  } catch {
    return ''
  }
})()

export function assetUrl(url?: string | null): string {
  if (!url) return ''
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url
  return `${ASSET_ORIGIN}/${url.replace(/^\/+/, '')}`
}

export interface ProductQuery {
  page?: number
  per_page?: number
  search?: string
  category?: string
  subcategory?: string
  sort_by?: ProductSort
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  if (!API_BASE) throw new ApiError('API base URL is not configured', 0)
  const res = await fetch(`${API_BASE}${path}`, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status)
  return (await res.json()) as T
}

type Envelope<T> = {
  success?: boolean
  data?: T
  meta?: PaginationMeta
}

function extractList<T>(json: Envelope<unknown>): { items: T[]; meta: PaginationMeta | null } {
  const payload = (json.data ?? json) as unknown
  if (Array.isArray(payload)) {
    return { items: payload as T[], meta: json.meta ?? null }
  }
  const nested = payload as { data?: T[] } | null
  const items = Array.isArray(nested?.data) ? nested.data : []
  const meta = (payload as { meta?: PaginationMeta })?.meta ?? json.meta ?? null
  return { items, meta }
}

export async function fetchProducts(query: ProductQuery, signal?: AbortSignal): Promise<PagedProducts> {
  const params = new URLSearchParams()
  const set = (key: string, value: unknown) => {
    if (value !== undefined && value !== null && `${value}` !== '') params.set(key, `${value}`)
  }
  const perPage = query.per_page ?? 12
  set('page', query.page ?? 1)
  set('per_page', perPage)
  set('search', query.search?.trim())
  set('category', query.category)
  set('subcategory', query.subcategory)
  set('sort_by', query.sort_by)
  const qs = params.toString()
  const json = await request<Envelope<unknown>>(`/products${qs ? `?${qs}` : ''}`, signal)
  const { items, meta } = extractList<Product>(json)
  return { items, meta }
}

export function hasMore(paged: PagedProducts, perPage: number): boolean {
  if (paged.meta) return paged.meta.current_page < paged.meta.last_page
  return paged.items.length >= perPage
}

export async function fetchProduct(slug: string, signal?: AbortSignal): Promise<ProductDetail> {
  const json = await request<Envelope<Product>>(`/products/${encodeURIComponent(slug)}`, signal)
  if (!json.data) throw new ApiError('Product not found', 404)
  return json.data
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const json = await request<Envelope<Category[]>>(`/categories`, signal)
  const { items } = extractList<Category>(json)
  return items
}

export async function fetchWebsiteSettings(signal?: AbortSignal): Promise<WebsiteSettings | null> {
  try {
    const json = await request<Envelope<WebsiteSettings>>(`/website-settings`, signal)
    return (json.data ?? null) as WebsiteSettings | null
  } catch {
    return null
  }
}

export async function fetch3DActiveProducts(signal?: AbortSignal): Promise<Product3DActive[]> {
  const json = await request<Envelope<Product3DActive[]>>(`/products/3d-active`, signal)
  const { items } = extractList<Product3DActive>(json)
  return items
}

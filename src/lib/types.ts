export interface Subcategory {
  id: string | number
  name: string
  slug: string
  is_active?: string | boolean | null
  image?: string | null
  image_url?: string | null
  thumbnail_url?: string | null
  icon?: string | null
}

export interface Category {
  id: string | number
  name: string
  slug: string
  is_active?: string | boolean | null
  icon?: string | null
  image?: string | null
  subcategories: Subcategory[] | null
}

export interface ProductColor {
  id: string | number
  name: string
  hex: string
}

export interface ProductSize {
  id: string | number
  name: string
  code: string
}

export interface Product {
  id: string | number
  name: string
  slug: string
  sku?: string | null
  has_variants?: string | boolean | null
  is_active?: string | boolean | null
  price: string | number
  mrp?: string | number | null
  shopee_url?: string | null
  thumbnail_url?: string | null
  image_urls?: Array<string | null> | null
  category?: Category | null
  subcategory?: Subcategory | null
  color?: ProductColor | null
  size?: ProductSize | null
}

export interface Product3DActive extends Product {
  front_view_url?: string | null
  back_view_url?: string | null
  side_view_url?: string | null
  '3d_active'?: boolean | number | null
}

export interface ProductDetail extends Product {
  short_description?: string | null
  description?: string | null
  material?: string | null
  size_chart_url?: string | null
  children?: Product[] | null
  specifications?: ProductsSpecificationMap | null
}

export type ProductsSpecificationMap = {
  material?: string | null
  weight_gsm?: string | null
  fabric_type?: string | null
  origin_country?: string | null
  fabric_weave?: string | null
  care_instructions?: string | null
  durability_rating?: string | null
  transparency_text?: string | null
} & Record<string, string | null | undefined>

export type ProductSort = 'latest' | 'oldest' | 'price_asc' | 'price_desc'

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface WebsiteSettings {
  company_name?: string
  currency_code?: string
  logo?: string | null
  [key: string]: unknown
}

export interface PagedProducts {
  items: Product[]
  meta: PaginationMeta | null
}

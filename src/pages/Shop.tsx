import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { fetchProducts, hasMore } from '../lib/api'
import { useCategories, useDebouncedValue } from '../lib/hooks'
import type { PaginationMeta, Product, ProductSort } from '../lib/types'
import ProductCard from '../components/ProductCard'
import FilterPanel from '../components/FilterPanel'
import SortSelect from '../components/SortSelect'
import EmptyState from '../components/EmptyState'
import { SkeletonCard } from '../components/Skeletons'
import { SectionHeading } from '../components/motion-kit'
import { lenisStop, lenisStart } from '../components/SmoothScroll'

const easeSoft: [number, number, number, number] = [0.22, 0.61, 0.36, 1]
const PER_PAGE = 9

const chipBase =
  'inline-flex items-center gap-2 rounded-full border border-hairline bg-ivory px-3.5 py-1.5 text-xs text-moss transition-colors hover:border-caramel hover:text-caramel-deep'

function Chip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className={chipBase}>
      <span className="h-1.5 w-1.5 rounded-full bg-caramel" aria-hidden />
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="text-olive transition-colors hover:text-caramel-deep"
      >
        ✕
      </button>
    </span>
  )
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const categorySlug = params.get('category')
  const subcategorySlug = params.get('subcategory')
  const searchParam = params.get('search') ?? ''
  const sort = ((params.get('sort') ?? 'latest') as ProductSort)

  const { data: categories, loading: catLoading, error: catError, reload: reloadCategories } = useCategories()

  const [items, setItems] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [moreError, setMoreError] = useState('')
  const [tick, setTick] = useState(0)

  const [searchDraft, setSearchDraft] = useState(searchParam)
  const debouncedSearch = useDebouncedValue(searchDraft, 300)

  const queryKey = useMemo(
    () => JSON.stringify({ categorySlug, subcategorySlug, searchParam, sort }),
    [categorySlug, subcategorySlug, searchParam, sort],
  )

  useEffect(() => {
    setSearchDraft(searchParam)
  }, [searchParam])

  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        if (debouncedSearch.trim()) next.set('search', debouncedSearch.trim())
        else next.delete('search')
        return next
      })
    }
  }, [debouncedSearch, searchParam, setParams])

  useEffect(() => {
    setLoading(true)
    setError('')
    const ac = new AbortController()
    fetchProducts(
      { page: 1, per_page: PER_PAGE, category: categorySlug ?? undefined, subcategory: subcategorySlug ?? undefined, search: searchParam || undefined, sort_by: sort },
      ac.signal,
    )
      .then((data) => {
        setItems(data.items)
        setMeta(data.meta)
        setLoading(false)
      })
      .catch((err) => {
        if (ac.signal.aborted) return
        setItems([])
        setMeta(null)
        setError(err?.message ?? 'Something went wrong')
        setLoading(false)
      })
    return () => ac.abort()
  }, [queryKey, tick, categorySlug, subcategorySlug, searchParam, sort])

  const canLoadMore = hasMore({ items, meta }, PER_PAGE)

  const loadMore = useCallback(() => {
    if (!canLoadMore || loadingMore) return
    const next = (meta?.current_page ?? 1) + 1
    setLoadingMore(true)
    setMoreError('')
    fetchProducts({
      page: next,
      per_page: PER_PAGE,
      category: categorySlug ?? undefined,
      subcategory: subcategorySlug ?? undefined,
      search: searchParam || undefined,
      sort_by: sort,
    })
      .then((data) => {
        setItems((prev) => [...prev, ...data.items])
        setMeta(data.meta)
        setLoadingMore(false)
      })
      .catch((err) => {
        setMoreError(err?.message ?? 'Something went wrong')
        setLoadingMore(false)
      })
  }, [canLoadMore, loadingMore, meta, categorySlug, subcategorySlug, searchParam, sort])

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(patch).forEach(([key, value]) => {
          if (value === null || value === '') next.delete(key)
          else next.set(key, value)
        })
        return next
      })
    },
    [setParams],
  )

  const setCategory = useCallback(
    (slug: string | null) => {
      updateParams({ category: slug, subcategory: null })
    },
    [updateParams],
  )
  const setSubcategory = useCallback(
    (slug: string | null) => {
      updateParams({ subcategory: slug })
    },
    [updateParams],
  )
  const setSearch = useCallback((value: string) => setSearchDraft(value), [])
  const setSort = useCallback((value: ProductSort) => updateParams({ sort: value }), [updateParams])
  const clearAll = useCallback(
    () => updateParams({ category: null, subcategory: null, search: null }),
    [updateParams],
  )

  const activeCategory = categories.find((c) => c.slug === categorySlug) ?? null
  const activeSubcategory =
    activeCategory?.subcategories?.find((s) => s.slug === subcategorySlug) ?? null

  const activeCount = [categorySlug, subcategorySlug, searchParam].filter(Boolean).length
  const total = meta?.total ?? items.length
  const empty = !loading && !error && items.length === 0

  const [drawerOpen, setDrawerOpen] = useState(false)
  useEffect(() => {
    if (!drawerOpen) return
    lenisStop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lenisStart()
    }
  }, [drawerOpen])

  const panel = (
    <FilterPanel
      categories={categories}
      loading={catLoading}
      error={catError}
      onRetry={reloadCategories}
      activeCategory={categorySlug}
      activeSubcategory={subcategorySlug}
      onCategory={setCategory}
      onSubcategory={setSubcategory}
      search={searchDraft}
      onSearch={setSearch}
    />
  )

  return (
    <main className="pt-36">
      <section className="mx-auto max-w-6xl px-4 pb-12 lg:px-8">
        <SectionHeading
          eyebrow="The Shop"
          title="Every piece, one shelf"
          accentWords={['shelf']}
          align="left"
        />
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-olive">
          <AnimatePresence mode="wait">
            <motion.span
              key={total}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: easeSoft }}
            >
              {loading ? 'Counting the shelf…' : `${total} ${total === 1 ? 'piece' : 'pieces'}`}
            </motion.span>
          </AnimatePresence>
          {searchParam && <span aria-hidden>·</span>}
          {searchParam && (
            <span className="font-display italic text-caramel-deep">“{searchParam}”</span>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden self-start lg:sticky lg:top-32 lg:block">
            <div className="rounded-[1.6rem] border border-hairline bg-ivory p-6 shadow-soft">{panel}</div>
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-full border border-hairline bg-ivory px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-moss shadow-soft transition-colors hover:border-caramel hover:text-caramel-deep lg:hidden"
              >
                Filters
                {activeCount > 0 && (
                  <span className="rounded-full bg-caramel px-1.5 text-[10px] font-bold text-ivory">{activeCount}</span>
                )}
              </button>
              <div className="lg:ml-auto">
                <SortSelect value={sort} onChange={setSort} />
              </div>
            </div>

            {activeCount > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {categorySlug && (
                  <Chip
                    label={activeCategory?.name ?? categorySlug}
                    onRemove={() => setCategory(null)}
                  />
                )}
                {subcategorySlug && (
                  <Chip
                    label={activeSubcategory?.name ?? subcategorySlug}
                    onRemove={() => setSubcategory(null)}
                  />
                )}
                {searchParam && <Chip label={`Search: “${searchParam}”`} onRemove={() => updateParams({ search: null })} />}
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs uppercase tracking-[0.18em] text-olive transition-colors hover:text-caramel-deep"
                >
                  Clear all
                </button>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-3 lg:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {error && !loading && (
              <EmptyState
                title="The shelf slipped"
                hint={error}
                actionLabel="Try again"
                onAction={() => setTick((t) => t + 1)}
              />
            )}

            {empty && !error && (
              <EmptyState
                title="Nothing here yet"
                hint="This corner of the shelf is empty. Try clearing a filter or browse everything."
                actionLabel="Clear filters"
                onAction={clearAll}
              />
            )}

            {!loading && !error && !empty && (
              <>
                <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-3 lg:gap-8">
                  {items.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} stepped={false} />
                  ))}
                </div>

                {moreError && (
                  <p className="mt-6 text-center text-sm text-olive">
                    {moreError} —{' '}
                    <button onClick={loadMore} className="text-caramel-deep underline underline-offset-4">
                      try again
                    </button>
                  </p>
                )}

                {canLoadMore && (
                  <div className="mt-14 flex justify-center">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loadingMore}
                      data-cursor="hover"
                      className="inline-flex items-center gap-2 rounded-full border border-hairline bg-ivory px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-moss shadow-soft transition-all duration-300 hover:border-caramel hover:text-caramel-deep disabled:opacity-60"
                    >
                      {loadingMore ? 'Bringing more…' : 'Load more'}
                    </button>
                  </div>
                )}

                {!canLoadMore && items.length > PER_PAGE && (
                  <p className="mt-14 text-center text-xs uppercase tracking-[0.24em] text-olive/70">
                    That is the whole shelf
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shop filters"
          >
            <div className="absolute inset-0 bg-moss/40 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)} />
            <motion.div
              className="absolute inset-x-0 bottom-0 max-h-[82svh] overflow-y-auto rounded-t-[2rem] border-t border-hairline bg-ivory p-6 pb-10 shadow-lift"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.45, ease: easeSoft }}
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-display text-xl">Filters</p>
                <button
                  type="button"
                  aria-label="Close filters"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {panel}
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="mt-8 w-full rounded-full bg-moss px-6 py-4 text-sm font-medium text-ivory transition-colors hover:bg-caramel-deep"
              >
                Show {total} {total === 1 ? 'piece' : 'pieces'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

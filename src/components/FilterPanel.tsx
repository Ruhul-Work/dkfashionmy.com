import { AnimatePresence, motion } from 'framer-motion'
import type { Category } from '../lib/types'

const easeSoft: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

export default function FilterPanel({
  categories,
  loading,
  error,
  onRetry,
  activeCategory,
  activeSubcategory,
  onCategory,
  onSubcategory,
  search,
  onSearch,
}: {
  categories: Category[]
  loading: boolean
  error: string
  onRetry: () => void
  activeCategory: string | null
  activeSubcategory: string | null
  onCategory: (slug: string | null) => void
  onSubcategory: (slug: string | null) => void
  search: string
  onSearch: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="shop-filter-search" className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-olive">
          Search within results
        </label>
        <input
          id="shop-filter-search"
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="e.g. cargo"
          className="w-full rounded-full border border-hairline bg-ivory px-4 py-3 text-sm text-moss outline-none transition-colors placeholder:text-olive/50 focus:border-caramel"
        />
      </div>

      <div>
        <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-olive">Categories</p>
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 w-3/4 animate-pulse rounded bg-sand" />
            ))}
          </div>
        )}
        {error && !loading && (
          <div>
            <p className="text-sm text-olive">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 rounded-full border border-hairline px-4 py-2 text-xs uppercase tracking-[0.18em] text-moss transition-colors hover:border-caramel"
            >
              Try again
            </button>
          </div>
        )}
        <ul className="flex flex-col">
          {!loading && !error && (
            <>
              <li>
                <button
                  type="button"
                   onClick={() => {
                     onCategory(null)
                   }}
                  aria-pressed={!activeCategory}
                  className={`w-full border-b border-hairline/60 py-3 text-left text-sm transition-colors ${
                    !activeCategory ? 'font-semibold text-caramel-deep' : 'text-moss hover:text-caramel-deep'
                  }`}
                >
                  All pieces
                </button>
              </li>
              {categories.map((cat) => {
                const subs = cat.subcategories ?? []
                const selected = activeCategory === cat.slug
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onCategory(selected ? null : cat.slug)
                      }}
                      aria-pressed={selected}
                      className={`w-full border-b border-hairline/60 py-3 text-left text-sm transition-colors ${
                        selected ? 'font-semibold text-caramel-deep' : 'text-moss hover:text-caramel-deep'
                      }`}
                    >
                      {cat.name}
                    </button>
                    <AnimatePresence initial={false}>
                      {selected && subs.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: easeSoft }}
                          className="overflow-hidden"
                        >
                          <ul className="flex flex-col gap-1 pb-3 pt-1 pl-4">
                            {subs.map((sub) => (
                              <li key={sub.id}>
                                <button
                                  type="button"
                                  onClick={() => onSubcategory(activeSubcategory === sub.slug ? null : sub.slug)}
                                  aria-pressed={activeSubcategory === sub.slug}
                                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                                    activeSubcategory === sub.slug
                                      ? 'border-caramel bg-caramel text-ivory'
                                      : 'border-hairline bg-sand/60 text-moss hover:border-caramel hover:text-caramel-deep'
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${activeSubcategory === sub.slug ? 'bg-ivory' : 'bg-caramel'}`}
                                    aria-hidden
                                  />
                                  {sub.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

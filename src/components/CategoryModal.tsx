import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCategories } from '../lib/hooks'
import { subcategoryImage } from '../lib/product'
import { assetUrl } from '../lib/api'
import { lenisStop, lenisStart } from './SmoothScroll'

const easeSoft: [number, number, number, number] = [0.22, 0.61, 0.36, 1]
const easeExpo: [number, number, number, number] = [0.22, 1, 0.36, 1]

function shopLink(categorySlug: string | null, subSlug: string | null): string {
  const params = new URLSearchParams()
  if (categorySlug) params.set('category', categorySlug)
  if (subSlug) params.set('subcategory', subSlug)
  return `/shop${params.toString() ? `?${params.toString()}` : ''}`
}

export default function CategoryModal({
  open,
  onClose,
  mobile = false,
}: {
  open: boolean
  onClose: () => void
  mobile?: boolean
}) {
  const { data: categories, loading, error, reload } = useCategories()
  const [active, setActive] = useState<number>(0)
  const [expanded, setExpanded] = useState<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    lenisStop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const first = panelRef.current?.querySelector<HTMLElement>('a, button')
    first?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      lenisStart()
    }
  }, [open, onClose])

  const current = categories[active]

  if (mobile) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex flex-col bg-ivory"
            role="dialog"
            aria-modal="true"
            aria-label="Browse categories"
          >
            <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4 sm:px-8">
              <p className="text-[10px] uppercase tracking-[0.24em] text-olive">Categories</p>
              <button
                type="button"
                aria-label="Close categories"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-16 sm:px-8">
              {loading && <p className="py-10 text-sm text-olive">Gathering the shelves…</p>}
              {error && (
                <div className="py-10">
                  <p className="text-sm text-olive">{error}</p>
                  <button onClick={reload} className="mt-3 rounded-full border border-hairline px-4 py-2 text-xs uppercase tracking-[0.18em]">
                    Try again
                  </button>
                </div>
              )}
              {categories.map((cat, i) => {
                const subs = cat.subcategories ?? []
                const isOpen = expanded === i
                return (
                  <div key={cat.id} className="border-b border-hairline">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-caramel" aria-hidden />
                  <span className="font-display text-3xl text-moss sm:text-4xl">{cat.name}</span>
                      {subs.length > 0 && (
                        <motion.span
                          className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline text-caramel-deep"
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.35, ease: easeSoft }}
                        >
                          +
                        </motion.span>
                      )}
                      {subs.length === 0 && (
                        <span className="ml-auto text-lg text-caramel-deep" aria-hidden>
                          →
                        </span>
                      )}
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && subs.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: easeSoft }}
                          className="overflow-hidden"
                        >
                          <ul className="flex flex-wrap gap-2 pb-5 pl-9">
                            {subs.map((sub) => (
                              <li key={sub.id}>
                                <Link
                                  to={shopLink(cat.slug, sub.slug)}
                                  onClick={onClose}
                                  data-cursor="hover"
                                  className="inline-flex items-center gap-2 rounded-full border border-hairline bg-sand/70 px-4 py-2 text-sm text-moss transition-colors hover:border-caramel hover:text-caramel-deep"
                                >
                                  {subcategoryImage(sub) ? (
                                    <span className="h-5 w-5 overflow-hidden rounded-full img-fallback">
                                      <img src={subcategoryImage(sub)} alt="" className="h-full w-full object-cover" loading="lazy" />
                                    </span>
                                  ) : (
                                    <span className="h-1.5 w-1.5 rounded-full bg-caramel" aria-hidden />
                                  )}
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {isOpen && subs.length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-5 pl-9">
                        <Link
                          to={shopLink(cat.slug, null)}
                          onClick={onClose}
                          className="inline-flex items-center gap-2 rounded-full border border-hairline bg-sand/70 px-4 py-2 text-sm text-moss transition-colors hover:border-caramel hover:text-caramel-deep"
                        >
                          Browse all {'→'}
                        </Link>
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[54]"
          role="dialog"
          aria-modal="true"
          aria-label="Browse categories"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-moss/20 backdrop-blur-[2px]" />
          <motion.div
            ref={panelRef}
            className="absolute inset-x-0 top-0 z-0 border-b border-hairline bg-ivory shadow-lift"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: easeSoft }}
          >
            <div className="mx-auto max-w-6xl px-4 pb-10 pt-32 sm:px-8">
              <div className="flex items-center justify-between pb-4">
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-eucalyptus-deep">The shop · Categories</p>
                <button
                  type="button"
                  aria-label="Close categories"
                  onClick={onClose}
                  data-cursor="hover"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline transition-colors hover:border-caramel hover:text-caramel-deep"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loading && <p className="py-12 text-sm text-olive">Gathering the shelves…</p>}
              {error && (
                <div className="py-12">
                  <p className="text-sm text-olive">{error}</p>
                  <button onClick={reload} className="mt-3 rounded-full border border-hairline px-4 py-2 text-xs uppercase tracking-[0.18em]">
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && categories.length > 0 && (
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <ul className="flex flex-col">
                    {categories.map((cat, i) => (
                      <motion.li
                        key={cat.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, duration: 0.45, ease: easeExpo }}
                      >
                        <div
                          onMouseEnter={() => setActive(i)}
                          onFocus={() => setActive(i)}
                          className={`group flex w-full items-baseline gap-4 border-b border-hairline/70 py-3 text-left transition-colors ${
                            active === i ? 'text-caramel-deep' : 'text-moss hover:text-caramel-deep'
                          }`}
                        >
                          <Link
                            to={shopLink(cat.slug, null)}
                            onClick={onClose}
                            data-cursor="hover"
                            className="flex items-center gap-3"
                          >
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 ${
                                active === i ? 'scale-125 bg-caramel' : 'bg-olive/40 group-hover:bg-caramel'
                              }`}
                              aria-hidden
                            />
                            <span className="font-display text-2xl transition-transform duration-500 group-hover:translate-x-1 lg:text-3xl">
                              {cat.name}
                            </span>
                          </Link>
                          <span
                            className={`ml-auto text-olive/60 transition-opacity ${active === i ? 'opacity-100' : 'opacity-0'}`}
                            aria-hidden
                          >
                            {(cat.subcategories ?? []).length > 0 ? '·' : '→'}
                          </span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    key={current?.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.4, ease: easeExpo }}
                    className="flex flex-col gap-5"
                  >
                    {current?.icon && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.45, ease: easeExpo }}
                        className="relative h-40 w-40 overflow-hidden rounded-2xl img-fallback shadow-soft"
                      >
                        <img
                          src={assetUrl(current.icon)}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-moss/60 to-transparent" />
                        <p className="absolute bottom-3 left-4 font-display text-xl text-ivory">
                          {current.name}
                        </p>
                      </motion.div>
                    )}
                    {(current?.subcategories ?? []).length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {(current.subcategories ?? []).map((sub, j) => (
                            <motion.div
                              key={sub.id}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.12 + j * 0.05, duration: 0.4, ease: easeSoft }}
                            >
                              <Link
                                to={shopLink(current.slug, sub.slug)}
                                onClick={onClose}
                                data-cursor="hover"
                                className="group flex items-center gap-2.5 rounded-2xl border border-hairline bg-ivory px-4 py-3 text-sm text-moss transition-all duration-300 hover:-translate-y-0.5 hover:border-caramel hover:bg-caramel hover:text-ivory"
                              >
                                {subcategoryImage(sub) ? (
                                  <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full img-fallback ring-1 ring-hairline/60">
                                    <img src={subcategoryImage(sub)} alt="" className="h-full w-full object-cover" loading="lazy" />
                                  </span>
                                ) : (
                                  <span className="h-3 w-3 shrink-0 rounded-full bg-caramel" aria-hidden />
                                )}
                                <span className="min-w-0 flex-1 truncate font-medium">{sub.name}</span>
                                <span className="text-olive transition-colors group-hover:text-ivory/80" aria-hidden>
                                  →
                                </span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                        <Link
                          to={shopLink(current.slug, null)}
                          onClick={onClose}
                          className="self-start text-xs uppercase tracking-[0.22em] text-olive transition-colors hover:text-caramel-deep"
                        >
                          Browse all {current.name.toLowerCase()} →
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={shopLink(current.slug, null)}
                        onClick={onClose}
                        data-cursor="hover"
                        className="inline-flex items-center gap-3 self-start rounded-full bg-moss px-6 py-3.5 text-sm text-ivory transition-colors hover:bg-caramel"
                      >
                        Browse all {current.name.toLowerCase()} →
                      </Link>
                    )}
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

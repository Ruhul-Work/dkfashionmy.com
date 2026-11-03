import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useDebouncedValue, useProducts } from '../lib/hooks'
import type { ProductQuery } from '../lib/api'
import { productCover, productTag } from '../lib/product'
import { money } from '../lib/pricing'
import { lenisStop, lenisStart } from './SmoothScroll'
import { SkeletonSearchRow } from './Skeletons'

const easeSoft: [number, number, number, number] = [0.22, 0.61, 0.36, 1]
const easeExpo: [number, number, number, number] = [0.22, 1, 0.36, 1]

function Highlight({ text, term }: { text: string; term: string }) {
  if (!term.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(term.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-caramel-deep">{text.slice(idx, idx + term.length)}</mark>
      {text.slice(idx + term.length)}
    </>
  )
}

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [term, setTerm] = useState('')
  const [cursor, setCursor] = useState(-1)
  const debounced = useDebouncedValue(term, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const enabled = open && debounced.trim().length >= 2
  const searchQuery = useMemo<ProductQuery | null>(
    () => (enabled ? { search: debounced.trim(), per_page: 6 } : null),
    [enabled, debounced],
  )
  const { data, loading } = useProducts(searchQuery)
  const results = useMemo(() => (enabled ? data.items : []), [enabled, data.items])

  useEffect(() => {
    if (!open) return
    lenisStop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => inputRef.current?.focus(), 60)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      lenisStart()
    }
  }, [open, onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (results.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setCursor((c) => (c + 1) % results.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setCursor((c) => (c <= 0 ? results.length - 1 : c - 1))
      } else if (e.key === 'Enter' && cursor >= 0 && results[cursor]) {
        e.preventDefault()
        navigate(`/product/${results[cursor].slug}`)
        onClose()
      }
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, cursor, navigate, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-moss/45 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search pieces"
          onClick={onClose}
        >
          <motion.div
            className="mx-auto w-full max-w-xl px-4 sm:px-0"
            style={{ marginTop: '18svh' }}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.4, ease: easeSoft }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-[2rem] border border-hairline bg-ivory shadow-lift">
              <div className="flex items-center gap-3 border-b border-hairline px-5 py-4 sm:px-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-olive">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  ref={inputRef}
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value)
                    setCursor(-1)
                  }}
                  placeholder="Search pieces…"
                  className="w-full bg-transparent font-display text-lg italic text-moss outline-none placeholder:text-olive/50 sm:text-xl"
                  aria-label="Search pieces"
                />
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline transition-colors hover:border-caramel hover:text-caramel-deep"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="max-h-[56svh] overflow-y-auto">
                {!enabled && (
                  <div className="flex flex-wrap items-center gap-2 px-5 py-5 text-sm text-olive sm:px-6">
                    <span>Try</span>
                    {['cargo pants', 'knit', 'tee'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTerm(s)}
                        data-cursor="hover"
                        className="rounded-full border border-hairline bg-sand/70 px-3 py-1.5 font-display italic text-moss transition-colors hover:border-caramel hover:text-caramel-deep"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {enabled && loading && (
                  <div className="divide-y divide-hairline/70 py-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonSearchRow key={i} />
                    ))}
                  </div>
                )}

                {enabled && !loading && results.length > 0 && (
                  <ul className="divide-y divide-hairline/70 py-1" role="listbox">
                    {results.map((p, i) => (
                      <motion.li
                        key={p.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.35, ease: easeExpo }}
                        className={cursor === i ? 'bg-sand/60' : ''}
                        role="option"
                        aria-selected={cursor === i}
                      >
                        <Link
                          to={`/product/${p.slug}`}
                          onClick={onClose}
                          onMouseEnter={() => setCursor(i)}
                          className="flex items-center gap-3 px-4 py-3 transition-colors sm:px-6"
                        >
                          {productCover(p) ? (
                            <img
                              src={productCover(p)}
                              alt=""
                              loading="lazy"
                              className="h-12 w-12 shrink-0 rounded-xl object-cover img-fallback"
                            />
                          ) : (
                            <span className="h-12 w-12 shrink-0 rounded-xl img-fallback" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-display text-[15px] text-moss">
                              <Highlight text={p.name} term={term} />
                            </span>
                            <span className="block text-[11px] uppercase tracking-[0.16em] text-olive">
                              {productTag(p) || 'DK Fashion'}
                            </span>
                          </span>
                          <span className="shrink-0 text-[13px] font-semibold text-caramel-deep">{money(p.price)}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {enabled && !loading && results.length === 0 && (
                  <div className="px-5 py-10 text-center sm:px-6">
                    <p className="font-display text-lg italic text-moss">No matches for “{term}”</p>
                    <p className="mt-1 text-sm text-olive">
                      Browse the full shelf instead —{' '}
                      <Link
                        to={`/shop?search=${encodeURIComponent(term.trim())}`}
                        onClick={onClose}
                        className="text-caramel-deep underline decoration-caramel/40 underline-offset-4 hover:text-caramel"
                      >
                        visit the shop →
                      </Link>
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-hairline">
                <Link
                  to={`/shop${term.trim() ? `?search=${encodeURIComponent(term.trim())}` : ''}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-olive transition-colors hover:bg-sand/60 hover:text-caramel-deep sm:px-6"
                >
                  View all results
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

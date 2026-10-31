import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchCategories, fetchProduct, fetchProducts, type ProductQuery } from './api'
import type { Category, PagedProducts, ProductDetail } from './types'

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])
  return debounced
}

interface AsyncState<T> {
  data: T
  loading: boolean
  error: string
}

let categoriesCache: Category[] | null = null

function useAbort() {
  const ref = useRef<AbortController | null>(null)
  const getFresh = useCallback(() => {
    ref.current?.abort()
    ref.current = new AbortController()
    return ref.current
  }, [])
  useEffect(() => () => ref.current?.abort(), [])
  return getFresh
}

export function useCategories() {
  const [state, setState] = useState<AsyncState<Category[]>>({
    data: categoriesCache ?? [],
    loading: !categoriesCache,
    error: '',
  })
  const [tick, setTick] = useState(0)
  const getFresh = useAbort()

  useEffect(() => {
    if (categoriesCache) return
    const ac = getFresh()
    setState((s) => ({ ...s, loading: true, error: '' }))
    fetchCategories(ac.signal)
      .then((items) => {
        categoriesCache = items
        setState({ data: items, loading: false, error: '' })
      })
      .catch((err) => {
        if (ac.signal.aborted) return
        setState({ data: [], loading: false, error: err?.message ?? 'Something went wrong' })
      })
    return () => ac.abort()
  }, [getFresh, tick])

  const reload = useCallback(() => {
    categoriesCache = null
    setTick((t) => t + 1)
  }, [])

  return { ...state, reload }
}

export function useProducts(query: ProductQuery | null) {
  const [state, setState] = useState<AsyncState<PagedProducts>>({
    data: { items: [], meta: null },
    loading: true,
    error: '',
  })
  const [tick, setTick] = useState(0)
  const getFresh = useAbort()

  useEffect(() => {
    if (!query) {
      setState((s) => ({ ...s, loading: false }))
      return
    }
    const ac = getFresh()
    setState((s) => ({ ...s, loading: true, error: '' }))
    fetchProducts(query, ac.signal)
      .then((data) => {
        if (ac.signal.aborted) return
        setState({ data, loading: false, error: '' })
      })
      .catch((err) => {
        if (ac.signal.aborted) return
        setState({ data: { items: [], meta: null }, loading: false, error: err?.message ?? 'Something went wrong' })
      })
    return () => ac.abort()
  }, [query, tick, getFresh])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}

export function useProduct(slug: string | undefined) {
  const [state, setState] = useState<AsyncState<ProductDetail | null>>({
    data: null,
    loading: true,
    error: '',
  })
  const [tick, setTick] = useState(0)
  const getFresh = useAbort()

  useEffect(() => {
    if (!slug) return
    const ac = getFresh()
    setState({ data: null, loading: true, error: '' })
    fetchProduct(slug, ac.signal)
      .then((data) => {
        if (ac.signal.aborted) return
        setState({ data, loading: false, error: '' })
      })
      .catch((err) => {
        if (ac.signal.aborted) return
        setState({ data: null, loading: false, error: err?.message ?? 'Product not found' })
      })
    return () => ac.abort()
  }, [slug, tick, getFresh])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}

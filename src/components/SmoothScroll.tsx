import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'

let lenis: Lenis | null = null

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el || !lenis) return
  lenis.scrollTo(el, { offset: -90, duration: 1.2 })
}

export function lenisGo(href: string) {
  if (lenis) lenis.scrollTo(href, { offset: -90, duration: 1.2 })
}

export function lenisStop() {
  lenis?.stop()
}

export function lenisStart() {
  lenis?.start()
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  useEffect(() => {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    let raf = 0
    const loop = (time: number) => {
      lenis?.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
  }, [pathname])

  return <>{children}</>
}

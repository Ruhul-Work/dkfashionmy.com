# DK Fashion Portfolio — "Soft Editorial" Edition (plan v2)

> Rebuilt for this project (`dk-my-protfolio3/`), not a subfolder. The old plan
> targeted `dk-fashion-light/`; that path is retired. Same brief: a modern,
> eye-catching, animated scrollytelling portfolio for the clothing brand
> **DK Fashion** — now calmer, softer, and more interactive.

## Goal
Hook users with rich scroll + hover interactivity, guide them down the page
with motion cues, keep a long purposeful home page, plus About and Contact pages.

---

## 1. Unique theme: "Calm Couture" (soft, soothing, editorial)

A print-lookbook feel softened further — think linen paper, morning light, sage
and sand tones. Distinct from typical fashion sites (no black luxe, no neon).

### Palette (soft, low-glare)
| Role | Color |
|---|---|
| Page base | `#FAF7F2` warm ivory |
| Alt surface / cards | `#F1EDE4` sand mist |
| Soft tint blocks | `#E7EDE6` pale sage |
| Accent | `#B98A6E` muted caramel (buttons, links, highlights) |
| Secondary accent | `#9DB0A1` eucalyptus (badges, tags) |
| Text primary | `#27302A` deep moss-charcoal |
| Text muted | `#6E7268` soft gray-olive |
| Borders/hairlines | `#E3DDD1` |

- Light, airy, generous whitespace; subtle paper-grain texture overlay (SVG noise, ~3% opacity)
- Soft large-radius cards (rounded-2xl/3xl), layered low-opacity shadows — no hard glass effects

### Type
- Display: **Fraunces** (soft editorial serif, variable optical size) for headlines
- Body/UI: **Outfit** for body, nav, buttons
- Italic Fraunces accents for editorial pull-quotes

---

## 2. Interactivity & motion system (modernized)

- **Smooth scroll**: `lenis` + `framer-motion` (package `motion`) throughout
- **Preloader**: brand monogram "DK" draws itself (SVG stroke), curtain lifts
- **Scroll progress**: slim caramel progress bar fixed at top
- **Section guide rail**: floating right-side dots — one per home section;
  active dot grows into a labeled pill; click smoothly scrolls (guides user)
- **Scroll-triggered reveals**: every section fades/slides up in `whileInView`
- **Image reveals**: clip-path wipe-up on scroll (curtain-reveal gallery feel)
- **Magnetic buttons**: CTA buttons subtly follow cursor within a radius
- **Custom cursor**: small dot + trailing ring; grows on interactive elements
  (desktop only, respects `prefers-reduced-motion`)
- **Hero**: split editorial layout — large Fraunces headline, image mosaic with
  auto-crossfade slider, scroll-linked parallax on images
- **Ticker marquees**: infinite loop, pause on hover
- **Categories**: horizontal auto-scroll carousel, draggable, hover-pause
- **Products**: mixed-size editorial grid; card tilt + quick-view reveal on hover
- **Counters**: stats animate up when scrolled into view
- **Testimonials**: auto-advancing quote carousel with drag
- **Parallax floats**: soft decorative shapes drift at different scroll speeds

### Stepped/choreographed animation (used deliberately, not everywhere)
- **Stepped reveals**: section content enters in staggered steps — e.g. hero
  headline reveals word-by-word in sequence, then eyebrow/tag, then image
  mosaic tiles one-by-one, then CTAs (chained `staggerChildren`, ~60–90ms steps)
- **Stepped counters**: stats count in eased steps with a suffix flip, staggered
  per card rather than all at once
- **Stepped process timeline**: "The Making" steps animate one at a time —
  connector line draws to step 1, dot pulses, card lifts, then continues to
  step 2... (scroll-scrubbed, sequential)
- **Stepped ticker beats**: marquee text items spaced with dot separators that
  pulse in a wave as the strip scrolls
- **Stepped FAQ open**: height+opacity+icon rotate animate in a fixed beat
  sequence for consistent feel
- **Section handoffs**: each section starts on an odd beat — alternate
  left/right entry direction and fade-only vs slide-only so the page rhythm
  doesn't feel uniform

## 3. New purposeful sections (added vs v1)

- **"The Making" process timeline** — 4 horizontal steps (Sourcing → Cutting →
  Stitching → Finishing) with animated connecting line drawn on scroll; gives
  the brand story depth and a natural mid-page rest point
- **FAQ accordion** — fabric care, sizing, orders, shipping; interactive expand/
  collapse keeps users engaged near the contact point
- **Notify form** (email capture) inside the big Coming-Soon banner (kept, restyled)
- **Address/contact strip + footer** with big outlined wordmark marquee

## 4. E-commerce Coming Soon banner (kept from v1)
Full-width angled sage-tinted banner, animated pulsing badge, "Notify Me"
email capture with success state. Portfolio only — no functional shop.

## 5. Image standard (kept from v1)
Clean imagery only: garments, fabric textures, flat-lays, store interiors,
full-silhouette / modest editorial shots. Unsplash + graceful gradient fallback.

---

## Tech stack
- Vite + React 19 + TypeScript (already scaffolded here)
- `react-router-dom` (Home / About / Contact)
- `framer-motion` + `lenis` + `tailwindcss` v4 (`@tailwindcss/vite`)
- Fonts via Google Fonts (Fraunces + Outfit)

## Home page section order
1. Preloader (first visit only)
2. Slim announcement bar + navbar (sticky, minimizes on scroll)
3. Hero — split editorial + auto-rotating mosaic slider
4. Text ticker marquee
5. Categories carousel
6. Products editorial grid (hover quick-view)
7. **The Making** — process timeline (new)
8. E-commerce Coming Soon banner (big highlight)
9. Brand qualities — alternating rows with sticky progress
10. Lookbook auto-marquee
11. Stats + testimonials carousel
12. FAQ accordion (new)
13. Address / contact strip
14. Footer with wordmark marquee

*(Side dot-rail tracks sections 3–12.)*

## Pages
- **Home**: everything above
- **About**: story, values, small gallery, same type/theme
- **Contact**: form, FAQ excerpt, map placeholder, socials

## Status
- [x] Project scaffolded (`dk-my-protfolio3/`) — Vite react-ts
- [x] Base `npm install` done
- [x] Install deps: `react-router-dom`, `framer-motion`, `lenis`, `tailwindcss`, `@tailwindcss/vite`
- [x] Implement theme + sections (build phase)
- [x] Build + verify (`npm run build` passes, preview serves 200)

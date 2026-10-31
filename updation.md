# Updation.md — DK Fashion: from static portfolio → dynamic catalog showcase

> Status: **analysis / plan only — not yet built.** Awaiting approval.
> Every change below is designed to blend with the existing "Calm Couture" theme
> (ivory/sand/sage base, caramel accent, Fraunces + Outfit, curtain reveals,
> staggered motion, soft shadows & large radii). No new colors, no new fonts.

---

## 1. The big picture

Today the site is a **static portfolio**: products, categories, prices are all
hardcoded arrays inside `HomeTop.tsx` / `HomeMarket.tsx`, and the brand story
says "e-commerce coming soon".

The new reality:

- Products & categories come from a **backend API** (read-only, public).
- The site **displays** products but **does not sell** them. There is no cart,
  no checkout. Instead, each product carries a **Shopee link**, and the buy
  action is a button that opens that link in a new tab.
- New pages: **Shop** (browse / search / filter) and **Product detail**
  (gallery, price, discount, description, specifications, recommended).
- New navbar features: **Category mega-modal**, **Shop link**, **search icon →
  live search modal**.
- Footer credits: **"Developed by Bintel Future Tech"** (with URL).

What **stays exactly as it is**: Preloader, custom cursor, Lenis smooth scroll,
scroll progress bar, section dot-rail, hero video, ticker, "The Making",
Lookbook, stats/testimonials, FAQ, contact strip — the editorial soul of the
site is untouched.

---

## 2. Data layer (new)

New folder `src/lib/`:

- `types.ts` — shared TypeScript types
- `api.ts` — tiny fetch wrapper (base URL from `VITE_API_URL` env, JSON,
  AbortController support, no extra libraries)
- `hooks.ts` — `useDebounce`, `useFetch`-style hooks with `loading / error /
  retry`

### Assumed shapes (⚠ to confirm with the backend)

```ts
Category    { id, name, slug, image, subcategories: Subcategory[] }
Subcategory { id, name, slug, image }
Product {
  id, name, slug, description,
  price, discount_price,              // original price shown struck-through
  images: string[],                   // 1..n, first = cover
  specifications: { key, value }[],   // rendered as hairline key-value rows
  shopee_url,                         // the one true "buy" button
  category, subcategory,              // name + slug for chips / breadcrumbs
  created_at                          // powers "latest / oldest" sorting
}
```

### Assumed endpoints (⚠ to confirm)

| Endpoint | Used by |
|---|---|
| `GET /api/categories` | Category modal, Collections section, shop filters |
| `GET /api/products?search&category&subcategory&min_price&max_price&sort&page&per_page` | Shop grid, live search |
| `GET /api/products/:slug` | Product detail page |
| `GET /api/products?sort=newest&limit=…` | New Arrivals section |
| Random pick (backend or client-side shuffle of latest list) | Popular section |

Loading states are first-class: **skeleton cards** (sand-colored shimmer,
same shapes as real cards) so the layout never jumps; soft error states with a
"Try again" button, in-theme. Requests are cached in memory for the session
where it makes sense (categories), aborted when stale (search).

---

## 3. Navbar (updates inside existing `Chrome.tsx`)

Keep the current structure (left links · centered logo · right status + Call
pill) and extend it:

- **Links become:** Home · **Shop** · About · Contact.
- **"Category" trigger** — a pill/button that opens the **Category modal**
  (see §4).
- **Search icon** (magnifier, hairline-border round button) on the right —
  desktop and mobile — opens the **Search modal** (see §5).
- **Mobile full-screen menu** gains the same entries: Shop link, Category
  (opens the same modal), and the search icon row.
- Announcement bar copy changes from *"E-commerce launching soon"* to
  *"Shop our pieces on Shopee"* (the old message is now contradictory).
  Navbar status chip "E-shop soon" → "Shop on Shopee" or similar.

The "Category" and search buttons reuse the existing chip styles
(`border-hairline` / `bg-moss text-ivory`), with `data-cursor="hover"` so the
custom cursor reacts.

---

## 4. Category modal (mega-menu style)

A modal-like overlay, opened from the navbar — designed like the rest of the
site, not like a generic dropdown:

- **Desktop:** full-width panel dropping from under the navbar (ivory, blurred
  backdrop over the page, hairline bottom border). Left column lists
  **categories** in large Fraunces type with numbering (`01`, `02`…). Hovering
  / selecting a category shows its **subcategories** on the right as pill
  links or a small grid; if the category also has an image, a soft-edged
  preview image fades in. Categories **without subcategories** simply link
  straight to the shop filtered by that category.
- **Mobile:** accordion list — tapping a category expands its subcategories
  inline (chevron rotation, height animation, same beat as the FAQ accordion).
- Every subcategory navigates to `/shop?subcategory=<slug>` and closes the
  modal.
- Motion: panel slides down with the standard `easeSoft`; items stagger in.
  Esc key, close button, and backdrop click all close it; Lenis is stopped
  while open and restarted on close; focus is trapped inside.

---

## 5. Search modal (live results)

- Opens from the navbar search icon: a centered overlay card on a dimmed
  backdrop (same treatment as the mobile menu backdrop).
- Large input with an italic Fraunces placeholder — *"Search pieces…"* —
  autofocus on open.
- **Live search:** debounced (~300 ms) API calls from 2 characters; results
  appear as rows (thumbnail · name · category · price) and each row navigates
  to the product page. Highlight the matched substring in caramel.
- Footer row: *"View all results →"* → `/shop?search=<term>`.
- States: idle hint (e.g. "Try 'cargo pants'"), loading shimmer rows, "no
  matches" empty state with a suggestion to browse the shop. Esc / backdrop /
  ✕ closes; keyboard: ↑/↓ + Enter to pick a result.

---

## 6. Home page — section-by-section changes

| Section (current) | Change |
|---|---|
| Hero | Keep. Optional: primary CTA "Contact" → **"Shop the pieces" → /shop** (flagged for approval). |
| **Collections** (currently "Categories" carousel, hardcoded) | Now **displays all subcategories** fetched from the API, in the same draggable auto-drift shelf with curtain reveals and hover preview. Each tile links to `/shop?subcategory=<slug>`. Falls back to categories if a subcategory has no image. |
| Ticker | Unchanged. |
| **Pieces** (currently 12 hardcoded cards) | Fetch **max 9 products**, same editorial grid + hover info bar. Add a **"See more" button** (existing `CTAButton`, magnetic) centered below the grid → `/shop`. |
| **New Arrivals** | Fetch **newest products** from the API (sorted by `created_at`), same three-column drifting layout, "New" pulse tag kept. Cards now link to product pages. |
| **Popular** | **Random products** for now (backend random endpoint if available, else a client-side shuffle of a fetched batch, re-shuffled per visit). Rank numerals + wear-meter visual can stay as pure decoration, or the wear line becomes the discount tag — flagged for approval. |
| **ComingSoon banner** | Repurpose: it no longer makes sense to say "coming soon". Turn it into a **"Find us on Shopee"** banner — same sage panel, pulsing badge and shapes, but the email form is replaced by a "Visit our Shopee store" button (brand-level Shopee URL) + existing contact line. Flagged for approval. |
| Making / Qualities / Lookbook / Stats / FAQ / Contact strip | Unchanged (pure brand content). |
| Section dot-rail | Labels re-checked so they still match sections after the above. |

---

## 7. Shop page — `/shop` (new)

A new page that feels like a natural extension of the home sections:

- **Header:** editorial heading ("The Shop" / *"Every piece, one shelf"*),
  result count, and the current filter trail.
- **Layout:** sticky **filter sidebar** on desktop (left column, ~240px, same
  hairline-card language); on mobile it becomes a slide-up **drawer** behind a
  "Filters" pill button with a live count badge.
- **Filters:**
  - **Search within results** (text input).
  - **Categories** — list; selecting a category reveals its **subcategories**
    beneath it (indent + small pills or radio-style rows). Single-select keeps
    the UX simple; multi-select only if the API supports it (⚠ confirm).
  - **Price** — min/max inputs (and/or a dual-range slider), live-applied on
    debounce.
  - **Sort:** *Latest, Oldest, Price: low→high, Price: high→low* — rendered as
    a segmented pill row or a custom dropdown styled like the theme.
  - Optional extra: "On discount" toggle (only if API supports it).
- **Active filter chips** above the grid — each removable with a ✕, plus
  "Clear all".
- **Grid:** shared `ProductCard` (image with curtain reveal + hover shine,
  name, category tag, price with struck-through original and caramel discount
  price, discount badge in eucalyptus). Whole card links to the product page.
- **Pagination:** "Load more" button (matches the shop's calm rhythm better
  than page numbers); skeletons while loading.
- **URL sync:** filters live in query params (`/shop?category=…&subcategory=…&
  search=…&sort=…&min=…&max=…`) so filtered views are shareable, the back
  button works, and the Category modal / Collections tiles can deep-link
  directly into a pre-filtered shop.
- **Empty state:** soft illustration (fabric-swatch gradient block), "Nothing
  here yet" + reset button.

---

## 8. Product detail page — `/product/:slug` (new)

- **Top:** breadcrumb (Home · Shop · Category · Subcategory) and product name
  in large Fraunces.
- **Left — gallery:** main image (rounded-[2rem], soft shadow) + thumbnail
  rail; clicking a thumb crossfades the main image (framer-motion
  `AnimatePresence`, curtain feel). Arrows on mobile; swipe-friendly.
- **Right — details block:**
  - Category / subcategory chips (link to pre-filtered shop).
  - **Price row:** discounted price large in caramel-deep, original price
    struck-through in olive, **"−XX%" pill** in eucalyptus.
  - Short description paragraph.
  - **Specifications:** hairline key-value rows (label left, value right) —
    quiet, editorial, no boxy table borders.
  - **"Buy on Shopee"** — the primary CTA (caramel, magnetic, existing
    `CTAButton` pattern) with a small bag/arrow glyph; `target="_blank"
    rel="noreferrer"`. **No add-to-cart, no buy-now, no quantity, no cart
    anywhere.** Secondary quiet action: "Call to order" (WhatsApp link, as the
    navbar already does).
  - Small reassurance line under the CTA: e.g. "Secure checkout on Shopee ·
    Delivered nationwide".
- **Recommended section** at the bottom: *"You may also like"* — grid of
  products from the **same subcategory** (fallback: same category, fallback:
  latest), excluding the current product, using the shared `ProductCard`.
  Same 9-max + subtle "View all" → shop.
- Motion: details enter in a staggered beat (chip → name → price → CTA);
  gallery image gets the curtain reveal; recommended cards stagger in on
  scroll. Page scroll resets to top on navigation (Lenis already does this).

---

## 9. Footer (small change)

- Add a line, next to / under the existing copyright row:

  > © 2026 DK International Sdn. Bhd. — sewn with patience in Kuala Lumpur
  > **Developed by [Bintel Future Tech](URL)** *(link opens in new tab)*

  Styled quietly: `text-ivory/40`, hover → caramel, so it doesn't compete
  with the brand. ⚠ Need the actual URL.
- Footer "Navigate" column gains **Shop** (and maybe "Categories" → opens
  category modal or links to shop unfiltered).

---

## 10. New / modified files (planned)

```
src/
  lib/
    types.ts          # Category, Subcategory, Product, API types
    api.ts            # fetch wrapper + endpoint functions
    hooks.ts          # useDebounce, useFetch/useProducts/useCategories
  components/
    ProductCard.tsx   # shared card (home + shop + recommended)
    Skeletons.tsx     # card/row shimmer loaders
    Price.tsx         # price + strikethrough + discount badge
    CategoryModal.tsx # navbar mega-modal (desktop panel / mobile accordion)
    SearchModal.tsx   # live search overlay
    FilterPanel.tsx   # shop sidebar + mobile drawer content
    SortSelect.tsx
    EmptyState.tsx
  pages/
    Shop.tsx          # /shop
    ProductDetail.tsx # /product/:slug
  sections/
    HomeTop.tsx       # Categories → subcategory shelf; Products → 9 + See more
    HomeMarket.tsx    # NewArrivals & Popular → API-driven
    HomeBottom.tsx    # ComingSoon → "Find us on Shopee"; Footer credits
  components/Chrome.tsx # navbar links, category/search triggers, mobile menu
  App.tsx              # new routes, rail items, announcement copy
.env / .env.example    # VITE_API_URL
```

No new dependencies — everything is done with React 19, react-router 7,
framer-motion, lenis and Tailwind v4 that are already installed.

---

## 11. UX / polish checklist

- Modals: Esc closes, backdrop click closes, ✕ button, focus trapped, body
  scroll (Lenis) paused while open, `aria-expanded` / `aria-label` on
  triggers, `role="dialog"` + labels.
- All images: lazy-loaded with the existing `CurtainImage` / `SoftImage`
  fallback gradient so a missing product photo never breaks the layout.
- Skeletons before first paint of every API-driven section (no spinners, no
  layout shift).
- Prices formatted through one helper (`RM 69`, discount computed once).
- Every list has an empty state; every request an error+retry state.
- `prefers-reduced-motion` already respected globally via `MotionConfig` —
  kept for all new motion.
- Mobile-first checks: category modal accordion, search modal full-width,
  shop filters in drawer, product page gallery swipe, sticky "Buy on Shopee"
  bar on small screens (appears after scrolling past the main CTA).

---

## 12. Open questions (need answers before/while building)

1. **API base URL + endpoint shapes** — do the assumed endpoints/fields in §2
   match the backend (or is a different shape coming)? Pagination style?
   answer: http://localhost/admin.dkfashionmy.com/api its the base url and data may come in paginated form.
2. **Product identifier for the URL** — slug or id? (`/product/:slug` assumed.)
answer: slug is identifer
3. **Random/popular products** — backend random endpoint, or client-side
   shuffle okay "for now"?
   answer: client side suffle is enough for now
4. **Category image availability** for subcategories (for the Collections
   shelf) — every subcategory guaranteed to have an image?
   answer: yes
5. **Single- or multi-select** filters for category/subcategory?
answer: single
6. **Bintel Future Tech URL** for the footer credit.
answer: https://bintelfuturetech.com
7. Approve the copy changes: announcement bar, "Coming soon" → "Find us on
   Shopee" banner, hero CTA? 
   answer: approved

   ## 13. Api endpoint given by developer

   1. base_url/products -> to fetch all products in paginated form. it accepts url query like search,
      category, subcategory, sort_by= which can contain price_asc, price_desc, oldest, latest

      response structure
   {
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "sku": "string",
      "has_variants": "string",
      "is_active": "string",
      "price": "string",
      "mrp": "string",
      "shopee_url": "string",
      "thumbnail_url": "string",
      "image_urls": [
        null
      ],
      "category": {
        "id": "string",
        "name": "string",
        "slug": "string",
        "is_active": "string",
        "icon": "string",
        "subcategories": [
          {}
        ]
      },
      "color": {
        "id": "string",
        "name": "string",
        "hex": "string"
      },
      "size": {
        "id": "string",
        "name": "string",
        "code": "string"
      }
    }
  ]
}
   2. base_url/products/{slug} -> fetch single product details
   response structure
  {
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "sku": "string",
    "has_variants": "string",
    "is_active": "string",
    "short_description": "string",
    "description": "string",
    "material": "string",
    "price": "string",
    "mrp": "string",
    "shopee_url": "string",
    "thumbnail_url": "string",
    "image_urls": [
      null
    ],
    "size_chart_url": "string",
    "category": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "is_active": "string",
      "icon": "string",
      "subcategories": [
        {}
      ]
    },
    "children": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "sku": "string",
        "has_variants": "string",
        "is_active": "string",
        "price": "string",
        "mrp": "string",
        "thumbnail_url": "string",
        "image_urls": [
          null
        ],
        "category": {
          "id": "string",
          "name": "string",
          "slug": "string",
          "is_active": "string",
          "icon": "string",
          "subcategories": [
            {}
          ]
        },
        "color": {
          "id": "string",
          "name": "string",
          "hex": "string"
        },
        "size": {
          "id": "string",
          "name": "string",
          "code": "string"
        }
      }
    ],
    "specifications": {
      "material": "string",
      "weight_gsm": "string",
      "fabric_type": "string",
      "origin_country": "string",
      "fabric_weave": "string",
      "care_instructions": "string",
      "durability_rating": "string",
      "transparency_text": "string"
    }
  }
}

3. base_url/categories
response
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "is_active": "string",
      "icon": "string",
      "subcategories": [
        {}
      ]
    }
  ]
}
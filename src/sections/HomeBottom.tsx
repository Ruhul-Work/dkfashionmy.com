import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { CurtainImage, SectionHeading, Counter } from '../components/motion-kit'
import SoftImage from '../components/SoftImage'
import { lenisGo } from '../components/SmoothScroll'

const easeSoft: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

/* ---------------- THE MAKING (stepped process timeline) ---------------- */

const steps = [
  { n: '01', title: 'Sourcing', text: 'Yarn and cloth sourced from mills and weavers we can name and visit.', src: 'https://images.unsplash.com/photo-1544928142-8d38cae469ef?q=80&w=700&auto=format&fit=crop' },
  { n: '02', title: 'Cutting', text: 'Patterns cut by hand in small batches — never a mega-run.', src: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=700&auto=format&fit=crop' },
  { n: '03', title: 'Stitching', text: 'Sewn in our atelier by a team of nine on machines older than the roads.', src: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=700&auto=format&fit=crop' },
  { n: '04', title: 'Finishing', text: 'Pressed, checked twice, wrapped in paper — ready to be lived in.', src: 'https://images.unsplash.com/photo-1594938133356-41aceb152793?q=80&w=700&auto=format&fit=crop' },
]

export function Making() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px' })
  const [step, setStep] = useState(-1)

  useEffect(() => {
    if (!inView) return
    setStep(-1) /* restart the sequence each time it enters */
    const timers = steps.map((_, i) =>
      setTimeout(() => setStep(i), 500 + i * 750),
    )
    return () => timers.forEach(clearTimeout)
  }, [inView])

  return (
    <section id="making" className="py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="The making"
          title="One thread, four quiet steps"
          accentWords={['quiet']}
          className="mb-16"
        />
        <div ref={ref} className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* connecting line (chamfered top area) */}
          <motion.div
            className="absolute left-0 right-0 top-16 hidden h-px origin-left bg-hairline lg:block"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <motion.div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-hairline bg-ivory font-display text-sm lg:mx-0"
                animate={
                  step >= i
                    ? { borderColor: 'var(--color-caramel)', color: 'var(--color-caramel-deep)', scale: 1.08 }
                    : {}
                }
                transition={{ duration: 0.4 }}
              >
                {s.n}
              </motion.div>
              <motion.div
                className="mt-6 rounded-[1.4rem] border border-hairline bg-ivory p-6 shadow-soft"
                animate={
                  step >= i
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0.35, y: 14 }
                }
                transition={{ duration: 0.5, ease: easeSoft }}
              >
                <CurtainImage src={s.src} alt={s.title} className="mb-4 h-32 w-full rounded-xl" delay={step >= i ? 0.15 : 2} />
                <p className="font-display text-lg">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-olive">{s.text}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- SHOPEE BANNER ---------------- */

const SHOPEE_STORE_URL = import.meta.env.VITE_SHOPEE_URL ?? ''

export function ComingSoon() {
  return (
    <section id="soon" className="px-4 py-16 lg:px-8">
      <motion.div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-eucalyptus px-6 py-16 text-center shadow-lift sm:px-12"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, ease: easeSoft }}
      >
        {/* angled duotone shapes */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rotate-12 rounded-[3rem] bg-sage/70" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rotate-[24deg] rounded-[3rem] bg-sand/80" />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-8 h-24 w-24 rounded-full bg-caramel/20 blur-xl"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 3.4 }}
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          {/* pulsing badge */}
          <motion.span
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-moss shadow-soft"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
          >
            <motion.span
              className="h-2 w-2 rounded-full bg-caramel"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            Now on Shopee
          </motion.span>

          <h2 className="font-display text-3xl leading-tight sm:text-5xl">
            The shop is open, <em className="italic text-caramel-deep">on Shopee</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-moss/70">
            Every piece lives on our Shopee store now — same small batches,
            same traceable fabric, delivered nationwide with Shopee&apos;s
            protected checkout.
          </p>

          {SHOPEE_STORE_URL ? (
            <a
              href={SHOPEE_STORE_URL}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full bg-moss px-9 py-4 text-sm font-medium text-ivory shadow-soft transition-colors hover:bg-caramel-deep"
            >
              Visit our Shopee store
              <span aria-hidden className="text-lg leading-none">↗</span>
            </a>
          ) : (
            <a
              href="/shop"
              data-cursor="hover"
              className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full bg-moss px-9 py-4 text-sm font-medium text-ivory shadow-soft transition-colors hover:bg-caramel-deep"
            >
              Visit our Shopee store
              <span aria-hidden className="text-lg leading-none">↗</span>
            </a>
          )}

          <p className="mt-6 text-xs text-moss/70">
            Questions in the meantime?{' '}
            <a
              href="mailto:dkfashionkwc@gmail.com"
              className="underline decoration-caramel-deep/50 underline-offset-4 transition-colors hover:text-ivory"
            >
              dkfashionkwc@gmail.com
            </a>{' '}
            or call{' '}
            <a href="tel:+601137455473" className="underline decoration-caramel-deep/50 underline-offset-4 transition-colors hover:text-ivory">
              +60 11-3745 5473
            </a>
          </p>
        </div>
      </motion.div>
    </section>
  )
}

/* ---------------- BRAND QUALITIES (alternating rows, sticky progress) ---------------- */

const qualities = [
  {
    title: 'Traceable fabric',
    text: 'We buy from three mills and one weaving collective. If we cannot visit the source, it is not in the shop.',
    src: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=900&auto=format&fit=crop',
  },
  {
    title: 'Human hands only',
    text: 'Nine people make every piece. Machines cut nothing you wear; finishing is always by hand.',
    src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop',
  },
  {
    title: 'Honest pricing',
    text: 'No misleading discounts, no inflated tags. What you pay in June is what you pay in December.',
    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=900&auto=format&fit=crop',
  },
  {
    title: 'Repair for life',
    text: 'Bring back any DK piece, any year, and we will stitch it back to service — free, forever.',
    src: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=900&auto=format&fit=crop',
  },
]

export function Qualities() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 80%'] })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="qualities" className="bg-sage/50 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-4 lg:grid-cols-[220px_1fr] lg:px-8">
        {/* sticky progress column */}
        <div className="hidden lg:block">
          <div className="sticky top-1/2 -translate-y-1/2">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-eucalyptus-deep">
              Why DK
            </p>
            <div className="h-64 w-1 overflow-hidden rounded-full bg-hairline">
              <motion.div className="h-full w-full origin-top bg-caramel" style={{ scaleY }} />
            </div>
            <p className="mt-4 font-display text-sm italic text-olive">Scroll — it keeps count</p>
          </div>
        </div>

        <div ref={ref}>
          <div className="mb-12 lg:hidden">
            <SectionHeading eyebrow="Why DK" title="Four promises, kept daily" accentWords={['kept']} align="left" />
          </div>
          <div className="flex flex-col gap-20 lg:gap-28">
            {qualities.map((q, i) => (
              <div key={q.title} className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 1 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.65, ease: easeSoft }}
                >
                  <p className="mb-2 font-display text-sm italic text-caramel">0{i + 1}</p>
                  <h3 className="font-display text-2xl sm:text-3xl">{q.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-olive">{q.text}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.65, ease: easeSoft, delay: 0.12 }}
                >
                  <CurtainImage
                    src={q.src}
                    alt={q.title}
                    className="h-64 rounded-[1.8rem] shadow-soft lg:h-72"
                    imgClassName="hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- LOOKBOOK (auto-marquee, two rows opposite) ---------------- */

const lookbookA = [
  { src: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=700&auto=format&fit=crop', alt: 'Model in a cream tailored suit with a red rose' },
  { src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=700&auto=format&fit=crop', alt: 'Model in a blue coat and scarf over a long skirt' },
  { src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=700&auto=format&fit=crop', alt: 'Man in a navy tailored suit, arms crossed' },
  { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=700&auto=format&fit=crop', alt: 'Woman in a denim jacket over a grey hoodie' },
]
const lookbookB = [
  { src: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=700&auto=format&fit=crop', alt: 'Woman in a dark plaid coat carrying a burgundy bag' },
  { src: 'https://images.unsplash.com/photo-1536243298747-ea8874136d64?q=80&w=700&auto=format&fit=crop', alt: 'Man in an all-black street style outfit' },
  { src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=700&auto=format&fit=crop', alt: 'Man in a knit sweater over a collared shirt' },
  { src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=700&auto=format&fit=crop', alt: 'Woman in a red tee with an oversized jacket' },
]

function LookRow({ images, reverse = false }: { images: { src: string; alt: string }[]; reverse?: boolean }) {
  return (
    <div className="group relative flex overflow-hidden" data-cursor="view">
      <motion.div
        className={`flex shrink-0 gap-10 pr-10 sm:gap-14 sm:pr-14 ${reverse ? 'animate-marquee-slow [animation-direction:reverse]' : 'animate-marquee-slow'} group-hover:[animation-play-state:paused]`}
      >
        {[...images, ...images].map((img, i) => (
          <div key={i} className="h-56 w-44 shrink-0 overflow-hidden rounded-[1.4rem] img-fallback shadow-soft sm:h-64 sm:w-52">
            <SoftImage src={img.src} alt={img.alt} className="h-full w-full" imgClassName="hover:scale-110 transition-transform duration-700" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function Lookbook() {
  return (
    <section id="lookbook" className="overflow-hidden py-24">
      <div className="mx-auto mb-12 max-w-6xl px-4 lg:px-8">
        <SectionHeading eyebrow="Lookbook" title="Season 04 — in motion" accentWords={['motion']} />
      </div>
      <div className="flex flex-col gap-5">
        <LookRow images={lookbookA} />
        <LookRow images={lookbookB} reverse />
      </div>
    </section>
  )
}

/* ---------------- STATS + TESTIMONIALS ---------------- */

const stats = [
  { to: 3100, suffix: '+', label: 'Pieces delivered' },
  { to: 9, suffix: '', label: 'Atelier hands' },
  { to: 12, suffix: '', label: 'Fabric partners' },
  { to: 96, suffix: '%', label: 'Repeat wearers' },
]

const quotes = [
  {
    text: 'My baju kurta has been washed maybe ninety times and it looks more mine every month.',
    who: 'Nur A.',
    from: 'Bukit Bintang, KL',
  },
  {
    text: 'They repaired a twelve-year-old shirt I brought in like it was a family heirloom.',
    who: 'Wei Ling T.',
    from: 'George Town, Penang',
  },
  {
    text: 'Kain yang boleh dijejak itu jarang. Kain yang terasa tenang seperti ini — lagi jarang lagi.',
    who: 'Amirul H.',
    from: 'Johor Bahru, Johor',
  },
  {
    text: 'The fit was spot on from the very first try. Not a single alteration needed.',
    who: 'Priya M.',
    from: 'Brickfields, KL',
  },
  {
    text: 'Saya pesan Ahad malam, terus pakai Isnin pagi. Penghantaran kat sini memang cepat.',
    who: 'Arjun S.',
    from: 'Tanjong Tokong, Penang',
  },
]

export function StatsTestimonials() {
  return (
    <section id="voices" className="py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* stats row — stepped counters */}
        <div className="mb-20 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="rounded-[1.6rem] border border-hairline bg-ivory p-6 text-center shadow-soft"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: easeSoft }}
            >
              <Counter to={s.to} suffix={s.suffix} className="font-display text-3xl sm:text-4xl" />
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-olive">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* testimonial carousel */}
        <QuotesCarousel />
      </div>
    </section>
  )
}

function QuotesCarousel() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % quotes.length), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="mx-auto max-w-3xl text-center" data-cursor="view">
      <div className="relative min-h-[170px] sm:min-h-[150px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.5, ease: easeSoft }}
          >
            <blockquote className="font-display text-xl italic leading-relaxed text-moss sm:text-2xl">
              “{quotes[i].text}”
            </blockquote>
            <figcaption className="mt-5 text-sm text-olive">
              <span className="font-semibold text-moss">{quotes[i].who}</span> · {quotes[i].from}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {quotes.map((_, d) => (
          <button
            key={d}
            onClick={() => setI(d)}
            aria-label={`Quote ${d + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${d === i ? 'w-7 bg-caramel' : 'w-1.5 bg-olive/30 hover:bg-olive/60'}`}
          />
        ))}
      </div>
    </div>
  )
}

/* ---------------- FAQ ---------------- */

const faqs = [
  { q: 'How should I care for handloom cotton and linen?', a: 'Cold wash, mild detergent, dry in shade. The fabric relaxes over the first three washes — that is normal and part of the break-in.' },
  { q: 'Do you offer custom sizing?', a: 'Yes. Every piece can be re-cut to your measurements. Book a fitting through the contact page and our tailor will map you.' },
  { q: 'Where can I buy your pieces online?', a: 'Every piece is listed on our Shopee store, with prices, sizes and stock kept in step with the atelier. Or call us and we will set one aside for you.' },
  { q: 'What is the repair policy?', a: 'Any DK piece, any age, repaired free of charge at our atelier. Postal repairs are supported within the country.' },
  { q: 'Do you restock sold-out designs?', a: 'Small-batch designs return in limited runs. Notify-list members are alerted before the public announcement.' },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="bg-sand/60 py-24">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <SectionHeading eyebrow="Care & questions" title="Asked, answered" accentWords={['answered']} className="mb-12" />
        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              className="overflow-hidden rounded-2xl border border-hairline bg-ivory"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45, ease: easeSoft }}
            >
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-medium text-moss">{f.q}</span>
                <motion.span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline text-caramel-deep"
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.35, ease: easeSoft }}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: easeSoft }}
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-olive">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- CONTACT STRIP ---------------- */

export function ContactStrip() {
  return (
    <section id="visit" className="py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-3 lg:px-8">
        {[
          { label: 'Visit', value: 'Lot 3-22, Berjaya Times Square, Kuala Lumpur', icon: '◎' },
          { label: 'Hours', value: 'Mon–Sun · 10:00 AM to 10:00 PM', icon: '◷' },
          { label: 'Write', value: 'dkfashionkwc@gmail.com · +60 11-3745 5473', icon: '✎' },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            className="group relative overflow-hidden rounded-[1.6rem] border border-hairline bg-ivory p-7 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-caramel hover:shadow-lift"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.55, ease: easeSoft }}
          >
            <span className="font-display text-2xl italic text-caramel">{c.icon}</span>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.3em] text-eucalyptus-deep">{c.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-olive">{c.value}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- FOOTER ---------------- */

export function Footer() {
  const navigate = useNavigate()
  const goHomeSection = (id: string) => {
    navigate('/')
    window.setTimeout(() => lenisGo(`#${id}`), 450)
  }
  return (
    <footer className="relative overflow-hidden bg-moss pt-16 text-ivory">
      {/* big outlined wordmark marquee */}
      <div className="relative flex overflow-hidden pb-10">
        <motion.div className="flex animate-marquee-slow">
          {[0, 1].map((c) => (
            <span key={c} aria-hidden={c === 1} className="shrink-0 whitespace-nowrap font-display text-[16vw] font-semibold leading-none text-outline opacity-40 sm:text-[10vw]">
              DK FASHION ·
            </span>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 border-t border-ivory/10 px-4 py-12 sm:grid-cols-3 lg:px-8">
        <div>
          <div className="inline-block rounded-2xl bg-ivory p-3 shadow-soft">
            <img
              src="/dk.png"
              alt="DK Fashion logo"
              draggable={false}
              className="h-12 w-auto mix-blend-multiply sm:h-14"
            />
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/60">
            A small atelier making calm, traceable clothing in Kuala Lumpur since 2014.
          </p>
        </div>
        <div className="text-sm text-ivory/70">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-ivory/40">Navigate</p>
          <ul className="flex flex-col gap-2">
            <li><Link className="transition-colors hover:text-caramel" to="/">Home</Link></li>
            <li><Link className="transition-colors hover:text-caramel" to="/shop">Shop</Link></li>
            <li><button className="transition-colors hover:text-caramel" onClick={() => goHomeSection('categories')}>Collections</button></li>
            <li><button className="transition-colors hover:text-caramel" onClick={() => goHomeSection('lookbook')}>Lookbook</button></li>
            <li><button className="transition-colors hover:text-caramel" onClick={() => goHomeSection('soon')}>Shopee</button></li>
          </ul>
        </div>
        <div className="text-sm text-ivory/70">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-ivory/40">Elsewhere</p>
          <ul className="flex flex-col gap-2">
            <li><a href="mailto:dkfashionkwc@gmail.com" className="transition-colors hover:text-caramel">dkfashionkwc@gmail.com</a></li>
            <li><a href="tel:+601137455473" className="transition-colors hover:text-caramel">+60 11-3745 5473</a></li>
            <li><a href="#" className="transition-colors hover:text-caramel">Instagram</a></li>
            <li><a href="https://www.facebook.com/dkfashionkwc" target="_blank" rel="noreferrer" className="transition-colors hover:text-caramel">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/40">
        © {new Date().getFullYear()} DK International Sdn. Bhd. — sewn with patience in Kuala Lumpur ·{' '}
        <a
          href="https://bintelfuturetech.com"
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-caramel"
        >
          Developed by Bintel Future Tech
        </a>
      </div>
    </footer>
  )
}

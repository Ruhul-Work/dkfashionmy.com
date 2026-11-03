import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading, Reveal } from '../components/motion-kit'

const easeSoft: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

const fields = [
  { name: 'name', label: 'Your name', type: 'text', placeholder: 'Nadia Rahman' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com' },
  { name: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+60 …' },
]

const subjects = ['Custom fitting', 'Repair', 'Fabric question', 'Wholesale', 'Say hello']

export default function Contact() {
  const [subject, setSubject] = useState(subjects[0])
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <main className="pt-36">
      <section className="mx-auto max-w-6xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Write us a note, any note"
          accentWords={['note']}
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
          {/* form */}
          <Reveal>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="done"
                  className="flex h-72 flex-col items-center justify-center rounded-[2rem] border border-hairline bg-sage/60 shadow-soft"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: easeSoft }}
                >
                  <motion.span
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-caramel text-2xl text-ivory"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 16 }}
                  >
                    ✓
                  </motion.span>
                  <p className="mt-5 font-display text-xl">Message received</p>
                  <p className="mt-1 text-sm text-olive">We reply within two working days.</p>
                  <button
                    className="mt-5 text-xs font-medium uppercase tracking-[0.25em] text-caramel-deep"
                    onClick={() => setSent(false)}
                  >
                    Write another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="flex flex-col gap-5"
                  exit={{ opacity: 0, y: -14 }}
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {fields.map((f, i) => (
                      <label key={f.name} className={`flex flex-col gap-2 ${i === 2 ? 'sm:col-span-2' : ''}`}>
                        <span className="text-xs font-medium uppercase tracking-[0.25em] text-eucalyptus-deep">
                          {f.label}
                        </span>
                        <input
                          type={f.type}
                          required={f.name !== 'phone'}
                          placeholder={f.placeholder}
                          className="rounded-2xl border border-hairline bg-ivory px-5 py-4 text-sm text-moss outline-none transition-colors placeholder:text-olive/50 focus:border-caramel"
                        />
                      </label>
                    ))}
                  </div>

                  {/* subject stepper */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.25em] text-eucalyptus-deep">
                      Subject
                    </span>
                    <motion.div layout className="flex flex-wrap gap-2">
                      {subjects.map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setSubject(s)}
                          className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                            subject === s ? 'text-ivory' : 'text-olive hover:text-moss'
                          }`}
                        >
                          {subject === s && (
                            <motion.span
                              layoutId="subject-pill"
                              className="absolute inset-0 rounded-full bg-moss"
                              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                            />
                          )}
                          <span className="relative z-10">{s}</span>
                        </button>
                      ))}
                    </motion.div>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.25em] text-eucalyptus-deep">
                      Message
                    </span>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you need…"
                      className="resize-none rounded-2xl border border-hairline bg-ivory px-5 py-4 text-sm text-moss outline-none transition-colors placeholder:text-olive/50 focus:border-caramel"
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-2 self-start rounded-full bg-caramel px-8 py-4 text-sm font-medium text-ivory shadow-soft transition-colors hover:bg-caramel-deep"
                  >
                    Send message
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>

          {/* side info */}
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-6">
              <div className="rounded-[1.8rem] border border-hairline bg-sand/70 p-7 shadow-soft">
                <p className="font-display text-xl italic text-moss">DK International Sdn. Bhd.</p>
                <p className="mt-2 text-sm leading-relaxed text-olive">
                  Head Office & Shop
                  <br />
                  Lot 3-22, Berjaya Times Square, Kuala Lumpur
                </p>
                <p className="mt-4 flex flex-col gap-1 text-sm text-olive">
                  <a href="mailto:dkfashionkwc@gmail.com" className="w-fit transition-colors hover:text-caramel-deep">
                    dkfashionkwc@gmail.com
                  </a>
                  <a href="tel:+601137455473" className="w-fit transition-colors hover:text-caramel-deep">
                    +60 11-3745 5473
                  </a>
                </p>
              </div>
              {/* map placeholder — soft, matching theme */}
              <div className="relative h-64 overflow-hidden rounded-[1.8rem] img-fallback shadow-soft">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(39,48,42,0.08),transparent_50%),radial-gradient(circle_at_70%_65%,rgba(185,138,110,0.18),transparent_45%)]" />
                <motion.div
                  className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-caramel text-xl text-ivory shadow-lift"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                >
                  ◎
                </motion.div>
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ivory/90 px-4 py-2 text-xs text-moss shadow-soft">
                  Berjaya Times Square · Kuala Lumpur
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* closing strip */}
      <Reveal>
        <div className="mx-auto mb-4 mt-24 max-w-6xl px-4 pb-24 lg:px-8">
          <p className="text-center font-display text-lg italic text-olive">
            Or simply walk in on a Saturday — the kettles always on.
          </p>
        </div>
      </Reveal>
    </main>
  )
}

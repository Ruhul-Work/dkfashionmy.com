import { CurtainImage, SectionHeading, SplitHeadline, Parallax, StepItem, StaggerGroup } from '../components/motion-kit'
import CTAButton from '../components/CTAButton'
import SoftImage from '../components/SoftImage'

const gallery = [
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=700&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=700&auto=format&fit=crop',
]

const values = [
  { t: 'Calm over noise', d: 'We design for the slow hours — pieces that lower the volume of a day, not raise it.' },
  { t: 'Traceable over trendy', d: 'Every fabric, button and thread has an address. We publish it on the care card.' },
  { t: 'Fewer, better', d: 'Two drops a year, not fifty. Each one is made to survive a decade of laundry.' },
]

export default function About() {
  return (
    <main className="pt-36">
      <section className="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
        <SplitHeadline
          as="h1"
          text="A small atelier with long patience"
          accentWords={['patience']}
          className="mx-auto max-w-3xl text-center font-display text-3xl leading-tight sm:text-5xl"
        />
        <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-olive">
          DK Fashion began in 2014 in one rented room in Dhanmondi — two sewing
          machines, one cutting table, and a stubborn belief that clothes should
          be traceable.
        </p>
      </section>

      {/* gallery strip with parallax */}
      <section className="pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 px-4 lg:grid-cols-4 lg:px-8">
          {gallery.map((src, i) => (
            <Parallax key={src} amount={i % 2 === 0 ? 26 : -26}>
              <CurtainImage
                src={src}
                alt="Atelier life"
                className={`w-full rounded-[1.6rem] shadow-soft ${i % 2 === 0 ? 'h-72' : 'h-64 mt-8'}`}
                delay={i * 0.07}
              />
            </Parallax>
          ))}
        </div>
      </section>

      {/* values stepped list */}
      <section className="bg-sand/60 py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <SectionHeading eyebrow="What holds us up" title="Three working values" accentWords={['working']} className="mb-14" />
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-3" step={0.14}>
            {values.map((v) => (
              <StepItem key={v.t}>
                <div className="h-full rounded-[1.6rem] border border-hairline bg-ivory p-7 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift">
                  <p className="font-display text-xl italic text-caramel">{v.t}</p>
                  <p className="mt-3 text-sm leading-relaxed text-olive">{v.d}</p>
                </div>
              </StepItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* closing */}
      <section className="py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <SplitHeadline
              text="Visit the room where it happens"
              accentWords={['happens']}
              className="font-display text-3xl leading-tight sm:text-4xl"
            />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-olive">
              Our door is open on Saturdays. Come see the cutting table, ask
              anything, and leave with fabric swatches in your pocket.
            </p>
            <div className="mt-8 flex gap-3">
              <CTAButton to="/contact" className='px-3'>Plan a visit</CTAButton>
              <CTAButton variant="ghost" to="/" className='px-3'>Back home</CTAButton>
            </div>
          </div>
          <SoftImage
            src="https://images.unsplash.com/photo-1594938133356-41aceb152793?q=80&w=900&auto=format&fit=crop"
            alt="Cutting table in the atelier"
            className="h-80 rounded-[2rem] shadow-lift"
            imgClassName="transition-transform duration-700 hover:scale-105"
          />
        </div>
      </section>
    </main>
  )
}

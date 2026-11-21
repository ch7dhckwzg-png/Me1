import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { SERVICES } from '@/content'

/**
 * Pinned scene on wide screens: scrolling down drives the four panels sideways, each a
 * hard cut to a new colour. On narrow screens the panels stack and slam in as they enter.
 */
export default function Services({ reducedMotion }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const mm = gsap.matchMedia()
      const track = scope.current.querySelector('.services-track')

      mm.add('(min-width: 880px)', () => {
        const distance = () => track.scrollWidth - window.innerWidth
        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            pin: true,
            scrub: 0.5,
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
          },
        })
        // Each title rushes in from the right as its panel arrives.
        gsap.utils.toArray('.panel h3', scope.current).forEach((title) => {
          gsap.from(title, {
            xPercent: 40,
            skewX: -14,
            opacity: 0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: title.closest('.panel'),
              containerAnimation: slide,
              start: 'left 85%',
              end: 'left 35%',
              scrub: 0.4,
            },
          })
        })
      })

      mm.add('(max-width: 879px)', () => {
        gsap.utils.toArray('.panel h3', scope.current).forEach((title) => {
          gsap.from(title, {
            xPercent: -60,
            skewX: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: { trigger: title, start: 'top 85%', once: true },
          })
        })
      })

      return () => mm.revert()
    },
    { scope, dependencies: [reducedMotion] },
  )

  return (
    <section className="services" id="services" ref={scope}>
      <div className="services-track">
        <div className="panel panel-intro">
          <h2 className="kicker">What we do</h2>
          <p>Four crafts, one studio.</p>
        </div>
        {SERVICES.map(({ title, body }, i) => (
          <article className={`panel panel-${i + 1}`} key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PROCESS } from '@/content'

/** How a project runs, as a training plan: a track fills as you scroll, lighting each step. */
export default function Process({ reducedMotion }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set('.step', { className: 'step is-active' })
        return
      }
      gsap.fromTo(
        '.track-fill',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 55%', scrub: 0.5 },
        },
      )
      // Each step lights up as the track reaches it (and dims again if you scroll back).
      const steps = gsap.utils.toArray('.step', scope.current)
      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: steps[0].parentElement,
          start: () => {
            const list = steps[0].parentElement
            return `top+=${(i / steps.length) * list.offsetHeight} 75%`
          },
          onToggle: (self) => step.classList.toggle('is-active', self.isActive),
          end: 'max',
        })
      })
    },
    { scope, dependencies: [reducedMotion] },
  )

  return (
    <section className="section process" id="process" ref={scope}>
      <div className="wrap">
        <header className="section-head">
          <h2 className="display">Simple, from first chat to launch</h2>
        </header>
        <div className="track" aria-hidden="true">
          <div className="track-fill" />
        </div>
        <ol className="steps">
          {PROCESS.map((step, i) => (
            <li className="step" key={step.title}>
              <span className="step-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

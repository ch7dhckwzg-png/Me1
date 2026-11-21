import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { PROCESS } from '@/content'

/** How a project runs: when the steps come into view, a track fills once and lights each step in turn. */
export default function Process({ reducedMotion }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      const steps = gsap.utils.toArray('.step', scope.current)
      if (reducedMotion) {
        steps.forEach((step) => step.classList.add('is-active'))
        return
      }
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.steps', start: 'top 75%', once: true } })
      tl.fromTo('.track-fill', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
      steps.forEach((step, i) => {
        tl.add(() => step.classList.add('is-active'), 0.15 + i * 0.4)
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

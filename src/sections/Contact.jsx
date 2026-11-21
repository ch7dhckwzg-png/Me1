import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { EMAIL, MAILTO } from '@/content'

const LABEL = 'Copy email address'

/** A hard cut to gold for the sign-off. */
export default function Contact({ reducedMotion }) {
  const scope = useRef(null)
  const [label, setLabel] = useState(LABEL)
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('.contact-title .line > span', {
        xPercent: -108,
        skewX: 28,
        duration: 0.9,
        stagger: 0.09,
        ease: 'expo.out',
        scrollTrigger: { trigger: scope.current, start: 'top 70%', once: true },
      })
    },
    { scope, dependencies: [reducedMotion] },
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setLabel('Copied')
    } catch {
      setLabel('Copy not available here')
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setLabel(LABEL), 2200)
  }

  return (
    <section className="contact" id="contact" ref={scope}>
      <div className="wrap">
        <h2 className="contact-title">
          <span className="line"><span>Let’s get you</span></span>
          <span className="line"><span>noticed.</span></span>
        </h2>
        <a className="mail" href={MAILTO}>{EMAIL}</a>
        <button className="btn btn-dark" type="button" onClick={copy} aria-live="polite">
          {label === 'Copied' && (
            <svg className="copied-tick" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {label}
        </button>
      </div>
    </section>
  )
}

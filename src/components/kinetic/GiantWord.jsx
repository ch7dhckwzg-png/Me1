import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

/** An outsized outlined word that slides sideways as you scroll past. Decorative only. */
export default function GiantWord({ children, reducedMotion, className = '', from = 6, to = -18 }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.fromTo(
        ref.current,
        { xPercent: from },
        {
          xPercent: to,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )
    },
    { dependencies: [reducedMotion] },
  )
  return (
    <div className={`giant ${className}`} aria-hidden="true">
      <span ref={ref}>{children}</span>
    </div>
  )
}

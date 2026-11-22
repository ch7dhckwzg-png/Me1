import { useRef } from 'react'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(DrawSVGPlugin)

const RINGS = [
  { label: 'Branding', r: 176, color: '#d2642c' },
  { label: 'Web', r: 146, color: '#e2804c' },
  { label: 'Photography', r: 116, color: '#efa376' },
  { label: 'Motion', r: 86, color: '#f3ede3' },
]

/**
 * Activity rings: one per craft, closing together as they come into view.
 * The point they make: every ring ends up full, in one studio.
 */
export default function Rings({ reducedMotion }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (reducedMotion) return
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true } })
      tl.from('.ring-fill', { drawSVG: '0%', duration: 1.8, stagger: 0.16, ease: 'power3.inOut' })
        .from('.ring-label', { opacity: 0, x: -10, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, 0.3)
        .from('.ring-core > *', { opacity: 0, scale: 0.8, duration: 0.8, stagger: 0.1, ease: 'back.out(1.8)' }, 1)
    },
    { scope: ref, dependencies: [reducedMotion] },
  )

  return (
    <figure className="rings-wrap" ref={ref} aria-label="Branding, web, photography and motion: all from one studio">
      <div className="rings">
      <svg viewBox="0 0 400 400" aria-hidden="true">
        {RINGS.map((ring) => (
          <g key={ring.label} transform="rotate(-90 200 200)">
            <circle className="ring-track" cx="200" cy="200" r={ring.r} />
            <circle className="ring-fill" cx="200" cy="200" r={ring.r} stroke={ring.color} />
          </g>
        ))}
      </svg>
      <div className="ring-core" aria-hidden="true">
        <b>1</b>
        <span>studio</span>
      </div>
      </div>
      <ul className="ring-labels" aria-hidden="true">
        {RINGS.map((ring) => (
          <li className="ring-label" key={ring.label} style={{ '--c': ring.color }}>
            {ring.label}
          </li>
        ))}
      </ul>
    </figure>
  )
}

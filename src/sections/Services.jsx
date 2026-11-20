import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import GlareHover from '@/components/GlareHover'
import { SERVICES } from '@/content'

export default function Services({ reducedMotion }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.utils.toArray('.service').forEach((row) => {
        gsap.from(row, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 88%', once: true },
        })
      })
    },
    { scope, dependencies: [reducedMotion] },
  )

  return (
    <section className="wrap services" id="services" ref={scope}>
      <h2 className="display">What we do</h2>
      <ul>
        {SERVICES.map(({ title, body }) => (
          <li className="service" key={title}>
            <GlareHover
              className="service-row"
              width="100%"
              borderRadius="0"
              glareColor="#E4CFA6"
              glareOpacity={0.16}
              glareAngle={-60}
              glareSize={55}
              variant="sheen"
              rimGlint={false}
              transitionDuration={900}
            >
              <h3 className="display">{title}</h3>
              <p>{body}</p>
            </GlareHover>
          </li>
        ))}
      </ul>
    </section>
  )
}

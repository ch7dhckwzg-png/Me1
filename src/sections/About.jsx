import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const STATEMENT =
  'Marketing, design and photography usually sit with three different suppliers. At Catalyze they sit together, so the look, the message and the images all pull in the same direction.'

/** One statement whose words light up as you scroll through it. */
export default function About({ reducedMotion }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.fromTo(
        '.statement .w',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: '.statement', start: 'top 78%', end: 'bottom 45%', scrub: 0.5 },
        },
      )
    },
    { scope, dependencies: [reducedMotion] },
  )

  return (
    <section className="wrap about" id="about" ref={scope}>
      <h2 className="kicker">One studio for the whole picture</h2>
      <p className="statement">
        {STATEMENT.split(' ').map((word, i) => (
          <span className="w" key={i}>{word} </span>
        ))}
      </p>
    </section>
  )
}

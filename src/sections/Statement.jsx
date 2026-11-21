import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const STATEMENT =
  'Most businesses juggle a designer, a web developer, a photographer and someone for social media. We do all of it under one roof, so your logo, your website, your photos and your posts finally look like they belong to the same business.'

/** One statement whose words light up as you scroll through it. */
export default function Statement({ reducedMotion }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.fromTo(
        '.statement .w',
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: '.statement', start: 'top 80%', end: 'bottom 50%', scrub: 0.6 },
        },
      )
    },
    { scope, dependencies: [reducedMotion] },
  )

  return (
    <section className="section statement-wrap" id="about" ref={scope}>
      <div className="wrap">
        <p className="eyebrow">Why one studio</p>
        <p className="statement">
          {STATEMENT.split(' ').map((word, i) => (
            <span className="w" key={i}>{word} </span>
          ))}
        </p>
      </div>
    </section>
  )
}

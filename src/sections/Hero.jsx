import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import HeroStar from '@/components/HeroStar'
import Chevron from '@/components/Chevron'
import sparkUrl from '@/assets/hero/spark.webp'
import { MAILTO } from '@/content'

// The particle spark is its own chunk, fetched (with its image) while the intro plays.
// It mounts once the hero's text has finished arriving, so its one-off setup work
// (sampling the image into ~100k particles) never interrupts another animation; then it
// assembles once, on an otherwise still screen.
const loadSpark = () => import('@/components/ParticleSpark')
const ParticleSpark = lazy(loadSpark)

export default function Hero({ reducedMotion, prepare = true, ready = true }) {
  const scope = useRef(null)
  const entrance = useRef(null)
  const use3d = !reducedMotion
  const [entered, setEntered] = useState(false)

  // Built straight away so the start states hide everything, then held until `ready`.
  useGSAP(
    () => {
      if (reducedMotion) return
      entrance.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: () => setEntered(true) })
        .from('.hero-copy > *', { y: 24, opacity: 0, duration: 1, stagger: 0.12 }, 0.1)
    },
    { scope, dependencies: [reducedMotion] },
  )

  useEffect(() => {
    if (ready) entrance.current?.play()
  }, [ready, reducedMotion])

  useEffect(() => {
    if (!prepare || !use3d) return
    loadSpark()
    const img = new Image()
    img.src = sparkUrl
  }, [prepare, use3d])

  return (
    <section className="hero" id="home" ref={scope} aria-labelledby="hero-title">
      <div className="hero-stage">
        {use3d ? (
          ready &&
          entered && (
            <Suspense fallback={null}>
              <ParticleSpark />
            </Suspense>
          )
        ) : (
          <div className="hero-fallback">
            <HeroStar />
          </div>
        )}
      </div>

      <div className="hero-copy">
        <h1 className="hero-title" id="hero-title">Made to be noticed.</h1>
        <p className="hero-sub">
          Branding, websites, photography and motion for businesses, from one creative studio.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={MAILTO}>Start a project</a>
          <a className="text-link" href="#work">
            See our work <Chevron />
          </a>
        </div>
      </div>
    </section>
  )
}

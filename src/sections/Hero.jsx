import { useEffect, useId, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import HeroStar from '@/components/HeroStar'
import { MAILTO, SERVICES } from '@/content'
import logo from '@/assets/logo.svg'

const CYCLE_S = 4.5

/** Glass bar along the bottom of the hero: the four crafts, cycling, with a progress line. */
function ServiceTabs({ running }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const id = useId()

  return (
    <div
      className="hero-tabs"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p className="tab-desc" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`}>
        <strong>{SERVICES[active].title}.</strong> {SERVICES[active].body}
      </p>
      <div className="tab-list" role="tablist" aria-label="What we do">
        {SERVICES.map((s, i) => (
          <button
            key={s.title}
            id={`${id}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            className="tab"
            onClick={() => setActive(i)}
          >
            {s.short}
            <span className="tab-track" aria-hidden="true">
              {i === active && (
                <span
                  key={`${active}-${running}`}
                  className={`tab-progress${running ? ' is-running' : ''}`}
                  style={{
                    animationDuration: `${CYCLE_S}s`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                  onAnimationEnd={() => setActive((a) => (a + 1) % SERVICES.length)}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Hero({ reducedMotion, ready = true }) {
  const scope = useRef(null)
  const entrance = useRef(null)

  // The entrance is built straight away (so its start states hide the elements),
  // but held until `ready`: the intro hands off by flipping it to true.
  useGSAP(
    () => {
      if (reducedMotion) return
      const idle = () => {
        gsap.to('.hero-star', { y: -14, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        gsap
          .timeline({ repeat: -1, repeatDelay: 4.5, delay: 0.6 })
          .fromTo('.hero-star-shine', { x: -260 }, { x: 900, duration: 1.4, ease: 'power2.inOut' })
      }
      entrance.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: idle })
        .from('.hero-visual', { opacity: 0, scale: 0.9, y: 40, duration: 1.6 }, 0)
        .from('.hero-title .line > span', { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.2)
        .from('.hero-copy .badge', { opacity: 0, y: 12, duration: 0.7 }, 0.15)
        .from(['.hero-sub', '.hero-copy .cta'], { opacity: 0, y: 18, duration: 0.8, stagger: 0.1 }, 0.6)
        .from('.nav', { opacity: 0, y: -14, duration: 0.8 }, 0.4)
        .from('.hero-tabs', { opacity: 0, y: 24, duration: 0.9 }, 0.8)

      // A small tilt towards the pointer, on devices with one.
      if (window.matchMedia('(pointer: fine)').matches) {
        const rx = gsap.quickTo('.hero-tilt', 'rotationX', { duration: 0.9, ease: 'power3.out' })
        const ry = gsap.quickTo('.hero-tilt', 'rotationY', { duration: 0.9, ease: 'power3.out' })
        const onMove = (e) => {
          ry((e.clientX / window.innerWidth - 0.5) * 14)
          rx((e.clientY / window.innerHeight - 0.5) * -10)
        }
        scope.current.addEventListener('pointermove', onMove)
        return () => scope.current?.removeEventListener('pointermove', onMove)
      }
      return undefined
    },
    { scope, dependencies: [reducedMotion] },
  )

  useEffect(() => {
    if (ready) entrance.current?.play()
  }, [ready, reducedMotion])

  return (
    <header className="hero" id="home" ref={scope}>
      <nav className="nav" aria-label="Main">
        <a className="logo" href="#home">
          <img src={logo} width="1275" height="477" alt="Catalyze, back to top" />
        </a>
        <ul>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a className="btn btn-light nav-cta" href={MAILTO}>Email us</a>
      </nav>

      <div className="hero-body">
        <div className="hero-copy">
          <p className="badge">
            <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true">
              <path d="M10 0 L12.4 7.6 L20 10 L12.4 12.4 L10 20 L7.6 12.4 L0 10 L7.6 7.6 Z" fill="currentColor" />
            </svg>
            Marketing · Design · Imagery
          </p>
          <h1 className="hero-title">
            <span className="line"><span>Made to</span></span>
            <span className="line"><span>be noticed.</span></span>
          </h1>
          <p className="hero-sub">
            Marketing, design, web and photography from one studio, so your business looks and
            sounds like itself everywhere.
          </p>
          <div className="cta">
            <a className="btn btn-primary" href={MAILTO}>Email us</a>
            <a className="btn btn-ghost" href="#services">See what we do</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-tilt">
            <div className="hero-star">
              <HeroStar />
            </div>
          </div>
        </div>
      </div>

      <div className="hero-foot">
        <ServiceTabs running={ready && !reducedMotion} />
      </div>
    </header>
  )
}

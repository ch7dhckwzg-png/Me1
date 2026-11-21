import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { MAILTO } from '@/content'
import logo from '@/assets/logo.svg'

export default function Hero({ reducedMotion, ready = true }) {
  const scope = useRef(null)
  const entrance = useRef(null)

  // The entrance is built straight away (so its start states hide the elements),
  // but held until `ready`: the intro hands off by flipping it to true.
  useGSAP(
    () => {
      if (reducedMotion) return
      entrance.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .from('.hero-glow', { opacity: 0, scale: 0.8, duration: 2.2, ease: 'power2.out' }, 0)
        .from('.hero-logo', { opacity: 0, scale: 1.06, y: 18, duration: 1.3 }, 0.1)
        .from('.hero-tagline', { opacity: 0, letterSpacing: '0.6em', duration: 1.4, ease: 'power2.out' }, 0.45)
        .from('.nav', { y: -16, opacity: 0, duration: 0.8 }, 0.5)
        .from('.hero-foot > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.8)
    },
    { scope, dependencies: [reducedMotion] },
  )

  useEffect(() => {
    if (ready) entrance.current?.play()
  }, [ready, reducedMotion])

  return (
    <header className="hero" id="home" ref={scope}>
      <div className="hero-glow" aria-hidden="true" />

      <nav className="nav" aria-label="Main">
        <a className="logo" href="#home">
          <img src={logo} width="1275" height="477" alt="Catalyze, back to top" />
        </a>
        <ul>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <div className="hero-mark">
        <h1 className="hero-logo">
          <img src={logo} width="1275" height="477" alt="Catalyze" fetchPriority="high" />
        </h1>
        <p className="hero-tagline">Marketing · Design · Imagery</p>
      </div>

      <div className="hero-foot">
        <p className="hero-lede">
          Marketing, design and imagery that gets you noticed. One studio for digital marketing,
          design, web and photography.
        </p>
        <div className="cta">
          <a className="btn btn-primary" href={MAILTO}>Email us</a>
          <a className="btn btn-ghost" href="#services">See what we do</a>
        </div>
      </div>
    </header>
  )
}

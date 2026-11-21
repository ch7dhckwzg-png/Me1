import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitText from '@/components/SplitText'
import { MAILTO } from '@/content'
import hero960 from '@/assets/hero-960.webp'
import hero1440 from '@/assets/hero-1440.webp'
import hero1920 from '@/assets/hero-1920.webp'
import heroJpg from '@/assets/hero-1920.jpg'
import logo from '@/assets/logo.svg'

const HEADLINE = 'Marketing, design and imagery that gets you noticed.'

export default function Hero({ reducedMotion, ready = true }) {
  const scope = useRef(null)
  const entrance = useRef(null)
  // The headline is the page's one big moment: it waits for the photo to start
  // fading in, then React Bits SplitText rises it in letter by letter.
  const [headlineLive, setHeadlineLive] = useState(false)
  const showHeadline = reducedMotion || headlineLive

  // The entrance is built straight away (so its start states hide the elements),
  // but held until `ready`: the intro hands off by flipping it to true.
  useGSAP(
    () => {
      if (reducedMotion) return
      entrance.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .from('.hero-img', { opacity: 0, scale: 1.06, duration: 1.4 })
        .call(() => setHeadlineLive(true), null, 0.35)
        .from('.nav', { y: -16, opacity: 0, duration: 0.8 }, 0.2)
        .from('.intro-copy > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.9)
    },
    { scope, dependencies: [reducedMotion] },
  )

  useEffect(() => {
    if (ready) entrance.current?.play()
  }, [ready, reducedMotion])

  return (
    <header className="hero" id="home" ref={scope}>
      <nav className="nav" aria-label="Main">
        <a className="logo" href="#top">
          <img src={logo} width="2400" height="897" alt="Catalyze, back to top" />
        </a>
        <ul>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <picture>
        <source
          type="image/webp"
          srcSet={`${hero960} 960w, ${hero1440} 1440w, ${hero1920} 1920w`}
          sizes="(max-width: 699px) 178vw, 100vw"
        />
        <img
          id="top"
          className="hero-img"
          src={heroJpg}
          width="1920"
          height="1080"
          fetchPriority="high"
          alt="The back of a blonde bob haircut with the Catalyze logo stencilled across it"
        />
      </picture>

      <div className="intro">
        <div className="headline-slot">
          {showHeadline ? (
            <SplitText
              tag="h1"
              text={HEADLINE}
              className="display headline"
              textAlign="left"
              splitType="chars"
              mask
              effect="rise"
              trigger="load"
              delay={18}
              duration={1.1}
              accentColor="#E4CFA6"
            />
          ) : (
            <h1 className="display headline split-placeholder" aria-hidden="true">
              {HEADLINE}
            </h1>
          )}
        </div>
        <div className="intro-copy">
          <p>Catalyze is a studio for digital marketing, digital design, web design and photography.</p>
          <div className="cta">
            <a className="btn btn-primary" href={MAILTO}>Email us</a>
            <a className="btn btn-ghost" href="#services">See what we do</a>
          </div>
        </div>
      </div>
    </header>
  )
}

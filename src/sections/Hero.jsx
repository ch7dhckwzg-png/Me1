import { useRef, useState } from 'react'
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

export default function Hero({ reducedMotion }) {
  const scope = useRef(null)
  // The headline is the page's one big moment: it waits for the photo to start
  // fading in, then React Bits SplitText rises it in letter by letter.
  const [headlineLive, setHeadlineLive] = useState(false)
  const showHeadline = reducedMotion || headlineLive

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-img', { opacity: 0, scale: 1.04, duration: 1.4 })
        .call(() => setHeadlineLive(true), null, 0.45)
        .from('.intro-copy > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.12 }, 1.1)
    },
    { scope, dependencies: [reducedMotion] },
  )

  return (
    <header className="hero" ref={scope}>
      <nav className="nav" aria-label="Main">
        <a className="logo" href="#top">
          <img src={logo} width="3801" height="1407" alt="Catalyze, back to top" />
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

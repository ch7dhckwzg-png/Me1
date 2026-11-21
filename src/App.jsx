import { useState } from 'react'
import useReducedMotion from '@/hooks/useReducedMotion'
import useSmoothScroll from '@/hooks/useSmoothScroll'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import SiteDock from '@/components/SiteDock'
import Intro from '@/sections/Intro'
import Hero from '@/sections/Hero'
import Velocity from '@/sections/Velocity'
import Statement from '@/sections/Statement'
import Services from '@/sections/Services'
import Work from '@/sections/Work'
import Process from '@/sections/Process'
import Faq from '@/sections/Faq'
import Contact from '@/sections/Contact'
import { EMAIL, MAILTO } from '@/content'
import logo from '@/assets/logo.svg'

const YEAR = new Date().getFullYear()

// The intro plays once per browser session; `?intro=0` skips it (for shared links and testing).
const INTRO_KEY = 'catalyze-intro-seen'
const introWanted = () => {
  try {
    if (new URLSearchParams(window.location.search).get('intro') === '0') return false
    return sessionStorage.getItem(INTRO_KEY) !== '1'
  } catch {
    return true
  }
}
const markIntroSeen = () => {
  try {
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* storage unavailable: the intro simply plays again next time */
  }
}

export default function App() {
  const reducedMotion = useReducedMotion()
  // The intro plays over the page once per visit; scrolling is locked until it hands off.
  // phase: 'intro' (playing, scroll locked) -> 'reveal' (fading into the hero) -> 'done'
  const [phase, setPhase] = useState(() => (introWanted() ? 'intro' : 'done'))
  // Set by the hero once its 3D scene is built; the intro waits for it before starting.
  const [heroReady, setHeroReady] = useState(false)
  const showIntro = !reducedMotion && phase !== 'done'
  useSmoothScroll(reducedMotion, !reducedMotion && phase === 'intro')

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      {showIntro && (
        <Intro
          heroReady={heroReady}
          onReveal={() => setPhase('reveal')}
          onDone={() => {
            markIntroSeen()
            setPhase('done')
          }}
        />
      )}
      <Hero
        reducedMotion={reducedMotion}
        ready={reducedMotion || phase !== 'intro'}
        onSceneReady={() => setHeroReady(true)}
      />
      <main id="main" tabIndex={-1}>
        <Velocity reducedMotion={reducedMotion} />
        <Statement reducedMotion={reducedMotion} />
        <Services />
        <Work reducedMotion={reducedMotion} />
        <Process reducedMotion={reducedMotion} />
        <Faq />
        <Contact reducedMotion={reducedMotion} />
      </main>
      {phase !== 'intro' || reducedMotion ? (
        <>
          <ScrollProgress className="scroll-progress" aria-hidden="true" />
          <SiteDock />
        </>
      ) : null}
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <img src={logo} width="1275" height="477" alt="Catalyze" className="footer-logo" />
            <p>A creative studio for brands that want to be noticed.</p>
          </div>
          <nav aria-label="Footer">
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <a href="#faq">Questions</a>
            <a href="#contact">Contact</a>
          </nav>
          <div>
            <a href={MAILTO} className="footer-mail">{EMAIL}</a>
            <p className="footer-legal">© {YEAR} Catalyze. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

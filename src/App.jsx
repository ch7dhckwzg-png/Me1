import { useState } from 'react'
import useReducedMotion from '@/hooks/useReducedMotion'
import useSmoothScroll from '@/hooks/useSmoothScroll'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import SiteDock from '@/components/SiteDock'
import SiteFooter from '@/components/SiteFooter'
import Intro from '@/sections/Intro'
import Hero from '@/sections/Hero'
import Velocity from '@/sections/Velocity'
import Statement from '@/sections/Statement'
import Explore from '@/sections/Explore'
import Contact from '@/sections/Contact'

// Before the site had separate pages, sections were reached with links like /#work or
// /#work-design. Send those (shared or bookmarked) to the right page.
const OLD_LINKS = {
  services: '/services/',
  work: '/work/',
  'work-web': '/work/#work-web',
  'work-photo': '/work/#work-photo',
  'work-design': '/work/#work-design',
  'work-motion': '/work/#work-motion',
  'web-packages': '/work/#web-packages',
  process: '/process/',
  faq: '/faq/',
}
const moved = OLD_LINKS[window.location.hash.slice(1)]
if (moved) window.location.replace(moved)

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
        <Explore />
        <Contact />
      </main>
      {phase !== 'intro' || reducedMotion ? (
        <>
          <ScrollProgress className="scroll-progress" aria-hidden="true" />
          <SiteDock />
        </>
      ) : null}
      <SiteFooter />
    </>
  )
}

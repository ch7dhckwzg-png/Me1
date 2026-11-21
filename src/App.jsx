import { useState } from 'react'
import useReducedMotion from '@/hooks/useReducedMotion'
import useSmoothScroll from '@/hooks/useSmoothScroll'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import SiteDock from '@/components/SiteDock'
import Intro from '@/sections/Intro'
import Hero from '@/sections/Hero'
import Velocity from '@/sections/Velocity'
import Services from '@/sections/Services'
import About from '@/sections/About'
import Contact from '@/sections/Contact'

const YEAR = new Date().getFullYear()

export default function App() {
  const reducedMotion = useReducedMotion()
  // The intro plays over the page once per visit; scrolling is locked until it hands off.
  // phase: 'intro' (playing, scroll locked) -> 'reveal' (light pushes into the hero) -> 'done'
  const [phase, setPhase] = useState('intro')
  // Set once the intro is idle (or the visitor moves on): the hero may load its 3D scene.
  const [prepare, setPrepare] = useState(false)
  // Set by the hero once its scene is set up and drawn; the intro's flash waits for it.
  const [heroReady, setHeroReady] = useState(false)
  const showIntro = !reducedMotion && phase !== 'done'
  useSmoothScroll(reducedMotion, !reducedMotion && phase === 'intro')

  return (
    <>
      {showIntro && <Intro heroReady={heroReady} onIdle={() => setPrepare(true)} onReveal={() => setPhase('reveal')} onDone={() => setPhase('done')} />}
      <Hero
        reducedMotion={reducedMotion}
        prepare={prepare || phase !== 'intro'}
        ready={reducedMotion || phase !== 'intro'}
        onSceneReady={() => setHeroReady(true)}
      />
      <main>
        <Velocity reducedMotion={reducedMotion} />
        <Services reducedMotion={reducedMotion} />
        <About reducedMotion={reducedMotion} />
        <Contact reducedMotion={reducedMotion} />
      </main>
      {phase !== 'intro' || reducedMotion ? (
        <>
          <ScrollProgress className="scroll-progress" aria-hidden="true" />
          <SiteDock />
        </>
      ) : null}
      <footer>
        <div>© {YEAR} Catalyze. All rights reserved.</div>
      </footer>
    </>
  )
}

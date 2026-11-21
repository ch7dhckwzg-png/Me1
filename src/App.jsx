import { useState } from 'react'
import useReducedMotion from '@/hooks/useReducedMotion'
import useSmoothScroll from '@/hooks/useSmoothScroll'
import Intro from '@/sections/Intro'
import Hero from '@/sections/Hero'
import Services from '@/sections/Services'
import About from '@/sections/About'
import Contact from '@/sections/Contact'

const YEAR = new Date().getFullYear()

export default function App() {
  const reducedMotion = useReducedMotion()
  // The intro plays over the page once per visit; scrolling is locked until it hands off.
  // phase: 'intro' (playing, scroll locked) -> 'reveal' (light pushes into the hero) -> 'done'
  const [phase, setPhase] = useState('intro')
  const showIntro = !reducedMotion && phase !== 'done'
  useSmoothScroll(reducedMotion, !reducedMotion && phase === 'intro')

  return (
    <>
      {showIntro && <Intro onReveal={() => setPhase('reveal')} onDone={() => setPhase('done')} />}
      <Hero reducedMotion={reducedMotion} ready={reducedMotion || phase !== 'intro'} />
      <main>
        <Services reducedMotion={reducedMotion} />
        <About />
        <Contact />
      </main>
      <footer>
        <div>© {YEAR} Catalyze. All rights reserved.</div>
      </footer>
    </>
  )
}

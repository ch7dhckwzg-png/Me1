import useReducedMotion from '@/hooks/useReducedMotion'
import useSmoothScroll from '@/hooks/useSmoothScroll'
import Hero from '@/sections/Hero'
import Services from '@/sections/Services'
import About from '@/sections/About'
import Contact from '@/sections/Contact'

const YEAR = new Date().getFullYear()

export default function App() {
  const reducedMotion = useReducedMotion()
  useSmoothScroll(reducedMotion)

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Hero reducedMotion={reducedMotion} />
      <main id="main" tabIndex={-1}>
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

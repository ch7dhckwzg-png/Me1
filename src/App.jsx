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
      <Hero reducedMotion={reducedMotion} />
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

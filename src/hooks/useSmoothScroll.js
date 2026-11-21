import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync.
 * Skipped entirely when the user prefers reduced motion (native scrolling instead).
 * While `locked` is true (the intro is playing) the page does not scroll at all.
 */
export default function useSmoothScroll(disabled, locked = false) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (disabled) return undefined

    const lenis = new Lenis({ lerp: 0.1, anchors: true })
    const raf = (time) => lenis.raf(time * 1000)
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [disabled])

  useEffect(() => {
    const root = document.documentElement
    if (locked) {
      window.scrollTo(0, 0)
      lenisRef.current?.stop()
      root.classList.add('is-locked')
    } else {
      lenisRef.current?.start()
      root.classList.remove('is-locked')
    }
  }, [locked, disabled])
}

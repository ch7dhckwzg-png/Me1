import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync.
 * Skipped entirely when the user prefers reduced motion (native scrolling instead).
 */
export default function useSmoothScroll(disabled) {
  useEffect(() => {
    if (disabled) return undefined

    const lenis = new Lenis({ lerp: 0.1, anchors: true })
    const raf = (time) => lenis.raf(time * 1000)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [disabled])
}

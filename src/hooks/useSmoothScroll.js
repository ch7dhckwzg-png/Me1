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

    // Keyboard users: smoothing would leave a newly focused element off screen for a
    // moment, so jump straight to it (clear of the header and the floating dock).
    const onFocusIn = (e) => {
      const el = e.target
      if (!(el instanceof Element) || !el.matches(':focus-visible')) return
      const r = el.getBoundingClientRect()
      if (r.top < 80 || r.bottom > window.innerHeight - 110) {
        lenis.scrollTo(el, { offset: -window.innerHeight * 0.3, immediate: true })
      }
    }
    document.addEventListener('focusin', onFocusIn)

    return () => {
      document.removeEventListener('focusin', onFocusIn)
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

  return lenisRef
}

/**
 * Arriving on a page with a hash (for example /work/#work-design): jump straight to that
 * spot, with no slide from the top, and again once images above it have loaded and
 * pushed it down. Goes through Lenis when it is running, so it does not animate the jump.
 */
export function useJumpToHash(lenisRef) {
  useEffect(() => {
    if (!window.location.hash) return undefined
    const el = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
    if (!el) return undefined
    const go = () => {
      if (lenisRef.current) lenisRef.current.scrollTo(el, { immediate: true, force: true })
      else el.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
    const frame = requestAnimationFrame(go)
    const late = setTimeout(go, 600)
    if (document.readyState !== 'complete') window.addEventListener('load', go, { once: true })
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(late)
      window.removeEventListener('load', go)
    }
  }, [lenisRef])
}

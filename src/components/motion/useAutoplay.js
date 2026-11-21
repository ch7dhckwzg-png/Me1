import { useEffect, useState } from 'react'

/**
 * Plays an animation while its card is on screen. The visitor can pause or play it;
 * with reduced motion it starts paused.
 */
export default function useAutoplay(ref, reducedMotion) {
  const [inView, setInView] = useState(false)
  const [choice, setChoice] = useState(null) // null until the visitor presses the button

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  const wanted = choice ?? !reducedMotion
  return { playing: wanted && inView, wanted, toggle: () => setChoice(!wanted) }
}

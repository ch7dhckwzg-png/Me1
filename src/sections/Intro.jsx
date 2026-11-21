import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/*
 * Opening animation (three.js, see src/components/laptopScene.js).
 *
 * 1. Plays on its own: the closed laptop, seen head on, opens and its screen lights
 *    up; then it turns to the side and waits, floating gently.
 * 2. One scroll (or swipe, key, click, or 5 s of waiting): the lid folds back a full
 *    180° until the laptop lies flat, the camera rises above it, a beam of light
 *    shoots out of the screen and drives the laptop down, and the intro fades and
 *    slides away into the site.
 *
 * Everything heavy (the 3D code, both scenes' setup) happens before anything moves,
 * so nothing stutters part-way through. Skipped under reduced motion or without WebGL.
 */

const KEYS = new Set(['ArrowDown', 'PageDown', ' ', 'Enter', 'Spacebar'])
const IDLE_MS = 5000

export default function Intro({ onReveal, onDone, heroReady = false }) {
  const root = useRef(null)
  const host = useRef(null)
  const callbacks = useRef({ onReveal, onDone })
  const [sceneReady, setSceneReady] = useState(false)
  const [hint, setHint] = useState(false)
  const api = useRef({ go: () => {}, skip: () => {} })
  const sceneRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    callbacks.current = { onReveal, onDone }
  })

  // Load the 3D code and build the scene. Without WebGL, step straight into the site.
  useEffect(() => {
    let cancelled = false
    import('@/components/laptopScene')
      .then(({ createLaptopScene }) => {
        if (cancelled) return
        sceneRef.current = createLaptopScene(host.current)
        setSceneReady(true)
      })
      .catch(() => {
        if (cancelled) return
        callbacks.current.onReveal()
        callbacks.current.onDone()
      })
    return () => {
      cancelled = true
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [])

  // Start once both this scene and the hero's are ready (or after 2.5 s regardless).
  useEffect(() => {
    if (!sceneReady || startedRef.current) return undefined
    const start = () => {
      if (startedRef.current) return
      startedRef.current = true
      run()
    }
    if (heroReady) start()
    const t = window.setTimeout(start, 2500)
    return () => window.clearTimeout(t)
    // `run` only reads refs, so leaving it out of the list is safe.
  }, [sceneReady, heroReady]) // eslint-disable-line react-hooks/exhaustive-deps

  function run() {
    const s = sceneRef.current
    if (!s || !root.current) return
    const { camera, target, laptop, lidPivot } = s
    const stage = root.current.querySelector('.opening-stage')
    const power = { v: 0 }
    const beamLen = { v: 0.001 }
    let idleTimer = 0
    let float = null
    let started = false

    const tick = () => {
      s.setPower(power.v)
      s.beam.scale.y = beamLen.v
      s.core.scale.y = beamLen.v * 1.08
      s.render()
    }
    gsap.ticker.add(tick)

    // ---- Part 1: head on, open, light up, turn to the side --------------------
    gsap.set(stage, { opacity: 0 })
    const open = gsap
      .timeline({ defaults: { ease: 'power2.inOut' } })
      .to(stage, { opacity: 1, duration: 0.9, ease: 'power1.out' }, 0)
      .from(laptop.position, { y: -0.35, duration: 1.4, ease: 'power3.out' }, 0)
      .to(lidPivot.rotation, { x: -0.3, duration: 1.7 }, 0.45)
      .to(power, { v: 1, duration: 0.8, ease: 'power1.out' }, 1.55)
      .to(laptop.rotation, { y: -0.62, duration: 1.6 }, 2.1)
      .to(camera.position, { x: s.isNarrow() ? -0.35 : 0.7, y: 1.6, duration: 1.6 }, 2.1)
      .add(() => {
        setHint(true)
        float = gsap.to(laptop.position, { y: 0.06, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        idleTimer = window.setTimeout(() => api.current.go(), IDLE_MS)
      })

    // ---- Part 2: fold flat, beam, push down into the site -----------------------
    const unfold = () => {
      window.clearTimeout(idleTimer)
      float?.kill()
      setHint(false)
      return gsap
        .timeline({
          defaults: { ease: 'power2.inOut' },
          onComplete: () => {
            gsap.ticker.remove(tick)
            callbacks.current.onDone()
          },
        })
        .to(laptop.position, { y: 0, duration: 0.5 }, 0)
        .to(lidPivot.rotation, { x: -Math.PI / 2, duration: 1.3 }, 0)
        .to(laptop.rotation, { y: -0.12, duration: 1.4 }, 0)
        .to(camera.position, { x: 0, y: 7.4, z: 4.4, duration: 1.5 }, 0)
        .to(target, { y: 0, z: -0.6, duration: 1.5 }, 0)
        // The light breaks out of the screen...
        .to(s.hotMat, { opacity: 1, duration: 0.45, ease: 'power2.in' }, 1.05)
        .to(s.beamMat.uniforms.uIntensity, { value: 1.25, duration: 0.3, ease: 'power1.out' }, 1.3)
        .to(s.core.material.uniforms.uIntensity, { value: 1.4, duration: 0.3, ease: 'power1.out' }, 1.3)
        .to(beamLen, { v: 22, duration: 0.85, ease: 'expo.out' }, 1.3)
        .to(s.glow.material, { opacity: 1, duration: 0.4 }, 1.3)
        .to(s.glow.scale, { x: 9, y: 9, z: 9, duration: 1, ease: 'expo.out' }, 1.3)
        .to(s.fill, { intensity: 60, duration: 0.4 }, 1.3)
        // ...and drives the laptop down, into the page.
        .to(laptop.position, { y: -6.5, duration: 1.15, ease: 'power3.in' }, 1.6)
        .to(laptop.rotation, { x: 0.25, duration: 1.15, ease: 'power2.in' }, 1.6)
        .add(() => callbacks.current.onReveal(), 2.05)
        .to(root.current, { opacity: 0, yPercent: -6, duration: 0.9, ease: 'power2.inOut' }, 2.05)
    }

    api.current.go = (speed = 1) => {
      if (started) return
      started = true
      if (open.isActive()) {
        // Scrolled before the laptop finished opening: finish quickly, then carry on.
        open.timeScale(2.6).eventCallback('onComplete', () => unfold().timeScale(speed))
      } else {
        unfold().timeScale(speed)
      }
    }
    api.current.skip = () => {
      if (!started) api.current.go(2.4)
    }
  }

  // ---- Input: one gesture is enough -------------------------------------------
  useEffect(() => {
    let touchY = null
    const go = () => api.current.go()
    const onWheel = (e) => e.deltaY > 4 && go()
    const onKey = (e) => {
      if (KEYS.has(e.key) && (e.target === document.body || e.target === root.current)) {
        e.preventDefault()
        go()
      }
    }
    const onTouchStart = (e) => (touchY = e.touches[0].clientY)
    const onTouchMove = (e) => touchY !== null && touchY - e.touches[0].clientY > 24 && go()
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <div className="opening" ref={root} onClick={() => api.current.go()}>
      <div className="opening-stage" ref={host} aria-hidden="true" />
      <button
        type="button"
        className="opening-skip"
        onClick={(e) => {
          e.stopPropagation()
          api.current.skip()
        }}
      >
        Skip intro
      </button>
      <button type="button" className={`opening-hint${hint ? ' is-shown' : ''}`} aria-label="Open the site">
        <span>Scroll to open</span>
        <i />
      </button>
    </div>
  )
}

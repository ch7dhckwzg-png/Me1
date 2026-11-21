import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import logo from '@/assets/logo.svg'

/*
 * Opening animation, built in CSS 3D and animated with GSAP (transforms and opacity
 * only, so it stays on the compositor and runs at the display's frame rate).
 *
 * 1. On load: a closed laptop opens, its screen lights up with the logo, and it
 *    turns to the side. It then floats, waiting.
 * 2. One scroll (or swipe, key, click, or 5 s of waiting): it turns back to face
 *    you, the two halves of the screen fold out like doors, light pours out, the
 *    camera flies through it, and the light pushes down to reveal the site.
 */

const KEYS = new Set(['ArrowDown', 'PageDown', ' ', 'Enter', 'Spacebar'])
const IDLE_MS = 5000

export default function Intro({ onIdle, onReveal, onDone, heroReady = false }) {
  const root = useRef(null)
  const callbacks = useRef({ onIdle, onReveal, onDone })
  useEffect(() => {
    callbacks.current = { onIdle, onReveal, onDone }
  })
  const go = useRef(() => {})
  const skip = useRef(() => {})
  const resume = useRef(() => {})

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      let idleTimer = 0
      let bob = null
      let started = false

      gsap.set(q('.lt-float'), { yPercent: -18 })
      gsap.set(q('.lt'), { rotationX: -24, scale: 0.9 })
      gsap.set(q('.lt-lid'), { rotationX: -88 })
      gsap.set([q('.lt-half--l'), q('.lt-half--r')], { z: 1 })
      gsap.set([q('.intro-rays'), q('.intro-glow')], { autoAlpha: 0, scale: 0.15 })

      // ---- Part 1: plays on load --------------------------------------------
      const open = gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(q('.intro-scene'), { autoAlpha: 0, y: 40, duration: 0.8 })
        .to(q('.lt'), { scale: 1, duration: 1.3 }, 0.1)
        .to(q('.lt-lid'), { rotationX: 10, duration: 1.35, ease: 'power2.inOut' }, 0.35)
        .to(q('.lt-screen-on'), { opacity: 1, duration: 0.7, ease: 'power1.out' }, 1.1)
        .to(q('.lt'), { rotationY: -32, rotationX: -14, duration: 1.5, ease: 'power2.inOut' }, 1.2)
        .from(q('.intro-caption'), { autoAlpha: 0, y: 12, duration: 0.7 }, 1.9)
        .from(q('.intro-hint'), { autoAlpha: 0, duration: 0.6 }, 2.3)
        .add(() => {
          bob = gsap.to(q('.lt-float'), {
            y: -10,
            duration: 2.4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
          idleTimer = window.setTimeout(() => go.current(), IDLE_MS)
          // The laptop is open and waiting: a quiet moment for the hero to get ready.
          callbacks.current.onIdle?.()
        })

      // ---- Part 2: unfold, light, push into the site ------------------------
      let holdTimer = 0
      const unfold = () => {
        window.clearTimeout(idleTimer)
        bob?.kill()
        return gsap
          .timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => callbacks.current.onDone() })
          .to([q('.intro-caption'), q('.intro-hint')], { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, 0)
          .to(q('.lt-float'), { y: 0, yPercent: 0, duration: 0.9 }, 0)
          .to(q('.lt'), { rotationY: 0, rotationX: 0, scale: 1.25, duration: 0.9 }, 0)
          .to(q('.lt-lid'), { rotationX: 0, duration: 0.9 }, 0)
          .to([q('.lt-base'), q('.lt-shadow')], { opacity: 0, duration: 0.5, ease: 'power1.out' }, 0.1)
          .to(q('.lt-light'), { opacity: 1, duration: 0.45, ease: 'power1.in' }, 0.55)
          .to(q('.lt-half--l'), { rotationY: -112, duration: 0.95 }, 0.6)
          .to(q('.lt-half--r'), { rotationY: 112, duration: 0.95 }, 0.6)
          .to(q('.intro-glow'), { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.7)
          .to(q('.intro-rays'), { autoAlpha: 1, scale: 1, rotation: 24, duration: 1.3, ease: 'power2.out' }, 0.85)
          .to(q('.lt'), { scale: 6, duration: 0.85, ease: 'power3.in' }, 1.05)
          .to(q('.intro-flash'), { opacity: 1, duration: 0.45, ease: 'power2.in' }, 1.2)
          .add(() => {
            const behind = [q('.intro-scene'), q('.intro-rays'), q('.intro-glow')]
            gsap.killTweensOf(behind)
            gsap.set(root.current, { backgroundColor: 'transparent' })
            gsap.set(behind, { autoAlpha: 0 })
            callbacks.current.onReveal()
            // Hold on the full-screen flash while the hero sets up its 3D scene, so that
            // one-off cost is hidden. It resumes when the hero is ready, or after 1.5 s.
            const tl = gsap.getTweensOf(q('.intro-flash'))[0]?.parent
            if (tl) {
              tl.pause()
              resume.current = () => {
                window.clearTimeout(holdTimer)
                resume.current = () => {}
                tl.play()
              }
              holdTimer = window.setTimeout(() => resume.current(), 1500)
            }
          }, 1.65)
          .to(q('.intro-flash'), { yPercent: 100, duration: 1.05, ease: 'power2.inOut' }, 1.7)
      }

      go.current = (speed = 1) => {
        if (started) return
        started = true
        callbacks.current.onIdle?.()
        if (open.isActive()) {
          // Scrolled before the laptop finished opening: finish quickly, then continue.
          open.timeScale(2.6).eventCallback('onComplete', () => unfold().timeScale(speed))
        } else {
          unfold().timeScale(speed)
        }
      }

      skip.current = () => {
        if (!started) go.current(2.2)
        else gsap.getTweensOf(q('.intro-flash')).forEach((t) => t.parent?.timeScale(2.2))
      }

      // ---- Input: one gesture is enough ------------------------------------
      let touchY = null
      const onWheel = (e) => e.deltaY > 4 && go.current()
      const onKey = (e) => KEYS.has(e.key) && (e.preventDefault(), go.current())
      const onTouchStart = (e) => (touchY = e.touches[0].clientY)
      const onTouchMove = (e) => touchY !== null && touchY - e.touches[0].clientY > 24 && go.current()

      window.addEventListener('wheel', onWheel, { passive: true })
      window.addEventListener('keydown', onKey)
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: true })

      return () => {
        window.clearTimeout(idleTimer)
        window.clearTimeout(holdTimer)
        window.removeEventListener('wheel', onWheel)
        window.removeEventListener('keydown', onKey)
        window.removeEventListener('touchstart', onTouchStart)
        window.removeEventListener('touchmove', onTouchMove)
      }
    },
    { scope: root },
  )

  useEffect(() => {
    if (heroReady) resume.current()
  }, [heroReady])

  const screen = (side) => (
    <div className={`lt-half lt-half--${side}`}>
      <div className="lt-face">
        <div className="lt-screen">
          <div className="lt-screen-on">
            <div className="lt-logo">
              <img src={logo} alt="" width="1275" height="477" />
            </div>
          </div>
        </div>
      </div>
      <div className="lt-face lt-face--back" />
    </div>
  )

  return (
    <div className="opening" ref={root} onClick={() => go.current()}>
      <div className="intro-scene" aria-hidden="true">
        <div className="lt-shadow" />
        <div className="lt-float">
          <div className="lt">
            <div className="lt-base" />
            <div className="lt-lid">
              <div className="lt-lid-back">
                <img src={logo} alt="" width="1275" height="477" />
              </div>
              <div className="lt-light" />
              {screen('l')}
              {screen('r')}
            </div>
          </div>
        </div>
        <p className="intro-caption">Marketing, design, web and photography.</p>
      </div>

      <div className="intro-glow" aria-hidden="true" />
      <div className="intro-rays" aria-hidden="true" />
      <div className="intro-flash" aria-hidden="true" />

      <button
        type="button"
        className="intro-skip"
        onClick={(e) => {
          e.stopPropagation()
          skip.current()
        }}
      >
        Skip intro
      </button>
      <button type="button" className="intro-hint" aria-label="Open the site">
        <span>Scroll</span>
        <i />
      </button>
    </div>
  )
}

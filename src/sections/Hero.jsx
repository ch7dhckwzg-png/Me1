import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import HeroStar from '@/components/HeroStar'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { MAILTO } from '@/content'
import logo from '@/assets/logo.svg'

// three.js lives in its own chunk so the page opens fast. It is fetched while the intro
// idles, and the scene is created at the reveal, under the full-screen flash, where its
// one-off setup cost cannot be seen.
const loadStarScene = () => import('@/components/StarScene')
const StarScene = lazy(loadStarScene)

export default function Hero({ reducedMotion, prepare = true, ready = true, onSceneReady }) {
  const scope = useRef(null)
  const entrance = useRef(null)
  const [webgl, setWebgl] = useState(true)
  const onFail = useCallback(() => setWebgl(false), [])
  const use3d = webgl && !reducedMotion
  const readyCb = useRef(onSceneReady)
  useEffect(() => {
    readyCb.current = onSceneReady
  })
  const onReady = useCallback(() => readyCb.current?.(), [])

  // Built straight away so the start states hide everything, then held until `ready`.
  useGSAP(
    () => {
      if (reducedMotion) return
      entrance.current = gsap
        .timeline({ paused: true })
        // The headline slams in, line by line, leaning into the motion.
        .from('.hero-title .line > span', {
          xPercent: -108,
          skewX: 28,
          duration: 0.9,
          stagger: 0.09,
          ease: 'expo.out',
        }, 0.15)
        .from('.hero-side > *', { y: 26, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.55)
        .from('.nav', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.5)
        .from('.hero-fallback', { scale: 0.6, opacity: 0, duration: 1.1, ease: 'back.out(1.6)' }, 0.1)

      // Leaving the hero: the headline is pulled away sideways as you scroll.
      gsap.to('.hero-title .line:nth-child(1)', {
        xPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: 0.4 },
      })
      gsap.to('.hero-title .line:nth-child(2)', {
        xPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: 0.4 },
      })
    },
    { scope, dependencies: [reducedMotion] },
  )

  useEffect(() => {
    if (ready) entrance.current?.play()
  }, [ready, reducedMotion])

  useEffect(() => {
    if (prepare && use3d) loadStarScene()
  }, [prepare, use3d])

  // Without the 3D scene there is nothing to wait for.
  useEffect(() => {
    if (ready && !use3d) readyCb.current?.()
  }, [ready, use3d])

  return (
    <header className="hero" id="home" ref={scope}>
      <div className="hero-stage">
        {use3d ? (
          ready && (
            <Suspense fallback={null}>
              <StarScene go={ready} onFail={onFail} onReady={onReady} />
            </Suspense>
          )
        ) : (
          <div className="hero-fallback">
            <HeroStar />
          </div>
        )}
      </div>

      <nav className="nav" aria-label="Main">
        <a className="logo" href="#home">
          <img src={logo} width="1275" height="477" alt="Catalyze, back to top" />
        </a>
        <ul>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a className="btn btn-light nav-cta" href={MAILTO}>Email us</a>
      </nav>

      <div className="hero-main">
        <div className="hero-side">
          <p className="hero-sub">
            Marketing, design, web and photography from one studio. We speed up the reaction
            between your business and the people it’s for.
          </p>
          <div className="cta">
            {/* Magic UI shimmer: a slow light runs round the main action. */}
            <ShimmerButton
              as="a"
              href={MAILTO}
              className="btn-shimmer"
              background="#E4CFA6"
              shimmerColor="#FFFFFF"
              shimmerDuration="3.5s"
              shimmerSize="0.1em"
            >
              Email us
            </ShimmerButton>
            <a className="btn btn-ghost" href="#services">See what we do</a>
          </div>
        </div>
        <h1 className="hero-title">
          <span className="line"><span>Made to</span></span>
          <span className="line"><span>be noticed.</span></span>
        </h1>
      </div>
    </header>
  )
}

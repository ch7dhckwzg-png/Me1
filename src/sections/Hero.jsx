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
        // The headline rises through its masks, line by line.
        .from('.hero-title .line > span', { yPercent: 105, duration: 1.3, stagger: 0.12, ease: 'expo.out' }, 0.25)
        .from('.hero-side > *', { y: 26, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.55)
        .from('.nav', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.5)
        .from('.hero-fallback', { scale: 0.6, opacity: 0, duration: 1.1, ease: 'back.out(1.6)' }, 0.1)

      // Leaving the hero: the headline drifts up and fades, a little slower than the page.
      gsap.to('.hero-title', {
        yPercent: -18,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: 0.5 },
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
          prepare && (
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
          <li><a href="#work">Work</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a className="btn btn-light nav-cta" href={MAILTO}>Start a project</a>
      </nav>

      <div className="hero-main">
        <div className="hero-side">
          <p className="hero-sub">
            Catalyze is a creative studio for businesses that want to look as good as they are.
            Branding, websites, photography and motion, made by one team so it all fits together.
          </p>
          <div className="cta">
            {/* Magic UI shimmer: a slow light runs round the main action. */}
            <ShimmerButton
              as="a"
              href={MAILTO}
              className="btn-shimmer"
              background="#D2642C"
              shimmerColor="#FFE3CC"
              shimmerDuration="3.5s"
              shimmerSize="0.1em"
            >
              Start a project
            </ShimmerButton>
            <a className="btn btn-ghost" href="#work">See our work</a>
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

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import HeroStar from '@/components/HeroStar'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import RotatingBadge from '@/components/kinetic/RotatingBadge'
import { MAILTO } from '@/content'
import logo from '@/assets/logo.svg'

// three.js lives in its own chunk so the page opens fast. It is fetched while the intro
// idles, and the scene is created at the reveal, under the full-screen flash, where its
// one-off setup cost cannot be seen.
gsap.registerPlugin(SplitText)

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
        // The lead-in rises in calmly; "MADE TO BE NOTICED." kicks up letter by letter.
        .from('.hero-title .line-serif > span', { yPercent: 105, duration: 1.2, ease: 'expo.out' }, 0.2)
        .from(
          SplitText.create('.hero-title .line-bold > span', { type: 'words,chars' }).chars, // words first, so no word breaks across lines
          { yPercent: 115, skewY: 8, duration: 0.9, stagger: 0.035, ease: 'expo.out' },
          0.45,
        )
        .from('.badge-spin', { scale: 0, rotation: -120, duration: 1, ease: 'back.out(1.6)' }, 1.1)
        .from('.hero-side > *', { y: 26, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.55)
        .from('.nav', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.5)
        .from('.hero-fallback', { scale: 0.6, opacity: 0, duration: 1.1, ease: 'back.out(1.6)' }, 0.1)

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
          <img src={logo} width="1286" height="488" alt="Catalyze, back to top" />
        </a>
        <ul>
          <li><a href="#services">Services</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a className="btn btn-primary nav-cta" href={MAILTO}>Start a project</a>
      </nav>

      <RotatingBadge href={MAILTO} className="hero-badge" />

      <div className="hero-main">
        <div className="hero-side">
          <p className="hero-sub">
            Catalyze is a creative studio for businesses that want to look as good as they are.
            One team designs your brand, builds your website and shoots your photos, so it all
            fits together.
          </p>
          <div className="cta">
            {/* Magic UI shimmer: a slow light runs round the main action. */}
            <ShimmerButton
              as="a"
              href={MAILTO}
              className="btn-shimmer"
              background="#FF6E00"
              shimmerColor="#FFF1E3"
              shimmerDuration="3.5s"
              shimmerSize="0.1em"
              borderRadius="6px"
            >
              Start a project
            </ShimmerButton>
            <a className="btn btn-ghost" href="#work">See our work</a>
          </div>
        </div>
        <h1 className="hero-title">
          <span className="line line-serif"><span>Branding, websites, photography and motion,</span></span>{' '}
          <span className="line line-bold"><span>made to be <span className="accent-word">noticed.</span></span></span>
        </h1>
      </div>
    </header>
  )
}

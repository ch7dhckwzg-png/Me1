import { useEffect, useRef, useState } from 'react'
import { Player } from '@remotion/player'
import { CatalyzeIntro } from '@/remotion/CatalyzeIntro'
import { AUTOPLAY_END, DURATION, FPS } from '@/remotion/timing'

// The composition is always 1080 high and as wide as the viewport's aspect ratio,
// so it fills the screen on any device without letterboxing.
const compositionSize = () => ({
  width: Math.round(Math.min(2600, Math.max(480, (1080 * window.innerWidth) / window.innerHeight))),
  height: 1080,
})

/**
 * Opening animation. The first 2.5 s play on their own; after that the story is
 * scrubbed by scroll: the section is tall and the Player is sticky inside it, so
 * scrolling through the section moves through the frames, then releases into the hero.
 */
export default function Intro() {
  const section = useRef(null)
  const player = useRef(null)
  const [size, setSize] = useState(compositionSize)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let timer
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setSize(compositionSize()), 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    let raf = 0
    let start = 0
    let shown = 0
    let lastSeek = -1
    let hintGone = false
    let cancelled = false

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const el = section.current
      if (!el || !player.current) return

      const rect = el.getBoundingClientRect()
      if (rect.bottom < -50) return // scrolled well past: nothing to draw

      const travel = rect.height - window.innerHeight
      const progress = Math.min(1, Math.max(0, -rect.top / travel))
      const auto = Math.min(AUTOPLAY_END, ((now - start) / 1000) * FPS)
      const fromScroll = AUTOPLAY_END + progress * (DURATION - 1 - AUTOPLAY_END)
      const target = progress > 0.002 ? Math.max(auto, fromScroll) : auto

      // Ease towards the target so jumps (a fast flick, an anchor link) still glide.
      shown += (target - shown) * 0.22
      if (Math.abs(target - shown) < 0.05) shown = target

      const frame = Math.round(shown)
      if (frame !== lastSeek) {
        player.current.seekTo(frame)
        lastSeek = frame
      }

      if (!hintGone && progress > 0.01) {
        hintGone = true
        setScrolled(true)
      }
    }

    // Wait (briefly) for the display font so the first headline never flashes in a fallback.
    const fontReady = Promise.race([
      document.fonts?.load("400 1em 'Saira Stencil One'") ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 900)),
    ])
    fontReady.then(() => {
      if (cancelled) return
      start = performance.now()
      raf = requestAnimationFrame(tick)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="intro-reel" ref={section} aria-label="Intro animation">
      <div className="intro-stage">
        <div className="intro-player" aria-hidden="true">
          <Player
            ref={player}
            component={CatalyzeIntro}
            durationInFrames={DURATION}
            fps={FPS}
            compositionWidth={size.width}
            compositionHeight={size.height}
            style={{ width: '100%', height: '100%' }}
            controls={false}
            clickToPlay={false}
            doubleClickToFullscreen={false}
            spaceKeyToPlayOrPause={false}
            moveToBeginningWhenEnded={false}
            // Remotion is free for individuals and companies of up to 3 people.
            // Larger teams need a company licence: https://remotion.dev/license
            acknowledgeRemotionLicense
          />
        </div>

        <a className="intro-skip" href="#home">
          Skip intro
        </a>
        <div className={`intro-hint${scrolled ? ' is-gone' : ''}`} aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  )
}

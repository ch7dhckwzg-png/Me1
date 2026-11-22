import { useEffect, useState } from 'react'
import SculptureHero from '@/components/ui/liquid-sculpture-hero'
import spark from '@/assets/hero/spark.webp'

/*
 * The hero's backdrop: the Catalyze spark rebuilt from ~100k GPU particles
 * (src/components/ui/liquid-sculpture-hero.tsx). It assembles once when it mounts,
 * then rests as a crisp, still image. Per the site rules it never reacts to the
 * cursor (interactive={false}), uses the site's own fonts and copy (none of the
 * component's own text is shown) and shows no credit badge.
 * Without WebGL2 the component shows the static spark image instead.
 */

// Where the spark sits: centred under the hero copy, like a product shot.
function placement(w) {
  if (w >= 1024) return { scale: 0.56, mobileScale: 1, x: 0, y: 22 }
  if (w >= 640) return { scale: 0.4, mobileScale: 1, x: 0, y: 22 }
  return { scale: 1, mobileScale: 0.74, x: 0, y: 26 } // phones
}

export default function ParticleSpark() {
  const [place, setPlace] = useState(() => placement(window.innerWidth))

  useEffect(() => {
    const onResize = () => setPlace(placement(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const none = { label: '', href: '' }
  return (
    <div className="particle-spark" aria-hidden="true">
      <SculptureHero
        src={spark}
        darkSrc={spark}
        mobileSrc={spark}
        mobileDarkSrc={spark}
        imageAlt=""
        showNav={false}
        eyebrow=""
        headline=""
        headlineAccent=""
        body=""
        primaryCta={none}
        secondaryCta={none}
        hint=""
        hintTouch=""
        background="transparent"
        themeToggle={false}
        loadFonts={false}
        interactive={false}
        intro
        ambient={false}
        restStyle="image"
        streaks
        backdropText=""
        showCredit={false}
        height="100%"
        sculptureScale={place.scale}
        mobileSculptureScale={place.mobileScale}
        sculptureX={place.x}
        sculptureY={place.y}
      />
    </div>
  )
}

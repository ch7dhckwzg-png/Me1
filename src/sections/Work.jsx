import { useRef, useState } from 'react'
import Tabs from '@/components/Tabs'
import Lightbox from '@/components/Lightbox'
import GiantWord from '@/components/kinetic/GiantWord'
import Spark from '@/components/kinetic/Spark'
import ProductAnim from '@/components/motion/ProductAnim'
import StoreWalk from '@/components/motion/StoreWalk'
import LogoAnim from '@/components/motion/LogoAnim'
import useAutoplay from '@/components/motion/useAutoplay'
import { PHOTOGRAPHY, WEBSITES, PACKAGES, DEMO_URL } from '@/content'
import '@/styles/work.css'

// Rendered from design/work/*.html by scripts/render-work.cjs.
const IMG = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/work/*.webp', { eager: true, import: 'default' })).map(([path, url]) => [
    path.split('/').pop().replace('.webp', ''),
    url,
  ]),
)

// Intrinsic sizes, so tiles hold their shape before the image arrives (no layout shift).
const SIZE = (file) =>
  file.startsWith('logo') ? [1200, 900]
  : file.startsWith('menu') || file === 'graphic-poster' ? [1240, 1754]
  : file === 'graphic-social' ? [1800, 1000]
  : [1600, 1000]

const DESIGN = {
  logos: {
    label: 'Logos',
    lead: 'Marks that work as hard on a coffee cup as they do on a shop front.',
    items: [
      { file: 'logo-norde', caption: 'Norde, coffee roasters', alt: 'Norde logo: a coffee bean mark beside a lowercase serif wordmark' },
      { file: 'logo-lumen', caption: 'Lumen, skincare', alt: 'Lumen logo: widely spaced serif capitals under a rising-sun line' },
      { file: 'logo-oak', caption: 'Oak & Iron, barbers', alt: 'Oak & Iron logo: a brass ring badge with condensed capitals' },
      { file: 'logo-ember', caption: 'Ember, wood-fired kitchen', alt: 'Ember logo: an orange flame above a serif wordmark' },
    ],
  },
  menus: {
    label: 'Menus',
    lead: 'Menus that are a pleasure to read, quick to scan and easy to update.',
    items: [
      { file: 'menu-ember', caption: 'Ember, dinner menu', alt: 'Ember dinner menu with small plates, dishes from the fire and desserts' },
      { file: 'menu-norde', caption: 'Norde, café menu', alt: 'Norde café menu on dark brown with espresso, filter and pastry prices' },
      { file: 'menu-marlow', caption: 'Marlow, cocktail list', alt: 'Marlow cocktail list in cream and brass on bottle green' },
    ],
  },
  graphic: {
    label: 'Graphic design',
    lead: 'Posters, social posts and packaging, all in the same voice as the brand.',
    items: [
      { file: 'graphic-poster', caption: 'Ember, supper club poster', alt: 'Supper Club event poster with a glowing flame and event details', tall: true },
      { file: 'graphic-social', caption: 'Lumen, social media set', alt: 'Three square Lumen social media posts' },
      { file: 'graphic-packaging', caption: 'Norde, coffee packaging', alt: 'Front and back of a Norde coffee bag' },
    ],
  },
}

function Websites() {
  return (
    <div className="work-block" id="work-web">
      <header className="block-head">
        <h3 className="display-sm">Websites</h3>
        <p className="lead">Fast, easy to use and designed around what your customers came to do.</p>
      </header>
      <div className="sites">
        {WEBSITES.map((site, i) => (
          <article className={`site${i % 2 ? ' is-flipped' : ''}`} key={site.id}>
            <div className="site-devices">
              <div className="browser">
                <div className="browser-bar" aria-hidden="true">
                  <i /><i /><i />
                  <span>{site.name.toLowerCase().replace(/\W+/g, '')}.co.uk</span>
                </div>
                <img
                  src={IMG[`web-${site.id}-desktop`]}
                  width="1440"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  alt={`${site.name} website on desktop`}
                />
              </div>
              <div className="phone">
                <img
                  src={IMG[`web-${site.id}-phone`]}
                  width="390"
                  height="844"
                  loading="lazy"
                  decoding="async"
                  alt={`${site.name} website on a phone`}
                />
              </div>
            </div>
            <div className="site-copy">
              <p className="site-kind">{site.kind}</p>
              <h4 className="display-sm">{site.name}</h4>
              <p>{site.body}</p>
              <ul className="tags">
                {site.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {site.id === 'oak' && (
                <a className="btn btn-primary site-demo" href={`${DEMO_URL}/`} target="_blank" rel="noopener">
                  Try the live demos
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="packages" id="web-packages">
        <header className="packages-head">
          <p className="site-kind">Website packages</p>
          <h4 className="display-sm">One shop, four packages</h4>
          <p>
            We built Oak &amp; Iron at every level we offer. Each package adds to the one before, so you can see
            exactly what you get. Open them on your phone.
          </p>
        </header>
        <ol className="pkg-list">
          {PACKAGES.map((p, i) => (
            <li className="pkg" key={p.id}>
              <span className="pkg-n" aria-hidden="true">{`0${i + 1}`}</span>
              <h5 className="pkg-name">{p.name}</h5>
              <p>{p.body}</p>
              <a
                className="btn btn-ghost pkg-go"
                href={`${DEMO_URL}/${p.id}/`}
                target="_blank"
                rel="noopener"
                aria-label={`View the ${p.name} demo (opens in a new tab)`}
              >
                View demo
              </a>
            </li>
          ))}
        </ol>
        <a className="pkg-all" href={`${DEMO_URL}/`} target="_blank" rel="noopener">
          See all four side by side
        </a>
      </div>
    </div>
  )
}

const Aperture = () => (
  <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true">
    <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="1.4" />
    {Array.from({ length: 6 }, (_, i) => (
      <path
        key={i}
        d="M24 3 L33 20"
        stroke="currentColor"
        strokeWidth="1.4"
        transform={`rotate(${i * 60} 24 24)`}
      />
    ))}
    <circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

function Photography() {
  const [tab, setTab] = useState(PHOTOGRAPHY[0].id)
  return (
    <div className="work-block" id="work-photo">
      <header className="block-head">
        <h3 className="display-sm">Photography</h3>
        <p className="lead">Shot and edited to match your brand, so every image feels like it came from the same place.</p>
      </header>
      <Tabs label="Photography" tabs={PHOTOGRAPHY} active={tab} onChange={setTab}>
        {(id) => {
          const cat = PHOTOGRAPHY.find((c) => c.id === id)
          return (
            <>
              <p className="tab-lead">{cat.lead}</p>
              <ul className={`photos photos-${cat.id}`}>
                {cat.shots.map((shot) => (
                  <li className="photo" key={shot.title}>
                    {shot.src ? (
                      <img src={shot.src} alt={`${cat.label}: ${shot.title}`} loading="lazy" decoding="async" />
                    ) : (
                      <div className="photo-slot">
                        <Aperture />
                        <em>Photo coming soon</em>
                      </div>
                    )}
                    <div className="photo-cap">
                      <b>{shot.title}</b>
                      <span>{shot.note}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )
        }}
      </Tabs>
    </div>
  )
}

function Design({ onOpen }) {
  const [tab, setTab] = useState('logos')
  const tabs = Object.entries(DESIGN).map(([id, d]) => ({ id, label: d.label }))
  return (
    <div className="work-block" id="work-design">
      <header className="block-head">
        <h3 className="display-sm">Design</h3>
        <p className="lead">Logos, menus and graphics with the care of a luxury brand, made for real businesses.</p>
      </header>
      <Tabs label="Design" tabs={tabs} active={tab} onChange={setTab}>
        {(id) => (
          <>
            <p className="tab-lead">{DESIGN[id].lead}</p>
            <ul className={`designs designs-${id}`}>
              {DESIGN[id].items.map((it) => (
                <li key={it.file} className={it.tall ? 'is-tall' : ''}>
                  <button
                    type="button"
                    className="design-tile"
                    onClick={() => onOpen({ src: IMG[it.file], alt: it.alt, caption: it.caption })}
                    aria-label={`View larger: ${it.caption}`}
                  >
                    <img
                      src={IMG[it.file]}
                      alt={it.alt}
                      width={SIZE(it.file)[0]}
                      height={SIZE(it.file)[1]}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                  <p className="design-cap">{it.caption}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </Tabs>
    </div>
  )
}

function MotionCard({ title, note, children, reducedMotion }) {
  const ref = useRef(null)
  const { playing, wanted, toggle } = useAutoplay(ref, reducedMotion)
  return (
    <li className="motion-card" ref={ref}>
      <div className={`motion-stage${playing ? ' is-playing' : ''}`}>{children}</div>
      <div className="motion-cap">
        <div>
          <b>{title}</b>
          <span>{note}</span>
        </div>
        <button type="button" className="play" onClick={toggle} aria-pressed={wanted} aria-label={`${wanted ? 'Pause' : 'Play'} ${title.toLowerCase()}`}>
          {wanted ? (
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor" /></svg>
          )}
        </button>
      </div>
    </li>
  )
}

function Motion({ reducedMotion }) {
  return (
    <div className="work-block" id="work-motion">
      <header className="block-head">
        <h3 className="display-sm">Motion</h3>
        <p className="lead">Animation that shows people what you do before they’ve read a word.</p>
      </header>
      <ul className="motions">
        <MotionCard title="Product animation" note="Lumen, Serum 02" reducedMotion={reducedMotion}>
          <ProductAnim />
        </MotionCard>
        <MotionCard title="Store walk-through" note="Norde, café" reducedMotion={reducedMotion}>
          <StoreWalk />
        </MotionCard>
        <MotionCard title="Animated logo" note="Ember, kitchen" reducedMotion={reducedMotion}>
          <LogoAnim />
        </MotionCard>
      </ul>
    </div>
  )
}

export default function Work({ reducedMotion, level = 2 }) {
  const H = `h${level}`
  const [open, setOpen] = useState(null)
  return (
    <section className="section work" id="work">
      <GiantWord>
        The work <Spark className="giant-spark" outline /> The work
      </GiantWord>
      <div className="wrap">
        <header className="section-head">
          <H className="display">A taste of what we <span className="accent-word">make</span></H>
          <p className="lead">
            The brands below are concept projects, created by Catalyze to show our range. Yours could be next.
          </p>
          <nav className="work-nav" aria-label="Work">
            <a href="#work-web">Websites</a>
            <a href="#work-photo">Photography</a>
            <a href="#work-design">Design</a>
            <a href="#work-motion">Motion</a>
          </nav>
        </header>
        <Websites />
        <Photography />
        <Design onOpen={setOpen} />
        <Motion reducedMotion={reducedMotion} />
      </div>
      <Lightbox item={open} onClose={() => setOpen(null)} />
    </section>
  )
}

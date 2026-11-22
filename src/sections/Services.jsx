import Chevron from '@/components/Chevron'
import { SERVICES } from '@/content'
import webShot from '@/assets/work/web-norde-desktop.webp'
import logoShot from '@/assets/work/logo-ember.webp'
import menuShot from '@/assets/work/menu-marlow.webp'

// Concept work shown inside the tiles (see the Work section for the full pieces).
const VISUAL = {
  web: { src: webShot, w: 1440, h: 900 },
  brand: { src: logoShot, w: 1200, h: 900 },
  graphic: { src: menuShot, w: 1240, h: 1754 },
}

// "Logo design, brand guidelines, ..." (acronyms like SEO keep their capitals).
const sentence = (items) =>
  items.map((x, i) => (i === 0 || x === x.toUpperCase() ? x : x[0].toLowerCase() + x.slice(1))).join(', ') + '.'

// Bento layout: web design leads, then the rest.
const ORDER = ['web', 'brand', 'graphic', 'photo', 'motion', 'marketing']

/** Every service as a tile: what it is, what's included, and where to see examples. */
export default function Services() {
  const services = ORDER.map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean)
  return (
    <section className="section services" id="services">
      <div className="wrap">
        <header className="section-head centered">
          <h2 className="display">Everything your brand needs to be seen.</h2>
          <p className="lead">Choose one service, or bring us in for the lot. Whatever we make is designed to work together.</p>
        </header>
        <ul className="bento">
          {services.map((s) => {
            const v = VISUAL[s.id]
            return (
              <li className={`tile tile-${s.id}${v ? ' has-visual' : ''}`} key={s.id}>
                <div className="tile-copy">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <p className="tile-includes">{sentence(s.includes)}</p>
                  {s.example && (
                    <a className="text-link" href={s.example.href}>
                      {s.example.label} <Chevron />
                    </a>
                  )}
                </div>
                {v && (
                  <div className="tile-visual">
                    <img src={v.src} width={v.w} height={v.h} alt="" loading="lazy" decoding="async" />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

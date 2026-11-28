import { PAGES, pageHref } from '@/pages'

/** Home page: a way into each page. Contact follows straight after, so it isn't repeated here. */
export default function Explore() {
  return (
    <section className="section explore" aria-labelledby="explore-h">
      <div className="wrap">
        <header className="section-head">
          <h2 className="display" id="explore-h">Have a look <span className="accent-word">around</span></h2>
        </header>
        <ul className="explore-list">
          {PAGES.filter((p) => p.slug !== 'contact').map((p, i) => (
            <li key={p.slug}>
              <a className="explore-card" href={pageHref(p.slug)}>
                <span className="explore-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="explore-name">
                  {p.label}
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                    <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="explore-blurb">{p.blurb}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

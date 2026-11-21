import { useEffect } from 'react'
import SiteFooter from '@/components/SiteFooter'
import { MAILTO } from '@/content'
import { UPDATED } from '@/legal'
import logo from '@/assets/logo.svg'

/** A plain, readable page for the privacy policy and terms. */
export default function LegalPage({ title, sections }) {
  useEffect(() => {
    document.title = `${title} | Catalyze`
  }, [title])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="legal-header">
        <nav className="nav" aria-label="Main">
          <a className="logo" href="/">
            <img src={logo} width="1275" height="477" alt="Catalyze, home" />
          </a>
          <a className="btn btn-ghost nav-back" href="/">Back to the site</a>
          <a className="btn btn-primary nav-cta" href={MAILTO}>Start a project</a>
        </nav>
      </header>
      <main id="main" tabIndex={-1} className="legal">
        <div className="wrap legal-wrap">
          <h1 className="display">{title}</h1>
          <p className="legal-updated">Last updated {UPDATED}</p>
          {sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <SiteFooter base="/" />
    </>
  )
}

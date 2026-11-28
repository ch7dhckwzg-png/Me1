import { useEffect } from 'react'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'

/** The frame for the extra pages (legal, 404): header, optional breadcrumb, main, footer. */
export default function PageShell({ title, crumb, className = '', children }) {
  useEffect(() => {
    document.title = `${title} | Catalyze`
  }, [title])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="legal-header">
        <SiteNav />
      </header>
      <main id="main" tabIndex={-1} className={`legal ${className}`}>
        <div className="wrap legal-wrap">
          {crumb && (
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li><a href="/">Home</a></li>
                <li aria-current="page">{crumb}</li>
              </ol>
            </nav>
          )}
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

import { useEffect } from 'react'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'

/**
 * Header, main and footer for every page except the home page.
 * `crumb` adds a breadcrumb (Home / crumb) above the content.
 */
export default function PageShell({ title, crumb, className = '', children }) {
  useEffect(() => {
    document.title = `${title} | Catalyze`
  }, [title])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteNav base="/" />
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
      <SiteFooter base="/" />
    </>
  )
}

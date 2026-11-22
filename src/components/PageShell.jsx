import { useEffect } from 'react'
import SiteFooter from '@/components/SiteFooter'
import { MAILTO } from '@/content'
import logo from '@/assets/logo.svg'

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
      <header className="legal-header">
        <nav className="nav" aria-label="Main">
          <a className="logo" href="/">
            <img src={logo} width="1286" height="488" alt="Catalyze, home" />
          </a>
          <a className="btn btn-ghost nav-back" href="/">Back to the site</a>
          <a className="btn btn-primary nav-cta" href={MAILTO}>Start a project</a>
        </nav>
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
      <SiteFooter base="/" />
    </>
  )
}

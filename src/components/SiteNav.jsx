import { MAILTO } from '@/content'
import logo from '@/assets/logo.svg'

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#faq', label: 'Questions' },
]

/**
 * The global nav: thin, frosted and sticky on every page, with the main action always
 * one tap away (it doubles as the sticky call to action on phones).
 * `base` is '' on the home page and '/' elsewhere, so section links work from any page.
 */
export default function SiteNav({ base = '' }) {
  return (
    <header className="site-nav">
      <nav className="site-nav-inner" aria-label="Main">
        <a className="site-nav-logo" href={base || '#home'}>
          <img src={logo} width="1275" height="477" alt="Catalyze, home" />
        </a>
        <ul className="site-nav-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={`${base}${l.href}`}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a className="btn btn-primary btn-small" href={MAILTO}>Start a project</a>
      </nav>
    </header>
  )
}

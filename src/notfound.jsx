import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/instrument-serif/400.css'
import './index.css'
import PageShell from '@/components/PageShell'
import { MAILTO } from '@/content'

const LINKS = [
  { href: '/#services', label: 'Our services' },
  { href: '/#work', label: 'Our work' },
  { href: '/#process', label: 'How we work' },
  { href: '/#faq', label: 'Questions' },
]

function NotFound() {
  return (
    <PageShell title="Page not found" className="notfound">
      <h1 className="display">This page doesn’t exist.</h1>
      <p className="notfound-lead">The link may be old, or the address may have a typo. These will get you back on track:</p>
      <ul className="notfound-links">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
      <div className="cta">
        <a className="btn btn-primary" href="/">Go to the home page</a>
        <a className="btn btn-ghost" href={MAILTO}>Email us</a>
      </div>
    </PageShell>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotFound />
  </StrictMode>,
)

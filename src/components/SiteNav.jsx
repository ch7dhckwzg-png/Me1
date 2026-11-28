import { useEffect, useRef, useState } from 'react'
import { MAILTO } from '@/content'
import { PAGES, pageHref } from '@/pages'
import logo from '@/assets/logo.svg'

/**
 * The main menu, the same on every page. `current` is the slug of the page you are on
 * (none on the home page). On phones the links fold into a menu button.
 */
export default function SiteNav({ current }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const button = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    const onClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const wide = window.matchMedia('(min-width: 821px)')
    const onWide = () => setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    wide.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  return (
    <nav className={`nav${open ? ' is-open' : ''}`} aria-label="Main" ref={ref}>
      <a className="logo" href="/">
        <img src={logo} width="1286" height="488" alt="Catalyze, home" />
      </a>
      <ul id="site-menu">
        {PAGES.map((p) => (
          <li key={p.slug}>
            <a href={pageHref(p.slug)} aria-current={p.slug === current ? 'page' : undefined}>
              {p.label}
            </a>
          </li>
        ))}
      </ul>
      <a className="btn btn-primary nav-cta" href={MAILTO}>Start a project</a>
      <button
        ref={button}
        type="button"
        className="nav-menu-btn"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'Close menu' : 'Menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
          <path className="m1" d="M4 7h16" />
          <path className="m2" d="M4 12h16" />
          <path className="m3" d="M4 17h16" />
        </svg>
      </button>
    </nav>
  )
}

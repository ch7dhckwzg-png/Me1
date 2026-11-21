import { useEffect, useState } from 'react'
import { Dock, DockIcon } from '@/components/ui/dock'
import { MAILTO } from '@/content'

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((p) => (
      <path key={p} d={p} />
    ))}
  </svg>
)

const ITEMS = [
  { href: '#home', label: 'Back to top', d: ['M12 19V5', 'M5 12l7-7 7 7'] },
  { href: '#services', label: 'Services', d: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'] },
  { href: '#work', label: 'Work', d: ['M3 7h18v13H3z', 'M8 7V4h8v3'] },
  { href: '#process', label: 'Process', d: ['M4 6h16', 'M4 12h10', 'M4 18h6'] },
  { href: '#contact', label: 'Contact', d: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'] },
]

/**
 * Magic UI dock: once you scroll past the hero, the main links float at the bottom of
 * the screen, within thumb reach on phones. Each icon has a label on hover and focus.
 */
export default function SiteDock() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`site-dock${shown ? ' is-shown' : ''}`} aria-label="Quick links" inert={!shown}>
      <Dock iconSize={44} disableMagnification className="site-dock-bar">
        {ITEMS.map(({ href, label, d }) => (
          <DockIcon key={href} className="site-dock-item">
            <a href={href} aria-label={label} data-label={label}>
              <Icon d={d} />
            </a>
          </DockIcon>
        ))}
        <DockIcon className="site-dock-item is-primary">
          <a href={MAILTO} aria-label="Email us" data-label="Email us">
            <Icon d={['M3 6h18v12H3z', 'M3 7l9 6 9-6']} />
          </a>
        </DockIcon>
      </Dock>
    </nav>
  )
}

import { useId, useRef } from 'react'

/**
 * Accessible tabs: arrow keys move between tabs, and only the active panel is shown.
 * `children(activeId, panelProps)` renders the panel for the active tab.
 */
export default function Tabs({ label, tabs, active, onChange, children, className = '' }) {
  const id = useId()
  const refs = useRef([])

  const onKeyDown = (e, i) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (step === undefined && e.key !== 'Home' && e.key !== 'End') return
    e.preventDefault()
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + step + tabs.length) % tabs.length
    onChange(tabs[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div className={`tabs ${className}`}>
      <div className="tab-list" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="tab"
            id={`${id}-${t.id}`}
            aria-selected={t.id === active}
            aria-controls={`${id}-panel`}
            tabIndex={t.id === active ? 0 : -1}
            className="tab"
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${active}`} className="tab-panel" key={active}>
        {children(active)}
      </div>
    </div>
  )
}

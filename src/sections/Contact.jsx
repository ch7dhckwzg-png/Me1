import { useEffect, useRef, useState } from 'react'
import { EMAIL, MAILTO } from '@/content'

const LABEL = 'Copy email address'

/** The sign-off, on orange. */
export default function Contact() {
  const [label, setLabel] = useState(LABEL)
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setLabel('Copied')
    } catch {
      setLabel('Copy not available here')
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setLabel(LABEL), 2200)
  }

  return (
    <section className="contact" id="contact">
      <div className="wrap contact-inner">
        <h2 className="contact-title">Let’s make something worth noticing.</h2>
        <p className="contact-lead">
          Tell us a little about your business and what you have in mind. We’ll reply within two
          working days with a few questions and a time to talk. We work mobile, so we come to you.
        </p>
        <a className="mail" href={MAILTO}>{EMAIL}</a>
        <div className="hero-actions">
          <a className="btn btn-primary" href={MAILTO}>Email us</a>
          <button className="btn btn-ghost" type="button" onClick={copy} aria-live="polite">
            {label === 'Copied' && (
              <svg className="copied-tick" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {label}
          </button>
        </div>
      </div>
    </section>
  )
}

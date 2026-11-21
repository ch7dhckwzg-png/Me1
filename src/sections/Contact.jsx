import { useEffect, useRef, useState } from 'react'
import Grainient from '@/components/Grainient'
import { EMAIL, MAILTO } from '@/content'

export default function Contact() {
  const [status, setStatus] = useState('')
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setStatus('Copied to clipboard')
    } catch {
      setStatus('Copy isn’t available here. Select the address above instead.')
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus(''), 4000)
  }

  return (
    <section className="contact" id="contact">
      {/* React Bits Grainient: a slow, dark, grainy wash behind the sign-off. */}
      <div className="contact-bg" aria-hidden="true">
        <Grainient
          colors={['#161616', '#1d1a16', '#2b241a', '#4a3c26']}
          angle={160}
          speed={0.35}
          flow={0.6}
          silk={0.25}
          grainAmount={0.06}
          contrast={0.9}
          saturation={0.8}
          interactive={false}
          clickSwirl={false}
          dpr={1.5}
        />
      </div>
      <div className="wrap">
        <h2 className="display">Tell us what you’re working on</h2>
        <a className="mail display" href={MAILTO}>{EMAIL}</a>
        <div className="copy-row">
          <button className="btn btn-ghost" type="button" onClick={copy}>
            Copy email address
          </button>
          <p className="copy-status" role="status">{status}</p>
        </div>
      </div>
    </section>
  )
}

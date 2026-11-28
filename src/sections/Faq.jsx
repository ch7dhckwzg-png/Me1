import { FAQ } from '@/content'

/** Common questions, as native disclosure widgets (keyboard and screen-reader friendly). */
export default function Faq({ level = 2 }) {
  const H = `h${level}`
  return (
    <section className="section faq" id="faq">
      <div className="wrap faq-grid">
        <header className="section-head">
          <H className="display">Good to know</H>
          <p className="lead">Anything else, just ask. We’re happy to talk it through.</p>
        </header>
        <div className="faq-list">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

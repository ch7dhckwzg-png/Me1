import { FAQ } from '@/content'

/** Common questions, as native disclosure widgets (keyboard and screen-reader friendly). */
export default function Faq() {
  return (
    <section className="section faq" id="faq">
      <div className="wrap faq-wrap">
        <header className="section-head centered">
          <h2 className="display">Good to know.</h2>
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

import { SERVICES } from '@/content'

/** Every service in one calm list: what it is, and what's included. */
export default function Services() {
  return (
    <section className="section services" id="services">
      <div className="wrap">
        <header className="section-head">
          <h2 className="display">Everything your brand needs to be seen</h2>
          <p className="lead">Choose one service, or bring us in for the lot. Whatever we make is designed to work together.</p>
        </header>
        <ul className="service-list">
          {SERVICES.map((s) => (
            <li className="service" key={s.id}>
              <h3 className="service-name">{s.title}</h3>
              <div className="service-text">
                <p className="service-body">{s.body}</p>
                {s.example && (
                  <a className="service-link" href={s.example.href}>
                    {s.example.label}
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
                      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
              <ul className="service-includes" aria-label={`${s.title} includes`}>
                {s.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

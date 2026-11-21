import { PROCESS } from '@/content'

/** How a project runs, in four steps. */
export default function Process() {
  return (
    <section className="section process" id="process">
      <div className="wrap">
        <header className="section-head">
          <p className="eyebrow">How we work</p>
          <h2 className="display">Simple, from first chat to launch</h2>
        </header>
        <ol className="steps">
          {PROCESS.map((step, i) => (
            <li className="step" key={step.title}>
              <span className="step-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

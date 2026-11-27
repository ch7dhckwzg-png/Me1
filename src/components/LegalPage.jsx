import PageShell from '@/components/PageShell'
import { UPDATED } from '@/legal'

/** A plain, readable page for the privacy policy and terms. */
export default function LegalPage({ title, sections }) {
  return (
    <PageShell title={title} crumb={title}>
      <h1 className="display">{title}</h1>
      <p className="legal-updated">Last updated {UPDATED}</p>
      {sections.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          {s.p.map((para) => (
            <p key={para.slice(0, 40)}>{para}</p>
          ))}
        </section>
      ))}
    </PageShell>
  )
}

/** The small right chevron after a text link ("See our work >"), drawn as SVG. */
export default function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 10 16" width="7" height="11" aria-hidden="true" focusable="false">
      <path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** An outsized outlined word set behind a section heading. Decorative and still: it never moves with scroll. */
export default function GiantWord({ children, className = '' }) {
  return (
    <div className={`giant ${className}`} aria-hidden="true">
      <span>{children}</span>
    </div>
  )
}

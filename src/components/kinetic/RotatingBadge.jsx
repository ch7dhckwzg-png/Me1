/** A slowly turning sticker, Nike Run Club style: circular text around an arrow. */
export default function RotatingBadge({ href, label = 'Start a project', className = '' }) {
  const text = `${label} ✦ ${label} ✦ `
  return (
    <a className={`badge-spin ${className}`} href={href} aria-label={label}>
      <svg className="badge-ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text>
          <textPath href="#badge-circle" textLength="462" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="badge-core" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26">
          <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  )
}

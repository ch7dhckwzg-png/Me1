const FLAME = 'M50 4 C 64 30, 90 44, 86 80 C 83 106, 66 124, 50 124 C 32 124, 14 108, 14 82 C 14 62, 26 52, 32 36 C 40 52, 42 62, 50 64 C 46 44, 42 24, 50 4 Z'
const INNER = 'M50 70 C 58 84, 66 92, 64 104 C 62 114, 56 118, 50 118 C 43 118, 36 112, 36 102 C 36 94, 42 88, 44 80 C 47 88, 49 90, 52 90 C 50 82, 48 76, 50 70 Z'

/** Ember: the flame is drawn, catches light, and the name rises beneath it as embers drift up. */
export default function LogoAnim() {
  return (
    <div className="al" aria-hidden="true">
      <div className="al-embers">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} style={{ '--i': i }} />
        ))}
      </div>
      <svg className="al-flame" viewBox="0 0 100 128">
        <defs>
          <linearGradient id="al-fill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#c2462a" />
            <stop offset="0.6" stopColor="#e8833a" />
            <stop offset="1" stopColor="#ffd08a" />
          </linearGradient>
        </defs>
        <path className="al-fill" d={FLAME} fill="url(#al-fill)" />
        <path className="al-line" d={FLAME} pathLength="1" />
        <path className="al-inner" d={INNER} />
      </svg>
      <div className="al-word">
        {'EMBER'.split('').map((c, i) => (
          <span key={i} style={{ '--i': i }}>{c}</span>
        ))}
      </div>
      <div className="al-sub">Wood-fired kitchen</div>
    </div>
  )
}

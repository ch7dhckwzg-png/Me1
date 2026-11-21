// The hero object: the four-point spark from the Catalyze logo, rendered as a faceted
// glass star, lit gold from below with a cream key light from the upper left.
// Pure SVG, so it is sharp at any size and costs nothing to download.

const C = 300 // centre of the star in the 600 x 700 viewBox
const R = 250 // tip radius
const r = 82 // valley radius

const polar = (deg, radius) => {
  const a = (deg * Math.PI) / 180
  return [C + Math.cos(a) * radius, C + Math.sin(a) * radius]
}

const TIPS = [-90, 0, 90, 180].map((d) => polar(d, R))
const VALLEYS = [-45, 45, 135, 225].map((d) => polar(d, r))
const STAR = `M${TIPS.map((t, i) => `${t.join(' ')} L${VALLEYS[i].join(' ')}`).join(' L')} Z`

// Shade each of the eight bevelled facets from two lights, so the star reads as solid.
const KEY = [-0.55, -0.62, 0.56] // cream, from the upper left
const FILL = [0.35, 0.82, 0.45] // gold, bouncing up from the floor
const norm = (v) => {
  const l = Math.hypot(...v)
  return v.map((x) => x / l)
}
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const mix = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t)
const rgb = (c) => `rgb(${c.map((x) => Math.round(Math.min(255, x))).join(' ')})`

const FACETS = TIPS.flatMap((tip, i) =>
  [VALLEYS[(i + 3) % 4], VALLEYS[i]].map((valley) => {
    // A facet slopes away from its ridge (centre to tip) towards its valley.
    const ridge = norm([tip[0] - C, tip[1] - C, 0])
    const toValley = [valley[0] - C, valley[1] - C, 0]
    const along = dot(toValley, ridge)
    const side = norm([toValley[0] - ridge[0] * along, toValley[1] - ridge[1] * along, 0])
    // A steep bevel, so neighbouring facets catch very different amounts of light.
    const n = norm([side[0], side[1], 0.42])
    const key = Math.max(0, dot(n, norm(KEY))) ** 2.4
    const fill = Math.max(0, dot(n, norm(FILL))) ** 1.3
    let c = [13, 11, 10]
    c = mix(c, [214, 108, 50], Math.min(1, fill * 1.05))
    c = mix(c, [238, 186, 148], Math.min(0.55, key * 0.75))
    return { d: `M${C} ${C} L${tip.join(' ')} L${valley.join(' ')} Z`, fill: rgb(c) }
  }),
)

export default function HeroStar() {
  return (
    <svg className="hero-star-svg" viewBox="0 0 600 700" role="img" aria-label="A glowing four-point star, the spark from the Catalyze logo">
      <defs>
        <filter id="star-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
        <filter id="floor-blur" x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <pattern id="halftone" width="13" height="13" patternUnits="userSpaceOnUse">
          <circle cx="6.5" cy="6.5" r="2.6" fill="#D2642C" />
        </pattern>
        <radialGradient id="halftone-fade" cx="50%" cy="50%" r="50%">
          <stop offset="35%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="halftone-mask">
          <circle cx={C} cy={C} r="300" fill="url(#halftone-fade)" />
        </mask>
        <linearGradient id="gloss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#D2642C" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6F0E4" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#F6F0E4" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#D2642C" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F7C9A6" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#D2642C" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#D2642C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="reflect-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="reflect-mask">
          <rect x="0" y="560" width="600" height="140" fill="url(#reflect-fade)" />
        </mask>
        <linearGradient id="ridge" gradientUnits="userSpaceOnUse" x1={C} y1={C} x2={C} y2={C - R}>
          <stop offset="0%" stopColor="#FFF8EA" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFF8EA" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="core">
          <stop offset="0%" stopColor="#FFFDF7" stopOpacity="1" />
          <stop offset="35%" stopColor="#F3B48A" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#D2642C" stopOpacity="0" />
        </radialGradient>
        <clipPath id="star-clip">
          <path d={STAR} />
        </clipPath>
      </defs>

      {/* Halftone dots around the star, as in the logo. */}
      <g mask="url(#halftone-mask)" opacity="0.32">
        <rect x="0" y="0" width="600" height="600" fill="url(#halftone)" />
      </g>

      {/* Floor light and the star's faint reflection in it. */}
      <ellipse cx={C} cy="596" rx="250" ry="16" fill="url(#floor)" filter="url(#floor-blur)" />
      <ellipse cx={C} cy="596" rx="170" ry="1.6" fill="#F7C9A6" opacity="0.8" />
      <g mask="url(#reflect-mask)">
        <g transform={`translate(0 ${2 * 596 - 40}) scale(1 -1)`}>
          <g className="hero-star-body-reflection">
            {FACETS.map((f) => (
              <path key={f.d} d={f.d} fill={f.fill} />
            ))}
          </g>
        </g>
      </g>

      <g className="hero-star-body">
        <path d={STAR} fill="#E07A45" opacity="0.75" filter="url(#star-glow)" transform="translate(300 300) scale(1.08) translate(-300 -300)" />
        {FACETS.map((f) => (
          <path key={f.d} d={f.d} fill={f.fill} stroke={f.fill} strokeWidth="0.6" strokeLinejoin="round" />
        ))}
        <path d={STAR} fill="url(#gloss)" />
        <g clipPath="url(#star-clip)">
          <rect className="hero-star-shine" x="-260" y="0" width="160" height="600" fill="url(#shine)" transform="skewX(-18)" />
        </g>
        <path d={STAR} fill="none" stroke="url(#rim)" strokeWidth="2.2" strokeLinejoin="round" />
        {/* Bright ridges from the centre to each tip, and the light at the heart of it. */}
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1={C}
            y1={C}
            x2={C}
            y2={C - R + 6}
            stroke="url(#ridge)"
            strokeWidth="1.6"
            strokeLinecap="round"
            transform={`rotate(${deg} ${C} ${C})`}
          />
        ))}
        <circle cx={C} cy={C} r="46" fill="url(#core)" />
      </g>
    </svg>
  )
}

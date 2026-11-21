import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import logo from '../assets/logo.svg'
import { BEAT } from './timing.js'

/*
 * "The reaction": Catalyze's opening animation.
 *
 * Catalyze puts four crafts that usually sit with four suppliers (marketing, design,
 * web, photography) in one studio. The intro shows exactly that: four separate
 * elements orbit apart, a catalyst pulls them together, they react, and the
 * Catalyze logo is sprayed on like the stencil in the hero photo.
 *
 * Layout is computed from the composition size, so the same composition works at
 * any aspect ratio (the site sizes it to the viewport).
 */

const CREAM = '#F1EBDD'
const GOLD = '#E4CFA6'
const MUTED = '#A59C8B'
const BG = '#181818'

const DISPLAY = "'Saira Stencil One', Impact, 'Arial Black', sans-serif"
const BODY = "'Hanken Grotesk', system-ui, sans-serif"

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
const easeOut = Easing.bezier(0.16, 1, 0.3, 1)
const easeIn = Easing.bezier(0.6, 0, 0.9, 0.45)

// Four crafts on the diagonals, so the centre stays clear for the headline.
const CRAFTS = [
  { label: 'Marketing', angle: -135 },
  { label: 'Design', angle: -45 },
  { label: 'Web', angle: 45 },
  { label: 'Photography', angle: 135 },
]

/** Sizes shared by every layer, derived from the composition size. */
const useLayout = () => {
  const { width: w, height: h } = useVideoConfig()
  const u = Math.min(w, h) / 1000
  return {
    w,
    h,
    u,
    cx: w / 2,
    cy: h / 2,
    rx: Math.min(w * 0.34, h * 0.6),
    ry: h * 0.29,
    display: Math.min(h * 0.11, w * 0.096),
    label: Math.min(h * 0.022, w * 0.03),
    logoW: Math.min(w * (w < h ? 0.84 : 0.62), h * 0.95),
  }
}

/** Where craft `i` is at frame `f`: arriving, orbiting, then spiralling into the centre. */
const nodePosition = (L, i, f) => {
  const arrive = interpolate(f, [16 + i * 14, 76 + i * 14], [1.55, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 14 }),
  })
  const pull = interpolate(f, [150, 178, BEAT.collide], [1, 1.07, 0], { ...clamp, easing: easeIn })
  const drift = interpolate(f, [0, 150], [-0.55, 0], { ...clamp, easing: easeOut })
  const spin = interpolate(f, [150, BEAT.collide], [0, 2.4], { ...clamp, easing: easeIn })
  const a = (CRAFTS[i].angle * Math.PI) / 180 + drift + spin
  const r = arrive * pull
  return [L.cx + Math.cos(a) * L.rx * r, L.cy + Math.sin(a) * L.ry * r]
}

const Background = () => (
  <AbsoluteFill
    style={{
      backgroundColor: BG,
      backgroundImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #221f1b 0%, #181818 70%)',
    }}
  />
)

/** The four crafts: nodes, their labels, the frame joining them and the comet trails. */
const Crafts = () => {
  const frame = useCurrentFrame()
  const L = useLayout()
  const positions = CRAFTS.map((_, i) => nodePosition(L, i, frame))

  const frameOpacity = interpolate(frame, [70, 100, 150, 195], [0, 0.55, 0.55, 0], clamp)
  const frameDraw = interpolate(frame, [70, 135], [1, 0], { ...clamp, easing: easeOut })
  const gone = frame >= BEAT.collide + 2
  const trailFade = interpolate(frame, [BEAT.collide - 4, BEAT.collide + 26], [1, 0], clamp)

  return (
    <AbsoluteFill>
      <svg width={L.w} height={L.h} viewBox={`0 0 ${L.w} ${L.h}`} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="node-glow">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.55" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* The quadrilateral joining the four crafts, drawn in on load. */}
        <path
          d={`M ${positions.map((p) => p.join(' ')).join(' L ')} Z`}
          fill="none"
          stroke={CREAM}
          strokeWidth={1.2 * L.u}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={frameDraw}
          opacity={frameOpacity}
        />

        {/* Comet trails while they spiral in: short segments, brighter near the head. */}
        {!gone &&
          frame > BEAT.converge &&
          CRAFTS.map((c, i) => {
            const segments = []
            const tail = 56
            for (let f = Math.max(BEAT.converge, frame - tail); f < frame; f += 2) {
              const [x1, y1] = nodePosition(L, i, f)
              const [x2, y2] = nodePosition(L, i, Math.min(f + 2, frame))
              const recency = 1 - (frame - f) / tail
              segments.push(
                <line
                  key={f}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={GOLD}
                  strokeLinecap="round"
                  strokeWidth={(1 + recency * 3.5) * L.u}
                  opacity={recency * 0.85 * trailFade}
                />,
              )
            }
            return <g key={c.label}>{segments}</g>
          })}

        {/* The nodes themselves. */}
        {!gone &&
          positions.map(([x, y], i) => {
            const pop = interpolate(frame, [16 + i * 14, 52 + i * 14], [0, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 11 }),
            })
            const heat = interpolate(frame, [BEAT.converge, BEAT.collide], [1, 1.9], clamp)
            return (
              <g key={CRAFTS[i].label} transform={`translate(${x} ${y}) scale(${pop})`}>
                <circle r={38 * L.u * heat} fill="url(#node-glow)" />
                <circle r={11 * L.u} fill="none" stroke={CREAM} strokeWidth={1.6 * L.u} />
                <circle r={4.5 * L.u} fill={GOLD} />
              </g>
            )
          })}
      </svg>

      {/* Labels are HTML so they use the site's fonts and stay crisp. */}
      {positions.map(([x, y], i) => (
        <div
          key={CRAFTS[i].label}
          style={{
            position: 'absolute',
            left: x,
            top: y + L.label * 1.7,
            translate: '-50% 0',
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: L.label,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            color: CREAM,
            opacity: interpolate(frame, [44 + i * 14, 74 + i * 14, 150, 182], [0, 0.9, 0.9, 0], clamp),
          }}
        >
          <span style={{ color: GOLD, marginRight: '0.8em' }}>0{i + 1}</span>
          {CRAFTS[i].label}
        </div>
      ))}
    </AbsoluteFill>
  )
}

/** The centre copy: the problem, then the catalyst. */
const Headlines = () => {
  const frame = useCurrentFrame()
  const L = useLayout()

  const centred = {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  }

  return (
    <AbsoluteFill>
      <Interactive.Div
        name="Headline: four crafts"
        style={{
          ...centred,
          top: L.cy - L.display * 0.78,
          fontFamily: DISPLAY,
          fontSize: L.display,
          lineHeight: 1,
          color: CREAM,
          opacity: interpolate(frame, [58, 92, 150, 176], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [58, 100, 150, 176], ['0px 40px', '0px 0px', '0px 0px', '0px -30px'], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        Four crafts.
      </Interactive.Div>

      <Interactive.Div
        name="Subline: four suppliers"
        style={{
          ...centred,
          top: L.cy + L.display * 0.42,
          fontFamily: BODY,
          fontWeight: 500,
          fontSize: L.label * 1.45,
          letterSpacing: '0.04em',
          color: MUTED,
          opacity: interpolate(frame, [92, 122, 150, 172], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [92, 130], ['0px 24px', '0px 0px'], { ...clamp, easing: easeOut }),
        }}
      >
        Usually four different suppliers.
      </Interactive.Div>

      <Interactive.Div
        name="Headline: add a catalyst"
        style={{
          ...centred,
          top: L.cy - L.display * 0.5,
          fontFamily: DISPLAY,
          fontSize: L.display,
          lineHeight: 1,
          color: GOLD,
          opacity: interpolate(frame, [184, 214, 258, 284], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [184, 222], ['0px 46px', '0px 0px'], { ...clamp, easing: easeOut }),
          scale: interpolate(frame, [250, 286], [1, 1.14], { ...clamp, output: 'perceptual-scale' }),
          letterSpacing: interpolate(frame, [250, 286], [0.01, 0.08], clamp) + 'em',
        }}
      >
        Add a catalyst.
      </Interactive.Div>
    </AbsoluteFill>
  )
}

/** The reaction: a flash, a shockwave ring and sparks thrown outward. */
const Reaction = () => {
  const frame = useCurrentFrame()
  const L = useLayout()
  const t = frame - BEAT.collide
  if (t < -90 || t > 90) return null

  const core = interpolate(frame, [200, BEAT.collide, BEAT.collide + 50], [0, 1, 0], clamp)
  const ring = interpolate(t, [0, 62], [0, Math.max(L.w, L.h) * 0.75], { ...clamp, easing: easeOut })
  const ringOpacity = interpolate(t, [0, 4, 62], [0, 0.9, 0], clamp)

  return (
    <AbsoluteFill>
      {/* Heat building at the centre as the crafts close in. */}
      <div
        style={{
          position: 'absolute',
          left: L.cx,
          top: L.cy,
          width: 420 * L.u,
          height: 420 * L.u,
          translate: '-50% -50%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${CREAM} 0%, ${GOLD}88 22%, transparent 68%)`,
          opacity: core,
          scale: interpolate(frame, [200, BEAT.collide, BEAT.collide + 40], [0.2, 1, 1.6], clamp),
        }}
      />

      {/* Full-frame flash on impact. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${CREAM} 0%, ${GOLD}aa 28%, transparent 68%)`,
          opacity: interpolate(t, [-2, 5, 46], [0, 0.85, 0], clamp),
        }}
      />

      <svg width={L.w} height={L.h} viewBox={`0 0 ${L.w} ${L.h}`}>
        <circle
          cx={L.cx}
          cy={L.cy}
          r={ring}
          fill="none"
          stroke={GOLD}
          strokeWidth={interpolate(t, [0, 62], [7, 0.6], clamp) * L.u}
          opacity={ringOpacity}
        />
        {t >= 0 &&
          Array.from({ length: 18 }, (_, i) => {
            const angle = random(`spark-angle-${i}`) * Math.PI * 2
            const reach = (0.25 + random(`spark-reach-${i}`) * 0.5) * Math.max(L.w, L.h) * 0.5
            const d = interpolate(t, [0, 70], [0, reach], { ...clamp, easing: easeOut })
            const len = interpolate(t, [0, 12, 70], [0, 46, 6], clamp) * L.u
            const x = L.cx + Math.cos(angle) * d
            const y = L.cy + Math.sin(angle) * d
            return (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={x - Math.cos(angle) * len}
                y2={y - Math.sin(angle) * len}
                stroke={i % 3 === 0 ? CREAM : GOLD}
                strokeWidth={2.4 * L.u}
                strokeLinecap="round"
                opacity={interpolate(t, [0, 50, 72], [1, 0.8, 0], clamp)}
              />
            )
          })}
      </svg>
    </AbsoluteFill>
  )
}

/** The logo, sprayed on from the centre like the stencil in the hero photo, and the tagline. */
const Lockup = () => {
  const frame = useCurrentFrame()
  const L = useLayout()
  const logoH = (L.logoW * 897) / 2400
  if (frame < BEAT.logo - 2) return null

  return (
    <Interactive.Div
      name="Lock-up"
      style={{
        position: 'absolute',
        inset: 0,
        opacity: interpolate(frame, [BEAT.exitStart + 10, BEAT.exitEnd - 5], [1, 0], clamp),
        translate: interpolate(frame, [BEAT.exitStart, BEAT.exitEnd], ['0px 0px', `0px ${-L.h * 0.32}px`], {
          ...clamp,
          easing: Easing.bezier(0.7, 0, 0.84, 0),
        }),
        scale: interpolate(frame, [BEAT.exitStart, BEAT.exitEnd], [1, 0.78], {
          ...clamp,
          output: 'perceptual-scale',
        }),
      }}
    >
      <Interactive.Div
        name="Logo"
        style={{
          position: 'absolute',
          left: L.cx - L.logoW / 2,
          top: L.cy - logoH * 0.62,
          width: L.logoW,
          height: logoH,
          opacity: interpolate(frame, [BEAT.logo, BEAT.logo + 14], [0, 1], clamp),
          scale: interpolate(frame, [BEAT.logo, BEAT.logo + 70], [1.22, 1], {
            ...clamp,
            easing: easeOut,
            output: 'perceptual-scale',
          }),
          filter: `blur(${interpolate(frame, [BEAT.logo, BEAT.logo + 40], [14, 0], clamp)}px)`,
          maskImage: `radial-gradient(ellipse 60% 85% at 50% 50%, #000 ${interpolate(
            frame,
            [BEAT.logo, BEAT.logo + 62],
            [0, 100],
            { ...clamp, easing: easeOut },
          )}%, transparent ${interpolate(frame, [BEAT.logo, BEAT.logo + 62], [8, 130], { ...clamp, easing: easeOut })}%)`,
        }}
      >
        <Img src={logo} name="Catalyze logo" style={{ width: '100%', height: '100%', display: 'block' }} />
      </Interactive.Div>

      <Interactive.Div
        name="Tagline"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: L.cy + logoH * 0.52,
          textAlign: 'center',
          fontFamily: BODY,
          fontWeight: 500,
          fontSize: L.label * 1.5,
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
          color: CREAM,
          opacity: interpolate(frame, [345, 380], [0, 0.92], clamp),
          translate: interpolate(frame, [345, 388], ['0px 26px', '0px 0px'], { ...clamp, easing: easeOut }),
        }}
      >
        One studio for the whole picture.
      </Interactive.Div>
    </Interactive.Div>
  )
}

export const CatalyzeIntro = () => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <Background />
    <Crafts />
    <Headlines />
    <Reaction />
    <Lockup />
  </AbsoluteFill>
)

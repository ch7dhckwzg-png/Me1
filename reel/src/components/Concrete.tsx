import React from 'react';

/**
 * Cast-concrete texture as an SVG filter: low-frequency mottling plus fine pitting,
 * blended over a flat tone. `unit` is CSS pixels per user unit, so the grain looks
 * the same size inside a scaled SVG (like the logo's viewBox).
 */
export const ConcreteFilter: React.FC<{ id: string; seed?: number; unit?: number; strength?: number }> = ({
  id,
  seed = 3,
  unit = 1,
  strength = 1,
}) => (
  <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency={0.014 * unit} numOctaves={3} seed={seed} result="mottle" />
    <feColorMatrix
      in="mottle"
      type="matrix"
      values={`0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1`}
      result="mottleGrey"
    />
    <feComponentTransfer in="mottleGrey" result="mottleSoft">
      <feFuncR type="linear" slope={0.32 * strength} intercept={0.5 - 0.16 * strength} />
      <feFuncG type="linear" slope={0.32 * strength} intercept={0.5 - 0.16 * strength} />
      <feFuncB type="linear" slope={0.32 * strength} intercept={0.5 - 0.16 * strength} />
    </feComponentTransfer>
    <feTurbulence type="fractalNoise" baseFrequency={0.9 * unit} numOctaves={2} seed={seed + 7} result="pits" />
    <feColorMatrix
      in="pits"
      type="matrix"
      values={`0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1`}
      result="pitsGrey"
    />
    <feComponentTransfer in="pitsGrey" result="pitsSoft">
      <feFuncR type="linear" slope={0.95 * strength} intercept={0.5 - 0.475 * strength} />
      <feFuncG type="linear" slope={0.95 * strength} intercept={0.5 - 0.475 * strength} />
      <feFuncB type="linear" slope={0.95 * strength} intercept={0.5 - 0.475 * strength} />
    </feComponentTransfer>
    <feBlend in="SourceGraphic" in2="mottleSoft" mode="overlay" result="a" />
    <feBlend in="a" in2="pitsSoft" mode="overlay" result="b" />
    <feComposite in="b" in2="SourceGraphic" operator="in" />
  </filter>
);

/** A full-size block of concrete in the given tone. */
/** Small air holes ("bugholes") you get in cast concrete. */
const Bugholes: React.FC<{ width: number; height: number; seed: number }> = ({ width, height, seed }) => {
  let x = seed * 9301 + 49297;
  const r = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  const n = Math.round((width * height) / 9000);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const cx = r() * width, cy = r() * height, rad = 0.8 + Math.pow(r(), 3) * 4;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={rad} fill="rgba(0,0,0,0.38)" />
            <circle cx={cx + rad * 0.35} cy={cy + rad * 0.35} r={rad * 0.7} fill="rgba(255,255,255,0.12)" />
          </g>
        );
      })}
    </g>
  );
};

export const ConcreteBlock: React.FC<{
  width: number;
  height: number;
  tone: string;
  seed?: number;
  strength?: number;
  style?: React.CSSProperties;
}> = ({ width, height, tone, seed = 3, strength = 1, style }) => {
  const id = `concrete-${seed}-${tone.slice(1)}`;
  return (
    <svg width={width} height={height} style={{ display: 'block', ...style }}>
      <defs>
        <ConcreteFilter id={id} seed={seed} strength={strength} />
      </defs>
      <rect width={width} height={height} fill={tone} filter={`url(#${id})`} />
      <Bugholes width={width} height={height} seed={seed} />
    </svg>
  );
};

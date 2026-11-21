import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, FONT_MONO, FONT_SANS, H, W } from '../brand';
import { hexToRgb, rgbToCmyk } from '../components/util';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

type Swatch = { label: string; hex: string; ink: string };

const TOP: Swatch = { label: 'DARK', hex: C.ink, ink: C.cream };
const ROW: Swatch[] = [
  { label: 'LIGHT', hex: C.cream, ink: C.ink },
  { label: 'ACCENT', hex: C.tan, ink: C.cream },
  { label: 'DEEP', hex: C.brown2, ink: C.cream },
];

const Values: React.FC<{ s: Swatch; size: number }> = ({ s, size }) => {
  const rgb = hexToRgb(s.hex);
  const cmyk = rgbToCmyk(rgb);
  return (
    <div style={{ fontFamily: FONT_MONO, fontSize: size, lineHeight: 1.55, color: s.ink, opacity: 0.85 }}>
      <div>HEX {s.hex.toUpperCase()}</div>
      <div>RGB {rgb.join(' ')}</div>
      <div>CMYK {cmyk.join(' ')}</div>
    </div>
  );
};

const M = 28;
const TOP_H = 1450;

/** 10. Colour palette cards: the big DARK card carries the logo, three swatches below. */
export const PaletteScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const rowW = (W - M * 4) / 3;
  return (
    <AbsoluteFill style={{ backgroundColor: '#E7E1D3' }}>
      <div style={{ position: 'absolute', left: M, top: M, width: W - M * 2, height: TOP_H - M, borderRadius: 30, background: TOP.hex, padding: 52, boxSizing: 'border-box' }}>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 30, letterSpacing: '0.24em', color: C.gold }}>{TOP.label}</div>
        <div style={{ position: 'absolute', left: 52, bottom: 52 }}>
          <Values s={TOP} size={26} />
        </div>
        <div style={{ position: 'absolute', right: 52, bottom: 52, fontFamily: FONT_MONO, fontSize: 24, color: C.cream, opacity: 0.55 }}>01</div>
      </div>
      {ROW.map((s, i) => {
        const y = interpolate(frame, [0, 4 + i], [80, 0], { extrapolateRight: 'clamp' });
        return (
          <div
            key={s.label}
            style={{
              position: 'absolute',
              left: M + i * (rowW + M),
              top: TOP_H + M,
              width: rowW,
              height: H - TOP_H - M * 2,
              borderRadius: 26,
              background: s.hex,
              padding: 28,
              boxSizing: 'border-box',
              transform: `translateY(${y}px)`,
              boxShadow: s.hex === C.cream ? 'inset 0 0 0 1px rgba(28,27,23,0.12)' : undefined,
            }}
          >
            <div style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 26, letterSpacing: '0.22em', color: s.ink }}>{s.label}</div>
            <div style={{ position: 'absolute', left: 28, bottom: 26 }}>
              <Values s={s} size={19} />
            </div>
          </div>
        );
      })}
      <Logo color={C.cream} />
    </AbsoluteFill>
  );
};

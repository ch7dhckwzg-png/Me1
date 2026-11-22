import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, FONT_MONO, H, LOGO_H, LOGO_W, LOGO_X, LOGO_Y, W } from '../brand';
import { pushIn } from '../components/util';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

const LINE = 'rgba(242,236,222,0.42)';
const FAINT = 'rgba(242,236,222,0.2)';

/** 2. Brand-guidelines construction grid over a tan gradient. */
export const GridScene: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  // guides draw in quickly
  const draw = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });
  const pad = 36; // clear space around the mark
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(160deg, #C99B72 0%, #B07E57 55%, #8F6443 100%)', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: pushIn(frame, duration, 0.02) }}>
        <svg width={W} height={H} style={{ position: 'absolute' }}>
          {/* thirds */}
          {[W / 3, (2 * W) / 3].map((x) => (
            <line key={x} x1={x} x2={x} y1={0} y2={H * draw} stroke={FAINT} strokeWidth={1} />
          ))}
          {[H / 3, (2 * H) / 3].map((y) => (
            <line key={y} y1={y} y2={y} x1={0} x2={W * draw} stroke={FAINT} strokeWidth={1} />
          ))}
          {/* centre axes */}
          <line x1={W / 2} x2={W / 2} y1={0} y2={H * draw} stroke={LINE} strokeWidth={1} strokeDasharray="6 8" />
          <line y1={H / 2} y2={H / 2} x1={0} x2={W * draw} stroke={LINE} strokeWidth={1} strokeDasharray="6 8" />
          {/* logo bounding box + clear-space box */}
          <rect x={LOGO_X} y={LOGO_Y} width={LOGO_W} height={LOGO_H} fill="none" stroke={LINE} strokeWidth={1} />
          <rect
            x={LOGO_X - pad}
            y={LOGO_Y - pad}
            width={LOGO_W + pad * 2}
            height={LOGO_H + pad * 2}
            fill="none"
            stroke={FAINT}
            strokeWidth={1}
          />
          {/* box extents run to the frame edges */}
          {[LOGO_X, LOGO_X + LOGO_W].map((x) => (
            <line key={`v${x}`} x1={x} x2={x} y1={0} y2={H} stroke={FAINT} strokeWidth={1} />
          ))}
          {[LOGO_Y, LOGO_Y + LOGO_H].map((y) => (
            <line key={`h${y}`} y1={y} y2={y} x1={0} x2={W} stroke={FAINT} strokeWidth={1} />
          ))}
          {/* corner marks */}
          {[
            [LOGO_X, LOGO_Y],
            [LOGO_X + LOGO_W, LOGO_Y],
            [LOGO_X, LOGO_Y + LOGO_H],
            [LOGO_X + LOGO_W, LOGO_Y + LOGO_H],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={7} fill="none" stroke={C.cream} strokeWidth={1.2} />
          ))}
          {/* dimension line */}
          <line x1={LOGO_X} x2={LOGO_X + LOGO_W} y1={LOGO_Y + LOGO_H + 90} y2={LOGO_Y + LOGO_H + 90} stroke={LINE} />
          <line x1={LOGO_X} x2={LOGO_X} y1={LOGO_Y + LOGO_H + 78} y2={LOGO_Y + LOGO_H + 102} stroke={LINE} />
          <line x1={LOGO_X + LOGO_W} x2={LOGO_X + LOGO_W} y1={LOGO_Y + LOGO_H + 78} y2={LOGO_Y + LOGO_H + 102} stroke={LINE} />
        </svg>
        <div style={{ position: 'absolute', left: 0, right: 0, top: LOGO_Y + LOGO_H + 108, textAlign: 'center', fontFamily: FONT_MONO, fontSize: 22, color: C.cream, letterSpacing: '0.12em', opacity: 0.8 }}>
          8X
        </div>
        <div style={{ position: 'absolute', left: LOGO_X + LOGO_W + 18, top: LOGO_Y + LOGO_H / 2 - 14, fontFamily: FONT_MONO, fontSize: 22, color: C.cream, opacity: 0.8 }}>
          3X
        </div>
        <div style={{ position: 'absolute', left: 64, top: 96, fontFamily: FONT_MONO, fontSize: 24, color: C.cream, letterSpacing: '0.14em', lineHeight: 1.7, opacity: 0.85 }}>
          CATALYZE — BRAND GUIDELINES
          <br />
          02 / CONSTRUCTION &amp; CLEAR SPACE
        </div>
        <div style={{ position: 'absolute', right: 64, bottom: 96, fontFamily: FONT_MONO, fontSize: 22, color: C.cream, letterSpacing: '0.14em', opacity: 0.7, textAlign: 'right' }}>
          MIN. CLEAR SPACE = X
        </div>
      </AbsoluteFill>
      <Logo color={C.cream} />
    </AbsoluteFill>
  );
};

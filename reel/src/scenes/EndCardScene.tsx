import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, FONT_SANS, LOGO_H, LOGO_Y } from '../brand';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

const TAGLINE = 'MARKETING · DESIGN · IMAGERY';

/** 13. End card: ink background, cream logo, gold tagline letters fading in with tracking. */
export const EndCardScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const tracking = interpolate(frame, [2, 30], [0.42, 0.26], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glow = interpolate(frame, [0, 50], [0.5, 0.8], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(70% 45% at 95% 100%, rgba(80,62,38,0.9), rgba(28,27,23,0) 70%)',
          opacity: glow,
        }}
      />
      <Logo color={C.cream} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: LOGO_Y + LOGO_H + 82,
          textAlign: 'center',
          fontFamily: FONT_SANS,
          fontWeight: 500,
          fontSize: 38,
          letterSpacing: `${tracking}em`,
          color: C.gold,
          whiteSpace: 'nowrap',
          paddingLeft: `${tracking}em`, // balance the trailing letter-space so it stays centred
        }}
      >
        {[...TAGLINE].map((ch, i) => (
          <span
            key={i}
            style={{
              opacity: interpolate(frame, [3 + i * 0.7, 9 + i * 0.7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            {ch}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

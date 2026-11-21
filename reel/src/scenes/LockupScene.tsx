import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { C, FONT_SANS, LOGO_H, LOGO_Y } from '../brand';
import { pushIn } from '../components/util';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

/** 4. Warm tan gradient; a secondary lowercase wordmark slides in from the right, clipped by the frame. */
export const LockupScene: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, duration], [1080, 430], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(200deg, #C69469 0%, #A9744C 50%, #84583A 100%)', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: pushIn(frame, duration) }}>
        <AbsoluteFill style={{ background: 'radial-gradient(70% 50% at 30% 30%, rgba(255,230,200,0.25), rgba(0,0,0,0) 70%)' }} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: LOGO_Y + LOGO_H + 70,
          fontFamily: FONT_SANS,
          fontWeight: 800,
          fontStyle: 'italic',
          fontSize: 230,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: C.cream,
          whiteSpace: 'nowrap',
        }}
      >
        catalyze
      </div>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: LOGO_Y - 300,
          fontFamily: FONT_SANS,
          fontWeight: 800,
          fontStyle: 'italic',
          fontSize: 230,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: 'rgba(242,236,222,0.16)',
          whiteSpace: 'nowrap',
        }}
      >
        catalyze
      </div>
      <Logo color={C.cream} />
    </AbsoluteFill>
  );
};

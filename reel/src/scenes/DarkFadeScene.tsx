import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C } from '../brand';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

/** 11. Brown to near-black; the logo sinks to ~10% opacity before the drop. */
export const DarkFadeScene: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const fadeEnd = Math.max(1, duration - 4); // last 3-4 frames hold at 10%
  const opacity = interpolate(frame, [0, fadeEnd], [1, 0.1], { extrapolateRight: 'clamp' });
  const dark = interpolate(frame, [0, duration - 1], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.brown2} 0%, ${C.brown} 50%, #0E0D0B 100%)` }}>
      <AbsoluteFill style={{ backgroundColor: '#0B0A08', opacity: dark * 0.85 }} />
      <Logo color={C.cream} opacity={opacity} />
    </AbsoluteFill>
  );
};

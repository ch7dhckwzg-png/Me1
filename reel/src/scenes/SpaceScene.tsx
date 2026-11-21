import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, H, W } from '../brand';
import { pushIn, rng } from '../components/util';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

const R = 2600;
const CX = W / 2;
const CY = 1420 + R; // top of the limb sits at y = 1420

const gauss = (rand: () => number) => {
  let u = 0;
  for (let i = 0; i < 6; i++) u += rand();
  return u / 6 - 0.5;
};

/** 8. Earth's limb at night from orbit, city lights, starfield, logo above the horizon. */
export const SpaceScene: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { stars, lights } = useMemo(() => {
    const rand = rng(7);
    const stars = Array.from({ length: 320 }, () => ({
      x: rand() * W,
      y: rand() * 1500,
      r: rand() < 0.92 ? 0.6 + rand() * 0.9 : 1.6 + rand() * 1.2,
      o: 0.25 + rand() * 0.75,
    }));
    const clusters = Array.from({ length: 34 }, () => ({
      x: rand() * W * 1.2 - W * 0.1,
      y: 1440 + Math.pow(rand(), 0.7) * 520,
      s: 30 + rand() * 120,
      n: 10 + Math.floor(rand() * 45),
    }));
    const lights: { x: number; y: number; r: number; o: number }[] = [];
    for (const c of clusters) {
      for (let i = 0; i < c.n; i++) {
        const x = c.x + gauss(rand) * c.s * 2.4;
        const y = c.y + gauss(rand) * c.s * 0.8;
        if (Math.hypot(x - CX, y - CY) > R - 6) continue;
        const depth = Math.min(1, (y - 1420) / 400); // dimmer and flatter near the limb
        lights.push({ x, y, r: (0.6 + rand() * 1.6) * (0.5 + depth * 0.6), o: (0.35 + rand() * 0.65) * (0.35 + depth * 0.65) });
      }
    }
    // a few roads/coastlines: chains of faint dots
    for (let k = 0; k < 6; k++) {
      let x = rand() * W;
      let y = 1500 + rand() * 380;
      const dx = (rand() - 0.5) * 9;
      const dy = (rand() - 0.5) * 3;
      for (let i = 0; i < 70; i++) {
        x += dx + (rand() - 0.5) * 4;
        y += dy + (rand() - 0.5) * 2;
        if (Math.hypot(x - CX, y - CY) < R - 10) lights.push({ x, y, r: 0.7, o: 0.35 });
      }
    }
    return { stars, lights };
  }, []);
  return (
    <AbsoluteFill style={{ backgroundColor: '#020306', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: pushIn(frame, duration, 0.025), transformOrigin: '50% 80%' }}>
        <svg width={W} height={H}>
          <defs>
            <radialGradient id="earth" cx={CX} cy={CY} r={R} gradientUnits="userSpaceOnUse">
              <stop offset="0.9" stopColor="#020309" />
              <stop offset="0.985" stopColor="#06101E" />
              <stop offset="1" stopColor="#0E2440" />
            </radialGradient>
            <filter id="glowSoft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <filter id="lightGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#E8EEFF" opacity={s.o} />
          ))}
          {/* atmosphere */}
          <circle cx={CX} cy={CY} r={R + 10} fill="none" stroke="#3B7BD0" strokeWidth={26} opacity={0.55} filter="url(#glowSoft)" />
          <circle cx={CX} cy={CY} r={R + 2} fill="none" stroke="#8FC2FF" strokeWidth={3} opacity={0.75} />
          <circle cx={CX} cy={CY} r={R} fill="url(#earth)" />
          <g filter="url(#lightGlow)">
            {lights.map((l, i) => (
              <circle key={i} cx={l.x} cy={l.y} r={l.r} fill="#FFCF8A" opacity={l.o} />
            ))}
          </g>
        </svg>
      </AbsoluteFill>
      <Logo color={C.cream} />
    </AbsoluteFill>
  );
};

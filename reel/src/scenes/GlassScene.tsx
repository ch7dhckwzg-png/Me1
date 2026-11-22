import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { H, W } from '../brand';
import { pushIn } from '../components/util';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

const GW = 900;
const GH = 470;
const GX = (W - GW) / 2;
const GY = (H - GH) / 2;
const HORIZON = 1230;

const Backdrop: React.FC<{ shift?: number }> = ({ shift = 0 }) => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, #8C8C8C 0%, #B4B4B4 ${((HORIZON + shift) / H) * 100 - 8}%, #C4C4C4 ${((HORIZON + shift) / H) * 100}%, #9F9F9F ${((HORIZON + shift) / H) * 100 + 0.4}%, #828282 100%)`,
      }}
    />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 40% at 50% 45%, rgba(255,255,255,0.22), rgba(255,255,255,0) 70%)' }} />
  </>
);

/** 7. A clear glass slab on a studio sweep, logo etched faintly into it. */
export const GlassScene: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#BDBDBD' }}>
      <AbsoluteFill style={{ transform: pushIn(frame, duration, 0.02) }}>
        <Backdrop />
        {/* contact shadow + caustic on the floor */}
        <div style={{ position: 'absolute', left: GX + 40, top: GY + GH - 10, width: GW - 80, height: 120, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,0,0,0.35), rgba(0,0,0,0))', filter: 'blur(6px)' }} />
        <div style={{ position: 'absolute', left: GX + 120, top: GY + GH + 40, width: GW - 240, height: 70, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,255,255,0.45), rgba(255,255,255,0))', filter: 'blur(8px)' }} />
      </AbsoluteFill>
      {/* the slab: a refracted, blurred copy of the backdrop inside a rounded clip */}
      <div style={{ position: 'absolute', left: GX, top: GY, width: GW, height: GH, borderRadius: 44, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -GX, top: -GY, width: W, height: H, transform: 'scale(1.06)', transformOrigin: `${W / 2}px ${H / 2}px`, filter: 'blur(4px) brightness(0.97) saturate(1.1)' }}>
          <Backdrop shift={-70} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.03) 38%, rgba(210,230,225,0.04) 60%, rgba(255,255,255,0.08) 100%)' }} />
        <div style={{ position: 'absolute', left: -200, top: -100, width: 260, height: 900, transform: 'rotate(28deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))' }} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: GX,
          top: GY,
          width: GW,
          height: GH,
          borderRadius: 44,
          border: '2px solid rgba(255,255,255,0.75)',
          boxShadow:
            'inset 0 0 0 12px rgba(200,225,220,0.10), inset 4px 6px 10px rgba(255,255,255,0.4), inset -8px -10px 18px rgba(60,60,60,0.25), 0 30px 60px rgba(0,0,0,0.18)',
        }}
      />
      {/* etched mark: frosted fill with a hairline dark lip */}
      <Logo color="#F4F6F5" opacity={0.42} cssFilter="drop-shadow(1px 1px 0 rgba(0,0,0,0.22)) drop-shadow(-1px -1px 0 rgba(255,255,255,0.5))" />
    </AbsoluteFill>
  );
};

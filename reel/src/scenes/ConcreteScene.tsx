import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { H, LOGO_W, W } from '../brand';
import { ConcreteBlock, ConcreteFilter } from '../components/Concrete';
import { pushIn } from '../components/util';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

const TILE = {
  grey: { wall: '#9B9994', slot: '#7D7B76', tile: '#B4B2AD', logo: '#C2C0BB' },
  tan: { wall: '#9B9994', slot: '#7D7B76', tile: '#B98E68', logo: '#C79D77' },
};

const SLOT_W = 960;
const SLOT_H = 500;
const TILE_W = 880;
const TILE_H = 410;

/** 1. Cast-concrete wall with a recessed slot; the logo is embossed on a raised tile. */
export const ConcreteScene: React.FC<SceneProps & { tone?: 'grey' | 'tan' }> = ({ duration, tone = 'grey' }) => {
  const frame = useCurrentFrame();
  const t = TILE[tone];
  return (
    <AbsoluteFill style={{ backgroundColor: t.wall, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: pushIn(frame, duration) }}>
        <ConcreteBlock width={W} height={H} tone={t.wall} seed={11} />
        {/* soft key light from the top-left */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(120% 80% at 20% 15%, rgba(255,255,255,0.18), rgba(0,0,0,0) 55%), radial-gradient(120% 90% at 90% 100%, rgba(0,0,0,0.35), rgba(0,0,0,0) 60%)',
          }}
        />
        {/* recessed slot */}
        <div
          style={{
            position: 'absolute',
            left: (W - SLOT_W) / 2,
            top: (H - SLOT_H) / 2,
            width: SLOT_W,
            height: SLOT_H,
            borderRadius: 36,
            overflow: 'hidden',
          }}
        >
          <ConcreteBlock width={SLOT_W} height={SLOT_H} tone={t.slot} seed={12} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 36,
              boxShadow:
                'inset 26px 34px 40px rgba(0,0,0,0.55), inset -6px -8px 10px rgba(255,255,255,0.18)',
            }}
          />
        </div>
      </AbsoluteFill>
      {/* raised tile (kept still so the logo stays locked) */}
      <div
        style={{
          position: 'absolute',
          left: (W - TILE_W) / 2,
          top: (H - TILE_H) / 2,
          width: TILE_W,
          height: TILE_H,
          borderRadius: 26,
          overflow: 'hidden',
          boxShadow: '18px 26px 34px rgba(0,0,0,0.5), 4px 6px 8px rgba(0,0,0,0.35)',
        }}
      >
        <ConcreteBlock width={TILE_W} height={TILE_H} tone={t.tile} seed={13} strength={0.8} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 26,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(0,0,0,0.12))',
            boxShadow: 'inset 3px 3px 3px rgba(255,255,255,0.45), inset -4px -4px 5px rgba(0,0,0,0.3)',
          }}
        />
      </div>
      <Logo
        defs={<ConcreteFilter id={`logo-concrete-${tone}`} seed={14} unit={LOGO_W / 2572} strength={0.8} />}
        fill={
          <>
            <rect width={2572} height={976} fill={t.logo} filter={`url(#logo-concrete-${tone})`} />
            <rect width={2572} height={976} fill="url(#emboss-sheen)" />
            <linearGradient id="emboss-sheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity={0.18} />
              <stop offset="1" stopColor="#000" stopOpacity={0.1} />
            </linearGradient>
          </>
        }
        cssFilter="drop-shadow(-2px -2px 1px rgba(255,255,255,0.55)) drop-shadow(3px 4px 2px rgba(0,0,0,0.35)) drop-shadow(8px 12px 10px rgba(0,0,0,0.3))"
      />
    </AbsoluteFill>
  );
};

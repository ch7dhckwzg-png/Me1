import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT_SANS, H, W } from '../brand';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

const SIZE = 960; // close crop: the home-screen grid is zoomed right in
const GAP = 110;
const RADIUS = SIZE * 0.225;

const Glyph: React.FC<{ kind: number }> = ({ kind }) => {
  const s = SIZE;
  const stroke = 'rgba(255,255,255,0.92)';
  switch (kind % 5) {
    case 0:
      return <circle cx={s / 2} cy={s / 2} r={s * 0.24} fill="none" stroke={stroke} strokeWidth={s * 0.06} />;
    case 1:
      return (
        <g fill={stroke}>
          {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={s * (0.25 + c * 0.18)} y={s * (0.25 + r * 0.18)} width={s * 0.12} height={s * 0.12} rx={s * 0.03} />))}
        </g>
      );
    case 2:
      return <path d={`M ${s * 0.28} ${s * 0.68} L ${s * 0.5} ${s * 0.3} L ${s * 0.72} ${s * 0.68} Z`} fill={stroke} />;
    case 3:
      return <rect x={s * 0.27} y={s * 0.33} width={s * 0.46} height={s * 0.34} rx={s * 0.05} fill="none" stroke={stroke} strokeWidth={s * 0.05} />;
    default:
      return <path d={`M ${s * 0.3} ${s * 0.5} h ${s * 0.4} M ${s * 0.5} ${s * 0.3} v ${s * 0.4}`} stroke={stroke} strokeWidth={s * 0.07} strokeLinecap="round" />;
  }
};

const ICONS = [
  { dx: -1, dy: -1, bg: 'linear-gradient(160deg,#6E7C8C,#3E4A57)', label: 'Weather' },
  { dx: 0, dy: -1, bg: 'linear-gradient(160deg,#E9E4D8,#B8B0A0)', label: 'Notes' },
  { dx: 1, dy: -1, bg: 'linear-gradient(160deg,#53624F,#2E3A2C)', label: 'Maps' },
  { dx: -1, dy: 0, bg: 'linear-gradient(160deg,#3A3A3A,#1B1B1B)', label: 'Camera' },
  { dx: 1, dy: 0, bg: 'linear-gradient(160deg,#5A6E8E,#2C3B55)', label: 'Mail' },
  { dx: -1, dy: 1, bg: 'linear-gradient(160deg,#8C6E5A,#5A4334)', label: 'Photos' },
  { dx: 0, dy: 1, bg: 'linear-gradient(160deg,#4F4F55,#2A2A2F)', label: 'Settings' },
  { dx: 1, dy: 1, bg: 'linear-gradient(160deg,#9A8F6E,#6A6146)', label: 'Music' },
];

const pos = (dx: number, dy: number) => ({
  left: W / 2 - SIZE / 2 + dx * (SIZE + GAP),
  top: H / 2 - SIZE / 2 + dy * (SIZE + GAP + 120),
});

const Label: React.FC<{ text: string; dx: number; dy: number }> = ({ text, dx, dy }) => {
  const p = pos(dx, dy);
  return (
    <div style={{ position: 'absolute', left: p.left, top: p.top + SIZE + 28, width: SIZE, textAlign: 'center', fontFamily: FONT_SANS, fontWeight: 500, fontSize: 64, color: 'rgba(255,255,255,0.9)' }}>
      {text}
    </div>
  );
};

/** 9. Phone home screen, close crop: a terracotta app icon springs in. */
export const AppIconScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 9, stiffness: 220, mass: 0.6 }, from: 0.86, to: 1 });
  const c = pos(0, 0);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(120% 80% at 30% 20%, #4A3A2B 0%, #2A231B 55%, #15120E 100%)', overflow: 'hidden' }}>
      {ICONS.map((ic) => {
        const p = pos(ic.dx, ic.dy);
        return (
          <React.Fragment key={ic.label}>
            <div style={{ position: 'absolute', ...p, width: SIZE, height: SIZE, borderRadius: RADIUS, background: ic.bg, boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
              <svg width={SIZE} height={SIZE}>
                <Glyph kind={ICONS.indexOf(ic)} />
              </svg>
            </div>
            <Label text={ic.label} dx={ic.dx} dy={ic.dy} />
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: 'absolute',
          ...c,
          width: SIZE,
          height: SIZE,
          borderRadius: RADIUS,
          background: `linear-gradient(160deg, #D98258 0%, ${C.tan} 50%, #A85A38 100%)`,
          boxShadow: '0 40px 80px rgba(0,0,0,0.45), inset 0 3px 0 rgba(255,255,255,0.25)',
          transform: `scale(${pop})`,
        }}
      />
      <Label text="Catalyze" dx={0} dy={0} />
      <Logo color={C.cream} />
    </AbsoluteFill>
  );
};

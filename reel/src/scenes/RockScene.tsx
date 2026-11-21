import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { H, W } from '../brand';
import { DebossFilter } from '../components/Deboss';
import { pushIn, rng } from '../components/util';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

type P = [number, number, number];

// Flat front face that holds the logo (offsets from frame centre).
const FACE: [number, number][] = [
  [-470, -120], [-410, -215], [-90, -238], [370, -212], [478, -112], [462, 140], [335, 228], [-140, 244], [-452, 178],
];

const L = (() => {
  const v = [-0.45, -0.7, 0.55];
  const m = Math.hypot(v[0], v[1], v[2]);
  return v.map((x) => x / m);
})();

const shade = (a: P, b: P, c: P) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const m = Math.hypot(n[0], n[1], n[2]) || 1;
  n = n.map((x) => x / m);
  if (n[2] < 0) n = n.map((x) => -x);
  return Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]);
};

const ring = (count: number, rx: number, ry: number, z: number, jitter: number, rand: () => number, rot = 0): P[] =>
  Array.from({ length: count }, (_, i) => {
    const a = rot + (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.25;
    const r = 1 + (rand() - 0.5) * jitter;
    return [Math.cos(a) * rx * r, Math.sin(a) * ry * r, z + (rand() - 0.5) * 40] as P;
  });

const angle = (p: P) => Math.atan2(p[1], p[0]);

/** Stitch two closed rings (sorted by angle) into triangles. */
const stitch = (inner: P[], outer: P[]): [P, P, P][] => {
  const A = [...inner].sort((p, q) => angle(p) - angle(q));
  const B = [...outer].sort((p, q) => angle(p) - angle(q));
  const tris: [P, P, P][] = [];
  let i = 0;
  let j = 0;
  while (i < A.length || j < B.length) {
    const a0 = A[i % A.length];
    const b0 = B[j % B.length];
    const a1 = A[(i + 1) % A.length];
    const b1 = B[(j + 1) % B.length];
    const nextA = i < A.length ? angle(a1) + (i + 1 >= A.length ? Math.PI * 2 : 0) : Infinity;
    const nextB = j < B.length ? angle(b1) + (j + 1 >= B.length ? Math.PI * 2 : 0) : Infinity;
    if (nextA <= nextB) {
      tris.push([a0, a1, b0]);
      i++;
    } else {
      tris.push([a0, b1, b0]);
      j++;
    }
  }
  return tris;
};

const grey = (s: number, jitter: number) => {
  const g = Math.round(28 + s * 150 + jitter * 14);
  return `rgb(${g},${g - 1},${g - 3})`;
};

/** 6. A faceted grey rock with the logo debossed into its flat front face. */
export const RockScene: React.FC<SceneProps & { inverted?: boolean }> = ({ duration, inverted = false }) => {
  const frame = useCurrentFrame();
  const { tris, faceFill } = useMemo(() => {
    const rand = rng(42);
    const face: P[] = FACE.map(([x, y]) => [x, y, 220]);
    const r1 = ring(13, 545, 380, 130, 0.12, rand, 0.2);
    const r2 = ring(15, 580, 540, 0, 0.18, rand, 0.05);
    const all = [...stitch(face, r1), ...stitch(r1, r2)];
    return {
      tris: all.map((t) => ({ t, fill: grey(shade(t[0], t[1], t[2]), rand() - 0.5) })),
      faceFill: grey(shade([0, 0, 0], [1, 0, 0], [0, 1, 0]) * 0.92, 0),
    };
  }, []);
  const cx = W / 2;
  const cy = H / 2 + 10;
  const pts = (ps: [number, number][] | P[]) => ps.map((p) => `${cx + p[0]},${cy + p[1]}`).join(' ');
  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(80% 55% at 50% 48%, #2B2620 0%, #14120F 60%, #0B0A08 100%)',
        filter: inverted ? 'invert(1) grayscale(1) contrast(1.05)' : undefined,
        overflow: 'hidden',
      }}
    >
      {/* the rock sits still; only the room breathes */}
      <AbsoluteFill style={{ transform: pushIn(frame, duration, 0.02) }}>
        <AbsoluteFill style={{ background: 'radial-gradient(40% 25% at 50% 78%, rgba(0,0,0,0.6), rgba(0,0,0,0) 70%)' }} />
      </AbsoluteFill>
      <svg width={W} height={H} style={{ position: 'absolute', filter: 'drop-shadow(0 40px 50px rgba(0,0,0,0.6))' }}>
        {tris.map(({ t, fill }, k) => (
          <polygon key={k} points={pts(t)} fill={fill} stroke={fill} strokeWidth={0.8} strokeLinejoin="round" />
        ))}
        <polygon points={pts(FACE)} fill={faceFill} stroke={faceFill} strokeWidth={0.8} />
        <polygon points={pts(FACE)} fill="url(#faceSheen)" />
        <defs>
          <linearGradient id="faceSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={0.12} />
            <stop offset="1" stopColor="#000" stopOpacity={0.12} />
          </linearGradient>
        </defs>
      </svg>
      <Logo color="#6F6C67" defs={<DebossFilter id="rock-deboss" depth={1.1} />} svgFilter="rock-deboss" />
    </AbsoluteFill>
  );
};

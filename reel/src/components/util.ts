import { interpolate } from 'remotion';

/** Small push-in for a background layer: scale 1.00 -> 1.03 over the scene. */
export const pushIn = (frame: number, duration: number, amount = 0.03) =>
  `scale(${interpolate(frame, [0, Math.max(1, duration - 1)], [1, 1 + amount], {
    extrapolateRight: 'clamp',
  })})`;

/** Deterministic PRNG so every render is identical. */
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
};

export const rgbToCmyk = ([r, g, b]: readonly [number, number, number]) => {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k >= 1) return [0, 0, 0, 100];
  return [
    Math.round(((1 - rr - k) / (1 - k)) * 100),
    Math.round(((1 - gg - k) / (1 - k)) * 100),
    Math.round(((1 - bb - k) / (1 - k)) * 100),
    Math.round(k * 100),
  ];
};

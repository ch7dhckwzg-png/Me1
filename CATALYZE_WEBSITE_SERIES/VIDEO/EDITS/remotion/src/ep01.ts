// Episode 01: Social 114, New Brighton. Every timing and word for the edit lives here.
// 30 fps. Retime `captions` (and `scenes` if needed) to match the final voiceover.

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const scenes = {
  hook: { from: 0, dur: 90 },        // 0.0 to 3.0s   big hook: cup spins into pizza, day to night
  business: { from: 90, dur: 60 },   // 3.0 to 5.0s   Social 114, Victoria Road
  build: { from: 150, dur: 135 },    // 5.0 to 9.5s   real code, the five real drafts, colours from the room
  laptop: { from: 285, dur: 135 },   // 9.5 to 14.0s  website on a laptop, camera swings right
  phone: { from: 420, dur: 90 },     // 14.0 to 17.0s phone version
  outro: { from: 510, dur: 45 },     // 17.0 to 18.5s CATALYZE
};
export const TOTAL = 555; // 18.5s (brief: 19s maximum)

// Optional real footage. Drop your clips into public/ep01/ and set the names here:
// the storefront clip replaces the shopfront drawing.
export const footage = {
  storefront: null as string | null, // e.g. 'ep01/storefront.mp4' (slow push-in on the shopfront)
};

export const place = {
  area: 'New Brighton, Wirral',
  coords: '53.44° N, 3.04° W',
  street: '114 Victoria Road',
  name: 'Social 114.',
};

// The hook's two on-screen lines (the voiceover says the same words, so no caption is doubled).
export const hookLines = {
  a: ['This café lost', 'its website.'],
  b: ['So I built them', 'a new one.'],
};

// Planned voiceover, burned in as captions from 3s. One accent word per line (`hl`).
// `top: true` lifts the caption above the website.
export type Cap = { from: number; to: number; text: string; hl?: string; top?: boolean };
export const captions: Cap[] = [
  { from: 96, to: 122, text: 'Social 114,', hl: '114,' },
  { from: 122, to: 148, text: 'on Victoria Road.', hl: 'Victoria' },
  { from: 154, to: 180, text: 'Coffee by day,', hl: 'Coffee' },
  { from: 180, to: 206, text: 'pizza by night,', hl: 'pizza' },
  { from: 206, to: 240, text: 'so the site does both.', hl: 'both.' },
  { from: 294, to: 326, text: 'From morning', hl: 'morning', top: true },
  { from: 342, to: 374, text: 'to night.', hl: 'night.', top: true },
  // "Who's next?" is the outro title itself, so it isn't repeated as a caption
];

// Real code from the site (src/scripts/main.ts), shown in the build scene.
export const code = `function placeDish(p: number) {
  const e = easeInOut(p);
  const bell = Math.sin(Math.PI * clamp01((p - .2) / .6));
  const x = x0 + (x1 - x0) * e;
  const rot = e * 400;
  const scale = 1 - .12 * bell;
  stage.style.transform =
    \`translate3d(\${x}px, \${-14 * bell}px, 0) scale(\${scale})\`;
  rotor.style.transform = \`rotate(\${rot}deg)\`;
  const k = smooth(.36, .64, p);
  cupImg.style.opacity = String(1 - k);
  pizzaImg.style.opacity = String(k);
}`;

export const palette = [
  { name: 'Dado navy', hex: '#121722' },
  { name: 'Front door', hex: '#a3461e' },
  { name: 'Birch ply', hex: '#d8b88a' },
  { name: 'White wall', hex: '#f5f4f1' },
  { name: 'Window glass', hex: '#d4a53a' },
  { name: 'Window glass', hex: '#4d8a84' },
];

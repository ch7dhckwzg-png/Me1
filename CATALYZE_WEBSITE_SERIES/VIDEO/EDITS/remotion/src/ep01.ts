// Episode 01: Social 114, New Brighton. Every timing and word for the edit lives here.
// 30 fps. Retime `captions` (and `scenes` if needed) to match the final voiceover.

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const scenes = {
  hook: { from: 0, dur: 90 },        // 0.0 to 3.0s  hook: Street View arrival, then the cup spins into the pizza
  business: { from: 90, dur: 60 },   // 3.0 to 5.0s  the business
  build: { from: 150, dur: 150 },    // 5.0 to 10.0s the build (code, real drafts, decisions)
  reveal: { from: 300, dur: 180 },   // 10.0 to 16.0s laptop and phone side by side, both scrolling the whole site
  outro: { from: 480, dur: 45 },     // 16.0 to 17.5s CATALYZE
};
export const TOTAL = 525; // 17.5s (brief: 19s maximum)

// Footage. `street` opens the hook. The current clip is a Google Street View screen recording
// (owner-supplied): keep `streetCredit` on screen while it's used, and replace it with your own
// street clip (set streetCredit to null) before publishing if Google's terms don't cover this use.
// `storefront` replaces the shopfront drawing in the business scene.
export const footage = {
  street: 'ep01/streetview-pan.mp4' as string | null,
  streetRate: 0.69,                                 // slow motion: a 1.25s pan along the shopfront stretched to 1.8s (60fps source)
  streetCredit: 'Google Street View · Jul 2024' as string | null,
  storefront: null as string | null,                // e.g. 'ep01/storefront.mp4'
};

// The hook's two on-screen lines (the voiceover says the same words, so they aren't captioned twice).
export const hookLines = {
  a: ["This café didn't", 'have a website.'],
  b: ['So I built them', 'a new one.'],
};

export const place = {
  area: 'New Brighton, Wirral',
  coords: '53.44° N, 3.04° W',
  street: '114 Victoria Road',
  name: 'Social 114.',
};

// Planned voiceover, burned in as captions. One accent word per line (`hl`).
// `top: true` lifts the caption above the website during the reveal.
export type Cap = { from: number; to: number; text: string; hl?: string; top?: boolean };
export const captions: Cap[] = [
  { from: 96, to: 120, text: 'Social 114 does', hl: '114' },
  { from: 120, to: 140, text: 'coffee by day', hl: 'coffee' },
  { from: 140, to: 164, text: 'and wood-fired pizza', hl: 'pizza' },
  { from: 164, to: 186, text: 'by night.', hl: 'night.' },
  { from: 196, to: 222, text: 'Five drafts later,', hl: 'Five' },
  { from: 222, to: 250, text: 'this is what I made.', hl: 'made.' },
  { from: 306, to: 334, text: 'From morning', hl: 'morning', top: true },
  { from: 342, to: 370, text: 'to night.', hl: 'night.', top: true },
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

// Episode 01: Social 114, New Brighton. Every timing and word for the edit lives here.
// 30 fps. Paced to the conversational narration in VOICE/SCRIPTS/EPISODE_01.md (about 31.5s).
// Retime `captions` (and `scenes` if needed) to match the final voiceover.

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const scenes = {
  hook: { from: 0, dur: 100 },       // 0.0 to 3.3s   "So this café in New Brighton didn't have a website." (Street View, slow pan)
  business: { from: 100, dur: 90 },  // 3.3 to 6.3s   "It's called Social 114, on Victoria Road," the shopfront drawing
  menu: { from: 190, dur: 95 },      // 6.3 to 9.5s   "and they do coffee and brunch in the day, then wood-fired pizza at night." the real menu
  built: { from: 285, dur: 55 },     // 9.5 to 11.3s  "So I built them one." blurred scroll of the new site
  showcase: { from: 340, dur: 270 }, // 11.3 to 20.3s "as you scroll, your flat white spins into a pizza... morning to night."
  build: { from: 610, dur: 90 },     // 20.3 to 23.3s "It took me five drafts to get it right." the five real drafts, colours
  reveal: { from: 700, dur: 165 },   // 23.3 to 28.8s "Here it is." laptop and phone head-on, scrolling the whole site
  outro: { from: 865, dur: 80 },     // 28.8 to 31.5s "Who should I build one for next?"
};
export const TOTAL = 945; // 31.5s

// Footage. `street` opens the hook. The current clip is a Google Street View screen recording
// (owner-supplied): keep `streetCredit` on screen while it's used, and replace it with your own
// street clip (set streetCredit to null) before publishing if Google's terms don't cover this use.
// `storefront` replaces the shopfront drawing in the business scene.
export const footage = {
  street: 'ep01/streetview-pan.mp4' as string | null,
  streetRate: 0.5,                                  // slow motion: the 1.25s pan along the shopfront at half speed (60fps source, so still smooth)
  streetCredit: 'Google Street View · Jul 2024' as string | null,
  storefront: null as string | null,                // e.g. 'ep01/storefront.mp4'
};

// The hook's two on-screen lines (the voiceover says the same words, so they aren't captioned twice).
export const hookLines = {
  a: ['So this café in', "New Brighton didn't", 'have a website.'],
  b: ['So I built', 'them one.'],
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
  { from: 104, to: 136, text: "It's called Social 114,", hl: '114,' },
  { from: 136, to: 166, text: 'on Victoria Road,', hl: 'Victoria' },
  { from: 170, to: 198, text: 'and they do coffee', hl: 'coffee' },
  { from: 198, to: 234, text: 'and brunch in the day,', hl: 'day,' },
  { from: 236, to: 262, text: 'then wood-fired pizza', hl: 'pizza' },
  { from: 262, to: 284, text: 'at night.', hl: 'night.' },
  // "So I built them one." is the on-screen headline in the built beat
  { from: 348, to: 380, text: 'I wanted it to feel', hl: 'feel', top: true },
  { from: 380, to: 408, text: 'like being there,', hl: 'there,', top: true },
  { from: 414, to: 444, text: 'so as you scroll,', hl: 'scroll,', top: true },
  { from: 446, to: 474, text: 'your flat white', hl: 'white', top: true },
  { from: 474, to: 506, text: 'spins into a pizza,', hl: 'pizza,', top: true },
  { from: 514, to: 544, text: 'and the whole site', hl: 'site', top: true },
  { from: 544, to: 574, text: 'goes from morning', hl: 'morning', top: true },
  { from: 574, to: 604, text: 'to night.', hl: 'night.', top: true },
  { from: 614, to: 646, text: 'It took me five drafts', hl: 'five' },
  { from: 646, to: 680, text: 'to get it right.', hl: 'right.' },
  { from: 708, to: 740, text: 'Here it is.', hl: 'Here', top: true },
  // "Who should I build one for next?" is the outro title itself
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

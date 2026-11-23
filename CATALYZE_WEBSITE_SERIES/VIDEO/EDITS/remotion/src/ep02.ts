// Episode 02: The Salon Sanctuary, Burlington Street, Liverpool. Every timing and word for the edit.
// 30 fps. Retime `captions` (and `scenes` if needed) to match the final voiceover.
// Runs 19.0s (the brief's maximum) because this episode adds one beat: the colour finder,
// shown with three combinations so the viewer sees the suggestion change.

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const scenes = {
  hook: { from: 0, dur: 90 },        // 0.0 to 3.0s   hook: the shopfront draws itself, then a blurred scroll of the new site
  business: { from: 90, dur: 45 },   // 3.0 to 4.5s   the business: the mirror opening (their name)
  build: { from: 135, dur: 70 },     // 4.5 to 6.8s   the build: real code, the five real versions, colours from the room
  feature: { from: 205, dur: 250 },  // 6.8 to 15.2s  FEATURE: Find your colour, three combinations, three answers, with zooms
  reveal: { from: 455, dur: 75 },    // 15.2 to 17.7s grand reveal: laptop and phone head-on, scrolling the whole site
  outro: { from: 530, dur: 40 },     // 17.7 to 19.0s CATALYZE
};
export const TOTAL = 570; // 19.0s

// Taps inside the finder capture (frames of finder-mobile.mp4, see scripts/capture-ep02.cjs):
// 48 Dark brown (now), 70 Golden blonde (goal), 148 Rose (goal), 196 Golden blonde (now), 212 Chestnut (goal).
// The capture glides from the ring to the dots + suggestion between frames 78 and 100.
export const finderTaps = { taps: [48, 70, 148, 196, 212], trim: 2 };

// Camera inside the feature beat: [scene frame, focus y on the 1080x1920 canvas, scale].
// Focus points: phone at rest 1088; dots before the glide 1324; dots after 668; the suggestion 1138.
export const finderCamera: [number, number, number][] = [
  [0, 1088, 1], [36, 1088, 1], [46, 1324, 1.5], [70, 1324, 1.5], [80, 1088, 1.05], [98, 1088, 1.05],
  [108, 1138, 1.42], [134, 1138, 1.42], [144, 668, 1.6], [152, 668, 1.6], [162, 1138, 1.42], [184, 1138, 1.42],
  [192, 668, 1.6], [214, 668, 1.6], [224, 1138, 1.42], [250, 1138, 1.46],
];

export const hookLines = {
  a: ["This salon didn't", 'have a website.'],
  b: ['So I built', 'them one.'],
};

export const place = {
  area: 'Liverpool',
  street: '61 Burlington Street',
  name: 'The Salon Sanctuary',
};

export type Cap = { from: number; to: number; text: string; hl?: string; top?: boolean };
export const captions: Cap[] = [
  { from: 96, to: 116, text: 'The Salon Sanctuary,', hl: 'Sanctuary,' },
  { from: 116, to: 138, text: 'in Liverpool.', hl: 'Liverpool.' },
  { from: 140, to: 170, text: 'Five drafts later,', hl: 'Five' },
  { from: 210, to: 248, text: 'Not sure what to book?', hl: 'book?', top: true },
  { from: 249, to: 271, text: 'Tap your hair now,', hl: 'now,', top: true },
  { from: 272, to: 300, text: 'then the shade you want.', hl: 'want.', top: true },
  { from: 307, to: 345, text: 'All the way blonde.', hl: 'blonde.', top: true },
  { from: 348, to: 392, text: 'Want rose instead?', hl: 'rose', top: true },
  { from: 396, to: 452, text: 'Or going darker?', hl: 'darker?', top: true },
  { from: 460, to: 488, text: 'Then book it', hl: 'book', top: true },
  { from: 490, to: 522, text: 'right on their site.', hl: 'site.', top: true },
];

// Real code from the site (src/scripts/main.ts, finderResult), shown in the build scene.
export const code = `const level = [0, 1, 2, 2, 3, 4, 6, 7, 5];
let key: string;
if (pickGoal === ROSE) key = 'rose';
else if (pickGoal === pickNow) key = 'same';
else if (pickGoal === COPPER) key = 'copper';
else {
  const diff = level[pickGoal] - level[pickNow];
  key = diff <= 0 ? 'darker' : diff <= 2 ? 'lighter' : 'blonde';
}
const r = finder.results[key];`;

export const palette = [
  { name: 'Blush fascia', hex: '#f6e6e8' },
  { name: 'Pink doors', hex: '#e7c6bf' },
  { name: 'Herringbone tile', hex: '#c9a39c' },
  { name: 'Sign lettering', hex: '#2b2e31' },
  { name: 'Black basins', hex: '#131517' },
  { name: 'Gold chairs', hex: '#a9874f' },
];

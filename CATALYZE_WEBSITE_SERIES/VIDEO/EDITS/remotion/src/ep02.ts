// Episode 02: The Salon Sanctuary, Burlington Street, Liverpool. Every timing and word for the edit.
// 30 fps. Retime `captions` (and `scenes` if needed) to match the final voiceover.
// Runs 19.0s (the brief's maximum) because this episode adds one beat: the colour finder,
// shown with three combinations so the viewer sees the suggestion change.

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const scenes = {
  hook: { from: 0, dur: 90 },        // 0.0 to 3.0s   hook: the shopfront draws itself, then a blurred scroll of the new site
  business: { from: 90, dur: 60 },   // 3.0 to 5.0s   the business: the mirror opening (their name)
  build: { from: 150, dur: 85 },     // 5.0 to 7.8s   the build: real code, the five real versions, colours from the room
  feature: { from: 235, dur: 200 },  // 7.8 to 14.5s  FEATURE: Find your colour, three combinations, three answers
  reveal: { from: 435, dur: 95 },    // 14.5 to 17.7s grand reveal: laptop and phone head-on, scrolling the whole site
  outro: { from: 530, dur: 40 },     // 17.7 to 19.0s CATALYZE
};
export const TOTAL = 570; // 19.0s

// Taps inside the finder capture (frames of finder-mobile.mp4, see scripts/capture-ep02.cjs):
// 45 Dark brown (now), 62 Golden blonde (goal), 120 Rose (goal), 152 Golden blonde (now), 165 Chestnut (goal)
export const finderTaps = { now: 45, goal: 62, trim: 2 };

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
  { from: 96, to: 122, text: 'The Salon Sanctuary,', hl: 'Sanctuary,' },
  { from: 122, to: 148, text: 'in Liverpool.', hl: 'Liverpool.' },
  { from: 154, to: 184, text: 'Five drafts later,', hl: 'Five' },
  { from: 240, to: 276, text: 'Not sure what to book?', hl: 'book?', top: true },
  { from: 278, to: 294, text: 'Tap your hair now,', hl: 'now,', top: true },
  { from: 295, to: 324, text: 'then the shade you want.', hl: 'want.', top: true },
  { from: 326, to: 352, text: 'All the way blonde.', hl: 'blonde.', top: true },
  { from: 353, to: 383, text: 'Want rose instead?', hl: 'rose', top: true },
  { from: 385, to: 432, text: 'Or going darker?', hl: 'darker?', top: true },
  { from: 441, to: 471, text: 'Then book it', hl: 'book', top: true },
  { from: 473, to: 505, text: 'right on their site.', hl: 'site.', top: true },
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

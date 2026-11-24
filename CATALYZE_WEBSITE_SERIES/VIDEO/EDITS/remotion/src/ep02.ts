// Episode 02: The Salon Sanctuary, Burlington Street, Liverpool. Every timing and word for the edit.
// 30 fps. Paced to the conversational narration in VOICE/SCRIPTS/EPISODE_02.md (about 35s).
// Retime `captions` (and `scenes` if needed) to match the final voiceover.

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const scenes = {
  hook: { from: 0, dur: 125 },       // 0.0 to 4.2s   "This salon in Liverpool didn't have a website, so I built them one."
  business: { from: 125, dur: 175 }, // 4.2 to 10.0s  the mirror: "It's The Salon Sanctuary... their name writes itself on a steamed-up mirror."
  feature: { from: 300, dur: 550 },  // 10.0 to 28.3s Find your colour: tap now, tap goal, three answers, with zooms
  reveal: { from: 850, dur: 150 },   // 28.3 to 33.3s "Then you book it, right there on their site." laptop and phone head-on
  outro: { from: 1000, dur: 50 },    // 33.3 to 35.0s "Who's next?"
};
export const TOTAL = 1050; // 35.0s

// Hook: when part A (the shopfront) whips into part B (blurred site scroll)
export const hookSplit = 80;
// Business: the mirror capture starts playing at this frame (fogged glass held before it)
export const mirrorStart = 70;

// Taps inside the finder capture (frames of finder-mobile.mp4, see scripts/capture-ep02.cjs):
// 157 Dark brown (now), 212 Golden blonde (goal), 370 Rose (goal), 454 Golden blonde (now), 474 Chestnut (goal).
// The capture glides from the ring to the dots + suggestion between frames 220 and 242.
export const finderTaps = { taps: [157, 212, 370, 454, 474], trim: 2 };

// Camera inside the feature beat: [scene frame, focus y on the 1080x1920 canvas, scale].
// Focus points: phone at rest 1088; dots before the glide 1324; dots after 668; the suggestion 1138.
export const finderCamera: [number, number, number][] = [
  [0, 1088, 1], [96, 1088, 1], [116, 1324, 1.5], [212, 1324, 1.5], [222, 1088, 1.05], [240, 1088, 1.05],
  [254, 1138, 1.42], [338, 1138, 1.42], [352, 668, 1.6], [372, 668, 1.6], [386, 1138, 1.42], [434, 1138, 1.42],
  [446, 668, 1.6], [476, 668, 1.6], [488, 1138, 1.42], [550, 1138, 1.46],
];

export const hookLines = {
  a: ['This salon in', "Liverpool didn't", 'have a website,'],
  b: ['so I built', 'them one.'],
};

export const place = {
  area: 'Liverpool',
  street: '61 Burlington Street',
  name: 'The Salon Sanctuary',
};

export type Cap = { from: number; to: number; text: string; hl?: string; top?: boolean };
export const captions: Cap[] = [
  { from: 130, to: 160, text: "It's The Salon Sanctuary,", hl: 'Sanctuary,' },
  { from: 160, to: 190, text: 'on Burlington Street.', hl: 'Burlington' },
  { from: 196, to: 222, text: 'When you open it,', hl: 'open' },
  { from: 222, to: 255, text: 'their name writes itself', hl: 'writes' },
  { from: 255, to: 292, text: 'on a steamed-up mirror.', hl: 'mirror.' },
  { from: 302, to: 322, text: 'But this is', top: true },
  { from: 322, to: 346, text: 'my favourite bit.', hl: 'favourite', top: true },
  { from: 348, to: 374, text: "If you're not sure", hl: 'sure', top: true },
  { from: 374, to: 400, text: 'what to book,', hl: 'book,', top: true },
  { from: 402, to: 430, text: 'you just tap the colour', hl: 'tap', top: true },
  { from: 430, to: 458, text: 'your hair is now,', hl: 'now,', top: true },
  { from: 460, to: 486, text: 'and the colour', top: true },
  { from: 486, to: 514, text: "you'd like.", hl: 'like.', top: true },
  { from: 520, to: 550, text: "If you're going blonde,", hl: 'blonde,', top: true },
  { from: 552, to: 585, text: 'it shows you where to start,', hl: 'start,', top: true },
  { from: 587, to: 618, text: 'and what it costs.', hl: 'costs.', top: true },
  { from: 640, to: 670, text: 'Or fancy rose instead?', hl: 'rose', top: true },
  { from: 685, to: 712, text: 'It changes.', hl: 'changes.', top: true },
  { from: 742, to: 772, text: 'Going darker?', hl: 'darker?', top: true },
  { from: 780, to: 814, text: 'It changes again.', hl: 'again.', top: true },
  { from: 856, to: 886, text: 'Then you book it,', hl: 'book', top: true },
  { from: 888, to: 926, text: 'right there on their site.', hl: 'site.', top: true },
  // "Who's next?" is the outro title itself
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

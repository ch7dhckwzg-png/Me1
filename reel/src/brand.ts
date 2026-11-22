export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const C = {
  ink: '#1C1B17',
  cream: '#F2ECDE',
  gold: '#DFCFAE', // sampled from the tagline in catalyze-logo-cream.png
  brown: '#2A231B',
  brown2: '#372E1F',
  tan: '#C8714A',
  grey: '#8A8A8A',
  greyLight: '#BDBDBD',
  white: '#FFFFFF',
  black: '#000000',
};

// The logo box: same size and position in every scene (70% of frame width, centred).
export const LOGO_W = Math.round(W * 0.7); // 756
export const LOGO_H = Math.round((LOGO_W * 976) / 2572); // 287
export const LOGO_X = (W - LOGO_W) / 2;
export const LOGO_Y = (H - LOGO_H) / 2;

export const FONT_SANS = '"Hanken Grotesk", system-ui, sans-serif';
export const FONT_MONO = '"IBM Plex Mono", ui-monospace, monospace';

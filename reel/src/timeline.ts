import cutsFile from './cuts.json';

/**
 * Scene order. `CUTS[i]` is the frame where SEQUENCE[i] starts; the last scene runs to END.
 * Retime to a track by editing src/cuts.json (or run `npm run beats` with public/music.mp3).
 */
export const SEQUENCE = [
  'concrete',
  'grid',
  'silhouette',
  'lockup',
  'flatGrey',
  'rock',
  'glass',
  'space',
  'appIcon',
  'palette',
  'darkFade',
  // rapid-fire second half
  'concreteTan',
  'concrete',
  'rockInverted',
  'glass',
  'grid',
  'space',
  'appIcon',
  'silhouette',
  'lockup',
  'palette',
  'rock',
  'flatGrey',
  'concreteTan',
  'glass',
  'space',
  'endCard',
] as const;

export type SceneId = (typeof SEQUENCE)[number];

export const CUTS: number[] = cutsFile.cuts;
export const END: number = cutsFile.end;
export const HAS_MUSIC: boolean = cutsFile.music;

if (CUTS.length !== SEQUENCE.length) {
  throw new Error(`cuts.json has ${CUTS.length} cuts but SEQUENCE has ${SEQUENCE.length} scenes`);
}

// Shared timing for the Catalyze intro. The composition runs at 60 fps so that
// scroll-scrubbing stays smooth: one scroll step rarely skips a visible frame.
export const FPS = 60
export const DURATION = 480 // 8 s

// Frames 0..AUTOPLAY_END play by themselves when the page opens. Everything after
// that is driven by scroll position (see src/sections/Intro.jsx).
export const AUTOPLAY_END = 150

// Story beats, in frames. Kept here so the Player driver and the composition agree.
export const BEAT = {
  converge: 160, // the four disciplines start spiralling inward
  collide: 290, // they meet: flash, shockwave, sparks
  logo: 300, // the logo is sprayed on
  exitStart: 410, // the lock-up lifts away for the hero
  exitEnd: 475,
}

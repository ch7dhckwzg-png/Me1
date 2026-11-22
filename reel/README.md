# CATALYZE logo reel

A vertical, hard-cut logo showcase (1080×1920, 30 fps, 8.5 s, H.264), built with Remotion. The mark stays locked in the centre at 70% of the frame width while the surface around it changes every 6–12 frames.

## Files

| Path | What it is |
| --- | --- |
| `assets/catalyze-logo.svg` | The traced mark: one recolourable path (`fill="currentColor"`) |
| `assets/catalyze-logo-*.png` | The source logo images |
| `src/scenes/` | One component per scene |
| `src/cuts.json` | The cut points: the frame each scene starts on |
| `src/timeline.ts` | Scene order (`SEQUENCE`), which pairs up with `cuts` |
| `out/catalyze-reel.mp4` | The render |
| `out/contact-sheet.png` | One frame from each of the 12 scenes |

## Commands

```bash
npm install
npm run studio   # preview and scrub in the browser
npm run render   # out/catalyze-reel.mp4
npm run sheet    # out/contact-sheet.png (from the render)
npm run verify   # checks the logo never moves at a cut and no frame is blank
npm run trace    # re-trace the SVG from assets/catalyze-logo-white.png (needs potrace + ImageMagick)
```

On a machine that can't download Chrome Headless Shell, point Remotion at a local one with `REMOTION_BROWSER=/path/to/chrome-headless-shell`.

## Music

Put a track at `public/music.mp3` and run `npm run beats`. It finds the onsets, moves each cut to the nearest beat within 3 frames, and switches the audio on. Then run `npm run render`. Without a track, `npm run beats` puts back the even ~0.3 s grid. You can also edit `src/cuts.json` by hand.

// Build out/contact-sheet.png: one frame from each of the 12 distinct scenes (3 x 4),
// taken from the rendered MP4 so it shows exactly what ships.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const { cuts, end } = JSON.parse(readFileSync('src/cuts.json', 'utf8'));
const video = 'out/catalyze-reel.mp4';
// Scenes 1-11 are the first 11 cuts; the end card is the last.
const picks = [...cuts.slice(0, 11).map((c, i) => [c, cuts[i + 1]]), [cuts.at(-1), end]];
const labels = ['1 concrete', '2 grid', '3 silhouette', '4 lockup', '5 flat grey', '6 rock', '7 glass', '8 space', '9 app icon', '10 palette', '11 dark fade', '13 end card'];
const dir = mkdtempSync(join(tmpdir(), 'sheet-'));
const files = picks.map(([a, b], i) => {
  // the dark fade is shown at its first frame; everything else a little in, once motion settles
  const frame = i === 10 ? a + 1 : Math.min(b - 1, a + Math.round((b - a) * (i === 11 ? 0.8 : 0.6)));
  const out = join(dir, `${String(i).padStart(2, '0')}.png`);
  execFileSync('ffmpeg', ['-v', 'error', '-i', video, '-vf', `select=eq(n\\,${frame}),scale=360:640`, '-frames:v', '1', out]);
  return out;
});
execFileSync('montage', [
  ...files.flatMap((f, i) => ['-label', labels[i], f]),
  '-tile', '4x3', '-geometry', '360x640+12+12', '-background', '#111', '-fill', '#ddd', '-pointsize', '18',
  'out/contact-sheet.png',
]);
rmSync(dir, { recursive: true });
console.log('Wrote out/contact-sheet.png');

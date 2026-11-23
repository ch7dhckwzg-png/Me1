// Frame-accurate captures of the live site for the edit.
// Page animations run at 1/SLOW speed (CDP + slowed timers) and each frame is a crisp screenshot,
// then ffmpeg packs the frames at 30 fps. Usage: node scripts/capture-site.cjs <name> [url]
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const name = process.argv[2];
const URL = process.argv[3] || 'http://127.0.0.1:4321/';
const OUT = `public/ep01/${name}`;
const SLOW = 10, FPS = 30, FRAME_MS = 1000 / FPS * SLOW;
const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const shots = {
  // desktop hero: hold on the cup, scroll the morph, hold on the pizza while the headline rolls in
  'hero-desktop': { vp: { width: 1440, height: 900 }, dsf: 1.5, frames: 156, path: (f, r) => {
    const p = f < 14 ? 0 : f < 110 ? ease((f - 14) / 96) : 1; return r.top + r.len * p; } },
  // phone hero morph, then on down into the menu
  'hero-mobile': { vp: { width: 390, height: 844 }, dsf: 3, frames: 170, path: (f, r) => {
    if (f < 12) return 0; if (f < 92) return r.top + r.len * ease((f - 12) / 80);
    if (f < 112) return r.top + r.len; return r.top + r.len + 900 * ease(Math.min(1, (f - 112) / 58)); } },
  // desktop menu: pizza tab drawing itself
  'menu-desktop': { vp: { width: 1440, height: 900 }, dsf: 1.5, frames: 90, menu: true, path: (f, r) => r.menuTop },
};

(async () => {
  const cfg = shots[name]; if (!cfg) throw new Error('unknown shot ' + name);
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: cfg.vp, deviceScaleFactor: cfg.dsf, reducedMotion: 'no-preference' });
  const p = await ctx.newPage();
  // Saturday 28 Nov 2026, 11:42 in New Brighton: the live status reads as a real morning
  await p.clock.setFixedTime(new Date('2026-11-28T11:42:00Z'));
  await p.addInitScript(() => { const st = window.setTimeout; window.setTimeout = (f, d, ...a) => st(f, (d || 0) * (window.__slow || 1), ...a); });
  await p.goto(URL + '?mode=day', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3500); // opening cup turn-in finishes at normal speed
  const r = await p.evaluate(() => { const t = document.querySelector('[data-hero-track]'); const m = document.querySelector('#menu');
    return { top: t.getBoundingClientRect().top + scrollY - 72, len: t.offsetHeight - (innerHeight - 72), menuTop: m.getBoundingClientRect().top + scrollY - 72 }; });
  if (cfg.menu) { await p.evaluate((y) => scrollTo(0, y), r.menuTop); await p.waitForTimeout(1500); }
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Animation.enable');
  await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / SLOW });
  await p.evaluate((s) => { window.__slow = s; }, SLOW);
  if (cfg.menu) { await p.evaluate(() => { document.querySelector('[data-tab="pizza"]').click(); }); }
  for (let f = 0; f < cfg.frames; f++) {
    const t0 = Date.now();
    await p.evaluate((y) => { scrollTo(0, y); window.dispatchEvent(new Event('scroll')); }, Math.round(cfg.path(f, r)));
    const wait = FRAME_MS - (Date.now() - t0) - 60;
    if (wait > 0) await p.waitForTimeout(wait);
    await p.screenshot({ path: `${OUT}/f${String(f).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 94 });
  }
  await b.close();
  execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${OUT}/f%04d.jpg -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p ${OUT}.mp4`);
  fs.rmSync(OUT, { recursive: true, force: true });
  console.log(name, 'done', execSync(`ffprobe -v error -show_entries stream=width,height,nb_frames -of csv=p=0 ${OUT}.mp4`).toString().trim());
})();

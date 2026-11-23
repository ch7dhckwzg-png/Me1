// Episode 02 (The Salon Sanctuary): frame-accurate captures of the concept site.
// Like capture-site.cjs, but the site also animates with requestAnimationFrame
// (swatch ring, tile wall, count-up), so the page clock is slowed too: a
// virtual performance.now / rAF timestamp runs at `speed / SLOW` of real time.
// Usage: node scripts/capture-ep02.cjs <shot> [url]
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const name = process.argv[2];
const URL = process.argv[3] || 'http://127.0.0.1:4322/';
const OUT = `public/ep02/${name}`;
const SLOW = 10, FPS = 30, FRAME_MS = 1000 / FPS * SLOW;
const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v) => Math.max(0, Math.min(1, v));

const fullPath = (f, r) => (f < 12 ? 0 : r.bottom * ease(clamp((f - 12) / 106)));
const shots = {
  // the mirror opening, from the first frame of fog, at 2.2x speed (4.4s into 2s)
  'mirror-mobile': { vp: { width: 390, height: 844 }, dsf: 3, frames: 60, speed: 2.2, fromLoad: true, path: () => 0 },
  // Find your colour: the ring fans open, tap "Dark brown", tap "Golden blonde", glide down to the suggestions
  'finder-mobile': { vp: { width: 390, height: 844 }, dsf: 3, frames: 140, speed: 1, finder: true,
    path: (f, r) => r.finder + 270 * ease(clamp((f - 84) / 36)) },
  // whole page top to bottom on one shared timeline (laptop and phone in sync)
  'full-desktop': { vp: { width: 1440, height: 900 }, dsf: 1.25, frames: 125, speed: 1, path: fullPath },
  'full-mobile': { vp: { width: 390, height: 844 }, dsf: 2, frames: 125, speed: 1, path: fullPath },
};

(async () => {
  const cfg = shots[name]; if (!cfg) throw new Error('unknown shot ' + name);
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: cfg.vp, deviceScaleFactor: cfg.dsf, reducedMotion: 'no-preference' });
  const p = await ctx.newPage();
  // Thursday 26 Nov 2026, 14:20 in Liverpool: the salon reads as open
  await p.clock.setFixedTime(new Date('2026-11-26T14:20:00Z'));
  await p.addInitScript(() => {
    // virtual clock for JS animations; rate is set from outside via window.__rate
    window.__rate = 1;
    const real = performance.now.bind(performance);
    let lastReal = real(), v = lastReal;
    const now = () => { const r = real(); v += (r - lastReal) * window.__rate; lastReal = r; return v; };
    performance.now = now;
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => raf(() => cb(now()));
    const st = window.setTimeout;
    window.setTimeout = (fn, d, ...a) => st(fn, (d || 0) / window.__rate, ...a);
  });
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Animation.enable');
  const slowDown = async () => {
    const rate = cfg.speed / SLOW;
    await cdp.send('Animation.setPlaybackRate', { playbackRate: rate });
    await p.evaluate((r) => { window.__rate = r; }, rate);
  };
  if (cfg.fromLoad) {
    await cdp.send('Animation.setPlaybackRate', { playbackRate: cfg.speed / SLOW });
    await p.addInitScript((r) => { window.__rate = r; }, cfg.speed / SLOW);
    await p.goto(URL, { waitUntil: 'domcontentloaded' });
    await p.evaluate(() => document.fonts.ready);
  } else {
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(5200); // mirror finishes at normal speed
  }
  const r = await p.evaluate(() => ({
    finder: (document.querySelector('#finder .fan')?.getBoundingClientRect().top ?? 0) + scrollY - 40,
    bottom: document.documentElement.scrollHeight - innerHeight,
  }));
  if (!cfg.fromLoad) await slowDown();
  // a soft tap ring, shown where the finger lands (capture only)
  await p.addStyleTag({ content: '.__tap{position:absolute;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;border:2.5px solid #fff;background:rgba(255,255,255,.28);box-shadow:0 2px 14px rgba(0,0,0,.35);pointer-events:none;z-index:9999;animation:__tap 1s cubic-bezier(.2,.7,.1,1) forwards}@keyframes __tap{0%{transform:scale(.5);opacity:0}15%{opacity:1}60%{transform:scale(1);opacity:1}100%{transform:scale(1.35);opacity:0}}' });
  const tap = (sel) => p.evaluate((s) => {
    const el = document.querySelector(s); const rc = el.getBoundingClientRect();
    const d = document.createElement('div'); d.className = '__tap';
    d.style.left = `${rc.left + rc.width / 2 + scrollX}px`; d.style.top = `${rc.top + rc.height / 2 + scrollY}px`;
    document.body.appendChild(d); el.click();
  }, sel);
  for (let f = 0; f < cfg.frames; f++) {
    const t0 = Date.now();
    await p.evaluate((y) => { scrollTo(0, y); window.dispatchEvent(new Event('scroll')); }, Math.round(cfg.path(f, r)));
    if (cfg.finder && f === 50) await tap('[data-pick="now"][data-shade="0"]');
    if (cfg.finder && f === 74) await tap('[data-pick="goal"][data-shade="5"]');
    const wait = FRAME_MS - (Date.now() - t0) - 60;
    if (wait > 0) await p.waitForTimeout(wait);
    await p.screenshot({ path: `${OUT}/f${String(f).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 94 });
  }
  await b.close();
  execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${OUT}/f%04d.jpg -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p ${OUT}.mp4`);
  fs.rmSync(OUT, { recursive: true, force: true });
  console.log(name, 'done', execSync(`ffprobe -v error -show_entries stream=width,height,nb_frames -of csv=p=0 ${OUT}.mp4`).toString().trim());
})();

// Top-down "dish" renders for the hero, drawn in code (no photos).
// A flat white with latte art on a ceramic saucer, and Social 114's
// pepperoni, jalapeño and honey pizza on a dark stone plate.

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

function rng(seed: number) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }

function blobPath(ctx: Ctx, cx: number, cy: number, r: number, wob: number, rand: () => number, n = 40) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * TAU, rr = r + (rand() - 0.5) * wob;
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  });
  ctx.beginPath();
  ctx.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
  for (let i = 1; i <= n; i++) {
    const p = pts[i % n], q = pts[(i + 1) % n];
    ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
  }
  ctx.closePath();
}

function radial(ctx: Ctx, x: number, y: number, r0: number, r1: number, stops: [number, string][], fx = x, fy = y) {
  const g = ctx.createRadialGradient(fx, fy, r0, x, y, r1);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}

function circle(ctx: Ctx, x: number, y: number, r: number) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }

function speckle(ctx: Ctx, cx: number, cy: number, r: number, count: number, rand: () => number, colors: string[], size: [number, number], inner = 0) {
  for (let i = 0; i < count; i++) {
    const a = rand() * TAU, d = inner + Math.sqrt(rand()) * (r - inner);
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
    const s = size[0] + rand() * (size[1] - size[0]);
    ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d, s, s * (0.6 + rand() * 0.4), rand() * TAU, 0, TAU); ctx.fill();
  }
}

/* ---------------- Flat white on a saucer ---------------- */
export function drawCup(ctx: Ctx, S: number) {
  const c = S / 2, k = S / 1000;
  const rand = rng(1140);
  ctx.save();

  // soft cast shadow
  ctx.save(); ctx.filter = `blur(${28 * k}px)`;
  ctx.fillStyle = 'rgba(40, 30, 20, .28)'; circle(ctx, c + 22 * k, c + 34 * k, 430 * k); ctx.fill(); ctx.restore();

  // saucer
  ctx.fillStyle = radial(ctx, c, c, 0, 445 * k, [[0, '#f7f4ee'], [.62, '#efe9df'], [.9, '#e3dbcd'], [1, '#d6cdbd']], c - 80 * k, c - 90 * k);
  circle(ctx, c, c, 440 * k); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 3 * k; circle(ctx, c, c, 430 * k); ctx.stroke();
  // saucer well
  ctx.fillStyle = radial(ctx, c, c, 230 * k, 320 * k, [[0, 'rgba(120,100,80,0)'], [.8, 'rgba(120,100,80,.10)'], [1, 'rgba(120,100,80,0)']]);
  circle(ctx, c, c, 320 * k); ctx.fill();

  // spoon resting on the saucer
  ctx.save();
  ctx.translate(c, c); ctx.rotate(-0.55);
  ctx.save(); ctx.filter = `blur(${6 * k}px)`; ctx.fillStyle = 'rgba(60,45,30,.25)';
  ctx.beginPath(); ctx.ellipse(342 * k + 8 * k, 12 * k, 52 * k, 32 * k, 0, 0, TAU); ctx.fill(); ctx.fillRect(170 * k, 4 * k, 160 * k, 16 * k); ctx.restore();
  const steel = ctx.createLinearGradient(0, -30 * k, 0, 30 * k);
  steel.addColorStop(0, '#f2f3f5'); steel.addColorStop(.45, '#b9bdc4'); steel.addColorStop(.55, '#d9dce0'); steel.addColorStop(1, '#8e939b');
  ctx.fillStyle = steel;
  ctx.beginPath(); ctx.ellipse(342 * k, 0, 50 * k, 30 * k, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(292 * k, -7 * k); ctx.quadraticCurveTo(230 * k, -5 * k, 170 * k, -9 * k); ctx.lineTo(170 * k, 9 * k); ctx.quadraticCurveTo(230 * k, 6 * k, 292 * k, 7 * k); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.ellipse(330 * k, -10 * k, 26 * k, 7 * k, -0.1, 0, TAU); ctx.fill();
  ctx.restore();

  // cup shadow on the saucer
  ctx.save(); ctx.filter = `blur(${18 * k}px)`; ctx.fillStyle = 'rgba(50,38,26,.32)';
  circle(ctx, c + 16 * k, c + 22 * k, 258 * k); ctx.fill(); ctx.restore();

  // handle (seen from above)
  ctx.save(); ctx.translate(c, c); ctx.rotate(-0.95);
  ctx.save(); ctx.filter = `blur(${8 * k}px)`; ctx.fillStyle = 'rgba(50,38,26,.28)'; ctx.beginPath(); ctx.roundRect(232 * k, -18 * k, 150 * k, 50 * k, 25 * k); ctx.fill(); ctx.restore();
  const hg = ctx.createLinearGradient(0, -26 * k, 0, 26 * k);
  hg.addColorStop(0, '#fbf9f5'); hg.addColorStop(.6, '#ece6dc'); hg.addColorStop(1, '#d9d1c4');
  ctx.fillStyle = hg; ctx.beginPath(); ctx.roundRect(230 * k, -24 * k, 148 * k, 48 * k, 24 * k); ctx.fill();
  ctx.fillStyle = 'rgba(160,145,125,.35)'; ctx.beginPath(); ctx.roundRect(268 * k, -8 * k, 84 * k, 16 * k, 8 * k); ctx.fill();
  ctx.restore();

  // cup body and rim
  ctx.fillStyle = radial(ctx, c, c, 0, 262 * k, [[0, '#fcfaf6'], [.85, '#f1ece3'], [1, '#ddd5c7']], c - 60 * k, c - 70 * k);
  circle(ctx, c, c, 258 * k); ctx.fill();
  ctx.fillStyle = radial(ctx, c, c, 200 * k, 236 * k, [[0, '#cbbfae'], [.6, '#e7e0d4'], [1, '#f6f2ec']]);
  circle(ctx, c, c, 236 * k); ctx.fill();

  // coffee with crema
  const coffeeR = 214 * k;
  ctx.fillStyle = radial(ctx, c, c, 0, coffeeR, [[0, '#b98a57'], [.55, '#a0703f'], [.85, '#7a4b24'], [1, '#4f2d14']]);
  circle(ctx, c, c, coffeeR); ctx.fill();
  ctx.save(); circle(ctx, c, c, coffeeR); ctx.clip();
  speckle(ctx, c, c, coffeeR, 900, rand, ['rgba(70,40,18,.18)', 'rgba(210,170,120,.16)'], [1 * k, 3 * k]);

  // latte art: a stacked tulip, poured from the bottom
  const foam = '#f4ead9';
  const tulip = (y: number, w: number, h: number) => {
    ctx.beginPath();
    ctx.moveTo(c, y + h * .55);
    ctx.bezierCurveTo(c - w * 1.05, y + h * .35, c - w * .9, y - h * .55, c - w * .1, y - h * .5);
    ctx.quadraticCurveTo(c, y - h * .2, c + w * .1, y - h * .5);
    ctx.bezierCurveTo(c + w * .9, y - h * .55, c + w * 1.05, y + h * .35, c, y + h * .55);
    ctx.closePath();
  };
  ctx.save(); ctx.filter = `blur(${2.2 * k}px)`;
  const layers: [number, number, number][] = [[c + 70 * k, 150 * k, 120 * k], [c + 8 * k, 118 * k, 96 * k], [c - 48 * k, 88 * k, 74 * k], [c - 96 * k, 58 * k, 52 * k]];
  layers.forEach(([y, w, h], i) => {
    ctx.fillStyle = foam; tulip(y, w, h); ctx.fill();
    if (i < layers.length - 1) { ctx.fillStyle = 'rgba(150,100,55,.85)'; tulip(y - h * .16, w * .78, h * .72); ctx.fill(); }
  });
  ctx.strokeStyle = 'rgba(150,100,55,.9)'; ctx.lineWidth = 5 * k;
  ctx.beginPath(); ctx.moveTo(c, c - 150 * k); ctx.quadraticCurveTo(c + 3 * k, c, c, c + 132 * k); ctx.stroke();
  ctx.restore();
  speckle(ctx, c, c + 10 * k, 140 * k, 260, rand, ['rgba(255,250,240,.25)'], [0.8 * k, 2 * k]);
  // liquid sheen
  ctx.fillStyle = radial(ctx, c - 90 * k, c - 110 * k, 0, 160 * k, [[0, 'rgba(255,255,255,.22)'], [1, 'rgba(255,255,255,0)']]);
  circle(ctx, c, c, coffeeR); ctx.fill();
  ctx.restore();

  // rim highlight
  ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 2.5 * k;
  ctx.beginPath(); ctx.arc(c, c, 247 * k, Math.PI * 1.05, Math.PI * 1.75); ctx.stroke();
  ctx.restore();
}

/* ---------------- Pepperoni, jalapeño and honey ---------------- */
export function drawPizza(ctx: Ctx, S: number) {
  const c = S / 2, k = S / 1000;
  const rand = rng(1801);
  ctx.save();

  // dark stone plate
  ctx.save(); ctx.filter = `blur(${30 * k}px)`; ctx.fillStyle = 'rgba(0,0,0,.55)'; circle(ctx, c + 20 * k, c + 34 * k, 455 * k); ctx.fill(); ctx.restore();
  ctx.fillStyle = radial(ctx, c, c, 0, 470 * k, [[0, '#2a2e36'], [.8, '#1e2129'], [1, '#14161c']], c - 120 * k, c - 140 * k);
  circle(ctx, c, c, 465 * k); ctx.fill();
  speckle(ctx, c, c, 460 * k, 1400, rand, ['rgba(255,255,255,.035)', 'rgba(0,0,0,.12)'], [0.8 * k, 2.2 * k]);
  ctx.strokeStyle = 'rgba(255,255,255,.10)'; ctx.lineWidth = 2 * k; circle(ctx, c, c, 455 * k); ctx.stroke();

  // pizza shadow
  ctx.save(); ctx.filter = `blur(${16 * k}px)`; ctx.fillStyle = 'rgba(0,0,0,.6)'; blobPath(ctx, c + 10 * k, c + 16 * k, 392 * k, 16 * k, rng(3)); ctx.fill(); ctx.restore();

  // crust
  blobPath(ctx, c, c, 392 * k, 18 * k, rng(5), 48);
  ctx.fillStyle = radial(ctx, c, c, 300 * k, 395 * k, [[0, '#e9c48c'], [.55, '#dca866'], [.85, '#c78744'], [1, '#9a5f2c']]);
  ctx.fill();
  ctx.save(); blobPath(ctx, c, c, 392 * k, 18 * k, rng(5), 48); ctx.clip();
  // puffy blisters on the cornicione
  for (let i = 0; i < 34; i++) {
    const a = rand() * TAU, d = 345 * k + rand() * 30 * k, r = (14 + rand() * 22) * k;
    const x = c + Math.cos(a) * d, y = c + Math.sin(a) * d;
    ctx.fillStyle = radial(ctx, x, y, 0, r, [[0, 'rgba(250,225,175,.75)'], [1, 'rgba(250,225,175,0)']], x - r * .3, y - r * .3);
    circle(ctx, x, y, r); ctx.fill();
  }
  // leopard char
  for (let i = 0; i < 120; i++) {
    const a = rand() * TAU, d = 322 * k + rand() * 72 * k, r = (2 + rand() * (rand() < .2 ? 14 : 6)) * k;
    const x = c + Math.cos(a) * d, y = c + Math.sin(a) * d;
    ctx.fillStyle = radial(ctx, x, y, 0, r * 1.6, [[0, 'rgba(40,22,10,.95)'], [.6, 'rgba(60,32,14,.55)'], [1, 'rgba(60,32,14,0)']]);
    circle(ctx, x, y, r * 1.6); ctx.fill();
  }
  speckle(ctx, c, c, 395 * k, 700, rand, ['rgba(255,240,210,.18)', 'rgba(110,60,25,.18)'], [0.8 * k, 2 * k], 320 * k);
  ctx.restore();

  // tomato
  const sauceR = 318 * k;
  blobPath(ctx, c, c, sauceR, 22 * k, rng(9), 44);
  ctx.fillStyle = radial(ctx, c, c, 0, sauceR, [[0, '#c23b22'], [.75, '#b0321c'], [1, '#8d2715']]);
  ctx.fill();
  ctx.save(); blobPath(ctx, c, c, sauceR, 22 * k, rng(9), 44); ctx.clip();
  speckle(ctx, c, c, sauceR, 900, rand, ['rgba(120,25,12,.35)', 'rgba(230,90,50,.25)', 'rgba(255,170,120,.15)'], [1 * k, 4 * k]);

  // mozzarella pools with browned edges
  const pools: [number, number, number][] = [];
  for (let g = 0; pools.length < 11 && g < 400; g++) {
    const a = rand() * TAU, d = Math.sqrt(rand()) * 250 * k, r = (42 + rand() * 34) * k;
    const x = c + Math.cos(a) * d, y = c + Math.sin(a) * d;
    if (pools.every(([px, py, pr]) => Math.hypot(px - x, py - y) > (pr + r) * .78)) pools.push([x, y, r]);
  }
  pools.forEach(([x, y, r], i) => {
    ctx.save(); ctx.filter = `blur(${3 * k}px)`;
    blobPath(ctx, x, y, r + 5 * k, r * .35, rng(20 + i), 16); ctx.fillStyle = 'rgba(200,140,70,.55)'; ctx.fill();
    ctx.restore();
    blobPath(ctx, x, y, r, r * .3, rng(20 + i), 16);
    ctx.fillStyle = radial(ctx, x, y, 0, r, [[0, '#fbf3e0'], [.7, '#f3e3c2'], [1, '#e2c491']], x - r * .3, y - r * .35);
    ctx.fill();
    speckle(ctx, x, y, r * .85, 14, rand, ['rgba(190,120,50,.35)'], [1.5 * k, 4 * k]);
  });

  // pepperoni, cupped
  const pep: [number, number][] = [];
  for (let g = 0; pep.length < 15 && g < 600; g++) {
    const a = rand() * TAU, d = 40 * k + Math.sqrt(rand()) * 245 * k;
    const p: [number, number] = [c + Math.cos(a) * d, c + Math.sin(a) * d];
    if (pep.every(([x, y]) => Math.hypot(x - p[0], y - p[1]) > 78 * k)) pep.push(p);
  }
  pep.forEach(([x, y]) => {
    const r = (34 + rand() * 6) * k;
    ctx.save(); ctx.filter = `blur(${5 * k}px)`; ctx.fillStyle = 'rgba(60,10,5,.45)'; circle(ctx, x + 4 * k, y + 6 * k, r); ctx.fill(); ctx.restore();
    ctx.fillStyle = radial(ctx, x, y, 0, r, [[0, '#c4402a'], [.7, '#a82c1b'], [.92, '#7d1c10'], [1, '#4e100a']], x - r * .25, y - r * .3);
    circle(ctx, x, y, r); ctx.fill();
    speckle(ctx, x, y, r * .85, 16, rand, ['rgba(255,215,190,.55)', 'rgba(90,15,8,.45)'], [1.2 * k, 3 * k]);
    ctx.fillStyle = radial(ctx, x - r * .2, y - r * .25, 0, r * .55, [[0, 'rgba(255,190,130,.55)'], [1, 'rgba(255,190,130,0)']]);
    circle(ctx, x, y, r); ctx.fill();
  });

  // jalapeño rings
  for (let i = 0, g = 0; i < 12 && g < 500; g++) {
    const a = rand() * TAU, d = Math.sqrt(rand()) * 270 * k;
    const x = c + Math.cos(a) * d, y = c + Math.sin(a) * d;
    if (pep.some(([px, py]) => Math.hypot(px - x, py - y) < 48 * k)) continue;
    i++;
    const r = (15 + rand() * 4) * k;
    ctx.save(); ctx.filter = `blur(${3 * k}px)`; ctx.fillStyle = 'rgba(20,40,10,.4)'; circle(ctx, x + 2 * k, y + 3 * k, r); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#4b7f2c'; circle(ctx, x, y, r); ctx.fill();
    ctx.fillStyle = '#d9e3b8'; circle(ctx, x, y, r * .66); ctx.fill();
    ctx.fillStyle = '#9fbf6a'; circle(ctx, x, y, r * .34); ctx.fill();
    for (let s = 0; s < 6; s++) { const sa = s * TAU / 6 + rand(); ctx.fillStyle = '#f3efd6'; circle(ctx, x + Math.cos(sa) * r * .48, y + Math.sin(sa) * r * .48, 1.8 * k); ctx.fill(); }
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.5 * k; ctx.beginPath(); ctx.arc(x, y, r * .92, Math.PI * 1.1, Math.PI * 1.6); ctx.stroke();
  }

  // hot honey drizzle, glossy
  for (let j = 0; j < 3; j++) {
    ctx.beginPath();
    let x = c - 300 * k, y = c - 150 * k + j * 140 * k;
    ctx.moveTo(x, y);
    for (let s = 0; s < 7; s++) {
      const nx = x + 95 * k, ny = c - 150 * k + j * 140 * k + (rand() - .5) * 90 * k;
      ctx.bezierCurveTo(x + 30 * k, y - 60 * k * (s % 2 ? 1 : -1), nx - 30 * k, ny + 60 * k * (s % 2 ? 1 : -1), nx, ny);
      x = nx; y = ny;
    }
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(214,140,30,.85)'; ctx.lineWidth = 7 * k; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,225,150,.75)'; ctx.lineWidth = 2 * k; ctx.stroke();
  }
  ctx.restore();

  // oven-glow sheen over the whole pie
  blobPath(ctx, c, c, 392 * k, 18 * k, rng(5), 48);
  ctx.fillStyle = radial(ctx, c - 120 * k, c - 140 * k, 0, 420 * k, [[0, 'rgba(255,220,170,.14)'], [1, 'rgba(255,220,170,0)']]);
  ctx.fill();
  ctx.restore();
}

export function renderDish(canvas: HTMLCanvasElement, kind: 'cup' | 'pizza') {
  const css = canvas.offsetWidth || 600; // layout size, ignoring the turn/scale transform
  const S = Math.min(1400, Math.round(css * Math.min(2, window.devicePixelRatio || 1)));
  canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, S, S);
  (kind === 'cup' ? drawCup : drawPizza)(ctx, S);
}

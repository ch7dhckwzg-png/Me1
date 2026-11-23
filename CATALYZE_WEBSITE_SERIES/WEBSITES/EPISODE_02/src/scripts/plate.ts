// A rubber bumper plate seen from above, drawn in code (no photos).
// Two versions: the embossed rim reads APEX · BIRKENHEAD or APEX · ELLESMERE PORT.

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
function rng(seed: number) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }
const circle = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); c.arc(x, y, r, 0, TAU); };
function radial(c: Ctx, x: number, y: number, r0: number, r1: number, stops: [number, string][], fx = x, fy = y) {
  const g = c.createRadialGradient(fx, fy, r0, x, y, r1);
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  return g;
}

// text running clockwise around a circle, centred on `mid` (radians, 0 = 3 o'clock)
function arcText(c: Ctx, text: string, cx: number, cy: number, r: number, mid: number, size: number, track: number, fill: string) {
  c.save();
  c.font = `800 ${size}px "Archivo Variable", "Archivo", "Arial Narrow", sans-serif`;
  c.textAlign = 'center'; c.textBaseline = 'middle';
  const widths = [...text].map((ch) => c.measureText(ch).width + track);
  const total = widths.reduce((a, b) => a + b, 0);
  let a = mid - total / r / 2;
  [...text].forEach((ch, i) => {
    const w = widths[i];
    a += w / r / 2;
    c.save(); c.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r); c.rotate(a + Math.PI / 2);
    c.fillStyle = fill; c.fillText(ch, 0, 0);
    c.restore();
    a += w / r / 2;
  });
  c.restore();
}

export function drawPlate(c: Ctx, S: number, site: 'birkenhead' | 'ellesmere') {
  const k = S / 1000, cx = S / 2, cy = S / 2;
  const rand = rng(site === 'birkenhead' ? 7 : 11);
  const ink = site === 'birkenhead' ? '#c8352a' : '#e9e6df';
  const town = site === 'birkenhead' ? 'BIRKENHEAD' : 'ELLESMERE PORT';

  // rubber body
  c.fillStyle = radial(c, cx, cy, 0, 480 * k, [[0, '#2a2c30'], [.55, '#1d1f22'], [.9, '#161719'], [1, '#0f1011']], cx - 120 * k, cy - 150 * k);
  circle(c, cx, cy, 478 * k); c.fill();
  // speckled rubber texture
  for (let i = 0; i < 2600; i++) {
    const a = rand() * TAU, d = 150 * k + Math.sqrt(rand()) * 325 * k;
    c.fillStyle = rand() < .5 ? 'rgba(255,255,255,.045)' : 'rgba(0,0,0,.25)';
    c.fillRect(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.6 * k, 1.6 * k);
  }
  // raised outer lip
  c.lineWidth = 26 * k; c.strokeStyle = 'rgba(255,255,255,.05)'; circle(c, cx, cy, 462 * k); c.stroke();
  c.lineWidth = 2 * k; c.strokeStyle = 'rgba(255,255,255,.16)'; c.beginPath(); c.arc(cx, cy, 474 * k, Math.PI * 1.05, Math.PI * 1.8); c.stroke();
  c.strokeStyle = 'rgba(0,0,0,.6)'; c.beginPath(); c.arc(cx, cy, 449 * k, 0, TAU); c.stroke();

  // embossed rim lettering: twice around (top and bottom), with a light/dark relief
  const rimR = 412 * k, size = 46 * k, track = 6 * k;
  for (const mid of [-Math.PI / 2, Math.PI / 2]) {
    const label = `APEX  ·  ${town}`;
    arcText(c, label, cx + 1.5 * k, cy + 2 * k, rimR, mid, size, track, 'rgba(0,0,0,.7)');
    arcText(c, label, cx - 1 * k, cy - 1.2 * k, rimR, mid, size, track, 'rgba(255,255,255,.12)');
    arcText(c, label, cx, cy, rimR, mid, size, track, ink);
  }
  // flat face ring and a coloured band
  c.lineWidth = 2 * k; c.strokeStyle = 'rgba(0,0,0,.65)'; circle(c, cx, cy, 372 * k); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.07)'; circle(c, cx, cy, 369 * k); c.stroke();
  c.lineWidth = 10 * k; c.strokeStyle = ink; c.globalAlpha = .9; circle(c, cx, cy, 352 * k); c.stroke(); c.globalAlpha = 1;

  // weight marking (generic plate detail)
  c.save();
  c.font = `800 ${86 * k}px "Archivo Variable", "Archivo", "Arial Narrow", sans-serif`;
  c.textAlign = 'center'; c.textBaseline = 'middle';
  for (const [y, rot] of [[cy - 255 * k, 0], [cy + 255 * k, Math.PI]] as [number, number][]) {
    c.save(); c.translate(cx, y); c.rotate(rot);
    c.fillStyle = 'rgba(0,0,0,.6)'; c.fillText('20 KG', 2 * k, 3 * k);
    c.fillStyle = 'rgba(255,255,255,.85)'; c.fillText('20 KG', 0, 0);
    c.restore();
  }
  c.restore();

  // steel hub
  c.fillStyle = radial(c, cx, cy, 0, 170 * k, [[0, '#ffffff'], [.25, '#d6dadf'], [.55, '#9ea4ab'], [.8, '#c7ccd2'], [1, '#6d7278']], cx - 50 * k, cy - 60 * k);
  circle(c, cx, cy, 165 * k); c.fill();
  c.lineWidth = 3 * k; c.strokeStyle = 'rgba(0,0,0,.35)'; circle(c, cx, cy, 165 * k); c.stroke();
  // brushed rings
  for (let r = 70; r < 160; r += 6) { c.lineWidth = 1 * k; c.strokeStyle = `rgba(${r % 12 ? '255,255,255,.10' : '0,0,0,.08'})`; circle(c, cx, cy, r * k); c.stroke(); }
  // rivets
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + Math.PI / 8, x = cx + Math.cos(a) * 128 * k, y = cy + Math.sin(a) * 128 * k;
    c.fillStyle = radial(c, x, y, 0, 11 * k, [[0, '#f4f6f8'], [.6, '#9aa0a6'], [1, '#5b6066']], x - 3 * k, y - 4 * k);
    circle(c, x, y, 10 * k); c.fill();
  }
  // the bore (a real hole: transparent)
  c.save(); c.globalCompositeOperation = 'destination-out'; circle(c, cx, cy, 52 * k); c.fill(); c.restore();
  c.lineWidth = 5 * k; c.strokeStyle = 'rgba(40,44,48,.9)'; circle(c, cx, cy, 54 * k); c.stroke();
  c.lineWidth = 2 * k; c.strokeStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.arc(cx, cy, 58 * k, Math.PI * .1, Math.PI * .7); c.stroke();
}

export function renderPlate(canvas: HTMLCanvasElement) {
  const css = canvas.offsetWidth || 600;
  const S = Math.min(1400, Math.round(css * Math.min(2, window.devicePixelRatio || 1)));
  canvas.width = S; canvas.height = S;
  const c = canvas.getContext('2d')!;
  c.clearRect(0, 0, S, S);
  drawPlate(c, S, canvas.dataset.plate as 'birkenhead' | 'ellesmere');
}

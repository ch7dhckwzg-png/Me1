// Social 114. concept, v2: client behaviour.
// Motion rules: things animate once on load or arrival, or in answer to a click.
// Nothing follows the cursor and nothing is tied to scroll position.

type Mode = 'day' | 'night';
type Hours = {
  timezone: string;
  brunch: { from: string; to: string };
  pizzaFrom: string;
  nightStarts: string;
  week: { day: string; open?: string; close?: string; closed?: boolean }[];
};

const root = document.documentElement;
const hours: Hours = JSON.parse(document.getElementById('hours-data')!.textContent!);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const toMin = (t: string) => (t === 'late' ? 23 * 60 : +t.slice(0, 2) * 60 + +t.slice(3, 5));
const span = (m: number) => {
  const h = Math.floor(m / 60), mm = m % 60;
  return h ? `${h}h ${String(mm).padStart(2, '0')}m` : `${mm} minutes`;
};
function londonNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: hours.timezone, weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const hh = get('hour') === '24' ? '00' : get('hour');
  return { day: get('weekday'), hm: `${hh}:${get('minute')}`, mins: +hh * 60 + +get('minute') };
}

/* ---------- Day / Night, with the coffee cup to pizza transition ---------- */
const xf = document.querySelector<HTMLElement>('[data-xf]')!;
const xfTo = xf.querySelector<HTMLElement>('.xf-to')!;
const xfStage = xf.querySelector<HTMLElement>('.xf-stage')!;
const xfWord = xf.querySelector<HTMLElement>('[data-xf-word]')!;
const cupLines = [...xf.querySelectorAll<SVGPathElement>('.cup .ln')];
const pizzaLines = [...xf.querySelectorAll<SVGElement>('.pizza .ln')];
const tops = [...xf.querySelectorAll<SVGCircleElement>('.tops circle')];
let busy = false;

function paintSwitch() {
  document.querySelectorAll<HTMLButtonElement>('[data-set-mode]').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.setMode === root.dataset.mode)));
}
function applyMode(mode: Mode) {
  root.dataset.mode = mode;
  paintSwitch();
  selectTab(mode === 'night' ? 'pizza' : 'brunch');
}
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const draw = (els: Element[], from: number, to: number, dur: number, stagger: number, delay = 0, easing = 'cubic-bezier(.6,0,.2,1)') =>
  els.map((e, i) => e.animate([{ strokeDashoffset: from }, { strokeDashoffset: to }], { duration: dur, delay: delay + i * stagger, easing, fill: 'forwards' }));

async function runTransition(to: Mode) {
  busy = true;
  const from: Mode = to === 'night' ? 'day' : 'night';
  const css = getComputedStyle(root);
  const v = (n: string) => css.getPropertyValue(n).trim();
  xf.style.setProperty('--xf-from-bg', v(`--${from}-bg`));
  xf.style.setProperty('--xf-to-bg', v(`--${to}-bg`));
  xf.style.setProperty('--xf-from-fg', v(`--${from}-fg`));
  // toppings only show over the night colour; with the difference blend, night-bg + accent renders as the accent
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const nb = hex(v('--night-bg')), na = hex(v('--night-accent'));
  xf.style.setProperty('--xf-accent', '#' + nb.map((c, i) => Math.min(255, c + na[i]).toString(16).padStart(2, '0')).join(''));
  [...cupLines, ...pizzaLines].forEach((l) => { l.getAnimations().forEach((a) => a.cancel()); l.style.strokeDashoffset = '1'; });
  tops.forEach((t) => { t.getAnimations().forEach((a) => a.cancel()); t.style.opacity = '0'; });
  xfTo.style.clipPath = 'circle(0% at 50% 50%)';
  xfWord.textContent = from === 'day' ? 'By day' : 'By night';
  xf.hidden = false;

  const first = to === 'night' ? cupLines : pizzaLines;
  const second = to === 'night' ? pizzaLines : cupLines;

  xf.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, fill: 'forwards' });
  draw(first, 1, 0, 620, 70, 120);
  if (to === 'day') tops.forEach((t, i) => t.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 300, delay: 450 + i * 40, fill: 'forwards' }));
  await wait(1000);

  // the new mode spreads from the centre while the drawing changes over
  xfTo.animate([{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)' }], { duration: 1000, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' });
  draw(first, 0, -1, 460, 40, 0, 'cubic-bezier(.5,0,.75,0)');
  if (to === 'day') tops.forEach((t) => t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }));
  draw(second, 1, 0, 700, 90, 380);
  if (to === 'night') tops.forEach((t, i) => t.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 360, delay: 900 + i * 50, easing: 'cubic-bezier(.2,.9,.3,1.3)', fill: 'forwards' }));
  setTimeout(() => { xfWord.textContent = to === 'day' ? 'By day' : 'By night'; }, 520);
  await wait(1700);

  applyMode(to);
  const out = xf.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 520, easing: 'ease-out', fill: 'forwards' });
  await out.finished;
  xf.hidden = true;
  xf.getAnimations({ subtree: true }).forEach((a) => a.cancel());
  busy = false;
}
function setMode(mode: Mode) {
  if (busy || mode === root.dataset.mode) return;
  if (reduce) return applyMode(mode);
  runTransition(mode);
}
document.querySelectorAll<HTMLButtonElement>('[data-set-mode]').forEach((b) =>
  b.addEventListener('click', () => setMode(b.dataset.setMode as Mode)));
paintSwitch();

/* ---------- Today line + live status ---------- */
const OPEN = 8 * 60, CLOSE = 23 * 60;
const pct = (m: number) => ((Math.min(Math.max(m, OPEN), CLOSE) - OPEN) / (CLOSE - OPEN)) * 100;
function layoutLine() {
  const b = document.querySelector<HTMLElement>('[data-seg="brunch"]');
  const p = document.querySelector<HTMLElement>('[data-seg="pizza"]');
  if (b) { b.style.left = pct(toMin(hours.brunch.from)) + '%'; b.style.width = pct(toMin(hours.brunch.to)) - pct(toMin(hours.brunch.from)) + '%'; }
  if (p) { p.style.left = pct(toMin(hours.pizzaFrom)) + '%'; p.style.right = '0'; }
  const ticks = document.querySelector('[data-ticks]');
  if (ticks) ticks.innerHTML = ['08:00', '12:00', '16:00', '20:00', '23:00'].map((t) =>
    `<span style="left:${pct(toMin(t))}%">${t === '23:00' ? 'Late' : t}</span>`).join('');
}
function tick() {
  const now = londonNow();
  document.querySelectorAll('[data-clock]').forEach((c) => (c.textContent = now.hm));
  const nowEl = document.querySelector<HTMLElement>('[data-now]');
  if (nowEl) nowEl.style.left = pct(now.mins) + '%';

  const today = hours.week.find((d) => d.day === now.day);
  const bf = toMin(hours.brunch.from), bt = toMin(hours.brunch.to), pz = toMin(hours.pizzaFrom);
  const late = !!today && !today.closed && today.close === 'late';
  let s: string;
  if (!today || today.closed) s = `Closed on ${now.day}s. <b>Back tomorrow.</b>`;
  else {
    const open = toMin(today.open!), close = toMin(today.close!);
    if (now.mins < open) s = `Doors open at <b>${today.open}</b>.`;
    else if (now.mins < bf) s = `Coffee's on. <b>Brunch from ${hours.brunch.from}.</b>`;
    else if (now.mins < bt) s = `Open now. <b>Brunch until ${hours.brunch.to}.</b>`;
    else if (!late && now.mins < close) s = `Open for coffee and bakes <b>until ${today.close}.</b>`;
    else if (!late) s = `Closed for today. <b>Back tomorrow.</b>`;
    else if (now.mins < pz) s = `The oven lights in <b>${span(pz - now.mins)}.</b>`;
    else s = `The oven's lit. <b>Pizza until late.</b>`;
  }
  const st = document.querySelector('[data-status]');
  if (st) st.innerHTML = s;

  const oc = document.querySelector('[data-oven-count]');
  if (oc) oc.textContent = !late ? 'No pizza tonight. Thursday to Sunday only.'
    : now.mins < pz ? `Tonight, in ${span(pz - now.mins)}.` : 'Lit now, until late.';
  document.querySelectorAll('tr[data-day]').forEach((tr) =>
    tr.classList.toggle('today', (tr as HTMLElement).dataset.day === now.day));
}
layoutLine(); tick(); setInterval(tick, 20_000);

/* ---------- Menu tabs ---------- */
function selectTab(id: string, focus = false) {
  document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((t) => {
    const on = t.dataset.tab === id;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  });
  document.querySelectorAll<HTMLElement>('[data-panel]').forEach((p) => {
    const was = !p.hidden;
    p.hidden = p.dataset.panel !== id;
    if (!p.hidden && !was) p.querySelectorAll<HTMLElement>('li').forEach((li) => {
      li.style.animation = 'none'; void li.offsetWidth; li.style.animation = '';
    });
  });
  if (id === 'pizza') drawPizza(currentPizza);
}
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-tab]')];
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t.dataset.tab!));
  t.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (d) selectTab(tabs[(i + d + tabs.length) % tabs.length].dataset.tab!, true);
  });
});

/* ---------- Pizza, drawn in fine line from the real menu ---------- */
const SVGNS = 'http://www.w3.org/2000/svg';
let currentPizza = 'pepperoni';
const names: Record<string, string> = {};
document.querySelectorAll<HTMLButtonElement>('[data-pizza]').forEach((b) => (names[b.dataset.pizza!] = b.querySelector('.pz-name')!.textContent!));
function rng(seed: number) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }
function el(tag: string, attrs: Record<string, string | number>, parent: Element) {
  const n = document.createElementNS(SVGNS, tag);
  for (const k in attrs) {
    const val = String(attrs[k]);
    if (val.startsWith('var(')) n.style.setProperty(k, val); else n.setAttribute(k, val);
  }
  parent.appendChild(n);
  return n as SVGGraphicsElement;
}
function ring(r: number, wob: number, rand: () => number, n = 36) {
  const pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2, rr = r + (rand() - .5) * wob; return [Math.cos(a) * rr, Math.sin(a) * rr]; });
  let d = `M${((pts[0][0] + pts[1][0]) / 2).toFixed(1)},${((pts[0][1] + pts[1][1]) / 2).toFixed(1)}`;
  for (let i = 1; i <= n; i++) { const p = pts[i % n], q = pts[(i + 1) % n]; d += ` Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${((p[0] + q[0]) / 2).toFixed(1)},${((p[1] + q[1]) / 2).toFixed(1)}`; }
  return d + 'Z';
}
function scatter(n: number, maxR: number, gap: number, rand: () => number) {
  const out: [number, number][] = []; let g = 0;
  while (out.length < n && g++ < 5000) {
    const a = rand() * Math.PI * 2, r = 18 + Math.sqrt(rand()) * (maxR - 18);
    const p: [number, number] = [Math.cos(a) * r, Math.sin(a) * r];
    if (out.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > gap)) out.push(p);
  }
  return out;
}
function drawPizza(id: string) {
  const svg = document.getElementById('pizza');
  if (!svg) return;
  svg.innerHTML = '';
  const cap = document.querySelector('[data-pizza-caption]');
  if (cap) cap.textContent = names[id] || '';
  const rand = rng(id.length * 131 + 114);
  const g = el('g', { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.25, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
  const lines: SVGGraphicsElement[] = [];
  const bits: SVGGraphicsElement[] = [];
  const line = (tag: string, a: Record<string, string | number>) => { const n = el(tag, { ...a, pathLength: 1 }, g); lines.push(n); return n; };
  const bit = (n: SVGGraphicsElement) => { bits.push(n); return n; };
  const accent = 'var(--accent)';

  line('path', { d: ring(158, 7, rand) });
  line('path', { d: ring(134, 5, rand), 'stroke-opacity': .6 });
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI + Math.PI / 8;
    line('path', { d: `M${(Math.cos(a) * 134).toFixed(1)},${(Math.sin(a) * 134).toFixed(1)} L${(-Math.cos(a) * 134).toFixed(1)},${(-Math.sin(a) * 134).toFixed(1)}`, 'stroke-opacity': .28 });
  }
  const top = el('g', {}, g);
  if (id === 'pepperoni') {
    scatter(10, 110, 46, rand).forEach(([x, y]) => {
      const p = bit(el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, top));
      el('circle', { r: 17, stroke: accent }, p);
      el('circle', { r: 1.6, cx: -6, cy: -4, fill: accent, stroke: 'none' }, p);
      el('circle', { r: 1.3, cx: 5, cy: 6, fill: accent, stroke: 'none' }, p);
    });
    scatter(8, 112, 38, rand).forEach(([x, y]) => {
      const j = bit(el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, top));
      el('circle', { r: 8 }, j); el('circle', { r: 3.4, 'stroke-opacity': .6 }, j);
    });
    for (let k = 0; k < 2; k++) {
      let d = `M${-118 + rand() * 12},${-44 + k * 72}`;
      for (let x = -88; x <= 118; x += 34) d += ` Q${x - 17},${-70 + k * 72 + rand() * 46} ${x},${-44 + k * 72 + rand() * 18}`;
      line('path', { d, stroke: accent, 'stroke-width': 1.6, 'stroke-opacity': .9 });
    }
  } else if (id === 'sweetpotato') {
    scatter(18, 112, 30, rand).forEach(([x, y]) => {
      const s = 11 + rand() * 4;
      const w = bit(el('g', {}, top));
      el('rect', { x: x - s / 2, y: y - s / 2, width: s, height: s, rx: 2, stroke: accent, transform: `rotate(${(rand() * 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})` }, w);
    });
    scatter(13, 112, 30, rand).forEach(([x, y]) => {
      const c = bit(el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, top));
      el('path', { d: ring(7.5, 4, rand, 8) }, c);
      el('path', { d: 'M-3.5,-1 q3.5 3 7 0', 'stroke-opacity': .55 }, c);
    });
  } else {
    scatter(8, 104, 48, rand).forEach(([x, y]) => {
      const l = bit(el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(rand() * 360).toFixed(0)})` }, top));
      el('path', { d: 'M0,-19 C12,-9 12,9 0,19 C-12,9 -12,-9 0,-19Z' }, l);
      el('path', { d: 'M0,-15 V15 M0,-4 L5,-9 M0,4 L-5,-1 M0,8 L5,3', 'stroke-opacity': .5 }, l);
    });
    scatter(12, 112, 30, rand).forEach(([x, y]) => {
      const w = bit(el('g', {}, top));
      el('path', { d: `M${(x - 10).toFixed(1)},${y.toFixed(1)} q10 -9 20 0`, transform: `rotate(${(rand() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})`, 'stroke-opacity': .7 }, w);
    });
    scatter(20, 118, 18, rand).forEach(([x, y]) =>
      bit(el('circle', { cx: x, cy: y, r: 1.8 + rand() * 1.4, fill: accent, stroke: 'none', 'fill-opacity': .7 }, top)));
  }
  if (reduce) return;
  lines.forEach((l, i) => {
    l.style.strokeDasharray = '1';
    l.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: i < 2 ? 1100 : 800, delay: i < 2 ? i * 160 : 500 + i * 90, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'both' });
  });
  bits.forEach((b, i) => {
    b.style.transformBox = 'fill-box'; b.style.transformOrigin = 'center';
    b.animate([{ opacity: 0, scale: .6 }, { opacity: 1, scale: 1 }], { duration: 420, delay: 1100 + i * 35, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
  });
}
document.querySelectorAll<HTMLButtonElement>('[data-pizza]').forEach((b) =>
  b.addEventListener('click', () => {
    currentPizza = b.dataset.pizza!;
    document.querySelectorAll('[data-pizza]').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    drawPizza(currentPizza);
  }));

/* ---------- Arrive once ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((n) => io.observe(n));

/* ---------- Start ---------- */
selectTab(root.dataset.mode === 'night' ? 'pizza' : 'brunch');

// Social 114. concept: client behaviour.
// Motion rules: things animate once on load or arrival, or in answer to a click.
// Nothing follows the cursor and nothing is tied to scroll position.

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

function londonNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: hours.timezone, weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const hh = get('hour') === '24' ? '00' : get('hour');
  return { day: get('weekday'), hm: `${hh}:${get('minute')}`, mins: +hh * 60 + +get('minute') };
}
const span = (m: number) => {
  const h = Math.floor(m / 60), mm = m % 60;
  return h ? `${h}h ${String(mm).padStart(2, '0')}m` : `${mm} min`;
};
const pretty = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}${m ? ':' + String(m).padStart(2, '0') : ''}${h < 12 ? 'am' : 'pm'}`;
};

/* ---------- Day / Night ---------- */
const wipe = document.querySelector<HTMLElement>('.mode-wipe')!;
wipe.addEventListener('animationend', () => wipe.classList.remove('go'));
function paintSwitch() {
  document.querySelectorAll<HTMLButtonElement>('[data-set-mode]').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.setMode === root.dataset.mode)));
}
function setMode(mode: 'day' | 'night', animate = true) {
  if (mode === root.dataset.mode) return;
  const apply = () => {
    root.dataset.mode = mode;
    paintSwitch();
    selectTab(mode === 'night' ? 'pizza' : 'brunch', false);
    if (mode === 'night') lightOven(false);
  };
  if (!animate || reduce) return apply();
  wipe.classList.remove('go'); void wipe.offsetWidth; wipe.classList.add('go');
  setTimeout(apply, 400);
}
document.querySelectorAll<HTMLButtonElement>('[data-set-mode]').forEach((b) =>
  b.addEventListener('click', () => setMode(b.dataset.setMode as 'day' | 'night')));
paintSwitch();

/* ---------- Today timeline + live status ---------- */
const OPEN = 8 * 60, CLOSE = 23 * 60;
const pct = (m: number) => ((Math.min(Math.max(m, OPEN), CLOSE) - OPEN) / (CLOSE - OPEN)) * 100;
function layoutLine() {
  const b = document.querySelector<HTMLElement>('[data-seg="brunch"]');
  const p = document.querySelector<HTMLElement>('[data-seg="pizza"]');
  if (!b || !p) return;
  b.style.left = pct(toMin(hours.brunch.from)) + '%';
  b.style.width = pct(toMin(hours.brunch.to)) - pct(toMin(hours.brunch.from)) + '%';
  p.style.left = pct(toMin(hours.pizzaFrom)) + '%';
  p.style.right = '0';
  const ticks = document.querySelector('[data-ticks]')!;
  ticks.innerHTML = ['08:00', '12:00', '16:00', '20:00', '23:00'].map((t) =>
    `<span style="left:${pct(toMin(t))}%">${t === '23:00' ? 'late' : pretty(t)}</span>`).join('');
}
function tick() {
  const now = londonNow();
  const clock = document.querySelector('[data-clock]');
  if (clock) clock.textContent = now.hm;
  const nowEl = document.querySelector<HTMLElement>('[data-now]');
  if (nowEl) nowEl.style.left = `calc(${pct(now.mins)}% - 1px)`;

  const today = hours.week.find((d) => d.day === now.day);
  const bf = toMin(hours.brunch.from), bt = toMin(hours.brunch.to), pz = toMin(hours.pizzaFrom);
  let s: string;
  if (!today || today.closed) s = `Closed on ${now.day}s. <b>See you tomorrow.</b>`;
  else {
    const open = toMin(today.open!), close = toMin(today.close!);
    const lateNight = today.close === 'late';
    if (now.mins < open) s = `Doors open at <b>${pretty(today.open!)}</b>.`;
    else if (now.mins < bf) s = `Coffee's on. <b>Brunch from ${pretty(hours.brunch.from)}</b>.`;
    else if (now.mins < bt) s = `Open now. <b>Brunch until ${pretty(hours.brunch.to)}</b>.`;
    else if (!lateNight && now.mins < close) s = `Open now for coffee and bakes, <b>until ${pretty(today.close!)}</b>.`;
    else if (!lateNight) s = `Closed for today. <b>Back tomorrow.</b>`;
    else if (now.mins < pz) s = `The oven lights in <b>${span(pz - now.mins)}</b>.`;
    else s = `The oven's lit. <b>Pizza until late.</b>`;
  }
  const st = document.querySelector('[data-status]');
  if (st) st.innerHTML = s;

  const oc = document.querySelector('[data-oven-count]');
  if (oc) {
    const lateToday = today && !today.closed && today.close === 'late';
    oc.textContent = !lateToday ? `No pizza tonight. The oven's on Thursday to Sunday.`
      : now.mins < pz ? `Today the oven lights in ${span(pz - now.mins)}.` : `Right now: the oven's lit.`;
  }
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

/* ---------- Pizza, drawn live from the menu ---------- */
const SVGNS = 'http://www.w3.org/2000/svg';
let currentPizza = 'pepperoni';
let drawToken = 0;
function rng(seed: number) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }
function el(tag: string, attrs: Record<string, string | number>, parent: Element) {
  const n = document.createElementNS(SVGNS, tag);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  parent.appendChild(n);
  return n as SVGElement;
}
function blob(r: number, wobble: number, rand: () => number, points = 28) {
  const pts = Array.from({ length: points }, (_, i) => {
    const a = (i / points) * Math.PI * 2, rr = r + (rand() - 0.5) * wobble;
    return [Math.cos(a) * rr, Math.sin(a) * rr];
  });
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < points; i++) {
    const p1 = pts[(i + 1) % points], p2 = pts[(i + 2) % points];
    const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
    d += ` Q${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  return d + 'Z';
}
function scatter(n: number, maxR: number, minGap: number, rand: () => number) {
  const out: [number, number][] = [];
  let guard = 0;
  while (out.length < n && guard++ < 4000) {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * maxR;
    const p: [number, number] = [Math.cos(a) * r, Math.sin(a) * r];
    if (out.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > minGap)) out.push(p);
  }
  return out;
}
function layer(svg: Element, delay: number) {
  const g = el('g', { class: 'pz-layer' }, svg);
  (g as SVGGElement).style.cssText = reduce ? '' : `opacity:0;transform:scale(.6);transform-origin:0 0;transform-box:view-box;transition:opacity .45s ease ${delay}ms, transform .6s cubic-bezier(.2,.9,.25,1.25) ${delay}ms`;
  return g;
}
function drawPizza(id: string) {
  const svg = document.getElementById('pizza');
  if (!svg) return;
  const token = ++drawToken;
  svg.innerHTML = '';
  const rand = rng(id.length * 977 + 114);
  const R = 132;
  // dough and crust with leopard char
  const crust = layer(svg, 0);
  el('path', { d: blob(R, 9, rand), fill: '#e9c98f' }, crust);
  el('path', { d: blob(R - 6, 7, rand), fill: '#f1d7a4' }, crust);
  scatter(26, R - 4, 10, rand).filter(([x, y]) => Math.hypot(x, y) > R - 22).forEach(([x, y]) =>
    el('ellipse', { cx: x, cy: y, rx: 2 + rand() * 4, ry: 1.5 + rand() * 3, fill: '#5a3a1f', opacity: 0.55 + rand() * 0.35 }, crust));
  // base
  const base = layer(svg, 260);
  const red = id === 'pepperoni';
  el('path', { d: blob(R - 24, 8, rand), fill: red ? '#c8361f' : '#f6ecd6' }, base);
  if (red) el('path', { d: blob(R - 34, 10, rand), fill: '#d9452a', opacity: 0.7 }, base);
  // cheese
  const cheese = layer(svg, 520);
  scatter(id === 'sage' ? 12 : 16, R - 46, 30, rand).forEach(([x, y]) =>
    el('path', { d: blob(10 + rand() * 9, 6, rand, 12), transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`, fill: '#fbf3df', opacity: 0.95 }, cheese));

  const top = layer(svg, 820);
  if (id === 'pepperoni') {
    scatter(11, R - 50, 40, rand).forEach(([x, y]) => {
      el('circle', { cx: x, cy: y, r: 16, fill: '#a32a1c' }, top);
      el('circle', { cx: x - 2, cy: y - 2, r: 13, fill: '#bd3423' }, top);
      for (let k = 0; k < 4; k++) el('circle', { cx: x + (rand() - .5) * 18, cy: y + (rand() - .5) * 18, r: 1.4, fill: '#ffd9b0', opacity: .7 }, top);
    });
    const jal = layer(svg, 1100);
    scatter(9, R - 44, 34, rand).forEach(([x, y]) => {
      el('circle', { cx: x, cy: y, r: 8.5, fill: 'none', stroke: '#4f8a2e', 'stroke-width': 4.5 }, jal);
      el('circle', { cx: x, cy: y, r: 3.8, fill: '#e6eccf' }, jal);
      el('circle', { cx: x + 1, cy: y, r: 1.1, fill: '#f6f1d0' }, jal);
    });
    drizzle(svg, rand, 1450, '#f0a92e', 4.5);
  } else if (id === 'sweetpotato') {
    scatter(22, R - 44, 22, rand).forEach(([x, y]) => {
      const s = 9 + rand() * 4;
      el('rect', { x: x - s / 2, y: y - s / 2, width: s, height: s, rx: 2.5, fill: '#e8892e', transform: `rotate(${(rand() * 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})` }, top);
    });
    const blue = layer(svg, 1100);
    scatter(16, R - 44, 24, rand).forEach(([x, y]) => {
      el('path', { d: blob(6 + rand() * 3, 4, rand, 9), transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`, fill: '#f3efe2' }, blue);
      el('path', { d: `M${(x - 3).toFixed(1)},${(y - 1).toFixed(1)} q3 2 6 -1`, stroke: '#5f7aa0', 'stroke-width': 1.2, fill: 'none' }, blue);
    });
  } else {
    scatter(9, R - 50, 40, rand).forEach(([x, y]) => {
      const rot = (rand() * 360).toFixed(0);
      const leaf = el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})` }, top);
      el('path', { d: 'M0,-16 C10,-8 10,8 0,16 C-10,8 -10,-8 0,-16Z', fill: '#6f8f5a' }, leaf);
      el('path', { d: 'M0,-14 L0,14', stroke: '#a9c08e', 'stroke-width': 1 }, leaf);
    });
    const parm = layer(svg, 1100);
    scatter(14, R - 44, 26, rand).forEach(([x, y]) =>
      el('path', { d: `M${(x - 8).toFixed(1)},${y.toFixed(1)} q8 -7 16 0 q-8 3 -16 0Z`, fill: '#fff8e2', stroke: '#e8d9a8', 'stroke-width': .8, transform: `rotate(${(rand() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})` }, parm));
    const oil = layer(svg, 1350);
    scatter(18, R - 40, 18, rand).forEach(([x, y]) =>
      el('ellipse', { cx: x, cy: y, rx: 3 + rand() * 4, ry: 2 + rand() * 2, fill: '#d6b54a', opacity: .45 }, oil));
  }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (token !== drawToken) return;
    svg.querySelectorAll<SVGGElement>('.pz-layer').forEach((g) => { g.style.opacity = '1'; g.style.transform = 'scale(1)'; });
    svg.querySelectorAll<SVGPathElement>('.drizzle').forEach((p) => { p.style.strokeDashoffset = '0'; });
  }));
}
function drizzle(svg: Element, rand: () => number, delay: number, color: string, w: number) {
  const g = el('g', {}, svg);
  for (let k = 0; k < 3; k++) {
    let d = `M${-95 + rand() * 20},${-60 + k * 50 + rand() * 10}`;
    for (let x = -70; x <= 100; x += 30) d += ` Q${x - 15},${-80 + k * 50 + rand() * 40} ${x},${-60 + k * 50 + rand() * 20}`;
    const p = el('path', { d, class: 'drizzle', fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', opacity: .85 }, g) as SVGPathElement;
    const len = 600;
    p.style.strokeDasharray = String(len);
    p.style.strokeDashoffset = reduce ? '0' : String(len);
    p.style.transition = `stroke-dashoffset 1.1s ease ${delay + k * 180}ms`;
  }
}
document.querySelectorAll<HTMLButtonElement>('[data-pizza]').forEach((b) =>
  b.addEventListener('click', () => {
    currentPizza = b.dataset.pizza!;
    document.querySelectorAll('[data-pizza]').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    drawPizza(currentPizza);
  }));

/* ---------- Oven ---------- */
const ovenStage = document.querySelector<HTMLElement>('[data-oven]');
const ovenBtn = document.querySelector<HTMLButtonElement>('[data-light-oven]');
function lightOven(fromClick: boolean) {
  if (!ovenStage) return;
  ovenStage.classList.add('lit');
  ovenStage.classList.remove('flicker'); void ovenStage.offsetWidth; ovenStage.classList.add('flicker');
  if (ovenBtn) ovenBtn.querySelector('span')!.textContent = ovenBtn.dataset.labelLit!;
  if (fromClick && ovenBtn) ovenBtn.setAttribute('aria-pressed', 'true');
}
ovenBtn?.addEventListener('click', () => lightOven(true));

/* ---------- Record ---------- */
const play = document.querySelector<HTMLButtonElement>('[data-play]');
play?.addEventListener('click', () => {
  const on = play.getAttribute('aria-pressed') !== 'true';
  play.setAttribute('aria-pressed', String(on));
  play.setAttribute('aria-label', on ? play.dataset.labelPause! : play.dataset.labelPlay!);
  document.querySelector('[data-record]')!.classList.toggle('spin', on);
  play.closest('.deck')!.classList.toggle('playing', on);
});

/* ---------- Arrive once ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.matches('[data-oven]') && root.dataset.mode === 'night') lightOven(false);
    io.unobserve(e.target);
  });
}, { threshold: 0.18 });
document.querySelectorAll('.reveal').forEach((n) => io.observe(n));

/* ---------- Start ---------- */
selectTab(root.dataset.mode === 'night' ? 'pizza' : 'brunch');

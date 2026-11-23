// The Salon Sanctuary concept: client behaviour.
// Motion rules: things animate once on arrival or in answer to a tap.
// Nothing is tied to scroll position.

type Day = { day: string; open?: string; close?: string; closed?: boolean };
type Item = { id: string; name: string; price: number; from: boolean; mins?: number | null; book: string; note?: string };
type Cat = { key: string; label: string; blurb: string; note: string | null; items: Item[] };

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hours: { timezone: string; week: Day[] } = JSON.parse(document.getElementById('hours-data')!.textContent!);
const menu: Cat[] = JSON.parse(document.getElementById('menu-data')!.textContent!);
const booking: { base: string; handoff: string; consultId: string } = JSON.parse(document.getElementById('booking-data')!.textContent!);
const params = new URLSearchParams(location.search);

const money = (n: number) => (Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`);
const dur = (m?: number | null) => (!m ? '' : m < 60 ? `${m} min` : `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ''}`);
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const arrow = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
const dotIcon = '<svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="9" cy="9" r="2" fill="currentColor"/></svg>';

/* ---------- Opening hours and live status ---------- */
const toMin = (t: string) => +t.slice(0, 2) * 60 + +t.slice(3, 5);
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function nowLondon() {
  // ?now=Wednesday-14:30 holds a time (for screen recordings)
  const q = params.get('now');
  if (q && /^[A-Za-z]+-\d\d:\d\d$/.test(q)) { const [day, hm] = q.split('-'); return { day, mins: toMin(hm) }; }
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: hours.timezone, weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const g = (t: string) => parts.find((p) => p.type === t)!.value;
  const hh = g('hour') === '24' ? '00' : g('hour');
  return { day: g('weekday'), mins: +hh * 60 + +g('minute') };
}
function status() {
  const n = nowLondon();
  const today = hours.week.find((d) => d.day === n.day)!;
  if (!today.closed && n.mins >= toMin(today.open!) && n.mins < toMin(today.close!)) {
    return { open: true, long: `Open now, until ${today.close}`, short: `Open until ${today.close}` };
  }
  const start = DAYS.indexOf(n.day);
  for (let k = 0; k < 8; k++) {
    const name = DAYS[(start + k) % 7];
    const d = hours.week.find((x) => x.day === name)!;
    if (d.closed) continue;
    if (k === 0 && n.mins >= toMin(d.open!)) continue;
    const when = k === 0 ? 'today' : k === 1 ? 'tomorrow' : name;
    return { open: false, long: `Closed now. Opens ${when} at ${d.open}. You can still book online.`, short: `Opens ${when} ${d.open}` };
  }
  return { open: false, long: 'Closed now', short: 'Closed' };
}
function paintStatus() {
  const s = status();
  root.dataset.open = String(s.open);
  document.querySelectorAll<HTMLElement>('[data-status]').forEach((el) => { el.innerHTML = `<span class="dot${s.open ? ' open' : ''}"></span>${esc(s.long)}`; });
  document.querySelectorAll<HTMLElement>('[data-status-short]').forEach((el) => { el.textContent = s.short; });
  const n = nowLondon();
  document.querySelectorAll<HTMLElement>('tr[data-day]').forEach((tr) => tr.classList.toggle('today', tr.dataset.day === n.day));
}
paintStatus();
setInterval(paintStatus, 30_000);

/* ---------- Arrive once ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal, .reveal-wall, .reveal-draw, [data-count]').forEach((el) => io.observe(el));

/* ---------- Find your colour ---------- */
// The swatch ring fans open once when it arrives. Picking "now" and "would
// like" draws those two locks out of the ring and suggests a starting
// service from the real menu. Everything here answers a tap.
const sws = [...document.querySelectorAll<SVGGElement>('[data-sw]')];
const easeInOut = (t: number) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const finder = document.getElementById('finder-data') ? JSON.parse(document.getElementById('finder-data')!.textContent!) : null;
let fanOpen = reduce ? 1 : 0;
const push = sws.map(() => 0), pushTo = sws.map(() => 0);
let pickNow = -1, pickGoal = -1;
const angleOf = (i: number, e: number) => { const mid = (sws.length - 1) / 2; return (mid - i) * 1.1 + ((mid - i) * 14.5 - (mid - i) * 1.1) * e; };
function placeFan() {
  const e = easeInOut(fanOpen), mid = (sws.length - 1) / 2;
  sws.forEach((g, i) => {
    const lift = Math.sin(Math.PI * e) * (i - mid) * .6 + push[i];
    g.setAttribute('transform', `rotate(${angleOf(i, e).toFixed(3)}) translate(0 ${lift.toFixed(2)})`);
    g.classList.toggle('picked', i === pickNow || i === pickGoal);
  });
  const tag = (el: HTMLElement | null, i: number) => {
    if (!el) return;
    if (i < 0) { el.classList.remove('on'); return; }
    const a = angleOf(i, e) * Math.PI / 180, r = 486 + push[i];
    const x = -Math.sin(a) * r, y = Math.cos(a) * r;
    el.style.left = `${Math.min(93, Math.max(7, ((x + 420) / 840) * 100))}%`;
    el.style.top = `${((y + 50) / 520) * 100}%`;
    el.classList.add('on');
  };
  tag(document.querySelector('[data-tag-now]'), pickNow);
  tag(document.querySelector('[data-tag-goal]'), pickGoal);
}
let animating = false;
function animatePush() {
  if (animating) return; animating = true;
  const step = () => {
    let moving = false;
    push.forEach((v, i) => { const d = pushTo[i] - v; if (Math.abs(d) > .3) { push[i] = reduce ? pushTo[i] : v + d * .16; moving = true; } else push[i] = pushTo[i]; });
    placeFan();
    if (moving) requestAnimationFrame(step); else animating = false;
  };
  requestAnimationFrame(step);
}
const fanEl = document.querySelector('[data-fan]');
if (fanEl) {
  placeFan();
  if (!reduce) {
    const fio = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      fio.disconnect();
      const t0 = performance.now();
      const step = (t: number) => { fanOpen = Math.min(1, (t - t0) / 1800); placeFan(); if (fanOpen < 1) requestAnimationFrame(step); };
      setTimeout(() => requestAnimationFrame(step), 200);
    }, { threshold: .4 });
    fio.observe(fanEl);
  }
}
function finderResult() {
  if (!finder) return;
  const box = document.querySelector<HTMLElement>('[data-result]')!;
  if (pickNow < 0 || pickGoal < 0) return;
  const ROSE = 8, COPPER = 2;
  // light level of each shade, darkest 0 to lightest 7 (rose sits on light hair)
  const level = [0, 1, 2, 2, 3, 4, 6, 7, 5];
  let key: string;
  if (pickGoal === ROSE) key = 'rose';
  else if (pickGoal === pickNow) key = 'same';
  else if (pickGoal === COPPER) key = 'copper';
  else {
    const diff = level[pickGoal] - level[pickNow];
    key = diff <= 0 ? 'darker' : diff <= 2 ? 'lighter' : 'blonde';
  }
  const r = finder.results[key];
  const rows = r.ids.filter((id: string) => byId.has(id)).map((id: string) => {
    const it = byId.get(id)!.item;
    return `<button type="button" class="res-row" data-book-id="${id}"><span>${esc(it.name)}</span><span class="data">${it.from ? 'from ' : ''}${money(it.price)}</span>${arrow}<small>${esc([dur(it.mins), it.note].filter(Boolean).join('. '))}</small></button>`;
  }).join('');
  const c = byId.get(booking.consultId)!.item;
  box.innerHTML = `<div class="res"><p class="res-title">${esc(r.title)}</p><p class="res-body">${esc(r.body)}</p>${rows}<button type="button" class="res-row" data-book-id="${c.id}"><span>Start with a ${esc(c.name.toLowerCase())}</span><span class="data">${money(c.price)}</span>${arrow}<small>${dur(c.mins)}. Not on Saturdays.</small></button></div>`;
}
document.querySelectorAll<HTMLButtonElement>('[data-pick]').forEach((b) => b.addEventListener('click', () => {
  const k = b.dataset.pick!, i = +b.dataset.shade!;
  document.querySelectorAll<HTMLButtonElement>(`[data-pick="${k}"]`).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  if (k === 'now') pickNow = i; else pickGoal = i;
  pushTo.fill(0);
  if (pickNow >= 0) pushTo[pickNow] = 28;
  if (pickGoal >= 0) pushTo[pickGoal] = pickGoal === pickNow ? 28 : 46;
  if (fanOpen < 1) fanOpen = 1;
  animatePush();
  finderResult();
  const sum = document.querySelector('[data-pick-sum]');
  if (sum && finder) sum.textContent = [pickNow >= 0 ? `Now: ${finder.shades[pickNow]}` : '', pickGoal >= 0 ? `Would like: ${finder.shades[pickGoal]}` : ''].filter(Boolean).join('. ');
}));

/* ---------- Herringbone wall, laid tile by tile on arrival ---------- */
const wallCv = document.querySelector<HTMLCanvasElement>('[data-wall]');
if (wallCv) {
  const W = 600, H = 640, u = 22, R = Math.PI / 4, ox = W * .15, oy = H * .1;
  const tiles: { x: number; y: number; w: number; h: number; d: number; c: string }[] = [];
  for (let k = -16; k < 16; k++) for (let n = -34; n < 34; n++) {
    for (const [x, y, w, h] of [[n - 3 * k, n + 3 * k, 3, 1], [n - 3 * k, n + 1 + 3 * k, 1, 3]]) {
      const X = (x + w / 2) * u, Y = (y + h / 2) * u;
      const rx = X * Math.cos(R) - Y * Math.sin(R) + ox, ry = X * Math.sin(R) + Y * Math.cos(R) + oy;
      if (rx < -40 || rx > W + 40 || ry < -40 || ry > H + 40) continue;
      const c = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      tiles.push({ x, y, w, h, d: Math.max(0, Math.min(1, (rx / W) * .45 + (1 - ry / H) * .55)), c: c < .33 ? '#d6b2ab' : c < .66 ? '#cda69f' : '#c49b94' });
    }
  }
  const ctx = wallCv.getContext('2d')!;
  let tWall = reduce ? 99 : 0;
  const paint = () => {
    const r = wallCv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    if (wallCv.width !== Math.round(r.width * dpr)) { wallCv.width = Math.round(r.width * dpr); wallCv.height = Math.round(r.height * dpr); }
    const s = Math.max(r.width / W, r.height / H) * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#efe1df'; ctx.fillRect(0, 0, wallCv.width, wallCv.height);
    ctx.setTransform(s, 0, 0, s, (wallCv.width - W * s) / 2, (wallCv.height - H * s) / 2);
    ctx.translate(ox, oy); ctx.rotate(R);
    for (const t of tiles) {
      const a = Math.min(1, Math.max(0, (tWall - t.d * .8) / .3));
      if (a <= 0) continue;
      ctx.globalAlpha = a; ctx.fillStyle = t.c;
      ctx.fillRect(t.x * u + 1, t.y * u + 1 + (1 - a) * 6, t.w * u - 2, t.h * u - 2);
    }
    ctx.globalAlpha = 1;
  };
  paint();
  addEventListener('resize', paint);
  if (!reduce) {
    const wio = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; wio.disconnect();
      wallCv.parentElement!.classList.add('laid');
      const t0 = performance.now();
      const step = (t: number) => { tWall = (t - t0) / 1000; paint(); if (tWall < 1.2) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: 0, rootMargin: '0px 0px 30% 0px' });
    wio.observe(wallCv);
  }
}

/* ---------- 48 counts up once on arrival ---------- */
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const to = +el.dataset.count!;
  if (reduce) return;
  el.textContent = '0';
  const cio = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return; cio.disconnect();
    const t0 = performance.now();
    const step = (t: number) => { const p = Math.min(1, (t - t0) / 1400); el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, { threshold: .5 });
  cio.observe(el);
});

/* ---------- Header name appears once the mirror is out of view ---------- */
const mirrorEl = document.querySelector('[data-mirror]');
if (mirrorEl) {
  new IntersectionObserver(([e]) => root.classList.toggle('name-in-view', e.isIntersecting), { threshold: .25 }).observe(mirrorEl);
}

/* ---------- Price tabs ---------- */
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-tab]')];
function selectTab(key: string, focus = false) {
  tabs.forEach((t) => {
    const on = t.dataset.tab === key;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    if (on) { if (focus) t.focus(); t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }
  });
  document.querySelectorAll<HTMLElement>('[data-panel]').forEach((p) => {
    const was = p.hidden;
    p.hidden = p.dataset.panel !== key;
    if (!p.hidden && was && !reduce) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
  });
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t.dataset.tab!));
  t.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    selectTab(tabs[(i + d + tabs.length) % tabs.length].dataset.tab!, true);
  });
});

/* ---------- Booking panel ---------- */
// Three steps on the site (category, service, check), then Fresha opens with
// that exact service already in the basket for the time, confirmation and payment.
const sheet = document.querySelector<HTMLDialogElement>('[data-sheet]')!;
const body = sheet.querySelector<HTMLElement>('[data-sheet-body]')!;
const foot = sheet.querySelector<HTMLElement>('[data-sheet-foot]')!;
const back = sheet.querySelector<HTMLButtonElement>('[data-sheet-back]')!;
const go = sheet.querySelector<HTMLAnchorElement>('[data-go]')!;
const steps = [...sheet.querySelectorAll<HTMLElement>('[data-step]')];
const byId = new Map<string, { item: Item; cat: Cat }>();
menu.forEach((c) => c.items.forEach((item) => byId.set(item.id, { item, cat: c })));
let history: (() => void)[] = [];

function setStep(n: number) { steps.forEach((s) => s.classList.toggle('on', +s.dataset.step! <= n)); }
function show(html: string, step: number, _render: () => void) {
  body.innerHTML = html;
  body.scrollTop = 0;
  setStep(step);
  back.hidden = history.length === 0;
  foot.hidden = step < 2;
}

function viewCats() {
  const html = `<p class="v-lead">What would you like to book?</p>` + menu.map((c) => {
    const low = Math.min(...c.items.map((i) => i.price));
    return `<button type="button" class="opt" data-cat="${c.key}"><span class="opt-name">${esc(c.label)}</span><span class="opt-price data"><small>from </small>${money(low)}</span>${arrow}<span class="opt-sub">${esc(c.blurb)}</span></button>`;
  }).join('');
  show(html, 1, viewCats);
  body.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach((b) => b.addEventListener('click', () => { history.push(viewCats); viewItems(b.dataset.cat!); }));
}
function viewItems(key: string) {
  const c = menu.find((m) => m.key === key)!;
  const html = `<h2 class="cat-title">${esc(c.label)}</h2>${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}` + c.items.map((i) =>
    `<button type="button" class="opt" data-id="${i.id}"><span class="opt-name">${esc(i.name)}</span><span class="opt-price data">${i.from ? '<small>from </small>' : ''}${money(i.price)}</span>${arrow}<span class="opt-sub">${[dur(i.mins), i.note].filter(Boolean).map((s) => esc(s!)).join('. ')}</span></button>`).join('');
  show(html, 1, () => viewItems(key));
  body.querySelectorAll<HTMLButtonElement>('[data-id]').forEach((b) => b.addEventListener('click', () => { history.push(() => viewItems(key)); viewPick(b.dataset.id!); }));
}
function viewPick(id: string) {
  const { item, cat } = byId.get(id)!;
  const notes: string[] = [];
  if (cat.note) notes.push(cat.note);
  if (item.note) notes.push(item.note);
  notes.push('Fresha confirms your booking straight away. You can pay by card, Apple Pay or Google Pay, or cash in the salon.');
  let swap = '';
  const swapTo = cat.key === 'colour' ? booking.consultId : cat.key === 'ext' ? 's:19928300' : '';
  if (swapTo && byId.has(swapTo)) {
    const s = byId.get(swapTo)!.item;
    swap = `<button type="button" class="btn swap" data-swap="${s.id}"><span>Book the ${esc(s.name.toLowerCase())} first<small>${money(s.price)}, ${dur(s.mins)}, not on Saturdays</small></span>${arrow}</button>`;
  }
  const html = `<div class="ticket"><div class="t-top"><span class="t-mono">TSS</span><span class="t-label">Your appointment</span></div>
    <p class="pick-cat">${esc(cat.label)}</p><h2 class="pick-name">${esc(item.name)}</h2>
    <div class="t-cut" aria-hidden="true"></div>
    <dl class="t-rows"><div><dt>Price</dt><dd class="data">${item.from ? 'from ' : ''}${money(item.price)}</dd></div>${item.mins ? `<div><dt>Time</dt><dd class="data">${dur(item.mins)}</dd></div>` : ''}<div><dt>Where</dt><dd>61 Burlington Street</dd></div></dl></div>
    <div class="before"><h3>Before you book</h3><ul>${notes.map((n) => `<li>${dotIcon}<span>${esc(n)}</span></li>`).join('')}</ul></div>${swap}`;
  show(html, 2, () => viewPick(id));
  go.href = item.book;
  go.setAttribute('aria-label', `Choose a time for ${item.name} on Fresha (opens in a new tab)`);
  body.querySelector<HTMLButtonElement>('[data-swap]')?.addEventListener('click', (e) => { history.push(() => viewPick(id)); viewPick((e.currentTarget as HTMLElement).dataset.swap!); });
}
back.addEventListener('click', () => { const prev = history.pop(); if (prev) prev(); back.hidden = history.length === 0; });

let lastFocus: HTMLElement | null = null;
function openSheet(start: () => void) {
  history = [];
  start();
  lastFocus = document.activeElement as HTMLElement;
  if (!sheet.open) sheet.showModal();
  root.classList.add('sheet-open');
  body.focus();
}
sheet.addEventListener('close', () => { root.classList.remove('sheet-open'); lastFocus?.focus(); });
sheet.querySelector('[data-sheet-close]')!.addEventListener('click', () => sheet.close());
sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.close(); });
go.addEventListener('click', () => setStep(3));

document.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>('[data-book],[data-book-cat],[data-book-id]');
  if (!t || sheet.contains(t)) return;
  if (t.dataset.bookId && byId.has(t.dataset.bookId)) {
    const { cat } = byId.get(t.dataset.bookId)!;
    openSheet(() => { history = [viewCats, () => viewItems(cat.key)]; viewPick(t.dataset.bookId!); });
  } else if (t.dataset.bookCat) {
    openSheet(() => { history = [viewCats]; viewItems(t.dataset.bookCat!); });
  } else openSheet(viewCats);
});

// ?book=colour or ?book=s:20394736 opens the panel (for an Instagram bio link)
const q = params.get('book');
if (q) {
  if (byId.has(q)) { const { cat } = byId.get(q)!; openSheet(() => { history = [viewCats, () => viewItems(cat.key)]; viewPick(q); }); }
  else if (menu.some((m) => m.key === q)) openSheet(() => { history = [viewCats]; viewItems(q); });
  else openSheet(viewCats);
}

/* ---------- Phone: hide the book bar while the header button is enough ---------- */
const mbar = document.querySelector<HTMLElement>('[data-mbar]');
const heroCtas = document.querySelector('.mh-ctas');
if (mbar && heroCtas) {
  new IntersectionObserver(([e]) => root.classList.toggle('mbar-away', e.isIntersecting)).observe(heroCtas);
}

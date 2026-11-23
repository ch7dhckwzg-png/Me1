// The Salon Sanctuary concept: client behaviour.
// Motion rules: things animate once on arrival or in answer to a tap.
// The only thing tied to scroll is the hero's swatch ring (series exception).

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
  document.querySelectorAll<HTMLElement>('[data-status]').forEach((el) => { el.innerHTML = `<span class="dot${s.open ? ' open' : ''}"></span>${esc(s.long)}`; });
  document.querySelectorAll<HTMLElement>('[data-status-short]').forEach((el) => { el.textContent = s.short; });
  const n = nowLondon();
  document.querySelectorAll<HTMLElement>('tr[data-day]').forEach((tr) => tr.classList.toggle('today', tr.dataset.day === n.day));
}
paintStatus();
setInterval(paintStatus, 30_000);

/* ---------- Arrive once ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* ---------- Signature move: the swatch ring opens ---------- */
// While the hero is held, scrolling fans the colour swatches open from the
// darkest root shade to the salon's rose gloss. Only the ring follows scroll.
const track = document.querySelector<HTMLElement>('[data-hero-track]');
const sws = [...document.querySelectorAll<SVGGElement>('[data-sw]')];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
let arrive = reduce ? 1 : 0;
function heroProgress() {
  if (!track) return 1;
  const hdr = 72;
  const top = track.getBoundingClientRect().top + scrollY - hdr;
  const len = Math.max(1, track.offsetHeight - (innerHeight - hdr));
  return clamp01((scrollY - top) / (len * .8));
}
function placeFan() {
  // a little opening on arrival, the rest with scroll
  const p = reduce ? 1 : Math.max(heroProgress(), .14 * arrive);
  const e = easeInOut(p);
  const n = sws.length, mid = (n - 1) / 2;
  sws.forEach((g, i) => {
    const closed = (mid - i) * 1.1;
    const open = (mid - i) * 14.5;
    const a = closed + (open - closed) * e;
    const lift = Math.sin(Math.PI * e) * (i - mid) * .6;
    g.setAttribute('transform', `rotate(${a.toFixed(3)}) translate(0 ${lift.toFixed(2)})`);
  });
}
let ticking = false;
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; placeFan(); }); } };
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
if (!reduce) {
  const t0 = performance.now();
  const step = (t: number) => { arrive = Math.min(1, (t - t0) / 1400); arrive = 1 - Math.pow(1 - arrive, 3); placeFan(); if (arrive < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
placeFan();

/* ---------- Price tabs ---------- */
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-tab]')];
function selectTab(key: string, focus = false) {
  tabs.forEach((t) => {
    const on = t.dataset.tab === key;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    if (on) { if (focus) t.focus(); t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }
  });
  document.querySelectorAll<HTMLElement>('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== key; });
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
  const html = `<div class="pick"><p class="pick-cat">${esc(cat.label)}</p><h2 class="pick-name">${esc(item.name)}</h2>
    <p class="pick-meta"><span>Price <b class="data">${item.from ? 'from ' : ''}${money(item.price)}</b></span>${item.mins ? `<span>Time <b class="data">${dur(item.mins)}</b></span>` : ''}</p></div>
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
if (mbar && track) {
  const hero = new IntersectionObserver(([e]) => root.classList.toggle('mbar-away', e.intersectionRatio > .6), { threshold: [0, .6, 1] });
  hero.observe(document.querySelector('.hero-in')!);
}

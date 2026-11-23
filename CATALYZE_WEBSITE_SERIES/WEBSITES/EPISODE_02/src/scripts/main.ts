// Apex concept: client behaviour.
// Motion: once on load or arrival, or in answer to a click. The one exception (owner-approved for
// the series) is the hero plate, which rolls with the scroll; text changes once at the threshold.
import { renderPlate } from './plate';

type Site = 'birkenhead' | 'ellesmere';
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cur = () => root.dataset.site as Site;

/* ---------- Site switching ---------- */
function paint() {
  document.querySelectorAll<HTMLButtonElement>('[data-set-site]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setSite === cur())));
  document.querySelectorAll<HTMLElement>('[data-copy]').forEach((c) => c.setAttribute('aria-hidden', String(c.dataset.copy !== cur())));
  document.querySelectorAll<HTMLInputElement>('[data-gym-radio]').forEach((r) => { if (!r.dataset.touched) r.checked = r.value === cur(); });
  renderRows();
}
let tAnim = 0;
function applySite(s: Site) {
  if (s === cur()) return;
  root.classList.add('theme-anim');
  root.dataset.site = s;
  paint();
  clearTimeout(tAnim);
  tAnim = window.setTimeout(() => root.classList.remove('theme-anim'), reduce ? 0 : 1400);
}

/* ---------- Hero: the plate rolls from the left half to the right half ---------- */
const track = document.querySelector<HTMLElement>('[data-hero-track]')!;
const stage = document.querySelector<HTMLElement>('[data-plate-stage]')!;
const rotor = document.querySelector<HTMLElement>('[data-rotor]')!;
const plateA = document.querySelector<HTMLElement>('[data-plate="birkenhead"]')!;
const plateB = document.querySelector<HTMLElement>('[data-plate="ellesmere"]')!;
const HEADER = 72;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeInOut = (t: number) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function range() {
  const top = track.getBoundingClientRect().top + scrollY - HEADER;
  return { top, len: Math.max(1, track.offsetHeight - (innerHeight - HEADER)) };
}
const progress = () => { const { top, len } = range(); return clamp01((scrollY - top) / len); };
function place(p: number) {
  const vw = document.documentElement.clientWidth, W = stage.offsetWidth, narrow = vw <= 900;
  const x0 = narrow ? vw * .5 - W / 2 - vw * .16 : vw * .25 - W / 2;
  const x1 = narrow ? vw * .5 - W / 2 + vw * .16 : vw * .75 - W / 2;
  const e = easeInOut(p);
  const x = x0 + (x1 - x0) * e;
  // a plate rolls: rotation follows the distance travelled (radius W/2), with a little extra spin
  const rot = ((x - x0) / (W / 2)) * (180 / Math.PI) * 1.35;
  const bell = Math.sin(Math.PI * clamp01((p - .2) / .6));
  stage.style.transform = `translate3d(${x.toFixed(1)}px, ${(-10 * bell).toFixed(1)}px, 0)`;
  if (!root.classList.contains('intro')) rotor.style.transform = `rotate(${rot.toFixed(1)}deg)`;
  const k = smooth(.4, .6, p);
  const b = narrow ? 0 : 5 * bell * bell;
  const blur = b > .3 ? `blur(${b.toFixed(1)}px)` : 'none';
  plateA.style.opacity = String(1 - k); plateA.style.filter = blur;
  plateB.style.opacity = String(k); plateB.style.filter = blur;
}
let lastP = -1, ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const p = progress();
    place(p);
    if (lastP >= 0) {
      if (lastP < .5 && p >= .5) applySite('ellesmere');
      else if (lastP > .42 && p <= .42) applySite('birkenhead');
    }
    lastP = p;
  });
}
function renderPlates() { document.querySelectorAll<HTMLCanvasElement>('[data-plate]').forEach(renderPlate); }
document.fonts.ready.then(renderPlates);
let rz = 0;
addEventListener('resize', () => { clearTimeout(rz); rz = window.setTimeout(renderPlates, 300); onScroll(); });
if (!reduce) {
  addEventListener('scroll', onScroll, { passive: true });
  place(progress()); lastP = progress();
} else {
  const ep = cur() === 'ellesmere';
  plateA.style.opacity = ep ? '0' : '1'; plateB.style.opacity = ep ? '1' : '0';
  stage.style.transform = `translate3d(${document.documentElement.clientWidth * (ep ? .75 : .25) - stage.offsetWidth / 2}px,0,0)`;
}
if (root.classList.contains('intro')) {
  // opening: the plate rolls in from the left edge and settles (plays once)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.classList.remove('intro');
    rotor.style.transform = 'rotate(0deg)';
    setTimeout(() => { rotor.style.transition = 'none'; place(progress()); }, 1700);
  }));
}
if (new URLSearchParams(location.search).get('site') === 'ellesmere' && !reduce) {
  addEventListener('load', () => { const { top, len } = range(); scrollTo(0, top + len); });
}

// switches: inside the hero they scroll through the move; further down they just change gym
document.querySelectorAll<HTMLButtonElement>('[data-set-site]').forEach((b) =>
  b.addEventListener('click', () => {
    const s = b.dataset.setSite as Site;
    const { top, len } = range();
    if (!reduce && scrollY <= top + len + 4) scrollTo({ top: s === 'ellesmere' ? top + len : Math.max(0, top - 1), behavior: 'smooth' });
    else applySite(s);
  }));

/* ---------- Timetable (sample data from site.json) ---------- */
const sessions = JSON.parse(document.getElementById('tt-data')!.textContent!) as Record<Site, Record<string, [string, string, string][]>>;
const today = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short' }).format(new Date());
let day = today;
const rows = document.querySelector<HTMLElement>('[data-rows]')!;
function renderRows() {
  document.querySelectorAll<HTMLButtonElement>('[data-day]').forEach((b) => { const on = b.dataset.day === day; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
  const list = sessions[cur()]?.[day] || [];
  rows.innerHTML = list.length
    ? list.map(([t, n, d], i) => `<li style="--i:${i}"><span class="t">${t}</span><span class="n">${n}</span><span class="d">${d}</span></li>`).join('')
    : `<li style="--i:0"><span class="t">-</span><span class="n">No sessions</span><span class="d"></span></li>`;
}
const dayBtns = [...document.querySelectorAll<HTMLButtonElement>('[data-day]')];
dayBtns.forEach((b, i) => {
  b.addEventListener('click', () => { day = b.dataset.day!; renderRows(); });
  b.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (d) { const n = dayBtns[(i + d + dayBtns.length) % dayBtns.length]; day = n.dataset.day!; renderRows(); n.focus(); }
  });
});

/* ---------- Join (demo: validates, sends nothing) ---------- */
const form = document.querySelector<HTMLFormElement>('[data-join]');
form?.querySelectorAll<HTMLInputElement>('[data-gym-radio]').forEach((r) => r.addEventListener('change', () => { form.querySelectorAll<HTMLInputElement>('[data-gym-radio]').forEach((x) => (x.dataset.touched = '1')); }));
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = form.querySelector<HTMLElement>('[data-msg]')!;
  const name = form.querySelector<HTMLInputElement>('#j-name')!, email = form.querySelector<HTMLInputElement>('#j-email')!;
  const bad: HTMLInputElement[] = [];
  [name, email].forEach((i) => { const ok = i.checkValidity() && i.value.trim() !== ''; i.setAttribute('aria-invalid', String(!ok)); if (!ok) bad.push(i); });
  if (bad.length) { msg.className = 'msg err'; msg.textContent = bad[0] === name ? 'Add your name so the team knows who to reply to.' : 'Add an email address the team can reply to.'; bad[0].focus(); return; }
  const gym = (form.querySelector<HTMLInputElement>('input[name="gym"]:checked')?.value || cur()) === 'ellesmere' ? 'Ellesmere Port' : 'Birkenhead';
  msg.className = 'msg ok';
  msg.textContent = `Thanks, ${name.value.trim().split(' ')[0]}. In the real site this would go to the ${gym} team. This is a demo, so nothing was sent.`;
});

/* ---------- Arrive once ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((n) => io.observe(n));

paint();

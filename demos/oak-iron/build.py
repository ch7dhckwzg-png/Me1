#!/usr/bin/env python3
"""Build the Oak & Iron package demos (Cloudflare worker broad-art-97da).

src/  holds the single-page demos as they were first deployed.
dist/ is what gets uploaded: Essentials stays one page; Business, Signature and
Signature + Booking become a home page plus one page per section.

    python3 demos/oak-iron/build.py
"""
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SRC, DIST = ROOT / 'src', ROOT / 'dist'

# slug, nav label, page title, one line for the home page cards
PAGES = [
    ('services', 'Services', 'Services and prices', 'Cuts, fades, beard work and shaves, with prices and times.'),
    ('barbers', 'Barbers', 'The barbers', 'Meet Jordan, Sami and Rhys, and see what each is known for.'),
    ('gallery', 'Gallery', 'Recent work', 'Fades, shape-ups, scissor cuts and the shop itself.'),
    ('faq', 'FAQs', 'FAQs', 'Booking, kids, paying and parking.'),
    ('find-us', 'Find us', 'Find us', 'Address, opening hours and whether we are open right now.'),
]
SLUGS = [p[0] for p in PAGES]

ARROW = ('<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" '
         'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>')
MENU = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path class="m1" d="M4 7h16"/><path class="m2" d="M4 12h16"/>'
        '<path class="m3" d="M4 17h16"/></svg>')

EXTRA_CSS = """
  /* Pages */
  nav.links a[aria-current="page"] { color: var(--cream); box-shadow: inset 0 -2px 0 var(--brass); }
  .menu-btn { display: none; flex: none; width: 44px; height: 44px; border-radius: var(--radius); border: 1px solid var(--line); background: transparent; color: var(--cream); cursor: pointer; place-items: center; }
  .menu-btn svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
  .menu-btn path { transition: transform .25s var(--ease), opacity .2s; transform-origin: 12px 12px; }
  header.top.open .menu-btn .m1 { transform: translateY(5px) rotate(45deg); }
  header.top.open .menu-btn .m2 { opacity: 0; }
  header.top.open .menu-btn .m3 { transform: translateY(-5px) rotate(-45deg); }
  @media (max-width: 900px) {
    .menu-btn { display: grid; }
    header.top.open nav.links { display: flex; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; gap: 0; margin: 0;
      padding: 4px max(16px, env(safe-area-inset-left, 0px)) 12px; background: var(--ink); box-shadow: 0 24px 40px -20px rgba(0, 0, 0, .8); border-bottom: 1px solid var(--line); }
    header.top.open nav.links a { padding: 14px 0; font-size: 17px; border-bottom: 1px solid var(--line); box-shadow: none; }
    header.top.open nav.links a:last-child { border-bottom: 0; }
    header.top.open nav.links a[aria-current="page"] { color: var(--brass); }
  }
  @media (max-width: 380px) { header.top .wrap { gap: 10px; } header.top .cta { padding-inline: 12px; } }
  main h1.pg { font: 400 clamp(52px, 7vw, 88px)/.95 var(--display); letter-spacing: .03em; margin: 0 0 14px; }
  main.sub > section.band:first-child { border-top: 0; padding-top: 56px; }
  .crumbs { margin: 0 0 10px; font-size: 14px; color: var(--muted); }
  .crumbs a { color: var(--muted); }
  .explore { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; list-style: none; margin: 0; padding: 0; }
  .explore a { display: grid; align-content: start; gap: 6px; height: 100%; padding: 20px; border-radius: 10px; background: var(--panel); box-shadow: inset 0 0 0 1px var(--line); text-decoration: none; transition: box-shadow .2s; }
  .explore b { display: flex; align-items: center; justify-content: space-between; gap: 8px; font: 400 30px/1 var(--display); letter-spacing: .04em; }
  .explore b svg { width: 18px; height: 18px; color: var(--brass); transition: transform .2s var(--ease); }
  .explore span { color: var(--muted); font-size: 15px; }
  @media (hover: hover) { .explore a:hover { box-shadow: inset 0 0 0 1px var(--brass); } .explore a:hover b svg { transform: translateX(3px); } }
  .next { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
  .next a.btn svg { width: 16px; height: 16px; }
"""

MENU_JS = """
  /* ---------- Menu (phones) ---------- */
  (() => {
    const top = document.querySelector('header.top'), btn = document.querySelector('.menu-btn');
    if (!top || !btn) return;
    const set = (open) => { top.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu'); };
    btn.addEventListener('click', () => set(!top.classList.contains('open')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && top.classList.contains('open')) { set(false); btn.focus(); } });
    document.addEventListener('click', (e) => { if (!top.contains(e.target)) set(false); });
    window.matchMedia('(min-width: 901px)').addEventListener('change', () => set(false));
  })();
"""


FONTS = {
    'bebas-neue-400.woff2': ('bebas-neue', 'bebas-neue-latin-400-normal.woff2'),
    'inter-400.woff2': ('inter', 'inter-latin-400-normal.woff2'),
    'inter-500.woff2': ('inter', 'inter-latin-500-normal.woff2'),
    'inter-600.woff2': ('inter', 'inter-latin-600-normal.woff2'),
}
GOOGLE_FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
                '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
                '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap">')


def self_host_fonts(html, prefix):
    """Serve Bebas Neue and Inter from the site itself, so no visitor data goes to Google
    (the privacy policy promises this). prefix is the path from the page to dist/."""
    assert GOOGLE_FONTS in html, 'Google Fonts links not found'
    face = lambda fam, w, f: (f"  @font-face {{ font-family: '{fam}'; font-style: normal; font-weight: {w}; "
                              f"font-display: swap; src: url('{prefix}fonts/{f}') format('woff2'); }}")
    css = '\n'.join([face('Bebas Neue', 400, 'bebas-neue-400.woff2')] +
                     [face('Inter', w, f'inter-{w}.woff2') for w in (400, 500, 600)])
    html = html.replace(GOOGLE_FONTS, f'<link rel="preload" href="{prefix}fonts/bebas-neue-400.woff2" as="font" type="font/woff2" crossorigin>')
    return html.replace('<style>', '<style>\n' + css, 1)


def copy_fonts():
    nm = ROOT.parent.parent / 'node_modules' / '@fontsource'
    (DIST / 'fonts').mkdir()
    for out, (pkg, f) in FONTS.items():
        shutil.copy(nm / pkg / 'files' / f, DIST / 'fonts' / out)


NAME_TEXT = ('<text x="0" y="250" textLength="1000" lengthAdjust="spacing" font-family="Bebas Neue, Impact, sans-serif" '
             'font-size="300" fill="#eee7db">OAK <tspan fill="#b48a52">&amp;</tspan> IRON</text>')


def name_as_paths():
    """'OAK & IRON' as SVG paths drawn from the Bebas Neue font file.

    The hero used <text textLength="1000" lengthAdjust="spacing">, which Safari (WebKit,
    so every iPhone browser) lays out wrongly when part of the text is a <tspan>: the
    letters land in the wrong places and overlap. Paths look the same in every browser.
    Spacing matches textLength: the leftover width is shared equally between letters.
    """
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    font = TTFont(str(ROOT.parent.parent / 'node_modules/@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff'))
    cmap, gs, hmtx = font.getBestCmap(), font.getGlyphSet(), font['hmtx']
    size, baseline, width = 300, 250, 1000
    k = size / font['head'].unitsPerEm
    text = 'OAK & IRON'
    adv = [hmtx[cmap[ord(c)]][0] * k for c in text]
    gap = (width - sum(adv)) / (len(text) - 1)
    cream, brass, x = [], [], 0.0
    for c, a in zip(text, adv):
        if c != ' ':
            pen = SVGPathPen(gs, ntos=lambda v: f'{v:.1f}'.rstrip('0').rstrip('.'))
            gs[cmap[ord(c)]].draw(TransformPen(pen, (k, 0, 0, -k, x, baseline)))
            (brass if c == '&' else cream).append(pen.getCommands())
        x += a + gap
    return (f'<g fill="#eee7db"><path d="{" ".join(cream)}"/>'
            f'<path fill="#b48a52" d="{" ".join(brass)}"/></g>')


def fix_clipper_animation(html):
    """Signature hero: keep the clipper blade on the cut line, then send it off the edge.

    The reveal clip edge sits at x = -20 + 1040 * s over 1.6 s. The blade teeth sit
    125 units right of the clipper group's origin, so the group runs -145 -> 895 over
    the same 1.6 s with the same easing, then carries on off the right edge and fades
    (it used to overshoot the edge and finish parked on top of the name).
    """
    old_rules = ("    .namefx .clipper { animation: fv-glide 2.8s var(--ease-io) .4s both; }\n"
                 "    .namefx .shadow { animation: fv-glide-sh 2.8s var(--ease-io) .4s both; }")
    new_rules = ("    .namefx .clipper { animation: fv-glide 2.4s linear .4s both; }\n"
                 "    .namefx .shadow { animation: fv-glide-sh 2.4s linear .4s both; }")
    assert old_rules in html, 'clipper rules not found'
    html = html.replace(old_rules, new_rules)
    html = re.sub(r"  @keyframes fv-glide \{.*?\n", (
        "  @keyframes fv-glide { 0% { transform: translateX(-145px); opacity: 1; animation-timing-function: cubic-bezier(.65, 0, .35, 1); } "
        "66.667% { transform: translateX(895px); opacity: 1; animation-timing-function: cubic-bezier(.4, 0, 1, 1); } "
        "100% { transform: translateX(1320px); opacity: 0; } }\n"), html, count=1, flags=re.S)
    html = re.sub(r"  @keyframes fv-glide-sh \{.*?\n", (
        "  @keyframes fv-glide-sh { 0% { transform: translateX(-145px); opacity: .6; animation-timing-function: cubic-bezier(.65, 0, .35, 1); } "
        "66.667% { transform: translateX(895px); opacity: .6; animation-timing-function: cubic-bezier(.4, 0, 1, 1); } "
        "100% { transform: translateX(1320px); opacity: 0; } }\n"), html, count=1, flags=re.S)
    # With reduced motion the clipper should not be left over the name either.
    html = html.replace("@media (prefers-reduced-motion: reduce) { .namefx .rough { display: none; } }",
                        "@media (prefers-reduced-motion: reduce) { .namefx .rough, .namefx .clipper, .namefx .shadow { display: none; } }")
    return html


def null_safe_script(html):
    """Each page only has some sections, so guard the code that fills them."""
    for sel in ('[data-services]', '[data-gallery]', '[data-hours]'):
        pat = f"$('{sel}').innerHTML ="
        assert pat in html, pat
        html = html.replace(pat, f"if ($('{sel}')) $('{sel}').innerHTML =")
    start = "  chipRow($('[data-now]'), NOW, now, 'n');"
    if start in html:
        end = "  result(false);\n"
        i, j = html.index(start), html.index(end) + len(end)
        html = html[:i] + "  if ($('[data-result]')) {\n" + html[i:j] + "  }\n" + html[j:]
    return html


def split(html):
    m_main = re.search(r'<main id="top">(.*?)</main>', html, re.S)
    body = m_main.group(1)
    sections = {}
    for m in re.finditer(r'\n  <section class="band[^"]*" id="([\w-]+)".*?\n  </section>\n', body, re.S):
        sections[m.group(1)] = m.group(0)
    first = min(body.index(s) for s in sections.values())
    hero = body[:first]
    return m_main, hero, sections


def header_links(html, prefix, current, has_finder):
    nav = []
    for slug, label, *_ in PAGES:
        cur = ' aria-current="page"' if slug == current else ''
        nav.append(f'      <a href="{prefix}{slug}/"{cur}>{label}</a>')
    if has_finder:
        nav.insert(1, f'      <a href="{prefix or "./"}#finder">Find your cut</a>')
    html = re.sub(r'(<nav class="links" aria-label="Sections">\n).*?(\n    </nav>)',
                  lambda m: m.group(1) + '\n'.join(nav) + m.group(2), html, count=1, flags=re.S)
    html = html.replace('<a class="logo" href="#top">', f'<a class="logo" href="{prefix or "./"}">')
    btn = (f'<button type="button" class="menu-btn" aria-expanded="false" aria-controls="site-nav" '
           f'aria-label="Menu">{MENU}</button>')
    html = html.replace('<nav class="links" aria-label="Sections">', '<nav class="links" id="site-nav" aria-label="Sections">', 1)
    # the menu button goes last in the header row
    html = re.sub(r'(<header class="top">\n  <div class="wrap">.*?)(\n  </div>\n</header>)',
                  lambda m: m.group(1).rstrip() + '\n    ' + btn + m.group(2), html, count=1, flags=re.S)
    return html


def build_package(name):
    src = (SRC / name / 'index.html').read_text()
    html = src
    if 'class="namefx"' in html:
        html = fix_clipper_animation(html)
        assert html.count(NAME_TEXT) == 2, 'hero name text not found'
        html = html.replace(NAME_TEXT, name_as_paths())
    html = null_safe_script(html)
    html = html.replace('</style>', EXTRA_CSS + '</style>', 1)
    html = html.replace('</script>', MENU_JS + '</script>', 1)
    m_main, hero, sections = split(html)
    has_finder = 'finder' in sections
    title_base = 'Oak &amp; Iron Barbers'

    # Home: the hero, the interactive finder if this package has one, and a way into every page.
    cards = '\n'.join(
        f'        <li><a href="{slug}/"><b>{label} {ARROW}</b><span>{line}</span></a></li>'
        for slug, label, _, line in PAGES)
    explore = (f'\n  <section class="band" id="explore" aria-labelledby="explore-h">\n    <div class="wrap">\n'
               f'      <h2 id="explore-h">Have a look around</h2>\n      <ul class="explore">\n{cards}\n      </ul>\n'
               f'    </div>\n  </section>\n')
    home_hero = hero.replace('href="#services"', 'href="services/"').replace('href="#barbers"', 'href="barbers/"')
    home_main = home_hero + (sections['finder'] if has_finder else '') + explore
    out = DIST / name
    out.mkdir(parents=True, exist_ok=True)
    home = html[:m_main.start(1)] + home_main + html[m_main.end(1):]
    home = header_links(home, '', None, has_finder)
    home = self_host_fonts(home, '../')
    (out / 'index.html').write_text(home)

    for k, (slug, label, title, _) in enumerate(PAGES):
        sec = sections[slug]
        # the section's first heading becomes the page's h1
        sec = re.sub(r'<h2 id="([\w-]+)">(.*?)</h2>',
                     lambda m: f'<p class="crumbs"><a href="../">Home</a> / {label}</p>'
                               f'<h1 class="pg" id="{m.group(1)}">{m.group(2)}</h1>', sec, count=1)
        nxt_slug, nxt_label = PAGES[(k + 1) % len(PAGES)][:2]
        book = ('<button type="button" class="btn btn-solid" data-book>Book a chair</button>' if 'data-book' in src
                else '<a class="btn btn-solid" href="tel:+441514960123">Call to book</a>')
        nxt = (f'\n  <section class="band" aria-label="Keep going">\n    <div class="wrap next">\n      {book}\n'
               f'      <a class="btn" href="../{nxt_slug}/">Next: {nxt_label} {ARROW}</a>\n    </div>\n  </section>\n')
        page = html[:m_main.start(1)] + sec + nxt + html[m_main.end(1):]
        page = page.replace('<main id="top">', '<main id="top" class="sub">', 1)
        page = re.sub(r'<title>.*?</title>', f'<title>{title} | {title_base}</title>', page, count=1)
        page = header_links(page, '../', slug, has_finder)
        page = self_host_fonts(page, '../../')
        (out / slug).mkdir(exist_ok=True)
        (out / slug / 'index.html').write_text(page)


def main():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    copy_fonts()
    (DIST / 'index.html').write_text(self_host_fonts((SRC / 'index.html').read_text(), ''))
    (DIST / 'essentials').mkdir()
    (DIST / 'essentials' / 'index.html').write_text(self_host_fonts((SRC / 'essentials' / 'index.html').read_text(), '../'))
    for name in ('business', 'signature', 'booking'):
        build_package(name)
    print('\n'.join(sorted(str(p.relative_to(DIST)) for p in DIST.rglob('*') if p.is_file())))


if __name__ == '__main__':
    main()

# Catalyze

The Catalyze studio site (digital marketing, digital design, web design and photography), built with Vite + React.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
npm run preview  # serve the built site locally
npm run lint
```

Node 22 (see `.nvmrc`).

## What's where

| Path | Purpose |
| --- | --- |
| `src/content.js` | **All the words**: services, websites, photography slots, process, FAQ, email |
| `src/legal.js` | Privacy policy and terms, plus the business details to fill in |
| `src/sections/` | Intro, Hero, Velocity strip, Statement, Services, Work, Process, FAQ, Contact |
| `src/components/laptopScene.js` | The intro's 3D laptop (three.js) |
| `src/components/ParticleSpark.jsx` | The hero's backdrop: the spark built from ~100k particles, using `src/components/ui/liquid-sculpture-hero.tsx`; `HeroStar.jsx` is the reduced-motion version |
| `src/assets/hero/spark.webp` | The spark image the particles are sampled from (rendered from `HeroStar.jsx`, transparent background) |
| `src/components/motion/` | The three live animations in Work → Motion |
| `src/components/ui/` | Magic UI components, added with the CLI (see below) |
| `src/styles/work.css` | Styles for the Work section and its animations |
| `design/work/` | Source HTML for the concept work (websites, logos, menus, graphics) |
| `scripts/render-work.cjs` | Renders `design/work/*.html` to `src/assets/work/*.webp` |
| `src/assets/logo.svg` | The Catalyze logo (vector, traced from the 2000 px master) |
| `public/_headers` | Cache and security headers (Netlify, Cloudflare Pages) |

## Rules and launch

- **`CLAUDE.md`**: the owner's standing rules (no purple gradients, pill buttons, fake reviews or metrics, vague hero text, emoji icons, em dashes, over-the-top scroll animation, cursor animation or AI slop). Every Claude session reads it.
- **`LAUNCH.md`**: the launch gates (custom domain, favicon, no "Made with AI" tag, privacy policy, terms) and what's left.
- **`npm run check:rules`**: scans the source, pages, concept designs and build for anything the rules ban. Run it before every deploy.

## Look and feel

Apple-inspired, in Catalyze's colours: warm near-black, ivory and one rich orange (`--accent: #d2642c`, `--accent-text` for links). One clean typeface, Apple's system font on Apple devices and Inter (self-hosted) elsewhere, with tight, confident headlines. Centred section heads, big rounded tiles (`--radius-tile`, 24px) that show real work, lots of space and very little decoration. Controls use the small `--radius-control` (6px), never pills. A thin frosted sticky nav carries "Start a project" on every page, so it is also the sticky call to action on phones.

## Motion

Motion plays once on load or on arrival, or answers a click. Nothing follows the cursor and nothing moves with scroll, apart from the two things the owner asked for: the opening laptop intro and the scroll progress bar.

- **Opening animation (three.js):** a brushed-aluminium laptop (`src/components/laptopScene.js`, choreographed in `src/sections/Intro.jsx`). It opens head on and lights up, then turns to the side. One scroll, swipe, key press or click (or 5 s of waiting) plays the rest: the lid folds flat 180°, a beam of light shoots out and drives the laptop down, and the intro fades into the site. "Skip intro" speeds it up. It plays once per browser session; `?intro=0` skips it.
- **Hero:** *Made to be noticed.*, one line on what Catalyze does and two actions fade up. Then the Catalyze spark assembles once from ~100k GPU particles below them, like a product shot, and rests as a crisp still image (the 21st.dev liquid sculpture hero, with cursor interaction, its own copy, fonts and credit switched off).
- **Work, Motion:** three CSS animations (product, store walk-through, animated logo) that play only on screen, each with play/pause.
- **Process:** when the steps come into view, a thin orange line fills once and lights each step number in turn.
- Tabs fade between panels; text links nudge their chevron on hover.

With `prefers-reduced-motion: reduce`: no intro, no particles or WebGL (a still SVG star instead), and the Motion cards start paused.

## Pages

`index.html` (the site), `privacy.html` and `terms.html` (content in `src/legal.js`), and `404.html` (served by Netlify, Vercel and Cloudflare Pages for any unknown address, and kept out of search with `noindex`). The three inner pages share `src/components/PageShell.jsx` (header, breadcrumb, footer); every page uses `src/components/SiteFooter.jsx`. `public/robots.txt` lets search engines crawl everything.

## Concept work

The websites, logos, menus and graphic design in the Work section are **concept projects** for fictional brands (Norde, Lumen, Oak & Iron, Ember, Marlow), and the page says so. Each is an HTML file in `design/work/`, rendered to WebP:

```bash
node scripts/render-work.cjs          # all of them
node scripts/render-work.cjs menu     # just the menus
```

It needs Playwright's Chromium (`npx playwright install chromium`) and the dev dependencies (`sharp` and the `@fontsource` fonts used by `design/work/fonts.css`).

## Adding photos

The photography section has twelve slots (headshots, food & drink, product, website imagery; three each) showing "Photo coming soon". To fill one, put the image in `src/assets/photos/`, import it at the top of `src/content.js`, and set that slot's `src`:

```js
import studioPortrait from '@/assets/photos/studio-portrait.jpg'
// ...
{ title: 'Studio portrait', note: 'Clean backdrop, flattering light', src: studioPortrait },
```

Use portrait images (4:5), about 1600 px tall, saved as WebP or JPEG.

### Magic UI components

[Magic UI](https://magicui.design) is registered with the shadcn CLI as `@magicui`, so components install the same way, e.g.

```bash
npx shadcn@latest add @magicui/marquee
```

They land in `src/components/ui/`, converted to JavaScript. In use: `scroll-progress`, plus the 21st.dev `liquid-sculpture-hero.tsx` (TypeScript, with small local changes listed at the top of the file). The scroll-velocity bands, dock and shimmer button were removed in the Apple-style redesign; any of them can be re-added with the CLI. Magic UI is built on Tailwind CSS, so Tailwind v4 is set up through `@tailwindcss/vite` with only its theme and utility layers (no Preflight reset, so the hand-written CSS is unaffected), plus the `cn` helper in `src/lib/utils.js`. The CLI adds any packages a component needs (usually `motion`) and its keyframes to `src/index.css`.

### React Bits

The `@react-bits` registry is still configured in `components.json` (`npx shadcn@latest add @react-bits/<Name>-JS-CSS`), but no React Bits components are in use any more.

## Deploy (free tier)

It's a static build (`npm run build` → `dist/`), so any of these works:

- **Netlify:** import the repo. `netlify.toml` already sets the build command, output folder and Node version.
- **Vercel:** import the repo. It detects Vite on its own, and `vercel.json` adds long cache headers for `/assets`.
- **Cloudflare Pages:** connect the repo with framework preset *Vite*, build command `npm run build` and output directory `dist`. `public/_headers` is applied automatically.

## Claude Code setup

`.mcp.json` adds four MCP servers: Playwright (browser testing), Context7 (up-to-date library docs), shadcn (component registries, including `@react-bits` and `@magicui`) and Magic UI (component docs and examples). `.claude/settings.json` pre-approves the first three; Claude Code asks once before starting the Magic UI server. `.claude/skills/` holds skills that load in every session, including on mobile: Anthropic's UI/UX skills (frontend-design, design-critique, accessibility-review, ux-copy), Taste (`design-taste-frontend`), Impeccable, Playwright CLI (`npx playwright-cli`, a dev dependency), img2threejs, and Remotion's skills. `design/references/` holds the Awesome Design `DESIGN.md` library. See `.claude/skills/README.md`.

For cloud sessions, the **Me1** environment allows context7.com and mcp.context7.com, and points Playwright at the browser that's already installed:
`PLAYWRIGHT_MCP_EXECUTABLE_PATH=/opt/pw-browsers/chromium`, `PLAYWRIGHT_MCP_HEADLESS=true`, `PLAYWRIGHT_MCP_SANDBOX=false`.

## TypeScript

Vite compiles `.tsx` files directly. `tsconfig.json` (strict) is for type checking only: `npm run typecheck`. Most of the site is JavaScript; TypeScript components from registries (like `liquid-sculpture-hero.tsx`) can be dropped into `src/components/ui/` as they are.

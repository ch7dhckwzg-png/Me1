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
| `src/sections/` | Intro, Hero, Velocity strip, Statement, Services, Work, Process, FAQ, Contact |
| `src/components/laptopScene.js` | The intro's 3D laptop (three.js) |
| `src/components/StarScene.jsx` | The hero's 3D star (three.js); `HeroStar.jsx` is the SVG fallback |
| `src/components/motion/` | The three live animations in Work → Motion |
| `src/components/ui/` | Magic UI components, added with the CLI (see below) |
| `src/styles/work.css` | Styles for the Work section and its animations |
| `design/work/` | Source HTML for the concept work (websites, logos, menus, graphics) |
| `scripts/render-work.cjs` | Renders `design/work/*.html` to `src/assets/work/*.webp` |
| `src/assets/logo.svg` | The Catalyze logo (vector, traced from the 2000 px master) |
| `public/_headers` | Cache and security headers (Netlify, Cloudflare Pages) |

## Look and feel

Chic meets sporty: warm near-black, ivory and one rich orange (`--accent: #d2642c`). Instrument Serif and Hanken Grotesk carry the elegant side; Anton (huge condensed capitals) carries the Nike Run Club-style energy in a few kinetic graphics: the hero's *BE NOTICED.*, crossing bands, activity rings, a progress track, a rotating sticker and giant outlined words. Generous space and a faint film grain keep it calm between those moments. Kinetic pieces live in `src/components/kinetic/`.

## Motion

- **Opening animation (three.js):** a brushed-aluminium laptop with a keyboard, trackpad, hinge and glass screen (`src/components/laptopScene.js`, choreographed in `src/sections/Intro.jsx`). It opens head on and its screen lights up, then turns to the side. One scroll, swipe, key press or click (or 5 s of waiting) plays the rest: the lid folds back a full 180° until the laptop lies flat, the camera rises above it, a beam of light shoots out of the screen and drives the laptop down, and the intro fades and slides away into the site. Page scroll is locked until then; "Skip intro" speeds it up. It plays once per browser session, and `?intro=0` on the URL skips it (handy for shared links and testing).
  - The 3D code (one shared three.js chunk) and both scenes are set up before anything moves, and the intro waits for the hero's scene too, so nothing stutters part-way through.
- **Hero (three.js):** a faceted copper-orange star, the logo's spark, with soft streaks of light. It warps in as the intro hands over, then turns slowly, leans towards the pointer and reacts gently to scroll.
- **Hero type:** *Made to* rises in serif italic; *BE NOTICED.* kicks up letter by letter (GSAP SplitText). A rotating "Start a project" sticker links to email.
- **Crossing bands:** two Magic UI `ScrollVelocity` rows on orange and ivory bands set at opposite angles, racing in opposite directions.
- **Statement and rings:** words light up as you scroll; beside them, activity rings for branding, web, photography and motion close around "1 studio" (GSAP DrawSVG).
- **Services:** a bold orange block sweeps across a row on hover.
- **Process:** a progress track fills as you scroll and lights up each numbered step.
- **Giant words:** outlined *THE WORK* and *LET'S GO* slide sideways as you scroll past.
- **Work → Motion:** three live CSS animations (a product animation, a store walk-through and an animated logo). They play only while on screen, and each has a play/pause button.
- **Magic UI for getting around:** a `ScrollProgress` bar, a `Dock` of quick links once you pass the hero (labels on hover and focus), and a `ShimmerButton` on the hero's main call to action.

With `prefers-reduced-motion: reduce`: no intro, no WebGL (the SVG star is shown), no scroll effects, the strip stands still and the Motion cards start paused (press play to watch).

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

They land in `src/components/ui/`, converted to JavaScript. In use: `scroll-based-velocity`, `scroll-progress`, `dock` and `shimmer-button` (with one local change: an `as` prop, so it can render as a link). Re-adding `shimmer-button` with the CLI would undo that change. Magic UI is built on Tailwind CSS, so Tailwind v4 is set up through `@tailwindcss/vite` with only its theme and utility layers (no Preflight reset, so the hand-written CSS is unaffected), plus the `cn` helper in `src/lib/utils.js`. The CLI adds any packages a component needs (usually `motion`) and its keyframes to `src/index.css`.

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

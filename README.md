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
| `src/sections/` | Intro (opening animation), Hero, Velocity strip, Services, About, Contact |
| `src/content.js` | Email address and service copy |
| `src/hooks/useSmoothScroll.js` | Lenis smooth scroll wired to GSAP ScrollTrigger |
| `src/hooks/useReducedMotion.js` | Live `prefers-reduced-motion` value |
| `src/components/StarScene.jsx` | The hero's WebGL scene (three.js), loaded as its own chunk |
| `src/components/HeroStar.jsx` | SVG star used when WebGL is unavailable or motion is reduced |
| `src/components/ui/` | Magic UI components, added with the CLI (see below) |
| `src/assets/logo.svg` | The Catalyze logo (vector, traced from the 2000 px master) |
| `public/_headers` | Cache and security headers (Netlify, Cloudflare Pages) |

## Motion

The site is built around speed: a catalyst speeds up a reaction. Type is heavy, slanted capitals (Hanken Grotesk 900 italic), echoing the logotype.

- **Opening animation:** a laptop built in CSS 3D (`src/sections/Intro.jsx`). On load it opens, lights up with the logo and turns to the side. One scroll, swipe, key press or click (or 5 s of waiting) plays the rest: the screen halves fold out, light pours out, the view flies through, and a curtain of light pushes down to reveal the hero. Page scroll is locked until then. "Skip intro" speeds it up.
- **Hero (WebGL):** a faceted, polished gold four-point star (the logo's spark) with streaks of light rushing past (`src/components/StarScene.jsx`, three.js). It warps in as the hero is revealed (streaks race, the star spins up and scales in, then decelerates), leans towards the pointer, speeds up again when you scroll fast, and the camera pushes in as you scroll through the hero. *MADE TO BE NOTICED.* slams in line by line, then the lines are pulled apart sideways as you scroll away.
  - three.js is its own chunk, fetched while the intro idles. The scene is created under the intro's full-screen flash, which holds until the scene has drawn its first frame (at most 1.5 s), so its one-off setup is never seen as a stutter. Nothing renders before the reveal, or while the hero is off screen or the tab is hidden.
- **Velocity strip:** Magic UI `ScrollVelocity`. The four crafts race sideways, faster the faster you scroll.
- **Services:** on wide screens the section pins and scrolling drives four panels sideways, each a hard cut to a new colour, with titles rushing in. On narrow screens the panels stack and their titles slam in.
- **About:** one statement whose words light up as you scroll through it.
- **Contact:** a hard cut to gold; the sign-off slams in.
- **Lenis + GSAP ScrollTrigger** for smooth scrolling and every scroll-linked effect. Everything animates `transform` and `opacity` only.

With `prefers-reduced-motion: reduce`: no intro, no WebGL (the SVG star is shown), no pinning (services stack), no scroll effects, and the velocity strip stands still.

### Magic UI components

[Magic UI](https://magicui.design) is registered with the shadcn CLI as `@magicui`, so components install the same way, e.g.

```bash
npx shadcn@latest add @magicui/marquee
```

They land in `src/components/ui/`, converted to JavaScript. Magic UI is built on Tailwind CSS, so Tailwind v4 is set up through `@tailwindcss/vite` with only its theme and utility layers (no Preflight reset, so the hand-written CSS is unaffected), plus the `cn` helper in `src/lib/utils.js`. The CLI adds any packages a component needs (usually `motion`) and its keyframes to `src/index.css`.

### React Bits

The `@react-bits` registry is still configured in `components.json` (`npx shadcn@latest add @react-bits/<Name>-JS-CSS`), but no React Bits components are in use any more.

## Deploy (free tier)

It's a static build (`npm run build` → `dist/`), so any of these works:

- **Netlify:** import the repo. `netlify.toml` already sets the build command, output folder and Node version.
- **Vercel:** import the repo. It detects Vite on its own, and `vercel.json` adds long cache headers for `/assets`.
- **Cloudflare Pages:** connect the repo with framework preset *Vite*, build command `npm run build` and output directory `dist`. `public/_headers` is applied automatically.

## Claude Code setup

`.mcp.json` adds four MCP servers: Playwright (browser testing), Context7 (up-to-date library docs), shadcn (component registries, including `@react-bits` and `@magicui`) and Magic UI (component docs and examples). `.claude/settings.json` pre-approves the first three; Claude Code asks once before starting the Magic UI server. `.claude/skills/` holds UI/UX skills (frontend-design, design-critique, accessibility-review, ux-copy) that load in every session, including on mobile.

For cloud sessions, the **Me1** environment allows context7.com and mcp.context7.com, and points Playwright at the browser that's already installed:
`PLAYWRIGHT_MCP_EXECUTABLE_PATH=/opt/pw-browsers/chromium`, `PLAYWRIGHT_MCP_HEADLESS=true`, `PLAYWRIGHT_MCP_SANDBOX=false`.

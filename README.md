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
| `src/sections/` | Intro (opening animation), Hero, Services, About, Contact |
| `src/content.js` | Email address and service copy |
| `src/hooks/useSmoothScroll.js` | Lenis smooth scroll wired to GSAP ScrollTrigger |
| `src/hooks/useReducedMotion.js` | Live `prefers-reduced-motion` value |
| `src/components/` | React Bits components, added with the CLI (see below) |
| `src/assets/logo.svg` | The Catalyze logo (vector, traced from the 2000 px master) |
| `public/_headers` | Cache and security headers (Netlify, Cloudflare Pages) |

## Motion

- **Opening animation:** a laptop built in CSS 3D (`src/sections/Intro.jsx`, styles under "Intro" in `src/index.css`). On load it opens, its screen lights up with the logo, and it turns to the side. One scroll, swipe, key press or click (or 5 s of waiting) plays the rest: it turns back, the two halves of the screen fold out like doors, light and rays pour out, the view flies through, and a curtain of light pushes down to reveal the hero, whose entrance then plays. Page scroll is locked until then. Only `transform` and `opacity` are animated, so it stays on the GPU. "Skip intro" speeds it up.
- **Hero:** styled on the brand artwork. The logo sits centred and large on ink, with the gold tracked tagline *Marketing · Design · Imagery* under it and a warm amber glow low on the right. After the intro, the glow blooms, the logo settles in, and the tagline tightens its letter-spacing as it fades in. Headings use Hanken Grotesk 800 italic, echoing the logo's slant.
- **Service rows:** React Bits `GlareHover`. A faint warm sheen passes across a row on hover.
- **Contact background:** React Bits `Grainient`. A slow, dark, grainy gradient. It pauses when off screen and does not react to the pointer.
- **GSAP + ScrollTrigger:** the hero entrance and service rows fading up as you scroll.
- **Lenis:** smooth scrolling and smooth anchor links.

With `prefers-reduced-motion: reduce`, the opening animation is skipped entirely, Lenis and every GSAP tween are skipped. GlareHover doesn't sweep, and Grainient draws a single still frame.

### React Bits components

These were added with the shadcn CLI, using the JS + CSS variants:

```bash
npx shadcn@latest add @react-bits/SplitText-JS-CSS @react-bits/GlareHover-JS-CSS @react-bits/Grainient-JS-CSS
```

They are left exactly as the CLI wrote them, so re-running that command updates them. Any styling changes go in `src/index.css` or in props. The lint config skips `src/components/`.

## Deploy (free tier)

It's a static build (`npm run build` → `dist/`), so any of these works:

- **Netlify:** import the repo. `netlify.toml` already sets the build command, output folder and Node version.
- **Vercel:** import the repo. It detects Vite on its own, and `vercel.json` adds long cache headers for `/assets`.
- **Cloudflare Pages:** connect the repo with framework preset *Vite*, build command `npm run build` and output directory `dist`. `public/_headers` is applied automatically.

## Claude Code setup

`.mcp.json` adds three MCP servers: Playwright (browser testing), Context7 (up-to-date library docs) and shadcn (component registries, including `@react-bits`). `.claude/settings.json` approves them. `.claude/skills/` holds UI/UX skills (frontend-design, design-critique, accessibility-review, ux-copy) that load in every session, including on mobile.

For cloud sessions, the **Me1** environment allows context7.com and mcp.context7.com, and points Playwright at the browser that's already installed:
`PLAYWRIGHT_MCP_EXECUTABLE_PATH=/opt/pw-browsers/chromium`, `PLAYWRIGHT_MCP_HEADLESS=true`, `PLAYWRIGHT_MCP_SANDBOX=false`.

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
| `src/sections/` | Intro, Hero, Services, About, Contact |
| `src/remotion/` | The opening animation, a Remotion composition (`CatalyzeIntro.jsx`, beats in `timing.js`) |
| `src/content.js` | Email address and service copy |
| `src/hooks/useSmoothScroll.js` | Lenis smooth scroll wired to GSAP ScrollTrigger |
| `src/hooks/useReducedMotion.js` | Live `prefers-reduced-motion` value |
| `src/components/` | React Bits components, added with the CLI (see below) |
| `src/assets/` | Hero photo at 960/1440/1920 px (WebP + JPEG fallback) |
| `public/_headers` | Cache and security headers (Netlify, Cloudflare Pages) |

## Motion

- **Opening animation (Remotion):** "the reaction". Four crafts (marketing, design, web, photography) orbit apart, a catalyst pulls them together, they collide, and the logo is sprayed on with *One studio for the whole picture.* The first 2.5 s play by themselves. After that, scrolling drives the frames: `src/sections/Intro.jsx` puts `@remotion/player` in a sticky stage inside a 360svh section and seeks to match scroll position, then hands off to the hero. Its entrance now plays when it scrolls into view. Edit it in Remotion Studio with `npm run intro:studio` (`CatalyzeIntro` for desktop, `CatalyzeIntroPhone` for portrait). Remotion is free for individuals and companies of up to 3 people; see [remotion.dev/license](https://www.remotion.dev/license).
- **Hero headline:** React Bits `SplitText`. Letters rise through a mask with a gold-to-cream colour sweep, starting as the photo fades in. This is the page's one big moment.
- **Service rows:** React Bits `GlareHover`. A faint warm sheen passes across a row on hover.
- **Contact background:** React Bits `Grainient`. A slow, dark, grainy gradient. It pauses when off screen and does not react to the pointer.
- **GSAP + ScrollTrigger:** the hero entrance and service rows fading up as you scroll.
- **Lenis:** smooth scrolling and smooth anchor links.

With `prefers-reduced-motion: reduce`, the opening animation is skipped entirely, Lenis and every GSAP tween are skipped. SplitText shows plain text, GlareHover doesn't sweep, and Grainient draws a single still frame.

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

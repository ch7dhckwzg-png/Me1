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
| `src/sections/` | Hero, Services, About, Contact |
| `src/content.js` | Email address and service copy |
| `src/hooks/useSmoothScroll.js` | Lenis smooth scroll wired to GSAP ScrollTrigger |
| `src/hooks/useReducedMotion.js` | Live `prefers-reduced-motion` value |
| `src/components/` | React Bits components, added with the CLI (see below) |
| `src/assets/` | Hero photo at 960/1440/1920 px (WebP + JPEG fallback) |
| `public/_headers` | Cache and security headers (Netlify, Cloudflare Pages) |

## Motion

- **Hero headline:** React Bits `SplitText`. Letters rise through a mask with a gold-to-cream colour sweep, starting as the photo fades in. This is the page's one big moment.
- **Service rows:** React Bits `GlareHover`. A faint warm sheen passes across a row on hover.
- **Contact background:** React Bits `Grainient`. A slow, dark, grainy gradient. It pauses when off screen and does not react to the pointer.
- **GSAP + ScrollTrigger:** the hero entrance and service rows fading up as you scroll.
- **Lenis:** smooth scrolling and smooth anchor links.

With `prefers-reduced-motion: reduce`, Lenis and every GSAP tween are skipped. SplitText shows plain text, GlareHover doesn't sweep, and Grainient draws a single still frame.

### React Bits components

These were added with the shadcn CLI, using the JS + CSS variants:

```bash
npx shadcn@latest add https://reactbits.dev/r/SplitText-JS-CSS https://reactbits.dev/r/GlareHover-JS-CSS https://reactbits.dev/r/Grainient-JS-CSS
```

They are left exactly as the CLI wrote them, so re-running that command updates them. Any styling changes go in `src/index.css` or in props. The lint config skips `src/components/`.

## Deploy (free tier)

It's a static build (`npm run build` → `dist/`), so any of these works:

- **Netlify:** import the repo. `netlify.toml` already sets the build command, output folder and Node version.
- **Vercel:** import the repo. It detects Vite on its own, and `vercel.json` adds long cache headers for `/assets`.
- **Cloudflare Pages:** connect the repo with framework preset *Vite*, build command `npm run build` and output directory `dist`. `public/_headers` is applied automatically.

# Episode 01: Social 114. (unofficial concept)

**Concept (2 lines):** Social 114 is two places in one room, so the site is too. It runs on New Brighton time, and switching between brunch café and oven-lit pizza room plays a fine-line coffee cup turning into a pizza.

**v4 hero (current):** scroll-driven, by the owner's request (an exception to the CLAUDE.md scroll rule for this client site). The hero holds while the dish crosses: flat white on the left, spins across, becomes the pizza on the right; at halfway the page fades to night and the headline rolls over once. Only the dish follows the scroll. Logic in `src/scripts/main.ts`; cutouts made by `scripts/cutout.py`.

**PLACEHOLDER PHOTOS, REPLACE BEFORE ANY VIDEO OR PITCH:** `public/images/hero-cup.webp` and `hero-pizza.webp` were cut from owner-supplied stock previews (watermarked, probably AI-generated, not Social 114's food). They are gitignored and live only in the private preview. To swap: shoot your own, then `python3 scripts/cutout.py <cup.jpg> <pizza.jpg>` (it expects a dish centred on a plain background; tweak the thresholds for a real background) or export transparent 1100x1100 WebPs to the same paths.

**Shot notes for the real hero photos:** straight down (phone level, 90 degrees), dish centred, filling about 60% of the frame, on a plain mid-tone surface that contrasts with the dish, soft daylight from a window, no harsh shadows, 4K. One flat white with latte art in a Social 114 cup; one of their actual pizzas (pepperoni, jalapeño and honey if it's on). Ask the team first.

**v3 hero:** the page opens on a code-drawn flat white beside "Coffee and brunch.", then the cup turns away, the page fades to night and the pizza (pepperoni, jalapeño and honey) turns in under "Wood-fired pizza." Drawn in `src/scripts/dishes.ts`; no photos.

**v2 direction (owner feedback):** clean, sleek, mature. Muted room palette, type-led layout, hairline rules, fine-line drawings only.

**Palette** from their room: navy dado walls, orange-red door and counter, birch ply, white walls, leaded transom glass (mustard, teal, sky). **Type:** Fraunces (matches their heavy serif "Social 114." wordmark), Figtree, DM Mono.

## Run

    npm install
    npm run dev                      # http://localhost:4321  (?mode=day or ?mode=night to force a mode for recording)
    npm run build                    # static output in dist/, ready for Cloudflare Pages or Netlify
    python3 scripts/single-file.py   # one-file private preview in preview/

## Where things are

- All words, hours, menu and links: `src/content/site.json`
- Colours and fonts: `src/styles/global.css` (`:root`, `[data-mode="night"]`)
- Sections: `src/components/` (Header, Hero, Menu, Oven, Nights, Street, Visit)
- Behaviour: `src/scripts/main.ts`
- noindex: meta robots, `public/robots.txt`, `public/_headers`

## Placeholders and unverified content (confirm with Social 114)

1. **Opening hours** (Mon/Tue 8am to 4pm, Wed closed, Thu to Sun 8am to late; brunch 9:30am to 3pm; pizza from 6pm): La Vida Liverpool, Oct 2022, plus listings.
2. **Menu dishes**: from La Vida (2022), Wanderlog reviews and a third-party menu page. **Prices left off on purpose.**
3. **Event dates**: none public; shown as "Date to be confirmed".
4. **Instagram @social114_ and Facebook /GetSocial114**: linked by La Vida in 2022; not re-verified (Instagram blocks checks from this environment).
5. **Illustrations** stand in for photography. No Social 114 photos are used.

## Facts and sources

- Owners Robert Jones (Victoria Quarter street art coordinator) and Vic; opened September 2022: La Vida Liverpool, Left Bank.
- Former site social114.com: linked in 2022, domain no longer registered (RDAP, Nov 2026).

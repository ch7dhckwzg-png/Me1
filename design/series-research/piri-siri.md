# Piri-Siri Mexican Kitchen: business plan for the episode

The single source for this episode: facts, look, pitch, the three features, script draft, shot list and open items.
Last updated 25 Nov 2026. Checkpoint 1: **approved by the owner** (heating-name move, all three features, "new look" hook).

Move this into the series repo (`WEBSITES/EPISODE_0N/README.md` and `PROJECT_STATE.md`) once that repo is found.

---

## 1. Website status (verified 25 Nov 2026)

- `pirisirimexican.co.uk`: registered 6 Apr 2022, Namecheap hosting. The bare domain 302-redirects to `www.pirisirimexican.co.uk`, which loads (HTTP 200). No other domains found.
- Built on **eTakeawayMax** (footer: "Powered by eTakeawayMax"). It has working online ordering (collection and delivery), table booking, a full priced menu, hours and an Android app.
- Weak points: a "Customer Notice" pop-up on every load; cartoon cactus and clipart bunting; a tall empty red block on phones before the menu card; the About page is one line ("Piri-Siri Mexican Kitchen.").
- Verdict: **dated template**, not "no website". The hook says so (section 5).
- Instagram bio (checked by the owner, 25 Nov 2026): the only link is www.pirisirimexican.co.uk. No other website. The hook stays true.
- Still to do: concept-site search (`pages.dev`, `netlify.app`, `vercel.app`, `framer`, `wixsite`).

## 2. Facts (source: their website unless noted)

| Fact | Value |
| --- | --- |
| Name | Piri-Siri Mexican Kitchen (Google: "Piri-Siri Mexican Kitchen (Bar & Grill)") |
| Address | 223 Hoylake Road, Moreton, Wirral CH46 0SJ |
| Phone | 0151 678 5899 |
| Hours | Mon to Thu 14:00 to 22:30; Fri, Sat 14:00 to 23:00; Sun 14:00 to 22:00 |
| Ordering | Collection from 14:00, delivery from 15:00; 15% off collection, 5% off delivery, £20 delivery minimum |
| Two-course deal | £15.99, Sun to Thu, 14:00 to 17:30; dessert £3.99 extra. Their menu card calls it "Early sit in menu 2 course Mexican Meal"; it is also listed in the online ordering menu (check with owner whether it's sit-in only) |
| Two-course starters | Classic Nachos (v), Sweetcorn Fritters (v), Fish Cake, Tostadas (veg, chicken, beef), Chicken Dippers |
| Two-course mains | Fajitas (chicken, vegetable); Burritos, Chimichanga, Tacos, Mexican Chilli Bowl (veg, chicken, beef) |
| Two-course desserts | Chocolate Pudding, Marshmallow Banana Chimichanga, Vanilla ice cream |
| Menu sections | Small Plates, Mains, House Specials, Grill, Piri-Siri Steaks, Trio Tacos, Burger Special, Mexican 2 Course Meal, Sides, Ice Cream, Desserts, Kids |
| Sample prices | Tex-Mex Nachos £6.99, Fajitas £10.99, Burritos £11.99, Mix Trio tacos £15.99, Rump £17.99, Ribeye £18.99, Sirloin £19.99, Churros with Chocolate £5.99, sides £3.99 |
| Fajitas (menu text) | "Hot sizzling plate ... served with salsa, sour cream, guacamole, salsa verde (hot green salsa) and tortillas." |
| Google listing (owner's paste) | Reservations required, happy-hour food, vegetarian options, £20 to 30 per person |
| Instagram | `@pirisirimexicankitchen` (linked from their own site: **verified**) |
| Facebook | facebook.com/profile.php?id=100083278655433 (linked from their own site: **verified**) |
| Instagram bio | "A taste of Mexico brought to Moreton"; 15% off collection, 5% off delivery; **"Minimum order £20 for delivery/ collection"** (their website says delivery only: conflict, owner to confirm); highlights: Cocktails, Reviews, Our dishes, Menu, Customers |
| Community | A GO Wirral post on their grid names them "Our newest community champion". **Not yet read in full**: possible story-section fact once confirmed |
| FSA | Listed as "Piri-Siri Mexican Chicken", 223 Hoylake Road |
| Story | **Unverified:** a web-search summary of The Guide Liverpool says owner Jeevan Kandel took over the former Fajitas restaurant in October 2022 and rebranded it. Article not read (host blocked). Quandoo still lists "Fajitas Classic Mexican Bar and Grill, Moreton". Keep out of copy until confirmed. |

The full priced menu is on `https://www.pirisirimexican.co.uk/menu` (captured 25 Nov 2026); copy it into `site.json` with `_source` notes at build time.

## 3. Their own photos

From their site's slideshow (`https://www.pirisirimexican.co.uk/image/cache/data/`), 1440x609 each, below the 1600px bar for large images:
- Real-looking food on their wooden tables (`peri-slide2`, `peri-slide4`, `peri-slide10`, `peri-slide11`, `peri-slide12`, `per-slide5`): **small cards or placeholders only**, credited "Photos: Piri-Siri Mexican Kitchen", kept out of git.
- `mz`, `p-slidehshow4`, `p-slidehshow5` (nachos, prawn tacos, dark chicken) look like stock: **don't use**.
- Interior shots show identifiable customers in sombreros: **reference only** (colours).

## 4. Look

### Palette from the room

| Name | Hex | Where it's from | Role |
| --- | --- | --- | --- |
| Cast Iron | `#1C1816` | Sizzler plates; logo outline | Night base, hero background |
| Wall Orange | `#D97819` | Interior walls | Day base accent |
| Chair Red | `#B7291C` | Dining chairs | The heated name, buttons |
| Chilli Pink | `#E40C54` | "PIRI-SIRI" logo lettering | Small accents only |
| Sombrero Gold | `#FCB424` | Logo sombrero | Highlights, live status |
| Salsa Verde | `#0C843C` | Logo green band | Veg markers, "available now" |
| Table Varnish | `#844F34` | Wooden tables | Hairlines, secondary text on light |

Contrast to be checked to WCAG AA at build.

### Type
- **Alfa Slab One** for the edge-to-edge name: the nearest Google face to the logo's heavy flared slab. (Their current site uses Londrina Solid, which reads cartoonish at hero size.)
- Body and labels: a plain grotesk (Hanken Grotesk, matching the series). Monospace only for times and prices in the live strip.

## 5. Hook (owner's angle, literally true)

> "This Mexican place in Moreton had a website, so I gave it a new look."

On screen, Part B reads "so I gave it" / "a new look." (second line orange).

## 6. The pitch

**Concept:** "Two o'clock till late on Hoylake Road." The site runs on their real day: the early two-course deal, delivery from three, then evening service.

**Hero** (built to the KOVA reference):
- "PIRI-SIRI" in Alfa Slab One, edge to edge.
- A real cast-iron fajita sizzler, cut out, dead centre, in front of the name. One key light from the upper left, soft grounded shadow.
- Corner facts: top left "Find us / 223 Hoylake Road, Moreton"; top right "Today / Open 14:00 to 22:30" (live); bottom left "Early two courses / £15.99, Sun to Thu till 17:30"; bottom right "On the menu / Burritos, fajitas, tacos, grill".
- The dock (bottom centre, 6px radius): the live "right now" line (feature 3), Book a table, Order.

**Signature move: "served hot"** (v3, after the owner asked for a better animation; replaces the left-to-right heat sweep). On load the sizzler is set down in front of the name and settles, a few specks of oil spit up, and the heat spreads out of the plate, up and outwards through the letters, cast-iron grey to hot red with an ember edge leading, plus a brief, gentle heat haze. About 2.2s, once. Reduced motion: finished state. New to the series. Add to the "used so far" list when the episode is approved.

The voiceover line becomes: "When you open it, the sizzler lands and the heat spreads up through their name."

## 7. The three features (all approved)

All three use only data from section 2. Anything that is a calculation is labelled as an estimate where it could differ from the till.

### Feature 1 (the video's wow beat): the two-course builder that knows the time
- Steps: Starter, then Main, then Filling (only where the menu offers one: Tostadas veg/chicken/beef; Fajitas chicken/vegetable; Burritos, Chimichanga, Tacos, Chilli Bowl veg/chicken/beef), then "Add a dessert?" (optional).
- Answer card: the chosen meal in words, and the real price: **£15.99**, or **£19.98** with dessert.
- It knows Europe/London time:
  - Sun to Thu, 14:00 to 17:29: "Available now, until 17:30" with time left.
  - Sun to Thu before 14:00: "Available from 14:00 today".
  - Sun to Thu after 17:30: "Next: tomorrow from 14:00" (Thursday evening says "Next: Sunday from 14:00").
  - Fri and Sat: "Back on Sunday from 14:00".
- Then **Book a table**, which opens their existing booking page (`index.php?route=information/tablereservation`), labelled plainly.
- Phone-first, keyboard and screen reader friendly, works with reduced motion. Each choice slides the next step in; with reduced motion it just swaps.

### Feature 2: collect or deliver?
- Add dishes from their full priced menu (fixed-price items and the exact variant prices only).
- Shows the subtotal, then side by side: **Collect** (15% off, from 14:00) and **Deliver** (5% off, from 15:00, £20 minimum).
- Says the saving in plain words ("Collect and save £4.20").
- `_placeholder`: whether the £20 minimum applies before or after the discount, and any delivery charge (not published). The card says "Delivery charge not included".
- Ends with **Order on their site** (their existing ordering page).

### Feature 3: what's on right now
- One live line in the hero dock, in Europe/London time, from their real hours:
  - before 14:00: "Opens at 14:00"
  - 14:00 to 15:00: "Open now. Collection now, delivery from 15:00" (plus "Two courses £15.99 till 17:30" Sun to Thu)
  - 15:00 to 17:30 Sun to Thu: "Two courses £15.99 for another 1h 12m"
  - evening: "Open till 22:30" (23:00 Fri, Sat; 22:00 Sun)
  - after close: "Closed. Back at 14:00"
- A still dot next to it, never pulsing (pending owner decision on dots).
- The visit section highlights today's row in the hours table. `?mode=deal|evening|closed` overrides for recordings.

## 8. Sections

1. Hero (section 6) with the dock.
2. The menu: their real sections and prices, with Feature 2 built in ("Add to my order").
3. The two-course builder (Feature 1), its own section.
4. Craft: one big true number, "14:00", the time the doors and the kitchen open every day, with a line about the deal starting then.
5. Story, in their own words (owner's call, 25 Nov 2026: copy based on their Instagram bio): headed "A taste of Mexico brought to Moreton"; kitchen, bar and grill; sizzling plates, the grill, cocktails at the bar (no list yet), eat in, collect or delivery. The ownership story only once confirmed.
6. The street: a fine-line drawing of 223 Hoylake Road's shopfront (from the owner's photo), warm in the day, lit at night.
7. Visit: address, phone, live hours table with today highlighted, maps link, Book and Order buttons.
8. Footer: "Unofficial concept by CATALYZE", "Website concept and build by CATALYZE, @catalyze.uk", "Photos: Piri-Siri Mexican Kitchen" where used.

## 9. Voiceover draft (about 85 words, to confirm before the edit)

> This Mexican place in Moreton had a website, so I gave it a new look. It's Piri-Siri, on Hoylake Road. When you open it, the name heats up behind a sizzling plate of fajitas. But this is my favourite bit. Their early two-course deal, you just tap a starter and a main. Nachos and chicken fajitas? Fifteen ninety-nine. Add the banana chimichanga? Nineteen ninety-eight. And it knows the time, so on a Friday it tells you it's back on Sunday. Then you book your table. Who's next?

Facts behind it: £15.99 and £3.99 dessert (their menu); Sun to Thu only (their menu card); Classic Nachos, Fajitas (chicken) and Marshmallow Banana Chimichanga are on the two-course list.

## 10. Shot list (for the owner)

1. **Hero object, the most important shot:** a fajita sizzler on its board, side-on at eye level, one window light from one side, plain background (a plain wall or a sheet of card behind it), the whole plate in frame with space around it. Several frames, phone on a steady surface. Sizzlers only come to the table, so this is a sit-in visit.
2. Storefront push-in, 3 to 5s vertical, 223 Hoylake Road.
3. Wide street establishing shot of Hoylake Road, Moreton.
4. Two details: the sign, and the orange wall with the wooden tables (no customers' faces).
5. Two top-down signature photos: the two-course starter and main, straight down, centred, on a plain contrasting surface, window light.
6. A straight-on photo of the shopfront for the fine-line drawing.

## 11. Open items

- **Series repo not found.** `Smash-King` is a separate Smash King burger site (React + Vite), not the series. Episode 01 and 02 code, `cutout.py`, `single-file.py` and the capture scripts are needed, or the owner approves building them fresh.
- Owner or business: confirm the two-course deal is sit-in only; delivery charge; whether the £20 minimum also applies to collection (Instagram says yes, website says delivery only); the October 2022 takeover story; the GO Wirral community champion post; they also do cocktails (Instagram highlight), not yet on the site.
- Pending series decisions: Instrument Serif, the interpunct, the status dot.

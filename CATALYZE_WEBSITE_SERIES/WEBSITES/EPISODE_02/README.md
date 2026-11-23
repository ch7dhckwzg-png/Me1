# Episode 02: The Salon Sanctuary, 61 Burlington Street, Liverpool L3 6LG

Unofficial speculative website concept by CATALYZE. Not affiliated with the salon. `noindex` everywhere (meta, robots.txt, `_headers`).

## Concept: book the whole appointment on the site

The owner's brief: booking is the salon's priority. Then: "book fully on the site", with no hand-off to Fresha.

**Getting to booking:** a **Book** button is always in reach. It's in the header, in a bar pinned to the bottom on phones, on every price row, in the colour finder's suggestions, and on the consultation section.

**The booking panel** does everything on the site:
1. **Service:** pick a category, then a service (real price and length), then check the ticket-style card with the salon's own notes (colour consultation, patch test at least 48 hours before, extensions ordered once paid). For colour and extensions it offers to book the right consultation first.
2. **Time:** choose a stylist (Whoever is free, Ashley or Macie), pick a day from the next three weeks, then pick a time.
   - Closed days can't be picked.
   - Consultations can't be booked on Saturdays.
   - Only times where the whole service fits before closing are offered.
3. **Details:**
   - Name, mobile and email are required. Square needs a phone number to make a booking.
   - Notes are optional.
   - Colour bookings ask the client to confirm the patch test.
   - Clear error messages show if anything is missing.
4. **Done:** a check mark draws in, then the appointment card shows the day, time and stylist, with **Add to calendar** (a real calendar file).

`?book=colour` (any category key) or `?book=s:20394736` (any service id) opens the panel straight away. That's ready for an Instagram bio link.

### What's real and what isn't (concept)

- `booking.provider` in `site.json` is **"demo"**.
- In demo mode, times are **sample times worked out from the real opening hours and service length**. They are **not** the salon's real free times.
- Confirming sends nothing and makes no appointment. The panel says so at every step.
- Nothing typed into the form leaves the browser.

### Going live (needs the salon to move its diary)

Fresha has no public booking API (as of Nov 2026), and its booking page can't be embedded. So a booking made on the site can't go into Fresha. Fully on-site booking means the salon runs its diary in a system with a bookings API. This build targets **Square Appointments** (Square Bookings API).

To go live:
1. The salon sets up Square Appointments: services, the team (Ashley, Macie), hours, and any deposit or no-show settings.
2. Deploy `server/square-booking.mjs` as a server function (Cloudflare Workers, Netlify or Vercel). Set `SQUARE_ACCESS_TOKEN` and `SQUARE_LOCATION_ID` on the host, never in the repo.
3. Fill in `SERVICE_MAP` (menu id to Square service variation id and version) and `STAFF_MAP`.
4. In `site.json` set `"provider": "square"` and `"endpoint"` to the function's URL.
5. Test against Square's sandbox: availability, booking, a double-booking race, and BST dates.
6. Add the privacy policy and terms pages (CLAUDE.md launch gates). The form collects personal data.

**Status:**
- `server/square-booking.mjs` is **written but not deployed or tested**.
- I checked it against Square's Bookings API docs: the availability window must be 24 hours to 31 days, and the customer must have a phone number.
- Card payments and deposits aren't built. The site says "pay in the salon". Square's own deposit settings would need checking.

**Trade-off to raise with the salon:** moving off Fresha loses their Fresha marketplace profile and its 456 reviews. Keeping Fresha means the last step (time and payment) happens on Fresha. The earlier hand-off version is at tag `ep02-salonsanctuary-v3`.

## Signature move: the name on a steamed mirror (v2, owner's pick of ideas 5 and 6 combined)

The first thing you see is the salon's name, set like their shop sign, inside an arched salon mirror with a gold frame. It plays once on load:

1. The glass is fogged.
2. The sign lettering writes itself on in fine line.
3. The fog clears from the centre outwards.
4. The letters set solid.
5. The rules either side of "THE" slide out.
6. The TSS monogram drops in, and one light sheen crosses the glass.

Under the mirror: "Hair salon at 61 Burlington Street, Liverpool.", Book and See prices, and the live open/closed line. Nothing follows the scroll or the cursor. With reduced motion the finished mirror shows straight away.

The header hides its wordmark while the mirror is on screen, so the name isn't shown twice.

Mechanic used: **a reveal through a mask (fog clearing) plus a line drawing that writes itself.**

The "Colour, blonding and cutting on Burlington Street." section moved to second place, with the quick booking picks. Its swatch ring now fans open once on arrival instead of following the scroll.

## v3: wow factor (owner: "worth big bucks")

All motion still plays once or answers a tap. Nothing follows scroll or the cursor.

- **The mirror reflects their room.** A soft reflection sits behind the glass: herringbone wall, black basin and chair, blush stools on gold legs, pendant light. It's drawn in code (`art-src/mirror-room.svg`) and rendered once to `public/art/mirror-room.webp`. Water droplets sit on the fog and clear with it.
- **Herringbone wall and wash station.** In the second section, their tile wall is painted on a canvas tile by tile. It starts just before it scrolls into view. Once the wall is properly on screen, their backwash station builds in front in about two seconds:
  1. The floor line draws in.
  2. The black cabinet rises.
  3. The basin tips back to its angle, and light runs along the rim.
  4. The chair reclines into the neck rest.
  5. The gold piping and tap draw on.
  6. One drop falls into the bowl.

  It plays once. With reduced motion, the finished scene shows straight away.
- **Find your colour** (new section):
  - Tap your shade now, then the shade you'd like. Those two locks slide out of the ring with "Now" and "Goal" labels.
  - It suggests a starting service from the real menu, with prices and booking, plus the £10 consultation.
  - **[PLACEHOLDER]** The shade-to-service suggestions are our reading of the menu and need the salon's approval.
- **Appointment card.** The booking panel's check step is a ticket with their TSS monogram, service, price, time and address.
- **Live shopfront.** The drawing draws itself on arrival. Its windows glow warm while the salon is open, and a "Closed" sign hangs on the door when it isn't.
- **Small touches.** Price rows cascade in when you switch category, and "48" counts up when the consultation section arrives.

## Colours from the room (Fresha venue photos, Nov 2026)

| Token | Hex | From |
| --- | --- | --- |
| `--fascia` | `#f6e6e8` | Blush fascia board (lifted slightly pinker so it doesn't read as generic cream) |
| `--door` | `#e7c6bf` | Pink doors |
| `--tile` | `#c9a39c` | Herringbone tile behind the basins |
| `--rose` | `#8a4b52` | Deepest tile shadow, used for accent text |
| `--sign` | `#2b2e31` | Sign lettering and window frames |
| `--basin` | `#131517` | Black basins |
| `--gold` | `#a9874f` | Brushed gold chair frames |

**Type:**
- Cormorant Garamond for display; the sign is a classic roman in wide caps.
- Jost for body text.
- DM Mono for prices and times.

## Sources

**From Fresha** (public page, structured data and booking menu, fetched 23 Nov 2026):
- All 58 services, prices, times and booking links. Names tidied for spelling and sentence case only.
- Hours: Wed 10:00 to 18:45, Thu 10:00 to 19:45, Fri 08:00 to 18:45, Sat 08:00 to 16:45.
- Team: Ashley, director stylist; Macie, junior stylist.
- Amenities and payment types.
- The colour and extension consultation notes.

**From the shop sign** (Fresha venue photo): phone number 0151 345 3463 and the shopfront layout.

**Instagram:** @thesalonsanctuary, linked by the salon on Fresha.

## [PLACEHOLDER] / to confirm with the salon

- The phone number (read from the sign).
- The team list, and whether the independent stylists at the address want to be shown.
- Short "good to know" wording ("set up for wheelchair users", "close to bus routes into town").
- "from" prices on the colour packages where Fresha's list didn't say. Shown as "from" to be safe.
- No photos are used. Never use the salon's own photos. Owner photos can go in later.

## Run

```
npm install
npm run dev                       # http://localhost:4321
npm run build && python3 scripts/single-file.py   # preview/salon-sanctuary-preview.html (gitignored)
```

`?now=Thursday-14:20` holds the clock for screen recordings.

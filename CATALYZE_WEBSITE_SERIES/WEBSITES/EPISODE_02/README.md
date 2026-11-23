# Episode 02: The Salon Sanctuary, 61 Burlington Street, Liverpool L3 6LG

Unofficial speculative website concept by CATALYZE. Not affiliated with the salon. `noindex` everywhere (meta, robots.txt, `_headers`).

## Concept: "Book in three taps"

The owner's brief: booking is the salon's priority, so it's built into the site, not bolted on.

- A **Book** button is always in reach: in the header, in a bar pinned to the bottom of the screen on phones, and on every one of the 58 rows of the price list.
- The **booking panel** walks through the choice on the site itself:
  1. Pick a category.
  2. Pick a service, with the real price and time.
  3. Check the "before you book" notes in the salon's own words (colour consultation, patch test at least 48 hours before, extensions ordered once paid).
  
  **Choose a time** then opens the salon's Fresha booking **with that exact service already in the basket**. The visitor picks the time, confirms and pays there.
- For colour and extensions, the panel offers to book the right consultation first.
- `?book=colour` (any category key) or `?book=s:20394736` (any service id) opens the panel straight away. That's ready-made for an Instagram bio link.

### Why it hands off to Fresha

Fresha's booking page refuses to be shown inside another site (`content-security-policy: frame-ancestors` limits it to Fresha and Adyen). Its help centre doesn't document an embeddable widget. Its own listing data does give every service a booking link (`/booking?offerItemId=…`). Tested on 23 Nov 2026: the link opens Fresha with that service selected and a "Continue" button. Calendar, deposits, payments and reminders all stay in Fresha, where the salon already runs them.

**Before launch:** the salon creates its own Fresha direct link (Marketing, Direct links) and `booking.base` in `site.json` is swapped to it. Fresha says direct links don't show other businesses. Whether the per-service `offerItemId` parameter works on a direct link must be tested at that point.

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

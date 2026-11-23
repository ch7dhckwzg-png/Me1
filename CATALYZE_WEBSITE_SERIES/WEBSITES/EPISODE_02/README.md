# Episode 02: Apex (unofficial concept)

**Concept (2 lines):** Apex is two gyms, Birkenhead and Ellesmere Port, so the site is one Apex with two homes. Scroll the hero and a rubber plate rolls across the screen, its rim changing from BIRKENHEAD to ELLESMERE PORT as the page flips from the chalk theme to the graphite theme.

## What is real and what is not

Only these come from the owner (CATALYZE): the name **Apex**, that it's a **gym**, and that it's in **Birkenhead** and **Ellesmere Port**. No website, listing or social account for these gyms could be found online (Nov 2026); apexgyms.co.uk is an unrelated South London gym and Apex Liverpool (Brick Street) is a different business.

**Placeholders (all labelled on the page or in `src/content/site.json`):**
1. Addresses and opening hours of both gyms: "to confirm".
2. Timetable: labelled "Sample timetable"; class names and times are examples.
3. Memberships: plan types are examples; prices and inclusions "to confirm".
4. The peak mark, colours (chalk, graphite, red) and type are placeholders, not Apex's branding. Replace once their logo and colours are known.
5. The join form is a demo: it validates and sends nothing.
6. Social links: none (no verified handles yet).

## Run

    npm install
    npm run dev                      # http://localhost:4321  (?site=ellesmere holds the other gym for recordings)
    npm run build
    python3 scripts/single-file.py   # one-file private preview in preview/

## Where things are

- Words, sites, timetable, plans: `src/content/site.json`
- Colours and fonts: `src/styles/global.css` (`--bk-*` Birkenhead chalk, `--ep-*` Ellesmere Port graphite)
- The plate (drawn in code): `src/scripts/plate.ts`
- Behaviour: `src/scripts/main.ts`
- Sections: `src/components/`
- noindex: meta robots, `public/robots.txt`, `public/_headers`

Checks run: Impeccable detector 0 findings; Playwright at 1440 and 390 across the scroll move, both directions, form; WCAG AA contrast on both themes; rule sweep clean.

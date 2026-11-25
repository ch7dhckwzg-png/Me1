# Catalyze website: standing rules

These are the owner's rules for this site. They apply to every change, in every session,
and they override any skill, plugin or default style. If a request seems to need one of
these, ask first.

## Never

- **Purple gradients**, or purple/violet/lavender anywhere in the site's own design.
- **Pill-shaped buttons.** Controls use the site's small radius (`--radius-control`, 6px).
  Small round icon controls (the play button, FAQ toggle, rotating sticker) are circles, not pills.
- **Fake reviews, testimonials, quotes, customer counters or metrics.** No invented numbers,
  clients or awards. Concept work is labelled as concept work.
- **Vague hero text.** The first screen says plainly what Catalyze does.
- **Emoji or Unicode glyphs as icons** (no ✦, ★, ✓, →). Icons are drawn SVG.
- **Em dashes** in visible copy, alt text or rendered images. Avoid en dashes in visible
  copy too ("9:00 to 19:00", not a dash).
- **Over-the-top scroll animations.** No text that moves or scrubs with scroll, no parallax,
  no scroll-jacking. Motion plays once on load or on arrival, or answers a click.
  (Exceptions the owner asked for: the opening laptop intro and the scroll progress bar.)
- **Cursor animations**: nothing that follows or reacts to the pointer's position
  (no tilt-to-cursor, magnifying docks, custom cursors or trails). Ordinary hover states are fine.
- **AI slop photos** (generated or stock passed off as Catalyze's work) and **AI slop copy**
  (filler like "elevate", "seamless", "unlock", "next level", empty superlatives).
- A **"Made with AI"** (or "Built with ...") tag, badge or generator meta tag.

## Hero reference

Every hero (this site and every series site and reel) is built to `design/references/hero-moment/README.md`:
one real object cut out over a giant edge-to-edge name, real facts pinned to the corners, at least half the
frame empty, one key light, one small dock for controls, and motion saved for one living hero moment.
Its list of AI "tells" is part of the rule sweep. Where that reference and these rules disagree, these rules win.

## Launch gates

The site does not launch until every item in `LAUNCH.md` is checked:
custom domain connected, favicon in place, no "Made with AI" tag, privacy policy page,
terms and conditions page.

## Working standard

Make no mistakes: verify every change in a real browser at desktop and phone widths,
re-run the rule sweep in `LAUNCH.md` before committing, and report anything unverified
plainly instead of claiming it works.

# Hero moment: the reference the owner wants every hero built to

Source: a 59-second Instagram reel the owner screen-recorded on 25 Nov 2026 ("Everyone can tell ChatGPT built your site in 0.5s. Kill all 20 tells, rebuild into a $10k hero in 6 steps."). Its end product is a concept headphone page, **KOVA ONE**. The owner's words: "I love the end product it gave... reference it from now on."

The recording and a cropped still (`kova-hero-card.png`) are third-party media, so they stay local and out of git (see `.gitignore`). This file is the part that counts: what the reel says, and how it maps onto Catalyze's own rules.

## The finished hero, described

- Near-black background (cool charcoal, around `#121418`), one soft key light from above, so the object casts real grounded depth instead of floating on a glow.
- The product name set **edge to edge** in one heavy grotesk ("KOVA ONE"), white with a faint cool gradient, filling the width.
- A **cut-out photo of the real object** (the headphones) sits dead centre, **in front of** the headline, overlapping the letters. Type behind, object in front: that overlap is the whole effect.
- **Real specs pinned to the four corners** in small type (label above, value below): Driver / 40mm Beryllium, Mass / 248g Titanium, Response / 5Hz to 40kHz, Origin / Zurich, Switzerland.
- About **60% of the frame is empty**.
- One small **frosted-glass dock** at the bottom centre holding the only controls: colour swatches, price, one primary button.
- **Motion is saved for one living hero moment**: the object is the only thing that moves. Nothing else slides or fades in.

## The 6 steps to the hero (from the reel)

1. Scale one bold typeface edge to edge.
2. Float the hero object dead centre, over the headline.
3. One directional key light: real, grounded depth.
4. Pin real specs to the corners: 60% empty space.
5. One quiet frosted-glass dock. Zero clutter.
6. Save motion for one living hero moment.

Summed up in the reel as "Cutout over giant type, 60% negative space."

## The 20 tells to kill (from the reel)

1. Arrows on every button (Claude uses the right arrow, GPT the diagonal one).
2. Little dots between words (interpuncts).
3. Tiny all-caps eyebrows above headings.
4. Warm beige backgrounds (often `#F4F1EA`).
5. One emotional italic word in the headline.
6. Sparkle emojis, even on non-AI buttons.
7. Every box wrapped in a border.
8. The word "quiet".
9. 01, 02, 03 numbered sections.
10. Pulsing green "live" dots.
11. Blurry gradient orbs: light with no source.
12. Instrument Serif as the display font.
13. Thick left bars on quotes (the callout look).
14. Three icon cards in a row ("the biggest tell").
15. Badge pills up top ("New", "v2.4").
16. Made-up metrics ("99.9%", "12M+"): never measured.
17. Two-word poetic taglines ("Pure sound. Every moment.").
18. Slide up and fade in, repeated on everything.
19. Dithered photos: fake-crafted dots.
20. One of the "last five" went by too fast to read in the recording; ask the owner if it matters.

The reel's warning after the tells: "Zero tells left. Clean, still completely forgettable." Removing tells is not enough; the 6 steps are what make it memorable.

## How Catalyze applies it

**Use on every hero (sites and the series):**
- One real object, cut out from a real photo (`scripts/cutout.py`) or drawn in code, overlapping a giant edge-to-edge name. Never stock or AI imagery.
- Real facts pinned to the corners: things that are true and published (address, hours, year opened, what they serve). Never invented numbers.
- At least half the hero is empty space. One key light; no glow orbs.
- One dock for the controls, using the 6px control radius (not a pill).
- The signature move is the hero's single living moment; everything else on the first screen is still.

**Where the KOVA page itself breaks `CLAUDE.md` (do not copy these parts):**
- Its "Pre-order" button and dock are pills. Ours use `--radius-control` (6px).
- "5Hz — 40kHz" and "Series 01 — Reference Acoustics" use em dashes. We write "5Hz to 40kHz".
- It has eyebrow labels ("SERIES 01 ..."), a "PREMIUM 06" badge pill and a lavender rim light on the card frame. None of those are allowed here.
- Its specs and $590 price are invented for a fake product. Ours must be real.

**Open questions for the owner (not yet changed anywhere):**
- Tell 12: the series uses **Instrument Serif** for every video headline and outro. Keep it as the series signature, or swap it?
- Tell 2: the series outro and credits use an interpunct ("Unofficial concept by CATALYZE · @catalyze.uk", "Google Street View · month year"). Keep, or switch to line breaks?
- Tell 10: live "open now" status on café sites shows a dot. Keep it still (no pulse), or drop it for text only?

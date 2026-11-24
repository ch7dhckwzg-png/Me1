# CATALYZE: "Making businesses websites they didn't ask for", next-episode prompt

Paste everything below the line into a new Claude Code session on this repository (branch `claude/catalyze-website-series-3tfrlw`), then paste one business block from `DOCUMENTATION/EPISODE_OPTIONS.md` where it says **BUSINESS DETAILS** at the end.

---

You are the creative director, web designer, developer, video editor and social strategist for **CATALYZE** (Liverpool and the Wirral, Instagram and TikTok @catalyze.uk). You are producing the next episode of an established series: **"Making businesses websites they didn't ask for."** Episode 01 (Social 114, New Brighton) and Episode 02 (The Salon Sanctuary, Liverpool) are the templates. **Episode 02 is the closest model for structure and pacing:** conversational narration, about 30 to 35 seconds, with a dedicated beat for the site's interactive wow feature. **This episode must look and feel like the same series: same structure, type, colours, motion and caption style. Only the business, its website, its colours and its feature change.**

Work one stage at a time and stop at each **CHECKPOINT** for my approval. I don't record voice or touch code. I will film storefront clips and take photos from a shot list you give me.

## 0. Before anything

1. Read, in order: `CLAUDE.md`, `CATALYZE_WEBSITE_SERIES/PROJECT_STATE.md`, both website READMEs (`WEBSITES/EPISODE_01/README.md`, `WEBSITES/EPISODE_02/README.md`), both voiceover scripts (`VOICE/SCRIPTS/EPISODE_01.md`, `EPISODE_02.md`), `CAPTIONS/EPISODE_02.md`, and the edit source in `VIDEO/EDITS/remotion/src/` (`ep02.ts` and `Ep02.tsx` first, then `ep01.ts` and `Ep01.tsx`) plus `scripts/capture-ep02.cjs`. These two episodes are your reference for every decision below.
2. Work out the episode number N (next free `WEBSITES/EPISODE_0N`). Record it in `PROJECT_STATE.md` straight away, and update that file after every checkpoint.
3. Never print, log or commit secrets. PostZen and ElevenLabs keys are injected by the environment's proxy. Never publish, schedule, deploy publicly, send collab invites, message or tag anyone without my explicit go-ahead.

## 1. Rules (all of them apply to the site AND the video)

From `CLAUDE.md` (owner rules, no exceptions unless I say so):
- No purple, violet or lavender. No purple gradients.
- No pill buttons: controls use a 6px radius. Small round icon controls may be circles.
- No fake reviews, testimonials, quotes, customer counts or metrics. No invented prices, awards, history or claims. Anything unverified is marked `_placeholder` in `site.json` and listed in the README.
- No vague hero text: the first screen says plainly what the business does.
- No emoji or Unicode glyphs as icons (no ✦ ★ ✓ →). Draw icons as SVG.
- No em dashes in visible copy, alt text or rendered images; avoid en dashes ("9:00 to 19:00").
- No AI slop copy ("elevate", "seamless", "unlock", "next level", empty superlatives). No AI or stock photos passed off as the business's.
- No "Made with AI" / "Built with" tag.
- Motion plays once on load, on arrival, or in answer to a click. Nothing follows the cursor. **Series exception, approved by me:** the hero's scroll-driven signature move (section 3) may follow the scroll; only that element does, text changes once at the threshold, no other scroll-jacking.

Learned on Episode 01 (keep them):
- No eyebrow/kicker labels above section headings. No italic serif display headlines. No decorative radial glows. Labels in the body face, monospace only for times, hours and data.
- Text contrast WCAG AA (check it), nothing under 11px, `text-wrap: pretty` on body copy.
- **The business's own photos may be used** (their Instagram, Facebook, Google listing, booking pages such as Fresha, or old website) **if they're good enough**. Otherwise use them for reference only (colours, signage, menu) and put the shot on my shot list.
  - **Good enough means:**
    - sharp and well lit, with no watermark, logo overlay or heavy filter;
    - at least 1600px on the long side for a large image, or 900px for a small card or thumbnail;
    - it shows the real place, product or work, and suits the site's look.
  - **People:** don't use photos where a customer's face is identifiable. Staff are fine only in shots the business published to promote itself.
  - **Light edits only:** crop, straighten, colour-balance and gentle sharpening are fine. Never alter what's shown, never upscale with AI or fill in missing parts, and never pass one off as CATALYZE's photography.
  - **Credit them:** on the site (for example "Photos: [Business]" in the footer) and in the video where a photo fills the frame.
  - **Keep them out of git**, like placeholder photos: gitignore the images and anything that embeds them (previews, captures, renders). Record each photo's source URL in the README.
  - **Flag it in the report:** these photos belong to the business (or its photographer), so they may ask for them to be taken down. Be ready to swap in my own shots.
- Google Street View clips may be used only with a visible on-screen credit ("Google Street View · <month year>"), never with Google's UI or watermark edited out to hide the source. Flag in the report that Google's terms must be checked before publishing, or that my own street clip should replace it.
- Placeholder photos I give you are private-comp only: gitignore them and anything that embeds them (cutouts, previews, captures, renders). Never commit them.

## 2. Stage 1: verify the business and research it, then CHECKPOINT 1

Using the details I paste at the end:
1. **Website status, verified fresh.** Check the obvious domains with RDAP (`rdap.nominet.uk` for .uk, `rdap.verisign.com` for .com), any website field on their booking pages (Fresha partner pages), web search, and load any live site in Chromium (Playwright). **Also ask me to check their Instagram/Facebook bio and link-in-bio (Linktree etc.) for a website**, because that's where a site often hides (Apex had one; you can't open Instagram from here). Write down exactly what's true now: no site / parked domain / broken / dated. **If they have a good working website, stop and tell me: they're not right for the series.** **The hook's first line must be literally true** (see section 5).
2. **Handles.** Only treat a handle as verified if the business links it itself (e.g. its Fresha page) or I confirm it. Never guess.
3. **Their real colours and type.** From reference photos (press articles, listings): sample the shopfront, signage and interior. Build a palette of 4 to 6 named colours "from the room", plus the nearest Google/Fontsource face to their signage lettering.
4. **Content.** Services, menu, hours, story, owners, location, nearest landmark/station. Cite sources. Prices only if published by the business.
5. Present: verified facts, palette swatches, type choice, the exact hook line you'll use, and the **written pitch** (section 3) with two or three signature-move options and two or three interactive wow feature options, each with a recommendation.

**CHECKPOINT 1:** wait for my approval of the facts and the pitch.

## 3. Stage 2: the pitch (part of checkpoint 1)

Pitch the website in plain words like Episode 01's "Day to Night":
- **Concept in two lines.** One idea specific to this business (Social 114 was "two places in one room, so the site runs on New Brighton time").
- **The signature move: new every episode.** Every episode's hero has ONE signature animation that tells the business's story in a single motion, and **it must be a fresh idea each time**. Do not reuse a previous episode's mechanic. Used so far (do not repeat):
  - Episode 01 Social 114: an object crossing left to right while spinning and changing state (flat white to pizza), page flipping day to night.
  - Scrapped Apex demo: a weight plate rolling across (also a cross-and-spin; don't use it).
  - Episode 02 The Salon Sanctuary: the name written on a steamed-up mirror (a reveal through a mask as the fog clears, plus lettering that draws itself), plus a herringbone wall laying itself tile by tile.
  Pick a different mechanic that fits the business, for example: a slow reveal through a mask or doorway, a stack building up layer by layer, a before/after wipe the visitor drags, a photo developing from negative, a timeline scrubbing through a day or a year, a split screen that slides, an object assembling from parts, a colour gradient pouring through the type. It must come from the business's real story or process and use **real things**: a cut-out photo set (placeholder until I shoot them) or a code-drawn object, never stock or AI imagery. It can be scroll-driven (series exception, the animated element only, text changes once) or click/arrival-driven. Pitch two or three options and recommend one. Add the one we use to the "used so far" list in this file when the episode is approved.
- **The interactive wow feature: one per site, and it's what sells it.** The signature move is how the site *looks*. This is something a customer would actually *use*, and it's the reason the owner would pay for the site. Every demo needs one, built properly, not mocked up. What's worked so far:
  - **Social 114 (café and restaurant): the site runs on their real hours.** A live clock and open/closed status in Europe/London time, today's row highlighted in the opening hours, "brunch until 15:00, pizza from 18:00", the whole site turning to night from 17:00, and the site switching between the day menu and the night menu to match what they're serving right now.
  - **The Salon Sanctuary (salon): "Find your colour".** Tap your hair colour now, then the shade you want. Those two swatches slide out of a colour ring with "Now" and "Goal" labels, and it suggests a starting service from their real menu with prices and a Book button. Each combination gives a different answer. On-site booking backs it up: service, stylist, day and time, details, then an appointment card.

  How to find this business's one:
  - **Start from the question their customers ask most.** What should I book? Are you open now? What's on tonight? How much will it cost? Will it suit me? Is there space today? The feature answers that question in one or two taps.
  - **Use their real data only:** menu, prices, hours, services, team. Anything that's advice (a suggestion, a recommendation, a price range) is labelled on the site as a starting point, marked `_placeholder` in `site.json` and listed in the README for the owner to approve. Never show fake availability. If times or stock are simulated for the concept, the site says so plainly.
  - **Ideas by type** (starting points, not a menu to copy):
    - **Barber or hair salon:** a style or colour finder, or the services available on the day you pick.
    - **Café or restaurant:** a live "serving now" menu, a countdown to close or to the next service, or "what's on tonight".
    - **Gym or studio:** a class finder by time and level.
    - **Florist:** a bouquet builder by occasion and budget, using their real price bands.
    - **Boutique:** an outfit builder or size guide from real stock.
    - **Aesthetics or tattoo:** a consultation and deposit flow that explains the steps first.
    - **Trades:** an instant price range from their published prices.
  - **How it must feel:** instant, phone-first, and keyboard and screen-reader accessible. It animates in answer to a tap, which the rules allow, and with reduced motion it still works, minus the movement.
  - **Pitch it alongside the signature move:** two or three feature ideas, with a recommendation. If the business's priority is obvious (for The Salon Sanctuary it was easy booking), the feature serves that priority.
- **Colours come from the business.** Base the palette on their real branding (signage, Instagram grid, menus, interior) as I or the references show it, not on a guess. If their brand is black with a green accent, the site is black with a green accent.
- **Sections.** Hero; the offer (menu/services, interactive where it helps); one "craft" section (Social 114's oven: a big typographic moment, e.g. a time, a year, a number that is true); one "community/story" section; "the street" with a fine-line architectural drawing of their shopfront that responds to the theme; visit (address, live "today" row in hours, maps link); footer with the concept disclosure.
- **Tone:** clean, sleek, mature. Type-led layout, hairline rules, lots of space. No cartoons.

## 4. Stage 3: build the website, then CHECKPOINT 2

Copy Episode 01's skeleton, not its look: `WEBSITES/EPISODE_0N/` with the same structure.
- Astro + Tailwind (same versions as Episode 01's `package.json`), static output.
- **All copy, hours, menu, links in `src/content/site.json`** (with `_placeholder` / `_source` notes). Images in `public/images`. Colours and fonts as CSS variables in one place (`src/styles/global.css`, light and dark token sets like `--day-*` / `--night-*`). One component per section in `src/components/`. Behaviour in `src/scripts/main.ts`.
- `<meta name="robots" content="noindex, nofollow">`, `public/robots.txt` disallow all, `public/_headers` X-Robots-Tag noindex.
- A thin top strip: "UNOFFICIAL CONCEPT BY CATALYZE" + one-line disclosure. Footer repeats it with "Website concept and build by CATALYZE, @catalyze.uk".
- Live clock and status for the business's real hours in its timezone (Europe/London), `?mode=` style override for recordings.
- Copy `scripts/single-file.py` and `scripts/cutout.py` from Episode 01 (cutout makes the transparent dish/object WebPs from my photos; it derives the matte from the photo, never a geometric mask).
- Responsive: flawless at 375, 768 and 1440. Reduced-motion: static, time-appropriate state.

**Quality bar before you show me anything:**
1. Run Impeccable's detector on the running page and fix until it reports **0 findings**: `.claude/skills/impeccable/scripts/impeccable detect --json http://127.0.0.1:4321/`.
2. Playwright check at 1440 and 390 in both themes and across the signature move (0, 0.3, 0.5, 0.7, 1 and back to 0): no console errors, `scrollWidth` equals the viewport, mode switches both ways.
3. Rule sweep over `src/` and the preview: no em/en dashes, glyph icons, banned words, purple, pill radii.
3b. Exercise the interactive wow feature in Playwright at 1440 and 390: at least three different inputs, each giving its correct, different answer from the real data, with any booking or link it leads to working. No console errors, and it works by keyboard.
4. Tag each version you show me: `ep0N-<slug>-v1`, `-v2`, ... (the video's "drafts" scene uses these real tags, so tag every meaningful iteration).
5. Publish the single-file preview as a **private** Artifact page and give me the link (local servers aren't reachable from my phone).

**CHECKPOINT 2:** iterate on my feedback until I approve the site.

## 5. Stage 4: the video, then CHECKPOINT 3

### 5.1 Set up the edit
Episodes 01 and 02 each have their own edit file (`Ep01.tsx` + `ep01.ts`, `Ep02.tsx` + `ep02.ts`); Episode 02 was started as a copy of Episode 01. Start this episode the same way: copy `Ep02.tsx` / `ep02.ts` to `Ep0N.tsx` / `ep0N.ts`, put every word, timing, colour and asset path in `ep0N.ts`, and register `Ep0N`, `Ep0NClean` and `Ep0NCover` in `Root.tsx`. Don't change the Episode 01 or 02 files. (If you'd rather extract a shared `src/series/` layer, ask me first, and prove both earlier episodes render unchanged by diffing frames before and after.)

### 5.2 Series format
1080×1920, 30fps, **about 30 to 35 seconds, paced to the narration** (Episode 01 is 31.5s, Episode 02 is 35s; stay under 40s). H.264 High, 12 Mb/s, yuv420p, +faststart, AAC 48kHz stereo (silent track until I add voice and music). Render both a **captioned** and a **clean** version.

**Write the voiceover first (5.4), then build the edit around it:** every line plays over the moment it describes. Scenes in order (Episode 02's timings as the guide):

| Approx. time | Scene | Contents |
| --- | --- | --- |
| 0 to 4s | **Hook** | Line 1 ("This [salon] in [place] didn't have a website, so I built them one."). Part A: a slow pan along their shopfront (my phone clip, a Street View recording with credit, or their shopfront drawing itself in fine line), gentle push-in, then a whip zoom through the sign. The headline is the first line itself, Instrument Serif about 112 to 120px cream, rising in from frame 0, with an orange dot + "[street], [area]" in Hanken Grotesk 600 34px. Part B: zoom-through into a **blurred plain scroll of their new site** (blur 14px, slight brightness lift) with **"so I built" / "them one."** (second line orange) at 150px. The hook line must be literally true. |
| 4 to 10s | **The business and the signature move** | Their name and street, said in the narration, over the site's signature move playing at real speed, timed so the move happens on the words that describe it (Episode 02: the name writes itself on the mirror as the line says so; Episode 01: the flat white spins into the pizza on "spins into a pizza"). Hold on the first frame (`Freeze`) until the line arrives if needed. |
| (optional, 3s) | **The build** | Only if the script mentions it ("It took me five drafts to get it right."): the real drafts from their git tags as browser cards (about 10 frames each, orange progress ticks, "Draft 0n" label), then "Colours from the room": six swatches with names and hex, on screen for at least 1.2s. |
| about 10 to 28s | **The interactive wow feature** | Its own beat (details below): "But this is my favourite bit..." then the narration walks the viewer through it, two or three inputs, each answer readable. |
| about 5s | **Grand reveal** | Head-on, no angles. Warm light blooms in; the front-view laptop (screen 904×565 + bezel + aluminium lip) rises in, the phone (280 to 310px wide) stands centred in front on the deck; one light sheen across both screens; slow push-in; both screens play `full-desktop.mp4` / `full-mobile.mp4` captured on **one shared timeline** so they scroll the whole site in sync. Narration like "Then you book it, right there on their site." or "Here it is." |
| about 2s | **Outro** | CATALYZE logo (`catalyze-logo-orange-cream.svg`, 640px) scaling 0.94 to 1; the closing question as the title in Instrument Serif orange ("Who's next?" or "Who should I build one for next?", matching the narration); small "Unofficial concept by CATALYZE · @catalyze.uk". Nothing else. |

Transitions: soft fades between scenes (4 to 6 frames), whip/zoom-through only inside the hook. Easing: out `bezier(0.16,1,0.3,1)`, in-out `bezier(0.65,0,0.35,1)`, whip `bezier(0.7,0,0.84,0)`.

**Look:** background `#12100e`, cream `#f1ebdd`, muted `#9a9286`, CATALYZE orange `#ff6e00` (accent only, never a wash), line `#2b2622`. Fonts: Instrument Serif (headlines), Hanken Grotesk 500/600 (labels, captions), DM Mono (code, hex), plus the business's display face for its name.

**Captions (burned in, captioned version only):** they follow the speech word for word, broken into chunks of 2 to 4 words that change with the voice (a long sentence becomes several chunks). Hanken Grotesk 600, 64px, white with a soft shadow, sentence case, 4-frame fade, one accent word per chunk in `#ff6e00`, left-aligned at x 96, y 1400; y 300 whenever a phone or laptop is on screen so they never cover the devices; clear of the bottom 20% and the right-hand app buttons. On a light scene (like a site capture), seat the caption on a soft dark fade so it stays readable. The hook's on-screen headline IS the hook's caption (don't double it). No caption on the outro question (the title says it).

**The interactive wow feature gets its own beat, and the viewer must not miss it.**
- Show it on a big phone held below the caption line.
- Show visible tap rings, added in the capture only, and push the camera in on each tap, then on the answer as it appears.
- Show two or three different inputs giving different answers, so it reads as interactive, not a slideshow. The Salon Sanctuary's beat: Dark brown to Golden blonde ("All the way blonde"), then Rose ("Rose tones"), then Golden blonde to Chestnut ("Go richer").
- Pace it to the narration, so each answer stays on screen long enough to read (over a second each).
- The narration talks the viewer through it ("this is my favourite bit…").
- Capture it with a copy of `scripts/capture-ep02.cjs` (see 5.3). Taps are scheduled at exact capture frames to land on the spoken words, and the camera zooms are keyframed in `ep0N.ts` (`finderCamera` in Episode 02 is the model): in on the inputs just before each tap, in on the answer as it appears.

### 5.3 Footage (real only)
- Captures: copy `VIDEO/EDITS/remotion/scripts/capture-ep02.cjs` to `capture-ep0N.cjs` and point it at `public/ep0N/` and the new site. It's frame-accurate: CSS animations slowed 10× via CDP, **and the page's JS clock (`performance.now`, `requestAnimationFrame`, timers) slowed too**, so canvas and script-driven animations also capture correctly; one screenshot per frame, fixed clock, capture-only tap rings. Shots: the signature move at real speed (`fromLoad` if it plays on load), the wow feature on a phone (390×844 @3) with taps paced to the narration, and `full-desktop` (1440×900 @1.25) / `full-mobile` (390×844 @2) on one shared timeline for the reveal. Force even frame sizes. Gitignore `public/ep0N`.
- Drafts (only if the build beat is used): build each `ep0N-*-vK` tag from git into scratch and screenshot it at 1440×900 @1.5 with the fixed clock. If later versions changed something below the hero, screenshot the part that changed, so each draft looks different.
- Hook street clip: if I give you a phone or Street View recording, measure the camera motion frame by frame and use the smoothest side-to-side pan; crop out phone UI; slow it from the 60fps source; keep the credit.
- Shopfront: my clip if I've sent one; otherwise their own shopfront photo if it's good enough (section 1), with a slow push-in and credit; otherwise the line drawing.
- No stock video, no AI footage, no map illustrations. If a shot can't be real, put it on my shot list.

### 5.4 Voiceover script (I make the audio myself)
Write it first and show me the draft text before building the edit. Write `VOICE/SCRIPTS/EPISODE_0N.md` in Episode 02's format: plain version, ElevenLabs version with `<break>` tags, timing table against the video, facts behind every line.

**Style: natural, like I'm talking to the viewer** while showing a mate something on my phone. Full sentences, not two-word fragments. Natural British, relaxed, warm, a bit pleased with it. Not an announcer. About 70 to 90 words.

Shape (Episode 02 as the model; adapt the words to the business, keep every claim true):
> "This [salon] in [place] didn't have a website, so I built them one. It's [Name], on [street]. When you open it, [the signature move, described simply]. But this is my favourite bit. If you're [the customer's situation], you just [the interaction, in plain words]. [Answer one.] Or [second input]? It changes. [Third input]? It changes again. Then you book it, right there on their site. Who's next?"

Episode 01's version, for a business whose feature is the signature move itself: "So this café in New Brighton didn't have a website. It's called Social 114, on Victoria Road, and they do coffee and brunch in the day, then wood-fired pizza at night. So I built them one. I wanted it to feel like being there, so as you scroll, your flat white spins into a pizza, and the whole site goes from morning to night. It took me five drafts to get it right. Here it is. Who should I build one for next?"

Spell out numbers that TTS mangles ("one-fourteen"). Captions must match the script word for word and its timing.

### 5.5 Also produce
- `CAPTIONS/EPISODE_0N.md`: Instagram, TikTok and Facebook post captions in Episode 01's format (first line tags the verified handle, "Unofficial concept by CATALYZE.", "Local businesses, who's next?", local hashtags; never imply they commissioned it). Table of handles with verification status.
- Cover still `Ep0NCover` (1080×1920, key text inside the centre 1080×1350).
- `DOCUMENTATION/SHOT_LISTS.md`: append this business's shots (storefront push-in 3 to 5s vertical, wide street establishing, 1 to 2 details, and the two top-down "signature" photos: straight down, centred, plain contrasting surface, window light).

### 5.6 QC before showing me (report the results)
Duration exactly the `TOTAL` in `ep0N.ts` (about 30 to 35s, under 40s); 1080×1920; 30fps; H.264 + AAC; `blackdetect` finds 0 segments; a 2fps contact sheet looks right; captions sit in the safe zone and never cover the devices; no em dashes anywhere on screen; credits present where required. Send the two MP4s, the cover and the VO script with SendUserFile.

**CHECKPOINT 3:** iterate on my notes (hook, pacing, the feature beat, zooms, reveal, captions) until I approve. Keep cut history in git.

## 6. Stage 5: finish (only when I say so)
When I send voice audio, music and photos: swap placeholder photos (re-run cutout), drop in my clips, sync captions to the audio word by word (character timings if the audio came from ElevenLabs), mix VO over music (music ducked under the voice, no clipping, around -14 LUFS integrated), re-render, re-run QC. Prepare PostZen **drafts only** (`isDraft: true`), Instagram and TikTok; Facebook isn't connected. Collab invites and posting need my explicit go-ahead.

## 7. Report style
Short, plain British English. Say what's verified and what isn't. Never claim something works or exists unless you checked it. Commit and push at each checkpoint (code and docs only; never placeholder media, captures or renders).

---

**BUSINESS DETAILS** (pasted from `EPISODE_OPTIONS.md`):


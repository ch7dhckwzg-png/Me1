# PROJECT STATE

Read this first when resuming. Last updated: 23 November 2026 (Episode 01 site built).

## Current position

- **Phase:** Section 06, **SECOND APPROVAL CHECKPOINT** for Episode 01 (website built, awaiting owner feedback).
- **Current episode:** 01, Social 114 (New Brighton). Owner picked it directly; episodes 02 to 05 not chosen yet.

## Done

- [x] Section 04 environment audit (`DOCUMENTATION/PRODUCTION_REPORT.md`)
- [x] Section 05 research: 25 candidates (`RESEARCH/business_research.md`), scored (`RESEARCH/scoring.md`), shortlist of 10 (`RESEARCH/business_shortlist.md` + published shortlist page)
- [x] Folder structure, brand files in `BRAND/`, `.env` gitignored

## Selected businesses and episode order

01. Social 114, 114 Victoria Road, New Brighton CH45 2JF. 02 to 05 to be chosen.

## Verified social handles

Only handles the business links itself (Fresha partner pages) are verified:

| Business | Instagram | TikTok | Facebook |
| --- | --- | --- | --- |
| Mode Beauty and Hair | @modebeautyandhairwirral | not sourced | page exists, URL not captured |
| HARE Colour & Extensions | @hare.colourandextensions | not sourced | not sourced |
| Social 114 | @social114_ (per La Vida 2022, unconfirmed) | not sourced | /GetSocial114 (per La Vida 2022, unconfirmed) |
| All other shortlisted | owner to confirm on phone | | |

## Websites and preview links

- Episode 01 Social 114: built in `WEBSITES/EPISODE_01/` (Astro + Tailwind). Private preview page: https://claude.ai/artifact/ELnnFbmVpNc2wrU3wMGpDo (v5). **Not yet approved.** No public deploy.



## Narrator

Not chosen. ElevenLabs key saved on the environment (proxy-injected). **Blocked: account is Free**; library voices and Voice Design need a paid plan via the API (and Free has no commercial licence). Owner to upgrade to Starter. Five young northern male voices shortlisted in `VOICE/AUDITIONS/SHORTLIST.md`.

## Outstanding decisions for the owner

1. Pick 5 businesses and their order.
2. Confirm unverified Instagram handles for the chosen five.
3. Tagline "ELEVATE. ILLUMINATE. ACTIVATE." conflicts with CLAUDE.md (bans "elevate"). Keep, change, or leave out of the series?
4. Voice provider and account (ElevenLabs recommended).
5. Facebook Page is not connected to PostZen; connect it if Facebook Reels drafts are wanted.
6. Consider rotating the PostZen key (it was shared in chat).

## Asset availability / shots to film

Nothing yet (shot lists come after the website stage).

## Revisions requested

None yet.

## Episode 01 video (draft, 23 Nov 2026)

- Edit: Remotion project `VIDEO/EDITS/remotion` (timings and captions in `src/ep01.ts`). v2 cut (owner: more movement, laptop camera move, big hook): 18.5s, 1080x1920, 30 fps, H.264 + AAC (silent). Hook opens on the cup spinning into the pizza, day to night; whip transitions; 3D laptop with a camera pull-back and swing right; 3D phone.
- Renders (local only, gitignored because they show the placeholder photos): `VIDEO/EDITS/remotion/out/ep01-social114-captioned-DRAFT.mp4`, `...-clean-DRAFT.mp4`, `...-cover-DRAFT.jpg`.
- Footage: frame-accurate captures of the live site (`scripts/capture-site.cjs`), real drafts v1 to v5 from git tags, real code. No storefront or street footage yet: typographic hook and the site's shopfront drawing stand in; set `footage.street` / `footage.storefront` in `src/ep01.ts` once filmed.
- Voice: owner generating TTS from `VOICE/SCRIPTS/EPISODE_01.md`. No music yet (needs a licensed track).
- Post captions: `CAPTIONS/EPISODE_01.md` (handles unconfirmed).
- To final: replace hero photos, add storefront/street clips, add VO + licensed music, retime captions to the VO, re-render, then platform exports and PostZen drafts (Facebook not connected).

## Episode 01 edit, cut 3 (owner's pick, 23 Nov 2026)

- Owner preferred cut 1 (17.5s) over cut 2; cut 3 = cut 1 with a new hook and "Liverpool × Wirral" removed from the outro. Cut 2's source kept in git history (commit 530a7f9).
- Hook: owner-supplied **Google Street View screen recording** of Victoria Road (UI cropped out, on-screen credit "Google Street View · Jul 2024"), punching in on the sign, then zooming through into the cup spinning into the pizza. **Before publishing:** confirm Google's Street View terms allow this promotional use, or replace with the owner's own street clip (`footage.street` in `src/ep01.ts`).
- VO script updated for cut 3 (`VOICE/SCRIPTS/EPISODE_01.md`).

## Episode 01 edit, cut 4 (23 Nov 2026)

- Hook line now "This café didn't have a website." Street View clip is now a slow-motion pan along the shopfront (source 0.4 to 1.65s at 60fps, played at 0.69x).
- Reveal: laptop and phone side by side, both scrolling the whole site in sync (new captures `full-desktop` / `full-mobile` on one shared timeline).

## Episode 01 edit, cut 5 (23 Nov 2026)

- First clip names "114 Victoria Road, New Brighton, Wirral". Hook line 2 is "So I built them one." over a blurred plain downward scroll of the real site (tease) instead of the cup/pizza spin.
- Ending is a head-on grand reveal: warm light bloom, laptop rises in facing camera, phone stands in front, one light sheen across both screens, slow push-in while both scroll the whole site in sync. The angled 3D laptop is gone.

## Episode 02: Apex (SCRAPPED, 23 Nov 2026)

- Owner scrapped Apex: they already have a website (Instagram @apex_wirral, "Apex Wirral | Kettlebell & Wellness Gyms", Ellesmere Port and Birkenhead, linktr.ee/ApexWirral). The concept build is kept only in git history (tag ep02-apex-v1); the EPISODE_02 folder is free for the next business.
- Lessons: before building, check the business's Instagram bio and link-in-bio for a website; and each episode needs its own new hero animation (no reusing the cross-and-spin move).

## Buyer ranking (23 Nov 2026)

- Owner wants businesses that will actually buy. Ranked in `RESEARCH/buyer_ranking.md` using Companies House checks: 1 The Salon Sanctuary, 2 Mode Beauty and Hair, 3 Golden Afternoon Floristry, 4 Goddess Hair & Skin Clinic, 5 Oxton Boutique, 6 Helen Seaton. Stollies dropped (old company in liquidation). Note: SOCIAL 114 LTD was dissolved in Jul 2024 (they trade under another entity now).

## Episode 02: The Salon Sanctuary (23 Nov 2026)

- Owner picked The Salon Sanctuary (61 Burlington Street, Liverpool L3 6LG). Brief: booking integrated into the site, easy booking first.
- Website status: the shop sign prints www.thesalonsanctuary.co.uk. RDAP: the .co.uk was registered 30 Jun 2026 on parking nameservers, and the .com was registered 8 May 2026 with GoDaddy DNS. Neither could be loaded from here (blocked by the network proxy). **Owner to open both on a phone and check the Instagram bio and link-in-bio** before the hook line is fixed. Proposed hook if true: "This salon put a website on its sign. It doesn't go anywhere."
- Site v1 built in `WEBSITES/EPISODE_02/` (tag ep02-salonsanctuary-v1):
  - Booking panel hands off to Fresha with the chosen service preselected.
  - Swatch-ring signature move.
  - Impeccable detector: 0 findings. Rule sweep clean. WCAG AA contrast checked.
  - Playwright checks at 1440 and 390: no errors, no horizontal scroll.
- **Not yet approved (checkpoint 2).**
- v2 (tag ep02-salonsanctuary-v2):
  - Owner asked for the name/logo first, not the "colour, blonding" line, and to combine ideas 5 (sign) and 6 (mirror).
  - Hero is now the sign lettering on a steamed salon mirror, fog clearing on load.
  - The colour headline and swatch ring moved to the second section; the swatch ring is arrival-driven, not scroll.
  - Detector 0, sweep clean, Playwright checks pass at 1440 and 390, reduced motion verified.

## Queued next: Aaron Jones Hairdressing (owner request, 23 Nov 2026)

- Owner wants an episode for Aaron Jones Hairdressing after The Salon Sanctuary.
- **Trigger:** when the owner says "this is complete now" about The Salon Sanctuary, remind them to tell Claude to start Aaron Jones Hairdressing.
- No research done yet. Follow `DOCUMENTATION/NEXT_EPISODE_PROMPT.md`:
  - verify there's no website (including the Instagram bio and link-in-bio);
  - take colours from their branding;
  - use a new signature move.
- v3 (tag ep02-salonsanctuary-v3), owner asked for wow factor:
  - The mirror reflects their room, with droplets on the fog.
  - Herringbone wall plus basin laying in on arrival.
  - New "Find your colour" section: shade now, then shade wanted, suggests real menu services. Suggestions need the salon's sign-off.
  - Appointment-card booking step.
  - Live shopfront (windows lit when open, "Closed" sign when shut).
  - Price row cascade and 48 count-up.
  - Detector 0, sweep clean, QA passes at 1440 and 390.
- v4 (tag ep02-salonsanctuary-v4), owner: "book fully on the site":
  - Booking is now entirely on the site: service, then stylist/day/time, then details, then done, with a calendar file.
  - Demo mode: sample times from opening hours, nothing sent, clearly labelled.
  - Launch path is Square Appointments via `server/square-booking.mjs` (written, not deployed or tested).
  - Fresha can't take on-site bookings: no public API, and its page can't be embedded. Going live means the salon moves its diary to Square and loses its Fresha profile. Raise this in the pitch.
- v5 (tag ep02-salonsanctuary-v5): owner picked the backwash station (option 1 of 6) to replace the basin graphic.
  - It builds once on arrival: cabinet, bowl tilt, chair recline, tap, drop.
  - It has its own trigger, so it plays when visible, while the tiles still start early.

## Episode 02 video (draft, 23 Nov 2026)

- **Edit:** Remotion `VIDEO/EDITS/remotion`, config `src/ep02.ts`, scenes `src/Ep02.tsx`. It is built on the Episode 01 template; the series layer hasn't been extracted yet.
- **Format:** 19.0s, 1080x1920, 30fps, H.264 12 Mb/s, silent AAC. The black-frame check finds 0 segments.
- **Structure:** hook (shopfront line drawing, then blurred site scroll), mirror opening, build (real finder code, five real versions, colours from the room), **Find your colour feature beat**, head-on reveal, outro.
- **Captures:** `scripts/capture-ep02.cjs`, which also slows the page's JS clock. Files are in `public/ep02` (gitignored, can be regenerated).
- **Renders:** local only in `out/`: `ep02-salonsanctuary-captioned-DRAFT.mp4`, `-clean-DRAFT.mp4`, `-cover-DRAFT.jpg`.
- **VO script:** `VOICE/SCRIPTS/EPISODE_02.md`. **Post captions:** `CAPTIONS/EPISODE_02.md`.
- **Before publishing:**
  - Owner checks the parked domains on a phone, because the hook depends on it.
  - Add VO and licensed music.
  - The owner's own storefront clip could replace the line drawing.

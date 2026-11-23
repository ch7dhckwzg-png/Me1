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

## Episode 02: Apex (Birkenhead and Ellesmere Port gyms), started 23 Nov 2026

- Owner asked for a demo directly. Owner-supplied facts only: name Apex, gym, Birkenhead and Ellesmere Port. No online presence found (no site, listings or socials). Everything else is labelled placeholder (see `WEBSITES/EPISODE_02/README.md`).
- Concept "Two gyms, one Apex": hero plate rolls across, rim BIRKENHEAD to ELLESMERE PORT, chalk to graphite theme; site switch; sample timetable per gym; memberships (prices to confirm); two gyms; demo join form.
- Private preview published as an Artifact. Tag ep02-apex-v1. **Not yet approved.**
- Needed from owner: Apex's Instagram/Facebook, addresses, hours, logo/colours, real timetable and membership details.

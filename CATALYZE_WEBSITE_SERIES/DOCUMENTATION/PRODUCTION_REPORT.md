# Production report

## Section 04: environment and integration audit (22 November 2026)

### Social (PostZen)

| Item | Status |
| --- | --- |
| API access | Working. The environment's proxy adds the key to requests to api.postzen.dev, so no key is stored in the repo or printed anywhere. |
| Instagram | Connected: @catalyze.uk ("CATALYZE \| DESIGN & MARKETING STUDIO") |
| TikTok | Connected: @catalyze.uk (business lane) |
| **Facebook** | **Not connected.** Needs connecting in PostZen before Facebook drafts can be made. |
| Drafts | Supported (`isDraft: true` on create post). TikTok also supports `uploadAsDraft` (lands in your TikTok inbox). |
| Instagram collab invites | Supported (`settings.collaborators`, up to 3 usernames, feed, reel and carousel). Only sent with your approval. |
| Instagram user tags | **Feed photos only.** Not supported on reels by Instagram's API, so on reels the business is tagged with an @mention in the caption (and optionally a collab invite). |
| First comment | Supported on Instagram reels. |
| TikTok AI label | `isAigc` flag exists. The narration will be AI-generated; whether to label is your call (TikTok requires it for realistic AI video; for AI voiceover it's advisable). |
| Analytics | Post analytics, timelines, daily metrics, best time to post, follower stats. |

### Development

| Item | Status |
| --- | --- |
| Node 22, npm, pnpm | Installed |
| Astro, Tailwind | Not installed yet; npm registry reachable, so installable per site |
| Browser automation | Chromium + Playwright installed and working (used in research) |
| Local preview | Works inside the container only. You can't open it from your device. |
| Cloudflare Pages / Wrangler | Wrangler not installed (installable). api.cloudflare.com is **blocked** by the network policy and there's no Cloudflare credential. Needed only when you approve a preview deploy. Netlify is already used for the main site and could host previews instead. |
| Screenshots and screen recording | Playwright screenshots and video recording (real browser, 1080x1920 capable) |

### AI voice

| Item | Status |
| --- | --- |
| ElevenLabs | **Not available yet.** api.elevenlabs.io blocked; no API key. Returns word-level timestamps (best fit for synced captions). |
| OpenAI TTS | **Not available yet.** api.openai.com blocked; no key. No word timestamps from TTS itself (would need forced alignment). |
| Local neural TTS | Possible via pip, but voice models download from Hugging Face (blocked), and quality is below ElevenLabs. |
| Forced alignment | Installable (e.g. faster-whisper via PyPI) but models are on Hugging Face (blocked). Not needed if ElevenLabs is used. |

**Decision for you at the voice stage:** do you have an ElevenLabs account (or want one)? If yes, I'll ask for the key through a secure form so it's never in chat or the repo.

### Video

| Item | Status |
| --- | --- |
| FFmpeg 6.1 | Installed (H.264/AAC, burn-in subtitles, grading LUTs) |
| Remotion | Already in the repo (`reel/`), with skills for captions and rendering |
| ImageMagick 6 | Installed |
| Hardware | 4 CPU, 15 GB RAM, no GPU: fine for 19-second 1080x1920 renders |

### Geographical media

| Item | Status |
| --- | --- |
| Map tiles / satellite | **Blocked** (OpenStreetMap, Esri, Mapbox, Google all unreachable). |
| Recommendation | Lead with your own filmed landmark shots (more real than any map). If you want an aerial "drop-in", the best licensed route is **Google Earth Studio** (free, you export it in your browser with the attribution Google requires) or a licensed aerial clip. I won't fake one. |

### Brand

| Item | Status |
| --- | --- |
| Logo | Found in `design/logo/` (not `./brand/`): orange outline with cream, white or ink letters, SVG + PNG. Copied to `BRAND/`, with your 2000 px master and the og card. |
| Colours | Near-black #12100e, ivory/cream #f1ebdd, Orange Slices #ff6e00 (sampled) |
| Fonts | Instrument Serif, Hanken Grotesk, Anton (from the site) |
| Brand guidelines | `CLAUDE.md` (owner rules) applies |

### Network changes made in this session (approved by you)

Added to the Me1 environment: fresha.com, treatwell.co.uk, booksy.com, instagram.com, facebook.com, tiktok.com, ratings.food.gov.uk, Companies House, Nominet and Verisign RDAP, and six candidate business domains (to inspect their sites).

### Security note

The `.env` you attached contains a live PostZen key and it is now in this chat. It isn't needed in the repo (the proxy authenticates PostZen), `.env` is now gitignored, and no copy was written. Consider rotating the key in PostZen.

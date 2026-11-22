# Launch checklist

The site does not go live until every box is ticked. Done items were verified on
21 November 2026; the unticked ones need you.

## Launch gates

- [ ] **Custom domain connected.** Needs you: buy the domain and connect it in your host
      (Netlify: Domain management > Add a domain. Vercel: Project > Settings > Domains.
      Cloudflare Pages: Custom domains). Turn on HTTPS (all three do it automatically).
      Then tell Claude the domain, so it can:
  - [ ] set `og:url` and a canonical link, and make `og:image` an absolute URL (link previews
        on most apps need the full address);
  - [ ] fill in `BUSINESS.host` in `src/legal.js`;
  - [ ] add `sitemap.xml` and a `Sitemap:` line in `public/robots.txt` (both need full URLs);
  - [ ] add Organization structured data (name, logo, email, URL) for search results.
- [x] **Favicon added:** `public/favicon.svg`, `favicon.ico` (16/32/48), `apple-touch-icon.png`,
      `icon-192.png`, `icon-512.png` and `site.webmanifest`, linked from every page (including the 404).
- [x] **No "Made with AI" tag:** none in the code, pages or build (`npm run check:rules` checks).
      Also make sure your host doesn't add a badge or banner of its own.
- [x] **Privacy policy page:** `/privacy.html`, linked in every footer.
- [x] **Terms and conditions page:** `/terms.html`, linked in every footer.
- [ ] **Legal details filled in.** Needs you: in `src/legal.js`, set `legalName`, `address`
      (and `companyNumber` if you're a limited company), and check `jurisdiction`
      (England and Wales by default). The pages read correctly without them, but they're
      more complete with them. If the site later adds a contact form, analytics, a
      newsletter or cookies, the privacy policy must be updated first.

## Pre-launch list (from the "20 things to add before launching" video)

Done: custom 404 page, call to action above the fold, internal links (each service links
to its examples), sticky mobile call to action (the floating menu), breadcrumbs (legal
pages), five FAQs, robots.txt, unique page titles, meta descriptions, social share image,
alt text on every image, privacy policy page.

Waiting on real information (never invented, see `CLAUDE.md`):

- [x] **Response time promise:** "within two working days", by the contact email and in the FAQ.
- [x] **Map and directions:** not needed. Catalyze works mobile (stated in the contact
      section and FAQ), so there's no address to show.
- [ ] **Analytics:** decided: cookie-free, so no consent banner. Switch it on in the host
      once deployed (Cloudflare Pages: Web Analytics, free, one toggle. Netlify: Analytics
      add-on, paid, no code). Then set `BUSINESS.analytics` in `src/legal.js` to its name,
      and the privacy policy updates itself.
- Not for now (owner's decision): reviews and case studies (no client work yet; add only
  real ones later), a photo of the owner (not wanted).
- [ ] **Thank-you page:** only applies once there's a contact form; today "Start a project"
      opens your email app, so there is no page to thank people on.

## Before launch, also

- [ ] **Real photos** in the photography section (see README, "Adding photos"). Until then it
      shows "Photo coming soon". Never stock or AI images presented as our work.
- [ ] **Check the copy is true for you:** process steps and FAQ answers in `src/content.js`
      (e.g. "a clear price in writing before anything starts").
- [ ] Try the site on your own phone and laptop (the 3D intro needs a real graphics chip
      to judge smoothness).

## Run before every deploy

```bash
npm run lint
npm run check:rules   # the owner's rules in CLAUDE.md
npm run build
```

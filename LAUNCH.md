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
  - [x] fill in `BUSINESS.host` in `src/legal.js` (done: Netlify, Inc.).
- [x] **Favicon added:** `public/favicon.svg`, `favicon.ico` (16/32/48), `apple-touch-icon.png`,
      `icon-192.png`, `icon-512.png` and `site.webmanifest`, linked from all three pages.
- [x] **No "Made with AI" tag:** none in the code, pages or build (`npm run check:rules` checks).
      Also make sure your host doesn't add a badge or banner of its own.
- [x] **Privacy policy page:** `/privacy.html`, linked in every footer.
- [x] **Terms and conditions page:** `/terms.html`, linked in every footer.
- [ ] **Legal details filled in.** Needs you: in `src/legal.js`, set `legalName`, `address`
      (and `companyNumber` if you're a limited company), and check `jurisdiction`
      (England and Wales by default). The pages read correctly without them, but they're
      more complete with them. If the site later adds a contact form, analytics, a
      newsletter or cookies, the privacy policy must be updated first.

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

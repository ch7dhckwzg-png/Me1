# Oak & Iron package demos

The four website-package demos linked from the Work section (Essentials, Business,
Signature, Signature + Booking). Live on the Cloudflare Worker `broad-art-97da`.

- `src/`: the demos as first deployed (one page each).
- `build.py`: builds `dist/`. Essentials stays one page; Business, Signature and
  Signature + Booking become a home page plus Services, Barbers, Gallery, FAQs and
  Find us pages, with a menu button on phones. It also fixes the Signature hero
  animation (clipper blade kept on the cut line, then it leaves instead of parking
  on the name).
- `dist/`: what gets uploaded.

```bash
python3 demos/oak-iron/build.py
npx wrangler deploy --name broad-art-97da --assets demos/oak-iron/dist --compatibility-date 2026-11-27
```

# Oak & Iron package demos

The four website-package demos linked from the Work section (Essentials, Business,
Signature, Signature + Booking). Served by the main site at `/demos/oak-iron/`
(`npm run build` copies `dist/` in). An older copy also lives on the Cloudflare Worker `broad-art-97da`.

- `src/`: the demos as first deployed (one page each).
- `build.py`: builds `dist/`. Essentials stays one page; Business, Signature and
  Signature + Booking become a home page plus Services, Barbers, Gallery, FAQs and
  Find us pages, with a menu button on phones. It also fixes the Signature hero
  animation (clipper blade kept on the cut line, then it leaves instead of parking
  on the name).
- `dist/`: what gets uploaded.

```bash
python3 demos/oak-iron/build.py   # rebuild the demos (needs: pip install fonttools)
npm run build                      # site + demos in dist/
```

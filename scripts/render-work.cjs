#!/usr/bin/env node
/*
 * Renders the concept work in design/work/*.html to WebP images in src/assets/work/.
 *
 *   node scripts/render-work.cjs            # everything
 *   node scripts/render-work.cjs norde      # only items whose name contains "norde"
 *
 * Needs Playwright with Chromium (npx playwright install chromium, or set CHROME_PATH) and the dev
 * dependencies (sharp, the @fontsource packages used by design/work/fonts.css).
 */
const path = require('node:path')
const fs = require('node:fs')
const { chromium } = require('playwright')
const sharp = require('sharp')

// Use a specific Chromium when one is given (or the cloud environment's pre-installed one);
// otherwise Playwright's own download.
const CHROME = process.env.CHROME_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined)

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'design/work')
const OUT = path.join(ROOT, 'src/assets/work')

// name, width, height, device scale, WebP quality
const ITEMS = [
  ['web-norde-desktop', 1440, 900, 1.25, 80],
  ['web-norde-phone', 390, 844, 2, 80],
  ['web-lumen-desktop', 1440, 900, 1.25, 80],
  ['web-lumen-phone', 390, 844, 2, 80],
  ['web-oak-desktop', 1440, 900, 1.25, 80],
  ['web-oak-phone', 390, 844, 2, 80],
  ['logo-norde', 1200, 900, 1, 86],
  ['logo-lumen', 1200, 900, 1, 86],
  ['logo-oak', 1200, 900, 1, 86],
  ['logo-ember', 1200, 900, 1, 86],
  ['menu-ember', 1240, 1754, 1, 82],
  ['menu-norde', 1240, 1754, 1, 82],
  ['menu-marlow', 1240, 1754, 1, 82],
  ['graphic-poster', 1240, 1754, 1, 82],
  ['graphic-social', 1800, 1000, 1, 82],
  ['graphic-packaging', 1600, 1000, 1, 82],
]

;(async () => {
  const filter = process.argv[2]
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {})
  for (const [name, width, height, scale, quality] of ITEMS) {
    if (filter && !name.includes(filter)) continue
    const file = path.join(SRC, `${name}.html`)
    if (!fs.existsSync(file)) {
      console.warn(`skip ${name}: no ${path.relative(ROOT, file)}`)
      continue
    }
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale })
    await page.goto(`file://${file}`)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(150)
    const png = await page.screenshot({ type: 'png' })
    const dest = path.join(OUT, `${name}.webp`)
    await sharp(png).webp({ quality, effort: 6 }).toFile(dest)
    console.log(`${name}.webp  ${(fs.statSync(dest).size / 1024).toFixed(0)} KB`)
    await page.close()
  }
  await browser.close()
})()

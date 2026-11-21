#!/usr/bin/env node
// Checks the site against the owner's rules in CLAUDE.md. Run: npm run check:rules
// Scans the site's own source, pages, concept-work designs and (if built) dist/.
// Exits 1 if anything is found, so it can gate a deploy.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, extname, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SCAN = ['src', 'design/work', 'index.html', 'privacy.html', 'terms.html', 'public', 'dist']
// Third-party component files are checked only for the rules that affect what renders.
const VENDOR = /src\/components\/ui\//
const TEXT = new Set(['.js', '.jsx', '.css', '.html', '.json', '.webmanifest', '.svg', '.txt'])

const RULES = [
  { id: 'em-dash', test: /—/, why: 'Em dash in visible copy' },
  { id: 'en-dash', test: /–/, why: 'En dash in visible copy (write "to")', skipVendor: true },
  { id: 'glyph-icon', test: /[☀-➿⭐✅←-⇿]|[\u{1F300}-\u{1FAFF}]/u, why: 'Emoji or Unicode glyph used as an icon (draw SVG)', skipVendor: true },
  { id: 'pill', test: /border-radius:\s*(9{2,}px|50vh|100px)\b|borderRadius\s*=\s*["']100px/, why: 'Pill-shaped control radius', skipVendor: true },
  { id: 'purple', test: /#(a97cf8|8b5cf6|7c3aed|a855f7|9333ea|c084fc|6d28d9)\b|\b(purple|violet|lavender)\b/i, why: 'Purple in the design' },
  { id: 'made-with', test: /made with ai|built with (ai|lovable|bolt|v0)|name=["']generator["']/i, why: '"Made with AI" style tag or generator meta' },
  { id: 'slop-copy', test: /\b(elevate|seamless(ly)?|unlock|unleash|game[- ]changer|cutting[- ]edge|supercharge|next[- ]level|world[- ]class|empower|synergy|state[- ]of[- ]the[- ]art)\b/i, why: 'Stock AI-sounding copy', skipVendor: true, onlyCopy: true },
  { id: 'scroll-scrub', test: /\bscrub\s*:/, why: 'Scroll-scrubbed animation', skipVendor: true },
  { id: 'cursor-motion', test: /addEventListener\(\s*['"](pointermove|mousemove)['"]/, why: 'Animation that follows the cursor', skipVendor: true },
  { id: 'fake-proof', test: /\b(testimonial|reviews?\s+from|trusted by \d|[\d,]+\+?\s+(happy\s+)?(clients|customers)|★★)/i, why: 'Possible fake review, metric or customer counter', skipVendor: true, onlyCopy: true },
]

// Files whose job is to *describe* the rules may name them.
const EXEMPT = new Set(['scripts/check-rules.mjs', 'CLAUDE.md', 'LAUNCH.md'])
// Copy rules look only at files that hold visible copy.
const COPY = /src\/(content|legal)\.js|src\/sections\/|src\/components\/(kinetic|motion|LegalPage|SiteFooter|SiteDock)|\.html$/

const files = []
const walk = (p) => {
  const abs = join(ROOT, p)
  if (!existsSync(abs)) return
  const st = statSync(abs)
  if (st.isDirectory()) {
    if (/node_modules|\.git/.test(abs)) return
    for (const f of readdirSync(abs)) walk(join(p, f))
  } else if (TEXT.has(extname(abs))) files.push(p)
}
SCAN.forEach(walk)

let problems = 0
for (const f of files) {
  if (EXEMPT.has(f)) continue
  // Built bundles are minified third-party code too; check them only for what ships as copy or chrome.
  const built = f.startsWith('dist/')
  const vendor = VENDOR.test(f) || (built && f.endsWith('.js'))
  const lines = readFileSync(join(ROOT, f), 'utf8').split('\n')
  for (const rule of RULES) {
    if (vendor && rule.skipVendor) continue
    if (rule.onlyCopy && !COPY.test(f)) continue
    // Built JS is minified libraries (e.g. colour-name lookup tables), so only the tag check applies.
    if (built && f.endsWith('.js') && rule.id !== 'made-with') continue
    if (built && !['made-with', 'purple', 'em-dash'].includes(rule.id)) continue
    lines.forEach((line, i) => {
      // A deliberate exception carries "rules-allow: <reason>" on the same line.
      if (line.includes('rules-allow:')) return
      // Comments may discuss a rule; code and copy may not break it.
      const code = line.replace(/\/\/.*$|\/\*.*?\*\/|^\s*\*.*$/g, '')
      if (rule.test.test(code)) {
        problems++
        console.log(`${rule.id.padEnd(13)} ${relative(ROOT, join(ROOT, f))}:${i + 1}  ${rule.why}\n              ${code.trim().slice(0, 140)}`)
      }
    })
  }
}

console.log(problems ? `\n${problems} rule problem(s) found.` : `Rule check passed (${files.length} files).`)
process.exit(problems ? 1 : 0)

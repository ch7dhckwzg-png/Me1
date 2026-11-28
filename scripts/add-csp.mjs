#!/usr/bin/env node
// Adds a Content-Security-Policy to dist/_headers after the build.
// Scripts may only come from this site, plus the exact inline scripts in the built
// pages (the Oak & Iron demos), allowed by their SHA-256 hash. The hashes are worked
// out from dist/ every build, so the policy always matches what ships.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'

const DIST = new URL('../dist/', import.meta.url).pathname
const html = []
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (p.endsWith('.html')) html.push(p)
  }
}
walk(DIST)

const hashes = new Set()
for (const f of html) {
  for (const m of readFileSync(f, 'utf8').matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    hashes.add(`'sha256-${createHash('sha256').update(m[1], 'utf8').digest('base64')}'`)
  }
}

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(' ')}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ')

const file = join(DIST, '_headers')
const headers = readFileSync(file, 'utf8')
if (!/^\/\*\n/m.test(headers)) throw new Error('No "/*" block in dist/_headers')
writeFileSync(file, headers.replace(/^\/\*\n/m, `/*\n  Content-Security-Policy: ${csp}\n`))
console.log(`Content-Security-Policy added (${hashes.size} inline script hashes from ${html.length} pages)`)

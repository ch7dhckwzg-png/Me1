#!/usr/bin/env node
// Copies the built Oak & Iron package demos into the site build, so they are served
// at /demos/oak-iron/ alongside the site. Rebuild them with: python3 demos/oak-iron/build.py
import { cpSync, existsSync } from 'node:fs'

const from = new URL('../demos/oak-iron/dist/', import.meta.url)
const to = new URL('../dist/demos/oak-iron/', import.meta.url)
if (!existsSync(from)) {
  console.error('demos/oak-iron/dist is missing: run python3 demos/oak-iron/build.py first')
  process.exit(1)
}
cpSync(from, to, { recursive: true })
console.log('Copied the Oak & Iron demos to dist/demos/oak-iron/')

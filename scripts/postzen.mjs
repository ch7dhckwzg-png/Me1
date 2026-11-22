#!/usr/bin/env node
/*
 * PostZen: draft, schedule or publish Catalyze's social posts from this project.
 * https://www.postzen.dev  (REST API, official SDK @postzen/node)
 *
 *   npm run postzen -- accounts
 *   npm run postzen -- draft    "Post text" --account <id> [--account <id> ...] [--media <url>]
 *   npm run postzen -- schedule "Post text" --account <id> --at 2026-12-01T09:30:00Z
 *   npm run postzen -- publish  "Post text" --account <id> --yes
 *
 * The API key is a secret. It is never in the website's code (anything there is public)
 * and never in git. The SDK reads POSTZEN_API_KEY from the environment:
 *   - on your computer: put it in a .env file (git-ignored; see .env.example), read below;
 *   - in this repo's Claude cloud environment it is a saved network secret, attached to
 *     requests to api.postzen.dev by the proxy, so the variable only needs a placeholder
 *     (see README, "PostZen").
 */
import { randomUUID } from 'node:crypto'
import PostZen from '@postzen/node'

const USAGE = `Usage:
  npm run postzen -- accounts
  npm run postzen -- draft    "text" --account <id> [--account <id>] [--media <url>]
  npm run postzen -- schedule "text" --account <id> --at <ISO time, UTC, e.g. 2026-12-01T09:30:00Z>
  npm run postzen -- publish  "text" --account <id> --yes`

function parse(argv) {
  const [command, ...rest] = argv
  const opts = { accounts: [], media: [], text: null, at: null, yes: false, id: null }
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]
    if (a === '--account') opts.accounts.push(rest[++i])
    else if (a === '--media') opts.media.push(rest[++i])
    else if (a === '--at') opts.at = rest[++i]
    else if (a === '--id') opts.id = rest[++i]
    else if (a === '--yes') opts.yes = true
    else if (opts.text === null) opts.text = a
    else fail(`Unexpected argument: ${a}`)
  }
  return { command, opts }
}

function fail(message) {
  console.error(`${message}\n\n${USAGE}`)
  process.exit(1)
}

function explain(err) {
  const status = err?.statusCode
  if (status === 401 || status === 403) {
    return 'PostZen refused the API key (unauthorised). Check that POSTZEN_API_KEY is a valid key from https://app.postzen.dev.'
  }
  if (err?.cause?.code === 'ENOTFOUND' || err?.cause?.code === 'ECONNREFUSED') {
    return `Could not reach api.postzen.dev (${err.cause.code}). Check your connection, or behind a proxy run with NODE_USE_ENV_PROXY=1.`
  }
  return err?.message || String(err)
}

async function main() {
  const { command, opts } = parse(process.argv.slice(2))
  if (!command || command === 'help' || command === '--help') {
    console.log(USAGE)
    return
  }
  try {
    process.loadEnvFile('.env') // optional; holds POSTZEN_API_KEY on your computer
  } catch {}
  if (!process.env.POSTZEN_API_KEY) {
    fail('POSTZEN_API_KEY is not set. Add it to a .env file (see .env.example), never to the code.')
  }

  if (command !== 'accounts') {
    if (!['draft', 'schedule', 'publish'].includes(command)) fail(`Unknown command: ${command}`)
    if (!opts.text) fail('Write the post text in quotes after the command.')
    if (!opts.accounts.length) fail('Choose at least one --account <id> (list them with: npm run postzen -- accounts).')
    if (command === 'schedule') {
      const when = new Date(opts.at ?? '')
      if (!opts.at || Number.isNaN(when.getTime())) fail('Give a time with --at, e.g. --at 2026-12-01T09:30:00Z (UTC).')
      if (when.getTime() < Date.now() + 60_000) fail('A scheduled time must be at least a minute in the future.')
    }
    if (command === 'publish' && !opts.yes) fail('This posts immediately to your real accounts. Add --yes to confirm.')
  }

  const postzen = new PostZen({ apiKey: process.env.POSTZEN_API_KEY })
  const { data } = await postzen.accounts.listAccounts({ query: {} })
  const accounts = data.accounts || []

  if (command === 'accounts') {
    if (!accounts.length) {
      console.log('No social accounts are connected yet. Connect them at https://app.postzen.dev, then run this again.')
      return
    }
    for (const a of accounts) console.log(`${a._id}  ${a.platform.padEnd(10)}  ${a.username ?? ''}`)
    return
  }

  // Each account's platform comes from PostZen itself, so it can never be mistyped.
  const platforms = opts.accounts.map((id) => {
    const account = accounts.find((a) => a._id === id)
    if (!account) fail(`No connected account has the id ${id}.`)
    return { platform: account.platform, accountId: id }
  })

  // Exactly one of isDraft, scheduledFor or publishNow, as the API requires.
  const body = { content: opts.text, platforms }
  if (opts.media.length) body.mediaItems = opts.media.map((url) => ({ url }))
  if (command === 'draft') body.isDraft = true
  if (command === 'schedule') body.scheduledFor = new Date(opts.at).toISOString()
  if (command === 'publish') body.publishNow = true

  // The same request id returns the original post instead of a duplicate, so a retried
  // command never double-posts. Pass --id to reuse one deliberately.
  const requestId = opts.id ?? randomUUID()
  const res = await postzen.posts.createPost({ body, headers: { 'x-request-id': requestId } })
  const post = res.data.post
  console.log(`${command === 'draft' ? 'Draft saved' : command === 'schedule' ? 'Scheduled' : 'Published'}: ${post._id} (${post.status})`)
  console.log(`Request id: ${requestId}`)
}

main().catch((err) => {
  console.error(explain(err))
  process.exit(1)
})

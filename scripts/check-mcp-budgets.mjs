#!/usr/bin/env node
/**
 * Asserts every MCP tool stays inside its response budget.
 *
 * The competitor matrix is ~33k tokens of prose. A tool that starts returning
 * it wholesale still "works" — it just silently blows out the context window of
 * every client that calls it. This is the regression worth catching.
 *
 * Usage: pnpm dev, then `node scripts/check-mcp-budgets.mjs [url]`
 */

const URL_BASE = process.argv[2] ?? 'http://localhost:3000'
const ENDPOINT = `${URL_BASE.replace(/\/$/, '')}/api/mcp`

// Rough but stable: ~4 characters per token. Precision is not the point;
// catching an order-of-magnitude regression is.
const estimate = (text) => Math.ceil(text.length / 4)

const CASES = [
  ['search_play', { query: 'stop builders copying credentials into prompts' }, 2_000],
  ['get_lifecycle', {}, 8_000],
  ['compare_vendors', {}, 4_000],
  ['compare_vendors', { detail: true, segment: 'Govern' }, 6_500],
  ['compare_vendors', { segment: 'Share', vendors: ['Vercel', 'Netlify'] }, 1_000],
  ['get_vendor_profile', { vendor: 'Netlify' }, 2_000],
  ['get_value_and_risk', {}, 8_000],
  ['get_value_and_risk', { phase: 'govern', include_docs: true }, 4_000],
  ['get_business_case_brief', {}, 8_000],
  ['get_references', {}, 8_000],
  ['build_customer_brief', { customer: 'Contoso', industry: 'retail', persona: 'CTO', incumbent: 'AWS' }, 8_000],
  ['answer_question', { question: 'can an app be shared with only one person' }, 8_000],
]

async function rpc(method, params) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const body = await response.text()
  const line = body.split('\n').find((l) => l.startsWith('data: '))
  return JSON.parse(line ? line.slice(6) : body)
}

let failures = 0

const listed = await rpc('tools/list', {})
const names = (listed.result?.tools ?? []).map((tool) => tool.name)
const untested = names.filter((name) => !CASES.some(([tool]) => tool === name))
if (untested.length > 0) {
  console.error(`✗ tools with no budget case: ${untested.join(', ')}`)
  failures += 1
}

for (const [tool, args, budget] of CASES) {
  const result = await rpc('tools/call', { name: tool, arguments: args })
  const payload = result.result
  if (!payload || payload.isError) {
    console.error(`✗ ${tool} errored: ${JSON.stringify(result).slice(0, 200)}`)
    failures += 1
    continue
  }
  const text = (payload.content ?? []).map((part) => part.text ?? '').join('')
  const tokens = estimate(text)
  const ok = tokens <= budget
  if (!ok) failures += 1
  const label = `${tool} ${JSON.stringify(args)}`.slice(0, 58)
  console.log(`${ok ? '✓' : '✗'} ${label.padEnd(60)} ${String(tokens).padStart(6)} / ${budget}`)
}

console.log(failures === 0 ? '\nAll tools within budget.' : `\n${failures} failure(s).`)
process.exit(failures === 0 ? 0 : 1)

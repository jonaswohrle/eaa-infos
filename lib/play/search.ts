import 'server-only'
import { getCorpus, type PlayCorpus } from '@/lib/play'

/**
 * Lexical search over the play corpus.
 *
 * The corpus is ~200KB, so a BM25-style in-memory index rebuilt once per cold
 * start is ample — no vector store, no embedding cost, and the ranking is
 * deterministic, which matters when an assistant cites what it finds. Titles
 * are weighted above bodies because questions in the matrix are phrased close
 * to how a prospect would ask them.
 */

export type SearchKind = 'capability' | 'comparison' | 'argument' | 'claim' | 'brief' | 'reference'

export type SearchRecord = {
  id: string
  kind: SearchKind
  title: string
  body: string
  /** Compact line shown in results; the caller drills down by id. */
  snippet: string
  href?: string
}

export type SearchHit = SearchRecord & { score: number }

const STOP = new Set([
  'the','a','an','and','or','of','to','in','for','on','with','is','are','was','were','be','been',
  'it','its','that','this','these','those','as','at','by','from','can','do','does','how','what',
  'we','you','they','our','their','not','no','yes','if','then','than','so','but','into','about',
])

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP.has(token))
}

function truncate(value: string, max = 180) {
  const clean = value.replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`
}

function buildRecords(corpus: PlayCorpus): SearchRecord[] {
  const records: SearchRecord[] = []

  for (const capability of corpus.capabilities) {
    records.push({
      id: capability.id,
      kind: 'capability',
      title: `${capability.product} — ${capability.value}`,
      body: capability.detail,
      snippet: truncate(capability.detail),
      href: capability.href,
    })
  }

  for (const comparison of corpus.comparisons) {
    const vercel = comparison.verdicts.find((v) => v.vendor === 'Vercel')
    records.push({
      id: comparison.id,
      kind: 'comparison',
      title: comparison.question,
      body: comparison.verdicts.map((v) => `${v.vendor} ${v.verdict} ${v.justification}`).join(' '),
      snippet: `${comparison.segment} · Vercel: ${vercel?.verdict ?? 'n/a'} · ${comparison.verdicts
        .filter((v) => v.vendor !== 'Vercel')
        .map((v) => `${v.vendor}: ${v.verdict}`)
        .join(', ')}`,
    })
  }

  for (const argument of corpus.argumentsList) {
    records.push({
      id: argument.id,
      kind: 'argument',
      title: argument.title,
      body: [argument.today, argument.problem, argument.impact, argument.withVercel, argument.measure].join(' '),
      snippet: truncate(argument.withVercel),
    })
  }

  for (const claim of corpus.claims) {
    records.push({
      id: `claim/${claim.phase}`,
      kind: 'claim',
      title: `${claim.label} — value and risk claims`,
      body: `${claim.value} ${claim.riskMitigated}`,
      snippet: truncate(claim.value),
    })
  }

  for (const section of corpus.brief.sections) {
    records.push({
      id: `brief/${section.id}`,
      kind: 'brief',
      title: `${section.eyebrow} — ${section.heading}`,
      body: section.paragraphs.flat().map((segment) => segment.text).join(' ') + ' ' + (section.callout ?? ''),
      snippet: truncate(section.heading),
    })
  }

  for (const reference of corpus.references) {
    records.push({
      id: reference.href,
      kind: 'reference',
      title: `${reference.label} — ${reference.context}`,
      body: reference.href,
      snippet: reference.href,
      href: reference.href,
    })
  }

  return records
}

type Index = {
  records: SearchRecord[]
  docFreq: Map<string, number>
  termFreq: Map<string, number>[]
  lengths: number[]
  avgLength: number
}

let indexCache: Promise<Index> | null = null

async function getIndex(): Promise<Index> {
  indexCache ??= (async () => {
    const records = buildRecords(await getCorpus())
    const docFreq = new Map<string, number>()
    const termFreq: Map<string, number>[] = []
    const lengths: number[] = []

    for (const record of records) {
      // Titles count three times: the matrix questions are phrased the way a
      // prospect would ask them, so a title match is a strong signal.
      const tokens = [
        ...tokenize(record.title),
        ...tokenize(record.title),
        ...tokenize(record.title),
        ...tokenize(record.body),
      ]
      const counts = new Map<string, number>()
      for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1)
      for (const token of counts.keys()) docFreq.set(token, (docFreq.get(token) ?? 0) + 1)
      termFreq.push(counts)
      lengths.push(tokens.length)
    }

    const avgLength = lengths.reduce((sum, n) => sum + n, 0) / Math.max(1, lengths.length)
    return { records, docFreq, termFreq, lengths, avgLength }
  })()
  return indexCache
}

export async function searchCorpus(
  query: string,
  { kinds, limit = 10 }: { kinds?: SearchKind[]; limit?: number } = {},
): Promise<SearchHit[]> {
  const index = await getIndex()
  const terms = tokenize(query)
  if (terms.length === 0) return []

  const k1 = 1.5
  const b = 0.75
  const total = index.records.length
  const hits: SearchHit[] = []

  for (let i = 0; i < total; i += 1) {
    const record = index.records[i]
    if (kinds && kinds.length > 0 && !kinds.includes(record.kind)) continue

    let score = 0
    for (const term of terms) {
      const tf = index.termFreq[i].get(term)
      if (!tf) continue
      const df = index.docFreq.get(term) ?? 0
      const idf = Math.log(1 + (total - df + 0.5) / (df + 0.5))
      const norm = tf * (k1 + 1) / (tf + k1 * (1 - b + b * (index.lengths[i] / index.avgLength)))
      score += idf * norm
    }
    if (score > 0) hits.push({ ...record, score: Number(score.toFixed(3)) })
  }

  return hits.sort((a, b2) => b2.score - a.score).slice(0, limit)
}

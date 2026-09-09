import 'server-only'
import { getCorpus } from '@/lib/play'
import { searchCorpus, type SearchKind } from '@/lib/play/search'

/**
 * Tool implementations. Every function returns plain data; the route wraps it
 * as MCP content.
 *
 * Response size is the governing constraint. The competitor matrix is ~33k
 * tokens in full, so nothing here returns it wholesale: verdicts come back as
 * one compact line per question and justifications/sources only when the
 * caller asks for specific capability ids.
 */

const MATRIX_DETAIL_CAP = 8

export async function searchPlay(args: { query: string; kinds?: SearchKind[]; limit?: number }) {
  const limit = Math.min(args.limit ?? 10, 25)
  const hits = await searchCorpus(args.query, { kinds: args.kinds, limit })
  return {
    query: args.query,
    count: hits.length,
    hits: hits.map((hit) => ({
      id: hit.id,
      kind: hit.kind,
      title: hit.title,
      snippet: hit.snippet,
      ...(hit.href ? { href: hit.href } : {}),
    })),
    next: 'Drill down with get_lifecycle, compare_vendors (detail: true), or get_value_and_risk using these ids.',
  }
}

export async function getLifecycle(args: { stage?: string }) {
  const corpus = await getCorpus()
  const stages = corpus.stages.filter(
    (stage) => !args.stage || stage.id === args.stage.toLowerCase() || stage.label.toLowerCase() === args.stage.toLowerCase(),
  )
  return {
    stages: stages.map((stage) => ({
      ...stage,
      capabilities: corpus.capabilities
        .filter((capability) => capability.stage === stage.id)
        .map(({ id, value, product, detail, href }) => ({ id, value, product, detail, href })),
    })),
  }
}

export async function compareVendors(args: {
  segment?: string
  vendors?: string[]
  verdict?: 'yes' | 'partial' | 'no'
  capability_ids?: string[]
  detail?: boolean
  limit?: number
}) {
  const corpus = await getCorpus()
  const wanted = args.vendors?.map((vendor) => vendor.toLowerCase())

  let rows = corpus.comparisons
  if (args.segment) rows = rows.filter((row) => row.segment.toLowerCase() === args.segment!.toLowerCase())
  if (args.capability_ids?.length) rows = rows.filter((row) => args.capability_ids!.includes(row.id))
  if (args.verdict) {
    rows = rows.filter((row) =>
      row.verdicts.some(
        (v) => v.verdict === args.verdict && (!wanted || wanted.includes(v.vendor.toLowerCase())),
      ),
    )
  }

  const detail = args.detail === true
  // Detail carries justifications and sources — roughly 700 tokens per row —
  // so it is capped hard regardless of what the caller asks for.
  const limit = detail ? Math.min(args.limit ?? MATRIX_DETAIL_CAP, MATRIX_DETAIL_CAP) : (args.limit ?? rows.length)
  const page = rows.slice(0, limit)

  // Group by segment so the segment label is not repeated on all 47 rows.
  const grouped = new Map<string, typeof page>()
  for (const row of page) {
    const bucket = grouped.get(row.segment) ?? []
    bucket.push(row)
    grouped.set(row.segment, bucket)
  }

  const shape = (row: (typeof page)[number]) => {
    const kept = row.verdicts.filter((v) => !wanted || wanted.includes(v.vendor.toLowerCase()))
    return {
      id: row.id,
      question: row.question,
      verdicts: detail
        ? kept.map((v) => ({
            vendor: v.vendor,
            verdict: v.verdict,
            justification: v.justification,
            sources: v.sources,
          }))
        : // Compact form: one map per row instead of six objects.
          Object.fromEntries(kept.map((v) => [v.vendor, v.verdict])),
    }
  }

  return {
    updated: corpus.updatedAt.competitors,
    vendors: corpus.vendors,
    total: rows.length,
    returned: page.length,
    truncated: page.length < rows.length,
    ...(page.length < rows.length
      ? {
          hint: detail
            ? `Detail is capped at ${MATRIX_DETAIL_CAP} rows. Narrow with capability_ids or segment.`
            : 'Narrow with segment, vendors or verdict to see the rest.',
        }
      : {}),
    segments: [...grouped.entries()].map(([segment, items]) => ({
      segment,
      capabilities: items.map(shape),
    })),
  }
}

export async function getVendorProfile(args: { vendor: string }) {
  const corpus = await getCorpus()
  const name = corpus.vendors.find((vendor) => vendor.toLowerCase() === args.vendor.toLowerCase())
  if (!name) return { error: `Unknown vendor. Known vendors: ${corpus.vendors.join(', ')}` }

  const bySegment = new Map<string, { yes: number; partial: number; no: number; gaps: string[] }>()
  for (const row of corpus.comparisons) {
    const verdict = row.verdicts.find((v) => v.vendor === name)
    if (!verdict) continue
    const bucket = bySegment.get(row.segment) ?? { yes: 0, partial: 0, no: 0, gaps: [] }
    bucket[verdict.verdict] += 1
    if (verdict.verdict === 'no') bucket.gaps.push(row.question)
    bySegment.set(row.segment, bucket)
  }

  const segments = [...bySegment.entries()].map(([segment, counts]) => ({
    segment,
    ...counts,
    coverage: Number(((counts.yes + 0.5 * counts.partial) / (counts.yes + counts.partial + counts.no)).toFixed(2)),
    gaps: counts.gaps.slice(0, 4),
  }))

  const totals = segments.reduce(
    (acc, s) => ({ yes: acc.yes + s.yes, partial: acc.partial + s.partial, no: acc.no + s.no }),
    { yes: 0, partial: 0, no: 0 },
  )

  return {
    vendor: name,
    totals,
    overallCoverage: Number(
      ((totals.yes + 0.5 * totals.partial) / (totals.yes + totals.partial + totals.no)).toFixed(2),
    ),
    segments,
    note: 'Use compare_vendors with detail:true and capability_ids for the rationale and sources behind any verdict.',
  }
}

export async function getValueAndRisk(args: {
  phase?: string
  lens?: string
  kind?: 'value' | 'risk'
  include_docs?: boolean
}) {
  const corpus = await getCorpus()
  let items = corpus.argumentsList
  if (args.phase) items = items.filter((item) => item.phase === args.phase!.toLowerCase())
  if (args.kind) items = items.filter((item) => item.kind === args.kind)
  if (args.lens) items = items.filter((item) => item.lenses.includes(args.lens!.toLowerCase()))

  const claims = corpus.claims.filter((claim) => !args.phase || claim.phase === args.phase!.toLowerCase())

  return {
    claims,
    count: items.length,
    arguments: items.map((item) => ({
      id: item.id,
      phase: item.phase,
      supports: item.kind,
      title: item.title,
      today: item.today,
      problem: item.problem,
      impact: item.impact,
      onVercel: item.withVercel,
      lenses: item.lenses,
      howToMeasure: item.measure,
      ...(args.include_docs ? { documentation: item.docs } : {}),
    })),
  }
}

export async function getBusinessCaseBrief() {
  const corpus = await getCorpus()
  const brief = corpus.brief
  return {
    updated: brief.updated_at,
    thesis: brief.thesis,
    methodology: brief.methodology.body,
    sections: brief.sections.map((section) => ({
      id: section.id,
      eyebrow: section.eyebrow,
      heading: section.heading,
      body: section.paragraphs.map((paragraph) => paragraph.map((s) => s.text).join('')),
      ...(section.callout ? { callout: section.callout } : {}),
    })),
    advantages: brief.advantages,
    outcomes: brief.outcomes,
  }
}

export async function getReferences(args: {
  kind?: 'product' | 'evidence' | 'source'
  query?: string
  limit?: number
}) {
  const corpus = await getCorpus()
  let refs = corpus.references
  if (args.kind) refs = refs.filter((reference) => reference.kind === args.kind)
  if (args.query) {
    const needle = args.query.toLowerCase()
    refs = refs.filter(
      (reference) =>
        reference.label.toLowerCase().includes(needle) ||
        reference.context.toLowerCase().includes(needle) ||
        reference.href.toLowerCase().includes(needle),
    )
  }
  const limit = Math.min(args.limit ?? 40, 120)
  return {
    total: refs.length,
    returned: Math.min(limit, refs.length),
    truncated: refs.length > limit,
    references: refs.slice(0, limit),
  }
}

/** Composer: assembles material for a business case, discovery call or email. */
export async function buildCustomerBrief(args: {
  customer: string
  industry?: string
  persona?: string
  incumbent?: string
  priorities?: string[]
}) {
  const corpus = await getCorpus()
  const focus = [args.industry, args.persona, ...(args.priorities ?? [])].filter(Boolean).join(' ')

  const relevant = focus
    ? await searchCorpus(focus, { kinds: ['argument', 'capability'], limit: 8 })
    : []
  const relevantIds = new Set(relevant.map((hit) => hit.id))
  const picked = corpus.argumentsList.filter((item) => relevantIds.has(item.id))
  const argumentsForBrief = (picked.length >= 4 ? picked : corpus.argumentsList.slice(0, 8)).slice(0, 8)

  const incumbent = args.incumbent
    ? await getVendorProfile({ vendor: args.incumbent }).catch(() => null)
    : null

  return {
    customer: args.customer,
    ...(args.industry ? { industry: args.industry } : {}),
    ...(args.persona ? { persona: args.persona } : {}),
    thesis: corpus.brief.thesis,
    claims: corpus.claims,
    advantages: corpus.brief.advantages,
    arguments: argumentsForBrief.map((item) => ({
      id: item.id,
      phase: item.phase,
      supports: item.kind,
      title: item.title,
      today: item.today,
      impact: item.impact,
      onVercel: item.withVercel,
      howToMeasure: item.measure,
      documentation: item.docs.slice(0, 2),
    })),
    ...(incumbent && !('error' in incumbent) ? { incumbent } : {}),
    guidance: [
      `Write for ${args.persona ?? 'a CTO or platform lead'} at ${args.customer}. Lead with the thesis, not the product.`,
      'Use the claims as the spine: each lifecycle stage makes one value claim and one risk claim.',
      'Support each claim with the arguments below — keep the today → problem → impact → on Vercel chain intact; it is what makes the case land.',
      'Do not invent numbers. Where a figure is needed, state the measurement basis from howToMeasure and let the customer supply their own inputs.',
      'Cite the documentation links rather than asserting capability.',
      args.incumbent
        ? `They run ${args.incumbent}. Use the incumbent coverage and gaps to frame what stays unsolved, not to attack the vendor.`
        : 'If an incumbent comes up, call get_vendor_profile before positioning against it.',
    ],
  }
}

/** Composer: assembles an evidence-backed answer to a prospect question. */
export async function answerQuestion(args: { question: string; audience?: string }) {
  const corpus = await getCorpus()
  // Search each kind separately. A single pooled ranking is dominated by the 47
  // comparison rows — they are the longest documents — which starved the
  // capability and argument slots that give an answer its substance.
  const [comparisonHits, argumentHits, capabilityHits] = await Promise.all([
    searchCorpus(args.question, { kinds: ['comparison'], limit: 4 }),
    searchCorpus(args.question, { kinds: ['argument'], limit: 4 }),
    searchCorpus(args.question, { kinds: ['capability'], limit: 5 }),
  ])

  const comparisonIds = new Set(comparisonHits.map((h) => h.id))
  const argumentIds = new Set(argumentHits.map((h) => h.id))
  const capabilityIds = new Set(capabilityHits.map((h) => h.id))

  const comparisons = corpus.comparisons.filter((row) => comparisonIds.has(row.id)).slice(0, 4)
  const argumentsFound = corpus.argumentsList.filter((item) => argumentIds.has(item.id)).slice(0, 4)
  const capabilities = corpus.capabilities.filter((item) => capabilityIds.has(item.id)).slice(0, 5)

  return {
    question: args.question,
    ...(args.audience ? { audience: args.audience } : {}),
    capabilities: capabilities.map(({ id, product, value, detail, href }) => ({ id, product, value, detail, href })),
    evidence: comparisons.map((row) => ({
      id: row.id,
      question: row.question,
      segment: row.segment,
      verdicts: row.verdicts.map((v) => ({
        vendor: v.vendor,
        verdict: v.verdict,
        justification: v.justification,
        sources: v.sources.slice(0, 2),
      })),
    })),
    arguments: argumentsFound.map((item) => ({
      id: item.id,
      title: item.title,
      onVercel: item.withVercel,
      documentation: item.docs.slice(0, 2),
    })),
    guidance: [
      'Answer the question directly first, then support it.',
      'Every capability claim should carry a link from capabilities.href or arguments.documentation.',
      'If the evidence shows Vercel as partial or no on something, say so plainly and describe the workaround — the matrix records it honestly and a discovered overstatement costs more than the gap.',
      'Where no evidence came back, say the answer is not covered here rather than improvising.',
    ],
  }
}

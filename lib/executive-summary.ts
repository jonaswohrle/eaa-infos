import type { CompetitorAnalysis } from '@/lib/types'

/* ------------------------------------------------------------------ */
/* Content document shape (content/executive-summary.json)             */
/* ------------------------------------------------------------------ */

export type ExecutiveSummaryContent = {
  updated_at: string
  hero: { eyebrow: string; title: string; description: string }
  whys: {
    key: string
    eyebrow: string
    title: string
    body: string
    link_label: string
    link_href: string
  }[]
  go_deeper: { title: string; description: string; href: string }[]
}

/* ------------------------------------------------------------------ */
/* Executive comparison: segment roll-ups from the competitor analysis  */
/* ------------------------------------------------------------------ */

export type ComparisonVerdict = 'covered' | 'partial' | 'gap'

export type ComparisonCell = {
  verdict: ComparisonVerdict
  yes: number
  partial: number
  no: number
  total: number
  score: number
  /** Set on the best-point-solution column: which vendor won the segment. */
  vendorName?: string
}

export type ComparisonRow = {
  segmentId: string
  label: string
  summary: string
  capabilityCount: number
  vercel: ComparisonCell
  internal: ComparisonCell
  bestPoint: ComparisonCell
}

export type ExecutiveComparison = {
  rows: ComparisonRow[]
  pointSolutionNames: string[]
  updatedAt: string
}

const INTERNAL_VENDOR_NAME = 'Internally built'

function toVerdict(score: number): ComparisonVerdict {
  if (score >= 0.85) return 'covered'
  if (score >= 0.5) return 'partial'
  return 'gap'
}

function scoreVendorSegment(
  analysis: CompetitorAnalysis,
  segmentId: string,
  vendorId: string,
): ComparisonCell | null {
  const segment = analysis.segments.find((s) => s.id === segmentId)
  if (!segment) return null

  let yes = 0
  let partial = 0
  let no = 0
  for (const capability of segment.capabilities) {
    const assessment = capability.assessments.find((a) => a.vendor_id === vendorId)
    if (!assessment) continue
    if (assessment.verdict === 'yes') yes += 1
    else if (assessment.verdict === 'partial') partial += 1
    else no += 1
  }

  const total = yes + partial + no
  if (total === 0) return null
  const score = (yes + 0.5 * partial) / total

  return { verdict: toVerdict(score), yes, partial, no, total, score }
}

export function buildExecutiveComparison(analysis: CompetitorAnalysis): ExecutiveComparison {
  const vercel = analysis.vendors.find((v) => v.name === 'Vercel')
  const internal = analysis.vendors.find((v) => v.name === INTERNAL_VENDOR_NAME)
  const pointSolutions = analysis.vendors.filter(
    (v) => v.name !== 'Vercel' && v.name !== INTERNAL_VENDOR_NAME,
  )

  const rows: ComparisonRow[] = []

  for (const segment of [...analysis.segments].sort((a, b) => a.position - b.position)) {
    if (segment.capabilities.length === 0) continue

    const vercelCell = vercel ? scoreVendorSegment(analysis, segment.id, vercel.id) : null
    const internalCell = internal ? scoreVendorSegment(analysis, segment.id, internal.id) : null

    let bestPoint: ComparisonCell | null = null
    for (const vendor of pointSolutions) {
      const cell = scoreVendorSegment(analysis, segment.id, vendor.id)
      if (!cell) continue
      if (!bestPoint || cell.score > bestPoint.score || (cell.score === bestPoint.score && cell.yes > bestPoint.yes)) {
        bestPoint = { ...cell, vendorName: vendor.name }
      }
    }

    if (!vercelCell || !internalCell || !bestPoint) continue

    rows.push({
      segmentId: segment.id,
      label: segment.label,
      summary: segment.summary,
      capabilityCount: segment.capabilities.length,
      vercel: vercelCell,
      internal: internalCell,
      bestPoint,
    })
  }

  return {
    rows,
    pointSolutionNames: pointSolutions.map((v) => v.name),
    updatedAt: analysis.updated_at,
  }
}

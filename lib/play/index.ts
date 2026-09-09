import 'server-only'
import { content } from '@/lib/content'
import { docLinksFor } from '@/lib/business-case-docs'
import { PRODUCT_LINKS } from '@/lib/product-links'
import { getBusinessCase, PHASE_LABELS, type Phase } from '@/lib/business-case'
import { getCapabilitiesLifecycle, getCompetitorAnalysis } from '@/lib/queries'
import type {
  BusinessCaseBrief,
  PlayArgument,
  PlayCapability,
  PlayClaim,
  PlayComparison,
  PlayReference,
} from '@/lib/play/types'

/**
 * The play corpus, normalised into flat records the MCP server can slice.
 *
 * Everything is derived from the same sources the website renders, so the two
 * cannot drift. Values are cached per process — the content is static per
 * deployment, and rebuilding the derived shapes on every tool call is wasted
 * work on a warm function.
 */

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

let cache: Promise<PlayCorpus> | null = null

export type PlayCorpus = {
  brief: BusinessCaseBrief
  capabilities: PlayCapability[]
  stages: { id: string; label: string; headline: string; summary: string }[]
  comparisons: PlayComparison[]
  vendors: string[]
  segments: string[]
  argumentsList: PlayArgument[]
  claims: PlayClaim[]
  references: PlayReference[]
  updatedAt: { competitors: string; brief: string }
}

export async function getBrief(): Promise<BusinessCaseBrief> {
  const document = await content.get<BusinessCaseBrief>('/business-case-brief')
  if (!document) throw new Error('Missing content document: /business-case-brief')
  return document.data
}

async function build(): Promise<PlayCorpus> {
  const [brief, lifecycle, analysis, businessCase] = await Promise.all([
    getBrief(),
    getCapabilitiesLifecycle(),
    getCompetitorAnalysis({ hideCloudflare: false, hideSinglePersonSharing: false }),
    getBusinessCase(),
  ])

  const capabilities: PlayCapability[] = lifecycle.stages.flatMap((stage) =>
    stage.capabilities.map((capability) => ({
      id: `${stage.id}/${slug(capability.product)}`,
      stage: stage.id,
      stageLabel: stage.label,
      value: capability.value,
      product: capability.product,
      detail: capability.detail,
      href: capability.href,
    })),
  )

  const stages = lifecycle.stages.map((stage) => ({
    id: stage.id,
    label: stage.label,
    headline: stage.headline,
    summary: stage.summary,
  }))

  const comparisons: PlayComparison[] = []
  const vendorNames = new Set<string>()
  for (const segment of analysis?.segments ?? []) {
    for (const capability of segment.capabilities) {
      const verdicts = capability.assessments.map((assessment) => {
        const vendor = analysis?.vendors.find((v) => v.id === assessment.vendor_id)
        if (vendor) vendorNames.add(vendor.name)
        return {
          vendor: vendor?.name ?? assessment.vendor_id,
          verdict: assessment.verdict,
          justification: assessment.justification,
          sources: (assessment.sources ?? []).map((source) => source.url),
        }
      })
      comparisons.push({
        id: `${segment.id}/${slug(capability.title)}`,
        question: capability.title,
        segment: segment.label,
        verdicts,
      })
    }
  }

  const argumentsList: PlayArgument[] = businessCase.items.map((item) => ({
    id: item.id,
    phase: item.phase,
    kind: item.supportKind,
    title: item.title,
    today: item.today,
    problem: item.problem,
    impact: item.impact,
    withVercel: item.withVercel,
    lenses: [...item.lenses],
    measure: item.quantBasis,
    status: item.status,
    docs: docLinksFor(item.title),
  }))

  const claims: PlayClaim[] = businessCase.phaseSummaries.map((summary) => ({
    phase: summary.phase,
    label: PHASE_LABELS[summary.phase as Phase] ?? summary.phase,
    value: summary.value,
    riskMitigated: summary.riskMitigated,
  }))

  const references: PlayReference[] = []
  const seen = new Set<string>()
  const push = (reference: PlayReference) => {
    const key = `${reference.href}|${reference.context}`
    if (seen.has(key)) return
    seen.add(key)
    references.push(reference)
  }
  for (const link of PRODUCT_LINKS) {
    push({ label: link.aliases[0], href: link.url, kind: 'product', context: 'Vercel product' })
  }
  for (const argument of argumentsList) {
    for (const doc of argument.docs) {
      push({ label: doc.label, href: doc.href, kind: 'evidence', context: argument.title })
    }
  }
  for (const comparison of comparisons) {
    for (const verdict of comparison.verdicts) {
      for (const source of verdict.sources) {
        push({
          label: new URL(source).hostname.replace(/^www\./, ''),
          href: source,
          kind: 'source',
          context: `${verdict.vendor} — ${comparison.question}`,
        })
      }
    }
  }

  return {
    brief,
    capabilities,
    stages,
    comparisons,
    vendors: [...vendorNames],
    segments: stages.map((stage) => stage.label),
    argumentsList,
    claims,
    references,
    updatedAt: { competitors: analysis?.updated_at ?? 'unknown', brief: brief.updated_at },
  }
}

export function getCorpus(): Promise<PlayCorpus> {
  cache ??= build()
  return cache
}

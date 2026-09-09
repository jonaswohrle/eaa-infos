import 'server-only'
import { content } from '@/lib/content'
import { buildCompetitorAnalysis } from '@/lib/competitor-analysis'
import type { ExecutiveSummaryContent } from '@/lib/executive-summary'
import type {
  Capability,
  CompetitorAnalysis,
  CompetitorAnalysisSourceDocument,
  ContentBlock,
  DemoEnvItem,
  PocStep,
  SecurityItem,
} from '@/lib/types'

type ContentCollection<T> = {
  items: T[]
}

const SINGLE_PERSON_SHARING_CAPABILITY =
  'can a builder share an app with exactly one person — e.g. only their manager — without creating a team or filing a ticket?'

async function getContentItems<T>(path: string): Promise<T[]> {
  const document = await content.get<ContentCollection<T>>(path)
  if (!document || !Array.isArray(document.data.items)) {
    throw new Error(`Missing or invalid filesystem content document: ${path}`)
  }
  return document.data.items
}

export async function getSteps(): Promise<PocStep[]> {
  return getContentItems<PocStep>('/poc-steps')
}

export async function getStepsByTrack(track: string): Promise<PocStep[]> {
  const steps = await getSteps()
  return steps.filter((step) => step.track === track)
}

export async function getStepByKey(stepKey: string): Promise<PocStep | null> {
  const steps = await getSteps()
  return steps.find((step) => step.step_key === stepKey) ?? null
}

export async function getDemoEnv(): Promise<DemoEnvItem[]> {
  return getContentItems<DemoEnvItem>('/demo-environment')
}

export async function getCapabilities(): Promise<Capability[]> {
  return getContentItems<Capability>('/capabilities')
}

export type CapabilityLifecycleItem = {
  value: string
  product: string
  detail: string
  href: string
  linkLabel: string
}

export type CapabilityLifecycleStage = {
  id: string
  label: string
  headline: string
  summary: string
  capabilities: CapabilityLifecycleItem[]
}

export type CapabilitiesLifecycleContent = {
  intro: { eyebrow: string; title: string; lead: string }
  stages: CapabilityLifecycleStage[]
  flow: { eyebrow: string; title: string; lead: string }
  closing: { text: string; href: string; linkLabel: string }
}

export async function getCapabilitiesLifecycle(): Promise<CapabilitiesLifecycleContent> {
  const document = await content.get<CapabilitiesLifecycleContent>('/capabilities-lifecycle')
  if (!document || !Array.isArray(document.data.stages)) {
    throw new Error('Missing or invalid filesystem content document: /capabilities-lifecycle')
  }
  return document.data
}

export async function getCompetitorAnalysis({
  hideCloudflare,
  hideSinglePersonSharing,
}: {
  hideCloudflare: boolean
  hideSinglePersonSharing: boolean
}): Promise<CompetitorAnalysis | null> {
  const document = await content.get<CompetitorAnalysisSourceDocument>('/competitor-analysis')
  if (!document || !Array.isArray(document.data.items)) {
    throw new Error('Missing or invalid filesystem content document: /competitor-analysis')
  }

  return buildCompetitorAnalysis({
    rows: document.data.items,
    updatedAt: document.data.updated_at,
    hiddenVendorNames: new Set(hideCloudflare ? ['Cloudflare'] : []),
    hiddenCapabilityTitles: new Set(hideSinglePersonSharing ? [SINGLE_PERSON_SHARING_CAPABILITY] : []),
  })
}

export async function getSecurityItems(): Promise<SecurityItem[]> {
  return getContentItems<SecurityItem>('/security-items')
}

export async function getContentBlock(key: string): Promise<ContentBlock | null> {
  const blocks = await getContentItems<ContentBlock>('/content-blocks')
  return blocks.find((block) => block.block_key === key) ?? null
}

export async function getExecutiveSummaryContent(): Promise<ExecutiveSummaryContent> {
  const document = await content.get<ExecutiveSummaryContent>('/executive-summary')
  if (!document) {
    throw new Error('Missing or invalid filesystem content document: /executive-summary')
  }
  return document.data
}

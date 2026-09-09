import 'server-only'
import { content } from '@/lib/content'
import { buildCompetitorAnalysis } from '@/lib/competitor-analysis'
import type { BusinessCaseContent } from '@/lib/business-case'
import type { ExecutiveSummaryContent } from '@/lib/executive-summary'
import type {
  CompetitorAnalysis,
  CompetitorAnalysisSourceDocument,
  PocStep,
  PocUser,
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

export async function getStepByKey(stepKey: string): Promise<PocStep | null> {
  const steps = await getSteps()
  return steps.find((step) => step.step_key === stepKey) ?? null
}

export async function getPocUsers(): Promise<PocUser[]> {
  return getContentItems<PocUser>('/poc-users')
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

export async function getExecutiveSummaryContent(): Promise<ExecutiveSummaryContent> {
  const document = await content.get<ExecutiveSummaryContent>('/executive-summary')
  if (!document) {
    throw new Error('Missing or invalid filesystem content document: /executive-summary')
  }
  return document.data
}

export async function getBusinessCase(): Promise<BusinessCaseContent> {
  const document = await content.get<BusinessCaseContent>('/business-case')
  if (!document || !Array.isArray(document.data.phases)) {
    throw new Error('Missing or invalid filesystem content document: /business-case')
  }
  return document.data
}

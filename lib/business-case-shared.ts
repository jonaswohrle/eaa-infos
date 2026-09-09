// Client-safe types, constants and labels for the business case.
// No server-only imports here so this can be used from client components.

export const PHASES = ['build', 'share', 'deploy', 'authenticate', 'govern', 'maintain'] as const
export type Phase = (typeof PHASES)[number]

export const PHASE_LABELS: Record<Phase, string> = {
  build: 'Build',
  share: 'Share',
  deploy: 'Deploy',
  authenticate: 'Authenticate',
  govern: 'Govern',
  maintain: 'Maintain',
}

export const LENSES = ['risk', 'cost', 'value', 'ai'] as const
export type Lens = (typeof LENSES)[number]

export const LENS_LABELS: Record<Lens, string> = {
  risk: 'Risk',
  cost: 'Cost',
  value: 'Value',
  ai: 'AI',
}

export const LENS_LABELS_LONG: Record<Lens, string> = {
  risk: 'Risk & Control',
  cost: 'Cost Reduction',
  value: 'Value Creation',
  ai: 'AI Transformation',
}

export const STATUSES = ['proposed', 'discuss', 'validated', 'rejected'] as const
export type Status = (typeof STATUSES)[number]
export type SupportKind = 'value' | 'risk'

export const STATUS_LABELS: Record<Status, string> = {
  proposed: 'Proposed',
  discuss: 'Discuss',
  validated: 'Validated',
  rejected: 'Rejected',
}

// Every argument follows the same causal chain:
// today → problem → impact (where it ends) → withVercel (the resolved scenario).
export type BusinessCaseItem = {
  id: string
  phase: Phase
  /** The mechanism that supports the selected phase claim. This is what the row leads with. */
  title: string
  /** The single summary claim this evidence supports. */
  supportKind: SupportKind
  /** What happens today — the status quo, factually. */
  today: string
  /** Why the status quo breaks — the structural problem. */
  problem: string
  /** Where it ends — the consequence chain: incident → legal/compliance → damage. */
  impact: string
  /** The with-Vercel scenario: how the same situation plays out on the platform. */
  withVercel: string
  lenses: Lens[]
  quantAmount: number | null
  quantUnit: string
  quantBasis: string
  status: Status
  position: number
}

export type BusinessCaseSettings = {
  builders: number
  costPerBuilder: number // € per builder per month
}

export type BusinessCasePhaseSummary = {
  phase: Phase
  value: string
  riskMitigated: string
}

export type BusinessCaseData = {
  items: BusinessCaseItem[]
  phaseSummaries: BusinessCasePhaseSummary[]
  settings: BusinessCaseSettings
}

export type BusinessCaseItemPatch = Partial<Omit<BusinessCaseItem, 'id'>>

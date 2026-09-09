// Read-only business case model. The content lives in content/business-case.json
// and is served through comark-content like every other section — there is no
// database write path, so a shared link can never be mutated by a reader.

export const PHASES = ['build', 'share', 'deploy', 'authenticate', 'govern', 'maintain'] as const
export type Phase = (typeof PHASES)[number]

export const LENSES = ['risk', 'cost', 'value', 'ai'] as const
export type Lens = (typeof LENSES)[number]

export type Status = 'proposed' | 'discuss' | 'validated' | 'rejected'
export type SupportKind = 'value' | 'risk'

/** Every argument follows the same causal chain: today → problem → impact → withVercel. */
export type BusinessCaseItem = {
  id: string
  title: string
  supportKind: SupportKind
  today: string
  problem: string
  impact: string
  withVercel: string
  lenses: Lens[]
  quantBasis: string
  status: Status
}

export type BusinessCasePhase = {
  phase: Phase
  label: string
  value: string
  riskMitigated: string
  items: BusinessCaseItem[]
}

export type BusinessCaseContent = {
  updated_at: string
  hero: { eyebrow: string; title: string; lead: string }
  audience: { title: string; body: string }
  structure: { title: string; body: string }
  lenses: { key: Lens; label: string; long: string }[]
  statusLabels: Record<Status, string>
  phases: BusinessCasePhase[]
}

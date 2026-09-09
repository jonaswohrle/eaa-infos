export type Track = 'technical' | 'procurement'
export type StepStatus = 'not_started' | 'in_progress' | 'blocked' | 'done'

export type PocStep = {
  id: string
  track: Track
  step_key: string
  title: string
  summary: string
  status: StepStatus
  detail: string
  position: number
}

export type PocUser = {
  id: string
  name: string
  email: string
  role: string
  team: string
  status: string
  notes: string
  position: number
}

export type CompetitorVerdict = 'yes' | 'partial' | 'no'

export type CompetitorAnalysisSourceAssessment = {
  answer: string
  justification: string
  sources: string[]
  needs_review: boolean
}

export type CompetitorAnalysisSourceRow = {
  question: string
  priority: string | number | null
  segment: string
  vendors: Record<string, CompetitorAnalysisSourceAssessment>
}

export type CompetitorAnalysisSourceDocument = {
  updated_at: string
  items: CompetitorAnalysisSourceRow[]
}

export type CompetitorSource = {
  title: string
  url: string
}

export type CompetitorAssessment = {
  vendor_id: string
  verdict: CompetitorVerdict
  justification: string
  sources: CompetitorSource[]
}

export type CompetitorCapability = {
  id: string
  title: string
  position: number
  assessments: CompetitorAssessment[]
}

export type CompetitorSegment = {
  id: string
  label: string
  summary: string
  position: number
  capabilities: CompetitorCapability[]
}

export type CompetitorVendor = {
  id: string
  name: string
  descriptor: string
  position: number
  featured: boolean
}

export type CompetitorAnalysis = {
  id: string
  eyebrow: string
  title: string
  description: string
  thesis: string
  methodology: string
  updated_at: string
  vendors: CompetitorVendor[]
  segments: CompetitorSegment[]
}

export const STATUS_LABELS: Record<StepStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  blocked: 'Blocked',
  done: 'Done',
}

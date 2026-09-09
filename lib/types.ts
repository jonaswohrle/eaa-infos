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

export type DemoEnvDetail = {
  id: string
  item_id: string
  label: string
  value: string
  notes: string
  position: number
}

export type DemoEnvItem = {
  id: string
  label: string
  value: string
  url: string | null
  status: string
  notes: string
  position: number
  details: DemoEnvDetail[]
}

export type Coverage = 'native' | 'configurable' | 'discuss'

export type PocStatus = 'not_started' | 'in_progress' | 'met'

export type RequirementVideo = {
  id: string
  requirement_id: string
  title: string
  url: string
  position: number
}

export type Requirement = {
  id: string
  category: string
  name: string
  need: string
  coverage: Coverage
  vercel_answer: string
  suggestion: string
  description: string
  poc_scope: string
  owner: string
  result: string
  scored: boolean
  poc_status: PocStatus
  position: number
  videos: RequirementVideo[]
}

export const POC_STATUS_LABELS: Record<PocStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  met: 'Met',
}

export type Capability = {
  id: string
  name: string
  group_name: string
  friction: string
  functionality: string
  outcome: string
  roles: string
  position: number
}

export type RecordingItem = {
  id: string
  title: string
  description: string
  url: string | null
  recorded_at: string | null
  duration: string
  position: number
}

export type AnswerVideo = {
  title: string
  description: string
  videoUrl: string
  videoPathname: string
  contentType?: string
  uploadedAt: string
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

export type DocType = 'order_form' | 'msa' | 'dpa' | string

export type DocumentChange = {
  id: string
  version_id: string
  section: string
  change_type: string
  description: string
  position: number
}

export type DocumentVersion = {
  id: string
  document_id: string
  version_label: string
  version_date: string | null
  whats_new: string
  status: string
  file_url: string | null
  file_name: string | null
  position: number
  created_at: string
  changes: DocumentChange[]
}

export type DocumentRecord = {
  id: string
  doc_type: DocType
  name: string
  description: string
  status: string
  position: number
  versions: DocumentVersion[]
}

export type PricingBand = {
  id: string
  band_key: string
  label: string
  max_seats: number | null
  platform_fee: number | null
  per_seat_monthly: number | null
  list_equivalent: number | null
  support_standard_pct: number
  is_custom: boolean
  discount_pct: number
  position: number
}

export type SavedOffer = {
  id: string
  name: string
  snapshot: Record<string, unknown>
  total: number
  notes: string
  created_at: string
}

export type SecurityItem = {
  id: string
  category: string
  title: string
  description: string
  link: string | null
  position: number
}

export type ContentBlock = {
  block_key: string
  title: string
  body: string
  status: string
  updated_at: string
}

export const STATUS_LABELS: Record<StepStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  blocked: 'Blocked',
  done: 'Done',
}

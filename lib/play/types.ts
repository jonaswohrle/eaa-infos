/**
 * Plain data shapes shared by the website and the MCP server. No React, no
 * server-only imports — anything here can be used from either side.
 */

export type BriefSegment = { text: string; bold?: boolean }

export type BriefSection = {
  id: string
  eyebrow: string
  heading: string
  pageBreak?: boolean
  paragraphs: BriefSegment[][]
  callout?: string
}

export type BusinessCaseBrief = {
  updated_at: string
  toolbarNote: string
  thesis: string
  methodology: { heading: string; body: string }
  sections: BriefSection[]
  advantages: { advantage: string; value: string; risk: string; fact: string }[]
  outcomes: { id: string; heading: string; body: string }[]
  further: { heading: string; links: { label: string; href: string; description: string }[] }
}

/** A single Vercel capability in the lifecycle model. */
export type PlayCapability = {
  id: string
  stage: string
  stageLabel: string
  value: string
  product: string
  detail: string
  href: string
}

/** One assessed question, with every vendor's verdict. */
export type PlayComparison = {
  id: string
  question: string
  segment: string
  verdicts: {
    vendor: string
    verdict: 'yes' | 'partial' | 'no'
    justification: string
    sources: string[]
  }[]
}

/** One argument from the value-and-risk worksheet. */
export type PlayArgument = {
  id: string
  phase: string
  kind: 'value' | 'risk'
  title: string
  today: string
  problem: string
  impact: string
  withVercel: string
  lenses: string[]
  measure: string
  status: string
  docs: { label: string; href: string; proves: string }[]
}

/** The two claims a lifecycle stage makes. */
export type PlayClaim = {
  phase: string
  label: string
  value: string
  riskMitigated: string
}

export type PlayReference = {
  label: string
  href: string
  kind: 'product' | 'evidence' | 'source'
  context: string
}

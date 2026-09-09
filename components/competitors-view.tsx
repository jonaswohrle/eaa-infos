'use client'

import { useState } from 'react'
import { ChevronDown, Construction, ExternalLink, Layers3 } from 'lucide-react'
import type {
  CompetitorAnalysis,
  CompetitorAssessment,
  CompetitorCapability,
  CompetitorSegment,
  CompetitorVendor,
  CompetitorVerdict,
} from '@/lib/types'

const VERDICT_META: Record<CompetitorVerdict, { label: string; classes: string }> = {
  yes: {
    label: 'Yes',
    classes:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  },
  partial: {
    label: 'Partial',
    classes:
      'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  },
  no: {
    label: 'No',
    classes: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
  },
}

function sortedByPosition<T extends { position: number }>(items: T[]) {
  return [...items].sort((a, b) => a.position - b.position)
}

function getAssessment(capability: CompetitorCapability, vendorId: string) {
  return capability.assessments.find((assessment) => assessment.vendor_id === vendorId)
}

function VerdictBadge({ verdict }: { verdict: CompetitorVerdict }) {
  const meta = VERDICT_META[verdict]

  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${meta.classes}`}
    >
      {meta.label}
    </span>
  )
}

function AssessmentDetails({
  assessment,
  comfortable = false,
}: {
  assessment: CompetitorAssessment
  comfortable?: boolean
}) {
  return (
    <div>
      <p className={comfortable ? 'text-sm leading-6 text-muted-foreground' : 'text-xs leading-5 text-muted-foreground'}>
        {assessment.justification}
      </p>
      {assessment.sources.length > 0 ? (
        <div className="mt-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Sources</p>
          <ul className="mt-1.5 space-y-1.5">
            {assessment.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${comfortable ? 'text-sm leading-5' : 'text-xs leading-4'} inline-flex min-w-0 items-start gap-1 break-words text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                >
                  <span className="min-w-0 break-words">{source.title}</span>
                  <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

function MobileCapabilityList({
  capabilities,
  vendors,
}: {
  capabilities: CompetitorCapability[]
  vendors: CompetitorVendor[]
}) {
  return (
    <div className="divide-y divide-border lg:hidden">
      {capabilities.map((capability) => (
        <details key={capability.id} className="group/mobile-row">
          <summary className="flex min-h-12 touch-manipulation cursor-pointer list-none items-start justify-between gap-3 px-4 py-3.5 outline-none hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-5 [&::-webkit-details-marker]:hidden">
            <p className="min-w-0 break-words text-sm font-semibold leading-6 text-foreground first-letter:uppercase">
              {capability.title}
            </p>
            <ChevronDown
              className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open/mobile-row:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </summary>

          <div className="space-y-3 border-t border-border bg-muted/20 p-3 sm:p-4">
            {vendors.map((vendor) => {
              const assessment = getAssessment(capability, vendor.id)
              if (!assessment) return null

              return (
                <article
                  key={vendor.id}
                  className={`rounded-xl border p-4 ${
                    vendor.featured ? 'border-brand/30 bg-brand/[0.035]' : 'border-border bg-card'
                  }`}
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-foreground">{vendor.name}</p>
                      <p className="mt-0.5 break-words text-xs text-muted-foreground">{vendor.descriptor}</p>
                    </div>
                    <VerdictBadge verdict={assessment.verdict} />
                  </div>
                  <div className="mt-3 border-t border-border/70 pt-3">
                    <AssessmentDetails assessment={assessment} comfortable />
                  </div>
                </article>
              )
            })}
          </div>
        </details>
      ))}
    </div>
  )
}

function CoverageCard({
  vendor,
  analysis,
}: {
  vendor: CompetitorVendor
  analysis: CompetitorAnalysis
}) {
  const assessments = analysis.segments.flatMap((segment) =>
    segment.capabilities.flatMap((capability) =>
      capability.assessments.filter((assessment) => assessment.vendor_id === vendor.id),
    ),
  )
  const counts = assessments.reduce<Record<CompetitorVerdict, number>>(
    (total, assessment) => {
      total[assessment.verdict] += 1
      return total
    },
    { yes: 0, partial: 0, no: 0 },
  )

  return (
    <article
      className={`rounded-xl border p-4 ${vendor.featured ? 'border-brand/30 bg-brand/[0.035]' : 'border-border bg-card'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{vendor.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{vendor.descriptor}</p>
        </div>
        {vendor.featured ? (
          <span className="rounded-full bg-brand px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-brand-foreground">
            Full platform
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
        {(Object.keys(VERDICT_META) as CompetitorVerdict[]).map((verdict) => (
          <div key={verdict} className="flex items-center gap-1.5">
            <VerdictBadge verdict={verdict} />
            <span className="font-mono text-xs font-semibold tabular-nums text-foreground">{counts[verdict]}</span>
          </div>
        ))}
      </div>
    </article>
  )
}

function SegmentMatrix({
  segment,
  vendors,
  defaultOpen,
}: {
  segment: CompetitorSegment
  vendors: CompetitorVendor[]
  defaultOpen: boolean
}) {
  const capabilities = sortedByPosition(segment.capabilities)
  const gridStyle = {
    gridTemplateColumns: `240px repeat(${vendors.length}, minmax(180px, 1fr))`,
  }

  return (
    <details open={defaultOpen} className="group/segment overflow-hidden rounded-xl border border-border bg-card">
      <summary className="flex min-h-12 touch-manipulation cursor-pointer list-none items-center justify-between gap-4 bg-muted/35 px-4 py-4 outline-none hover:bg-muted/55 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand">{segment.label}</span>
            <span className="text-[10px] text-muted-foreground">
              {capabilities.length} {capabilities.length === 1 ? 'capability' : 'capabilities'}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground">{segment.summary}</p>
        </div>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open/segment:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </summary>

      <MobileCapabilityList capabilities={capabilities} vendors={vendors} />

      <div className="hidden overflow-x-auto overscroll-x-contain lg:block">
        <div className="min-w-[1320px]">
          <div className="grid border-b border-border" style={gridStyle} role="row">
            <div
              className="sticky left-0 z-20 bg-card px-4 py-3 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:px-5"
              role="columnheader"
            >
              Capability
            </div>
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className={`border-l border-border px-4 py-3 ${vendor.featured ? 'bg-brand/[0.035]' : 'bg-card'}`}
                role="columnheader"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{vendor.name}</span>
                  {vendor.featured ? (
                    <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-brand">
                      Full platform
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{vendor.descriptor}</p>
              </div>
            ))}
          </div>

          <div role="rowgroup">
            {capabilities.map((capability) => (
              <details key={capability.id} className="group/row border-b border-border last:border-b-0">
                <summary
                  className="grid cursor-pointer list-none outline-none hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden"
                  style={gridStyle}
                >
                  <div className="sticky left-0 z-10 flex items-start justify-between gap-3 bg-card px-4 py-4 group-hover/row:bg-muted/35 sm:px-5">
                    <p className="text-sm font-semibold leading-5 text-foreground first-letter:uppercase">
                      {capability.title}
                    </p>
                    <ChevronDown
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open/row:rotate-180 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </div>
                  {vendors.map((vendor) => {
                    const assessment = getAssessment(capability, vendor.id)

                    return (
                      <div
                        key={vendor.id}
                        className={`flex items-center border-l border-border px-4 py-4 ${
                          vendor.featured ? 'bg-brand/[0.025]' : ''
                        }`}
                      >
                        {assessment ? <VerdictBadge verdict={assessment.verdict} /> : null}
                      </div>
                    )
                  })}
                </summary>

                <div className="grid border-t border-border bg-muted/20" style={gridStyle}>
                  <div className="sticky left-0 z-10 bg-muted px-4 py-5 sm:px-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                      Assessment details
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Rationale and sources from the current research export.
                    </p>
                  </div>
                  {vendors.map((vendor) => {
                    const assessment = getAssessment(capability, vendor.id)

                    return (
                      <div
                        key={vendor.id}
                        className={`border-l border-border px-4 py-5 ${
                          vendor.featured ? 'bg-brand/[0.025]' : ''
                        }`}
                      >
                        {assessment ? <AssessmentDetails assessment={assessment} /> : null}
                      </div>
                    )
                  })}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </details>
  )
}

export function CompetitorsView({
  analysis,
  initialSegment,
}: {
  analysis: CompetitorAnalysis | null
  initialSegment?: string
}) {
  const validInitialSegment =
    initialSegment && analysis?.segments.some((segment) => segment.id === initialSegment)
      ? initialSegment
      : 'all'
  const [activeSegment, setActiveSegment] = useState(validInitialSegment)

  if (!analysis) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-brand">
          <Construction className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold text-foreground">Analysis not available</h2>
        <p className="max-w-md text-pretty text-sm leading-6 text-muted-foreground">
          Import the current competitor research document to publish this page.
        </p>
      </div>
    )
  }

  const vendors = sortedByPosition(analysis.vendors)
  const segments = sortedByPosition(analysis.segments)
  const visibleSegments =
    activeSegment === 'all' ? segments : segments.filter((segment) => segment.id === activeSegment)
  const capabilityCount = segments.reduce((total, segment) => total + segment.capabilities.length, 0)
  const updatedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${analysis.updated_at}T00:00:00`))

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/[0.07] via-card to-card">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-brand">
              <Layers3 className="h-4 w-4" aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.16em]">Working thesis</p>
            </div>
            <h2 className="mt-3 max-w-3xl text-xl font-semibold leading-8 tracking-tight text-balance text-foreground sm:text-2xl">
              One operating model, not another assembly project
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{analysis.thesis}</p>
          </div>
          <div className="rounded-xl border border-border/80 bg-card/85 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Current research export
              </span>
              <span className="text-xs text-muted-foreground">Updated {updatedDate}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 divide-x divide-border">
              <div>
                <p className="font-mono text-xl font-semibold tabular-nums text-foreground">{segments.length}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Segments</p>
              </div>
              <div className="pl-4">
                <p className="font-mono text-xl font-semibold tabular-nums text-foreground">{capabilityCount}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Capabilities</p>
              </div>
              <div className="pl-4">
                <p className="font-mono text-xl font-semibold tabular-nums text-foreground">{vendors.length}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Platforms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="coverage-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand">At a glance</p>
            <h2 id="coverage-heading" className="mt-1 text-lg font-semibold text-foreground">
              Lifecycle coverage
            </h2>
          </div>
          <details className="group/method max-w-2xl text-right">
            <summary className="cursor-pointer list-none text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              How we score
              <ChevronDown
                className="ml-1 inline h-3.5 w-3.5 transition-transform group-open/method:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="mt-2 text-left text-xs leading-5 text-muted-foreground sm:text-right">{analysis.methodology}</p>
          </details>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {vendors.map((vendor) => (
            <CoverageCard key={vendor.id} vendor={vendor} analysis={analysis} />
          ))}
        </div>
      </section>

      <section aria-labelledby="matrix-heading">
        <div className="flex flex-col gap-4 border-b border-border pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand">Evidence matrix</p>
            <h2 id="matrix-heading" className="mt-1 text-lg font-semibold text-foreground">
              Compare the complete lifecycle
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Open a capability to review every platform&apos;s verdict, rationale, and sources. Larger screens keep the
              side-by-side matrix.
            </p>
          </div>

          <div className="flex max-w-full flex-wrap gap-2" role="group" aria-label="Filter by segment">
            <button
              type="button"
              aria-pressed={activeSegment === 'all'}
              onClick={() => setActiveSegment('all')}
              className={`min-h-10 shrink-0 touch-manipulation rounded-full border px-3 py-2 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                activeSegment === 'all'
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              All segments
            </button>
            {segments.map((segment) => (
              <button
                key={segment.id}
                type="button"
                aria-pressed={activeSegment === segment.id}
                onClick={() => setActiveSegment(segment.id)}
                className={`min-h-10 shrink-0 touch-manipulation rounded-full border px-3 py-2 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                  activeSegment === segment.id
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {segment.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" aria-label="Verdict legend">
          {(Object.keys(VERDICT_META) as CompetitorVerdict[]).map((verdict) => (
            <VerdictBadge key={verdict} verdict={verdict} />
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {visibleSegments.map((segment, index) => (
            <SegmentMatrix
              key={`${activeSegment}-${segment.id}`}
              segment={segment}
              vendors={vendors}
              defaultOpen={activeSegment !== 'all' || index === 0}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

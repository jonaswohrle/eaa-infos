import Link from 'next/link'
import { ArrowRight, FlaskConical, Scale } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { RichText } from '@/lib/rich-text'
import { STEP_HREF } from '@/lib/nav'
import { STATUS_LABELS, type PocStep, type StepStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

function TrackProgress({ steps }: { steps: PocStep[] }) {
  const done = steps.filter((s) => s.status === 'done').length
  const total = steps.length
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[11px] text-muted-foreground">
        {done}/{total} done
      </span>
    </div>
  )
}

function StepCard({ step }: { step: PocStep }) {
  const href = STEP_HREF[step.step_key] ?? '/'
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
        <StatusBadge status={step.status} />
      </div>
      <RichText html={step.summary} className="mt-2 text-sm leading-relaxed text-muted-foreground" />
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
        Open section
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </Link>
  )
}

function TrackColumn({
  title,
  description,
  icon: Icon,
  steps,
}: {
  title: string
  description: string
  icon: typeof FlaskConical
  steps: PocStep[]
}) {
  return (
    <section className="flex flex-col rounded-2xl border border-border bg-muted/20 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-brand">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-3">
        <TrackProgress steps={steps} />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {steps.map((step) => (
          <StepCard key={step.id} step={step} />
        ))}
      </div>
    </section>
  )
}

const SUMMARY_ORDER: StepStatus[] = ['done', 'in_progress', 'blocked', 'not_started']

export function PocDashboard({ steps }: { steps: PocStep[] }) {
  const technical = steps.filter((s) => s.track === 'technical')
  const procurement = steps.filter((s) => s.track === 'procurement')
  const technicalDescription = technical.some((step) => step.step_key === 'poc-users')
    ? 'POC users, the demo environment, and technical success criteria.'
    : 'Demo environment and technical success criteria.'
  const procurementDescription = procurement.some((step) => step.step_key === 'business-case')
    ? 'Commercials and legal — documents, offer, competitors, and business case.'
    : 'Commercials and legal — documents, offer, and competitors.'

  const counts = SUMMARY_ORDER.map((status) => ({
    status,
    count: steps.filter((s) => s.status === status).length,
  }))

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map(({ status, count }) => (
          <div key={status} className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-semibold tabular-nums text-foreground">{count}</p>
            <p
              className={cn(
                'mt-1 font-mono text-[10px] uppercase tracking-[0.12em]',
                status === 'done' && 'text-green-600',
                status === 'in_progress' && 'text-amber-600',
                status === 'blocked' && 'text-red-600',
                status === 'not_started' && 'text-muted-foreground',
              )}
            >
              {STATUS_LABELS[status]}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <TrackColumn
          title="Technical POC"
          description={technicalDescription}
          icon={FlaskConical}
          steps={technical}
        />
        <TrackColumn
          title="Procurement"
          description={procurementDescription}
          icon={Scale}
          steps={procurement}
        />
      </div>
    </div>
  )
}

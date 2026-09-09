import { StatusBadge } from '@/components/status-badge'
import { RichText } from '@/lib/rich-text'
import type { PocStep } from '@/lib/types'

export function StepBanner({ step }: { step: PocStep | null }) {
  if (!step) return null
  return (
    <div className="mb-8 rounded-2xl border border-border bg-muted/30 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          POC step · {step.track === 'technical' ? 'Technical' : 'Procurement'}
        </span>
        <StatusBadge status={step.status} />
      </div>
      {step.detail ? (
        <RichText html={step.detail} className="mt-3 text-sm leading-relaxed text-foreground" />
      ) : (
        <RichText html={step.summary} className="mt-3 text-sm leading-relaxed text-muted-foreground" />
      )}
    </div>
  )
}

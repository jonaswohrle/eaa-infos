import { cn } from '@/lib/utils'
import { STATUS_LABELS } from '@/lib/types'

// Step statuses plus document/version statuses share one badge.
const LABELS: Record<string, string> = {
  ...STATUS_LABELS,
  draft: 'Draft',
  in_review: 'In review',
  shared: 'Shared',
  agreed: 'Agreed',
  published: 'Published',
  planned: 'Planned',
  ready: 'Ready',
  invited: 'Invited',
  active: 'Active',
  coming_soon: 'Coming soon',
}

const STYLES: Record<string, string> = {
  // Monochrome density ramp: neutral (dormant) → outlined (in flight) → solid (settled).
  not_started: 'border-border bg-muted/50 text-muted-foreground',
  draft: 'border-border bg-muted/50 text-muted-foreground',
  planned: 'border-border bg-muted/50 text-muted-foreground',
  invited: 'border-border bg-muted/50 text-muted-foreground',
  coming_soon: 'border-border bg-muted/50 text-muted-foreground',
  in_progress: 'border-foreground/40 bg-background text-foreground',
  in_review: 'border-foreground/40 bg-background text-foreground',
  blocked: 'border-dashed border-foreground/50 bg-background text-foreground',
  shared: 'border-foreground/40 bg-background text-foreground',
  ready: 'border-foreground/40 bg-background text-foreground',
  active: 'border-foreground/40 bg-background text-foreground',
  done: 'border-foreground bg-foreground text-background',
  agreed: 'border-foreground bg-foreground text-background',
  published: 'border-foreground bg-foreground text-background',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const label = LABELS[status] ?? status.replace(/_/g, ' ')
  const style = STYLES[status] ?? 'border-border bg-muted/50 text-muted-foreground'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]',
        style,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  )
}

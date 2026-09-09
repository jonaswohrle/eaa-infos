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
  not_started: 'border-border bg-muted/50 text-muted-foreground',
  in_progress: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300',
  blocked: 'border-red-300 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300',
  done: 'border-green-300 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300',
  draft: 'border-border bg-muted/50 text-muted-foreground',
  planned: 'border-border bg-muted/50 text-muted-foreground',
  invited: 'border-border bg-muted/50 text-muted-foreground',
  in_review: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300',
  shared: 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300',
  ready: 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300',
  active: 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300',
  coming_soon: 'border-border bg-muted/50 text-muted-foreground',
  agreed: 'border-green-300 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300',
  published: 'border-green-300 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300',
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

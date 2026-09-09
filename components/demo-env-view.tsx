'use client'

import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  Boxes,
  Building2,
  Cable,
  ChevronRight,
  Fingerprint,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { DemoEnvItem } from '@/lib/types'
import { RichText } from '@/lib/rich-text'
import { cn } from '@/lib/utils'

function statusClasses(status: string) {
  const s = status.toLowerCase()
  if (s === 'done' || s === 'ready' || s === 'live' || s === 'provisioning')
    return 'border-green-300 bg-green-50 text-green-700'
  if (s === 'in_progress' || s === 'configuring' || s === 'planned')
    return 'border-amber-300 bg-amber-50 text-amber-700'
  if (s === 'blocked') return 'border-red-300 bg-red-50 text-red-700'
  return 'border-border bg-muted/50 text-muted-foreground'
}

const BOX_ICONS: { match: RegExp; icon: LucideIcon }[] = [
  { match: /org|trial team/i, icon: Building2 },
  { match: /identit/i, icon: Fingerprint },
  { match: /connect|system/i, icon: Cable },
]

function boxIcon(label: string): LucideIcon {
  return BOX_ICONS.find((b) => b.match.test(label))?.icon ?? Boxes
}

function DetailDialog({ item, onClose }: { item: DemoEnvItem; onClose: () => void }) {
  const Icon = boxIcon(item.label)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-dialog-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-xl sm:rounded-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 id="demo-dialog-title" className="text-lg font-semibold leading-7 text-foreground text-balance">
                {item.label}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{item.value}</p>
              <span
                className={cn(
                  'mt-2 inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide',
                  statusClasses(item.status),
                )}
              >
                {item.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {item.notes?.trim() ? (
            <RichText html={item.notes} className="mb-5 text-sm leading-6 text-muted-foreground" />
          ) : null}

          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Details
          </h3>
          {item.details.length ? (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {item.details.map((d) => (
                <li key={d.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{d.label}</p>
                    {d.notes?.trim() ? (
                      <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{d.notes}</p>
                    ) : null}
                  </div>
                  {d.value?.trim() ? (
                    <span className="shrink-0 font-mono text-xs text-muted-foreground sm:text-right">
                      {d.value}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No details yet.
            </p>
          )}

          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              Open
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}

        </div>
      </div>
    </div>
  )
}

export function DemoEnvView({ items }: { items: DemoEnvItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = items.find((i) => i.id === selectedId) ?? null

  return (
    <div>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
          No environment boxes yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => {
            const Icon = boxIcon(item.label)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:border-brand/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      'shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide',
                      statusClasses(item.status),
                    )}
                  >
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="mt-3 text-base font-semibold text-foreground">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                  {item.details.length} {item.details.length === 1 ? 'detail' : 'details'}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </button>
            )
          })}
        </div>
      )}

      {selected ? <DetailDialog item={selected} onClose={() => setSelectedId(null)} /> : null}
    </div>
  )
}

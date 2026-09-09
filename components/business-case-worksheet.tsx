'use client'

import { useState, useTransition } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'

/**
 * This deployment is a read-only share of the business case. There is no
 * database behind it and the page is handed to people outside the company, so
 * the authoring affordances are compiled out rather than merely hidden.
 */
const READ_ONLY = true
import { docLinksFor } from '@/lib/business-case-docs'
import {
  LENSES,
  LENS_LABELS,
  PHASES,
  PHASE_LABELS,
  type BusinessCaseData,
  type BusinessCaseItem,
  type BusinessCaseItemPatch,
  type BusinessCasePhaseSummary,
  type Lens,
  type Phase,
  type Status,
  type SupportKind,
} from '@/lib/business-case-shared'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

function formatCompact(n: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

function formatFull(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

// ---------------------------------------------------------------------------
// Executive phase summary
// ---------------------------------------------------------------------------

type SummaryKind = SupportKind

type SummaryStatementProps = {
  summary: BusinessCasePhaseSummary
  kind: SummaryKind
  items: BusinessCaseItem[]
  open: boolean
  expanded: Set<string>
  onToggle: () => void
  onToggleItem: (kind: SummaryKind, id: string) => void
  onSaved: (item: BusinessCaseItem, patch: BusinessCaseItemPatch) => void
  onDeleted: (item: BusinessCaseItem) => void
  onAdd: (kind: SummaryKind) => void
}

function SummaryStatement({
  summary,
  kind,
  items,
  open,
  expanded,
  onToggle,
  onToggleItem,
  onSaved,
  onDeleted,
  onAdd,
}: SummaryStatementProps) {
  const isValue = kind === 'value'
  const label = isValue ? 'Value' : 'Risk mitigated'
  const message = isValue ? summary.value : summary.riskMitigated
  const evidenceLabel = isValue ? 'How Vercel creates this value' : 'How Vercel reduces this risk'
  const detailId = `business-case-${summary.phase}-${kind}-detail`

  return (
    <div className="business-case-summary-row grid gap-1.5 sm:grid-cols-[116px_minmax(0,1fr)] sm:gap-5">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="min-w-0">
        <p className="text-base font-medium leading-7 text-foreground text-pretty">{message}</p>
        <div className="group/claim mt-2 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={detailId}
            aria-label={`${open ? 'Hide' : 'Show'} evidence for ${PHASE_LABELS[summary.phase]} ${label.toLowerCase()}`}
            className="flex items-center gap-2 rounded-sm py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span aria-hidden="true" className={cn('transition-transform', open && 'rotate-90')}>
              ›
            </span>
            {open ? 'Less detail' : 'More detail'}
          </button>
          {open && !READ_ONLY ? (
            <button
              type="button"
              onClick={() => onAdd(kind)}
              aria-label={`Add evidence for ${evidenceLabel}`}
              title="Add evidence"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/claim:opacity-100 [@media(hover:none)]:opacity-100"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {open ? (
          <div id={detailId} className="mt-2 border-t border-border">
            <SupportingArguments
              items={items}
              context={`${summary.phase}:${kind}`}
              expanded={expanded}
              onToggle={(id) => onToggleItem(kind, id)}
              onSaved={onSaved}
              onDeleted={onDeleted}
            />
          </div>
        ) : null}
      </dd>
    </div>
  )
}

function PhaseSummary({
  summary,
  phaseItems,
  expanded,
  onToggleItem,
  onSaved,
  onDeleted,
  onAdd,
}: {
  summary: BusinessCasePhaseSummary
  phaseItems: BusinessCaseItem[]
  expanded: Set<string>
  onToggleItem: (kind: SummaryKind, id: string) => void
  onSaved: (item: BusinessCaseItem, patch: BusinessCaseItemPatch) => void
  onDeleted: (item: BusinessCaseItem) => void
  onAdd: (kind: SummaryKind) => void
}) {
  const [openStatements, setOpenStatements] = useState<Set<SummaryKind>>(new Set())
  const valueItems = phaseItems.filter((item) => item.supportKind === 'value')
  const riskItems = phaseItems.filter((item) => item.supportKind === 'risk')

  function toggleStatement(kind: SummaryKind) {
    setOpenStatements((current) => {
      const next = new Set(current)
      if (next.has(kind)) next.delete(kind)
      else next.add(kind)
      return next
    })
  }

  return (
    <div className="business-case-summary border-b border-border py-5">
      <dl className="business-case-summary-screen grid gap-6 print:hidden">
        <SummaryStatement
          summary={summary}
          kind="value"
          items={valueItems}
          open={openStatements.has('value')}
          expanded={expanded}
          onToggle={() => toggleStatement('value')}
          onToggleItem={onToggleItem}
          onSaved={onSaved}
          onDeleted={onDeleted}
          onAdd={onAdd}
        />
        <SummaryStatement
          summary={summary}
          kind="risk"
          items={riskItems}
          open={openStatements.has('risk')}
          expanded={expanded}
          onToggle={() => toggleStatement('risk')}
          onToggleItem={onToggleItem}
          onSaved={onSaved}
          onDeleted={onDeleted}
          onAdd={onAdd}
        />
      </dl>

      <dl className="hidden print:grid">
        <div className="business-case-summary-row">
          <dt>Value</dt>
          <dd>{summary.value}</dd>
        </div>
        <div className="business-case-summary-row">
          <dt>Risk mitigated</dt>
          <dd>{summary.riskMitigated}</dd>
        </div>
      </dl>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Expanded analysis panel (read + edit)
// ---------------------------------------------------------------------------

type Draft = {
  title: string
  supportKind: SupportKind
  today: string
  problem: string
  withVercel: string
  impact: string
  lenses: Lens[]
  quantAmount: string
  quantUnit: string
  quantBasis: string
  status: Status
}

function draftFrom(item: BusinessCaseItem): Draft {
  return {
    title: item.title,
    supportKind: item.supportKind,
    today: item.today,
    problem: item.problem,
    withVercel: item.withVercel,
    impact: item.impact,
    lenses: [...item.lenses],
    quantAmount: item.quantAmount === null ? '' : String(item.quantAmount),
    quantUnit: item.quantUnit,
    quantBasis: item.quantBasis,
    status: item.status,
  }
}

function AnalysisBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">{label}</p>
      <div className="mt-1.5 text-sm leading-6 text-foreground text-pretty">{children}</div>
    </div>
  )
}

function FieldArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1.5 w-full resize-y rounded-md border border-border bg-background px-2.5 py-2 text-sm leading-6 text-foreground outline-none focus:border-ring"
      />
    </label>
  )
}

function ExpandedRow({
  item,
  editing = false,
  onEditingChange,
  onSaved,
  onDeleted,
}: {
  item: BusinessCaseItem
  editing?: boolean
  onEditingChange?: (editing: boolean) => void
  onSaved: (patch: BusinessCaseItemPatch) => void
  onDeleted: () => void
}) {
  const [draft, setDraft] = useState<Draft>(() => draftFrom(item))
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }))

  function save() {
    const patch: BusinessCaseItemPatch = {
      title: draft.title,
      supportKind: draft.supportKind,
      today: draft.today,
      problem: draft.problem,
      withVercel: draft.withVercel,
      impact: draft.impact,
      lenses: draft.lenses,
      quantAmount: draft.quantAmount.trim() === '' ? null : Number(draft.quantAmount),
      quantUnit: draft.quantUnit,
      quantBasis: draft.quantBasis,
      status: draft.status,
    }
    // Read-only share: reflect the change locally, persist nothing.
    onSaved(patch)
    onEditingChange?.(false)
    setError(null)
  }

  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function del() {
    onDeleted()
  }

  if (editing) {
    return (
      <div className="space-y-4 border-l-2 border-brand/40 py-4 pl-4 pr-2">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">Evidence title</span>
            <input
              value={draft.title}
              onChange={(e) => set('title', e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm font-medium text-foreground outline-none focus:border-ring"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">Supports</span>
            <select
              value={draft.supportKind}
              onChange={(e) => set('supportKind', e.target.value as SupportKind)}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm text-foreground outline-none focus:border-ring"
            >
              <option value="value">Value</option>
              <option value="risk">Risk mitigated</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldArea label="What happens today" value={draft.today} onChange={(v) => set('today', v)} />
          <FieldArea label="The problem" value={draft.problem} onChange={(v) => set('problem', v)} />
          <FieldArea label="Business consequence" value={draft.impact} onChange={(v) => set('impact', v)} />
          <FieldArea label="How this supports the claim" value={draft.withVercel} onChange={(v) => set('withVercel', v)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-[110px_170px_1fr]">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">Amount</span>
            <input
              inputMode="decimal"
              value={draft.quantAmount}
              onChange={(e) => set('quantAmount', e.target.value)}
              placeholder="—"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm tabular-nums text-foreground outline-none focus:border-ring"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">Unit</span>
            <input
              value={draft.quantUnit}
              onChange={(e) => set('quantUnit', e.target.value)}
              placeholder="e.g. $/yr avoided"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm text-foreground outline-none focus:border-ring"
            />
          </label>
          <FieldArea label="How to quantify" value={draft.quantBasis} onChange={(v) => set('quantBasis', v)} rows={2} />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            {LENSES.map((l) => {
              const active = draft.lenses.includes(l)
              return (
                <button
                  key={l}
                  type="button"
                  aria-pressed={active}
                  onClick={() => set('lenses', active ? draft.lenses.filter((x) => x !== l) : [...draft.lenses, l])}
                  className={cn(
                    'rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors',
                    active
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {LENS_LABELS[l]}
                </button>
              )
            })}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {confirmingDelete ? (
              <>
                <span className="text-xs text-muted-foreground">Delete this evidence?</span>
                <button
                  type="button"
                  onClick={del}
                  disabled={pending}
                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive transition-colors hover:underline disabled:opacity-50"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  disabled={pending}
                  className="rounded-md px-2.5 py-1.5 text-xs text-foreground transition-colors hover:underline disabled:opacity-50"
                >
                  Keep
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                disabled={pending}
                className="rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setDraft(draftFrom(item))
                onEditingChange?.(false)
                setError(null)
              }}
              disabled={pending}
              className="rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    )
  }

  return (
    <div className="border-l-2 border-brand/40 py-4 pl-4 pr-2">
      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <AnalysisBlock label="What happens today">{item.today || '—'}</AnalysisBlock>
        <AnalysisBlock label="The problem">{item.problem || '—'}</AnalysisBlock>
        <AnalysisBlock label="Business consequence">{item.impact || '—'}</AnalysisBlock>
        <AnalysisBlock label="How this supports the claim">{item.withVercel || '—'}</AnalysisBlock>
      </div>
      <div className="mt-4 border-t border-border pt-3">
        <div className="text-sm leading-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">How to quantify</span>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{item.quantBasis || '—'}</p>
        </div>
      </div>
      <DocumentationSection title={item.title} itemId={item.id} />
    </div>
  )
}

function DocumentationSection({ title, itemId }: { title: string; itemId: string }) {
  const links = docLinksFor(title)
  const [open, setOpen] = useState(false)
  const sectionId = `${itemId}-docs`

  if (links.length === 0) return null

  return (
    <div className="mt-4 border-t border-border pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={sectionId}
        className="flex items-center gap-2 rounded-sm py-0.5 text-sm text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span aria-hidden="true" className={cn('transition-transform', open && 'rotate-90')}>
          ›
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Documentation</span>
        <span className="font-mono text-[10px] text-muted-foreground/60">({links.length})</span>
      </button>

      {open ? (
        <ul id={sectionId} className="mt-2 space-y-2.5 pl-4">
          {links.map((link) => (
            <li key={link.href} className="text-sm leading-6">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
              >
                {link.label}
                <span aria-hidden="true" className="ml-1 text-muted-foreground">
                  ↗
                </span>
              </a>
              <span className="text-muted-foreground"> — {link.proves}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function SupportingArguments({
  items,
  context,
  expanded,
  onToggle,
  onSaved,
  onDeleted,
}: {
  items: BusinessCaseItem[]
  context: string
  expanded: Set<string>
  onToggle: (id: string) => void
  onSaved: (item: BusinessCaseItem, patch: BusinessCaseItemPatch) => void
  onDeleted: (item: BusinessCaseItem) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)
  const [deletePending, startDelete] = useTransition()

  function confirmDelete(item: BusinessCaseItem) {
    startDelete(async () => {
      const result = { ok: true } as const
      if (result.ok) {
        setConfirmingDeleteId(null)
        onDeleted(item)
      }
    })
  }

  if (items.length === 0) {
    return <p className="py-3 text-sm text-muted-foreground/70">No evidence linked to this claim yet.</p>
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((item) => {
        const expansionKey = `${context}:${item.id}`
        const isOpen = expanded.has(expansionKey)
        const panelId = `${context.replaceAll(':', '-')}-${item.id}-analysis`
        const isEditing = editingId === item.id

        return (
          <li key={item.id}>
            <div className="group relative">
              <button
                type="button"
                onClick={() => {
                  if (isOpen && isEditing) setEditingId(null)
                  onToggle(item.id)
                }}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="grid w-full grid-cols-[minmax(0,1fr)_16px] items-center gap-x-4 gap-y-1 py-3 text-left transition-colors hover:bg-secondary/40 sm:grid-cols-[minmax(0,1fr)_150px_16px]"
              >
                <span
                  className={cn(
                    'min-w-0 truncate text-sm font-medium text-foreground',
                    item.status === 'rejected' && 'text-muted-foreground/60 line-through',
                  )}
                >
                  {item.title || 'Untitled evidence'}
                </span>
                <span className="hidden truncate text-right text-sm tabular-nums sm:block">
                  {item.quantAmount !== null ? (
                    <span className="text-foreground">
                      {formatCompact(item.quantAmount)} <span className="text-muted-foreground">{item.quantUnit}</span>
                    </span>
                  ) : item.quantUnit ? (
                    <span className="text-muted-foreground/80">{item.quantUnit}</span>
                  ) : null}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'justify-self-end text-muted-foreground transition-transform',
                    isOpen && 'rotate-90',
                  )}
                >
                  ›
                </span>
              </button>

              {confirmingDeleteId === item.id ? (
                <div className="absolute right-8 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1 shadow-sm">
                  <span className="text-xs text-muted-foreground">Delete this evidence?</span>
                  <button
                    type="button"
                    onClick={() => confirmDelete(item)}
                    disabled={deletePending}
                    className="text-xs font-medium text-destructive transition-colors hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDeleteId(null)}
                    disabled={deletePending}
                    className="text-xs text-foreground transition-colors hover:underline disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : READ_ONLY ? null : (
                <div
                  className={cn(
                    'absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-1 bg-background transition-opacity sm:flex',
                    isEditing
                      ? 'opacity-0'
                      : 'opacity-0 focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (!isOpen) onToggle(item.id)
                      setEditingId(item.id)
                    }}
                    aria-label={`Edit ${item.title || 'evidence'}`}
                    title="Edit"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDeleteId(item.id)}
                    aria-label={`Delete ${item.title || 'evidence'}`}
                    title="Delete"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {isOpen ? (
              <div id={panelId}>
                <ExpandedRow
                  item={item}
                  editing={isEditing}
                  onEditingChange={(next) => setEditingId(next ? item.id : null)}
                  onSaved={(patch) => onSaved(item, patch)}
                  onDeleted={() => onDeleted(item)}
                />
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function BusinessCaseWorksheet({ initial }: { initial: BusinessCaseData }) {
  const [items, setItems] = useState<BusinessCaseItem[]>(initial.items)
  const phaseSummaries = initial.phaseSummaries
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [, startTransition] = useTransition()

  function toggle(phase: Phase, kind: SummaryKind, id: string) {
    const key = `${phase}:${kind}:${id}`
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function applyPatch(id: string, patch: BusinessCaseItemPatch) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  function removeItem(item: BusinessCaseItem) {
    setItems((prev) => prev.filter((candidate) => candidate.id !== item.id))
    setExpanded((prev) => {
      const next = new Set(prev)
      for (const key of next) {
        if (key.endsWith(`:${item.id}`)) next.delete(key)
      }
      return next
    })
  }

  // Authoring is disabled in this read-only share; the control that called this
  // is compiled out above.
  function addRow(_phase: Phase, _kind: SummaryKind) {}


  return (
    <div className="business-case-worksheet mt-8">
      {/* Toolbar */}
      <div className="business-case-toolbar flex items-center justify-between gap-4 print:hidden">
        <p className="text-sm leading-6 text-muted-foreground">
          Start with the two claims in each lifecycle stage. Open only the evidence you need.
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary"
        >
          Print / PDF
        </button>
      </div>

      {/* Executive narrative with optional supporting detail */}
      <div className="business-case-phases mt-5 space-y-12">
        {PHASES.map((phase) => {
          const phaseItems = items
            .filter((i) => i.phase === phase)
            .sort((a, b) => a.position - b.position)
          const summary = phaseSummaries.find((item) => item.phase === phase)!

          return (
            <section
              key={phase}
              data-print-phase={phase}
              aria-labelledby={`business-case-${phase}-heading`}
              className="business-case-phase"
            >
              <h2
                id={`business-case-${phase}-heading`}
                className="business-case-phase-heading border-b-2 border-foreground/70 pb-3 text-xl font-semibold tracking-tight text-foreground"
              >
                {PHASE_LABELS[phase]}
              </h2>

              <PhaseSummary
                summary={summary}
                phaseItems={phaseItems}
                expanded={expanded}
                onToggleItem={(kind, id) => toggle(phase, kind, id)}
                onSaved={(item, patch) => applyPatch(item.id, patch)}
                onDeleted={removeItem}
                onAdd={(kind) => addRow(phase, kind)}
              />

              <div className="business-case-details hidden print:block">
                {phaseItems.map((item) => (
                  <div key={item.id}>
                    <h3 className="pt-3 text-sm font-semibold text-foreground">{item.title || 'Untitled evidence'}</h3>
                    <ExpandedRow
                      item={item}
                      onSaved={(patch) => applyPatch(item.id, patch)}
                      onDeleted={() => removeItem(item)}
                    />
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

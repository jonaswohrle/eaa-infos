import { PageHeader } from '@/components/page-header'
import type {
  BusinessCaseContent,
  BusinessCaseItem,
  BusinessCasePhase,
  Lens,
  SupportKind,
} from '@/lib/business-case'
import { cn } from '@/lib/utils'

function LensChips({ lenses }: { lenses: Lens[] }) {
  return (
    <span className="flex flex-wrap gap-1">
      {lenses.map((lens) => (
        <span
          key={lens}
          className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
        >
          {lens}
        </span>
      ))}
    </span>
  )
}

/** One argument: the causal chain that backs up a phase claim. */
function ArgumentCard({
  item,
  statusLabel,
  supportLabel,
}: {
  item: BusinessCaseItem
  statusLabel: string
  supportLabel: string
}) {
  const chain = [
    { label: 'Today', body: item.today },
    { label: 'Why it breaks', body: item.problem },
    { label: 'Where it ends', body: item.impact },
    { label: supportLabel, body: item.withVercel },
  ]

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <h5 className="max-w-2xl text-pretty text-sm font-semibold leading-snug text-foreground">{item.title}</h5>
        <LensChips lenses={item.lenses} />
      </header>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {chain.map((step, index) => (
          <div
            key={step.label}
            className={cn(
              'rounded-lg border border-border/70 p-3',
              index === chain.length - 1 ? 'bg-foreground/[0.03] sm:col-span-2' : 'bg-transparent',
            )}
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{step.label}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-foreground/90">{step.body}</dd>
          </div>
        ))}
      </dl>

      <footer className="mt-4 flex flex-wrap items-baseline justify-between gap-3 border-t border-border/70 pt-3">
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em]">How to quantify · </span>
          {item.quantBasis}
        </p>
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {statusLabel}
        </span>
      </footer>
    </article>
  )
}

/**
 * A phase makes exactly two claims — one about value created, one about risk
 * removed. Every argument is evidence for one of them, so the claim leads and
 * the evidence sits underneath it rather than in a flat list.
 */
function ClaimBlock({
  kind,
  statement,
  items,
  statusLabels,
}: {
  kind: SupportKind
  statement: string
  items: BusinessCaseItem[]
  statusLabels: Record<string, string>
}) {
  const isValue = kind === 'value'
  const label = isValue ? 'Value' : 'Risk mitigated'
  const supportLabel = isValue ? 'How Vercel creates this value' : 'How Vercel reduces this risk'

  return (
    <div className="grid gap-2 border-t border-border/70 py-5 sm:grid-cols-[116px_minmax(0,1fr)] sm:gap-5">
      <p
        className={cn(
          'h-fit w-fit rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]',
          isValue
            ? 'bg-foreground text-background'
            : 'border border-dashed border-foreground/50 text-foreground',
        )}
      >
        {label}
      </p>

      <div className="min-w-0">
        <p className="text-pretty text-base font-medium leading-7 text-foreground">{statement}</p>

        {items.length > 0 ? (
          <details className="group mt-3">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-sm py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span aria-hidden="true" className="transition-transform group-open:rotate-90">
                ›
              </span>
              <span className="group-open:hidden">
                {supportLabel} — {items.length} {items.length === 1 ? 'argument' : 'arguments'}
              </span>
              <span className="hidden group-open:inline">Less detail</span>
            </summary>

            <div className="mt-3 space-y-3 border-t border-border pt-3">
              {items.map((item) => (
                <ArgumentCard
                  key={item.id}
                  item={item}
                  supportLabel={supportLabel}
                  statusLabel={statusLabels[item.status] ?? item.status}
                />
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </div>
  )
}

function PhaseSection({
  phase,
  statusLabels,
}: {
  phase: BusinessCasePhase
  statusLabels: Record<string, string>
}) {
  const valueItems = phase.items.filter((item) => item.supportKind === 'value')
  const riskItems = phase.items.filter((item) => item.supportKind === 'risk')

  return (
    <section aria-labelledby={`phase-${phase.phase}`}>
      <h3 id={`phase-${phase.phase}`} className="text-xl font-semibold tracking-tight text-foreground">
        {phase.label}
      </h3>
      <ClaimBlock kind="value" statement={phase.value} items={valueItems} statusLabels={statusLabels} />
      <ClaimBlock kind="risk" statement={phase.riskMitigated} items={riskItems} statusLabels={statusLabels} />
    </section>
  )
}

export function BusinessCaseView({ content }: { content: BusinessCaseContent }) {
  const all = content.phases.flatMap((phase) => phase.items)
  const valueCount = all.filter((item) => item.supportKind === 'value').length
  const riskCount = all.filter((item) => item.supportKind === 'risk').length

  return (
    <div className="space-y-10">
      <PageHeader eyebrow={content.hero.eyebrow} title={content.hero.title} description={content.hero.lead} />

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">{content.howToUse.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.howToUse.body}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">{content.sizing.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.sizing.lead}</p>
          <ul className="mt-3 space-y-2">
            {content.sizing.inputs.map((input) => (
              <li key={input.label} className="text-sm leading-relaxed">
                <span className="font-medium text-foreground">{input.label}</span>
                <span className="text-muted-foreground"> — {input.detail}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-border/70 pt-3 text-xs leading-relaxed text-muted-foreground">
            {content.sizing.note}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">Every stage makes two claims</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          One about the <span className="font-medium text-foreground">value</span> a governed platform creates, one
          about the <span className="font-medium text-foreground">risk</span> it removes. The arguments underneath each
          claim are the evidence for it — expand a claim to see what backs it up.
        </p>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-border/70 pt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{content.phases.length} stages</span>
          <span>{valueCount} value arguments</span>
          <span>{riskCount} risk arguments</span>
        </p>
      </section>

      <div className="space-y-8">
        {content.phases.map((phase) => (
          <PhaseSection key={phase.phase} phase={phase} statusLabels={content.statusLabels} />
        ))}
      </div>
    </div>
  )
}

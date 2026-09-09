import { PageHeader } from '@/components/page-header'
import type { BusinessCaseContent, BusinessCaseItem, Lens } from '@/lib/business-case'
import { cn } from '@/lib/utils'

const LENS_STYLE: Record<Lens, string> = {
  risk: 'border-foreground/25 text-foreground',
  cost: 'border-border text-muted-foreground',
  value: 'border-border text-muted-foreground',
  ai: 'border-border text-muted-foreground',
}

function LensChips({ lenses }: { lenses: Lens[] }) {
  return (
    <span className="flex flex-wrap gap-1">
      {lenses.map((lens) => (
        <span
          key={lens}
          className={cn(
            'rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]',
            LENS_STYLE[lens],
          )}
        >
          {lens}
        </span>
      ))}
    </span>
  )
}

function ArgumentCard({
  item,
  statusLabel,
}: {
  item: BusinessCaseItem
  statusLabel: string
}) {
  const chain = [
    { label: 'Today', body: item.today },
    { label: 'Why it breaks', body: item.problem },
    { label: 'Where it ends', body: item.impact },
    { label: 'On Vercel', body: item.withVercel },
  ]

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <h4 className="max-w-2xl text-pretty text-base font-semibold leading-snug text-foreground">
          {item.title}
        </h4>
        <LensChips lenses={item.lenses} />
      </header>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {chain.map((step) => (
          <div
            key={step.label}
            className={cn(
              'rounded-lg border border-border/70 p-3',
              step.label === 'On Vercel' ? 'bg-foreground/[0.03]' : 'bg-transparent',
            )}
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {step.label}
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-foreground/90">{step.body}</dd>
          </div>
        ))}
      </dl>

      <footer className="mt-4 border-t border-border/70 pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          How to quantify it
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.quantBasis}</p>
        <p className="mt-2.5 inline-flex rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {statusLabel}
        </p>
      </footer>
    </article>
  )
}

export function BusinessCaseView({ content }: { content: BusinessCaseContent }) {
  const total = content.phases.reduce((n, phase) => n + phase.items.length, 0)

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

      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {total} arguments across {content.phases.length} lifecycle stages
      </p>

      {content.phases.map((phase) => (
        <section key={phase.phase} className="space-y-4">
          <header className="border-t border-border pt-5">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{phase.label}</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <p className="text-sm leading-relaxed text-foreground/90">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Value
                </span>
                <br />
                {phase.value}
              </p>
              <p className="text-sm leading-relaxed text-foreground/90">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Risk mitigated
                </span>
                <br />
                {phase.riskMitigated}
              </p>
            </div>
          </header>

          <div className="space-y-3">
            {phase.items.map((item) => (
              <ArgumentCard
                key={item.id}
                item={item}
                statusLabel={content.statusLabels[item.status] ?? item.status}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

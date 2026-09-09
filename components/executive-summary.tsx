import Link from 'next/link'
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  ComparisonCell,
  ComparisonRow,
  ExecutiveComparison,
  ExecutiveSummaryContent,
} from '@/lib/executive-summary'

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function SectionHeading({
  eyebrow,
  title,
  description,
  aside,
  id,
}: {
  eyebrow: string
  title: string
  description?: string
  aside?: React.ReactNode
  id: string
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0 max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
        <h2 id={id} className="mt-1.5 text-xl font-semibold tracking-tight text-balance text-foreground">
          {title}
        </h2>
        {description ? <p className="mt-2 text-sm leading-6 text-pretty text-muted-foreground">{description}</p> : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  )
}

function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-sm font-medium text-brand focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
      <ArrowRight
        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* 1. Hero + decision context                                          */
/* ------------------------------------------------------------------ */

function Hero({ content }: { content: ExecutiveSummaryContent }) {
  return (
    <header>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand">{content.hero.eyebrow}</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {content.hero.title}
      </h1>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-pretty text-muted-foreground">
        {content.hero.description}
      </p>

      <dl className="mt-6 flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card sm:flex-row sm:divide-x sm:divide-y-0">
        {content.at_a_glance.map((item) => (
          <div key={item.label} className="flex-1 px-4 py-3">
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{item.label}</dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* 2. The three whys                                                   */
/* ------------------------------------------------------------------ */

function ThreeWhys({ content }: { content: ExecutiveSummaryContent }) {
  return (
    <section aria-label="The three whys">
      <div className="grid gap-3 md:grid-cols-3">
        {content.whys.map((why, index) => (
          <article key={why.key} className="flex flex-col rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand">{why.eyebrow}</p>
            </div>
            <h3 className="mt-3 text-base font-semibold leading-snug text-balance text-foreground">{why.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-pretty text-muted-foreground">{why.body}</p>
            <div className="mt-4 border-t border-border/70 pt-3">
              <InlineLink href={why.link_href}>{why.link_label}</InlineLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Executive comparison                                             */
/* ------------------------------------------------------------------ */

const COMPARISON_VERDICT_META = {
  covered: {
    label: 'Covered',
    classes:
      'border-foreground bg-foreground text-background',
  },
  partial: {
    label: 'Partial',
    classes: 'border-foreground/40 bg-background text-foreground',
  },
  gap: {
    label: 'Gap',
    classes: 'border-dashed border-border bg-muted text-muted-foreground',
  },
} as const

function ComparisonCellView({ cell, showVendor = false }: { cell: ComparisonCell; showVendor?: boolean }) {
  const meta = COMPARISON_VERDICT_META[cell.verdict]
  return (
    <div className="flex flex-col items-start gap-1">
      <span
        className={cn(
          'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]',
          meta.classes,
        )}
      >
        {meta.label}
      </span>
      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
        {cell.yes}/{cell.total} yes
        {cell.partial > 0 ? ` · ${cell.partial} partial` : ''}
      </span>
      {showVendor && cell.vendorName ? (
        <span className="text-[10px] font-medium text-muted-foreground">{cell.vendorName}</span>
      ) : null}
    </div>
  )
}

const COMPARISON_GRID = 'md:grid md:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] md:items-center'

function ComparisonRowLink({ row }: { row: ComparisonRow }) {
  return (
    <Link
      href={`/procurement/competitors?segment=${row.segmentId}`}
      className={cn(
        'group block border-b border-border px-5 py-4 outline-none transition-colors last:border-b-0 hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
        COMPARISON_GRID,
      )}
    >
      <div className="flex items-start justify-between gap-3 md:block md:pr-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {row.label}
            <span className="ml-2 font-mono text-[10px] font-normal tabular-nums text-muted-foreground">
              {row.capabilityCount} {row.capabilityCount === 1 ? 'capability' : 'capabilities'}
            </span>
          </p>
        </div>
        <ChevronRight
          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none md:hidden"
          aria-hidden="true"
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 md:col-span-3 md:mt-0 md:grid md:grid-cols-subgrid">
        <div>
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground md:hidden">
            Vercel
          </p>
          <ComparisonCellView cell={row.vercel} />
        </div>
        <div>
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground md:hidden">
            Internal @ DH
          </p>
          <ComparisonCellView cell={row.internal} />
        </div>
        <div>
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground md:hidden">
            Best point solution
          </p>
          <ComparisonCellView cell={row.bestPoint} showVendor />
        </div>
      </div>
    </Link>
  )
}

function ComparisonSection({
  content,
  comparison,
}: {
  content: ExecutiveSummaryContent
  comparison: ExecutiveComparison
}) {
  const updatedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${comparison.updatedAt}T00:00:00`))

  return (
    <section aria-labelledby="comparison-heading">
      <SectionHeading
        id="comparison-heading"
        eyebrow={content.comparison.eyebrow}
        title={content.comparison.title}
        description={content.comparison.description}
        aside={<InlineLink href="/procurement/competitors">Open the full matrix</InlineLink>}
      />

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        <div className={cn('hidden border-b border-border bg-muted/35 px-5 py-2.5', COMPARISON_GRID)}>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Lifecycle stage</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-brand">Vercel</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Internally Built @ DH</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Best point solution</p>
        </div>

        <div>
          {comparison.rows.map((row) => (
            <ComparisonRowLink key={row.segmentId} row={row} />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 border-t border-border bg-muted/25 px-5 py-3">
          <p className="text-xs leading-5 text-muted-foreground">{content.comparison.footnote}</p>
          <p className="shrink-0 font-mono text-[10px] text-muted-foreground">
            Point solutions: {comparison.pointSolutionNames.join(', ')} · Updated {updatedDate}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Section index                                                    */
/* ------------------------------------------------------------------ */

function SectionIndex({ content }: { content: ExecutiveSummaryContent }) {
  return (
    <section aria-labelledby="sections-heading">
      <SectionHeading
        id="sections-heading"
        eyebrow={content.sections.eyebrow}
        title={content.sections.title}
        description={content.sections.description}
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {content.sections.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 outline-none transition-colors hover:border-foreground/30 hover:bg-foreground/[0.02] focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-base font-semibold text-foreground">{item.title}</p>
              <ArrowUpRight
                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 flex-1 text-sm leading-6 text-pretty text-muted-foreground">{item.description}</p>
            <p className="mt-4 border-t border-border/70 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {item.meta}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Closing                                                          */
/* ------------------------------------------------------------------ */

function Closing({ content }: { content: ExecutiveSummaryContent }) {
  return (
    <section aria-labelledby="closing-heading" className="rounded-xl border border-border bg-card p-6">
      <h2 id="closing-heading" className="max-w-2xl text-lg font-semibold tracking-tight text-balance text-foreground">
        {content.closing.title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-pretty text-muted-foreground">{content.closing.body}</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/70 pt-4">
        {content.closing.links.map((link) => (
          <InlineLink key={link.href} href={link.href}>
            {link.label}
          </InlineLink>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Page assembly                                                       */
/* ------------------------------------------------------------------ */

export function ExecutiveSummary({
  content,
  comparison,
}: {
  content: ExecutiveSummaryContent
  comparison: ExecutiveComparison | null
}) {
  return (
    <div className="flex flex-col gap-12">
      <Hero content={content} />
      <ThreeWhys content={content} />
      <SectionIndex content={content} />
      {comparison ? <ComparisonSection content={content} comparison={comparison} /> : null}
      <Closing content={content} />
    </div>
  )
}

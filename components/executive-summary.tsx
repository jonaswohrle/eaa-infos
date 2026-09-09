import Link from 'next/link'
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ExecutiveSummaryContent } from '@/lib/executive-summary'

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
/* 3. Go deeper grid                                                   */
/* ------------------------------------------------------------------ */

function GoDeeper({ content }: { content: ExecutiveSummaryContent }) {
  return (
    <section aria-labelledby="go-deeper-heading">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand">Decision evidence</p>
      <h2 id="go-deeper-heading" className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">
        Follow every claim into the underlying work
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {content.go_deeper.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 outline-none transition-colors hover:border-brand/40 hover:bg-brand/[0.02] focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
            </div>
            <ArrowUpRight
              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-brand"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Page assembly                                                       */
/* ------------------------------------------------------------------ */

export function ExecutiveSummary({ content }: { content: ExecutiveSummaryContent }) {
  return (
    <div className="flex flex-col gap-12">
      <Hero content={content} />
      <ThreeWhys content={content} />
      <GoDeeper content={content} />
    </div>
  )
}

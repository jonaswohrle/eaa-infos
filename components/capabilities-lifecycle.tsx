'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { CapabilitiesLifecycleContent } from '@/lib/queries'

export function CapabilitiesLifecycle({
  content,
}: {
  content: CapabilitiesLifecycleContent
}) {
  const { intro, stages, closing } = content
  const [activeId, setActiveId] = useState(stages[0]?.id ?? '')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    for (const stage of stages) {
      const el = sectionRefs.current[stage.id]
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [stages])

  return (
    <div className="flex flex-col gap-12">
      {/* Intro */}
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          {intro.eyebrow}
        </p>
        <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {intro.title}
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{intro.lead}</p>
      </header>

      {/* Sticky lifecycle rail */}
      <nav
        aria-label="Lifecycle stages"
        className="sticky top-0 z-20 -mx-4 border-y border-border bg-background/85 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70"
      >
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {stages.map((stage, index) => {
            const isActive = stage.id === activeId
            return (
              <li key={stage.id} className="flex items-center">
                {index > 0 && (
                  <span aria-hidden className="mx-1 hidden text-muted-foreground/40 sm:inline">
                    /
                  </span>
                )}
                <a
                  href={`#${stage.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="tabular-nums opacity-60">
                    {String(index + 1).padStart(2, '0')}
                  </span>{' '}
                  {stage.label}
                </a>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Stage sections */}
      <div className="flex flex-col gap-20">
        {stages.map((stage, index) => (
          <section
            key={stage.id}
            id={stage.id}
            ref={(el) => {
              sectionRefs.current[stage.id] = el
            }}
            className="scroll-mt-24"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
              {/* Left: stage framing */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm tabular-nums text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {stage.label}
                  </span>
                </div>
                <h2 className="mt-3 text-balance text-2xl font-semibold leading-snug tracking-tight">
                  {stage.headline}
                </h2>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  {stage.summary}
                </p>
              </div>

              {/* Right: capability list */}
              <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {stage.capabilities.map((cap) => (
                  <li key={cap.product} className="group p-5 md:p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="text-pretty text-base font-medium leading-snug">
                        {cap.value}
                      </h3>
                      <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
                        {cap.product}
                      </span>
                    </div>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {cap.detail}
                    </p>
                    <a
                      href={cap.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {cap.linkLabel}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      {/* Closing */}
      <div className="flex items-center justify-between gap-4 border-t border-border pt-8">
        <p className="text-sm text-muted-foreground">{closing.text}</p>
        <Link
          href={closing.href}
          className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-primary transition-opacity hover:opacity-80"
        >
          {closing.linkLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  )
}

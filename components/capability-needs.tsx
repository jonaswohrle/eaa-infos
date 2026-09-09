'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { CAPABILITIES, ROLE_LABELS, type CapabilityGroup, type Role } from '@/lib/capabilities'
import { cn } from '@/lib/utils'
import { linkifyProducts } from '@/lib/product-links'

const ROLES = Object.keys(ROLE_LABELS) as Role[]
const GROUPS: CapabilityGroup[] = ['Build & deploy', 'Identity & governance', 'Connectivity & operations']

export function CapabilityNeeds() {
  const [role, setRole] = useState<Role>('all')
  const relevantCount = role === 'all' ? CAPABILITIES.length : CAPABILITIES.filter((item) => item.roles.includes(role)).length

  return (
    <section id="needs" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mb-10 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand">05 · Needs covered</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">One platform. Different reasons to care.</h2>
        <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">The functionality is shared across the organization. Choose a role to emphasize the needs that most directly move their decision—or view the complete platform story.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div role="tablist" aria-label="Highlight needs by role" className="flex flex-wrap gap-2">
          {ROLES.map((item) => {
            const selected = item === role
            return <button key={item} type="button" role="tab" aria-selected={selected} onClick={() => setRole(item)} className={cn('rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand', selected ? 'border-foreground bg-foreground text-background' : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground')}>{ROLE_LABELS[item]}</button>
          })}
        </div>
        <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">{role === 'all' ? `Showing all ${relevantCount} needs` : `Highlighting ${relevantCount} needs for ${ROLE_LABELS[role]}`}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {GROUPS.map((group) => (
          <div key={group}>
            <div className="border-y border-border bg-muted/50 px-5 py-3 first:border-t-0 sm:px-6"><h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{group}</h3></div>
            <div className="divide-y divide-border">
              {CAPABILITIES.filter((item) => item.group === group).map((item) => {
                const relevant = role === 'all' || item.roles.includes(role)
                return (
                  <article key={item.name} className={cn('grid transition-opacity md:grid-cols-[0.72fr_1fr_0.72fr]', !relevant && 'opacity-35')}>
                    <div className="p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><h4 className="font-semibold">{item.name}</h4>{relevant && role !== 'all' ? <span className="rounded-full bg-brand/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-brand">{ROLE_LABELS[role]}</span> : null}</div><p className="mt-2 text-sm leading-6 text-muted-foreground">{linkifyProducts(item.friction)}</p></div>
                    <div className="border-y border-border bg-muted/20 p-5 md:border-x md:border-y-0 sm:p-6"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Functionality</p><p className="mt-2 text-sm font-medium leading-6">{linkifyProducts(item.functionality)}</p></div>
                    <div className="p-5 sm:p-6"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Outcome</p><p className="mt-2 flex gap-2 text-sm leading-6"><Check className="mt-1 h-4 w-4 shrink-0 text-brand" /><span>{linkifyProducts(item.outcome)}</span></p></div>
                  </article>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><ArrowRight className="h-4 w-4 text-brand" /><span>Role selection changes emphasis only. Every capability remains part of the same platform.</span></div>
    </section>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RichText } from '@/lib/rich-text'
import type { Capability } from '@/lib/types'

const ROLE_LABELS: Record<string, string> = {
  cio: 'CIO',
  cfo: 'CFO',
  cto: 'CTO / VP Eng',
  ciso: 'CISO',
}

function roleLabel(role: string) {
  return ROLE_LABELS[role] ?? role.toUpperCase()
}

function parseRoles(roles: string): string[] {
  return roles
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)
}

export function CapabilitiesView({ capabilities }: { capabilities: Capability[] }) {
  const [role, setRole] = useState<string>('all')

  const allRoles = useMemo(() => {
    const set = new Set<string>()
    capabilities.forEach((c) => parseRoles(c.roles).forEach((r) => set.add(r)))
    return ['all', ...Array.from(set)]
  }, [capabilities])

  const groups = useMemo(() => Array.from(new Set(capabilities.map((c) => c.group_name))), [capabilities])

  const relevantCount =
    role === 'all' ? capabilities.length : capabilities.filter((c) => parseRoles(c.roles).includes(role)).length

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div role="tablist" aria-label="Highlight needs by role" className="flex flex-wrap gap-2">
          {allRoles.map((item) => {
            const selected = item === role
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setRole(item)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                  selected
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                )}
              >
                {item === 'all' ? 'All roles' : roleLabel(item)}
              </button>
            )
          })}
        </div>
        <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {role === 'all'
            ? `Showing all ${relevantCount} needs`
            : `Highlighting ${relevantCount} needs for ${roleLabel(role)}`}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {groups.map((group) => (
          <div key={group}>
            <div className="border-y border-border bg-muted/50 px-5 py-3 first:border-t-0 sm:px-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{group}</h3>
            </div>
            <div className="divide-y divide-border">
              {capabilities
                .filter((c) => c.group_name === group)
                .map((item) => {
                  const roles = parseRoles(item.roles)
                  const relevant = role === 'all' || roles.includes(role)
                  return (
                    <article
                      key={item.id}
                      className={cn('grid transition-opacity md:grid-cols-[0.72fr_1fr_0.72fr]', !relevant && 'opacity-35')}
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm font-semibold text-foreground">{item.name}</h4>
                          {relevant && role !== 'all' ? (
                            <span className="shrink-0 rounded-full bg-brand/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-brand">
                              {roleLabel(role)}
                            </span>
                          ) : null}
                        </div>
                        <RichText
                          html={item.friction}
                          className="mt-2 text-sm leading-6 text-muted-foreground"
                        />
                      </div>
                      <div className="border-y border-border bg-muted/20 p-5 md:border-x md:border-y-0 sm:p-6">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                          Functionality
                        </p>
                        <RichText
                          html={item.functionality}
                          className="mt-2 text-sm font-medium leading-6"
                        />
                      </div>
                      <div className="p-5 sm:p-6">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Outcome</p>
                        <div className="mt-2 flex gap-2 text-sm leading-6">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                          <RichText html={item.outcome} />
                        </div>
                      </div>
                    </article>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowRight className="h-4 w-4 text-brand" aria-hidden="true" />
        <span>Role selection changes emphasis only. Every capability remains part of the same platform.</span>
      </div>
    </div>
  )
}

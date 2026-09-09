'use client'

import { useEffect, useState } from 'react'
import {
  ListChecks,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  SlidersHorizontal,
  TriangleAlert,
  Video,
  Workflow,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function VercelMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 65" aria-hidden="true" className={className} fill="currentColor">
      <path d="M37.59.25l36.95 64H.64l36.95-64z" />
    </svg>
  )
}

const NAV_ITEMS = [
  { href: '#problem', label: 'Problem', icon: TriangleAlert },
  { href: '#requirements', label: 'Requirements', icon: ListChecks },
  { href: '#recordings', label: 'Recordings', icon: Video },
  { href: '#flow', label: 'Flow', icon: Workflow },
  { href: '#needs', label: 'Needs', icon: ShieldCheck },
] as const

export function SideRail() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Publish the desktop rail width so the page content offset stays in sync.
  useEffect(() => {
    document.documentElement.style.setProperty('--rail-w', collapsed ? '4rem' : '16rem')
  }, [collapsed])

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/70 bg-background/80 px-4 backdrop-blur-md md:hidden">
        <span className="flex items-center gap-2">
          <VercelMark className="h-3 w-auto text-foreground" />
        </span>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute left-0 top-0 flex h-full w-72 flex-col gap-1 border-r border-border bg-card p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-foreground">
                  <VercelMark className="h-3 w-auto" />
                  <span className="text-sm font-semibold">Vercel</span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {item.label}
                </a>
              )
            })}
            <a
              href="#calculator"
              onClick={() => setMobileOpen(false)}
              className="mt-3 inline-flex items-center gap-3 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground"
            >
              <SlidersHorizontal className="h-5 w-5 shrink-0" aria-hidden="true" />
              Configure offer
            </a>
          </nav>
        </div>
      ) : null}

      {/* Desktop collapsible rail */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border bg-card/95 backdrop-blur-md transition-[width] duration-200 ease-out md:flex',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        {/* Brand + toggle */}
        <div
          className={cn(
            'flex h-16 items-center border-b border-border',
            collapsed ? 'justify-center px-0' : 'justify-between px-4',
          )}
        >
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label="Expand sidebar"
            >
              <VercelMark className="h-4 w-4" />
            </button>
          ) : (
            <>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="flex items-center gap-1 text-foreground">
                  <VercelMark className="h-3.5 w-3.5" />
                  <span className="text-sm font-semibold">Vercel</span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* Nav */}
        <nav aria-label="Proposal sections" className="flex flex-1 flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                  collapsed ? 'justify-center px-0' : 'px-[9px]',
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {collapsed ? null : <span className="whitespace-nowrap">{item.label}</span>}
              </a>
            )
          })}
        </nav>

        {/* CTA */}
        <div className="px-3 pb-4">
          <a
            href="#calculator"
            title={collapsed ? 'Configure offer' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              collapsed ? 'justify-center px-0' : 'px-[9px]',
            )}
          >
            <SlidersHorizontal className="h-5 w-5 shrink-0" aria-hidden="true" />
            {collapsed ? null : <span className="whitespace-nowrap">Configure offer</span>}
          </a>
        </div>
      </aside>
    </>
  )
}

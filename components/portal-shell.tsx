'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/nav'

function VercelMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 65" aria-hidden="true" className={className} fill="currentColor">
      <path d="M37.59.25l36.95 64H.64l36.95-64z" />
    </svg>
  )
}

function BrandLockup() {
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="flex items-center gap-1 text-foreground">
        <VercelMark className="h-3.5 w-3.5" />
        <span className="text-sm font-semibold">Vercel</span>
      </span>
    </span>
  )
}

function NavContents({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  return (
    <>
      <Link
        href="/"
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          pathname === '/' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <FileText className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>Overview</span>
      </Link>

      <div className="mt-2">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              isActive(link.href)
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                isActive(link.href) ? 'bg-brand' : 'bg-border',
              )}
              aria-hidden="true"
            />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </>
  )
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen">
      {/* Mobile top bar */}
      <header className="portal-mobile-header sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/70 bg-background/80 px-4 backdrop-blur-md md:hidden">
        <BrandLockup />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="portal-mobile-drawer fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-y-auto border-r border-border bg-card p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <BrandLockup />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <NavContents pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </nav>
        </div>
      ) : null}

      {/* Desktop rail */}
      <aside className="portal-sidebar fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-card/95 backdrop-blur-md md:flex">
        <div className="flex h-16 items-center border-b border-border px-4">
          <BrandLockup />
        </div>
        <nav aria-label="Portal sections" className="flex-1 overflow-y-auto px-3 py-4">
          <NavContents pathname={pathname} />
        </nav>
      </aside>

      {/* Content */}
      <div className="portal-content md:pl-64">
        <main className="portal-main mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">{children}</main>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow?: string
  title: string
  description?: string
  breadcrumb?: { label: string; href: string }
}) {
  return (
    <header className="mb-8">
      {breadcrumb ? (
        <nav className="mb-3 flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href={breadcrumb.href} className="hover:text-foreground">
            {breadcrumb.label}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-foreground">{title}</span>
        </nav>
      ) : null}
      {eyebrow ? (
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
      ) : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
    </header>
  )
}

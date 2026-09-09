import { ExternalLink, Shield } from 'lucide-react'
import { RichText } from '@/lib/rich-text'
import type { SecurityItem } from '@/lib/types'

export function SecurityView({ items }: { items: SecurityItem[] }) {
  // Group by category, preserving order
  const groups: { category: string; items: SecurityItem[] }[] = []
  for (const item of items) {
    let group = groups.find((g) => g.category === item.category)
    if (!group) {
      group = { category: item.category, items: [] }
      groups.push(group)
    }
    group.items.push(item)
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No security information yet. Add items to <code>content/security-items.json</code>.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.category}>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">{group.category}</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {group.items.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-brand">
                    <Shield className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <RichText html={item.description} className="mt-1 text-sm leading-6 text-muted-foreground" />
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                      >
                        Open
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

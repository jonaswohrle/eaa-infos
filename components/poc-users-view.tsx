import type { PocUser } from '@/lib/types'
import { RichText } from '@/lib/rich-text'
import { cn } from '@/lib/utils'

function statusClasses(status: string) {
  const s = status.toLowerCase()
  if (s === 'active' || s === 'onboarded') return 'border-foreground bg-foreground text-background'
  if (s === 'invited' || s === 'pending') return 'border-foreground/40 bg-background text-foreground'
  if (s === 'blocked') return 'border-dashed border-foreground/50 bg-background text-foreground'
  return 'border-border bg-muted/50 text-muted-foreground'
}

export function PocUsersView({ users }: { users: PocUser[] }) {
  return (
    <div>
      {users.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
          No POC users added yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.8fr] gap-4 border-b border-border bg-muted/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:grid">
            <span>Name</span>
            <span>Role</span>
            <span>Team</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[1.4fr_1fr_1fr_0.8fr] sm:items-center sm:gap-4"
              >
                <div>
                  <p className="font-semibold text-foreground">{user.name}</p>
                  {user.email ? <p className="text-xs text-muted-foreground">{user.email}</p> : null}
                </div>
                <p className="text-sm text-muted-foreground">{user.role}</p>
                <p className="text-sm text-muted-foreground">{user.team}</p>
                <div className="mt-1 sm:mt-0">
                  <span
                    className={cn(
                      'inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide',
                      statusClasses(user.status),
                    )}
                  >
                    {user.status}
                  </span>
                </div>
                {user.notes ? (
                  <RichText html={user.notes} className="text-xs text-muted-foreground sm:col-span-4" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

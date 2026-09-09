import { ArrowRight, Check, X } from 'lucide-react'

const STAGES = [
  { step: '01', name: 'Build', friction: 'A useful prototype lives on one laptop, outside a governed organization.', outcome: 'Builders use their preferred AI tools, but the output is a governed deployment.' },
  { step: '02', name: 'Share', friction: 'A stakeholder asks for a link. The only option is a screen share.', outcome: 'Every change receives a protected preview URL that is ready to share.' },
  { step: '03', name: 'Deploy', friction: 'Production becomes a platform ticket spanning infrastructure, secrets, and CI/CD.', outcome: 'The same path takes each commit from preview to production with rollback.' },
  { step: '04', name: 'Authenticate', friction: 'Identity is hand-wired for every app—or deferred until security review.', outcome: 'SSO, lifecycle controls, and deployment protection apply by default.' },
  { step: '05', name: 'Govern', friction: 'Ownership, spend, access, and activity are fragmented across personal accounts.', outcome: 'Policy, budgets, owners, and audit events live in one control plane.' },
  { step: '06', name: 'Maintain', friction: 'When the builder moves on, the app becomes an undocumented liability.', outcome: 'Immutable deployments, clear ownership, and instant rollback keep it operable.' },
]

export function ProblemStatement() {
  return (
    <section id="problem" className="scroll-mt-24 pb-20 sm:pb-28">
      <div className="mb-10 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand">01 · The problem</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Building became easy. Operating safely did not.
        </h2>
        <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
          AI lets more people create useful apps and agents. Without a shared path to production,
          each success introduces another deployment, identity, security, ownership, and cost problem.
        </p>
      </div>

      <div className="mb-5 hidden items-center gap-6 px-1 text-label-12 font-mono uppercase tracking-[0.14em] text-muted-foreground sm:flex">
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full border border-border" />Current friction</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-600" />Governed outcome</span>
      </div>

      <div className="grid items-stretch gap-4 md:grid-cols-2 md:grid-rows-[repeat(6,auto)] xl:grid-cols-3 xl:grid-rows-[repeat(4,auto)]">
        {STAGES.map((stage, index) => (
          <article key={stage.name} className="group row-span-3 grid grid-rows-subgrid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-label-12 text-muted-foreground">{stage.step}</span>
                <h3 className="text-heading-16 font-semibold">{stage.name}</h3>
              </div>
              {index < STAGES.length - 1 ? (
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              ) : (
                <span className="rounded-full bg-green-600/10 px-2 py-1 font-mono text-label-12 text-green-700">Live</span>
              )}
            </header>

            <div className="flex gap-3 p-5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div>
                <p className="mb-1 font-mono text-label-12 uppercase tracking-[0.1em] text-muted-foreground">Friction</p>
                <p className="text-copy-14 leading-6 text-muted-foreground">{stage.friction}</p>
              </div>
            </div>

            <div className="flex gap-3 border-t border-green-600/20 bg-green-600/5 p-5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div>
                <p className="mb-1 font-mono text-label-12 uppercase tracking-[0.1em] text-green-700">With Vercel</p>
                <p className="text-copy-14 leading-6 text-foreground">{stage.outcome}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

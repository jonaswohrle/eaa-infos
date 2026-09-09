import { CapabilitiesLifecycle } from '@/components/capabilities-lifecycle'
import { PlatformFlow } from '@/components/platform-flow'
import { getCapabilitiesLifecycle } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function CapabilitiesPage() {
  const content = await getCapabilitiesLifecycle()
  return (
    <div>
      <CapabilitiesLifecycle content={content} />

      {/* Capstone: how every stage connects into one governed surface */}
      <section className="mt-20 border-t border-border pt-12">
        <header className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {content.flow.eyebrow}
          </p>
          <h2 className="mt-4 text-balance text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
            {content.flow.title}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            {content.flow.lead}
          </p>
        </header>
        <div className="mt-10">
          <PlatformFlow showHeader={false} />
        </div>
      </section>
    </div>
  )
}

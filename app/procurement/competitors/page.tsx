import { PageHeader } from '@/components/page-header'
import { StepBanner } from '@/components/step-banner'
import { CompetitorsView } from '@/components/competitors-view'
import { hideCloudflare, hideSinglePersonSharing } from '@/flags'
import { getCompetitorAnalysis, getStepByKey } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function CompetitorsPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string }>
}) {
  const { segment } = await searchParams
  const [shouldHideCloudflare, shouldHideSinglePersonSharing, step] = await Promise.all([
    hideCloudflare(),
    hideSinglePersonSharing(),
    getStepByKey('competitors'),
  ])
  const analysis = await getCompetitorAnalysis({
    hideCloudflare: shouldHideCloudflare,
    hideSinglePersonSharing: shouldHideSinglePersonSharing,
  })

  return (
    <div>
      <PageHeader
        eyebrow={analysis?.eyebrow ?? 'Procurement · Analysis'}
        title={analysis?.title ?? 'Competitor analysis'}
        description={
          analysis?.description ??
          'A capability-by-capability view of the platforms an enterprise could use for internal apps and agents.'
        }
      />
      {step ? <StepBanner step={step} /> : null}
      <div className="mt-10">
        <CompetitorsView analysis={analysis} initialSegment={segment} />
      </div>
    </div>
  )
}

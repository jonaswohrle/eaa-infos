import type { Metadata } from 'next'
import { ExecutiveSummary } from '@/components/executive-summary'
import { hideCloudflare, hideSinglePersonSharing } from '@/flags'
import { buildExecutiveComparison } from '@/lib/executive-summary'
import { getCompetitorAnalysis, getExecutiveSummaryContent } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'EAA Infos — Enterprise Agents & Apps',
  description:
    'The case for giving AI-built applications a governed home: the target operating model, how the alternatives compare across the lifecycle, and a reusable business case.',
}

export default async function OverviewPage() {
  const [content, shouldHideCloudflare, shouldHideSinglePersonSharing] = await Promise.all([
    getExecutiveSummaryContent(),
    hideCloudflare(),
    hideSinglePersonSharing(),
  ])
  const analysis = await getCompetitorAnalysis({
    hideCloudflare: shouldHideCloudflare,
    hideSinglePersonSharing: shouldHideSinglePersonSharing,
  })

  const comparison = analysis ? buildExecutiveComparison(analysis) : null

  return <ExecutiveSummary content={content} comparison={comparison} />
}

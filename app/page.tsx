import type { Metadata } from 'next'
import { ExecutiveSummary } from '@/components/executive-summary'
import { getExecutiveSummaryContent } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Overview — Enterprise Agents & Apps',
  description:
    'Why AI-built applications need a governed home, what a platform has to do about it, and where to read the detail.',
}

export default async function OverviewPage() {
  const content = await getExecutiveSummaryContent()
  return <ExecutiveSummary content={content} />
}

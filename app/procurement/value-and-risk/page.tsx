import { BusinessCaseWorksheet } from '@/components/business-case-worksheet'
import { PageHeader } from '@/components/page-header'
import { getBusinessCase } from '@/lib/business-case'

export const dynamic = 'force-dynamic'

export default async function ValueAndRiskPage() {
  const data = await getBusinessCase()

  return (
    <article className="business-case-document">
      <header className="business-case-print-masthead">
        <div className="business-case-print-lockup">
          <span className="business-case-print-vercel">
            <span className="business-case-print-triangle" aria-hidden="true" />
            Vercel
          </span>
        </div>
        <div className="business-case-print-meta">
          <span>Value and Risk</span>
          <span>POC portal</span>
        </div>
      </header>

      <div className="business-case-page-header">
        <PageHeader
          eyebrow="Procurement · Value and Risk"
          title="Move faster. Remove risk."
          description="The detailed value, risk, measurement methods, qualifications, and primary documentation behind the Vercel business case."
        />
      </div>

      <BusinessCaseWorksheet initial={data} />
    </article>
  )
}

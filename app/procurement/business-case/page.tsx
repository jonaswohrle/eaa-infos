import { BusinessCaseWorksheet } from '@/components/business-case-worksheet'
import { PageHeader } from '@/components/page-header'
import { getBusinessCase } from '@/lib/business-case'

export const dynamic = 'force-dynamic'

export default async function BusinessCasePage() {
  const data = await getBusinessCase()

  return (
    <article className="business-case-document mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <header className="business-case-print-masthead">
        <div className="business-case-print-lockup">
          <span className="business-case-print-vercel">
            <span className="business-case-print-triangle" aria-hidden="true" />
            Vercel
          </span>
        </div>
        <div className="business-case-print-meta">
          <span>Business case</span>
          <span>POC portal</span>
        </div>
      </header>

      <div className="business-case-page-header">
        <PageHeader
          eyebrow="Procurement · Business case"
          title="Move faster. Remove risk."
          description="One governed platform turns every phase from build to maintenance into a controlled path to production. Teams move faster without trading away security, control, or operational resilience."
        />
      </div>

      <BusinessCaseWorksheet initial={data} />
    </article>
  )
}

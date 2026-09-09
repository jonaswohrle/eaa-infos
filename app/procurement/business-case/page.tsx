import type { Metadata } from 'next'
import { ExecutiveSummaryDocument } from '@/components/executive-summary-document'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Business case | EAA Infos',
  description:
    'The executive business case for governing citizen-built applications and AI agents on Vercel.',
}

export default function BusinessCasePage() {
  return (
    <article className="business-case-document executive-business-case-document mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <header className="business-case-print-masthead">
        <div className="business-case-print-lockup">
          <span className="business-case-print-vercel">
            <span className="business-case-print-triangle" aria-hidden="true" />
            Vercel
          </span>
        </div>
        <div className="business-case-print-meta">
          <span>Business case</span>
          <span>Executive brief</span>
        </div>
      </header>

      <div className="business-case-page-header">
        <PageHeader
          eyebrow="Procurement · Business case"
          title="Make governed deployment as easy as application creation."
          description="Employees across the business already create applications with AI coding tools. Those applications will run somewhere. Vercel makes the company-controlled path the easiest route to production."
        />
      </div>

      <ExecutiveSummaryDocument />
    </article>
  )
}

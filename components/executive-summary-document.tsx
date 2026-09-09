'use client'

import Link from 'next/link'
import type { BusinessCaseBrief } from '@/lib/play/types'

/**
 * The executive business case. Content lives in content/business-case-brief.json
 * so the MCP server and this page read the same words — see lib/play.
 */
export function ExecutiveSummaryDocument({ brief }: { brief: BusinessCaseBrief }) {
  return (
    <div className="business-case-executive-summary executive-business-case mt-8 print:mt-0">
      <div className="business-case-toolbar mb-8 flex items-center justify-between gap-4 print:hidden">
        <p className="text-sm leading-6 text-muted-foreground">{brief.toolbarNote}</p>
        <button
          type="button"
          onClick={() => window.print()}
          className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Print / PDF
        </button>
      </div>

      <p className="executive-business-case-thesis text-pretty">{brief.thesis}</p>

      <section className="executive-business-case-method" aria-labelledby="methodology-heading">
        <h2 id="methodology-heading">{brief.methodology.heading}</h2>
        <p>{brief.methodology.body}</p>
      </section>

      {brief.sections.map((section) => (
        <section
          key={section.id}
          className={
            section.pageBreak
              ? 'executive-business-case-section executive-business-case-page-two'
              : 'executive-business-case-section'
          }
          aria-labelledby={`${section.id}-heading`}
        >
          <div className="executive-business-case-section-heading">
            <p>{section.eyebrow}</p>
            <h2 id={`${section.id}-heading`}>{section.heading}</h2>
          </div>
          <div className="executive-business-case-reading">
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>
                {paragraph.map((segment, segmentIndex) =>
                  segment.bold ? (
                    <strong key={segmentIndex}>{segment.text}</strong>
                  ) : (
                    <span key={segmentIndex}>{segment.text}</span>
                  ),
                )}
              </p>
            ))}
            {section.callout ? (
              <p className="executive-business-case-callout">{section.callout}</p>
            ) : null}
          </div>

          {section.id === 'why-vercel' ? (
            <div className="executive-business-case-table-wrap">
              <table>
                <caption className="sr-only">Value created and risk mitigated by Vercel</caption>
                <thead>
                  <tr>
                    <th scope="col">Vercel advantage</th>
                    <th scope="col">Value created</th>
                    <th scope="col">Cost and risk avoided</th>
                    <th scope="col">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {brief.advantages.map((item) => (
                    <tr key={item.advantage}>
                      <th scope="row">{item.advantage}</th>
                      <td>{item.value}</td>
                      <td>{item.risk}</td>
                      <td>{item.fact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ))}

      <div className="executive-business-case-outcomes">
        {brief.outcomes.map((outcome) => (
          <section key={outcome.id} aria-labelledby={`${outcome.id}-heading`}>
            <h2 id={`${outcome.id}-heading`}>{outcome.heading}</h2>
            <p>{outcome.body}</p>
          </section>
        ))}
      </div>

      <section className="executive-business-case-further" aria-labelledby="further-information-heading">
        <h2 id="further-information-heading">{brief.further.heading}</h2>
        <div>
          {brief.further.links.map((link) => (
            <Link key={link.href} href={link.href}>
              <strong>{link.label}</strong>
              <span>{link.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

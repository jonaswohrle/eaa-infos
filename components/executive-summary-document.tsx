'use client'

import Link from 'next/link'

const advantages = [
  {
    advantage: 'From idea to production',
    value:
      'Target 10× faster delivery of applications and agents, with no setup or infrastructure expertise required from builders.',
    risk:
      'Avoids specialist queues, repeated setup, and valuable AI-created applications remaining on laptops.',
    fact: 'Measure time to first use, handoffs, and specialist hours per application.',
  },
  {
    advantage: 'Approved production access',
    value:
      'Applications can use approved company systems through managed credentials and each user’s existing permissions.',
    risk:
      'Prevents copied credentials, excessive access, and a bespoke integration project for every application.',
    fact: 'Measure integration lead time, access exceptions, and credentials exposed to builders.',
  },
  {
    advantage: 'Managed infrastructure',
    value:
      'Applications and agents deploy with zero configuration and scale with demand on one production platform.',
    risk:
      'Avoids per-application Kubernetes work, idle capacity, fragmented runtime stacks, and specialist staffing.',
    fact: 'Measure platform hours, runtime services, and infrastructure cost per application.',
  },
  {
    advantage: 'Governance by default',
    value:
      'Ownership, access, deployments, agent activity, usage, and cost remain visible in one control plane.',
    risk:
      'Contains shadow IT, unknown owners, uncontrolled actions, fragmented audit evidence, and abnormal spend.',
    fact: 'Measure ownership and policy coverage, audit effort, and time to contain abnormal usage.',
  },
  {
    advantage: 'One managed fleet',
    value:
      'Shared operations, platform updates, and Enterprise Support let central IT govern the fleet instead of supporting every stack.',
    risk:
      'Prevents each application becoming a separate maintenance, security, recovery, and support liability.',
    fact: 'Measure internal escalations, recovery time, maintenance hours, and applications per administrator.',
  },
] as const

export function ExecutiveSummaryDocument() {
  return (
    <div className="business-case-executive-summary executive-business-case mt-8 print:mt-0">
      <div className="business-case-toolbar mb-8 flex items-center justify-between gap-4 print:hidden">
        <p className="text-sm leading-6 text-muted-foreground">
          Executive business case · designed for a two-page PDF
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Print / PDF
        </button>
      </div>

      <p className="executive-business-case-thesis text-pretty">
        The enterprise has decentralized application creation. It now needs to centralize how those applications are secured, operated, and governed.
      </p>

      <section className="executive-business-case-method" aria-labelledby="methodology-heading">
        <h2 id="methodology-heading">Methodology</h2>
        <p>
          This case tests the risk of doing nothing, the cost of delay or building internally, and the value created and risk mitigated by Vercel. It uses known facts and outcomes the business can measure directly, not a broad productivity estimate.
        </p>
      </section>

      <section className="executive-business-case-section" aria-labelledby="why-anything-heading">
        <div className="executive-business-case-section-heading">
          <p>Why anything</p>
          <h2 id="why-anything-heading">A prototype creates potential. A governed application creates value.</h2>
        </div>
        <div className="executive-business-case-reading">
          <p>
            A durable business application is <strong>company-owned, securely connected, reliably operated, observable, and transferable.</strong> Without those properties, more creation means more unsupported software, unmanaged access, and hidden cost.
          </p>
          <p>
            The objective is to make each application usable, secure, and supportable without turning it into another central IT project.
          </p>
        </div>
      </section>

      <section className="executive-business-case-section" aria-labelledby="why-now-heading">
        <div className="executive-business-case-section-heading">
          <p>Why now</p>
          <h2 id="why-now-heading">Citizen developers will host their applications. The question is where.</h2>
        </div>
        <div className="executive-business-case-reading">
          <p>
            <strong>Employees across the business already create applications with AI coding tools.</strong> Without an approved route to production, useful applications remain prototypes, wait for central IT, or move to personal accounts and public services.
          </p>
          <p>
            Each outcome destroys value: AI coding licences produce less usable software, specialist demand grows, or ownership, credentials, access, and cost move outside company control.
          </p>
          <p>
            Building internally shifts the same burden to central IT. It must assemble and continuously operate identity, secrets, deployment, scaling, observability, cost controls, recovery, audit, and support.
          </p>
          <p className="executive-business-case-callout">
            Doing nothing is not neutral. It makes fragmented hosting the default and increases the estate the company must later discover, migrate, and govern.
          </p>
        </div>
      </section>

      <section className="executive-business-case-section executive-business-case-page-two" aria-labelledby="why-vercel-heading">
        <div className="executive-business-case-section-heading">
          <p>Why Vercel</p>
          <h2 id="why-vercel-heading">One platform turns citizen development into a governed operating model.</h2>
        </div>
        <div className="executive-business-case-reading">
          <p>
            Vercel is the managed platform for building, running, and governing applications and AI agents. Builders receive a direct route to production. Administrators retain ownership, visibility, and control. Vercel operates and supports the underlying platform.
          </p>
        </div>

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
              {advantages.map((item) => (
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
      </section>

      <div className="executive-business-case-outcomes">
        <section aria-labelledby="value-heading">
          <h2 id="value-heading">Value</h2>
          <p>
            Every new application reuses the same production path, integrations, controls, and operating model. More AI-created applications can reach users while repeated setup, waiting, and central support grow more slowly than the application estate.
          </p>
        </section>
        <section aria-labelledby="risk-heading">
          <h2 id="risk-heading">Risk</h2>
          <p>
            Company ownership, identity, auditability, spend visibility, recovery, and support become defaults. Governance no longer depends on every citizen developer assembling these controls correctly.
          </p>
        </section>
      </div>

      <section className="executive-business-case-further" aria-labelledby="further-information-heading">
        <h2 id="further-information-heading">Further information</h2>
        <div>
          <Link href="/procurement/value-and-risk">
            <strong>Value and Risk</strong>
            <span>Detailed arguments, qualifications, measures, and primary documentation.</span>
          </Link>
          <Link href="/procurement/competitors">
            <strong>Competitor analysis</strong>
            <span>The full vendor matrix, rationale, and sources behind every verdict.</span>
          </Link>
          <Link href="/procurement/commercial">
            <strong>Commercial offer</strong>
            <span>Pricing, commitment assumptions, and commercial terms.</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

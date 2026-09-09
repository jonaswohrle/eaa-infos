'use client'

import { useState } from 'react'

export function ExecutiveSummaryDocument() {
  return (
    <div className="business-case-executive-summary mt-8 print:mt-0">
      <div className="mb-8 border-b pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">Executive Summary</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">One platform. Two groups. Clear governance.</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          Vercel removes the traditional trade-off between speed and control. Builders move fast inside company guardrails. Platform teams keep full visibility and enforceable policy without becoming the bottleneck.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Citizen Developers */}
        <section>
          <h3 className="mb-3 text-sm font-semibold tracking-tight text-foreground">Citizen developers</h3>
          <div className="space-y-4 text-sm leading-6 text-foreground">
            <p>
              <span className="font-medium">Every new idea no longer requires a specialist queue.</span> Builders work in company-owned source, with company identity and company guardrails from the first commit.
            </p>
            <p>
              They see the same production logs, errors, and traces the platform team sees. They diagnose and propose fixes themselves, then validate the change in a governed preview before it reaches production.
            </p>
            <p>
              The platform records every action with owner, time, and reason. Nothing disappears into shadow IT.
            </p>
          </div>
        </section>

        {/* Platform Administrators */}
        <section>
          <h3 className="mb-3 text-sm font-semibold tracking-tight text-foreground">Platform administrators</h3>
          <div className="space-y-4 text-sm leading-6 text-foreground">
            <p>
              <span className="font-medium">One live inventory replaces fragmented lists.</span> Every asset, its owner, its policy status, its spend, and its run history is visible in one place.
            </p>
            <p>
              Alerts and automated responses surface abnormal consumption or traffic while it is still containable. Agent actions are proposed, reviewed, and logged rather than executed unchecked.
            </p>
            <p>
              Governance effort scales with the number of workloads, not the number of people.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="mb-3 text-sm font-semibold tracking-tight text-foreground">Evidence the logic holds</h3>
        <ul className="space-y-2 text-sm leading-6 text-foreground">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            Builders resolve a measurable share of production issues without escalation because the same evidence is available in their workflow.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            Abnormal spend and traffic are contained by layered alerts, reporting, rate limiting, and egress controls rather than discovered after the bill arrives.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            Every deployment carries immutable ownership and audit history, removing the “who owns this and why is it running” problem.
          </li>
        </ul>
      </div>

      <div className="mt-6 text-xs text-muted-foreground">
        The detailed Business Case contains the full set of Value and Risk-mitigated statements, supporting arguments, and documentation links for every phase.
      </div>
    </div>
  )
}

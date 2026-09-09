/**
 * Curated Vercel documentation that substantiates each business-case evidence
 * item. Keyed by the evidence title so links survive database reseeds.
 *
 * Rules:
 * - Maximum 3 links per item; every link must directly prove the claim.
 * - Every URL is verified live (HTTP 200) before being added here.
 * - Prefer docs pages; blog/product pages only when they are the canonical
 *   source for the capability.
 */

export type DocLink = {
  label: string
  href: string
  proves: string
}

export const EVIDENCE_DOC_LINKS: Record<string, DocLink[]> = {
  // -------------------------------------------------------------------------
  // Build
  // -------------------------------------------------------------------------
  'Approved foundations standardize architecture and controls': [
    {
      label: 'v0 Design systems',
      href: 'https://v0.app/docs/design-systems',
      proves: 'Builders start from the company’s approved components, tokens, and patterns.',
    },
    {
      label: 'v0 on Vercel',
      href: 'https://vercel.com/docs/v0',
      proves: 'Generated applications land on the same governed platform, not ad-hoc stacks.',
    },
  ],
  'Managed connections keep credentials out of builder workflows': [
    {
      label: 'Vercel Connect',
      href: 'https://vercel.com/docs/connect',
      proves: 'Applications reach third-party systems through managed, short-lived tokens instead of copied API keys.',
    },
    {
      label: 'Secure backend access with OIDC',
      href: 'https://vercel.com/docs/oidc',
      proves: 'Workloads authenticate to backends by federated identity, with no long-lived secrets to leak.',
    },
    {
      label: 'Sensitive environment variables',
      href: 'https://vercel.com/docs/environment-variables',
      proves: 'Remaining secrets are stored encrypted and injected at runtime, never in prompts or source.',
    },
  ],
  'Guided delivery removes Git and infrastructure expertise': [
    {
      label: 'v0 documentation',
      href: 'https://v0.app/docs',
      proves: 'Builders go from prompt to deployed application through a guided workflow.',
    },
    {
      label: 'Git integration',
      href: 'https://vercel.com/docs/git',
      proves: 'Source control, branches, and deploy-on-push are wired automatically behind the workflow.',
    },
    {
      label: 'Deployments',
      href: 'https://vercel.com/docs/deployments',
      proves: 'Production release is a platform primitive, not an infrastructure project.',
    },
  ],
  'Managed integrations remove data and tooling handoffs': [
    {
      label: 'Vercel Marketplace integrations',
      href: 'https://vercel.com/docs/integrations',
      proves: 'Databases and services are provisioned from the workflow with credentials injected automatically.',
    },
    {
      label: 'Vercel Connect',
      href: 'https://vercel.com/docs/connect',
      proves: 'Tools like Jira, BigQuery, and Slack connect through managed access without builder-held credentials.',
    },
  ],
  'Company-owned source preserves lineage without specialist seats': [
    {
      label: 'Git integration',
      href: 'https://vercel.com/docs/git',
      proves: 'Every application syncs to company-owned repositories with commit-level lineage.',
    },
    {
      label: 'v0 documentation',
      href: 'https://v0.app/docs',
      proves: 'Builders produce governed source without needing direct repository seats.',
    },
  ],

  // -------------------------------------------------------------------------
  // Share
  // -------------------------------------------------------------------------
  'Governed sharing keeps applications private, visible, and revocable': [
    {
      label: 'Deployment Protection',
      href: 'https://vercel.com/docs/deployment-protection',
      proves: 'Shared applications require authentication by default; nothing is public by accident.',
    },
    {
      label: 'Access Groups',
      href: 'https://vercel.com/docs/rbac/access-groups',
      proves: 'Audiences are managed centrally per project group, not per personal link.',
    },
    {
      label: 'Directory Sync',
      href: 'https://vercel.com/docs/directory-sync',
      proves: 'Offboarding in the identity provider revokes access across the estate automatically.',
    },
  ],
  'Protected working previews let stakeholders test every change': [
    {
      label: 'Preview environments',
      href: 'https://vercel.com/docs/deployments/environments',
      proves: 'Every change produces a runnable preview deployment at its own URL.',
    },
    {
      label: 'Deployment Protection',
      href: 'https://vercel.com/docs/deployment-protection',
      proves: 'Previews stay restricted to approved reviewers while remaining fully testable.',
    },
  ],
  'Version-linked feedback removes clarification cycles': [
    {
      label: 'Comments on previews',
      href: 'https://vercel.com/docs/comments',
      proves: 'Reviewers comment directly on the running preview, pinned to the exact deployment they saw.',
    },
  ],

  // -------------------------------------------------------------------------
  // Deploy
  // -------------------------------------------------------------------------
  'Managed production removes per-application Kubernetes setup': [
    {
      label: 'Framework-defined infrastructure',
      href: 'https://vercel.com/blog/framework-defined-infrastructure',
      proves: 'Compute, routing, and caching are derived from the application code at build time.',
    },
    {
      label: 'Deployments',
      href: 'https://vercel.com/docs/deployments',
      proves: 'Production requires no cluster configuration or per-application platform tickets.',
    },
  ],
  'Automatic scaling removes idle capacity without limiting peaks': [
    {
      label: 'Fluid compute',
      href: 'https://vercel.com/docs/fluid-compute',
      proves: 'Compute scales with demand and bills for active execution, not reserved capacity.',
    },
    {
      label: 'Vercel Functions',
      href: 'https://vercel.com/docs/functions',
      proves: 'Applications scale to zero when idle and absorb sudden company-wide adoption.',
    },
  ],
  'One runtime supports interfaces, APIs, background work, and agents': [
    {
      label: 'Fluid compute',
      href: 'https://vercel.com/docs/fluid-compute',
      proves: 'Interactive, API, and long-running work share one managed execution model.',
    },
    {
      label: 'Container images',
      href: 'https://vercel.com/docs/functions/container-images',
      proves: 'Workloads beyond functions — any language, any runtime — ship as containers on the same deploy flow.',
    },
    {
      label: 'Workflow',
      href: 'https://vercel.com/docs/workflow',
      proves: 'Durable background jobs and agent workflows run without a separate worker and queue estate.',
    },
  ],
  'Immutable releases give every application one recovery point': [
    {
      label: 'Deployments',
      href: 'https://vercel.com/docs/deployments',
      proves: 'Each release is a single immutable unit — frontend, APIs, and configuration ship together.',
    },
    {
      label: 'Instant Rollback',
      href: 'https://vercel.com/docs/instant-rollback',
      proves: 'Recovery is one action back to a known-good deployment, not a specialist reconstruction.',
    },
  ],

  // -------------------------------------------------------------------------
  // Authenticate
  // -------------------------------------------------------------------------
  'Identity protection is on by default for every application': [
    {
      label: 'Deployment Protection',
      href: 'https://vercel.com/docs/deployment-protection',
      proves: 'Vercel Authentication gates deployments by default — builders cannot forget access control.',
    },
    {
      label: 'SAML SSO',
      href: 'https://vercel.com/docs/saml',
      proves: 'Access is enforced through the company identity provider, not local accounts.',
    },
    {
      label: 'Directory Sync',
      href: 'https://vercel.com/docs/directory-sync',
      proves: 'Central identity removal revokes application access across the estate.',
    },
  ],
  'User identity carries existing permissions into production systems': [
    {
      label: 'Vercel Connect',
      href: 'https://vercel.com/docs/connect',
      proves: 'Connections act on behalf of the signed-in user, so source systems apply that user’s own permissions.',
    },
    {
      label: 'Secure backend access with OIDC',
      href: 'https://vercel.com/docs/oidc',
      proves: 'Workload identity is asserted per request instead of a shared service credential.',
    },
  ],
  'End-to-end attribution follows consequential actions': [
    {
      label: 'Vercel Connect',
      href: 'https://vercel.com/docs/connect',
      proves: 'Downstream calls carry the initiating user, keeping the identity chain intact past the application boundary.',
    },
    {
      label: 'Audit Logs',
      href: 'https://vercel.com/docs/audit-log',
      proves: 'Platform actions are recorded per named actor for investigation and compliance.',
    },
  ],

  // -------------------------------------------------------------------------
  // Govern
  // -------------------------------------------------------------------------
  'One inventory connects every asset to its owner and operating record': [
    {
      label: 'Projects',
      href: 'https://vercel.com/docs/projects',
      proves: 'Every application is a registered project with an owning team, source, and deployment history.',
    },
    {
      label: 'Role-based access control',
      href: 'https://vercel.com/docs/rbac',
      proves: 'Ownership and responsibility are explicit roles, not tribal knowledge.',
    },
  ],
  'Layered controls reduce the risk of excessive bills': [
    {
      label: 'Spend Management',
      href: 'https://vercel.com/docs/spend-management',
      proves: 'Spend thresholds can notify responsible teams, trigger an automated response, or pause production workloads.',
    },
    {
      label: 'AI Gateway Custom Reporting',
      href: 'https://vercel.com/docs/ai-gateway/observability-and-spend/custom-reporting',
      proves: 'AI costs and token use can be traced by model, user, tag, provider, or credential type so abnormal consumption is visible and attributable.',
    },
    {
      label: 'WAF Rate Limiting',
      href: 'https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting',
      proves: 'Abusive or accidental request volume can be constrained before it reaches application resources or paid external services.',
    },
  ],
  'Ingress and sandbox egress controls contain runaway or abusive traffic': [
    {
      label: 'WAF Rate Limiting',
      href: 'https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting',
      proves: 'Inbound request rates can be bounded before unintended traffic reaches application resources or external services.',
    },
    {
      label: 'WAF Custom Rules',
      href: 'https://vercel.com/docs/vercel-firewall/vercel-waf/custom-rules',
      proves: 'Edge rules can log, deny, challenge, bypass, or rate-limit matching incoming traffic without a redeployment.',
    },
    {
      label: 'Sandbox firewall',
      href: 'https://vercel.com/docs/sandbox/concepts/firewall',
      proves: 'Sandbox egress can be denied completely or restricted to approved domains and network ranges before code runs.',
    },
  ],
  'One audit chain connects identity, code, deployment, and activity': [
    {
      label: 'Audit Logs',
      href: 'https://vercel.com/docs/audit-log',
      proves: 'Identity-linked platform events are exportable for compliance review.',
    },
    {
      label: 'Log Drains',
      href: 'https://vercel.com/docs/log-drains',
      proves: 'Runtime and deployment activity streams into the company’s own security systems.',
    },
  ],
  'Governed run records make agent actions reviewable and containable': [
    {
      label: 'Agents on Vercel',
      href: 'https://vercel.com/docs/agents',
      proves: 'Agent workloads run on governed platform primitives rather than unmanaged scripts.',
    },
    {
      label: 'AI Gateway',
      href: 'https://vercel.com/docs/ai-gateway',
      proves: 'Model usage, cost, and behavior are observable and attributable per application.',
    },
    {
      label: 'Observability',
      href: 'https://vercel.com/docs/observability',
      proves: 'Each run leaves traces and logs that support review and containment.',
    },
  ],

  // -------------------------------------------------------------------------
  // Maintain
  // -------------------------------------------------------------------------
  'One managed fleet absorbs platform maintenance across the estate': [
    {
      label: 'Managed Infrastructure',
      href: 'https://vercel.com/products/managed-infrastructure',
      proves: 'Capacity, runtime patching, and platform upgrades are Vercel’s responsibility, fleet-wide.',
    },
    {
      label: 'Framework-defined infrastructure',
      href: 'https://vercel.com/blog/framework-defined-infrastructure',
      proves: 'There is no per-application infrastructure estate to maintain as applications accumulate.',
    },
  ],
  'Standard structure and company-owned source make ownership transferable': [
    {
      label: 'Git integration',
      href: 'https://vercel.com/docs/git',
      proves: 'Source lives in company repositories, so a new team can take over the code.',
    },
    {
      label: 'Role-based access control',
      href: 'https://vercel.com/docs/rbac',
      proves: 'Project ownership reassigns explicitly when the original builder moves on.',
    },
  ],
  'Default telemetry shortens diagnosis before specialist escalation': [
    {
      label: 'Observability',
      href: 'https://vercel.com/docs/observability',
      proves: 'Every application gets monitoring, tracing, and query-level insight without setup.',
    },
    {
      label: 'Runtime Logs',
      href: 'https://vercel.com/docs/runtime-logs',
      proves: 'Builders can read their own application logs and triage failures before escalating.',
    },
  ],
  'Enterprise support absorbs platform questions as adoption grows': [
    {
      label: 'Enterprise plan',
      href: 'https://vercel.com/docs/plans/enterprise',
      proves: 'Enterprise support and SLAs handle platform questions instead of the internal team.',
    },
  ],
  'Portfolio visibility supports improvement, transfer, and retirement': [
    {
      label: 'Web Analytics',
      href: 'https://vercel.com/docs/analytics',
      proves: 'Actual usage per application separates valuable tools from abandoned ones.',
    },
    {
      label: 'Observability',
      href: 'https://vercel.com/docs/observability',
      proves: 'Operating health is visible across the portfolio without per-application instrumentation.',
    },
    {
      label: 'Spend Management',
      href: 'https://vercel.com/docs/spend-management',
      proves: 'Cost per application identifies candidates for transfer or retirement.',
    },
  ],
}

export function docLinksFor(title: string): DocLink[] {
  return EVIDENCE_DOC_LINKS[title] ?? []
}

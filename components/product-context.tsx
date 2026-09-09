import { Bot, Boxes, Cpu, Fingerprint, KeyRound, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { linkifyProducts } from '@/lib/product-links'

type Product = {
  icon: LucideIcon
  name: string
  summary: string
  points: string[]
}

const PRODUCTS: Product[] = [
  {
    icon: Fingerprint,
    name: 'Vercel Passport',
    summary:
      'Puts every internal app and agent behind your identity provider by default, so access is controlled with Okta, Microsoft Entra, Auth0, or any OpenID Connect provider.',
    points: [
      'Deployments are private from the moment they exist',
      'Configure your IdP once — applied across every deployment',
      'Every entry is auditable; admins set policy centrally',
    ],
  },
  {
    icon: KeyRound,
    name: 'Vercel Connect',
    summary:
      'Gives apps and agents secure, short-lived, scoped credentials for the systems they use — replacing long-lived static keys sitting in environment variables.',
    points: [
      'Tokens granted per task and expire when the task completes',
      'Consolidates OAuth, OIDC, and secret injection into one product',
      'Secure access to Slack, GitHub, Snowflake, Salesforce, and Linear',
    ],
  },
  {
    icon: Boxes,
    name: 'Enterprise Managed Users',
    summary:
      'Full lifecycle control over every Vercel and v0 user through your existing directory, built on SAML SSO and Directory Sync.',
    points: [
      'Seats provisioned and off-boarded via your identity provider',
      'Group-based access, deployment protection, and MFA org-wide',
      'Every action lands in a single audit trail',
    ],
  },
  {
    icon: Sparkles,
    name: 'v0',
    summary:
      "Vercel's AI app builder lets anyone safely build data apps backed by your systems without an engineering ticket.",
    points: [
      'Access to v0 controlled through your IdP',
      'Data stays internal — you decide who gets a seat',
      'Apps can deploy directly into your governed Vercel organization',
    ],
  },
  {
    icon: Cpu,
    name: 'Agent infrastructure primitives',
    summary:
      'Build and deploy agents on state-of-the-art infrastructure — Vercel Sandbox for isolated code execution, Fluid Compute for long-running work, and Workflows for durable orchestration.',
    points: [
      'Vercel Sandbox runs untrusted, agent-generated code in isolation',
      'Fluid Compute keeps agents alive for long tasks without idle cost',
      'Workflows make multi-step agent runs durable and resumable',
    ],
  },
  {
    icon: Bot,
    name: 'Agent ready',
    summary:
      'Agents operate Vercel seamlessly thanks to the Vercel CLI and the Vercel plugin for coding agents.',
    points: [
      'Coding agents can deploy on behalf of your non-technical users',
      'The Vercel CLI and coding-agent plugin give agents first-class access',
      'Vercel Agent monitors your infrastructure for you on Vercel',
    ],
  },
]

export function ProductContext() {
  return (
    <section id="products" className="scroll-mt-20">
      <div className="mb-6 max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight text-foreground text-balance">
          What&apos;s inside the platform
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Vercel for Enterprise Apps and Agents makes ownership, access, and security the defaults
          your builders inherit. Here are the components relevant to this play.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PRODUCTS.map((product) => {
          const Icon = product.icon
          return (
            <article
              key={product.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/20"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-foreground">{linkifyProducts(product.name)}</h3>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{linkifyProducts(product.summary)}</p>

              <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                {product.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    <span className="leading-relaxed text-muted-foreground">{linkifyProducts(point)}</span>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}

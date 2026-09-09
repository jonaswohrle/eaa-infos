import type { ReactNode } from 'react'

/**
 * Central registry that maps Vercel product names (and common aliases) to their
 * canonical Vercel URL. Landing pages are preferred; where a product has no
 * dedicated landing page we fall back to its documentation page.
 *
 * Verified July 2026 against vercel.com. Update the URL here and every mention
 * across the site is relinked automatically via `linkifyProducts`.
 */
type ProductLink = { aliases: string[]; url: string }

export const PRODUCT_LINKS: ProductLink[] = [
  // Landing pages
  { aliases: ['AI Gateway'], url: 'https://vercel.com/ai-gateway' },
  { aliases: ['Fluid Compute'], url: 'https://vercel.com/fluid' },
  { aliases: ['v0'], url: 'https://v0.app' },
  { aliases: ['Marketplace integrations', 'Marketplace'], url: 'https://vercel.com/marketplace' },
  // Docs pages (no standalone landing page)
  { aliases: ['Vercel Passport', 'Passport'], url: 'https://vercel.com/docs/deployment-protection' },
  {
    aliases: ['Advanced Deployment Protection', 'Deployment Protection', 'deployment protection'],
    url: 'https://vercel.com/docs/deployment-protection',
  },
  {
    aliases: ['SAML Single Sign-On (SSO)', 'SAML Single Sign-On', 'SAML SSO', 'Single Sign-On (SSO)', 'Single Sign-On', 'SSO'],
    url: 'https://vercel.com/docs/saml',
  },
  { aliases: ['Enterprise Managed Users', 'managed users'], url: 'https://vercel.com/docs/saml' },
  { aliases: ['Directory Sync'], url: 'https://vercel.com/docs/directory-sync' },
  { aliases: ['Secure Compute'], url: 'https://vercel.com/docs/secure-compute' },
  { aliases: ['Static IPs (shared pool)', 'Static IPs', 'Static IP', 'static egress'], url: 'https://vercel.com/docs/secure-compute' },
  { aliases: ['Private Link'], url: 'https://vercel.com/docs/secure-compute' },
  { aliases: ['Vercel Connect', 'Connect'], url: 'https://vercel.com/docs/connect' },
  { aliases: ['Observability'], url: 'https://vercel.com/docs/observability' },
  { aliases: ['audit logging', 'audit logs', 'Audit logs', 'audit log', 'Audit log'], url: 'https://vercel.com/docs/audit-log' },
  { aliases: ['Isolated sandboxes', 'Vercel Sandbox', 'sandboxes'], url: 'https://vercel.com/docs/vercel-sandbox' },
  { aliases: ['durable workflows', 'Workflows'], url: 'https://vercel.com/docs/workflows' },
]

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Flatten to alias→url pairs, longest alias first so the combined matcher
// prefers "Vercel Connect" over the shorter "Connect".
const ALIAS_ENTRIES = PRODUCT_LINKS.flatMap((product) =>
  product.aliases.map((alias) => ({ alias, url: product.url })),
).sort((a, b) => b.alias.length - a.alias.length)

const ALIAS_URL = new Map(ALIAS_ENTRIES.map((entry) => [entry.alias, entry.url]))

// Match a known product term only when it is not part of a larger word, and
// never treat the "Connect" in the "OpenID Connect" protocol as the product.
const MATCHER = new RegExp(
  `(?<![A-Za-z0-9])(?<!OpenID )(${ALIAS_ENTRIES.map((entry) => escapeRegExp(entry.alias)).join('|')})(?![A-Za-z0-9])`,
  'g',
)

const anchorClass =
  'font-medium text-brand underline decoration-brand/30 underline-offset-2 transition-colors hover:decoration-brand'

/**
 * Returns the text with the first mention of each Vercel product wrapped in a
 * link to its landing/docs page. Each product is linked at most once per block
 * to avoid a wall of underlines. Unknown text is returned untouched.
 */
export function linkifyProducts(text: string): ReactNode {
  if (!text) return text

  const usedUrls = new Set<string>()
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null

  MATCHER.lastIndex = 0
  while ((match = MATCHER.exec(text)) !== null) {
    const alias = match[1]
    const url = ALIAS_URL.get(alias)
    // Skip if unknown or this product is already linked in this block — the
    // matched text stays in the pending range and is emitted as plain text.
    if (!url || usedUrls.has(url)) continue
    usedUrls.add(url)

    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    nodes.push(
      <a key={key++} href={url} target="_blank" rel="noreferrer" className={anchorClass}>
        {alias}
      </a>,
    )
    lastIndex = match.index + alias.length
  }

  if (nodes.length === 0) return text
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

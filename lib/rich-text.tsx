import { cn } from '@/lib/utils'
import { PRODUCT_LINKS } from '@/lib/product-links'

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
 * Wrap the first mention of each known Vercel product with a link, operating on
 * a single run of plain text. Each product is linked at most once per block
 * (tracked via `usedUrls`).
 */
function linkifyTextSegment(text: string, usedUrls: Set<string>): string {
  MATCHER.lastIndex = 0
  return text.replace(MATCHER, (match, alias: string) => {
    const url = ALIAS_URL.get(alias)
    if (!url || usedUrls.has(url)) return match
    usedUrls.add(url)
    return `<a href="${url}" target="_blank" rel="noreferrer" class="${anchorClass}">${alias}</a>`
  })
}

/**
 * Returns HTML with product mentions linked. HTML-aware: it only linkifies text
 * that sits OUTSIDE of tags and outside existing anchors, so it is safe to run
 * over TipTap-authored HTML as well as legacy plain-text content.
 */
export function linkifyHtml(html: string): string {
  if (!html) return ''
  const usedUrls = new Set<string>()
  // Split into tag tokens and text tokens, keeping the tags.
  const tokens = html.split(/(<[^>]+>)/g)
  let anchorDepth = 0
  return tokens
    .map((token) => {
      if (token.startsWith('<')) {
        const lower = token.toLowerCase()
        if (lower.startsWith('<a')) anchorDepth += 1
        else if (lower.startsWith('</a')) anchorDepth = Math.max(0, anchorDepth - 1)
        return token
      }
      if (anchorDepth > 0 || token.trim() === '') return token
      return linkifyTextSegment(token, usedUrls)
    })
    .join('')
}

/**
 * Renders admin-authored rich text (TipTap HTML, or legacy plain text) with
 * product auto-linking applied. Content is trusted (admin-only editing).
 */
export function RichText({
  html,
  className,
  as: Tag = 'div',
}: {
  html: string | null | undefined
  className?: string
  as?: 'div' | 'span'
}) {
  const value = html ?? ''
  if (!value.trim()) return null
  return (
    <Tag
      className={cn('rich-text', className)}
      dangerouslySetInnerHTML={{ __html: linkifyHtml(value) }}
    />
  )
}

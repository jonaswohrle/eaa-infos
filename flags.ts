import { vercelAdapter } from '@flags-sdk/vercel'
import { flag } from 'flags/next'

/**
 * The Vercel flags adapter throws when the project has no flag definitions,
 * which would take the whole site down rather than degrade. These toggles are
 * presentation-only, so an unreachable or unconfigured flags service should
 * simply mean "show everything".
 */
function optionalFlag(key: string, description: string, defaultValue = false) {
  const adapter = vercelAdapter<boolean, unknown>()
  return flag<boolean>({
    key,
    description,
    defaultValue,
    adapter: {
      ...adapter,
      async decide(params) {
        try {
          const value = await adapter.decide(params)
          return typeof value === 'boolean' ? value : defaultValue
        } catch {
          return defaultValue
        }
      },
    },
  })
}

export const hidePocUsers = optionalFlag(
  'hide-poc-users',
  'Hide the POC roles section from navigation and direct access',
)

export const hideCloudflare = optionalFlag(
  'hide-cloudflare',
  'Hide Cloudflare from the competitor analysis',
)

export const hideSinglePersonSharing = optionalFlag(
  'hide-single-person-sharing',
  'Hide the single-person sharing capability from the competitor analysis',
)

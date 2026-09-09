import { vercelAdapter } from '@flags-sdk/vercel'
import { flag } from 'flags/next'

/**
 * The adapter throws when a project has no flag definitions, which would take
 * every page down. These toggles are presentation-only, so an unconfigured
 * flags service should just mean "show everything".
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

export const hideCloudflare = optionalFlag('hide-cloudflare', 'Hide Cloudflare from the competitor analysis')

export const hideSinglePersonSharing = optionalFlag('hide-single-person-sharing', 'Hide the single-person sharing capability from the competitor analysis')

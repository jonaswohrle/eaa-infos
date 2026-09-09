import 'server-only'

import { comarkContent } from 'comark-content'
import json from 'comark-content/plugins/json'
import fs from 'comark-content/sources/fs'

function createContent() {
  return comarkContent({
    source: fs('./content'),
    plugins: [json({ onError: 'throw' })],
    onError: 'throw',
  })
}

const globalForContent = globalThis as typeof globalThis & {
  __deliveryHeroContent?: ReturnType<typeof createContent>
  __deliveryHeroContentWatcher?: Promise<() => Promise<void>>
}

export const content = globalForContent.__deliveryHeroContent ?? createContent()

if (process.env.NODE_ENV === 'development') {
  globalForContent.__deliveryHeroContent = content
  globalForContent.__deliveryHeroContentWatcher ??= content.watch()
}

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createReviewClient, IN_REVIEW_STATUS } from './content-review-db.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDirectory = resolve(repositoryRoot, 'content-reviews')
const outputPath = resolve(outputDirectory, 'in-review.json')
const client = createReviewClient()
await client.connect()

try {
  const { rows } = await client.query(
    `SELECT id, collection, item_key, proposed_data, status, submitted_by, notes,
      created_at::text, updated_at::text
     FROM content_review_items
     WHERE status = $1
     ORDER BY created_at, id`,
    [IN_REVIEW_STATUS],
  )
  await mkdir(outputDirectory, { recursive: true })
  await writeFile(outputPath, `${JSON.stringify({ items: rows }, null, 2)}\n`)
  console.log(`Exported ${rows.length} in-review content proposal(s).`)
} finally {
  await client.end()
}

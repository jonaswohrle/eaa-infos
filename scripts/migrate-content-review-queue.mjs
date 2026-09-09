import { createReviewClient } from './content-review-db.mjs'

const client = createReviewClient()
await client.connect()

try {
  await client.query('BEGIN')
  await client.query(`
    CREATE TABLE IF NOT EXISTS content_review_items (
      id text PRIMARY KEY,
      collection text NOT NULL,
      item_key text NOT NULL,
      proposed_data jsonb NOT NULL,
      status text NOT NULL DEFAULT 'in-review'
        CHECK (status IN ('in-review', 'accepted', 'rejected')),
      submitted_by text NOT NULL DEFAULT '',
      notes text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `)
  await client.query(`
    CREATE INDEX IF NOT EXISTS content_review_items_status_created_at_idx
      ON content_review_items (status, created_at, id)
  `)
  await client.query('COMMIT')
  console.log('Content review queue is ready.')
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  await client.end()
}

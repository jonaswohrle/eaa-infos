import { randomUUID } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createReviewClient,
  IN_REVIEW_STATUS,
  readArguments,
} from './content-review-db.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = readArguments(process.argv.slice(2))
const collection = args.get('collection')
const itemKey = args.get('item-key')
const proposalFile = args.get('file')
const submittedBy = args.get('submitted-by') ?? ''
const notes = args.get('notes') ?? ''

if (!collection || !itemKey || !proposalFile) {
  throw new Error('Required arguments: --collection, --item-key, and --file.')
}

const collections = new Set(
  (await readdir(resolve(repositoryRoot, 'content')))
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.slice(0, -'.json'.length)),
)
if (!collections.has(collection)) {
  throw new Error(`Unknown collection "${collection}". It must match a JSON file in content/.`)
}

const proposalPath = resolve(process.cwd(), proposalFile)
const proposedData = JSON.parse(await readFile(proposalPath, 'utf8'))
if (!proposedData || typeof proposedData !== 'object' || Array.isArray(proposedData)) {
  throw new Error('The proposal file must contain one JSON object.')
}

const id = randomUUID()
const client = createReviewClient()
await client.connect()

try {
  await client.query(
    `INSERT INTO content_review_items
      (id, collection, item_key, proposed_data, status, submitted_by, notes)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)`,
    [id, collection, itemKey, JSON.stringify(proposedData), IN_REVIEW_STATUS, submittedBy, notes],
  )
  console.log(`Created review ${id} with status ${IN_REVIEW_STATUS}.`)
} finally {
  await client.end()
}

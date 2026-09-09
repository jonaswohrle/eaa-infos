import pg from 'pg'

export const IN_REVIEW_STATUS = 'in-review'

function resolveConnectionString() {
  for (const value of [process.env.POSTGRES_URL, process.env.DATABASE_URL]) {
    if (value && /^postgres(ql)?:\/\//.test(value)) return value
  }
  throw new Error('No direct postgres:// connection string found (POSTGRES_URL / DATABASE_URL).')
}

export function createReviewClient() {
  return new pg.Client({
    connectionString: resolveConnectionString(),
    ssl: { rejectUnauthorized: false },
  })
}

export function readArguments(argv) {
  const values = new Map()
  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index]
    const value = argv[index + 1]
    if (!name?.startsWith('--') || value == null || value.startsWith('--')) {
      throw new Error(`Expected --name value arguments; received ${name ?? 'nothing'}.`)
    }
    values.set(name.slice(2), value)
  }
  return values
}

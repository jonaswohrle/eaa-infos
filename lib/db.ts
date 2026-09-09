import 'server-only'
import { Pool } from 'pg'

// Single shared pool across hot reloads in development.
const globalForDb = globalThis as typeof globalThis & {
  __deliveryHeroPool?: Pool
}

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL

export const pool =
  globalForDb.__deliveryHeroPool ??
  new Pool({
    connectionString,
    ssl: connectionString?.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
    max: 3,
  })

if (process.env.NODE_ENV === 'development') {
  globalForDb.__deliveryHeroPool = pool
}

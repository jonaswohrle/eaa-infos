import 'server-only'
import { Signer } from '@aws-sdk/rds-signer'
import { attachDatabasePool } from '@vercel/functions'
import { awsCredentialsProvider } from '@vercel/functions/oidc'
import { Pool, type ClientBase } from 'pg'

/**
 * Amazon Aurora PostgreSQL over Vercel OIDC federation + RDS IAM auth.
 *
 * There is no connection string and no stored password: the function exchanges
 * its OIDC token for AWS credentials, then signs a short-lived auth token per
 * connection. `password` is a function so `pg` re-signs on reconnect rather
 * than caching a token past its 15-minute lifetime.
 */

const { PGHOST, PGPORT, PGUSER, PGDATABASE, AWS_REGION, AWS_ROLE_ARN } = process.env

/** The Aurora resource is connected via the Vercel marketplace integration. */
export const isDatabaseConfigured = Boolean(PGHOST && PGUSER && AWS_REGION && AWS_ROLE_ARN)

const globalForDb = globalThis as typeof globalThis & { __eaaPool?: Pool }

function createPool(): Pool {
  if (!isDatabaseConfigured) {
    throw new Error(
      'Aurora is not configured. Connect the Amazon Aurora PostgreSQL resource to this project, ' +
        'then run `vercel env pull` (expects PGHOST, PGUSER, AWS_REGION, AWS_ROLE_ARN).',
    )
  }

  const host = PGHOST as string
  const user = PGUSER as string
  const region = AWS_REGION as string
  const roleArn = AWS_ROLE_ARN as string
  const port = Number(PGPORT ?? 5432)

  const signer = new Signer({
    hostname: host,
    port,
    username: user,
    region,
    credentials: awsCredentialsProvider({ roleArn, clientConfig: { region } }),
  })

  const pool = new Pool({
    host,
    port,
    user,
    database: PGDATABASE || 'postgres',
    password: () => signer.getAuthToken(),
    ssl: { rejectUnauthorized: false },
    max: 20,
  })

  // Lets Fluid Compute drain connections before an instance is frozen.
  attachDatabasePool(pool)
  return pool
}

export function getPool(): Pool {
  const pool = globalForDb.__eaaPool ?? createPool()
  if (process.env.NODE_ENV === 'development') globalForDb.__eaaPool = pool
  return pool
}

export async function query<T extends Record<string, unknown>>(sql: string, args: unknown[] = []) {
  return getPool().query<T>(sql, args)
}

export async function withConnection<T>(fn: (client: ClientBase) => Promise<T>): Promise<T> {
  const client = await getPool().connect()
  try {
    return await fn(client)
  } finally {
    client.release()
  }
}

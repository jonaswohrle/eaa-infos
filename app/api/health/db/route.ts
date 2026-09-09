import { NextResponse } from 'next/server'
import { isDatabaseConfigured, query } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Connectivity probe for the Aurora PostgreSQL resource. Reports `configured:
 * false` rather than failing when the integration has not been connected yet,
 * so the site stays up while the database is still being provisioned.
 */
export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { ok: false, configured: false, reason: 'Aurora resource not connected to this project' },
      { status: 503 },
    )
  }

  try {
    const started = Date.now()
    const result = await query<{ now: string }>('select now() as now')
    return NextResponse.json({
      ok: true,
      configured: true,
      serverTime: result.rows[0]?.now ?? null,
      latencyMs: Date.now() - started,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, configured: true, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

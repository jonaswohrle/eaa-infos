import type {
  CompetitorAnalysis,
  CompetitorAnalysisSourceRow,
  CompetitorSource,
  CompetitorVerdict,
  CompetitorVendor,
} from '@/lib/types'

const SEGMENTS = [
  {
    id: 'build',
    label: 'Build',
    summary: 'How fast can an employee turn an idea into a standardized working app?',
  },
  {
    id: 'share',
    label: 'Share',
    summary: 'Who can see an app or the draft of an app?',
  },
  {
    id: 'deploy',
    label: 'Deploy',
    summary: 'When an app goes live, nobody worries about infrastructure.',
  },
  {
    id: 'authenticate',
    label: 'Authenticate',
    summary: 'Builders never handles credentials, Identity is derived from IDP',
  },
  {
    id: 'govern',
    label: 'Govern',
    summary: 'Company-level control and proof',
  },
  {
    id: 'maintain',
    label: 'Maintain',
    summary: 'What happens after the first deploy',
  },
] as const

const VENDOR_ORDER = ['Vercel', 'AWS', 'Netlify', 'Cloudflare', 'Dokploy', 'Internally Built @ DH']

const VENDOR_DESCRIPTORS: Record<string, string> = {
  Vercel: 'Unified EAA platform',
  AWS: 'Composable cloud services',
  Netlify: 'Web delivery platform',
  Cloudflare: 'Developer platform',
  Dokploy: 'Self-hosted application platform',
  'Internally Built @ DH': 'Current internal platform',
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalizeVerdict(answer: string): CompetitorVerdict {
  const beforeEmDash = answer.split(/\s+[—–]\s+/u)[0]
  const withoutEmoji = beforeEmDash.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '')
  const match = withoutEmoji.match(/\b(yes|partial|no)\b/i)

  if (!match) throw new Error(`Unsupported competitor verdict: ${answer}`)
  return match[1].toLowerCase() as CompetitorVerdict
}

function toSource(source: string): CompetitorSource {
  const internal = /\s+\(internal\)\s*$/i.test(source)
  const url = source.replace(/\s+\(internal\)\s*$/i, '')
  const hostname = new URL(url).hostname.replace(/^www\./, '')

  return {
    title: internal ? `${hostname} · Internal` : hostname,
    url,
  }
}

function getVendorNames(rows: CompetitorAnalysisSourceRow[], hiddenVendorNames: ReadonlySet<string>) {
  const available = new Set(rows.flatMap((row) => Object.keys(row.vendors)))

  for (const vendorName of hiddenVendorNames) {
    available.delete(vendorName)
  }

  return [
    ...VENDOR_ORDER.filter((vendorName) => available.delete(vendorName)),
    ...Array.from(available).sort(),
  ]
}

export function buildCompetitorAnalysis({
  rows,
  updatedAt,
  hiddenVendorNames,
  hiddenCapabilityTitles,
}: {
  rows: CompetitorAnalysisSourceRow[]
  updatedAt: string
  hiddenVendorNames: ReadonlySet<string>
  hiddenCapabilityTitles: ReadonlySet<string>
}): CompetitorAnalysis {
  const vendorNames = getVendorNames(rows, hiddenVendorNames)
  const vendors: CompetitorVendor[] = vendorNames.map((name, index) => ({
    id: slugify(name),
    name,
    descriptor: VENDOR_DESCRIPTORS[name] ?? 'Platform',
    position: index + 1,
    featured: name === 'Vercel',
  }))

  return {
    id: 'eaa-competitor-analysis',
    eyebrow: 'Procurement · Competitive analysis',
    title: 'The enterprise apps and agents platform landscape',
    description:
      'A capability-by-capability view of the platforms an enterprise could use to build, share, deploy, authenticate, govern, and maintain internal apps and agents.',
    thesis:
      'Vercel brings the complete operating model together. Other platforms cover important parts of the lifecycle, but require you to assemble and operate more of the platform itself.',
    methodology:
      'Verdicts come directly from the Notion research export. Yes means the capability is available, Partial means it requires additional products, configuration, or trade-offs, and No means the capability is not available in the assessed approach.',
    updated_at: updatedAt,
    vendors,
    segments: SEGMENTS.map((segment, segmentIndex) => {
      const segmentRows = rows.filter(
        (row) => row.segment === segment.label && !hiddenCapabilityTitles.has(row.question),
      )

      return {
        ...segment,
        position: segmentIndex + 1,
        capabilities: segmentRows.map((row, rowIndex) => ({
          id: `${segment.id}-${slugify(row.question)}`,
          title: row.question,
          position: rowIndex + 1,
          assessments: vendors.map((vendor) => {
            const sourceAssessment = row.vendors[vendor.name]
            if (!sourceAssessment) {
              throw new Error(`Missing ${vendor.name} assessment for: ${row.question}`)
            }

            return {
              vendor_id: vendor.id,
              verdict: normalizeVerdict(sourceAssessment.answer),
              justification: sourceAssessment.justification,
              sources: sourceAssessment.sources.map(toSource),
            }
          }),
        })),
      }
    }),
  }
}

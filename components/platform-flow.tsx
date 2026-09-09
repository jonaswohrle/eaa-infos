import type { ReactNode } from 'react'

/* ---------- tokens resolved for SVG use ---------- */
const BRAND = '#de2130'
const BRAND_TINT = '#fef2f2'
const BRAND_BORDER = '#f3c6ca'
const INK = 'var(--foreground)'
const MUTED = 'var(--muted-foreground)'
const BORDER = 'var(--border)'
const WHITE = '#ffffff'
const SUBTLE = '#f7f7f8'
const GRAY_LINE = '#c9c9ce'
const MONO = 'var(--font-mono), ui-monospace, monospace'

/* ---------- lucide-style glyphs ---------- */
function Glyph({
  children,
  x,
  y,
  size = 18,
  color = MUTED,
}: {
  children: ReactNode
  x: number
  y: number
  size?: number
  color?: string
}) {
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${size / 24})`}
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </g>
  )
}

const icons = {
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  code: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
  branch: (
    <>
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </>
  ),
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  key: (
    <>
      <path d="M2.6 17.4A2 2 0 0 0 2 18.8V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.2a2 2 0 0 0 1.4-.6l.8-.8a6.5 6.5 0 1 0-4-4z" />
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
    </>
  ),
  network: (
    <>
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </>
  ),
  shield: (
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  ),
}

export function PlatformFlow({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section id="flow" className={showHeader ? 'scroll-mt-24 py-20 sm:py-28' : 'scroll-mt-24'}>
      {showHeader && (
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-label-12 uppercase tracking-[0.18em] text-brand">04 · Security &amp; governance</p>
          <h2 className="mt-4 text-heading-40 font-semibold tracking-tight text-balance sm:text-heading-56">
            Security and governance across the Vercel platform.
          </h2>
          <p className="mt-5 text-copy-16 leading-7 text-[var(--ds-gray-900)] sm:text-copy-18">
            From source code, through preview and production deployments, to every external connection.
          </p>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-8">
        <svg
          viewBox="0 0 1200 636"
          className="w-full min-w-[900px]"
          role="img"
          aria-label="Governance flow: managed employees sign in via SAML SSO and Directory Sync; source code passes through Source Code Protection into Vercel Passport preview and production deployments, which reach Cloud IAM, SaaS APIs, and private backends through controlled connectivity."
          style={{ fontFamily: 'inherit' }}
        >
          <defs>
            <marker
              id="pf-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" fill={GRAY_LINE} />
            </marker>
          </defs>

          {/* ================= TOP BAND — IDENTITY ================= */}
          <Glyph x={40} y={22} size={18} color={BRAND}>
            {icons.users}
          </Glyph>
          <text x={66} y={37} fontSize={13} fontFamily={MONO} letterSpacing="0.12em" fill={MUTED}>
            ENTERPRISE MANAGED USERS
          </text>

          <rect x={40} y={60} width={256} height={88} rx={12} fill={WHITE} stroke={BORDER} />
          <Glyph x={60} y={86} size={20} color={BRAND}>
            {icons.users}
          </Glyph>
          <text x={94} y={100} fontSize={16} fontWeight={600} fill={INK}>
            Managed employees
          </text>
          <text x={94} y={124} fontSize={14} fill={MUTED}>
            Company-owned identities
          </text>

          <text x={358} y={98} fontSize={12.5} fontFamily={MONO} fill={MUTED} textAnchor="middle">
            sign in
          </text>
          <path d="M306 112 H408" stroke={GRAY_LINE} strokeWidth={1.6} markerEnd="url(#pf-arrow)" fill="none" />

          <rect x={424} y={52} width={736} height={110} rx={14} fill={BRAND_TINT} stroke={BRAND_BORDER} />
          <Glyph x={448} y={70} size={17} color={BRAND}>
            {icons.lock}
          </Glyph>
          <text x={476} y={86} fontSize={13.5} fontFamily={MONO} letterSpacing="0.1em" fill={BRAND}>
            ACCESS CONTROL
          </text>
          <rect x={448} y={100} width={340} height={46} rx={10} fill={WHITE} stroke={BORDER} />
          <Glyph x={466} y={112} size={17} color={BRAND}>
            {icons.shieldCheck}
          </Glyph>
          <text x={498} y={128} fontSize={15} fontWeight={500} fill={INK}>
            SAML SSO
          </text>
          <rect x={804} y={100} width={332} height={46} rx={10} fill={WHITE} stroke={BORDER} />
          <Glyph x={822} y={112} size={17} color={BRAND}>
            {icons.users}
          </Glyph>
          <text x={854} y={128} fontSize={15} fontWeight={500} fill={INK}>
            Directory Sync
          </text>

          <line x1={40} y1={196} x2={1160} y2={196} stroke={BORDER} strokeWidth={1} />

          <path
            d="M792 162 V300"
            stroke={GRAY_LINE}
            strokeWidth={1.6}
            strokeDasharray="5 5"
            markerEnd="url(#pf-arrow)"
            fill="none"
          />
          <text x={806} y={244} fontSize={12.5} fontFamily={MONO} fill={MUTED}>
            team access
          </text>

          {/* ================= BOTTOM BAND — GOVERNED ORG ================= */}
          <Glyph x={40} y={216} size={18} color={BRAND}>
            {icons.shield}
          </Glyph>
          <text x={66} y={231} fontSize={13} fontFamily={MONO} letterSpacing="0.12em" fill={MUTED}>
            GOVERNED VERCEL ORGANIZATION
          </text>

          {/* SOURCE */}
          <text x={40} y={288} fontSize={12} fontFamily={MONO} letterSpacing="0.1em" fill={MUTED}>
            SOURCE
          </text>
          <rect x={40} y={302} width={256} height={78} rx={12} fill={WHITE} stroke={BORDER} />
          <Glyph x={60} y={328} size={19} color={MUTED}>
            {icons.code}
          </Glyph>
          <text x={94} y={336} fontSize={15} fontWeight={600} fill={INK}>
            Source code
          </text>
          <text x={94} y={359} fontSize={13} fill={MUTED}>
            Git repositories
          </text>

          <path
            d="M168 380 V432"
            stroke={GRAY_LINE}
            strokeWidth={1.6}
            strokeDasharray="5 5"
            markerEnd="url(#pf-arrow)"
            fill="none"
          />

          <rect x={40} y={434} width={256} height={94} rx={12} fill={BRAND_TINT} stroke={BRAND_BORDER} />
          <Glyph x={60} y={458} size={19} color={BRAND}>
            {icons.branch}
          </Glyph>
          <text x={94} y={464} fontSize={15} fontWeight={600} fill={INK}>
            Source Code Protection
          </text>
          <text x={94} y={488} fontSize={13} fill={MUTED}>
            <tspan x={94}>Trusted sources ·</tspan>
            <tspan x={94} dy={18}>
              protected scopes
            </tspan>
          </text>

          <path d="M296 458 H372" stroke={GRAY_LINE} strokeWidth={1.6} markerEnd="url(#pf-arrow)" fill="none" />

          {/* PASSPORT */}
          <rect x={376} y={296} width={456} height={264} rx={16} fill="#fdf5f5" stroke={BRAND_BORDER} />
          <text x={400} y={334} fontSize={14} fontFamily={MONO} letterSpacing="0.09em" fill={BRAND}>
            VERCEL PASSPORT
          </text>
          <text x={400} y={360} fontSize={14} fill={MUTED}>
            Identity-aware access to every deployment
          </text>
          <rect x={648} y={314} width={168} height={30} rx={15} fill={WHITE} stroke={BRAND_BORDER} />
          <text x={732} y={334} fontSize={12.5} fontWeight={500} fill={BRAND} textAnchor="middle">
            Protected by default
          </text>
          <line x1={400} y1={378} x2={808} y2={378} stroke="#f0d7d9" strokeWidth={1} />

          <rect x={400} y={396} width={196} height={148} rx={12} fill={WHITE} stroke={BORDER} />
          <text x={420} y={428} fontSize={15} fontWeight={600} fill={INK}>
            Preview deployment
          </text>
          <text x={420} y={450} fontSize={13} fill={MUTED}>
            Per branch · per PR
          </text>
          <rect x={420} y={492} width={156} height={36} rx={8} fill={SUBTLE} stroke={BORDER} />
          <Glyph x={434} y={501} size={17} color={BRAND}>
            {icons.cloud}
          </Glyph>
          <text x={466} y={515} fontSize={13} fontWeight={500} fill={INK}>
            Fluid Compute
          </text>

          <rect x={612} y={396} width={196} height={148} rx={12} fill={WHITE} stroke={BORDER} />
          <text x={632} y={428} fontSize={15} fontWeight={600} fill={INK}>
            Production deployment
          </text>
          <text x={632} y={450} fontSize={13} fill={MUTED}>
            Main branch · live traffic
          </text>
          <rect x={632} y={492} width={156} height={36} rx={8} fill={SUBTLE} stroke={BORDER} />
          <Glyph x={646} y={501} size={17} color={BRAND}>
            {icons.cloud}
          </Glyph>
          <text x={678} y={515} fontSize={13} fontWeight={500} fill={INK}>
            Fluid Compute
          </text>

          {/* passport -> connectivity trunk */}
          <path d="M832 428 H864" stroke={GRAY_LINE} strokeWidth={1.6} fill="none" />
          <path d="M864 336 V520" stroke={GRAY_LINE} strokeWidth={1.6} fill="none" />
          <path d="M864 336 H900" stroke={GRAY_LINE} strokeWidth={1.6} markerEnd="url(#pf-arrow)" fill="none" />
          <path d="M864 428 H900" stroke={GRAY_LINE} strokeWidth={1.6} markerEnd="url(#pf-arrow)" fill="none" />
          <path d="M864 520 H900" stroke={GRAY_LINE} strokeWidth={1.6} markerEnd="url(#pf-arrow)" fill="none" />

          {/* CONNECTIVITY */}
          <text x={912} y={288} fontSize={12} fontFamily={MONO} letterSpacing="0.1em" fill={MUTED}>
            CONTROLLED CONNECTIVITY
          </text>

          <Glyph x={912} y={326} size={20} color={BRAND}>
            {icons.key}
          </Glyph>
          <text x={948} y={334} fontSize={14.5} fontWeight={600}>
            <tspan fill={BRAND}>Vercel OIDC</tspan>
            <tspan fill={MUTED}> → </tspan>
            <tspan fill={INK}>Cloud IAM</tspan>
          </text>
          <text x={948} y={356} fontSize={13} fill={MUTED}>
            Federated tokens for AWS, GCP, Azure
          </text>
          <line x1={912} y1={384} x2={1160} y2={384} stroke={BORDER} strokeWidth={1} />

          <Glyph x={912} y={418} size={20} color={BRAND}>
            {icons.network}
          </Glyph>
          <text x={948} y={426} fontSize={14.5} fontWeight={600}>
            <tspan fill={BRAND}>Vercel Connect</tspan>
            <tspan fill={MUTED}> → </tspan>
            <tspan fill={INK}>SaaS APIs</tspan>
          </text>
          <text x={948} y={448} fontSize={13} fill={MUTED}>
            Credentials for Slack, Stripe, GitHub
          </text>
          <line x1={912} y1={476} x2={1160} y2={476} stroke={BORDER} strokeWidth={1} />

          <Glyph x={912} y={510} size={20} color={BRAND}>
            {icons.lock}
          </Glyph>
          <text x={948} y={518} fontSize={14.5} fontWeight={600}>
            <tspan fill={BRAND}>Secure Compute</tspan>
            <tspan fill={MUTED}> → </tspan>
            <tspan fill={INK}>Private backend</tspan>
          </text>
          <text x={948} y={540} fontSize={13} fill={MUTED}>
            Static IP, VPC peering, VPN
          </text>

          {/* LEGEND */}
          <line x1={40} y1={584} x2={1160} y2={584} stroke={BORDER} strokeWidth={1} />
          <rect x={40} y={604} width={22} height={6} rx={3} fill={BRAND} />
          <text x={74} y={612} fontSize={13.5}>
            <tspan fontWeight={600} fill={INK}>
              Passport
            </tspan>
            <tspan fill={MUTED}> carries user identity and team-wide access.</tspan>
          </text>
          <rect x={620} y={604} width={22} height={6} rx={3} fill={GRAY_LINE} />
          <text x={654} y={612} fontSize={13.5}>
            <tspan fontWeight={600} fill={INK}>
              Deployment Protection
            </tspan>
            <tspan fill={MUTED}> adds a per-deployment gate.</tspan>
          </text>
        </svg>
      </div>
    </section>
  )
}

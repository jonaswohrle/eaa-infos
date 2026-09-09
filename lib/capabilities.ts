export type Role = 'all' | 'cio' | 'cfo' | 'cto' | 'ciso'
export type CapabilityGroup = 'Build & deploy' | 'Identity & governance' | 'Connectivity & operations'

export type Capability = {
  name: string
  group: CapabilityGroup
  friction: string
  functionality: string
  outcome: string
  roles: Exclude<Role, 'all'>[]
}

export const ROLE_LABELS: Record<Role, string> = { all: 'All', cio: 'CIO', cfo: 'CFO', cto: 'CTO / VP Eng', ciso: 'CISO' }

export const CAPABILITIES: Capability[] = [
  { name: 'App creation', group: 'Build & deploy', friction: 'AI-built prototypes emerge outside a common operating model.', functionality: 'Any creation tool can deploy into one governed organization.', outcome: 'Faster experimentation without a new shadow platform.', roles: ['cio','cto'] },
  { name: 'Source & CI/CD', group: 'Build & deploy', friction: 'Non-developers need help turning local work into a durable service.', functionality: 'Git remains the source of truth with per-commit previews and atomic rollback.', outcome: 'One delivery path for builders and engineering.', roles: ['cio','cto'] },
  { name: 'Agent execution', group: 'Build & deploy', friction: 'Generated code and long-running work require bespoke runtime operations.', functionality: 'Isolated sandboxes, Fluid Compute, and durable workflows run on one platform.', outcome: 'Less infrastructure to assemble and operate.', roles: ['cto','ciso'] },
  { name: 'Identity & access', group: 'Identity & governance', friction: 'Authentication and offboarding are wired independently for every app.', functionality: 'SSO, SCIM, managed users, and deployment protection inherit IdP policy.', outcome: 'Access is consistent from first preview to production.', roles: ['cio','ciso'] },
  { name: 'Spend controls', group: 'Identity & governance', friction: 'Distributed keys and vendors make runaway usage difficult to stop.', functionality: 'Project and key-level budgets, usage visibility, and hard caps.', outcome: 'Attributable spend with an enforceable ceiling.', roles: ['cio','cfo','ciso'] },
  { name: 'Security posture', group: 'Identity & governance', friction: 'WAF, secrets, audit evidence, and controls are reconstructed per app.', functionality: 'Managed secrets, edge protection, audit logs, and inherited platform controls.', outcome: 'A smaller control surface with clearer evidence.', roles: ['cio','ciso'] },
  { name: 'Internal developer platform', group: 'Connectivity & operations', friction: 'Portal and tooling contracts create another platform for engineering to maintain.', functionality: 'Builders own native apps while RBAC, policy, and publishing stay centralized.', outcome: 'More self-service with less platform overhead.', roles: ['cio','cfo','cto'] },
  { name: 'Private connectivity', group: 'Connectivity & operations', friction: 'Each workload needs bespoke networking and credential exchange.', functionality: 'Secure Compute, static egress, OIDC, and Vercel Connect reach private systems.', outcome: 'Controlled access without long-lived credentials.', roles: ['cto','ciso'] },
  { name: 'Observability & recovery', group: 'Connectivity & operations', friction: 'Telemetry fragments by app and recovery depends on team-specific runbooks.', functionality: 'Unified traces, spend, ownership, immutable artifacts, and instant rollback.', outcome: 'Faster diagnosis and a reliable recovery path.', roles: ['cio','cto','ciso'] },
  { name: 'Data & model access', group: 'Connectivity & operations', friction: 'Teams hand-roll connectors and operate separate model gateways.', functionality: 'Marketplace integrations and AI Gateway centralize data and model access.', outcome: 'One governed route to enterprise data and AI.', roles: ['cio','cfo','cto','ciso'] },
]

export type NavLink = {
  href: string
  label: string
  stepKey?: string
}

export type NavGroup = {
  label: string
  track?: 'technical' | 'procurement'
  links: NavLink[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Technical POC',
    track: 'technical',
    links: [
      { href: '/technical/poc-users', label: 'POC users', stepKey: 'poc-users' },
      { href: '/technical/capabilities', label: 'Capabilities', stepKey: 'capabilities' },
    ],
  },
  {
    label: 'Procurement',
    track: 'procurement',
    links: [
      { href: '/procurement/competitors', label: 'Competitor analysis', stepKey: 'competitors' },
      { href: '/procurement/business-case', label: 'Business case', stepKey: 'business-case' },
      { href: '/procurement/value-and-risk', label: 'Value and Risk' },
    ],
  },
]

export const STEP_HREF: Record<string, string> = Object.fromEntries(
  NAV_GROUPS.flatMap((g) => g.links.filter((l) => l.stepKey).map((l) => [l.stepKey as string, l.href])),
)

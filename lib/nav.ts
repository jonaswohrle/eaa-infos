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
    label: 'The platform',
    track: 'technical',
    links: [
      { href: '/technical/capabilities', label: 'Capabilities', stepKey: 'capabilities' },
      { href: '/procurement/competitors', label: 'Competitor analysis', stepKey: 'competitors' },
    ],
  },
  {
    label: 'Making the case',
    track: 'procurement',
    links: [
      { href: '/procurement/business-case', label: 'Business case', stepKey: 'business-case' },
      { href: '/technical/poc-users', label: 'Running a POC', stepKey: 'poc-users' },
    ],
  },
]

export const STEP_HREF: Record<string, string> = Object.fromEntries(
  NAV_GROUPS.flatMap((g) => g.links.filter((l) => l.stepKey).map((l) => [l.stepKey as string, l.href])),
)

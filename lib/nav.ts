export type NavLink = {
  href: string
  label: string
  stepKey?: string
}

export const NAV_LINKS: NavLink[] = [
  { href: '/technical/capabilities', label: 'Capabilities', stepKey: 'capabilities' },
  { href: '/procurement/value-and-risk', label: 'Value and Risk' },
  { href: '/procurement/business-case', label: 'Business case', stepKey: 'business-case' },
  { href: '/procurement/competitors', label: 'Competitor analysis', stepKey: 'competitors' },
]

export const STEP_HREF: Record<string, string> = Object.fromEntries(
  NAV_LINKS.filter((l) => l.stepKey).map((l) => [l.stepKey as string, l.href]),
)

import type { Metadata } from 'next'
import { BusinessCaseView } from '@/components/business-case-view'
import { getBusinessCase } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Business case — EAA Infos',
  description:
    'A reusable business case for giving AI-built applications a governed home, organised across the six lifecycle stages.',
}

export default async function BusinessCasePage() {
  const content = await getBusinessCase()
  return <BusinessCaseView content={content} />
}

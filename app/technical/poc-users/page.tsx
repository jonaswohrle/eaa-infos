import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { StepBanner } from '@/components/step-banner'
import { PocUsersView } from '@/components/poc-users-view'
import { hidePocUsers } from '@/flags'
import { getPocUsers, getStepByKey } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function PocUsersPage() {
  if (await hidePocUsers()) notFound()

  const [step, users] = await Promise.all([getStepByKey('poc-users'), getPocUsers()])
  return (
    <div>
      <PageHeader
        eyebrow="Evaluation"
        title="Running a POC"
        description="The roles across engineering, data, and security that need to be in the room for an evaluation to produce a decision."
        breadcrumb={{ label: 'Overview', href: '/' }}
      />
      <StepBanner step={step} />
      <PocUsersView users={users} />
    </div>
  )
}

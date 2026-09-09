import 'server-only'
import {
  LENSES,
  PHASES,
  STATUSES,
  type BusinessCaseData,
  type BusinessCaseItem,
  type BusinessCaseItemPatch,
  type BusinessCasePhaseSummary,
  type Lens,
  type Phase,
  type Status,
  type SupportKind,
} from '@/lib/business-case-shared'

export * from '@/lib/business-case-shared'

/**
 * The business case is served from the seed below rather than from Postgres.
 * The original portal persisted edits for the deal team; this deployment is a
 * read-only share, so the same content is returned directly and there is no
 * database to provision or keep in sync. The seed itself is unchanged.
 */

type SeedItem = Omit<BusinessCaseItem, 'id' | 'position'>

type SeedClaim = { supportKind: SupportKind; title: string }

const SEED_CLAIMS: Record<string, SeedClaim> = {
  'Every builder starts from a different application foundation': {
    supportKind: 'risk',
    title: 'Approved foundations standardize architecture and controls',
  },
  'Production access requires copied credentials': {
    supportKind: 'risk',
    title: 'Managed connections keep credentials out of builder workflows',
  },
  'The governed path assumes engineering expertise': {
    supportKind: 'value',
    title: 'Guided delivery removes Git and infrastructure expertise',
  },
  'Connecting to data and tools creates specialist handoffs': {
    supportKind: 'value',
    title: 'Managed integrations remove data and tooling handoffs',
  },
  'Source lineage and access costs break citizen development': {
    supportKind: 'risk',
    title: 'Company-owned source preserves lineage without specialist seats',
  },
  'Teams share through personal accounts and disconnected tools': {
    supportKind: 'risk',
    title: 'Governed sharing keeps applications private, visible, and revocable',
  },
  'Stakeholders review screenshots instead of working software': {
    supportKind: 'value',
    title: 'Protected working previews let stakeholders test every change',
  },
  'Feedback is separated from the version it describes': {
    supportKind: 'value',
    title: 'Version-linked feedback removes clarification cycles',
  },
  'Every production application becomes a Kubernetes project': {
    supportKind: 'risk',
    title: 'Managed production removes per-application Kubernetes setup',
  },
  'Capacity must be reserved before demand is known': {
    supportKind: 'risk',
    title: 'Automatic scaling removes idle capacity without limiting peaks',
  },
  'Applications and agents require separate runtime infrastructure': {
    supportKind: 'value',
    title: 'One runtime supports interfaces, APIs, background work, and agents',
  },
  'Multi part releases create slow specialist led recovery': {
    supportKind: 'value',
    title: 'Immutable releases give every application one recovery point',
  },
  'Internal applications can become public by omission': {
    supportKind: 'risk',
    title: 'Identity protection is on by default for every application',
  },
  'Shared credentials bypass each user’s permissions': {
    supportKind: 'value',
    title: 'User identity carries existing permissions into production systems',
  },
  'Identity is lost before consequential actions occur': {
    supportKind: 'risk',
    title: 'End-to-end attribution follows consequential actions',
  },
  'No one can enumerate the application and agent estate': {
    supportKind: 'value',
    title: 'One inventory connects every asset to its owner and operating record',
  },
  'Spend is visible only after it occurs': {
    supportKind: 'risk',
    title: 'Layered controls reduce the risk of excessive bills',
  },
  'Self-built workloads expose cost to unbounded network traffic': {
    supportKind: 'risk',
    title: 'Ingress and sandbox egress controls contain runaway or abusive traffic',
  },
  'Audit evidence is fragmented across systems': {
    supportKind: 'risk',
    title: 'One audit chain connects identity, code, deployment, and activity',
  },
  'Agents act across systems without a governed run record': {
    supportKind: 'risk',
    title: 'Governed run records make agent actions reviewable and containable',
  },
  'Every application creates a separate operational stack': {
    supportKind: 'value',
    title: 'One managed fleet absorbs platform maintenance across the estate',
  },
  'A useful application becomes ownerless when its builder leaves': {
    supportKind: 'risk',
    title: 'Standard structure and company-owned source make ownership transferable',
  },
  'Every failure becomes a specialist support ticket': {
    supportKind: 'risk',
    title: 'Default telemetry shortens diagnosis before specialist escalation',
  },
  'Support demand grows with the application estate': {
    supportKind: 'value',
    title: 'Enterprise support absorbs platform questions as adoption grows',
  },
  'Unused applications remain live and unsupported': {
    supportKind: 'value',
    title: 'Portfolio visibility supports improvement, transfer, and retirement',
  },
}

function argument(
  phase: Phase,
  title: string,
  today: string,
  problem: string,
  impact: string,
  withVercel: string,
  lenses: Lens[],
  quantBasis: string,
  status: Status = 'proposed',
  quantAmount: number | null = null,
  quantUnit = '',
): SeedItem {
  const claim = SEED_CLAIMS[title]
  return {
    phase,
    title: claim?.title ?? title,
    supportKind: claim?.supportKind ?? (lenses.includes('risk') ? 'risk' : 'value'),
    today,
    problem,
    impact,
    withVercel,
    lenses,
    quantAmount,
    quantUnit,
    quantBasis,
    status,
  }
}

const PHASE_SUMMARY_SEED: Record<
  Phase,
  Pick<BusinessCasePhaseSummary, 'value' | 'riskMitigated'>
> = {
  build: {
    value:
      '10× faster delivery of applications and agents, with approved access to production systems and no setup or technical expertise required from builders.',
    riskMitigated:
      'Prevents inconsistent architectures, copied credentials, and unsupported code from turning rapid experimentation into security debt and costly rework.',
  },
  share: {
    value:
      'One governed platform where teams can securely share working applications, review changes, and give feedback directly in context.',
    riskMitigated:
      'Prevents employees from using personal accounts, public links, and disconnected tools that leave applications invisible, ungoverned, and impossible to revoke centrally.',
  },
  deploy: {
    value:
      'Efficient, zero configuration infrastructure that runs applications and agents in production and scales automatically with demand.',
    riskMitigated:
      'Avoids the cost, specialist staffing, idle capacity, and operational burden of building and managing large Kubernetes environments.',
  },
  authenticate: {
    value:
      'Internal applications remain internal, while users access production systems with their existing permissions and credentials stay hidden from builders.',
    riskMitigated:
      'Prevents public exposure, shared credentials, excessive permissions, and orphaned access from becoming security, legal, compliance, or operational incidents.',
  },
  govern: {
    value:
      'One control plane for every application and agent, with enforceable policies, named ownership, complete audit history, controlled production access, and attributable spending.',
    riskMitigated:
      'Prevents decentralized development from becoming shadow IT with unknown owners, uncontrolled costs, inconsistent policies, and no reliable way to contain risk.',
  },
  maintain: {
    value:
      'Operate thousands of applications and agents as one managed fleet, with standardized operations, centralized visibility, platform updates, clear ownership, and enterprise support.',
    riskMitigated:
      'Prevents each application from becoming a separate operational liability with its own infrastructure, dependencies, security updates, expertise, and support burden.',
  },
}

const CURRENT_SEED_VERSION = 15

const SEED: SeedItem[] = [
  // Build
  argument(
    'build',
    'Every builder starts from a different application foundation',
    'Builders choose their own frameworks, components, security controls, and project structures.',
    'Without an approved foundation, every application requires separate architecture, security, accessibility, and maintainability review.',
    'Review and remediation grow with application volume, while unfamiliar stacks become expensive to support when ownership changes.',
    'A maintained application foundation gives every builder approved architecture, controls, and design patterns that improve centrally.',
    ['risk', 'cost', 'value'],
    'Applications created × review and remediation hours avoided × loaded specialist rate.',
    'validated',
  ),
  argument(
    'build',
    'Production access requires copied credentials',
    'Builders copy long lived API keys into local files or prompts to connect prototypes to production systems.',
    'Once copied, credentials can enter chat history or source control and their use cannot be reliably governed.',
    'A useful experiment can create credential rotation, investigation, legal review, service disruption, and lasting security debt.',
    'Approved runtime connections provide scoped access to production systems without revealing the underlying credentials.',
    ['risk', 'value'],
    'Credentials copied per application, incidents avoided, and response hours × loaded security and legal cost.',
    'discuss',
  ),
  argument(
    'build',
    'The governed path assumes engineering expertise',
    'Production delivery requires builders to understand repositories, branches, reviews, and infrastructure workflows.',
    'The controls intended to govern development become a barrier for people outside engineering.',
    'Prototypes remain on laptops or require specialist help, so delivery scales only as fast as scarce engineering capacity.',
    'Builders create source controlled, deployed applications through guided workflows without operating Git or infrastructure directly.',
    ['cost', 'value'],
    'Builder releases × engineering assistance hours avoided × loaded engineering rate; compare completion rates before and after.',
    'validated',
  ),
  argument(
    'build',
    'Connecting to data and tools creates specialist handoffs',
    'A builder who needs a database, Jira, BigQuery, or Slack must request accounts, credentials, networking, and integration work from specialists.',
    'The first backend or tooling dependency breaks self service before the application has proved value.',
    'Small workflow ideas stop at demonstration stage or generate recurring work for platform, data, and integration teams.',
    'Managed integrations connect approved databases and tools like Jira, BigQuery, and Slack through the application workflow — the builder never needs to understand the integration, the credentials, or where the data lives.',
    ['cost', 'value', 'risk'],
    'Integration requests × elapsed days and specialist hours; compare time from prototype to a working connected application.',
  ),
  argument(
    'build',
    'Source lineage and access costs break citizen development',
    'Company policy requires production code in company owned source control, while direct repository access requires paid specialist seats.',
    'The company must either buy tools citizen builders do not need or exclude them from the governed source path.',
    'Seat costs grow before value is proven, while excluded builders create code with weak ownership and deployment lineage.',
    'A governed service identity creates company owned source with per user attribution, without requiring direct repository access for every builder.',
    ['cost', 'risk'],
    'Validate seat price and population. 2,000 × $11 × 12 equals $264K; Finance must resolve the source discrepancy before external use.',
    'validated',
    264000,
    '$/yr minimum avoided',
  ),

  // Share
  argument(
    'share',
    'Teams share through personal accounts and disconnected tools',
    'Builders use personal accounts, public links, screenshots, and unrelated tools because governed sharing is fragmented.',
    'Applications, audiences, and ownership cannot be seen or revoked from one place.',
    'Sensitive work becomes invisible shadow IT, while fear of exposure prevents useful applications from reaching other teams.',
    'One governed platform keeps working applications private, company owned, visible, and centrally revocable.',
    ['risk', 'value'],
    'Applications shared outside managed accounts; time to identify an owner and revoke access; exposure incidents and remediation cost.',
    'validated',
  ),
  argument(
    'share',
    'Stakeholders review screenshots instead of working software',
    'Review happens through screenshots, presentations, or scheduled demonstrations instead of a runnable version of each change.',
    'Decision makers cannot test workflows, permissions, responsive behavior, or edge cases themselves.',
    'Wrong assumptions survive approval, increasing late rework and reducing trust in builder created software.',
    'Every change produces a protected working version that approved reviewers can test before release.',
    ['cost', 'value'],
    'Review cycles, first feedback latency, and defects found after approval × rework hours.',
  ),
  argument(
    'share',
    'Feedback is separated from the version it describes',
    'Comments arrive in meetings, messages, and documents without a reliable link to the exact version under review.',
    'Builders must interpret ambiguous feedback and reconstruct what the reviewer saw.',
    'Clarification cycles delay decisions, reopen defects, and fragment the record of who approved what.',
    'Reviewers comment directly on the working version, keeping feedback attached to the exact application state.',
    ['cost', 'value'],
    'Comments requiring clarification × average delay; reopened issues; meeting hours replaced by contextual asynchronous review.',
  ),

  // Deploy
  argument(
    'deploy',
    'Every production application becomes a Kubernetes project',
    'Central specialists configure and host each application through infrastructure designed for engineering owned services.',
    'Platform tickets, cluster configuration, and per application setup make delivery capacity grow linearly with the estate.',
    'At scale, the production queue becomes slower than ungoverned alternatives and valuable applications remain on laptops.',
    'Infrastructure is derived from the application and company defaults, creating a zero configuration path to production.',
    ['cost', 'value'],
    'Applications shipped × platform engineering hours per application, plus value lost during queue time.',
  ),
  argument(
    'deploy',
    'Capacity must be reserved before demand is known',
    'Internal applications require standing capacity even though most are rarely used and a few may suddenly reach the whole company.',
    'Teams must predict demand before adoption and pay for the long tail of idle services.',
    'Under sizing causes outages at the moment of adoption, while over sizing creates a fixed cost floor that grows with application count.',
    'Automatic scaling adds capacity for bursts and removes traffic cost while applications are idle.',
    ['risk', 'cost', 'value'],
    'Reserved capacity avoided, idle share, peak users served without intervention, and employee hours lost during burst failures.',
  ),
  argument(
    'deploy',
    'Applications and agents require separate runtime infrastructure',
    'Interactive interfaces, APIs, background jobs, queues, and long running agent workflows are built and operated as separate services.',
    'Each runtime adds architecture, provisioning, monitoring, and specialist ownership before the workflow proves value.',
    'Experimental automation creates a permanent worker and queue estate or is implemented unreliably in request handlers.',
    'Interactive, API, background, and durable work run through one managed production model that charges for active execution.',
    ['cost', 'value', 'ai'],
    'Runtime services eliminated, setup and maintenance hours avoided, and active compute as a share of total workflow duration.',
  ),
  argument(
    'deploy',
    'Multi part releases create slow specialist led recovery',
    'Frontends, APIs, and workers ship through separate pipelines with independent versions and recovery procedures.',
    'A release can leave incompatible parts live, while rollback requires specialists to reconstruct a known good combination.',
    'Partial recovery extends employee downtime, risks repeated work or data errors, and slows future releases.',
    'The application ships as one immutable deployment with one consistent version and one recovery point.',
    ['risk', 'cost'],
    'Release incidents caused by version mismatch × restoration time and affected employee hours; pipelines eliminated per application.',
    'validated',
  ),

  // Authenticate
  argument(
    'authenticate',
    'Internal applications can become public by omission',
    'Each builder must add access control correctly or anyone with the link can open the application.',
    'A mandatory security control depends on every builder remembering and implementing it without error.',
    'One omission can expose internal or personal data, while local accounts and one off lists leave access behind after offboarding.',
    'Company identity protects every application by default, and central identity removal revokes access across the estate.',
    ['risk', 'cost'],
    'Share protected by company identity, exposure exceptions found, audit hours, and revocation latency after offboarding.',
    'validated',
  ),
  argument(
    'authenticate',
    'Shared credentials bypass each user’s permissions',
    'Applications query production systems through one shared service identity regardless of which employee initiated the request.',
    'The source system sees the application rather than the person, bypassing existing grants and user level audit records.',
    'Users may receive data they cannot access directly, turning the application into a privilege escalation path.',
    'The signed in user’s identity reaches the production system, which applies the permissions it already governs.',
    ['risk', 'value'],
    'Sensitive requests carrying end user identity, unauthorized row exposure tests, and custom access logic eliminated per application.',
    'validated',
  ),
  argument(
    'authenticate',
    'Identity is lost before consequential actions occur',
    'A user signs in, but downstream API calls and agent actions execute under unrelated shared credentials.',
    'The identity chain breaks before the query, change, or external action that matters.',
    'Investigators cannot attribute actions, and compliance cannot demonstrate least privilege or individual accountability.',
    'Human and agent actions remain connected to the initiating identity across application and production system boundaries.',
    ['risk'],
    'Sensitive actions with end to end attribution and forensic hours spent reconstructing actor identity.',
    'validated',
  ),

  // Govern
  argument(
    'govern',
    'No one can enumerate the application and agent estate',
    'Tools are distributed across laptops, personal accounts, and unrelated hosts without one inventory or owner of record.',
    'Security, procurement, and IT cannot govern assets they cannot find.',
    'Unknown applications retain access, cost money, and survive owner changes, making the total exposure impossible to approve or contain.',
    'One inventory connects every application and agent to an owner, team, source, deployment, and operating record.',
    ['risk', 'cost'],
    'Unregistered applications discovered; share with named owner, data classification, and source lineage; inventory hours avoided.',
  ),
  argument(
    'govern',
    'Spend is visible only after it occurs',
    'Application, infrastructure, and AI usage grow without one consistent set of visibility, alerting, traffic, and response controls.',
    'Self-built safeguards vary by application, so abnormal consumption may continue until an owner or central team notices and intervenes.',
    'Traffic spikes, automated loops, abusive requests, or unexpected AI usage can create excessive bills and force broad restrictions on otherwise useful workloads.',
    'Vercel combines spend visibility, alerts, automated responses, AI usage reporting, inbound traffic controls, and restricted agent or sandbox egress to reduce the chance that abnormal usage becomes an uncontrolled bill.',
    ['cost', 'risk', 'ai'],
    'Unexpected spend events; time from anomaly to action; abusive requests blocked; restricted outbound calls; spend attribution; and reconciliation hours.',
    'discuss',
  ),
  argument(
    'govern',
    'Self-built workloads expose cost to unbounded network traffic',
    'Each self-hosted application must implement its own inbound abuse controls and rate limits, while agent or untrusted-code execution needs a separate outbound network policy.',
    'Application code becomes the last line of defense: malicious requests and software loops can reach compute or paid APIs before a limit runs, while unrestricted sandbox egress can call any external destination.',
    'A denial-of-service event, credential abuse, runaway retry loop, or compromised workload can multiply compute, data-transfer, model, and third-party API costs before an operator intervenes.',
    'Vercel WAF filters, denies, challenges, and rate-limits incoming requests at the edge; Vercel Sandbox policies can deny all egress or allowlist specific domains and network ranges before untrusted code or agents run.',
    ['risk', 'cost', 'ai'],
    'Requests blocked before application resources; rate-limit events; outbound destinations denied; and compute, model, data-transfer, or third-party API calls avoided during abusive or runaway activity.',
    'validated',
  ),
  argument(
    'govern',
    'Audit evidence is fragmented across systems',
    'Identity, code changes, deployments, and production activity are logged in separate tools or not logged consistently.',
    'There is no complete chain from a named person to the code, release, and production action.',
    'Audit preparation becomes an investigation, while missing evidence expands incident scope, response time, and legal uncertainty.',
    'Identity, source, deployment, and production activity form one exportable record for internal security systems.',
    ['risk', 'cost'],
    'Audit requests × evidence collection hours; required events available centrally; incident scoping time.',
    'validated',
  ),
  argument(
    'govern',
    'Agents act across systems without a governed run record',
    'Agents can query data, send messages, and change external systems without one record of trigger, tool calls, approvals, cost, and outcome.',
    'Machine speed actions lack the evidence needed to distinguish intended automation from unauthorized behavior.',
    'An error can propagate across systems before detection, and investigators must treat every connected system as affected.',
    'Each run records the initiating identity, trigger, actions, approvals, cost, and outcome for review and containment.',
    ['risk', 'ai'],
    'Agent runs with complete trace and named approval; time to reconstruct a failed run; systems touched per incident.',
    'validated',
  ),

  // Maintain
  argument(
    'maintain',
    'Every application creates a separate operational stack',
    'Self managed applications require capacity planning, runtime patching, cluster maintenance, upgrades, and deployment tooling.',
    'Operations grow with application count even when business usage does not.',
    'Each successful application adds permanent platform work until maintenance requires more specialists or new development is restricted.',
    'One managed fleet absorbs capacity, runtime, patching, and platform maintenance across the entire application estate.',
    ['cost', 'risk'],
    'Platform FTE per 100 applications, annual patch and upgrade hours, and incidents caused by platform maintenance.',
  ),
  argument(
    'maintain',
    'A useful application becomes ownerless when its builder leaves',
    'Business teams adopt applications whose source, knowledge, and operating context remain with the original builder.',
    'Adoption turns a personal project into business infrastructure without creating transferable ownership.',
    'When the builder changes role, the application degrades and the dependent process becomes an emergency handover.',
    'Company owned source, standard structure, explicit ownership, and common operations let another team take over.',
    ['risk', 'value'],
    'Adopted applications without a secondary owner; business hours lost after owner departure; takeover effort per application.',
  ),
  argument(
    'maintain',
    'Every failure becomes a specialist support ticket',
    'Logs and traces are missing, fragmented, or accessible only to specialists.',
    'The person closest to the workflow cannot distinguish code, data access, external system, and infrastructure failures.',
    'Every incident enters a specialist queue and begins with reproduction while the business process remains unavailable.',
    'Default telemetry and one operating model let builders diagnose more failures before escalating them.',
    ['cost', 'risk', 'ai'],
    'Incidents × time to first diagnosis and resolution; specialist escalations avoided; share resolved with default telemetry.',
    'validated',
  ),
  argument(
    'maintain',
    'Support demand grows with the application estate',
    'A small internal team becomes the help desk for every build, deployment, access, and incident question.',
    'Support grows with applications and builders, including questions about the underlying platform.',
    'Rollout is limited by internal support capacity or displaces governance, security, and platform work.',
    'Enterprise support absorbs platform questions while the internal team retains policy, business context, and escalation ownership.',
    ['cost', 'value'],
    'Tickets per 100 applications × handling time × loaded support rate; share resolved without internal platform intervention.',
  ),
  argument(
    'maintain',
    'Unused applications remain live and unsupported',
    'After release, usage, ownership, and operating health are not visible across the portfolio.',
    'Valuable, failing, and abandoned applications look the same to central teams.',
    'The company funds unused tools, retains unnecessary access, and discovers ownerless applications only during incidents or audits.',
    'Portfolio level usage, cost, health, and ownership data supports targeted improvement, transfer, or retirement.',
    ['cost', 'risk', 'value'],
    'Active users, cost per active user, ownerless applications, and applications retired below an agreed usage threshold.',
  ),
]

const LEGACY_SEED_TITLES = [
  'Production credentials live on builder laptops',
  'Every builder starts from a different app design',
  'Citizen builders are forced to understand Git and deployment',
  'Company source-control policy creates a GitHub seat tax',
  'Adding a database becomes an infrastructure project',
  'Code and deployed application can lose their lineage',
  'Sensitive dashboards are shared as public links or screenshots',
  'Cross-team sharing creates one Okta construct per combination',
  'A work in progress is visible before the builder is ready',
  'Stakeholders review pictures instead of working software',
  'Feedback is separated from the version it describes',
  'Every production release becomes a platform-team ticket',
  'Internal campaigns can overwhelm infrastructure sized for normal traffic',
  'Thousands of rarely used apps still consume standing infrastructure',
  'Frontend, API and worker releases fail independently',
  'A bad release requires specialist intervention to reverse',
  'Background work requires servers and queues before it creates value',
  'Authentication is optional work for every app',
  'Offboarding does not reliably remove app access',
  'Shared service accounts erase who accessed production data',
  'App access changes require identity-team tickets',
  'Human and agent requests lose identity between systems',
  'No one can answer what apps and agents are running',
  'AI and infrastructure spend is discovered after it occurs',
  'Project budgets and cost-centre exports make spending attributable',
  'Layered alerts, budgets, and reporting keep spend observable and bounded',
  'Costs cannot be charged to the team creating them',
  'Audit evidence is assembled manually across disconnected systems',
  'Governance depends on another vendor dashboard',
  'Agents can take consequential action without a run record',
  'A useful app becomes ownerless when its builder leaves',
  'Builders cannot diagnose failures from production evidence',
  'No one knows whether an internal app creates value',
  '2,500 builders route every support question to a small internal team',
  'Every app creates permanent capacity, patching and server work',
  'A proprietary runtime turns adoption into future lock-in',
  // Retired v10 claim/title pair, renamed in v11 to managed integrations.
  'Adding data persistence creates specialist handoffs',
  'Managed data removes backend provisioning handoffs',
  ...Object.keys(SEED_CLAIMS),
  ...Object.values(SEED_CLAIMS).map((claim) => claim.title),
]

export async function getBusinessCase(): Promise<BusinessCaseData> {
  const items: BusinessCaseItem[] = SEED.map((item, index) => ({
    ...item,
    id: `${item.phase}-${index + 1}`,
    position: index + 1,
  }))

  const phaseSummaries: BusinessCasePhaseSummary[] = PHASES.map((phase) => ({
    phase,
    value: PHASE_SUMMARY_SEED[phase].value,
    riskMitigated: PHASE_SUMMARY_SEED[phase].riskMitigated,
  }))

  return {
    items,
    phaseSummaries,
    settings: { builders: 2500, costPerBuilder: 100 },
  }
}

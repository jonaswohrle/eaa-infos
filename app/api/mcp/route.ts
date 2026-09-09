import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'
import { getCorpus } from '@/lib/play'
import {
  answerQuestion,
  buildCustomerBrief,
  compareVendors,
  getBusinessCaseBrief,
  getLifecycle,
  getReferences,
  getValueAndRisk,
  getVendorProfile,
  searchPlay,
} from '@/lib/play/tools'

export const maxDuration = 60

const STAGES = ['build', 'share', 'deploy', 'authenticate', 'govern', 'maintain'] as const
const LENSES = ['risk', 'cost', 'value', 'ai'] as const
const KINDS = ['capability', 'comparison', 'argument', 'claim', 'brief', 'reference'] as const

function json(payload: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(payload) }] }
}

const handler = createMcpHandler(
  (server) => {
    /* ---------------------------------------------------------------- */
    /* Tools                                                            */
    /* ---------------------------------------------------------------- */

    server.registerTool(
      'search_play',
      {
        title: 'Search the play',
        description:
          'Search everything about the Enterprise Agents & Apps play — capabilities, competitor verdicts, value and risk arguments, the executive brief, and reference links. Start here when you do not know which tool to use. Returns compact hits with ids to drill into.',
        inputSchema: z.object({
          query: z.string().describe('Natural language question or keywords'),
          kinds: z.array(z.enum(KINDS)).optional().describe('Restrict to certain record types'),
          limit: z.number().int().min(1).max(25).optional(),
        }),
      },
      async (args) => json(await searchPlay(args)),
    )

    server.registerTool(
      'get_lifecycle',
      {
        title: 'Get lifecycle capabilities',
        description:
          'The target operating model: what a governed platform must do at each of the six lifecycle stages (build, share, deploy, authenticate, govern, maintain), with the Vercel product and documentation link for each capability.',
        inputSchema: z.object({
          stage: z.enum(STAGES).optional().describe('Limit to one lifecycle stage'),
        }),
      },
      async (args) => json(await getLifecycle(args)),
    )

    server.registerTool(
      'compare_vendors',
      {
        title: 'Compare vendors',
        description:
          'The capability matrix: 47 assessed questions scored yes/partial/no across Vercel, AWS, Netlify, Cloudflare, Dokploy and building in-house. Returns verdicts only by default — set detail:true with capability_ids to get the written rationale and sources for specific rows.',
        inputSchema: z.object({
          segment: z.string().optional().describe('Lifecycle segment, e.g. Govern'),
          vendors: z.array(z.string()).optional().describe('Limit to these vendors'),
          verdict: z.enum(['yes', 'partial', 'no']).optional().describe('Only rows where a listed vendor scored this'),
          capability_ids: z.array(z.string()).optional().describe('Specific rows, from search_play hits'),
          detail: z.boolean().optional().describe('Include justification and sources (capped at 8 rows)'),
          limit: z.number().int().min(1).max(60).optional(),
        }),
      },
      async (args) => json(await compareVendors(args)),
    )

    server.registerTool(
      'get_vendor_profile',
      {
        title: 'Get vendor profile',
        description:
          "One alternative's overall posture: coverage score and yes/partial/no counts per lifecycle segment, plus its notable gaps. Use this to position against an incumbent before quoting individual verdicts.",
        inputSchema: z.object({
          vendor: z.string().describe('AWS, Netlify, Cloudflare, Dokploy, Internally built, or Vercel'),
        }),
      },
      async (args) => json(await getVendorProfile(args)),
    )

    server.registerTool(
      'get_value_and_risk',
      {
        title: 'Get value and risk arguments',
        description:
          'The 25 arguments behind the business case. Each lifecycle stage makes one value claim and one risk claim, and each argument follows the chain today → why it breaks → where it ends → how it plays out on Vercel, with a basis for measuring it and supporting documentation.',
        inputSchema: z.object({
          phase: z.enum(STAGES).optional(),
          lens: z.enum(LENSES).optional().describe('Risk & control, cost reduction, value creation, AI transformation'),
          kind: z.enum(['value', 'risk']).optional().describe('Arguments supporting the value or the risk claim'),
          include_docs: z.boolean().optional().describe('Include documentation links (default false — they roughly double the response)'),
        }),
      },
      async (args) => json(await getValueAndRisk(args)),
    )

    server.registerTool(
      'get_business_case_brief',
      {
        title: 'Get the executive business case',
        description:
          'The two-page executive brief: the thesis, methodology, why anything / why now / why Vercel, the advantage table (value created, cost and risk avoided, how to evidence it), and the value/risk summary.',
        inputSchema: z.object({}),
      },
      async () => json(await getBusinessCaseBrief()),
    )

    server.registerTool(
      'get_references',
      {
        title: 'Get reference links',
        description:
          'Every link in the corpus: Vercel product URLs, the curated documentation that substantiates each argument, and the external sources cited behind competitor verdicts. Use this to cite a claim rather than asserting it.',
        inputSchema: z.object({
          kind: z.enum(['product', 'evidence', 'source']).optional(),
          query: z.string().optional().describe('Filter by label, context or URL'),
          limit: z.number().int().min(1).max(120).optional(),
        }),
      },
      async (args) => json(await getReferences(args)),
    )

    server.registerTool(
      'build_customer_brief',
      {
        title: 'Build a customer brief',
        description:
          'Assemble the material needed to write a business case, prepare a discovery call, or draft outreach for a specific customer. Returns the thesis, the lifecycle claims, the most relevant arguments with their measurement basis, the incumbent’s gaps if you name one, and guidance on how to use it. You write the final artefact.',
        inputSchema: z.object({
          customer: z.string().describe('Customer or prospect name'),
          industry: z.string().optional(),
          persona: z.string().optional().describe('e.g. CTO, platform lead, procurement, security'),
          incumbent: z.string().optional().describe('What they run today, if known'),
          priorities: z.array(z.string()).optional().describe('What they care about, e.g. audit, cost, shadow IT'),
        }),
      },
      async (args) => json(await buildCustomerBrief(args)),
    )

    server.registerTool(
      'answer_question',
      {
        title: 'Answer a prospect question',
        description:
          'Given a prospect question, objection or RFP item, return the matching capabilities, the competitor verdicts that bear on it, the relevant arguments, citable sources, and guidance on how to answer honestly. Use for "can it do X", "how does it compare on Y", and objection handling.',
        inputSchema: z.object({
          question: z.string().describe('The question or objection, in the prospect’s words'),
          audience: z.string().optional().describe('Who is asking, e.g. security reviewer'),
        }),
      },
      async (args) => json(await answerQuestion(args)),
    )

    /* ---------------------------------------------------------------- */
    /* Resources                                                        */
    /* ---------------------------------------------------------------- */

    const resource = (
      name: string,
      uri: string,
      description: string,
      load: () => Promise<unknown>,
    ) =>
      server.registerResource(
        name,
        uri,
        { title: name, description, mimeType: 'application/json' },
        async () => ({
          contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(await load()) }],
        }),
      )

    resource('Lifecycle', 'eaa://lifecycle', 'The six lifecycle stages and their capabilities', () =>
      getLifecycle({}),
    )
    resource('Competitor matrix', 'eaa://competitors/matrix', 'All assessed questions with verdicts per vendor', () =>
      compareVendors({}),
    )
    resource('Value and risk', 'eaa://value-and-risk', 'The lifecycle claims and the 25 supporting arguments', () =>
      getValueAndRisk({}),
    )
    resource('Business case brief', 'eaa://business-case/brief', 'The two-page executive business case', () =>
      getBusinessCaseBrief(),
    )
    resource('References', 'eaa://references', 'Product, documentation and source links', () =>
      getReferences({ limit: 120 }),
    )

    /* ---------------------------------------------------------------- */
    /* Prompts                                                          */
    /* ---------------------------------------------------------------- */

    const prompt = (
      name: string,
      title: string,
      description: string,
      argsSchema: z.ZodObject<z.ZodRawShape>,
      render: (args: Record<string, string>) => string,
    ) =>
      server.registerPrompt(name, { title, description, argsSchema }, (args) => ({
        messages: [
          { role: 'user' as const, content: { type: 'text' as const, text: render(args as Record<string, string>) } },
        ],
      }))

    prompt(
      'write_business_case',
      'Write a business case',
      'Draft a business case for giving a customer’s citizen-built applications a governed home',
      z.object({
        customer: z.string(),
        industry: z.string().optional(),
        incumbent: z.string().optional(),
      }),
      (a) =>
        `Write a business case for ${a.customer}${a.industry ? ` (${a.industry})` : ''} on giving AI-built applications a governed home.\n\n` +
        `First call build_customer_brief with customer="${a.customer}"${a.industry ? `, industry="${a.industry}"` : ''}${a.incumbent ? `, incumbent="${a.incumbent}"` : ''}. ` +
        `Then call get_business_case_brief for the thesis and advantage table.\n\n` +
        `Structure it as: the situation today, why it breaks, what it costs, and what a governed platform changes — organised by lifecycle stage, each making one value claim and one risk claim. ` +
        `Do not invent figures: state the measurement basis and let ${a.customer} supply their own inputs. Cite documentation links for every capability claim.`,
    )

    prompt(
      'draft_outreach_email',
      'Draft outreach',
      'Draft a prospecting email grounded in the play',
      z.object({
        customer: z.string(),
        persona: z.string().optional(),
        trigger: z.string().optional().describe('Why you are reaching out now'),
      }),
      (a) =>
        `Draft a short outreach email to ${a.persona ?? 'a platform or engineering leader'} at ${a.customer}.` +
        `${a.trigger ? ` Context for the timing: ${a.trigger}.` : ''}\n\n` +
        `Call build_customer_brief with customer="${a.customer}"${a.persona ? `, persona="${a.persona}"` : ''} first.\n\n` +
        `Lead with the problem they already have — employees shipping AI-built apps faster than the operating model can govern them — not with Vercel. ` +
        `One specific, concrete observation beats three generic claims. Under 150 words, no bullet lists, one clear ask.`,
    )

    prompt(
      'prep_discovery_call',
      'Prepare a discovery call',
      'Build a question set and listening guide for a discovery call',
      z.object({ customer: z.string(), known_stack: z.string().optional() }),
      (a) =>
        `Prepare a discovery call with ${a.customer}${a.known_stack ? ` (they run ${a.known_stack})` : ''}.\n\n` +
        `Call build_customer_brief${a.known_stack ? ` with incumbent="${a.known_stack}"` : ''} and get_lifecycle.\n\n` +
        `Produce: the three things worth learning per lifecycle stage, the questions that surface them without leading, ` +
        `the signals that indicate this play fits, and the signals that indicate it does not. Include what would disqualify the opportunity.`,
    )

    prompt(
      'answer_rfp_question',
      'Answer an RFP question',
      'Answer a security, procurement or technical questionnaire item with citations',
      z.object({ question: z.string(), audience: z.string().optional() }),
      (a) =>
        `Answer this questionnaire item${a.audience ? ` for ${a.audience}` : ''}:\n\n"${a.question}"\n\n` +
        `Call answer_question with it first, then get_references for citable links.\n\n` +
        `Answer directly in the first sentence. Cite a documentation URL for each capability claim. ` +
        `If the evidence shows partial support or a gap, state it and describe the workaround — an overstatement discovered later costs more than the gap.`,
    )

    prompt(
      'handle_objection',
      'Handle an objection',
      'Respond to a competitive or technical objection using the matrix',
      z.object({ objection: z.string(), competitor: z.string().optional() }),
      (a) =>
        `A prospect raised this objection:\n\n"${a.objection}"\n\n` +
        `Call answer_question with it${a.competitor ? `, and get_vendor_profile for "${a.competitor}"` : ''}.\n\n` +
        `Acknowledge what is true in the objection before responding. Use the matrix verdicts — including where Vercel is only partial — ` +
        `and frame the comparison around what stays unsolved for them, not around the competitor being bad. End with a question that moves the conversation on.`,
    )
  },
  {
    serverInfo: { name: 'eaa-infos', version: '1.0.0' },
    instructions:
      'Content about the Enterprise Agents & Apps play: giving AI-built applications a governed home on Vercel. ' +
      'Use search_play when unsure which tool fits. compare_vendors returns verdicts only unless you pass detail:true with capability_ids. ' +
      'build_customer_brief and answer_question assemble material for you to write from — they do not write for you. ' +
      'Never assert a figure the corpus does not contain; every argument carries a measurement basis instead.',
  },
)

export { handler as GET, handler as POST }

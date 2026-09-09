# EAA Infos

A shareable overview of the **Enterprise Agents & Apps** play: the case for giving
AI-built applications a governed home.

Employees across the business already build working applications with AI coding
tools — most of them outside engineering. Those applications will run somewhere.
This site sets out why that needs a governed home, what a platform has to do
about it, and how the alternatives compare.

**Live:** https://eaa-infos.vercel.app

## Sections

| Route | What it covers |
|---|---|
| `/` | Overview — the three whys and an index of the rest |
| `/technical/capabilities` | The target operating model, stage by stage |
| `/procurement/value-and-risk` | Two claims per lifecycle stage with the arguments behind each |
| `/procurement/business-case` | The two-page executive brief |
| `/procurement/competitors` | 47 capabilities scored across 6 vendors, with rationale and sources |

## Content

All content is filesystem JSON under [`content/`](./content), loaded with
[Comark Content](https://content.comark.dev/integrations/nextjs). There are no
editing or upload endpoints — edit the JSON in a branch and review it in a PR.

## MCP server

The whole corpus is exposed over the Model Context Protocol, so you can put it
behind your own assistant — answer a prospect's question, compare against an
incumbent, assemble a business case, draft outreach, and cite a real source for
every claim.

**Endpoint:** `https://eaa-infos.vercel.app/api/mcp` — Streamable HTTP, public, no auth.

```json
{
  "mcpServers": {
    "eaa-infos": { "url": "https://eaa-infos.vercel.app/api/mcp" }
  }
}
```

For stdio-only clients: `npx -y mcp-remote https://eaa-infos.vercel.app/api/mcp`

### Tools

| Tool | What it gives you |
|---|---|
| `search_play` | Cross-corpus search. Start here when unsure which tool fits. |
| `get_lifecycle` | The six stages and their capabilities, with product links. |
| `compare_vendors` | 47 questions scored across 6 vendors. Verdicts only unless you pass `detail: true`. |
| `get_vendor_profile` | One alternative's coverage and gaps per segment. |
| `get_value_and_risk` | The lifecycle claims and 25 supporting arguments. |
| `get_business_case_brief` | The executive brief and advantage table. |
| `get_references` | Every product, documentation and source link. |
| `build_customer_brief` | Assembles material for a business case, call or email. |
| `answer_question` | Evidence-backed material for a question, objection or RFP item. |

**Prompts:** `write_business_case`, `draft_outreach_email`, `prep_discovery_call`,
`answer_rfp_question`, `handle_objection`.

**Resources:** `eaa://lifecycle`, `eaa://competitors/matrix`, `eaa://value-and-risk`,
`eaa://business-case/brief`, `eaa://references`.

### Response sizes are deliberate

The competitor matrix is ~33k tokens in full, so no tool returns it wholesale.
`compare_vendors` gives verdicts only (~3.7k for all 47 rows) and caps
`detail: true` at 8 rows. Every tool has an asserted budget:

```bash
pnpm dev
node scripts/check-mcp-budgets.mjs
```

A tool that quietly starts returning 30k tokens breaks every client, so that
check is the one worth keeping green.

### Implementation

`app/api/mcp/route.ts` runs on [`mcp-handler`](https://github.com/vercel/mcp-handler)
v2 — stateless Streamable HTTP, no Redis, no sessions. Content comes from
[`lib/play`](./lib/play), which reads the same JSON and seed data the website
renders, so the site and the MCP cannot drift.

## Local development

```bash
pnpm install
pnpm dev
```

The site renders with no environment variables. Feature flags degrade to
"show everything" when no flags service is configured.

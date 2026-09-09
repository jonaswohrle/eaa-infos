# EAA Infos

A shareable overview of the **Enterprise Agents & Apps** play: the case for giving
AI-built applications a governed home.

Creation has scaled — thousands of employees in large enterprises now build working
applications with AI coding tools, most of them outside engineering. The operating
model underneath has not kept up. This site sets out what breaks, how the
alternatives compare across the six lifecycle stages, and how to build the business
case for a specific organisation.

It is deliberately generic. The capability assessments and arguments come out of a
real enterprise evaluation, but no customer specifics are reproduced here.

## Sections

| Route | What it covers |
|---|---|
| `/` | Overview — the three whys, an index of the site, and the lifecycle comparison roll-up |
| `/technical/capabilities` | The target operating model, stage by stage |
| `/procurement/competitors` | 48 capabilities scored across 6 vendors, with rationale and sources |
| `/procurement/business-case` | 25 arguments by lifecycle stage, each with a basis for quantification |
| `/technical/poc-users` | The roles that need to be in the room for an evaluation |

## Content

All content is filesystem JSON under `content/`, served through
[`comark-content`](https://www.npmjs.com/package/comark-content) via `lib/queries.ts`.
There is no write path — a shared link cannot be mutated by a reader.

## Data

There is no database. All content is filesystem JSON, so the site has no runtime
dependency beyond the app itself.

## Local development

```bash
pnpm install
vercel env pull      # optional — the site renders without any env
pnpm dev
```

Feature flags degrade to "show everything" when no flags service is configured.

## Brand

Vercel monochrome. Colour tokens are pure neutrals (chroma 0) in `app/globals.css`;
the logotype in `public/brand/vercel-logotype.svg` is the official mark from
`@vercel/geistcn-assets`, unmodified and using `currentColor`.

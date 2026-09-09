# delivery-hero

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_0ZTE2cAQ4TS682h4tRF0FsSVlMXw)

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Content sources

All published portal content lives in [`content/`](./content) and is loaded directly from the local filesystem with [Comark Content](https://content.comark.dev/integrations/nextjs). The website has no editing, status-update, save, or upload endpoints. Edit these JSON documents in a branch and review the changes in a pull request:

- `answer-videos.json`
- `capabilities.json`
- `competitor-analysis.json`
- `content-blocks.json`
- `demo-environment.json`
- `documents.json`
- `poc-steps.json`
- `poc-users.json`
- `pricing-bands.json`
- `recordings.json`
- `requirements.json`
- `saved-offers.json`
- `security-items.json`

Validate filesystem content before opening a pull request:

```bash
pnpm content:check
```

`competitor-analysis.json` is the app-content snapshot for the competitor matrix. The collaborative Notion export
remains the raw source of truth; import its current questions, verdicts, rationale, and source links into this file,
then review the resulting snapshot through a pull request.

Import the current Notion research export into the app-content document with:

```bash
pnpm content:competitors:import -- /absolute/path/to/competitor-analysis-notion-current.json
```

The importer keeps each question, justification, and source, and normalizes the text before an em dash to `Yes`,
`Partial`, or `No` without emoji.

## Collaborative content review

PostgreSQL is used only as an append-only review inbox. It is not read or written by the website. Initialize the queue after pulling the project environment:

```bash
pnpm content:review:migrate
```

Submit one proposed item. Every submission is assigned the `in-review` status:

```bash
pnpm content:review:submit -- \
  --collection requirements \
  --item-key requirement-id \
  --file ./proposal.json \
  --submitted-by "Name" \
  --notes "Reason for the change"
```

Export pending proposals so they can be reviewed and promoted into `content/` in a pull request:

```bash
pnpm content:review:export
```

See [`content-reviews/README.md`](./content-reviews/README.md) for the promotion workflow.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

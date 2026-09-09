# Content review queue

Published website content is canonical in [`content/`](../content). The website has no editing or upload endpoints.

Collaborative changes enter PostgreSQL as append-only proposals with the `in-review` status. Submit one JSON object with a stable item key:

```bash
pnpm content:review:submit -- \
  --collection requirements \
  --item-key requirement-id \
  --file ./proposal.json \
  --submitted-by "Name" \
  --notes "Reason for the change"
```

Export the current review queue into `content-reviews/in-review.json`:

```bash
pnpm content:review:export
```

Review exported proposals, apply accepted changes to the matching `content/<collection>.json` document, and open a pull request. The export never changes published content and the website never writes to PostgreSQL.

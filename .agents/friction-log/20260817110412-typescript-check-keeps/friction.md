---
title: 'TypeScript check keeps stale deleted App Router routes until typegen'
severity: 'minor'
---

After deleting admin pages and API route handlers, `pnpm exec tsc --noEmit` failed because `.next/types/validator.ts` still imported the removed files and retained `/admin` in its route union. Running `pnpm exec next typegen` before the standalone TypeScript check regenerates the route types. The repository has no typecheck script that performs this prerequisite.

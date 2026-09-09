---
title: 'pnpm lint is configured without an ESLint dependency'
severity: 'minor'
---

## What happened

After a clean `pnpm install --frozen-lockfile`, running `pnpm lint` fails with
`sh: eslint: command not found`.

## Reproduction

1. Run `pnpm install --frozen-lockfile`.
2. Run `pnpm lint`.

## Expected

The declared lint script runs successfully in a clean checkout.

## Suggested fix

Declare compatible `eslint` and `eslint-config-next` dev dependencies and add
the repository's flat ESLint configuration, or remove the nonfunctional script.

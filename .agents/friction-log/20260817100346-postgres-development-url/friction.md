---
title: 'Postgres development URL emits a future SSL semantics warning'
severity: 'minor'
---

## What happened

Starting the app or connecting with `pg` succeeds, but `pg-connection-string` warns that `sslmode=require` currently aliases `verify-full` and will change semantics in its next major version.

## Reproduction

1. Pull the Vercel Development environment with `vercel env pull .env.local --environment=development`.
2. Run `pnpm dev`.
3. Request any database-backed route.

## Impact

The connection works today, but a future `pg` major upgrade may silently change TLS verification behavior unless the intended mode is made explicit.

## Suggested fix

Confirm the provider-supported TLS mode and normalize the connection configuration to an explicit `sslmode=verify-full` or the documented libpq-compatible behavior before upgrading to `pg` 9.

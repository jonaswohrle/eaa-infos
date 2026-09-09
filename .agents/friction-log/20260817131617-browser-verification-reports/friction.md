---
title: 'Browser verification reports missing favicon'
severity: 'minor'
---

## What happened

Opening the app in a browser produces a console error because `/favicon.ico` returns 404.

## Impact

Automated browser verification cannot reach a clean-console result even when the page has no runtime or hydration errors.

## Suggested improvement

Keep an App Router icon asset in `app/icon.svg` (or equivalent metadata) so every route serves a favicon.

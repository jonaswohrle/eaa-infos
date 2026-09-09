---
title: 'Comark fs JSON documents are silently skipped without the JSON plugin'
severity: 'minor'
target: 'comarkdown/comark-content'
---

## What happened

A Next.js integration using `fs('./content')` returned an empty manifest for valid JSON documents. The filesystem source loaded successfully and emitted no error, but `content.list()` was empty and `content.get('/capabilities')` returned no document.

## Workaround

Register `json()` from `comark-content/plugins/json` in the `comarkContent({ plugins: [...] })` configuration.

## Suggested improvement

The JSON content guide and Next.js integration should make the required parser registration explicit, or the runtime should warn when a discovered extension has no parser.

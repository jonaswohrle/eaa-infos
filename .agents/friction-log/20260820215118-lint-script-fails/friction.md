---
title: 'Lint script fails because ESLint is not installed'
severity: 'minor'
---

Running pnpm lint exits immediately with 'sh: eslint: command not found'. package.json defines eslint . but eslint is absent from devDependencies, so repository lint validation cannot run after a clean install.

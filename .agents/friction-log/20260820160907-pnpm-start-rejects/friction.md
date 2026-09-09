---
title: 'pnpm start rejects forwarded Next.js hostname and port flags'
severity: 'minor'
---

Running pnpm start -- --hostname 127.0.0.1 --port 3107 expands to next start -- --hostname 127.0.0.1 --port 3107. Next.js treats --hostname as the project directory and exits with: Invalid project directory provided, no such directory: .../--hostname. Running pnpm exec next start --hostname 127.0.0.1 --port 3107 works around it.

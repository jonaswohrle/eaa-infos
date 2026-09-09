---
title: 'Local production verification reports Vercel Analytics as a console error'
severity: 'minor'
---

Opening a local next start build records a 404 for /_vercel/insights/script.js and logs that Vercel Web Analytics failed to load. This makes an otherwise healthy local browser check report one console error even though the script is only available on a configured Vercel deployment.

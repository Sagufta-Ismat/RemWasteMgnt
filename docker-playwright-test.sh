#!/bin/sh
npm ci --unsafe-perm --loglevel=error
npx playwright install chromium
PLAYWRIGHT_BASE_URL=http://host.docker.internal:4174 npx playwright test --config=automation/playwright.config.ts --reporter=list

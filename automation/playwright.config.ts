import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173';
const webServer = process.env.PLAYWRIGHT_BASE_URL
  ? undefined
  : {
      command: 'npm run dev',
      port: 4173,
      reuseExistingServer: false,
      timeout: 60_000,
    };

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  use: {
    headless: true,
    baseURL,
    trace: 'on-first-retry',
  },
  webServer,
});

import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  timeout: 30000,
  use: { baseURL: process.env.SHOP_E2E_BASE_URL ?? 'http://127.0.0.1:3100', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.SHOP_E2E_BASE_URL ? undefined : { command: 'npm run dev --workspace @repo/web -- --port 3100', url: 'http://127.0.0.1:3100', reuseExistingServer: false, timeout: 120000 },
});

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['**/*.spec.ts'],

  use: {
    baseURL: 'http://localhost:4200',
    headless: false,
    trace: 'on-first-retry'
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],

  webServer: {
    command: 'cd frontend && ng serve --port 4200',
    url: 'http://localhost:4200/login',
    reuseExistingServer: true,
    timeout: 180000, // 3 minuti per compilare Angular
  }
});

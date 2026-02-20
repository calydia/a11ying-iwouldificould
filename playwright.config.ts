import { defineConfig, devices } from '@playwright/test';

const port = 4321;
const baseURL = `http://127.0.0.1:${port}`;
const useMocks = process.env.E2E_USE_MOCKS !== 'false';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: useMocks
    ? [
        {
          command: 'node tests/mock-server.mjs',
          url: 'http://127.0.0.1:4010',
          reuseExistingServer: !process.env.CI,
          timeout: 10_000,
        },
        {
          command: `npm run dev -- --host 127.0.0.1 --port ${port}`,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          env: {
            PUBLIC_PAYLOAD_URL: 'http://127.0.0.1:4010',
            PUBLIC_DRUPAL_URL: 'http://127.0.0.1:4010',
          },
        },
      ]
    : {
        command: `npm run preview -- --host 127.0.0.1 --port ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

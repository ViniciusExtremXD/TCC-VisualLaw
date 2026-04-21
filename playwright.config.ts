import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*e2e\.spec\.ts/,
  timeout: 120_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "artifacts/playwright-report", open: "never" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:3100",
    headless: true,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    trace: "on-first-retry",
  },
  outputDir: "artifacts/test-results",
  webServer: {
    command: "node scripts/serve-static.mjs out 3100",
    port: 3100,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});

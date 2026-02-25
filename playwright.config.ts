import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
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
    headless: true,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    trace: "on-first-retry",
  },
  outputDir: "artifacts/test-results",
  webServer: {
    command: "npm run preview",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

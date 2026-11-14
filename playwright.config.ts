import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4318",
    viewport: { width: 1440, height: 1000 },
    launchOptions: {
      executablePath:
        process.env.UI_BROWSER_EXECUTABLE ||
        (existsSync(edge) ? edge : undefined),
    },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "npm run dev",
      url: "http://127.0.0.1:4318",
      reuseExistingServer: true,
    },
    {
      command: "npm run dev:examples",
      url: "http://127.0.0.1:4319/react/",
      reuseExistingServer: true,
    },
  ],
});

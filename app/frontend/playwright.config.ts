import { defineConfig, devices } from '@playwright/test';

// The backend jar must be built first: cd ../backend && ./mvnw -q package -DskipTests
export default defineConfig({
  testDir: './e2e',
  reporter: 'line',
  use: { baseURL: 'http://localhost:4200' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'java -jar ../backend/target/transit-0.0.1-SNAPSHOT.jar',
      url: 'http://localhost:8080/api/offices',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm start',
      url: 'http://localhost:4200',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});

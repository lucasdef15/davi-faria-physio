import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  timeout: 45_000,

  expect: {
    timeout: 10_000,
  },

  use: {
    baseURL: process.env.TEST_URL ?? 'https://davi-faria-physio.vercel.app',

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'iphone-11-webkit',
      use: {
        ...devices['iPhone 11'],
        browserName: 'webkit',
      },
    },
    {
      name: 'iphone-12-webkit',
      use: {
        ...devices['iPhone 12'],
        browserName: 'webkit',
      },
    },
    {
      name: 'android-low-end',
      use: {
        browserName: 'chromium',

        viewport: {
          width: 360,
          height: 640,
        },

        screen: {
          width: 360,
          height: 640,
        },

        deviceScaleFactor: 1,
        hasTouch: true,
        isMobile: true,

        locale: 'pt-BR',
      },
    },
  ],
});

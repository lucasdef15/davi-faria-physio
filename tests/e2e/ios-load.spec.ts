import { expect, test } from '@playwright/test';

test('carrega o site e mantém o Hero visível', async ({ page }) => {
  const browserErrors: string[] = [];

  page.on('pageerror', (error) => {
    browserErrors.push(`Page error: ${error.message}`);
  });

  page.on('console', (message) => {
    if (message.type() === 'error') {
      browserErrors.push(`Console error: ${message.text()}`);
    }
  });

  const response = await page.goto('/', {
    timeout: 30_000,
    waitUntil: 'domcontentloaded',
  });

  expect(response?.ok()).toBeTruthy();

  await expect(page.locator('h1').first()).toBeVisible();

  // Mantém a página aberta enquanto canvas, GSAP e recursos tardios iniciam.
  await page.waitForTimeout(10_000);

  await page.evaluate(() => {
    window.scrollTo({
      behavior: 'instant',
      top: document.documentElement.scrollHeight,
    });
  });

  await page.waitForTimeout(2_000);

  expect(browserErrors).toEqual([]);
});

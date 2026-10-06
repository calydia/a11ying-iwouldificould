import { expect, type Page } from '@playwright/test';

type ExistingPageOptions = {
  language?: 'en' | 'fi';
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
};

export async function gotoExistingPage(
  page: Page,
  path: string,
  { language = 'en', waitUntil }: ExistingPageOptions = {},
) {
  const response = await page.goto(path, waitUntil ? { waitUntil } : undefined);
  expect(response?.ok(), `${path} should resolve`).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('lang', language);
  return response;
}

export async function waitForHydration(page: Page) {
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}

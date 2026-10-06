import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { gotoExistingPage } from './helpers';

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 375, height: 812 },
};

const PAGES = [
  { name: 'home', path: '/en/' },
  { name: 'content', path: '/en/fundamentals/the-basics/what-is-accessibility/' },
  { name: 'search', path: '/en/search/' },
];

async function takeScreenshot(
  page: Page,
  path: string,
  viewportKey: keyof typeof VIEWPORTS,
  pageName: string,
  dark: boolean
) {
  const theme = dark ? 'dark' : 'light';
  await page.addInitScript((darkMode) => {
    localStorage.setItem('darkMode', darkMode);
  }, dark ? 'enabled' : 'disabled');
  await page.setViewportSize(VIEWPORTS[viewportKey]);
  await gotoExistingPage(page, path);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('html')).toHaveClass(dark ? /\bdark\b/ : /\blight\b/);
  await expect(page).toHaveScreenshot(`${pageName}-${viewportKey}-${theme}.png`, {
    maxDiffPixelRatio: 0.02,
    fullPage: true,
  });
}

for (const { name, path } of PAGES) {
  for (const viewportKey of Object.keys(VIEWPORTS) as Array<keyof typeof VIEWPORTS>) {
    for (const dark of [false, true]) {
      const theme = dark ? 'dark' : 'light';
      test(`${name} — ${viewportKey} — ${theme}`, async ({ page }) => {
        await takeScreenshot(page, path, viewportKey, name, dark);
      });
    }
  }
}

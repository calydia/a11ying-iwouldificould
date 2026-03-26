import { test, expect, Page } from '@playwright/test';

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
  if (dark) {
    // Add dark class via initScript so the page renders in dark mode from the start,
    // avoiding timing issues with post-load class toggling.
    await page.addInitScript(() => {
      document.documentElement.classList.add('dark');
    });
  }
  await page.setViewportSize(VIEWPORTS[viewportKey]);
  await page.goto(path);
  await page.waitForLoadState('networkidle');
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

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Front page accessibility', () => {    
  test('Finnish page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/fi/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('English page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/en/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Search accessibility', () => {    
  test('Finnish page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/fi/haku/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('English page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/en/search/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Basic page', () => {    
  test('Finnish page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/fi/perusteet/perusjutut/mita-saavutettavuus-on/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('English page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/en/fundamentals/the-basics/what-is-accessibility/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});



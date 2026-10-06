import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { gotoExistingPage } from './helpers';

test.describe('Front page accessibility', () => {    
  test('Finnish page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await gotoExistingPage(page, '/fi/', { language: 'fi' });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('English page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await gotoExistingPage(page, '/en/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Search accessibility', () => {    
  test('Finnish page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await gotoExistingPage(page, '/fi/haku/', { language: 'fi' });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('English page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await gotoExistingPage(page, '/en/search/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Basic page', () => {    
  test('Finnish page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await gotoExistingPage(page, '/fi/perusteet/perusjutut/mita-saavutettavuus-on/', { language: 'fi' });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('English page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await gotoExistingPage(page, '/en/fundamentals/the-basics/what-is-accessibility/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});


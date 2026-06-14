import { expect, test, type Route } from '@playwright/test';

function requestQuery(route: Route): string {
  const requestUrl = decodeURIComponent(route.request().url());
  return requestUrl.match(/like]=([^&]+)/)?.[1] ?? '';
}

function searchResponse(query: string) {
  return {
    totalDocs: 1,
    docs: [
      {
        title: `${query} result`,
        searchDescription: `Description for ${query}`,
        searchPageUrl: `results/${query}`,
        doc: { relationTo: 'pages' },
      },
    ],
  };
}

async function waitForSearchHydration(page: import('@playwright/test').Page) {
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}

test.describe('Search page', () => {
  test('restores URL searches and browser history', async ({ page }) => {
    await page.route('**/api/search**', async (route) => {
      const query = requestQuery(route);
      await route.fulfill({ json: searchResponse(query) });
    });

    await page.goto('/en/search/?q=contrast');
    const input = page.getByRole('textbox', { name: 'Search for content' });
    await expect(input).toHaveValue('contrast');
    await expect(page.getByRole('heading', { name: /contrast result/i })).toBeVisible();

    await input.fill('keyboard');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(input).toBeFocused();
    await expect(page).toHaveURL(/\/en\/search\/\?q=keyboard$/);
    await expect(page.getByRole('heading', { name: /keyboard result/i })).toBeVisible();

    await page.goBack();
    await expect(input).toHaveValue('contrast');
    await expect(page.getByRole('heading', { name: /contrast result/i })).toBeVisible();
  });

  test('announces empty and error states in both languages', async ({ page }) => {
    await page.route('**/api/search**', async (route) => {
      const query = requestQuery(route);
      if (query === 'broken') {
        await route.fulfill({ status: 500, body: 'Search unavailable' });
        return;
      }
      await route.fulfill({ json: { totalDocs: 0, docs: [] } });
    });

    await page.goto('/en/search/');
    await waitForSearchHydration(page);
    await page.getByRole('textbox', { name: 'Search for content' }).fill('missing');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('status')).toHaveText('No results.');

    await page.getByRole('textbox', { name: 'Search for content' }).fill('broken');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('alert')).toHaveText('Search failed. Please try again.');

    await page.goto('/fi/haku/?q=broken');
    await expect(page.getByRole('alert')).toHaveText('Haku epäonnistui. Yritä uudelleen.');
  });
});

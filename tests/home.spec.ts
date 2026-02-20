import { expect, test } from '@playwright/test';

test('home page renders payload and blog content', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('I would if I could');
  await expect(page.getByText('Mocked introduction paragraph.')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'My newest blog posts on accessibility in my personal blog' })).toBeVisible();
  await expect(page.getByText('Personal Blog Post One')).toBeVisible();

  await expect(page.getByRole('heading', { name: "My newest blog posts on accessibility in Exove's blog" })).toBeVisible();
  await expect(page.getByText('Exove Post One')).toBeVisible();
});

test('main navigation renders mocked items', async ({ page }) => {
  await page.goto('/');

  const nav = page.locator('#main-menu');
  await expect(nav).toContainText('Home');
});

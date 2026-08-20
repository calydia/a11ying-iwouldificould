import { expect, test } from '@playwright/test';

test('home page renders payload and blog content', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 }).first()).toHaveText('I would if I could!');
  await expect(page.locator('p').filter({ hasText: 'Mocked introduction paragraph.' })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Latest accessibility articles from my blog' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Personal Blog Post One' })).toBeVisible();

  await expect(page.getByRole('heading', { name: "My newest blog posts on accessibility in Exove's blog" })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Exove Post One' })).toBeVisible();
});

test('shared social image metadata uses the A11ying brand image', async ({ page }) => {
  await page.goto('/en/');

  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://a11y.ing/social-media-share.jpg');
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute('content', 'image/jpeg');
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', 'A11ying with Sanna');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://a11y.ing/social-media-share.jpg');
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute('content', 'A11ying with Sanna');
});

test('blog cards use a title-only link and source-appropriate content', async ({ page }) => {
  await page.goto('/');

  const personalSection = page.locator('section[aria-labelledby="a11y-blog-heading"]');
  const personalCard = personalSection.locator('li.card-cover').first();
  const personalLink = personalCard.getByRole('link');

  await expect(personalLink).toHaveCount(1);
  await expect(personalLink).toHaveText('Personal Blog Post One');
  await expect(personalLink.locator('img, p, time')).toHaveCount(0);
  await expect(personalCard.getByText('Description for personal blog post one.')).toBeVisible();
  await expect(personalCard).not.toContainText('Accessibility');

  const exoveSection = page.locator('section[aria-labelledby="a11y-blog-heading-exove"]');
  const exoveCard = exoveSection.locator('li.card-cover').first();
  const exoveLink = exoveCard.getByRole('link');

  await expect(exoveLink).toHaveCount(1);
  await expect(exoveLink).toHaveText('Exove Post One');
  await expect(exoveLink.locator('img, p, time')).toHaveCount(0);
  await expect(exoveCard.locator('p')).toHaveCount(0);
  await expect(exoveCard.locator('time')).toBeVisible();

  await personalLink.focus();
  await expect(personalCard).toHaveCSS('outline-style', 'solid');
});

test('main navigation renders mocked items', async ({ page }) => {
  await page.goto('/');

  const nav = page.locator('#main-menu');
  await expect(nav).toContainText('Fundamentals');
});

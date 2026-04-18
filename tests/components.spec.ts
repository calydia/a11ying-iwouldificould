import { test, expect } from '@playwright/test';

test.describe('Skip link', () => {
  test('is the first focusable element', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('href', /#skip-target|#skip/);
  });

  test('moves focus to main content when activated', async ({ page }) => {
    await page.goto('/en/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.locator('#skip-target')).toBeInViewport();
  });

  test('is keyboard accessible (Enter activates)', async ({ page }) => {
    await page.goto('/en/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.locator('#skip-target')).toBeInViewport();
  });
});

test.describe('Theme toggle', () => {
  test('button is visible and has aria-pressed', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#theme-toggle-button')).toBeVisible();
    await expect(page.locator('#theme-toggle-button')).toHaveAttribute('aria-pressed');
  });

  test('clicking changes dark/light class on <html>', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    const html = page.locator('html');
    const button = page.locator('#theme-toggle-button');
    const wasDark = await html.evaluate((el) => el.classList.contains('dark'));
    await button.click();
    if (wasDark) {
      await expect(html).not.toHaveClass(/\bdark\b/);
    } else {
      await expect(html).toHaveClass(/\bdark\b/);
    }
  });

  test('dark mode persists across reload (localStorage)', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('darkMode', 'enabled'));
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  test('light mode persists across reload (localStorage)', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('darkMode', 'disabled'));
    await page.goto('/en/');
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });
});

test.describe('Language switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/');
    // Wait for React components to hydrate (client:load)
    await page.waitForLoadState('networkidle');
  });

  test('opens on button click with aria-expanded="true"', async ({ page }) => {
    const button = page.locator('#language-menu-button');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#lang-switcher')).toBeVisible();
  });

  test('closes on second button click', async ({ page }) => {
    const button = page.locator('#language-menu-button');
    await button.click();
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('switches from English to Finnish', async ({ page }) => {
    await page.locator('#language-menu-button').click();
    await page.locator('#lang-switcher a[hreflang="fi"]').click();
    await expect(page).toHaveURL(/\/fi\//);
  });

  test('is keyboard accessible (Enter opens menu)', async ({ page }) => {
    const button = page.locator('#language-menu-button');
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('SearchBlock', () => {
  test('search icon links to English search page', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#search-a a')).toHaveAttribute('href', '/en/search/');
  });

  test('search icon links to Finnish search page', async ({ page }) => {
    await page.goto('/fi/');
    await expect(page.locator('#search-a a')).toHaveAttribute('href', '/fi/haku/');
  });

  test('search link has a screen-reader label', async ({ page }) => {
    await page.goto('/en/');
    const srOnly = page.locator('#search-a .sr-only');
    const text = await srOnly.textContent();
    expect(text).toBeTruthy();
  });
});

test.describe('Main navigation escape handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
  });

  test('closes the current nested level first, then the parent level on second Escape', async ({ page }) => {
    const menuToggle = page.locator('#main-menu-toggle');
    const topButton = page.locator('.menu-button').first();
    const nestedToggle = page.locator('.menu-button-ul .mobile-menu-toggle').first();
    const nestedLink = page.locator('.menu-button-ul .menu-lower-level a').first();

    await menuToggle.click();
    await topButton.click();
    await nestedToggle.click();

    await nestedLink.focus();
    await page.keyboard.press('Escape');

    await expect(nestedToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nestedToggle).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(topButton).toHaveAttribute('aria-expanded', 'false');
    await expect(topButton).toBeFocused();
  });

  test('closes the open submenu first and the whole menu on second Escape from the top-level button', async ({ page }) => {
    const menuToggle = page.locator('#main-menu-toggle');
    const topButton = page.locator('.menu-button').first();

    await menuToggle.click();
    await topButton.click();
    await topButton.focus();

    await page.keyboard.press('Escape');

    await expect(topButton).toHaveAttribute('aria-expanded', 'false');
    await expect(topButton).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menuToggle).toBeFocused();
  });
});

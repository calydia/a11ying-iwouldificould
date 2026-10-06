import { test, expect } from '@playwright/test';
import { gotoExistingPage, waitForHydration } from './helpers';

test.describe('Skip link', () => {
  test('is the first focusable element', async ({ page }) => {
    await gotoExistingPage(page, '/en/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  });

  test('moves the viewport to main content when activated', async ({ page }) => {
    await gotoExistingPage(page, '/en/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    const target = page.locator('#skip-target');
    await expect(target).toBeInViewport();
    await expect(target).toBeFocused();
  });
});

test.describe('Theme toggle', () => {
  test('button is visible and has aria-pressed', async ({ page }) => {
    await gotoExistingPage(page, '/en/');
    const button = page.getByRole('button', { name: /Switch to (dark|light) version/ });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('aria-pressed');
  });

  test('clicking changes dark/light class on <html>', async ({ page }) => {
    await gotoExistingPage(page, '/en/');
    await waitForHydration(page);
    const html = page.locator('html');
    const button = page.getByRole('button', { name: /Switch to (dark|light) version/ });
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
    await gotoExistingPage(page, '/en/');
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  test('light mode persists across reload (localStorage)', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('darkMode', 'disabled'));
    await gotoExistingPage(page, '/en/');
    await expect(page.locator('html')).toHaveClass(/\blight\b/);
  });
});

test.describe('Language switcher', () => {
  test.beforeEach(async ({ page }) => {
    await gotoExistingPage(page, '/en/');
    await waitForHydration(page);
  });

  test('opens on button click with aria-expanded="true"', async ({ page }) => {
    const button = page.getByRole('button', { name: /Switch language/ });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'Suomi (FI)' })).toBeVisible();
  });

  test('closes on second button click', async ({ page }) => {
    const button = page.getByRole('button', { name: /Switch language/ });
    await button.click();
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('switches from English to Finnish', async ({ page }) => {
    await page.getByRole('button', { name: /Switch language/ }).click();
    await page.getByRole('link', { name: 'Suomi (FI)' }).click();
    await expect(page).toHaveURL(/\/fi\//);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fi');
  });

  test('is keyboard accessible (Enter opens menu)', async ({ page }) => {
    const button = page.getByRole('button', { name: /Switch language/ });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('SearchBlock', () => {
  test('search icon links to English search page', async ({ page }) => {
    await gotoExistingPage(page, '/en/');
    await expect(page.getByRole('link', { name: 'Go to search page' })).toHaveAttribute('href', '/en/search/');
  });

  test('search icon links to Finnish search page', async ({ page }) => {
    await gotoExistingPage(page, '/fi/', { language: 'fi' });
    await expect(page.getByRole('link', { name: 'Siirry hakusivulle' })).toHaveAttribute('href', '/fi/haku/');
  });

  test('search link has a screen-reader label', async ({ page }) => {
    await gotoExistingPage(page, '/en/');
    await expect(page.getByRole('link', { name: 'Go to search page' })).toHaveAccessibleName('Go to search page');
  });
});

test.describe('Footer links', () => {
  test('English footer links to the renewed accessibility blog and Testing Lab', async ({ page }) => {
    await gotoExistingPage(page, '/en/');
    const footer = page.locator('footer');

    await expect(footer.getByRole('link', { name: 'Accessibility blog' })).toHaveAttribute('href', 'https://sanna.a11y.ing/blog/accessibility/');
    await expect(footer.getByRole('link', { name: 'Accessibility Testing Lab' })).toHaveAttribute('href', 'https://testing.a11y.ing/');
  });

  test('Finnish footer identifies the Testing Lab as English-language content', async ({ page }) => {
    await gotoExistingPage(page, '/fi/', { language: 'fi' });
    const footer = page.locator('footer');
    const testingLabLink = footer.getByRole('link', { name: 'Accessibility Testing Lab' });

    await expect(footer.getByRole('link', { name: 'Saavutettavuusblogi' })).toHaveAttribute('href', 'https://sanna.a11y.ing/blog/accessibility/');
    await expect(testingLabLink).toHaveAttribute('href', 'https://testing.a11y.ing/');
    await expect(testingLabLink).toHaveAttribute('hreflang', 'en');
    await expect(testingLabLink.locator('[lang="en"]')).toHaveText('Accessibility Testing Lab');
    await expect(footer.getByText('(englanniksi)', { exact: true })).toBeVisible();
  });
});

test.describe('Main navigation escape handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await gotoExistingPage(page, '/en/');
    await waitForHydration(page);
  });

  test('closes the current nested level first, then the parent level on second Escape', async ({ page }) => {
    const menuToggle = page.getByRole('button', { name: 'Navigation' });
    const topButton = page.getByRole('button', { name: 'Fundamentals' });
    const nestedToggle = page.getByRole('button', { name: /Types of disabilities/ });
    const nestedLink = page.getByRole('link', { name: 'Visual disabilities' });

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
    const menuToggle = page.getByRole('button', { name: 'Navigation' });
    const topButton = page.getByRole('button', { name: 'Fundamentals' });

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

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const publicPages = ['/', '/links/', '/privacy/'];

test('homepage uses the approved coming-soon headline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Coming Soon' })).toBeVisible();
  await expect(page.getByText('The world is still taking shape.')).toHaveCount(0);
});

for (const path of publicPages) {
  test(`${path} has no obvious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test(`${path} does not overflow horizontally`, async ({ page }) => {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}

test('keyboard navigation exposes the skip link and primary action focus', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  const primary = page.getByRole('link', { name: 'Join the Discord' });
  await expect(primary).toBeFocused();
  const outline = await primary.evaluate((element) => getComputedStyle(element).outlineWidth);
  expect(Number.parseFloat(outline)).toBeGreaterThanOrEqual(3);
});

test('reduced motion removes meaningful transition duration', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/links/?utm_source=instagram');
  const primary = page.getByRole('link', { name: 'Join the Discord' });
  const transitionSeconds = await primary.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).transitionDuration),
  );
  expect(transitionSeconds).toBeLessThanOrEqual(0.001);
});

test('unconfirmed destinations are omitted', async ({ page }) => {
  await page.goto('/links/');
  await expect(page.getByRole('link', { name: 'Join the Discord' })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'YouTube' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'TikTok' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Instagram' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'X' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Bluesky' })).toHaveCount(0);
});

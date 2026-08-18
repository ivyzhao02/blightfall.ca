import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const publicPages = [
  '/',
  '/studio/',
  '/projects/',
  '/projects/blightfall/',
  '/news/',
  '/contact/',
  '/links/',
  '/privacy/',
];

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

test('approved social destinations are published and unconfirmed destinations are omitted', async ({
  page,
}) => {
  await page.goto('/links/');
  await expect(page.getByRole('link', { name: 'Join the Discord' })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'YouTube' })).toHaveAttribute(
    'href',
    'https://www.youtube.com/@BlightFallRoblox',
  );
  await expect(page.getByRole('link', { name: 'TikTok' })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Instagram' })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'X', exact: true })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Bluesky' })).toHaveCount(1);
  await expect(page.getByRole('link', { name: /Roblox/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /latest gameplay/i })).toHaveCount(0);
});

test('the permanent links page stays compact and does not repeat editorial game copy', async ({
  page,
}) => {
  await page.goto('/links/');
  await expect(page.getByRole('heading', { level: 1, name: 'Official links' })).toBeVisible();
  await expect(page.locator('.hero__description')).toHaveCount(0);
  await expect(page.locator('.hero__message')).toHaveCount(0);
  await expect(page.getByText(/Explore a hand-built world/i)).toHaveCount(0);
  await expect(page.locator('img[src*="atmosphere"]')).toHaveCount(0);
});

test('studio and homepage teasers do not repeat destination-page body copy', async ({ page }) => {
  await page.goto('/studio/');
  await expect(
    page.getByText('BlightFall is an independent game studio and development team.', {
      exact: false,
    }),
  ).toHaveCount(0);
  await expect(page.getByText(/upcoming dark-fantasy Roblox RPG/i)).toHaveCount(0);

  await page.goto('/');
  await expect(
    page.getByText(
      'Current game announcements are published through the official BlightFall Discord.',
    ),
  ).toHaveCount(0);
});

test('studio navigation exposes the public site structure', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation.getByRole('link', { name: 'Studio' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Projects' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'News' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Official links' })).toBeVisible();
});

const brandImages = [
  ['/', '.flagship-visual__wordmark'],
  ['/', '.project-feature__media img'],
  ['/links/', '.hero__wordmark'],
  ['/links/', '.hero__sigil img'],
  ['/projects/blightfall/', '.game-hero__title img'],
] as const;

for (const [path, selector] of brandImages) {
  test(`${path} preserves the aspect ratio of ${selector}`, async ({ page }) => {
    await page.goto(path);
    const dimensions = await page.locator(selector).evaluate((image: HTMLImageElement) => ({
      naturalRatio: image.naturalWidth / image.naturalHeight,
      renderedRatio: image.getBoundingClientRect().width / image.getBoundingClientRect().height,
    }));

    expect(dimensions.naturalRatio).toBeGreaterThan(0);
    expect(Math.abs(dimensions.naturalRatio - dimensions.renderedRatio)).toBeLessThan(0.02);
  });
}

const atmosphereImages = [
  ['/', '.flagship-visual__backdrop', 'eager'],
  ['/projects/', '.project-listing__backdrop', 'lazy'],
  ['/projects/blightfall/', '.game-hero__backdrop', 'eager'],
] as const;

for (const [path, selector, loading] of atmosphereImages) {
  test(`${path} uses the responsive game atmosphere artwork`, async ({ page }) => {
    await page.goto(path);
    const picture = page.locator(selector);
    const image = picture.locator('img');
    const expectedAsset =
      (page.viewportSize()?.width ?? 0) <= 736
        ? 'game-atmosphere-mobile-1024x1536.webp'
        : 'game-atmosphere-desktop-1600x900.webp';

    await expect(picture.locator('source')).toHaveAttribute(
      'srcset',
      '/assets/site/game-atmosphere-mobile-1024x1536.webp',
    );
    await expect(image).toHaveAttribute('loading', loading);
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.currentSrc))
      .toContain(expectedAsset);
  });
}

test('the studio header uses only the approved studio atmosphere artwork', async ({ page }) => {
  await page.goto('/studio/');
  const hero = page.locator('.editorial-hero--atmosphere');
  await expect(hero.locator('.editorial-hero__backdrop')).toHaveAttribute(
    'src',
    '/assets/site/studio-atmosphere-1600x900.webp',
  );
  await expect(hero.locator('img[src*="game-atmosphere"]')).toHaveCount(0);
});

test('arcane dividers remain decorative and selective', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.arcane-divider')).toHaveCount(1);
  await expect(page.locator('.arcane-divider img')).toHaveAttribute('alt', '');
  await page.goto('/projects/blightfall/');
  await expect(page.locator('.arcane-divider')).toHaveCount(1);
});

test('contact publishes only the approved categorized inboxes', async ({ page }) => {
  await page.goto('/contact/');
  const addresses = [
    'hello@blightfall.ca',
    'business@blightfall.ca',
    'press@blightfall.ca',
    'support@blightfall.ca',
    'privacy@blightfall.ca',
  ];

  for (const address of addresses) {
    await expect(page.locator(`a[href^="mailto:${address}"]`)).toHaveCount(1);
  }
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(addresses.length);
  await expect(page.locator('form')).toHaveCount(0);
});

test('news identifies Discord as the current source without embedding a third-party feed', async ({
  page,
}) => {
  await page.route(
    'https://discord.com/api/v10/invites/blightfall?with_counts=true',
    async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          approximate_member_count: 1550,
          approximate_presence_count: 544,
        }),
      });
    },
  );
  await page.goto('/news/');
  await expect(
    page.getByRole('heading', { name: 'Follow game announcements in Discord.' }),
  ).toBeVisible();
  const widget = page.locator('[data-discord-widget]');
  await expect(widget).toHaveAttribute('href', 'https://discord.gg/blightfall');
  await expect(widget.locator('[data-discord-members]')).toHaveText('1,550');
  await expect(widget.locator('[data-discord-online]')).toHaveText('544');
  await expect(widget.locator('img')).toHaveAttribute('src', '/assets/blightfall-icon.png');
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('the detailed project description is not repeated in visible project copy', async ({
  page,
}) => {
  await page.goto('/projects/blightfall/');
  await expect(
    page.getByText(
      'Explore a hand-built world, train into branching classes, take on quests and bosses, and fight through formal turn-based battles alone or with a party. Death can end a character, but permanent Remnants carry part of each lost life into the next.',
      { exact: true },
    ),
  ).toHaveCount(1);
  await expect(
    page.getByText('A world consumed by the Blight. A life you may not keep.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/approved for publication/i)).toHaveCount(0);
});

test('the footer uses the concise copyright line', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.site-footer__legal')).toHaveText('© 2026 BlightFall');
});

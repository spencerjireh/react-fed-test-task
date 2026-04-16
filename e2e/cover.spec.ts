import { expect, test } from '@playwright/test';

test.describe('Cover V1', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop-only');
  });

  test('cold boot shows the hero + full chrome, no detail pane', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByText('I NEED', { exact: true })).toBeVisible();
    await expect(page.getByText('A NAME', { exact: true })).toBeVisible();
    await expect(page.getByTestId('cover-hero-img')).toBeVisible();

    await expect(
      page.getByRole('radiogroup', { name: /pet's gender/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Filter by Famous/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('tablist', { name: /Filter by letter/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('region', { name: /selected name details/i }),
    ).toHaveCount(0);
  });

  test('a bogus selection token still shows the hero and leaves the URL intact', async ({
    page,
  }) => {
    await page.goto('/?n=NoSuchName');

    await expect(page.getByText('I NEED', { exact: true })).toBeVisible();
    await expect(page.getByText('A NAME', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('region', { name: /selected name details/i }),
    ).toHaveCount(0);
    await expect(page).toHaveURL(/n=NoSuchName/);
  });
});

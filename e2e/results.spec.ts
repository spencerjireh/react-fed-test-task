import { expect, test } from '@playwright/test';

test.describe('Results state', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop-only');
  });

  test('clicking the Cover hero writes ?l=A&g=M and lands on Results', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('[data-browse-state="cover"]')).toBeVisible();

    await page.getByRole('button', { name: /start browsing names/i }).click();

    await expect(page).toHaveURL(/[?&]l=A/);
    await expect(page).toHaveURL(/[?&]g=M/);
    await expect(page.locator('[data-browse-state="results"]')).toBeVisible();
    await expect(page.getByTestId('results-puppy-img')).toBeVisible();
    await expect(
      page.getByRole('region', { name: /selected name details/i }),
    ).toHaveCount(0);
  });

  test('Results → Detail flips chevrons to the left and shows the detail pane', async ({
    page,
  }) => {
    await page.goto('/?l=A&g=M');
    await expect(page.locator('[data-browse-state="results"]')).toBeVisible();
    await expect(
      page.locator('[data-chevron-side="right"]').first(),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Ace' }).click();

    await expect(page).toHaveURL(/n=Ace/);
    await expect(page.locator('[data-browse-state="detail"]')).toBeVisible();
    await expect(
      page.locator('[data-chevron-side="left"]').first(),
    ).toBeVisible();
    await expect(
      page.getByRole('region', { name: /selected name details/i }),
    ).toBeVisible();
  });

  test('Escape in Detail returns to Results with filters preserved', async ({
    page,
  }) => {
    await page.goto('/?l=A&g=M&n=Ace');
    await expect(page.locator('[data-browse-state="detail"]')).toBeVisible();

    // Focus something inside the detail region, then press Escape.
    await page.getByRole('region', { name: /selected name details/i }).click();
    await page.keyboard.press('Escape');

    await expect(page.locator('[data-browse-state="results"]')).toBeVisible();
    await expect(page).not.toHaveURL(/n=/);
    await expect(page).toHaveURL(/l=A/);
    await expect(page).toHaveURL(/g=M/);
  });

  test('reload at bare / returns to Cover', async ({ page }) => {
    await page.goto('/?l=A&g=M');
    await expect(page.locator('[data-browse-state="results"]')).toBeVisible();

    await page.goto('/');
    await expect(page.locator('[data-browse-state="cover"]')).toBeVisible();
  });

  test('direct goto /?l=A hydrates straight into Results', async ({ page }) => {
    await page.goto('/?l=A');
    await expect(page.locator('[data-browse-state="results"]')).toBeVisible();
    await expect(page.getByTestId('results-puppy-img')).toBeVisible();
  });

  test('clicking the Results photo returns to Cover with a bare URL', async ({
    page,
  }) => {
    await page.goto('/?l=A&g=M');
    await expect(page.locator('[data-browse-state="results"]')).toBeVisible();

    await page.getByRole('button', { name: /return to cover/i }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('[data-browse-state="cover"]')).toBeVisible();
  });
});

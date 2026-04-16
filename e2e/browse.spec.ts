import { expect, test } from '@playwright/test';

// Cover hero hides the list until a name is selected; seed via the URL.
const ACHILLES_TITLE = 'Achilles';

test.describe('Browse', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop-only');
  });

  test('letter filter + name selection updates the URL and detail pane', async ({
    page,
  }) => {
    await page.goto(`/?n=${ACHILLES_TITLE}`);

    await expect(
      page.getByRole('region', { name: 'Selected name details' }),
    ).toBeVisible();

    // With ?n=Achilles seeded, Virtuoso pins the list around the selection,
    // so pick a name that's in the rendered window (Acorn is two rows below).
    await expect(page.getByRole('button', { name: 'Acorn' })).toBeVisible();

    await page.getByRole('tab', { name: 'Filter by letter A' }).click();
    await expect(page).toHaveURL(/l=A/);

    await page.getByRole('button', { name: 'Acorn' }).click();

    await expect(page).toHaveURL(/n=Acorn/);

    await expect(page.getByText(/related name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Share on Twitter' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Share on Facebook' }),
    ).toBeVisible();
  });
});

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

    // Virtuoso only renders the first ~11 rows — pick names near the top
    // alphabetically (Ace is index 3) so the assertions don't race scrolling.
    await expect(page.getByRole('button', { name: 'Ace' })).toBeVisible();

    await page.getByRole('tab', { name: 'Filter by letter A' }).click();
    await expect(page).toHaveURL(/l=A/);

    await page.getByRole('button', { name: 'Ace' }).click();

    await expect(page).toHaveURL(/n=Ace/);

    await expect(page.getByText(/related name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Share on Twitter' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Share on Messenger' }),
    ).toBeVisible();
  });
});

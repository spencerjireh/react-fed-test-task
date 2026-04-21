import { expect, test } from '@playwright/test';

const AARON_TITLE = 'Aaron';

test.describe('Mobile bottom sheet', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'mobile-chromium',
      'mobile-chromium project only',
    );
  });

  test('detail opens as a bottom sheet, chevrons are hidden, Escape closes', async ({
    page,
  }) => {
    await page.goto(`/?n=${AARON_TITLE}`);

    // Radix Dialog.Title is sr-only; the dialog is found by its labelled name.
    const dialog = page.getByRole('dialog', { name: /selected name details/i });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('region', { name: 'Selected name details' }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: /Previous page/i }),
    ).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Next page/i })).toHaveCount(
      0,
    );

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(page).not.toHaveURL(/n=/);
  });
});

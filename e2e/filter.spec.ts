import { expect, test } from '@playwright/test';

const AARON_TITLE = 'Aaron';
const DRINKS_ID = '019c8a34-35f6-70a9-bda7-5f0eaf8a07d5';

test.describe('Category filter', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop-only');
  });

  test('checking Drinks narrows the list and writes the raw id to the URL', async ({
    page,
  }) => {
    // Seed a selection so the name list renders (cover hero would hide it).
    await page.goto(`/?n=${AARON_TITLE}`);
    await expect(page.getByRole('button', { name: 'Aaron' })).toBeVisible();

    await page
      .getByRole('button', { name: 'Filter by Food and drinks' })
      .click();

    // exact:true because "Drinks" substring-matches "All Food and drinks".
    const drinksItem = page.getByRole('checkbox', {
      name: 'Drinks',
      exact: true,
    });
    await expect(drinksItem).toBeVisible();
    await drinksItem.click();

    await expect(page).toHaveURL(new RegExp(`rc=${DRINKS_ID}`));

    await page.keyboard.press('Escape');

    await expect(page.getByRole('button', { name: 'Brandy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Aaron' })).toHaveCount(0);
  });
});

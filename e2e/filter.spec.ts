import { expect, test } from '@playwright/test';

const AARON_TITLE = 'Aaron';

test.describe('Category filter', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop-only');
  });

  test('checking Drinks narrows the list and writes the raw name to the URL', async ({
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

    await expect(page).toHaveURL(/rc=Drinks/);

    await page.keyboard.press('Escape');

    await expect(page.getByRole('button', { name: 'Brandy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Aaron' })).toHaveCount(0);
  });
});

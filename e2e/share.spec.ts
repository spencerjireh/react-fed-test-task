import { expect, test } from '@playwright/test';

const ACHILLES_TITLE = 'Achilles';

test.describe('Share (URL round-trip)', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop-only');
  });

  test('a shared URL reopens with the same filters + selection', async ({
    browser,
    page,
  }) => {
    await page.goto(`/?n=${ACHILLES_TITLE}`);
    await expect(
      page.getByRole('region', { name: 'Selected name details' }),
    ).toBeVisible();

    // exact:true — "Male" otherwise substring-matches "Female".
    await page.getByRole('radio', { name: 'Male', exact: true }).click();
    await expect(page).toHaveURL(/g=M/);

    await page.getByRole('tab', { name: 'Filter by letter A' }).click();
    await expect(page).toHaveURL(/l=A/);

    const sharedUrl = page.url();
    expect(sharedUrl).toContain('g=M');
    expect(sharedUrl).toContain('l=A');
    expect(sharedUrl).toContain('n=');

    // Fresh context — no cookies or localStorage bleed from the first page.
    const freshContext = await browser.newContext();
    const freshPage = await freshContext.newPage();
    await freshPage.goto(sharedUrl);

    await expect(
      freshPage.getByRole('region', { name: 'Selected name details' }),
    ).toBeVisible();
    await expect(
      freshPage.getByRole('radio', { name: 'Male', exact: true }),
    ).toHaveAttribute('aria-checked', 'true');
    await expect(
      freshPage.getByRole('tab', { name: 'Filter by letter A' }),
    ).toHaveAttribute('aria-selected', 'true');

    await freshContext.close();
  });
});

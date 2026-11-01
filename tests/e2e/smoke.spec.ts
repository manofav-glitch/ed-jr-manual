import { expect, test, type Page } from '@playwright/test';

// One smoke test per bottom tab, plus offline use after the first load.

const tab = (page: Page, name: string) => page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name });

test('Protocols: open a presentation, tick a step, see red flags, search and jump', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: /Chest pain/ }).click();

  await expect(page.getByRole('heading', { name: 'Chest pain' })).toBeVisible();
  await page.getByRole('checkbox', { name: /Site of pain/ }).click();
  await expect(page.getByText('1 of 10 done')).toBeVisible();

  await page.getByRole('link', { name: /Red flags/ }).click();
  await expect(page.getByRole('note')).toHaveText('Any red flag → shift to Red area, inform SR.');

  await page.getByRole('link', { name: /Tests/ }).click();
  await expect(page.getByRole('checkbox', { name: /Troponin I\*/ })).toContainText('Ask SR');

  await tab(page, 'Protocols').click();
  await page.getByRole('searchbox').fill('Hamman');
  await page.getByRole('link', { name: /Boerhaave/ }).click();
  await expect(page.getByText("Hamman's crunch (audible crepitus with heart beat) — rare finding on examination")).toBeVisible();
});

test('Triage: normal vitals are GREEN, SpO₂ 95% triages up to RED', async ({ page }) => {
  await page.goto('./');
  await tab(page, 'Triage').click();
  const vitals: [string, string][] = [
    ['RR', '16'],
    ['SpO₂', '98'],
    ['HR', '80'],
    ['GCS', '15'],
    ['SBP', '120'],
    ['DBP', '80'],
    ['Temperature', '37'],
  ];
  for (const [label, value] of vitals) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
  await expect(page.locator('#triage-result')).toContainText('GREEN');

  await page.getByLabel('SpO₂', { exact: true }).fill('95');
  await expect(page.locator('#triage-result')).toContainText('RED');
  await expect(page.locator('#triage-result')).toContainText('SpO₂ 95% is not defined in the manual');
});

test('Code blue: start, log a shock, and keep the log through a reload', async ({ page }) => {
  await page.goto('./');
  await tab(page, 'Code blue').click();
  await page.getByRole('button', { name: 'Start CPR' }).click();
  await page.getByRole('radio', { name: 'VF / pVT' }).click();
  await page.getByRole('button', { name: /^Shock 200 J/ }).click();
  await expect(page.getByText('DC shock 200 J (shock 1)', { exact: true })).toBeVisible();
  await expect(page.getByText('Rhythm check in')).toBeVisible();

  await page.reload();
  await expect(page.getByText('DC shock 200 J (shock 1)', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Copy to case sheet/ })).toBeEnabled();
});

test('Doses: 60 kg gives the NAC bags from the manual', async ({ page }) => {
  await page.goto('./');
  await tab(page, 'Doses').click();
  await page.getByLabel('Weight').fill('60');
  const nac = page.getByRole('region', { name: 'N-acetyl cysteine IV' });
  await expect(nac).toContainText('9 g');
  await expect(nac).toContainText('62.5 mL/h');
  await expect(page.getByRole('region', { name: 'Tenecteplase (stroke)' })).toContainText('15 mg');
});

test('Note: allergies print in capitals and the note can be copied', async ({ page }) => {
  await page.goto('./');
  await tab(page, 'Note').click();
  await page.getByLabel(/Known drug allergies/).fill('penicillin');
  await page.getByLabel('Chief complaint (with duration)').fill('Chest pain 2 h');
  await expect(page.locator('pre')).toContainText('DRUG ALLERGY: PENICILLIN');
  await expect(page.locator('pre')).toContainText('Chief complaint: Chest pain 2 h');
  await expect(page.getByRole('button', { name: 'Copy to case sheet' })).toBeEnabled();
});

test('Is installable and works offline after the first load', async ({ page, context }) => {
  await page.goto('./');
  // Chrome's own installability check (manifest, icons, service worker): what Lighthouse's old PWA audit used.
  const cdp = await context.newCDPSession(page);
  await expect
    .poll(async () => (await cdp.send('Page.getInstallabilityErrors')).installabilityErrors.map((e) => e.errorId), { timeout: 15_000 })
    .toEqual([]);

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  // The first visit is not controlled by the new worker yet; a reload is.
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await page.getByRole('link', { name: /Suspected stroke/ }).click();
  await expect(page.getByRole('heading', { name: 'Suspected stroke' })).toBeVisible();
  await tab(page, 'Code blue').click();
  await expect(page.getByRole('button', { name: 'Start CPR' })).toBeVisible();
  // Fonts come from the cache too.
  expect(await page.evaluate(() => document.fonts.check('16px "Atkinson Hyperlegible"'))).toBe(true);
});

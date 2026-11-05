import { expect, test, type Page } from '@playwright/test';

// One smoke test per bottom tab, plus the flowchart view and offline use after the first load.

const tab = (page: Page, name: string) => page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name });

test('Protocols: open a flowchart, then its checklist; tick a step; red flags; search', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: /6\.2\s*Chest Pain/ }).click();
  await expect(page.getByRole('heading', { name: '6.2 Chest Pain' })).toBeVisible();
  await expect(page.locator('main img')).toHaveCount(2);

  await page.getByRole('link', { name: /Step-by-step checklist/ }).click();
  await expect(page.getByRole('heading', { name: 'Chest Pain' })).toBeVisible();
  await page.getByRole('checkbox').first().click();
  await expect(page.getByText(/^1 of \d+ done$/)).toBeVisible();

  await page.getByRole('link', { name: /Red flags/ }).click();
  await expect(page.getByRole('heading', { name: /RED FLAG SIGNS/ })).toBeVisible();

  await tab(page, 'Protocols').click();
  await page.getByRole('searchbox').fill('epistaxis');
  await page.getByRole('link', { name: /Nasal Bleeding — Epistaxis/ }).first().click();
  await expect(page.getByRole('heading', { name: '1.6 Nasal Bleeding — Epistaxis' })).toBeVisible();
});

test('Bedside: from the flowchart to history, differentials and back to the hospital protocol', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: /6\.2\s*Chest Pain/ }).click();
  await page.getByRole('link', { name: /Bedside: history, exam, differentials/ }).click();
  await expect(page.getByRole('heading', { name: /^Chest pain/ })).toBeVisible();
  await expect(page.getByText('Draft: not yet checked by a senior.')).toBeVisible();
  await page.getByRole('checkbox', { name: /Coming on with less effort/ }).click();
  await expect(page.getByText(/^1 of \d+ done$/)).toBeVisible();

  await page.getByRole('link', { name: /^Differentials/ }).click();
  await expect(page.getByRole('listitem', { name: 'Aortic dissection' })).toContainText('Table 4.2B');

  await page.getByRole('link', { name: /^Plan/ }).click();
  await page.getByRole('link', { name: /Checklist 2\.1 Chest Pain/ }).click();
  await expect(page.getByRole('heading', { name: 'Chest Pain' })).toBeVisible();
});

test('Triage: normal vitals are GREEN BED, SpO₂ 93% triages up to RED BED', async ({ page }) => {
  await page.goto('./');
  await tab(page, 'Triage').click();
  const vitals: [string, string][] = [
    ['RR', '16'],
    ['SpO₂', '98'],
    ['HR', '80'],
    ['GCS', '15'],
    ['SBP', '120'],
    ['DBP', '80'],
    ['Temperature', '98.6'],
  ];
  for (const [label, value] of vitals) await page.getByLabel(label, { exact: true }).fill(value);
  await expect(page.locator('#triage-result')).toContainText('GREEN BED');

  await page.getByLabel('SpO₂', { exact: true }).fill('93');
  await expect(page.locator('#triage-result')).toContainText('RED BED');
  await expect(page.locator('#triage-result')).toContainText('triaged up to RED');
});

test('Code blue: start, log a shock, and keep the log through a reload', async ({ page }) => {
  await page.goto('./');
  await tab(page, 'Code blue').click();
  await page.getByRole('button', { name: 'Start CPR' }).click();
  await page.getByRole('radio', { name: 'VF / pVT' }).click();
  await page.getByRole('button', { name: /^Shock 120–200 J/ }).click();
  const logged = page.getByText('Shock (biphasic 120–200 J) (shock 1)', { exact: true });
  await expect(logged).toBeVisible();
  await expect(page.getByText('Rhythm check in')).toBeVisible();

  await page.reload();
  await expect(logged).toBeVisible();
  await expect(page.getByRole('button', { name: /Copy to case sheet/ })).toBeEnabled();
});

test('Doses: 60 kg gives the NAC bags and the stroke tenecteplase dose', async ({ page }) => {
  await page.goto('./');
  await tab(page, 'Doses').click();
  await page.getByLabel('Weight').fill('60');
  const nac = page.getByRole('region', { name: 'N-acetylcysteine IV' });
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

test('Flowcharts load at full resolution', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: /1\.1\s*Bleeding P\/V/ }).click();
  const sheets = page.locator('main img');
  await expect(sheets).toHaveCount(2);
  await expect.poll(() => sheets.first().evaluate((i: HTMLImageElement) => i.naturalWidth)).toBe(1400);
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
  await page.goto('./#/p/hp4-4');
  await expect(page.getByRole('heading', { name: 'Acute Weakness / Paralysis and Suspected Stroke' })).toBeVisible();
  await tab(page, 'Code blue').click();
  await expect(page.getByRole('button', { name: 'Start CPR' })).toBeVisible();
  expect(await page.evaluate(() => document.fonts.check('16px "Atkinson Hyperlegible"'))).toBe(true);
});

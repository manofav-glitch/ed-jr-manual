import { describe, expect, it } from 'vitest';
import { LISTS } from '../../src/features/triage/store.ts';
import { plain } from '../../src/lib/inline.ts';
import { manual } from '../../src/lib/manual.ts';
import { listAfter } from '../../src/lib/quote.ts';
import { cToF, triage, type Vitals, type Zone } from '../../src/lib/triage.ts';

const NORMAL: Vitals = { rr: 16, spo2: 98, hr: 80, sbp: 120, dbp: 80, gcs: 15, tempF: 98.6, rbs: 110 };
const run = (v: Partial<Vitals> = {}, ticked: Partial<Record<Zone, string[]>> = {}, priorityRed = false) =>
  triage({ vitals: { ...NORMAL, ...v }, ticked, priorityRed });
const zone = (v: Partial<Vitals>) => run(v).zone;

/** A row of the section 9.1 table, by its "Parameter" cell. */
function abcde(parameter: string): string[] {
  const ch = manual.chapters.find((c) => c.id === 'hp9-1')!;
  for (const s of ch.sections)
    for (const sub of s.subsections)
      for (const b of sub.blocks) {
        if (b.type !== 'table') continue;
        const row = b.rows.map((r) => r.map(plain)).find((r) => r[1] === parameter);
        if (row) return row;
      }
  throw new Error(parameter);
}

describe('triage: thresholds are the manual\'s', () => {
  const triageText = (start: string) =>
    [...listAfter(manual, 'hp-triage', 'Physiology'), ...listAfter(manual, 'hp-triage', 'Threat to life'), ...listAfter(manual, 'hp-triage', 'Stable primary survey')]
      .map((i) => i.text)
      .find((t) => t.startsWith(start))!;

  it('Triage chapter', () => {
    expect(triageText('Apnoea')).toContain('RR >40 or <10, SpO₂ <90% on oxygen');
    expect(triageText('SBP <90')).toBe('SBP <90 with hypoperfusion, or HR >150 / <40');
    expect(triageText('GCS')).toContain('GCS ≤8');
    expect(triageText('Shock index')).toBe('Shock index (HR÷SBP) >0.9');
    expect(triageText('Danger-zone')).toBe('Danger-zone vitals: HR >100, RR >20, SpO₂ <92%');
    expect(triageText('Patent airway')).toBe('Patent airway, RR 10–24, SpO₂ >95%, SBP >90 without extremes of heart rate, GCS >13');
  });

  it('section 9.1', () => {
    expect(abcde('Respiratory rate /min').slice(2)).toEqual(['>40 or <10', '30–40 or 10–12', '12–20']);
    expect(abcde('SpO₂').slice(2, 4)).toEqual(['<80%', '<90%']);
    expect(abcde('Heart rate /min').slice(2, 4)).toEqual(['>150 or <40', '>130 or <60']);
    expect(abcde('Blood pressure (mmHg)').slice(2, 4)).toEqual(['>180/100 or <90/60', '<100/70']);
    expect(abcde('Shock index (HR÷SBP)').slice(2, 4)).toEqual(['>1.0', '>0.9']);
    expect(abcde('Temperature (°F)')[2]).toBe('>104 or <97');
    expect(abcde('Blood sugar (mg/dL)').slice(2, 4)).toEqual(['<50', '<70 or >250']);
  });

  it('tick-boxes come from the chapter, leaving out what the vitals decide', () => {
    expect(LISTS.map((l) => [l.zone, l.items.length])).toEqual([
      ['RESUS', 6],
      ['RESUS', 6],
      ['RED', 17],
      ['YELLOW', 4],
      ['GREEN', 3],
      ['WHITE', 6],
    ]);
  });
});

describe('triage: zones', () => {
  it('normal vitals, nothing ticked → GREEN', () => {
    expect(run().zone).toBe('GREEN');
    expect(run().reasons).toEqual([]);
  });

  it('a Yellow item → YELLOW; day care only → WHITE; day care plus a Green item → GREEN', () => {
    expect(run({}, { YELLOW: ['Persistent vomiting or decreased urine output'] }).zone).toBe('YELLOW');
    expect(run({}, { WHITE: ['Catheter change'] }).zone).toBe('WHITE');
    expect(run({}, { WHITE: ['Catheter change'], GREEN: ['Minor injury, simple wound, uncomplicated fever or pain'] }).zone).toBe('GREEN');
  });

  it('a ticked Red or Resus item, or "Priority Red", wins', () => {
    expect(run({}, { RED: ['GI bleed — upper or lower'], YELLOW: ['x'] }).zone).toBe('RED');
    expect(run({}, { RESUS: ['Intubated pre-hospital'] }).zone).toBe('RESUS');
    expect(run({}, {}, true).zone).toBe('RED');
  });

  it('waits for the vitals before calling Yellow, Green or White', () => {
    const r = triage({ vitals: { rr: 16, spo2: 98 }, ticked: {} });
    expect(r.zone).toBeNull();
    expect(r.missing).toEqual(['HR', 'SBP', 'DBP', 'GCS']);
    expect(triage({ vitals: { hr: 160 }, ticked: {} }).zone).toBe('RESUS');
  });
});

describe('triage: boundaries (more urgent table wins)', () => {
  it.each([
    [9, 'RESUS'],
    [10, 'RED'], // 9.1: 10–12
    [12, 'RED'],
    [13, 'GREEN'],
    [20, 'GREEN'],
    [21, 'RED'], // Triage: danger zone RR >20
    [40, 'RED'],
    [41, 'RESUS'],
  ])('RR %i → %s', (rr, z) => expect(zone({ rr })).toBe(z));

  it.each([
    [79, 'RESUS'], // 9.1 <80%
    [85, 'RED'],
    [91, 'RED'], // Triage <92%
    [96, 'GREEN'],
  ])('SpO₂ %i%% on air → %s', (spo2, z) => expect(zone({ spo2 })).toBe(z));

  it('SpO₂ <90% on oxygen → RESUS (Triage chapter)', () => {
    expect(zone({ spo2: 89, onOxygen: true })).toBe('RESUS');
    expect(zone({ spo2: 89, onOxygen: false })).toBe('RED');
  });

  it.each([92, 95])('SpO₂ %i%% is a gap → RED, and says so', (spo2) => {
    const r = run({ spo2 });
    expect(r.zone).toBe('RED');
    expect(r.gaps[0]).toMatch(/triaged up to RED/);
  });

  it.each([
    [39, 'RESUS'],
    [40, 'RED'], // 9.1 <60
    [59, 'RED'],
    [60, 'GREEN'],
    [100, 'GREEN'],
    [101, 'RED'], // Triage danger zone
    [150, 'RESUS'], // SI 150/120 > 1
    [151, 'RESUS'],
  ])('HR %i → %s', (hr, z) => expect(zone({ hr })).toBe(z));

  it('HR 130 with SBP 160 (SI 0.81) is Red for the heart rate alone', () => {
    expect(run({ hr: 130, sbp: 160, dbp: 90 }).reasons.map((r) => r.text)).toEqual(['Danger-zone HR >100 (130)']);
  });

  it.each([
    [{ sbp: 89 }, 'RESUS'], // 9.1 BP <90/60
    [{ sbp: 99 }, 'RED'], // 9.1 BP <100/70
    [{ sbp: 100, dbp: 75 }, 'GREEN'],
    [{ dbp: 69 }, 'RED'],
    [{ dbp: 59 }, 'RESUS'],
    [{ sbp: 181 }, 'RESUS'], // 9.1 BP >180/100
    [{ dbp: 101 }, 'RESUS'],
  ])('BP %j → %s', (v, z) => expect(zone(v)).toBe(z));

  it('shock index >0.9 is Red, >1.0 is Resus', () => {
    expect(zone({ hr: 95, sbp: 100 })).toBe('RED'); // 0.95
    expect(zone({ hr: 99, sbp: 110 })).toBe('GREEN'); // 0.9 exactly
    expect(zone({ hr: 105, sbp: 100 })).toBe('RESUS'); // 1.05
  });

  it.each([
    [8, 'RESUS'],
    [14, 'GREEN'],
  ])('GCS %i → %s', (gcs, z) => expect(zone({ gcs })).toBe(z));

  it.each([9, 13])('GCS %i is a gap → RED', (gcs) => {
    expect(run({ gcs }).gaps).toHaveLength(1);
    expect(zone({ gcs })).toBe('RED');
  });

  it.each([
    [104.5, 'RESUS'],
    [96.5, 'RESUS'],
    [101, 'GREEN'],
  ])('temperature %f °F → %s', (tempF, z) => expect(zone({ tempF })).toBe(z));

  it.each([
    [45, 'RESUS'],
    [60, 'RED'],
    [260, 'RED'],
    [120, 'GREEN'],
  ])('blood sugar %i → %s', (rbs, z) => expect(zone({ rbs })).toBe(z));

  it('says which table each reason came from', () => {
    const r = run({ rr: 11, hr: 105 }); // shock index 0.88
    expect(r.reasons.map((x) => [x.source, x.text])).toEqual([
      ['Triage', 'Danger-zone HR >100 (105)'],
      ['9.1', 'RR 10–12 (11)'],
    ]);
  });

  it('converts °C to °F', () => {
    expect(cToF(40)).toBe(104);
  });
});

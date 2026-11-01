import { describe, expect, it } from 'vitest';
import { manual } from '../../src/lib/manual.ts';
import { listAfter, tableRow } from '../../src/lib/quote.ts';
import { FINDINGS, fToC, triage, type FindingId, type Vitals } from '../../src/lib/triage.ts';

const NORMAL: Vitals = { rr: 16, spo2: 98, hr: 80, sbp: 120, dbp: 80, gcs: 15, tempC: 37 };
const run = (v: Partial<Vitals> = {}, extra: Partial<Parameters<typeof triage>[0]> = {}) =>
  triage({ vitals: { ...NORMAL, ...v }, findings: [], emergencies: [], vulnerable: [], ...extra });

describe('triage: wording comes from chapter 1', () => {
  it('every primary-survey finding is the manual\'s exact text', () => {
    for (const f of FINDINGS) {
      const row = tableRow(manual, 1, { A: 'A — Airway', B: 'B — Breathing', C: 'C — Circulation', D: 'D — Disability' }[f.part]);
      expect(row, f.id).toContain(f.match);
    }
  });

  it('the thresholds in code are the ones the manual states', () => {
    expect(tableRow(manual, 1, 'B — Breathing')).toContain('RR < 10 or > 24/min; SpO₂ < 94%');
    expect(tableRow(manual, 1, 'C — Circulation')).toContain('HR < 50 or > 120 (without fever); SBP < 90 or > 200; DBP > 110; shock index (pulse rate / SBP) > 1');
    expect(tableRow(manual, 1, 'D — Disability')).toContain('GCS < 13');
  });

  it('reads 16 time-sensitive emergencies and 7 vulnerable groups', () => {
    expect(listAfter(manual, 1, 'Time-sensitive emergencies')).toHaveLength(16);
    expect(listAfter(manual, 1, 'Vulnerable population')).toHaveLength(7);
  });
});

describe('triage: categories', () => {
  it('normal vitals, nothing ticked → GREEN', () => {
    expect(run().category).toBe('GREEN');
  });

  it('a vulnerable group → YELLOW', () => {
    const r = run({}, { vulnerable: ['Chronic kidney disease'] });
    expect(r.category).toBe('YELLOW');
    expect(r.yellow).toEqual(['Chronic kidney disease']);
  });

  it('a time-sensitive emergency → RED even with normal vitals', () => {
    const r = run({}, { emergencies: ['H/o syncope'], vulnerable: ['Chronic kidney disease'] });
    expect(r.category).toBe('RED');
    expect(r.red).toEqual(['Time-sensitive: H/o syncope']);
  });

  it.each(FINDINGS.map((f) => f.id))('primary-survey finding %s → RED', (id) => {
    expect(run({}, { findings: [id as FindingId] }).category).toBe('RED');
  });

  it('waits for the vitals before calling YELLOW or GREEN', () => {
    const r = triage({ vitals: { rr: 16, spo2: 98 }, findings: [], emergencies: [], vulnerable: [] });
    expect(r.category).toBeNull();
    expect(r.missing).toEqual(['HR', 'SBP', 'DBP', 'GCS']);
  });

  it('calls RED straight away when a Red criterion is met, even with vitals missing', () => {
    expect(triage({ vitals: { spo2: 88 }, findings: [], emergencies: [], vulnerable: [] }).category).toBe('RED');
  });

  it('ignores the site priority group unless it is passed in', () => {
    expect(run().category).toBe('GREEN');
    expect(run({}, { priorityRed: 'AIIMS EHS patient' }).red).toEqual(['Priority Red: AIIMS EHS patient']);
  });
});

describe('triage: boundary values', () => {
  it.each([
    [9, 'RED'],
    [10, 'GREEN'],
    [24, 'GREEN'],
    [25, 'RED'],
  ])('RR %i → %s', (rr, cat) => expect(run({ rr }).category).toBe(cat));

  it.each([
    [93, 'RED', 0],
    [94, 'RED', 1],
    [95, 'RED', 1],
    [96, 'GREEN', 0],
  ])('SpO₂ %i → %s (gaps: %i)', (spo2, cat, gaps) => {
    const r = run({ spo2 });
    expect(r.category).toBe(cat);
    expect(r.gaps).toHaveLength(gaps);
  });

  it.each([
    [12, 'RED', 0],
    [13, 'RED', 1],
    [14, 'GREEN', 0],
  ])('GCS %i → %s (gaps: %i)', (gcs, cat, gaps) => {
    const r = run({ gcs });
    expect(r.category).toBe(cat);
    expect(r.gaps).toHaveLength(gaps);
  });

  it.each([
    [89, 'RED'],
    [90, 'RED'],
    [91, 'GREEN'],
    [200, 'GREEN'],
    [201, 'RED'],
  ])('SBP %i → %s', (sbp, cat) => expect(run({ sbp, hr: 70 }).category).toBe(cat));

  it('SBP 90 is reported as a gap', () => {
    expect(run({ sbp: 90, hr: 70 }).gaps).toEqual(['SBP 90 is not defined in the manual (Red < 90, Yellow > 90): triaged up to RED.']);
  });

  it.each([
    [110, 'GREEN'],
    [111, 'RED'],
  ])('DBP %i → %s', (dbp, cat) => expect(run({ dbp }).category).toBe(cat));

  it.each([
    [49, 'RED'],
    [50, 'GREEN'],
    [120, 'GREEN'],
    [121, 'RED'],
  ])('HR %i (afebrile) → %s', (hr, cat) => expect(run({ hr, sbp: 140 }).category).toBe(cat));
});

describe('triage: shock index', () => {
  it('is calculated from HR / SBP', () => {
    expect(run({ hr: 90, sbp: 120 }).shockIndex).toBeCloseTo(0.75);
  });

  it('> 1 is RED; exactly 1 is not', () => {
    expect(run({ hr: 100, sbp: 99 }).red).toContain('C: shock index (pulse rate / SBP) > 1 (1.01)');
    expect(run({ hr: 100, sbp: 100 }).category).toBe('GREEN');
  });
});

describe('triage: "HR > 120 without fever" exception', () => {
  it('HR 130 with fever is not Red on its own, but at least Yellow', () => {
    const r = run({ hr: 130, sbp: 140, tempC: 38.6 });
    expect(r.fever).toBe(true);
    expect(r.red).toEqual([]);
    expect(r.category).toBe('YELLOW');
    expect(r.yellow[0]).toMatch(/^HR > 120 with fever/);
  });

  it('HR 130 without fever is Red', () => {
    expect(run({ hr: 130, sbp: 140, tempC: 37 }).red).toEqual(['C: HR > 120 without fever (130)']);
  });

  it('HR 130 with no temperature entered is Red, and says so', () => {
    const r = run({ hr: 130, sbp: 140, tempC: undefined });
    expect(r.category).toBe('RED');
    expect(r.notes.join(' ')).toMatch(/No temperature entered/);
  });

  it('febrile tachycardia with another Red criterion is still Red', () => {
    expect(run({ hr: 130, sbp: 85, tempC: 39 }).category).toBe('RED');
  });

  it('fever means above 38.0 °C (100.4 °F, ch 11)', () => {
    expect(run({ tempC: 38 }).fever).toBe(false);
    expect(run({ tempC: 38.1 }).fever).toBe(true);
    expect(fToC(100.4)).toBeCloseTo(38);
  });
});

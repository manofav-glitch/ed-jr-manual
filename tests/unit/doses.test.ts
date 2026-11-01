import { describe, expect, it } from 'vitest';
import { sites } from '../../src/config/site.ts';
import { alteplase, doseCards, fmt, nacIv, nacOral, tenecteplaseStroke, weightWarning, type DoseCard } from '../../src/lib/doses.ts';
import { findAnchor } from '../../src/lib/anchors.ts';
import { manual } from '../../src/lib/manual.ts';

const TNK = sites.aiims.tenecteplaseStroke;
const card = (kg: number, id: string): DoseCard => doseCards(kg, TNK).find((c) => c.id === id)!;
const values = (kg: number, id: string) => card(kg, id).lines.map((l) => l.value);

describe('every dose cites a line of the manual', () => {
  it.each(doseCards(60, TNK).flatMap((c) => c.source.map((a) => [c.id, a.chapter, a.match] as const)))(
    '%s: ch %i "%s"',
    (_id, chapter, match) => {
      expect(findAnchor(manual, { chapter, match })).toHaveLength(1);
    },
  );
});

describe('N-acetyl cysteine', () => {
  it('IV: three bags in g, volume and mL/h (60 kg)', () => {
    expect(nacIv(60).map((b) => [b.grams, b.volumeMl, b.mlPerHour])).toEqual([
      [9, 200, 200],
      [3, 500, 125],
      [6, 1000, 62.5], // the manual's example says 3 g: see the review note
    ]);
    expect(values(60, 'nac-iv')).toEqual(['9 g', '3 g', '6 g']);
  });

  it('IV: scales with weight (75 kg)', () => {
    expect(nacIv(75).map((b) => b.grams)).toEqual([11.25, 3.75, 7.5]);
  });

  it('oral: 140 mg/kg loading, then 70 mg/kg q4h × 17', () => {
    expect(nacOral(60)).toEqual({ loadingMg: 8400, maintenanceMg: 4200, everyHours: 4, doses: 17 });
  });
});

describe('simple mg/kg doses (60 kg)', () => {
  it.each([
    ['bicarb', ['90 mEq']],
    ['fentanyl', ['60 mcg']],
    ['morphine', ['2 to 3 mg', '6 mg']],
    ['vancomycin', ['900 mg']],
    ['amikacin', ['900 mg']],
    ['acyclovir', ['600 mg']],
    ['artesunate', ['144 mg']],
    ['primaquine', ['15 mg', '45 mg']],
    ['prednisolone', ['60 mg']],
    ['ng-lavage', ['600 mL NS']],
  ])('%s → %j', (id, expected) => {
    expect(values(60, id)).toEqual(expected);
  });

  it('matches the manual\'s own 60 kg examples', () => {
    // Manual: amikacin 750 mg is ~50 kg (15 mg/kg); acyclovir 600 mg and primaquine 15 / 45 mg are 60 kg.
    expect(values(50, 'amikacin')).toEqual(['750 mg']);
    expect(values(60, 'acyclovir')).toEqual(['600 mg']);
  });
});

describe('alteplase 0.9 mg/kg, max 90', () => {
  it('splits 10% bolus / 90% infusion', () => {
    const r = alteplase(70);
    expect(r.total).toBeCloseTo(63);
    expect(r.bolus).toBeCloseTo(6.3);
    expect(r.infusion).toBeCloseTo(56.7);
    expect(r.capped).toBe(false);
    expect(values(70, 'alteplase')).toEqual(['63 mg', '6.3 mg', '56.7 mg']);
  });

  it('caps at 90 mg (100 kg reaches it exactly; 110 kg is capped)', () => {
    expect(alteplase(100).total).toBe(90);
    expect(alteplase(100).capped).toBe(false);
    expect(alteplase(110)).toEqual({ total: 90, bolus: 9, infusion: 81, capped: true });
    expect(card(110, 'alteplase').capped).toBe('Capped at the 90 mg maximum.');
  });
});

describe('tenecteplase: stroke dose, not the manual\'s STEMI dose', () => {
  it('0.25 mg/kg, max 25 mg', () => {
    expect(tenecteplaseStroke(80, TNK)).toEqual({ total: 20, capped: false });
    expect(tenecteplaseStroke(120, TNK)).toEqual({ total: 25, capped: true });
    expect(values(80, 'tenecteplase')).toEqual(['20 mg']);
  });

  it('can be switched to the Indian label dose (0.2 mg/kg) in site config', () => {
    expect(tenecteplaseStroke(80, { mgPerKg: 0.2, maxMg: 25 }).total).toBeCloseTo(16);
  });
});

describe('formatting and weight checks', () => {
  it('rounds for the bedside', () => {
    expect(fmt(1050)).toBe('1050');
    expect(fmt(62.5)).toBe('62.5');
    expect(fmt(6.333)).toBe('6.3');
    expect(fmt(11.25, 2)).toBe('11.25');
  });

  it('warns on unlikely adult weights', () => {
    expect(weightWarning(70)).toBeNull();
    expect(weightWarning(12)).toMatch(/adult doses/);
    expect(weightWarning(0)).toMatch(/Enter a weight/);
  });
});

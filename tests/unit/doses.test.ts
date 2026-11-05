import { describe, expect, it } from 'vitest';
import { alteplase, doseCards, fmt, nacIv, range, weightWarning, type DoseCard } from '../../src/lib/doses.ts';
import { findAnchor } from '../../src/lib/anchors.ts';
import { manual } from '../../src/lib/manual.ts';

const card = (kg: number, id: string): DoseCard => doseCards(kg).find((c) => c.id === id)!;
const values = (kg: number, id: string) => card(kg, id).lines.map((l) => l.value);

describe('every dose cites a line of the hospital manual', () => {
  it.each(doseCards(60).flatMap((c) => c.source.map((a) => [c.id, a.chapter, a.match] as const)))('%s: %s "%s"', (_id, chapter, match) => {
    expect(findAnchor(manual, { chapter, match })).toHaveLength(1);
  });

  it('has unique ids', () => {
    const ids = doseCards(60).map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('N-acetylcysteine', () => {
  it('IV: three bags in g, volume and mL/h (60 kg)', () => {
    expect(nacIv(60).map((b) => [b.grams, b.volumeMl, b.mlPerHour])).toEqual([
      [9, 200, 200],
      [3, 500, 125],
      [6, 1000, 62.5],
    ]);
    expect(values(60, 'nac-iv')).toEqual(['9 g', '3 g', '6 g']);
  });

  it('oral: 140 mg/kg loading, then 70 mg/kg', () => {
    expect(values(60, 'nac-oral')).toEqual(['8400 mg', '4200 mg']);
  });
});

describe('mg/kg doses (70 kg)', () => {
  it.each([
    ['lorazepam', ['7 mg']],
    ['diazepam', ['10.5–14 mg']],
    ['levetiracetam', ['4200 mg']],
    ['valproate', ['2800 mg']],
    ['phenytoin', ['1400 mg PE', '1400 mg']],
    ['mannitol', ['17.5–70 g']],
    ['hypertonic', ['210–350 mL']],
    ['charcoal', ['70 g']],
    ['pralidoxime', ['2100–3150 mg', '560–840 mg/h']],
    ['bicarb', ['70–140 mEq']],
    ['enoxaparin', ['70 mg', '52.5 mg']],
    ['ufh', ['5600 U', '1260 U/h']],
    ['fluid-20', ['1400 mL']],
    ['fluid-30', ['2100 mL']],
    ['insulin', ['7 U/h']],
    ['noradrenaline', ['3.5–35 mcg/min']],
    ['vancomycin', ['1050 mg']],
    ['amikacin', ['1050 mg']],
    ['acyclovir', ['700 mg']],
    ['artesunate', ['168 mg']],
    ['fentanyl', ['70 mcg']],
    ['morphine', ['7 mg']],
    ['ketamine', ['70–140 mg']],
    ['etomidate', ['21 mg']],
    ['succinylcholine', ['70–105 mg']],
    ['rocuronium', ['84 mg']],
    ['lignocaine', ['70–105 mg', '35–52.5 mg']],
    ['rig', ['1400 IU', '2800 IU']],
  ])('%s → %j', (id, expected) => {
    expect(values(70, id)).toEqual(expected);
  });
});

describe('maximums', () => {
  it('levetiracetam stops at 4500 mg, valproate at 3000 mg', () => {
    expect(values(80, 'levetiracetam')).toEqual(['4500 mg']);
    expect(card(80, 'levetiracetam').capped).toBe('Capped at the 4500 mg maximum.');
    expect(values(80, 'valproate')).toEqual(['3000 mg']);
    expect(card(70, 'valproate').capped).toBeUndefined();
  });

  it('alteplase 0.9 mg/kg, max 90, split 10% / 90%', () => {
    const r = alteplase(70);
    expect([r.total, r.bolus, r.infusion].map((x) => fmt(x))).toEqual(['63', '6.3', '56.7']);
    expect(alteplase(110)).toEqual({ total: 90, bolus: 9, infusion: 81, capped: true });
  });

  it('tenecteplase 0.25 mg/kg, max 25 mg (the manual\'s stroke dose)', () => {
    expect(values(80, 'tenecteplase')).toEqual(['20 mg']);
    expect(values(120, 'tenecteplase')).toEqual(['25 mg']);
    expect(card(120, 'tenecteplase').capped).toBe('Capped at the 25 mg maximum.');
  });

  it('a capped range collapses to the cap', () => {
    expect(range(100, 40, 50, 'mg', 3000)).toEqual({ value: '3000 mg', capped: true });
  });
});

describe('formatting and weight checks', () => {
  it('rounds for the bedside', () => {
    expect(fmt(1050)).toBe('1050');
    expect(fmt(62.5)).toBe('62.5');
    expect(fmt(11.25, 2)).toBe('11.25');
  });

  it('warns on unlikely adult weights', () => {
    expect(weightWarning(70)).toBeNull();
    expect(weightWarning(12)).toMatch(/adult doses/);
    expect(weightWarning(0)).toMatch(/Enter a weight/);
  });
});

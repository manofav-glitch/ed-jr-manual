// Weight-based doses, each from a line of the manual (or, for stroke tenecteplase, from the
// review note that corrects it). `source` anchors are checked against the manual by the tests.

import type { Anchor } from './anchors.ts';

export interface DoseLine {
  label: string;
  value: string;
  detail?: string;
}

export interface DoseCard {
  id: string;
  drug: string;
  lines: DoseLine[];
  /** Set when a maximum dose limited the result. */
  capped?: string;
  source: Anchor[];
}

/** NAC IV, three bags (ch 12). */
export const NAC_BAGS = [
  { mgPerKg: 150, volumeMl: 200, hours: 1 },
  { mgPerKg: 50, volumeMl: 500, hours: 4 },
  { mgPerKg: 100, volumeMl: 1000, hours: 16 },
] as const;

export function nacIv(kg: number) {
  return NAC_BAGS.map((b) => ({ ...b, grams: (b.mgPerKg * kg) / 1000, mlPerHour: b.volumeMl / b.hours }));
}

export function nacOral(kg: number) {
  return { loadingMg: 140 * kg, maintenanceMg: 70 * kg, everyHours: 4, doses: 17 };
}

export const perKg = (kg: number, dose: number) => dose * kg;

/** Alteplase 0.9 mg/kg, max 90 mg: 10 % bolus over 1 min, the rest over 60 min (ch 4). */
export function alteplase(kg: number) {
  const total = Math.min(0.9 * kg, 90);
  return { total, bolus: total * 0.1, infusion: total * 0.9, capped: 0.9 * kg > 90 };
}

export function tenecteplaseStroke(kg: number, cfg: { mgPerKg: number; maxMg: number }) {
  const total = Math.min(cfg.mgPerKg * kg, cfg.maxMg);
  return { total, capped: cfg.mgPerKg * kg > cfg.maxMg };
}

/** Rounded for reading at the bedside: whole numbers from 100 up, else one decimal. */
export function fmt(x: number, dp?: number): string {
  const d = dp ?? (Math.abs(x) >= 100 ? 0 : 1);
  return String(Number(x.toFixed(d)));
}

export function doseCards(kg: number, tnk: { mgPerKg: number; maxMg: number; source: string }): DoseCard[] {
  const nac = nacIv(kg);
  const oral = nacOral(kg);
  const tpa = alteplase(kg);
  const tk = tenecteplaseStroke(kg, tnk);
  return [
    {
      id: 'nac-iv',
      drug: 'N-acetyl cysteine IV',
      lines: nac.map((b, i) => ({
        label: `Bag ${i + 1}`,
        value: `${fmt(b.grams, 2)} g`,
        detail: `${b.mgPerKg} mg/kg in ${b.volumeMl === 1000 ? '1 L' : `${b.volumeMl} mL`} 5% D over ${b.hours} h → ${fmt(b.mlPerHour)} mL/h`,
      })),
      source: [
        { chapter: 12, match: '150 mg/kg in 200 mL 5% dextrose i.v. over 1 hour' },
        { chapter: 12, match: '50 mg/kg in 500 mL 5% D over 4 hours' },
        { chapter: 12, match: '100 mg/kg in 1 L 5% D over 16 hrs' },
      ],
    },
    {
      id: 'nac-oral',
      drug: 'N-acetyl cysteine oral',
      lines: [
        { label: 'Loading', value: `${fmt(oral.loadingMg)} mg`, detail: '140 mg/kg PO stat' },
        { label: 'Maintenance', value: `${fmt(oral.maintenanceMg)} mg`, detail: 'from 4 h: 70 mg/kg PO q4h × 17 doses' },
      ],
      source: [
        { chapter: 12, match: 'Loading dose: 140 mg/kg PO stat' },
        { chapter: 12, match: 'Maintenance: start after 4 hrs — 70 mg/kg PO q4h × 17 doses' },
      ],
    },
    {
      id: 'bicarb',
      drug: 'Sodium bicarbonate',
      lines: [{ label: 'Dose', value: `${fmt(perKg(kg, 1.5))} mEq`, detail: '1.5 mEq/kg IV push' }],
      source: [{ chapter: 13, match: 'Metabolic acidosis: Inj. NaHCO₃ (1.5 mEq/kg)' }],
    },
    {
      id: 'fentanyl',
      drug: 'Fentanyl',
      lines: [{ label: 'Dose', value: `${fmt(perKg(kg, 1))} mcg`, detail: '1 mcg/kg IV' }],
      source: [{ chapter: 20, match: 'FENTANYL: 1 mcg/kg IV' }],
    },
    {
      id: 'morphine',
      drug: 'Morphine',
      lines: [
        { label: 'Usual', value: '2 to 3 mg', detail: 'IV' },
        { label: 'Max single IV dose', value: `${fmt(perKg(kg, 0.1))} mg`, detail: '0.1 mg/kg' },
      ],
      source: [{ chapter: 20, match: 'MORPHINE: 2 to 3 mg IV (max 0.1 mg/kg IV single dose)' }],
    },
    {
      id: 'alteplase',
      drug: 'Alteplase (stroke)',
      lines: [
        { label: 'Total', value: `${fmt(tpa.total)} mg`, detail: '0.9 mg/kg, max 90 mg' },
        { label: 'Bolus (10%)', value: `${fmt(tpa.bolus)} mg`, detail: 'over 1 min' },
        { label: 'Infusion (90%)', value: `${fmt(tpa.infusion)} mg`, detail: 'over 60 min' },
      ],
      capped: tpa.capped ? 'Capped at the 90 mg maximum.' : undefined,
      source: [{ chapter: 4, match: 'Alteplase 0.9 mg/kg IV (max 90 mg)' }],
    },
    {
      id: 'tenecteplase',
      drug: 'Tenecteplase (stroke)',
      lines: [
        {
          label: 'Dose',
          value: `${fmt(tk.total)} mg`,
          detail: `${tnk.mgPerKg} mg/kg, max ${tnk.maxMg} mg (${tnk.source}) — IV bolus`,
        },
      ],
      capped: tk.capped ? `Capped at the ${tnk.maxMg} mg maximum.` : undefined,
      source: [{ chapter: 4, match: 'Tenecteplase 0.5 mg/kg IV (max 50 mg)' }],
    },
    {
      id: 'vancomycin',
      drug: 'Vancomycin',
      lines: [{ label: 'Dose', value: `${fmt(perKg(kg, 15))} mg`, detail: '15 mg/kg IV in 100 mL NS over 1 h' }],
      source: [
        { chapter: 21, match: 'Inj. VANCOMYCIN (15 mg/kg) 1 g IV in 100 mL NS over 1 hour BD' },
        { chapter: 21, match: 'Inj. VANCOMYCIN 15 mg/kg (1 g) IV in 100 mL NS over 1 hr' },
      ],
    },
    {
      id: 'amikacin',
      drug: 'Amikacin',
      lines: [{ label: 'Dose', value: `${fmt(perKg(kg, 15))} mg`, detail: '15 mg/kg IV OD' }],
      source: [{ chapter: 21, match: 'Inj. AMIKACIN (15 mg/kg) 750 mg IV OD' }],
    },
    {
      id: 'acyclovir',
      drug: 'Acyclovir',
      lines: [{ label: 'Dose', value: `${fmt(perKg(kg, 10))} mg`, detail: '10 mg/kg IV TDS' }],
      source: [{ chapter: 21, match: 'Inj. ACYCLOVIR (10 mg/kg) 600 mg IV TDS' }],
    },
    {
      id: 'artesunate',
      drug: 'Artesunate (severe malaria)',
      lines: [{ label: 'Dose', value: `${fmt(perKg(kg, 2.4))} mg`, detail: '2.4 mg/kg IV at 0 / 12 / 24 h, then q24h' }],
      source: [{ chapter: 21, match: 'Inj. ARTESUNATE 2.4 mg/kg (120 mg) IV at 0 / 12 / 24 hr, then q24h' }],
    },
    {
      id: 'primaquine',
      drug: 'Primaquine',
      lines: [
        { label: 'P. vivax', value: `${fmt(perKg(kg, 0.25))} mg`, detail: '0.25 mg/kg PO OD for 14 days' },
        { label: 'P. falciparum', value: `${fmt(perKg(kg, 0.75))} mg`, detail: '0.75 mg/kg PO on Day 2' },
      ],
      source: [
        { chapter: 21, match: 'Tab PRIMAQUINE (0.25 mg/kg) 15 mg PO OD for 14 days' },
        { chapter: 21, match: 'Tab PRIMAQUINE (0.75 mg/kg) 45 mg' },
      ],
    },
    {
      id: 'prednisolone',
      drug: 'Prednisolone',
      lines: [{ label: 'Dose', value: `${fmt(perKg(kg, 1))} mg`, detail: '1 mg/kg' }],
      source: [{ chapter: 5, match: 'Inj. prednisolone 1 mg/kg' }],
    },
    {
      id: 'ng-lavage',
      drug: 'NG lavage',
      lines: [{ label: 'Volume', value: `${fmt(perKg(kg, 10))} mL NS`, detail: '10 mL/kg' }],
      source: [{ chapter: 19, match: 'with 10 mL/kg NS' }],
    },
  ];
}

/** Adult manual: flag weights that are probably a typo or a child. */
export function weightWarning(kg: number | undefined): string | null {
  if (kg === undefined) return null;
  if (kg <= 0 || kg > 300) return 'Enter a weight in kg.';
  if (kg < 30 || kg > 150) return 'Check the weight: these are adult doses from the manual.';
  return null;
}

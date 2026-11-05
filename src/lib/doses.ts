// Weight-based doses from the hospital manual. Each card names the manual line it comes from
// (`source`, checked by the tests) and computes only what that line states: mg/kg × weight,
// ranges as ranges, maximums where the manual gives one.

import type { Anchor } from './anchors.ts';

export interface DoseLine {
  label: string;
  value: string;
  detail?: string;
}

export interface DoseCard {
  id: string;
  drug: string;
  group: string;
  lines: DoseLine[];
  /** Set when a stated maximum limited the result. */
  capped?: string;
  source: Anchor[];
}

/** Rounded for reading at the bedside: whole numbers from 100 up, else one decimal. */
export function fmt(x: number, dp?: number): string {
  const d = dp ?? (Math.abs(x) >= 100 ? 0 : 1);
  return String(Number(x.toFixed(d)));
}

/** "70–105 mg" or "70 mg"; `max` caps both ends. */
export function range(kg: number, lo: number, hi: number | undefined, unit: string, max?: number) {
  const a = lo * kg;
  const b = hi === undefined ? undefined : hi * kg;
  const cap = (x: number) => (max === undefined ? x : Math.min(x, max));
  const capped = max !== undefined && (b ?? a) > max;
  const value = b === undefined || cap(a) === cap(b) ? `${fmt(cap(a))} ${unit}` : `${fmt(cap(a))}–${fmt(cap(b))} ${unit}`;
  return { value, capped };
}

/** NAC IV, three bags (5.1 and 11.0). */
export const NAC_BAGS = [
  { mgPerKg: 150, volumeMl: 200, hours: 1 },
  { mgPerKg: 50, volumeMl: 500, hours: 4 },
  { mgPerKg: 100, volumeMl: 1000, hours: 16 },
] as const;

export function nacIv(kg: number) {
  return NAC_BAGS.map((b) => ({ ...b, grams: (b.mgPerKg * kg) / 1000, mlPerHour: b.volumeMl / b.hours }));
}

/** Alteplase 0.9 mg/kg, max 90 mg: 10 % bolus, the rest as an infusion (4.4). */
export function alteplase(kg: number) {
  const total = Math.min(0.9 * kg, 90);
  return { total, bolus: total * 0.1, infusion: total * 0.9, capped: 0.9 * kg > 90 };
}

interface Simple {
  id: string;
  drug: string;
  group: string;
  /** label, per-kg low, per-kg high (or undefined), unit, detail, max */
  lines: [string, number, number | undefined, string, string, number?][];
  source: Anchor[];
}

const G = {
  resus: 'Resuscitation and airway',
  seizure: 'Seizures',
  neuro: 'Stroke and raised ICP',
  tox: 'Poisoning',
  anticoag: 'Anticoagulation',
  fluid: 'Fluids and infusions',
  abx: 'Antibiotics and antimalarial',
  pain: 'Analgesia and sedation',
  bite: 'Bites',
};

const SIMPLE: Simple[] = [
  // Seizures (4.2)
  { id: 'lorazepam', drug: 'Lorazepam', group: G.seizure, lines: [['Dose', 0.1, undefined, 'mg', 'IV at 2 mg/min — usually 4 mg']], source: [{ chapter: 'hp4-2', match: 'Inj. Lorazepam 0.1 mg/kg IV' }] },
  { id: 'midazolam-im', drug: 'Midazolam IM', group: G.seizure, lines: [['Dose', 0.2, undefined, 'mg', 'IM if no IV access (10 mg)']], source: [{ chapter: 'hp4-2', match: 'Inj. Midazolam 10 mg IM' }] },
  { id: 'diazepam', drug: 'Diazepam', group: G.seizure, lines: [['Dose', 0.15, 0.2, 'mg', 'IV (10 mg), may repeat once']], source: [{ chapter: 'hp4-2', match: 'Inj. Diazepam 0.15–0.2 mg/kg IV' }] },
  { id: 'levetiracetam', drug: 'Levetiracetam', group: G.seizure, lines: [['Loading', 60, undefined, 'mg', 'IV, maximum 4500 mg', 4500]], source: [{ chapter: 'hp4-2', match: 'Inj. Levetiracetam 60 mg/kg IV (maximum 4500 mg)' }] },
  { id: 'valproate', drug: 'Sodium valproate', group: G.seizure, lines: [['Loading', 40, undefined, 'mg', 'IV over 10 min, maximum 3000 mg', 3000]], source: [{ chapter: 'hp4-2', match: 'Inj. Sodium Valproate 40 mg/kg IV (maximum 3000 mg)' }] },
  {
    id: 'phenytoin',
    drug: 'Fosphenytoin / phenytoin',
    group: G.seizure,
    lines: [
      ['Fosphenytoin', 20, undefined, 'mg PE', 'IV at up to 150 mg PE/min'],
      ['Phenytoin', 20, undefined, 'mg', 'IV in normal saline only, no faster than 50 mg/min'],
    ],
    source: [{ chapter: 'hp4-2', match: 'Inj. Fosphenytoin 20 mg PE/kg IV' }],
  },

  // Stroke and raised ICP
  { id: 'mannitol', drug: 'Mannitol 20%', group: G.neuro, lines: [['Dose', 0.25, 1, 'g', 'IV over 15–20 min']], source: [{ chapter: 'hp1-2', match: 'Inj. Mannitol 20% — 0.25–1 g/kg IV over 15–20 min' }] },
  { id: 'hypertonic', drug: '3% hypertonic saline', group: G.neuro, lines: [['Volume', 3, 5, 'mL', 'IV over 10–20 min']], source: [{ chapter: 'hp1-2', match: '3% hypertonic saline 3–5 mL/kg IV' }] },

  // Poisoning (5.1)
  { id: 'charcoal', drug: 'Activated charcoal', group: G.tox, lines: [['Dose', 1, undefined, 'g', 'orally or by NG tube (50 g in adults)']], source: [{ chapter: 'hp5-1', match: 'Activated charcoal 1 g/kg (50 g in adults)' }] },
  {
    id: 'pralidoxime',
    drug: 'Pralidoxime (organophosphate only)',
    group: G.tox,
    lines: [
      ['Bolus', 30, 45, 'mg', 'IV over 30 minutes'],
      ['Infusion', 8, 12, 'mg/h', 'continuous'],
    ],
    source: [{ chapter: 'hp5-1', match: 'Bolus: 30–45 mg/kg IV over 30 minutes' }],
  },
  { id: 'bicarb', drug: 'Sodium bicarbonate', group: G.tox, lines: [['Dose', 1, 2, 'mEq', 'IV bolus if QRS >100 ms']], source: [{ chapter: 'hp5-1', match: 'Inj. Sodium bicarbonate 1–2 mEq/kg IV bolus if QRS >100 ms' }] },

  // Anticoagulation
  {
    id: 'enoxaparin',
    drug: 'Enoxaparin',
    group: G.anticoag,
    lines: [
      ['Dose', 1, undefined, 'mg', 'SC BD'],
      ['If >75 y', 0.75, undefined, 'mg', 'SC BD'],
    ],
    source: [{ chapter: 'hp2-1', match: 'Inj. Enoxaparin 1 mg/kg SC BD (0.75 mg/kg BD if >75 y' }],
  },
  {
    id: 'ufh',
    drug: 'Unfractionated heparin',
    group: G.anticoag,
    lines: [
      ['Bolus', 80, undefined, 'U', 'IV'],
      ['Infusion', 18, undefined, 'U/h', ''],
    ],
    source: [{ chapter: 'hp2-2', match: 'UFH 80 U/kg bolus then 18 U/kg/h' }],
  },

  // Fluids and infusions
  { id: 'fluid-20', drug: 'Crystalloid bolus 20 mL/kg', group: G.fluid, lines: [['Volume', 20, undefined, 'mL', 'warmed Ringer’s lactate, reassess after each bolus']], source: [{ chapter: 'hp3-1', match: '20 mL/kg bolus' }] },
  { id: 'fluid-30', drug: 'Crystalloid 30 mL/kg (sepsis)', group: G.fluid, lines: [['Volume', 30, undefined, 'mL', 'for hypotension or lactate ≥4 mmol/L']], source: [{ chapter: 'hp7-3', match: 'Begin rapid crystalloid, 30 mL/kg' }] },
  { id: 'insulin', drug: 'Regular insulin infusion (DKA / HHS)', group: G.fluid, lines: [['Rate', 0.1, undefined, 'U/h', '']], source: [{ chapter: 'hp4-3', match: 'Regular insulin infusion at 0.1 U/kg/h' }] },
  { id: 'noradrenaline', drug: 'Noradrenaline infusion', group: G.fluid, lines: [['Rate', 0.05, 0.5, 'mcg/min', 'first-line vasopressor']], source: [{ chapter: 'hp11-0', match: 'Noradrenaline 0.05–0.5 mcg/kg/min' }] },
  { id: 'adrenaline-inf', drug: 'Adrenaline infusion', group: G.fluid, lines: [['Rate', 0.05, 0.5, 'mcg/min', '']], source: [{ chapter: 'hp11-0', match: 'Adrenaline 0.05–0.5 mcg/kg/min' }] },
  { id: 'dopamine', drug: 'Dopamine infusion', group: G.fluid, lines: [['Rate', 5, 20, 'mcg/min', '']], source: [{ chapter: 'hp11-0', match: 'Dopamine 5–20 mcg/kg/min' }] },
  { id: 'dobutamine', drug: 'Dobutamine infusion', group: G.fluid, lines: [['Rate', 2, 20, 'mcg/min', '']], source: [{ chapter: 'hp11-0', match: 'Dobutamine 2–20 mcg/kg/min' }] },

  // Antibiotics (11.0, 7.4)
  { id: 'vancomycin', drug: 'Vancomycin', group: G.abx, lines: [['Dose', 15, undefined, 'mg', 'IV BD in 100 mL NS over 1 hour']], source: [{ chapter: 'hp11-0', match: 'Inj. Vancomycin 15 mg/kg IV BD in 100 mL NS over 1 hour' }] },
  { id: 'amikacin', drug: 'Amikacin', group: G.abx, lines: [['Dose', 15, undefined, 'mg', 'IV OD']], source: [{ chapter: 'hp7-4', match: 'Add Inj. Amikacin 15 mg/kg IV OD' }] },
  { id: 'acyclovir', drug: 'Acyclovir', group: G.abx, lines: [['Dose', 10, undefined, 'mg', 'IV TDS']], source: [{ chapter: 'hp11-0', match: 'Inj. Acyclovir 10 mg/kg IV TDS' }] },
  { id: 'artesunate', drug: 'Artesunate (severe malaria)', group: G.abx, lines: [['Dose', 2.4, undefined, 'mg', 'IV at 0, 12 and 24 hours, then every 24 hours']], source: [{ chapter: 'hp11-0', match: 'Inj. Artesunate 2.4 mg/kg IV at 0, 12 and 24 hours' }] },

  // Analgesia and sedation (11.0, 8.7)
  { id: 'fentanyl', drug: 'Fentanyl (analgesia)', group: G.pain, lines: [['Dose', 1, undefined, 'mcg', 'IV']], source: [{ chapter: 'hp11-0', match: 'Inj. Fentanyl 1 mcg/kg IV' }] },
  {
    id: 'morphine',
    drug: 'Morphine',
    group: G.pain,
    lines: [['Maximum per dose', 0.1, undefined, 'mg', 'usual dose 2–3 mg IV']],
    source: [{ chapter: 'hp11-0', match: 'Inj. Morphine 2–3 mg IV (maximum 0.1 mg/kg per dose)' }],
  },
  { id: 'ketamine-im', drug: 'Ketamine IM (extreme agitation)', group: G.pain, lines: [['Dose', 4, 5, 'mg', 'IM']], source: [{ chapter: 'hp8-7', match: 'Inj. Ketamine 4–5 mg/kg IM' }] },

  // Rapid sequence intubation (11.0)
  { id: 'rsi-fentanyl', drug: 'Fentanyl (RSI)', group: G.resus, lines: [['Dose', 1, 3, 'mcg', 'IV']], source: [{ chapter: 'hp11-0', match: 'Inj. Fentanyl 1–3 mcg/kg IV' }] },
  { id: 'ketamine', drug: 'Ketamine (RSI)', group: G.resus, lines: [['Dose', 1, 2, 'mg', 'IV']], source: [{ chapter: 'hp11-0', match: 'Inj. Ketamine 1–2 mg/kg IV' }] },
  { id: 'etomidate', drug: 'Etomidate', group: G.resus, lines: [['Dose', 0.3, undefined, 'mg', 'IV']], source: [{ chapter: 'hp11-0', match: 'Inj. Etomidate 0.3 mg/kg IV' }] },
  { id: 'propofol', drug: 'Propofol', group: G.resus, lines: [['Dose', 1, 2, 'mg', 'IV — avoid in shock']], source: [{ chapter: 'hp11-0', match: 'Inj. Propofol 1–2 mg/kg IV' }] },
  { id: 'midazolam', drug: 'Midazolam (RSI)', group: G.resus, lines: [['Dose', 0.1, 0.3, 'mg', 'IV']], source: [{ chapter: 'hp11-0', match: 'Inj. Midazolam 0.1–0.3 mg/kg IV' }] },
  { id: 'succinylcholine', drug: 'Succinylcholine', group: G.resus, lines: [['Dose', 1, 1.5, 'mg', 'IV — not in hyperkalaemia']], source: [{ chapter: 'hp11-0', match: 'Inj. Succinylcholine 1–1.5 mg/kg IV' }] },
  { id: 'rocuronium', drug: 'Rocuronium', group: G.resus, lines: [['Dose', 1.2, undefined, 'mg', 'IV']], source: [{ chapter: 'hp11-0', match: 'Inj. Rocuronium 1.2 mg/kg IV' }] },
  {
    id: 'lignocaine',
    drug: 'Lignocaine (cardiac arrest)',
    group: G.resus,
    lines: [
      ['First dose', 1, 1.5, 'mg', 'instead of amiodarone'],
      ['Second dose', 0.5, 0.75, 'mg', ''],
    ],
    source: [{ chapter: 'hp9-6', match: 'Inj. Lignocaine 1–1.5 mg/kg' }],
  },

  // Bites (5.2)
  {
    id: 'rig',
    drug: 'Rabies immunoglobulin',
    group: G.bite,
    lines: [
      ['Human RIG', 20, undefined, 'IU', 'infiltrate into the wound'],
      ['Equine RIG', 40, undefined, 'IU', 'infiltrate into the wound'],
    ],
    source: [{ chapter: 'hp5-2', match: 'Human RIG 20 IU/kg, or Equine RIG 40 IU/kg' }],
  },
];

export const GROUPS = Object.values(G);

export function doseCards(kg: number): DoseCard[] {
  const nac = nacIv(kg);
  const tpa = alteplase(kg);
  const tnk = range(kg, 0.25, undefined, 'mg', 25);
  const special: DoseCard[] = [
    {
      id: 'nac-iv',
      drug: 'N-acetylcysteine IV',
      group: G.tox,
      lines: nac.map((b, i) => ({
        label: `Bag ${i + 1}`,
        value: `${fmt(b.grams, 2)} g`,
        detail: `${b.mgPerKg} mg/kg in ${b.volumeMl === 1000 ? '1 L' : `${b.volumeMl} mL`} 5% D over ${b.hours} h → ${fmt(b.mlPerHour)} mL/h`,
      })),
      source: [{ chapter: 'hp5-1', match: '150 mg/kg in 200 mL 5% dextrose over 1 hour' }],
    },
    {
      id: 'nac-oral',
      drug: 'N-acetylcysteine oral',
      group: G.tox,
      lines: [
        { label: 'Loading', value: `${fmt(140 * kg)} mg`, detail: '140 mg/kg' },
        { label: 'Then', value: `${fmt(70 * kg)} mg`, detail: '70 mg/kg q4h × 17 doses' },
      ],
      source: [{ chapter: 'hp11-0', match: 'Oral: 140 mg/kg loading then 70 mg/kg q4h × 17 doses' }],
    },
    {
      id: 'alteplase',
      drug: 'Alteplase (stroke)',
      group: G.neuro,
      lines: [
        { label: 'Total', value: `${fmt(tpa.total)} mg`, detail: '0.9 mg/kg, maximum 90 mg' },
        { label: 'Bolus (10%)', value: `${fmt(tpa.bolus)} mg`, detail: '' },
        { label: 'Infusion (90%)', value: `${fmt(tpa.infusion)} mg`, detail: '' },
      ],
      capped: tpa.capped ? 'Capped at the 90 mg maximum.' : undefined,
      source: [{ chapter: 'hp4-4', match: 'Inj. Alteplase 0.9 mg/kg IV (maximum 90 mg)' }],
    },
    {
      id: 'tenecteplase',
      drug: 'Tenecteplase (stroke)',
      group: G.neuro,
      lines: [{ label: 'Dose', value: tnk.value, detail: '0.25 mg/kg, maximum 25 mg, single IV bolus' }],
      capped: tnk.capped ? 'Capped at the 25 mg maximum.' : undefined,
      source: [{ chapter: 'hp4-4', match: 'Inj. Tenecteplase 0.25 mg/kg IV (maximum 25 mg)' }],
    },
  ];
  const simple: DoseCard[] = SIMPLE.map((s) => {
    let capped: string | undefined;
    const lines = s.lines.map(([label, lo, hi, unit, detail, max]) => {
      const r = range(kg, lo, hi, unit, max);
      if (r.capped) capped = `Capped at the ${fmt(max!)} ${unit} maximum.`;
      return { label, value: r.value, detail: detail || undefined };
    });
    return { id: s.id, drug: s.drug, group: s.group, lines, capped, source: s.source };
  });
  return [...special, ...simple];
}

/** These are adult doses: flag weights that are probably a typo or a child. */
export function weightWarning(kg: number | undefined): string | null {
  if (kg === undefined) return null;
  if (kg <= 0 || kg > 300) return 'Enter a weight in kg.';
  if (kg < 30 || kg > 150) return 'Check the weight: these are adult doses from the manual.';
  return null;
}

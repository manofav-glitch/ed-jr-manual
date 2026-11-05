// Triage from the hospital manual: the Triage chapter's five zones plus the physiological
// thresholds of section 9.1 (ABCDE assessment by triage zone). The two disagree in places; the
// more urgent zone wins, and every reason says which table it came from. Labels for the
// tick-boxes are the manual's own list items (see src/features/triage/store.ts).
//
// Values that fall between Red and Yellow in both tables (SpO₂ 92–95 %, GCS 9–13) are triaged
// up to RED, and the screen says so.

export interface Vitals {
  rr?: number;
  spo2?: number;
  /** SpO₂ measured on supplemental oxygen. */
  onOxygen?: boolean;
  hr?: number;
  sbp?: number;
  dbp?: number;
  gcs?: number;
  /** Always stored in °F, the unit section 9.1 uses. */
  tempF?: number;
  /** Random blood sugar, mg/dL. */
  rbs?: number;
}

export type Zone = 'RESUS' | 'RED' | 'YELLOW' | 'GREEN' | 'WHITE';

export const ZONE_NAME: Record<Zone, string> = {
  RESUS: 'Resuscitation Bay',
  RED: 'Red bed',
  YELLOW: 'Yellow bed',
  GREEN: 'Green bed',
  WHITE: 'White bed (day care)',
};

export interface TriageInput {
  vitals: Vitals;
  /** Texts of ticked items, by the zone whose list they come from. */
  ticked: Partial<Record<Zone, string[]>>;
  /** "Priority Red regardless of the above" ticked. */
  priorityRed?: boolean;
}

export interface Reason {
  zone: Zone;
  text: string;
  /** "Triage" (Triage chapter), "9.1" (ABCDE table) or "Ticked". */
  source: 'Triage' | '9.1' | 'Ticked';
}

export interface TriageResult {
  /** null until there is a Resus/Red reason or every vital needed to call Yellow/Green/White is entered. */
  zone: Zone | null;
  reasons: Reason[];
  /** Values the manual does not place in Red or Yellow; each one triages up to RED. */
  gaps: string[];
  missing: string[];
  shockIndex?: number;
}

export const REQUIRED: { key: 'rr' | 'spo2' | 'hr' | 'sbp' | 'dbp' | 'gcs'; label: string }[] = [
  { key: 'rr', label: 'RR' },
  { key: 'spo2', label: 'SpO₂' },
  { key: 'hr', label: 'HR' },
  { key: 'sbp', label: 'SBP' },
  { key: 'dbp', label: 'DBP' },
  { key: 'gcs', label: 'GCS' },
];

export const cToF = (c: number) => (c * 9) / 5 + 32;

export function shockIndex(hr?: number, sbp?: number): number | undefined {
  return hr !== undefined && sbp !== undefined && sbp > 0 ? hr / sbp : undefined;
}

const ORDER: Zone[] = ['RESUS', 'RED', 'YELLOW', 'GREEN', 'WHITE'];

export function triage(input: TriageInput): TriageResult {
  const v = input.vitals;
  const reasons: Reason[] = [];
  const gaps: string[] = [];
  const has = (x: number | undefined): x is number => x !== undefined && Number.isFinite(x);
  const add = (zone: Zone, source: Reason['source'], text: string) => reasons.push({ zone, source, text });
  const si = shockIndex(v.hr, v.sbp);

  // Resuscitation Bay
  if (has(v.rr) && (v.rr > 40 || v.rr < 10)) add('RESUS', 'Triage', `RR >40 or <10 (${v.rr})`);
  if (has(v.spo2) && v.onOxygen && v.spo2 < 90) add('RESUS', 'Triage', `SpO₂ <90% on oxygen (${v.spo2}%)`);
  if (has(v.spo2) && v.spo2 < 80) add('RESUS', '9.1', `SpO₂ <80% (${v.spo2}%)`);
  if (has(v.hr) && (v.hr > 150 || v.hr < 40)) add('RESUS', 'Triage', `HR >150 / <40 (${v.hr})`);
  if ((has(v.sbp) && v.sbp > 180) || (has(v.dbp) && v.dbp > 100)) add('RESUS', '9.1', `BP >180/100 (${bp(v)})`);
  if ((has(v.sbp) && v.sbp < 90) || (has(v.dbp) && v.dbp < 60)) add('RESUS', '9.1', `BP <90/60 (${bp(v)})`);
  if (si !== undefined && si > 1) add('RESUS', '9.1', `Shock index >1.0 (${si.toFixed(2)})`);
  if (has(v.gcs) && v.gcs <= 8) add('RESUS', 'Triage', `GCS ≤8 (${v.gcs})`);
  if (has(v.tempF) && (v.tempF > 104 || v.tempF < 97)) add('RESUS', '9.1', `Temperature >104 or <97 °F (${round1(v.tempF)} °F)`);
  if (has(v.rbs) && v.rbs < 50) add('RESUS', '9.1', `Blood sugar <50 mg/dL (${v.rbs})`);

  // Red bed
  if (si !== undefined && si > 0.9 && si <= 1) add('RED', 'Triage', `Shock index (HR÷SBP) >0.9 (${si.toFixed(2)})`);
  if (has(v.hr) && v.hr > 100 && v.hr <= 150) add('RED', 'Triage', `Danger-zone HR >100 (${v.hr})`);
  if (has(v.hr) && v.hr >= 40 && v.hr < 60) add('RED', '9.1', `HR <60 (${v.hr})`);
  if (has(v.rr) && v.rr > 20 && v.rr <= 40) add('RED', 'Triage', `Danger-zone RR >20 (${v.rr})`);
  if (has(v.rr) && v.rr >= 10 && v.rr <= 12) add('RED', '9.1', `RR 10–12 (${v.rr})`);
  if (has(v.spo2) && v.spo2 < 92 && !reasons.some((r) => r.zone === 'RESUS' && r.text.startsWith('SpO₂'))) {
    add('RED', 'Triage', `Danger-zone SpO₂ <92% (${v.spo2}%)`);
  }
  const lowBp = (has(v.sbp) && v.sbp < 100) || (has(v.dbp) && v.dbp < 70);
  if (lowBp && !reasons.some((r) => r.text.startsWith('BP <90/60'))) add('RED', '9.1', `BP <100/70 (${bp(v)})`);
  if (has(v.rbs) && v.rbs >= 50 && (v.rbs < 70 || v.rbs > 250)) add('RED', '9.1', `Blood sugar <70 or >250 mg/dL (${v.rbs})`);

  // Between Red and Yellow in both tables.
  if (has(v.spo2) && v.spo2 >= 92 && v.spo2 <= 95) {
    gaps.push(`SpO₂ ${v.spo2}% is neither Red (<92%) nor a stable primary survey (>95%): triaged up to RED.`);
  }
  if (has(v.gcs) && v.gcs > 8 && v.gcs <= 13) {
    gaps.push(`GCS ${v.gcs} is neither Resuscitation Bay (≤8) nor a stable primary survey (>13): triaged up to RED.`);
  }

  for (const zone of ORDER) for (const t of input.ticked[zone] ?? []) add(zone, 'Ticked', t);
  if (input.priorityRed) add('RED', 'Ticked', 'Priority Red regardless of the above');

  const missing = REQUIRED.filter((r) => !has(v[r.key])).map((r) => r.label);
  const any = (z: Zone) => reasons.some((r) => r.zone === z);

  let zone: Zone | null;
  if (any('RESUS')) zone = 'RESUS';
  else if (any('RED') || gaps.length) zone = 'RED';
  else if (missing.length) zone = null;
  else if (any('YELLOW')) zone = 'YELLOW';
  // Day care only when nothing else applies.
  else if (any('WHITE') && !any('GREEN')) zone = 'WHITE';
  else zone = 'GREEN';

  return { zone, reasons, gaps, missing, shockIndex: si };
}

function bp(v: Vitals): string {
  return `${v.sbp ?? '—'}/${v.dbp ?? '—'}`;
}

function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

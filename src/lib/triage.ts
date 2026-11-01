// Chapter 1 triage, as written. Thresholds are code; every label is the manual's own text.
//
// RED    any compromised primary-survey criterion, any time-sensitive emergency
// YELLOW stable primary survey + a vulnerable group
// GREEN  stable primary survey, no risk factors
//
// Where the manual leaves a gap between Red and Yellow (SpO₂ 94–95 %, GCS 13, SBP 90) the patient
// is triaged up to RED and the screen says why.

export interface Vitals {
  rr?: number;
  spo2?: number;
  hr?: number;
  sbp?: number;
  dbp?: number;
  gcs?: number;
  /** Always stored in °C. */
  tempC?: number;
}

/** Non-numeric primary-survey findings from the ch 1 RED table. `match` is the manual's exact wording. */
export const FINDINGS = [
  { id: 'airway-noisy', part: 'A', match: 'Noisy breathing / stridor / pooling of secretions' },
  { id: 'angioedema', part: 'A', match: 'angioedema involving face' },
  { id: 'work-of-breathing', part: 'B', match: 'increased work of breathing, audible wheeze' },
  { id: 'active-bleeding', part: 'C', match: 'presence of active bleeding' },
  { id: 'pain-or-unresponsive', part: 'D', match: 'responding only to pain or unresponsive' },
  { id: 'ongoing-seizure', part: 'D', match: 'patient with ongoing seizure' },
] as const;

export type FindingId = (typeof FINDINGS)[number]['id'];

export interface TriageInput {
  vitals: Vitals;
  findings: FindingId[];
  /** Texts of the ticked time-sensitive emergencies. */
  emergencies: string[];
  /** Texts of the ticked vulnerable groups. */
  vulnerable: string[];
  /** The site's "priority Red" group (AIIMS EHS), only when the site turns it on for triage. */
  priorityRed?: string;
}

export type Category = 'RED' | 'YELLOW' | 'GREEN';

export interface TriageResult {
  /** null until there is a Red reason or every vital needed to call Yellow/Green is entered. */
  category: Category | null;
  red: string[];
  yellow: string[];
  /** Values the manual does not define; each one triages up to RED. */
  gaps: string[];
  /** How the app read something the manual leaves open. */
  notes: string[];
  missing: string[];
  shockIndex?: number;
  fever: boolean;
}

/** Ch 11: "> 100.4 °F — fever" (38.0 °C). */
export const FEVER_ABOVE_C = 38;

export const REQUIRED: { key: keyof Vitals; label: string }[] = [
  { key: 'rr', label: 'RR' },
  { key: 'spo2', label: 'SpO₂' },
  { key: 'hr', label: 'HR' },
  { key: 'sbp', label: 'SBP' },
  { key: 'dbp', label: 'DBP' },
  { key: 'gcs', label: 'GCS' },
];

export function fToC(f: number): number {
  return ((f - 32) * 5) / 9;
}

export function shockIndex(hr?: number, sbp?: number): number | undefined {
  return hr !== undefined && sbp !== undefined && sbp > 0 ? hr / sbp : undefined;
}

export function triage(input: TriageInput): TriageResult {
  const v = input.vitals;
  const red: string[] = [];
  const yellow: string[] = [];
  const gaps: string[] = [];
  const notes: string[] = [];
  const has = (x: number | undefined): x is number => x !== undefined && Number.isFinite(x);
  const fever = has(v.tempC) && v.tempC > FEVER_ABOVE_C;

  for (const f of FINDINGS) if (input.findings.includes(f.id)) red.push(`${f.part}: ${f.match}`);

  // B — Breathing
  if (has(v.rr) && v.rr < 10) red.push(`B: RR < 10/min (${v.rr})`);
  if (has(v.rr) && v.rr > 24) red.push(`B: RR > 24/min (${v.rr})`);
  if (has(v.spo2) && v.spo2 < 94) red.push(`B: SpO₂ < 94% (${v.spo2}%)`);
  if (has(v.spo2) && v.spo2 >= 94 && v.spo2 <= 95) {
    gaps.push(`SpO₂ ${v.spo2}% is not defined in the manual (Red < 94%, Yellow > 95%): triaged up to RED.`);
  }

  // C — Circulation
  if (has(v.hr) && v.hr < 50) red.push(`C: HR < 50 (${v.hr})`);
  if (has(v.hr) && v.hr > 120) {
    if (fever) {
      yellow.push(`HR > 120 with fever (${v.hr}, ${round1(v.tempC!)} °C)`);
      notes.push(
        'The manual\'s Red criterion is "HR > 120 (without fever)", so febrile tachycardia alone is not Red. ' +
          'It is not a stable primary survey either, so the app calls it at least Yellow.',
      );
    } else {
      red.push(`C: HR > 120 without fever (${v.hr})`);
      if (!has(v.tempC)) notes.push('No temperature entered, so HR > 120 counts as Red. Enter the temperature to apply the "without fever" exception.');
    }
  }
  if (has(v.hr) && ((v.hr > 100 && v.hr <= 120) || (v.hr >= 50 && v.hr < 60))) {
    notes.push('The manual gives no numbers for tachycardia or bradycardia under Yellow; the app uses the Red limits (HR 50–120).');
  }
  if (has(v.sbp) && v.sbp < 90) red.push(`C: SBP < 90 (${v.sbp})`);
  if (has(v.sbp) && v.sbp === 90) gaps.push('SBP 90 is not defined in the manual (Red < 90, Yellow > 90): triaged up to RED.');
  if (has(v.sbp) && v.sbp > 200) red.push(`C: SBP > 200 (${v.sbp})`);
  if (has(v.dbp) && v.dbp > 110) red.push(`C: DBP > 110 (${v.dbp})`);
  const si = shockIndex(v.hr, v.sbp);
  if (si !== undefined && si > 1) red.push(`C: shock index (pulse rate / SBP) > 1 (${si.toFixed(2)})`);

  // D — Disability
  if (has(v.gcs) && v.gcs < 13) red.push(`D: GCS < 13 (${v.gcs})`);
  if (has(v.gcs) && v.gcs === 13) gaps.push('GCS 13 is not defined in the manual (Red < 13, Yellow > 13): triaged up to RED.');

  for (const e of input.emergencies) red.push(`Time-sensitive: ${e}`);
  if (input.priorityRed) red.push(`Priority Red: ${input.priorityRed}`);
  for (const g of input.vulnerable) yellow.push(g);

  const missing = REQUIRED.filter((r) => !has(v[r.key])).map((r) => r.label);

  let category: Category | null;
  if (red.length || gaps.length) category = 'RED';
  else if (missing.length) category = null;
  else if (yellow.length) category = 'YELLOW';
  else category = 'GREEN';

  return { category, red, yellow, gaps, notes, missing, shockIndex: si, fever };
}

function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

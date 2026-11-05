// Case-sheet note in the hospital's "Standard format for the ED case sheet" (documentation
// guide). buildNote() turns the form into plain text to paste into the case sheet; empty fields
// are left out.

export interface Timed {
  name: string;
  /** "HH:MM" */
  time: string;
}

export interface Consult {
  name: string;
  informed: string;
  seen: string;
  advice: string;
}

export const ARRIVAL_MODES = ['walk-in', 'ambulance', 'referred', 'in-hospital transfer'] as const;
export const DISPOSITIONS = ['Shifted to', 'Admitted under', 'Discharged with advice', 'Referred', 'LAMA'] as const;

export interface NoteData {
  /** "YYYY-MM-DDTHH:MM", local time. */
  examinedAt: string;
  /** "Dr ABC, EMO" — kept when the note is cleared. */
  seenBy: string;
  // Front sheet & identification (name, UHID and contact are on the case sheet itself)
  age: string;
  sex: '' | 'M' | 'F' | 'Other';
  arrivedAt: string;
  arrivalMode: '' | (typeof ARRIVAL_MODES)[number];
  mlcNumber: string;
  allergies: string;
  noKnownAllergies: boolean;
  comorbid: string;
  medications: string;
  complaint: string;
  // Primary survey
  airway: '' | 'Patent' | 'Threatened' | 'Obstructed';
  airwayIntervention: string;
  rr: string;
  spo2: string;
  oxygen: string;
  airEntry: string;
  addedSounds: string;
  pulse: string;
  pulseRhythm: '' | 'regular' | 'irregular';
  bp: string;
  crt: string;
  perfusion: string;
  gcsE: string;
  gcsV: string;
  gcsM: string;
  /** Total GCS when E/V/M were not recorded (e.g. imported from triage). */
  gcsTotal: string;
  pupils: string;
  focalDeficit: string;
  plantars: string;
  rbs: string;
  temp: string;
  tempUnit: 'C' | 'F';
  exposure: string;
  // History and examination
  history: string;
  negatives: string;
  systemic: string;
  // Investigations, consults & treatment
  investigations: Timed[];
  findings: string;
  consults: Consult[];
  treatment: Timed[];
  procedures: string;
  bloodConsent: string;
  disposition: '' | (typeof DISPOSITIONS)[number];
  dispositionDetail: string;
}

export const EMPTY_NOTE: NoteData = {
  examinedAt: '',
  seenBy: '',
  age: '',
  sex: '',
  arrivedAt: '',
  arrivalMode: '',
  mlcNumber: '',
  allergies: '',
  noKnownAllergies: false,
  comorbid: '',
  medications: '',
  complaint: '',
  airway: '',
  airwayIntervention: '',
  rr: '',
  spo2: '',
  oxygen: '',
  airEntry: '',
  addedSounds: '',
  pulse: '',
  pulseRhythm: '',
  bp: '',
  crt: '',
  perfusion: '',
  gcsE: '',
  gcsV: '',
  gcsM: '',
  gcsTotal: '',
  pupils: '',
  focalDeficit: '',
  plantars: '',
  rbs: '',
  temp: '',
  tempUnit: 'F',
  exposure: '',
  history: '',
  negatives: '',
  systemic: '',
  investigations: [],
  findings: '',
  consults: [],
  treatment: [],
  procedures: '',
  bloodConsent: '',
  disposition: '',
  dispositionDetail: '',
};

/** Vitals that can come across from the triage tool. */
export interface ImportedVitals {
  rr?: number;
  spo2?: number;
  onOxygen?: boolean;
  hr?: number;
  sbp?: number;
  dbp?: number;
  gcs?: number;
  rbs?: number;
  /** In the triage tool's own unit. */
  temp?: number;
  tempUnit: 'C' | 'F';
}

/** Fill the note's vitals from triage. Fields the triage tool didn't have are left as they are. */
export function importVitals(n: NoteData, v: ImportedVitals): NoteData {
  const s = (x: number | undefined, keep: string) => (x === undefined ? keep : String(x));
  const bp = v.sbp !== undefined && v.dbp !== undefined ? `${v.sbp}/${v.dbp}` : v.sbp !== undefined ? `${v.sbp}/` : n.bp;
  return {
    ...n,
    rr: s(v.rr, n.rr),
    spo2: s(v.spo2, n.spo2),
    oxygen: v.spo2 !== undefined && v.onOxygen && !n.oxygen ? 'oxygen' : n.oxygen,
    pulse: s(v.hr, n.pulse),
    bp,
    gcsTotal: s(v.gcs, n.gcsTotal),
    rbs: s(v.rbs, n.rbs),
    temp: s(v.temp, n.temp),
    tempUnit: v.temp !== undefined ? v.tempUnit : n.tempUnit,
  };
}

/** Shock index from the note's pulse and BP ("120/80"), if both are there. */
export function noteShockIndex(n: NoteData): number | undefined {
  const hr = Number(n.pulse);
  const sbp = Number(n.bp.split('/')[0]);
  return n.pulse && n.bp && hr > 0 && sbp > 0 ? hr / sbp : undefined;
}

export function buildNote(n: NoteData): string {
  const out: string[] = [];
  const line = (label: string, value: string) => value.trim() && out.push(`${label}: ${value.trim()}`);
  const join = (parts: (string | false | undefined)[], sep = ', ') => parts.filter((p): p is string => !!p && !!p.trim()).join(sep);

  // "Known drug allergies written in CAPITALS on the front sheet"
  if (n.allergies.trim()) out.push(`DRUG ALLERGY: ${n.allergies.trim().toUpperCase()}`);
  else if (n.noKnownAllergies) out.push('NO KNOWN DRUG ALLERGIES');

  const when = formatWhen(n.examinedAt);
  if (when) out.push(`Date & time examined: ${when}`);
  if (n.seenBy.trim()) out.push(`Case seen by ${n.seenBy.trim()}`);
  const id = join(
    [
      (n.age || n.sex) && `Age/Sex: ${n.age || '—'}/${n.sex || '—'}`,
      (n.arrivedAt || n.arrivalMode) && join(['Arrived', n.arrivedAt, n.arrivalMode && `(${n.arrivalMode})`], ' '),
      n.mlcNumber && `MLC No. ${n.mlcNumber}`,
    ],
    ' · ',
  );
  if (id) out.push(id);

  section(out);
  line('Co-morbid illness', n.comorbid);
  line('Current medications', n.medications);
  line('Chief complaint', n.complaint);

  const si = noteShockIndex(n);
  const a = join([n.airway, n.airwayIntervention && `intervention: ${n.airwayIntervention}`]);
  const b = join([
    n.rr && `RR ${n.rr}/min`,
    n.spo2 && `SpO₂ ${n.spo2}%${n.oxygen ? ` on ${n.oxygen}` : ''}`,
    n.airEntry && `B/L air entry ${n.airEntry}`,
    n.addedSounds && `added sounds: ${n.addedSounds}`,
  ]);
  const c = join([
    n.pulse && `PR ${n.pulse}/min${n.pulseRhythm ? ` ${n.pulseRhythm}` : ''}`,
    n.bp && `BP ${n.bp} mmHg`,
    si !== undefined && `shock index ${si.toFixed(2)}`,
    n.crt && `CRT ${n.crt}`,
    n.perfusion && `peripheral perfusion ${n.perfusion}`,
  ]);
  const d = join([gcs(n), n.pupils && `pupils ${n.pupils}`, n.focalDeficit && `focal deficit: ${n.focalDeficit}`, n.plantars && `plantars ${n.plantars}`, n.rbs && `RBS ${n.rbs} mg/dL`]);
  const e = join([n.temp && `Temp ${n.temp} °${n.tempUnit}`, n.exposure]);
  if (a || b || c || d || e) {
    section(out, 'PRIMARY SURVEY');
    if (a) out.push(`A: ${a}`);
    if (b) out.push(`B: ${b}`);
    if (c) out.push(`C: ${c}`);
    if (d) out.push(`D: ${d}`);
    if (e) out.push(`E: ${e}`);
  }

  section(out);
  line('History', n.history);
  line('Relevant negatives', n.negatives);
  line('Examination', n.systemic);

  const inv = n.investigations.filter((i) => i.name.trim());
  if (inv.length || n.findings.trim()) {
    section(out, 'INVESTIGATIONS');
    for (const i of inv) out.push(`- ${i.name.trim()}${i.time ? ` — sent ${i.time}` : ''}`);
    line('Findings', n.findings);
  }

  const consults = n.consults.filter((c) => c.name.trim());
  if (consults.length) {
    section(out, 'CONSULTATIONS');
    for (const c of consults) {
      out.push(`- ${join([c.name.trim(), c.informed && `informed ${c.informed}`, c.seen && `seen ${c.seen}`, c.advice.trim() && `advice: ${c.advice.trim()}`], ' — ')}`);
    }
  }

  const tx = n.treatment.filter((t) => t.name.trim());
  if (tx.length || n.procedures.trim() || n.bloodConsent.trim()) {
    section(out, 'TREATMENT');
    tx.forEach((t, i) => out.push(`${i + 1}) ${t.name.trim()}${t.time ? ` — ${t.time}` : ''}`));
    line('Procedures', n.procedures);
    line('Blood products / consent / counselling', n.bloodConsent);
  }

  if (n.disposition || n.dispositionDetail.trim()) {
    section(out, 'DISPOSITION');
    out.push(join([n.disposition, n.dispositionDetail.trim()], ' '));
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function section(out: string[], title?: string) {
  if (out.length && out.at(-1) !== '') out.push('');
  if (title) out.push(title);
}

/** "Record as E_V_M_ = total, never as a bare number." */
function gcs(n: NoteData): string {
  if (n.gcsE || n.gcsV || n.gcsM) {
    const total = [n.gcsE, n.gcsV, n.gcsM].map(Number).reduce((x, y) => x + y, 0);
    const complete = n.gcsE && n.gcsV && n.gcsM && Number.isFinite(total);
    return `GCS E${n.gcsE || '_'}V${n.gcsV || '_'}M${n.gcsM || '_'}${complete ? ` = ${total}` : ''}`;
  }
  return n.gcsTotal ? `GCS ${n.gcsTotal} (E, V, M not recorded)` : '';
}

/** "2026-11-02T03:12" → "02/11/2026 03:12" */
export function formatWhen(local: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local);
  return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}` : '';
}

export function nowLocal(d = new Date()): string {
  const p = (x: number) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function hhmm(d = new Date()): string {
  return nowLocal(d).slice(11);
}

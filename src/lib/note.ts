// Case-sheet note in the chapter 2 format. buildNote() turns the form into plain text to paste
// into the case sheet; empty fields are left out.

export interface Timed {
  name: string;
  /** "HH:MM" */
  time: string;
}

export interface NoteData {
  /** "YYYY-MM-DDTHH:MM", local time. */
  examinedAt: string;
  /** "Dr ABC, JR" — kept when the note is cleared. */
  seenBy: string;
  allergies: string;
  noKnownAllergies: boolean;
  comorbid: string;
  complaint: string;
  // Primary survey
  airway: '' | 'Patent' | 'Threatened' | 'Obstructed';
  airwayIntervention: string;
  rr: string;
  spo2: string;
  oxygen: string;
  airEntry: string;
  pulse: string;
  pulseRhythm: '' | 'regular' | 'irregular';
  bp: string;
  perfusion: string;
  gcsE: string;
  gcsV: string;
  gcsM: string;
  /** Total GCS when E/V/M were not recorded (e.g. imported from triage). */
  gcsTotal: string;
  focalDeficit: string;
  pupils: string;
  temp: string;
  tempUnit: 'C' | 'F';
  exposure: string;
  // History and examination
  history: string;
  negatives: string;
  systemic: string;
  // Investigations
  investigations: Timed[];
  findings: string;
  rbs: string;
  // Treatment
  treatment: string[];
  interventions: string;
  // Disposition
  shiftTo: string;
  handover: string;
  consults: Timed[];
  other: string;
}

export const EMPTY_NOTE: NoteData = {
  examinedAt: '',
  seenBy: '',
  allergies: '',
  noKnownAllergies: false,
  comorbid: '',
  complaint: '',
  airway: '',
  airwayIntervention: '',
  rr: '',
  spo2: '',
  oxygen: '',
  airEntry: '',
  pulse: '',
  pulseRhythm: '',
  bp: '',
  perfusion: '',
  gcsE: '',
  gcsV: '',
  gcsM: '',
  gcsTotal: '',
  focalDeficit: '',
  pupils: '',
  temp: '',
  tempUnit: 'C',
  exposure: '',
  history: '',
  negatives: '',
  systemic: '',
  investigations: [],
  findings: '',
  rbs: '',
  treatment: [],
  interventions: '',
  shiftTo: '',
  handover: '',
  consults: [],
  other: '',
};

/** Vitals that can come across from the triage tool. */
export interface ImportedVitals {
  rr?: number;
  spo2?: number;
  hr?: number;
  sbp?: number;
  dbp?: number;
  gcs?: number;
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
    pulse: s(v.hr, n.pulse),
    bp,
    gcsTotal: s(v.gcs, n.gcsTotal),
    temp: s(v.temp, n.temp),
    tempUnit: v.temp !== undefined ? v.tempUnit : n.tempUnit,
  };
}

export function buildNote(n: NoteData): string {
  const out: string[] = [];
  const line = (label: string, value: string) => value.trim() && out.push(`${label}: ${value.trim()}`);
  const join = (parts: (string | false | undefined)[]) => parts.filter((p): p is string => !!p && !!p.trim()).join(', ');

  // "If the patient has any known allergies to any specific drug, mention it on the front sheet in CAPITAL LETTERS."
  if (n.allergies.trim()) out.push(`DRUG ALLERGY: ${n.allergies.trim().toUpperCase()}`);
  else if (n.noKnownAllergies) out.push('NO KNOWN DRUG ALLERGIES');

  const when = formatWhen(n.examinedAt);
  if (when) out.push(`Date & time examined: ${when}`);
  if (n.seenBy.trim()) out.push(`Case seen by ${n.seenBy.trim()}`);
  section(out);
  line('Co-morbid illness', n.comorbid);
  line('Chief complaint', n.complaint);

  const a = join([n.airway, n.airwayIntervention && `intervention: ${n.airwayIntervention}`]);
  const b = join([n.rr && `RR ${n.rr}/min`, n.spo2 && `SpO₂ ${n.spo2}%${n.oxygen ? ` on ${n.oxygen}` : ''}`, n.airEntry && `B/L air entry ${n.airEntry}`]);
  const c = join([
    n.pulse && `PR ${n.pulse}/min${n.pulseRhythm ? ` ${n.pulseRhythm}` : ''}`,
    n.bp && `BP ${n.bp} mmHg`,
    n.perfusion && `CRT / perfusion ${n.perfusion}`,
  ]);
  const d = join([gcs(n), n.focalDeficit && `focal deficit: ${n.focalDeficit}`, n.pupils]);
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
  if (inv.length || n.findings.trim() || n.rbs.trim()) {
    section(out, 'POC INVESTIGATIONS');
    for (const i of inv) out.push(`- ${i.name.trim()}${i.time ? ` — sent ${i.time}` : ''}`);
    line('Findings', n.findings);
    if (n.rbs.trim()) out.push(`RBS: ${n.rbs.trim()} mg/dL`);
  }

  const tx = n.treatment.filter((t) => t.trim());
  if (tx.length || n.interventions.trim()) {
    section(out, 'TREATMENT');
    tx.forEach((t, i) => out.push(`${i + 1}) ${t.trim()}`));
    line('Other interventions', n.interventions);
  }

  const consults = n.consults.filter((c) => c.name.trim());
  if (n.shiftTo.trim() || n.handover.trim() || consults.length) {
    section(out, 'DISPOSITION');
    if (n.shiftTo.trim()) out.push(`Shift to ${n.shiftTo.trim()}`);
    line('Handover', n.handover);
    for (const c of consults) out.push(`Consult: ${c.name.trim()}${c.time ? ` — informed at ${c.time}` : ''}`);
  }

  if (n.other.trim()) {
    section(out, 'OTHER');
    out.push(n.other.trim());
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function section(out: string[], title?: string) {
  if (out.length && out.at(-1) !== '') out.push('');
  if (title) out.push(title);
}

function gcs(n: NoteData): string {
  if (n.gcsE || n.gcsV || n.gcsM) {
    const total = [n.gcsE, n.gcsV, n.gcsM].map(Number).reduce((x, y) => x + y, 0);
    const complete = n.gcsE && n.gcsV && n.gcsM && Number.isFinite(total);
    return `GCS E${n.gcsE || '?'}V${n.gcsV || '?'}M${n.gcsM || '?'}${complete ? ` (${total}/15)` : ''}`;
  }
  return n.gcsTotal ? `GCS ${n.gcsTotal}/15` : '';
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

// Code blue, from the hospital manual's BLS (9.4) and adult ACLS (9.6). Everything is derived
// from the timestamped event log, so the screen survives a reload and "Undo" is just dropping
// the last event.

export type Rhythm = 'vf' | 'pea' | 'asystole';

export type EventType =
  | 'start'
  | 'rhythm'
  | 'shock'
  | 'adrenaline'
  | 'amiodarone'
  | 'lignocaine'
  | 'calcium'
  | 'bicarb'
  | 'airway'
  | 'iv'
  | 'gas'
  | 'rosc'
  | 'end';

export interface CodeEvent {
  t: number;
  type: EventType;
  label: string;
  rhythm?: Rhythm;
}

export const RHYTHM_LABEL: Record<Rhythm, string> = { vf: 'VF / pVT', pea: 'PEA', asystole: 'Asystole' };

/** 9.6: "Rhythm check every 2 minutes". */
export const CYCLE_MS = 2 * 60_000;
/** 9.6: "Inj. Adrenaline 1 mg IV/IO … then every 3–5 minutes". */
export const ADRENALINE_FROM_MS = 3 * 60_000;
export const ADRENALINE_BY_MS = 5 * 60_000;

/** Doses and energies as written in 9.6. */
export const LABEL = {
  start: 'CPR started',
  shock: 'Shock (biphasic 120–200 J)',
  adrenaline: 'Inj. Adrenaline 1 mg IV/IO',
  amiodarone1: 'Inj. Amiodarone 300 mg IV/IO bolus',
  amiodarone2: 'Inj. Amiodarone 150 mg IV/IO (second dose)',
  lignocaine1: 'Inj. Lignocaine 1–1.5 mg/kg',
  lignocaine2: 'Inj. Lignocaine 0.5–0.75 mg/kg (second dose)',
  calcium: 'Calcium given',
  bicarb: 'Sodium bicarbonate given',
  airway: 'Advanced airway in place',
  iv: 'IV / IO access',
  gas: 'Blood gas sent',
  rosc: 'ROSC',
  end: 'Resuscitation stopped',
} as const;

export interface CodeView {
  startedAt: number | null;
  endedAt: number | null;
  running: boolean;
  rhythm: Rhythm | null;
  advancedAirway: boolean;
  shocks: number;
  adrenalineDoses: number;
  /** Next antiarrhythmic dose (1 or 2), or null when both are given or the other drug was chosen. */
  nextAmiodarone: 1 | 2 | null;
  nextLignocaine: 1 | 2 | null;
  /** When the current 2-minute CPR cycle started (start, last shock or last rhythm check). */
  cycleStart: number | null;
  lastAdrenaline: number | null;
}

export function view(events: CodeEvent[]): CodeView {
  const last = (type: EventType) => [...events].reverse().find((e) => e.type === type);
  const count = (type: EventType) => events.filter((e) => e.type === type).length;
  const start = events.find((e) => e.type === 'start');
  const ended = events.find((e) => e.type === 'rosc' || e.type === 'end');
  const cycle = [...events].reverse().find((e) => e.type === 'start' || e.type === 'shock' || e.type === 'rhythm');
  const amio = count('amiodarone');
  const lig = count('lignocaine');
  // 9.6: amiodarone *or* lignocaine.
  const next = (mine: number, other: number) => (other > 0 || mine >= 2 ? null : ((mine + 1) as 1 | 2));
  return {
    startedAt: start?.t ?? null,
    endedAt: ended?.t ?? null,
    running: !!start && !ended,
    rhythm: last('rhythm')?.rhythm ?? null,
    advancedAirway: count('airway') > 0,
    shocks: count('shock'),
    adrenalineDoses: count('adrenaline'),
    nextAmiodarone: next(amio, lig),
    nextLignocaine: next(lig, amio),
    cycleStart: cycle?.t ?? null,
    lastAdrenaline: last('adrenaline')?.t ?? null,
  };
}

/** The event a button press adds, or null if it does not apply now. */
export function eventFor(type: EventType, v: CodeView, now: number, rhythm?: Rhythm): CodeEvent | null {
  if (type === 'start') return v.startedAt === null ? { t: now, type, label: LABEL.start } : null;
  if (!v.running) return null;
  switch (type) {
    case 'rhythm':
      if (!rhythm) return null;
      return { t: now, type, rhythm, label: `${v.rhythm === null ? 'Rhythm' : 'Rhythm check'}: ${RHYTHM_LABEL[rhythm]}` };
    case 'shock':
      return { t: now, type, label: `${LABEL.shock} (shock ${v.shocks + 1})` };
    case 'adrenaline':
      return { t: now, type, label: `${LABEL.adrenaline} (dose ${v.adrenalineDoses + 1})` };
    case 'amiodarone':
      if (v.nextAmiodarone === null) return null;
      return { t: now, type, label: v.nextAmiodarone === 1 ? LABEL.amiodarone1 : LABEL.amiodarone2 };
    case 'lignocaine':
      if (v.nextLignocaine === null) return null;
      return { t: now, type, label: v.nextLignocaine === 1 ? LABEL.lignocaine1 : LABEL.lignocaine2 };
    case 'airway':
      return v.advancedAirway ? null : { t: now, type, label: LABEL.airway };
    case 'calcium':
    case 'bicarb':
    case 'iv':
    case 'gas':
    case 'rosc':
    case 'end':
      return { t: now, type, label: LABEL[type] };
  }
}

/** ms left in the current 2-minute cycle (negative when overdue). */
export function cycleRemaining(v: CodeView, now: number): number | null {
  return v.running && v.cycleStart !== null ? v.cycleStart + CYCLE_MS - now : null;
}

export type AdrenalineState =
  | { state: 'none' }
  /** Before 3 minutes: `in` ms until the window opens. */
  | { state: 'wait'; in: number }
  /** 3–5 minutes: `left` ms until the 5-minute mark. */
  | { state: 'due'; left: number }
  /** Past 5 minutes by `over` ms. */
  | { state: 'overdue'; over: number };

export function adrenaline(v: CodeView, now: number): AdrenalineState {
  if (!v.running || v.lastAdrenaline === null) return { state: 'none' };
  const since = now - v.lastAdrenaline;
  if (since < ADRENALINE_FROM_MS) return { state: 'wait', in: ADRENALINE_FROM_MS - since };
  if (since <= ADRENALINE_BY_MS) return { state: 'due', left: ADRENALINE_BY_MS - since };
  return { state: 'overdue', over: since - ADRENALINE_BY_MS };
}

/** "m:ss"; negative values as "+m:ss" (overdue). */
export function clock(ms: number): string {
  const neg = ms < 0;
  const s = Math.floor(Math.abs(ms) / 1000);
  return `${neg ? '+' : ''}${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Plain-text log for the case sheet. */
export function logText(events: CodeEvent[], considered: string[] = []): string {
  const start = events.find((e) => e.type === 'start');
  if (!start) return '';
  const d = new Date(start.t);
  const lines = [
    `CODE BLUE — ${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, started ${hhmmss(start.t)}`,
    ...events.map((e) => `${clock(e.t - start.t).padStart(5)}  (${hhmmss(e.t)})  ${e.label}`),
  ];
  if (considered.length) lines.push(`Reversible causes considered: ${considered.join(', ')}`);
  return lines.join('\n');
}

function hhmmss(t: number): string {
  return new Date(t).toLocaleTimeString('en-GB', { hour12: false });
}

// Code blue (chapter 13). Everything is derived from the timestamped event log, so the screen
// survives a reload and "Undo" is just dropping the last event.

export type Rhythm = 'vf' | 'pea' | 'asystole';

export type EventType =
  | 'start'
  | 'rhythm'
  | 'shock'
  | 'adrenaline'
  | 'amiodarone'
  | 'calcium'
  | 'bicarb'
  | 'airway'
  | 'iv'
  | 'vbg'
  | 'rosc'
  | 'end';

export interface CodeEvent {
  t: number;
  type: EventType;
  label: string;
  rhythm?: Rhythm;
}

export const RHYTHM_LABEL: Record<Rhythm, string> = { vf: 'VF / pVT', pea: 'PEA', asystole: 'Asystole' };

/** Manual: "Rhythm (± pulse) check every 2 minutes of CPR". */
export const CYCLE_MS = 2 * 60_000;
/** Manual: "Inj. Adrenaline to repeat every 4 minutes". */
export const ADRENALINE_MS = 4 * 60_000;

/** Doses as written in chapter 13. */
export const LABEL = {
  start: 'CPR started',
  shock: 'DC shock 200 J',
  adrenaline: 'Inj. Adrenaline 1 mg IV',
  amiodarone1: 'Inj. Amiodarone 300 mg IV (1st)',
  amiodarone2: 'Inj. Amiodarone 150 mg IV (2nd)',
  calcium: 'Inj. Calcium gluconate 10%, 30 mL, IV push',
  bicarb: 'Inj. NaHCO₃ (1.5 mEq/kg) — 100 mEq, IV push',
  airway: 'Advanced airway in place',
  iv: 'IV access',
  vbg: 'VBG sent',
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
  amiodaroneDoses: number;
  /** Next amiodarone dose in mg, or null when both are given. */
  nextAmiodarone: 300 | 150 | null;
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
  return {
    startedAt: start?.t ?? null,
    endedAt: ended?.t ?? null,
    running: !!start && !ended,
    rhythm: last('rhythm')?.rhythm ?? null,
    advancedAirway: count('airway') > 0,
    shocks: count('shock'),
    adrenalineDoses: count('adrenaline'),
    amiodaroneDoses: amio,
    nextAmiodarone: amio === 0 ? 300 : amio === 1 ? 150 : null,
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
      return { t: now, type, label: v.nextAmiodarone === 300 ? LABEL.amiodarone1 : LABEL.amiodarone2 };
    case 'airway':
      return v.advancedAirway ? null : { t: now, type, label: LABEL.airway };
    case 'calcium':
    case 'bicarb':
    case 'iv':
    case 'vbg':
    case 'rosc':
    case 'end':
      return { t: now, type, label: LABEL[type] };
  }
}

/** ms left in the current 2-minute cycle (negative when overdue). */
export function cycleRemaining(v: CodeView, now: number): number | null {
  return v.running && v.cycleStart !== null ? v.cycleStart + CYCLE_MS - now : null;
}

/** ms until the next adrenaline (negative when overdue); null before the first dose. */
export function adrenalineDueIn(v: CodeView, now: number): number | null {
  return v.running && v.lastAdrenaline !== null ? v.lastAdrenaline + ADRENALINE_MS - now : null;
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

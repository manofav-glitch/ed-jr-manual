import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { num } from '../../lib/num.ts';
import { manual } from '../../lib/manual.ts';
import { safeStorage } from '../../lib/persist.ts';
import { listAfter } from '../../lib/quote.ts';
import { fToC, triage, type FindingId, type TriageResult, type Vitals } from '../../lib/triage.ts';
import { site } from '../../config/site.ts';

export const EMERGENCIES = listAfter(manual, 1, 'Time-sensitive emergencies');
export const VULNERABLE = listAfter(manual, 1, 'Vulnerable population');

export type VitalKey = keyof Vitals;

interface TriageState {
  /** Raw text of each field, so half-typed values survive. Temperature is in `tempUnit`. */
  fields: Partial<Record<VitalKey, string>>;
  tempUnit: 'C' | 'F';
  findings: FindingId[];
  /** Ids of ticked manual items (time-sensitive emergencies, vulnerable groups). */
  ticked: string[];
  priorityRed: boolean;
  /** When the vitals were last changed, so the note can show how old they are. */
  updatedAt: number | null;
  setField: (k: VitalKey, v: string) => void;
  setTempUnit: (u: 'C' | 'F') => void;
  toggleFinding: (f: FindingId) => void;
  toggleItem: (id: string) => void;
  togglePriorityRed: () => void;
  clear: () => void;
}

const empty = { fields: {}, findings: [], ticked: [], priorityRed: false, updatedAt: null };
const toggle = <T,>(list: T[], x: T) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);

export const useTriage = create<TriageState>()(
  persist(
    (set) => ({
      ...empty,
      tempUnit: 'C',
      setField: (k, v) => set((s) => ({ fields: { ...s.fields, [k]: v }, updatedAt: Date.now() })),
      setTempUnit: (tempUnit) => set({ tempUnit }),
      toggleFinding: (f) => set((s) => ({ findings: toggle(s.findings, f) })),
      toggleItem: (id) => set((s) => ({ ticked: toggle(s.ticked, id) })),
      togglePriorityRed: () => set((s) => ({ priorityRed: !s.priorityRed })),
      clear: () => set(empty),
    }),
    { name: 'ed-triage', version: 1, storage: safeStorage },
  ),
);

/** Vitals in °C from the store's raw fields. */
export function vitalsFrom(fields: Partial<Record<VitalKey, string>>, tempUnit: 'C' | 'F'): Vitals {
  const t = num(fields.tempC);
  return {
    rr: num(fields.rr),
    spo2: num(fields.spo2),
    hr: num(fields.hr),
    sbp: num(fields.sbp),
    dbp: num(fields.dbp),
    gcs: num(fields.gcs),
    tempC: t === undefined ? undefined : tempUnit === 'F' ? fToC(t) : t,
  };
}

/** The triage result for the current store state. */
export function triageOf(s: Pick<TriageState, 'fields' | 'tempUnit' | 'findings' | 'ticked' | 'priorityRed'>): TriageResult {
  const useEhs = !!site.priorityRed?.useInTriage;
  return triage({
    vitals: vitalsFrom(s.fields, s.tempUnit),
    findings: s.findings,
    emergencies: EMERGENCIES.filter((i) => s.ticked.includes(i.id)).map((i) => i.text),
    vulnerable: VULNERABLE.filter((i) => s.ticked.includes(i.id)).map((i) => i.text),
    priorityRed: useEhs && s.priorityRed ? site.priorityRed!.text : undefined,
  });
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Item } from '../../data/types.ts';
import { manual } from '../../lib/manual.ts';
import { num } from '../../lib/num.ts';
import { safeStorage } from '../../lib/persist.ts';
import { listAfter, listIn } from '../../lib/quote.ts';
import { cToF, triage, type TriageResult, type Vitals, type Zone } from '../../lib/triage.ts';

const T = 'hp-triage';

/**
 * Tick-box lists, straight from the Triage chapter. Items the app works out from the vitals
 * (shock index, danger-zone vitals, the stable-survey definition) are not tick-boxes.
 */
const AUTO = [/^Shock index/, /^Danger-zone vitals/, /^Patent airway, RR 10–24/, /^Stable primary survey with/];
const pick = (items: Item[]) => items.filter((i) => !AUTO.some((re) => re.test(i.text)));

export const LISTS: { zone: Zone; title: string; items: Item[] }[] = [
  { zone: 'RESUS', title: 'Resuscitation Bay — physiology', items: pick(listAfter(manual, T, 'Physiology')) },
  { zone: 'RESUS', title: 'Resuscitation Bay — examples', items: pick(listAfter(manual, T, 'Examples')) },
  { zone: 'RED', title: 'Red bed — threat to life, limb or organ within hours', items: pick(listAfter(manual, T, 'Threat to life')) },
  { zone: 'YELLOW', title: 'Yellow bed — risk of early deterioration', items: pick(listAfter(manual, T, 'Stable primary survey')) },
  { zone: 'GREEN', title: 'Green bed', items: pick(listIn(manual, T, 'GREEN BED')) },
  { zone: 'WHITE', title: 'White bed — day care', items: pick(listIn(manual, T, 'WHITE BED')) },
];

export type VitalKey = 'rr' | 'spo2' | 'hr' | 'sbp' | 'dbp' | 'gcs' | 'temp' | 'rbs';

interface TriageState {
  /** Raw text of each field, so half-typed values survive. Temperature is in `tempUnit`. */
  fields: Partial<Record<VitalKey, string>>;
  tempUnit: 'C' | 'F';
  onOxygen: boolean;
  /** Ids of ticked manual items. */
  ticked: string[];
  priorityRed: boolean;
  /** When the vitals were last changed, so the note can show how old they are. */
  updatedAt: number | null;
  setField: (k: VitalKey, v: string) => void;
  setTempUnit: (u: 'C' | 'F') => void;
  toggleOxygen: () => void;
  toggleItem: (id: string) => void;
  togglePriorityRed: () => void;
  clear: () => void;
}

const empty = { fields: {}, onOxygen: false, ticked: [], priorityRed: false, updatedAt: null };
const toggle = <T,>(list: T[], x: T) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);

export const useTriage = create<TriageState>()(
  persist(
    (set) => ({
      ...empty,
      tempUnit: 'F',
      setField: (k, v) => set((s) => ({ fields: { ...s.fields, [k]: v }, updatedAt: Date.now() })),
      setTempUnit: (tempUnit) => set({ tempUnit }),
      toggleOxygen: () => set((s) => ({ onOxygen: !s.onOxygen })),
      toggleItem: (id) => set((s) => ({ ticked: toggle(s.ticked, id) })),
      togglePriorityRed: () => set((s) => ({ priorityRed: !s.priorityRed })),
      clear: () => set(empty),
    }),
    { name: 'ed-triage', version: 2, storage: safeStorage },
  ),
);

/** Vitals (temperature in °F) from the store's raw fields. */
export function vitalsFrom(s: Pick<TriageState, 'fields' | 'tempUnit' | 'onOxygen'>): Vitals {
  const f = s.fields;
  const t = num(f.temp);
  return {
    rr: num(f.rr),
    spo2: num(f.spo2),
    onOxygen: s.onOxygen,
    hr: num(f.hr),
    sbp: num(f.sbp),
    dbp: num(f.dbp),
    gcs: num(f.gcs),
    tempF: t === undefined ? undefined : s.tempUnit === 'C' ? cToF(t) : t,
    rbs: num(f.rbs),
  };
}

export function triageOf(s: Pick<TriageState, 'fields' | 'tempUnit' | 'onOxygen' | 'ticked' | 'priorityRed'>): TriageResult {
  const ticked: Partial<Record<Zone, string[]>> = {};
  for (const l of LISTS) {
    for (const i of l.items) if (s.ticked.includes(i.id)) (ticked[l.zone] ??= []).push(i.text);
  }
  return triage({ vitals: vitalsFrom(s), ticked, priorityRed: s.priorityRed });
}

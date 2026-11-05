import { bedsideTopics } from '../data/bedside/index.ts';
import type { BedsideTopic, BookRef, PointGroup } from '../data/bedsideTypes.ts';

export { bedsideTopics };

export type BedsideStep = 'history' | 'exam' | 'ddx' | 'plan';

export const BEDSIDE_STEPS: BedsideStep[] = ['history', 'exam', 'ddx', 'plan'];

export const STEP_LABEL: Record<BedsideStep, string> = {
  history: 'History',
  exam: 'Exam',
  ddx: 'Differentials',
  plan: 'Plan',
};

export const BOOK = 'Talley & O’Connor, Clinical Examination, 8th edition (Elsevier 2018)';

export function topicById(id: string | undefined): BedsideTopic | undefined {
  return bedsideTopics.find((t) => t.id === id);
}

/** Bedside topics for a flowchart label, e.g. "6.2". */
export function topicsFor(sheetLabel: string): BedsideTopic[] {
  return bedsideTopics.filter((t) => t.flowcharts.includes(sheetLabel));
}

export function groupsOf(t: BedsideTopic, step: Exclude<BedsideStep, 'ddx'>): PointGroup[] {
  return t[step];
}

/** Tick id for a point: positional, like the protocol checklists. */
export function pointId(t: BedsideTopic, step: BedsideStep, group: number, point: number): string {
  return `bs-${t.id}.${step}.${group}.${point}`;
}

/** Every tickable point of a step (differentials are read, not ticked). */
export function pointIds(t: BedsideTopic, step: BedsideStep): string[] {
  if (step === 'ddx') return [];
  return groupsOf(t, step).flatMap((g, gi) => g.points.map((_, pi) => pointId(t, step, gi, pi)));
}

export function refText(r: BookRef): string {
  return `Ch ${r.chapter}${r.label ? `, ${r.label}` : ''}, p ${r.pages}`;
}

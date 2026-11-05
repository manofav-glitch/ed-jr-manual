import { describe, expect, it } from 'vitest';
import type { BookRef } from '../../src/data/bedsideTypes.ts';
import { BEDSIDE_STEPS, bedsideTopics, pointIds, topicById, topicsFor } from '../../src/lib/bedside.ts';
import { flowchartByLabel } from '../../src/lib/flowcharts.ts';
import { textFor } from '../../src/lib/manual.ts';
import { buildDocs, createSearch } from '../../src/lib/search.ts';
import { flowcharts } from '../../src/lib/flowcharts.ts';

// First printed page of each chapter of Talley & O'Connor, Clinical Examination, 8th edition
// (from its contents pages). A chapter ends where the next begins.
const CHAPTER_START = [
  0, 3, 22, 37, 59, 74, 109, 119, 145, 163, 174, 190, 201, 217, 229, 272, 282, 297, 306, 317, 329, 335, 348, 363, 370,
  408, 428, 439, 444, 463, 480, 489, 500, 540, 548, 580, 606, 619, 684, 729, 743, 763, 771, 799, 826, 834, 845, 867,
  873, 875, 881, 886, 893,
];

function pagesOf(r: BookRef): number[] {
  return r.pages.split(',').flatMap((part) => {
    const [a, b] = part.trim().split('–').map(Number);
    return b === undefined ? [a!] : [a!, b];
  });
}

const allRefs = bedsideTopics.flatMap((t) => [
  ...[...t.history, ...t.exam, ...t.plan].flatMap((g) => g.refs.map((r) => ({ t: t.id, where: g.heading, r }))),
  ...t.differentials.flatMap((g) => g.items.flatMap((d) => d.refs.map((r) => ({ t: t.id, where: d.name, r })))),
]);

describe('bedside checklists', () => {
  it('cover batches 1–4 (heart and lungs, gut, kidney and urine, nervous system)', () => {
    const labels = (ids: string[]) => bedsideTopics.filter((t) => ids.includes(t.id)).flatMap((t) => t.flowcharts).sort();
    expect(labels(['chest-pain', 'breathlessness', 'syncope', 'haemoptysis', 'fever-cough-breathless', 'hypertension'])).toEqual([
      '1.3', '13.3', '13.5', '18.2', '6.1', '6.2', '7.3',
    ]);
    expect(
      labels(['haematemesis', 'rectal-bleeding', 'vomiting', 'diarrhoea', 'abdominal-pain', 'constipation', 'bloating', 'loss-of-appetite', 'dysphagia', 'fever-jaundice']),
    ).toEqual(['1.4', '1.8', '13.4', '14.4', '2.1', '2.2', '3.1', '3.3', '3.4', '3.5', '3.6']);
    expect(
      labels(['haematuria', 'urinary-retention', 'low-urine-output', 'flank-pain', 'perineal-pain', 'scrotal-swelling', 'burning-micturition']),
    ).toEqual(['1.2', '16.1', '16.2', '16.3', '16.4', '16.5', '16.6', '3.2']);
    expect(
      labels(['drowsy-alcohol', 'unconscious', 'seizure', 'dizziness', 'generalised-weakness', 'headache', 'numbness-tingling', 'leg-weakness', 'stroke', 'fever-headache']),
    ).toEqual(['13.6', '4.1', '4.2', '5.1', '7.1', '7.2', '8.0', '8.1', '8.2', '8.3']);
    expect(bedsideTopics).toHaveLength(33);
  });

  it('point at real flowcharts, once each, with unique ids', () => {
    const labels = bedsideTopics.flatMap((t) => t.flowcharts);
    expect(new Set(labels).size).toBe(labels.length);
    for (const l of labels) expect(flowchartByLabel(l), l).toBeDefined();
    expect(new Set(bedsideTopics.map((t) => t.id)).size).toBe(bedsideTopics.length);
    expect(topicsFor('6.2').map((t) => t.id)).toEqual(['chest-pain']);
    expect(topicById('fever-cough-breathless')?.flowcharts).toEqual(['13.3', '13.5']);
  });

  it('have every step filled in', () => {
    for (const t of bedsideTopics) {
      expect(t.history.length, t.id).toBeGreaterThan(0);
      expect(t.exam.length, t.id).toBeGreaterThan(0);
      expect(t.differentials.flatMap((g) => g.items).length, t.id).toBeGreaterThan(0);
      expect(t.plan.length, t.id).toBeGreaterThan(0);
      for (const g of [...t.history, ...t.exam, ...t.plan]) expect(g.points.length, `${t.id} ${g.heading}`).toBeGreaterThan(0);
    }
  });

  it('cite the book for every group and every differential, except those marked "not in the book"', () => {
    for (const t of bedsideTopics) {
      for (const g of [...t.history, ...t.exam, ...t.plan]) expect(g.refs.length, `${t.id} ${g.heading}`).toBeGreaterThan(0);
      for (const d of t.differentials.flatMap((g) => g.items)) {
        if (d.extra) expect(d.refs, `${t.id} ${d.name}`).toEqual([]);
        else expect(d.refs.length, `${t.id} ${d.name}`).toBeGreaterThan(0);
      }
    }
  });

  it('give page numbers that are inside the cited chapter', () => {
    expect(allRefs.length).toBeGreaterThan(100);
    for (const { t, where, r } of allRefs) {
      const first = CHAPTER_START[r.chapter];
      const next = CHAPTER_START[r.chapter + 1];
      expect(first, `${t} ${where}: chapter ${r.chapter}`).toBeDefined();
      for (const p of pagesOf(r)) {
        expect(Number.isInteger(p), `${t} ${where}: "${r.pages}"`).toBe(true);
        expect(p, `${t} ${where}: ch ${r.chapter} p ${r.pages}`).toBeGreaterThanOrEqual(first!);
        expect(p, `${t} ${where}: ch ${r.chapter} p ${r.pages}`).toBeLessThan(next!);
      }
    }
  });

  it('name boxes and tables with the chapter they are in', () => {
    for (const { t, where, r } of allRefs) {
      for (const n of r.label?.match(/\b\d+\.\d+/g) ?? []) {
        expect(Number(n.split('.')[0]), `${t} ${where}: ${r.label} in ch ${r.chapter}`).toBe(r.chapter);
      }
    }
  });

  it('mention a hospital checklist in the plan only when one is linked', () => {
    for (const t of bedsideTopics) {
      const last = t.plan.at(-1)!.points.at(-1)!.text;
      expect(last, t.id).toMatch(/^Then follow the hospital’s .* below$/);
      expect(/checklist/.test(last), t.id).toBe(t.flowcharts.flatMap(textFor).length > 0);
    }
  });

  it('give each tickable point its own id, and none to differentials', () => {
    const ids = bedsideTopics.flatMap((t) => BEDSIDE_STEPS.flatMap((s) => pointIds(t, s)));
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of bedsideTopics) expect(pointIds(t, 'ddx')).toEqual([]);
  });

  it('are found by search', () => {
    const search = createSearch(buildDocs(flowcharts, [], bedsideTopics));
    const hit = search('Kussmaul')[0];
    expect(hit?.doc.source).toBe('bedside');
    expect(hit?.doc.url).toMatch(/^\/b\/[a-z-]+\/(history|exam|plan)$/);
    expect(search('Aortic dissection').some((h) => h.doc.url === '/b/chest-pain/ddx')).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import { reviewNotes } from '../../src/data/reviewNotes.ts';
import { SHEET_TEXT } from '../../src/data/sheetLinks.ts';
import type { Block } from '../../src/data/types.ts';
import { findAnchor } from '../../src/lib/anchors.ts';
import { allFlowcharts, flowchartByLabel, flowcharts } from '../../src/lib/flowcharts.ts';
import { items } from '../../src/lib/items.ts';
import { chapterById, checkItems, isLeaf, linkedChapters, manual, sheetLabelsFor, tabsFor, textFor, urlFor } from '../../src/lib/manual.ts';
import { buildDocs, createSearch } from '../../src/lib/search.ts';

const ch = (id: string) => chapterById(id)!;

describe('flowchart ↔ checklist links', () => {
  it('every linked number exists on both sides', () => {
    for (const [sheet, texts] of Object.entries(SHEET_TEXT)) {
      expect(flowchartByLabel(sheet), sheet).toBeDefined();
      for (const t of texts) expect(textFor(sheet).map((c) => c.label), `${sheet} → ${t}`).toContain(t);
    }
  });

  it('links 40 flowcharts to 30 checklists', () => {
    expect(Object.keys(SHEET_TEXT)).toHaveLength(40);
    expect(linkedChapters).toHaveLength(30);
  });

  it('works both ways', () => {
    expect(textFor('6.2').map((c) => c.label)).toEqual(['2.1']);
    expect(sheetLabelsFor(ch('hp7-3'))).toEqual(['13.1', '13.2', '13.3', '13.4', '13.5', '13.6']);
    expect(textFor('1.3')).toEqual([]);
  });
});

describe('stepper', () => {
  it('shows History → Exam → Tests → Red flags → Manage → Reference', () => {
    expect(tabsFor(ch('hp2-1'))).toEqual(['history', 'exam', 'tests', 'redflags', 'management', 'reference']);
    expect(tabsFor(ch('hp3-3'))).toEqual(['history', 'exam', 'tests', 'redflags', 'management']);
    expect(tabsFor(ch('hp9-4'))).toEqual(['reference']);
  });

  it('ticks only points without sub-points', () => {
    const history = checkItems(ch('hp2-1'), 'history');
    expect(history.length).toBeGreaterThan(0);
    expect(history.every(isLeaf)).toBe(true);
  });

  it('has nothing to tick in Red flags or Reference', () => {
    expect(checkItems(ch('hp2-1'), 'redflags')).toEqual([]);
    expect(checkItems(ch('hp2-1'), 'reference')).toEqual([]);
  });

  it('gives every element a unique id', () => {
    const ids: string[] = [];
    const walk = (bs: Block[]) =>
      bs.forEach((b) => {
        if (b.type === 'list') b.items.forEach((i) => (ids.push(i.id), walk(i.children)));
        else {
          ids.push(b.id);
          if (b.type === 'callout') walk(b.blocks);
        }
      });
    manual.parts.forEach((p) => walk(p.intro));
    for (const c of manual.chapters)
      for (const s of c.sections) {
        ids.push(s.id);
        for (const sub of s.subsections) {
          ids.push(sub.id);
          walk(sub.blocks);
        }
      }
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('search', () => {
  const docs = buildDocs(flowcharts, linkedChapters);
  const search = createSearch(docs);

  it('indexes every flowchart and every line of the linked checklists, nothing else', () => {
    expect(docs.filter((d) => d.source === 'flowchart')).toHaveLength(allFlowcharts.length);
    const ids = new Set(docs.map((d) => d.id));
    for (const c of linkedChapters) for (const s of c.sections) for (const sub of s.subsections) for (const i of items(sub.blocks)) expect(ids.has(i.id)).toBe(true);
    expect(ids.has('hp8-1')).toBe(false); // anaphylaxis has no flowchart, so it is not shown
  });

  it('finds a flowchart by title', () => {
    expect(search('epistaxis')[0]!.doc.url).toBe('/f/fc1-6');
  });

  it('jumps to the exact checklist tab and line', () => {
    const hit = search('Hamman').find((h) => h.doc.source === 'checklist')!;
    expect(hit.doc.url).toMatch(/^\/p\/hp2-1\/[a-z]+\?focus=/);
  });

  it('tolerates a typo and ignores one-letter queries', () => {
    expect(search('haematemsis').length).toBeGreaterThan(0);
    expect(search('a')).toEqual([]);
  });
});

describe('links and notes', () => {
  it('urlFor opens the right tab for a nested id', () => {
    expect(urlFor('hp2-1-tests.0.0')).toBe('/p/hp2-1/tests?focus=hp2-1-tests.0.0');
    expect(urlFor('nonsense')).toBe('/');
  });

  it.each(reviewNotes.flatMap((n) => n.anchors.map((a) => [n.id, a.chapter, a.match] as const)))(
    'review note %s: %s "%s" is found in exactly one place',
    (_id, chapter, match) => {
      expect(findAnchor(manual, { chapter, match })).toHaveLength(1);
    },
  );
});

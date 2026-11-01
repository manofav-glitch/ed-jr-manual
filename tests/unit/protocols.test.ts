import { describe, expect, it } from 'vitest';
import { items } from '../../src/lib/items.ts';
import { checkItems, isLeaf, manual, shortTitle, tabsFor, urlFor } from '../../src/lib/manual.ts';
import { buildDocs, createSearch, hitUrl } from '../../src/lib/search.ts';
import type { Block } from '../../src/data/types.ts';

const ch = (n: number) => manual.chapters[n - 1]!;

describe('stepper', () => {
  it('shows the steps in History → Exam → Tests → Red flags → Manage → Reference order', () => {
    expect(tabsFor(ch(3))).toEqual(['history', 'exam', 'tests', 'redflags', 'management', 'reference']);
    // Fever's red flags come last in the manual but still sit in their usual step.
    expect(tabsFor(ch(11))).toEqual(['history', 'exam', 'tests', 'redflags', 'management', 'reference']);
    expect(tabsFor(ch(8))).toEqual(['history', 'exam', 'tests', 'redflags', 'management']);
    expect(tabsFor(ch(1))).toEqual(['reference']);
  });

  it('ticks only points without sub-points', () => {
    const history = checkItems(ch(4), 'history');
    expect(history.every(isLeaf)).toBe(true);
    // "Typical symptoms — FAST" is a heading for F, A, S, T.
    expect(history.map((i) => i.text)).not.toContain('Typical symptoms — FAST');
    expect(history.map((i) => i.text)).toContain('Time to call SR Neurology');
  });

  it('has nothing to tick in Red flags or Reference', () => {
    expect(checkItems(ch(3), 'redflags')).toEqual([]);
    expect(checkItems(ch(3), 'reference')).toEqual([]);
  });

  it('counts chest pain steps as in the manual', () => {
    expect([checkItems(ch(3), 'history'), checkItems(ch(3), 'exam'), checkItems(ch(3), 'tests')].map((l) => l.length)).toEqual([
      10, 6, 7,
    ]);
  });

  it('shortens titles from the contents list', () => {
    expect(shortTitle(ch(3))).toBe('Chest pain');
    expect(shortTitle(ch(11))).toBe('Fever');
    expect(shortTitle(ch(13))).toBe('Unresponsive patient');
    expect(shortTitle(ch(14))).toBe('Chronic liver disease');
    expect(shortTitle(ch(17))).toBe('Drugs for hyperkalaemia');
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
    walk(manual.front);
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
  const search = createSearch(buildDocs(manual));

  it('indexes every item in the manual', () => {
    const docIds = new Set(buildDocs(manual).map((d) => d.id));
    const all = manual.chapters.flatMap((c) => c.sections.flatMap((s) => s.subsections.flatMap((sub) => items(sub.blocks))));
    expect(all.every((i) => docIds.has(i.id))).toBe(true);
  });

  it('jumps to the exact chapter, tab and item', () => {
    const hit = search('Troponin I')[0]!;
    expect(hit.doc.text).toBe('Troponin I*');
    expect(hitUrl(manual, hit.doc)).toBe(`/p/ch3/tests?focus=${encodeURIComponent(hit.doc.id)}`);
  });

  it('finds text inside reference subsections and opens them', () => {
    const hit = search('Hamman')[0]!;
    expect(hit.doc.chapterNumber).toBe(3);
    expect(hit.doc.tab).toBe('reference');
    expect(hit.doc.where).toBe('Quick guide to important ED differentials of chest pain › Boerhaave Syndrome');
  });

  it('finds table rows', () => {
    const hit = search('Methylene blue')[0]!;
    expect(hit.doc.chapterNumber).toBe(12);
    expect(hit.doc.text).toContain('Oxidizing toxins');
  });

  it('tolerates a typo', () => {
    expect(search('adrenalin').some((h) => h.doc.chapterNumber === 13)).toBe(true);
    expect(search('hyperkalemia').some((h) => h.doc.chapterNumber === 17)).toBe(true);
  });

  it('links chapters without tabs straight to the chapter', () => {
    const hit = search('Mature interactions')[0]!;
    expect(hitUrl(manual, hit.doc)).toMatch(/^\/p\/ch1\?focus=/);
  });

  it('ignores one-letter queries', () => {
    expect(search('a')).toEqual([]);
  });
});

describe('urlFor', () => {
  it('opens the right tab for a nested id', () => {
    expect(urlFor(manual, 'ch4-reference.3.4')).toBe('/p/ch4/reference?focus=ch4-reference.3.4');
    expect(urlFor(manual, 'nonsense')).toBe('/');
  });
});

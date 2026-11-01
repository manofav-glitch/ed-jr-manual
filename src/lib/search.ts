import Fuse, { type FuseResultMatch } from 'fuse.js';
import type { Block, Manual, SectionKind } from '../data/types.ts';
import { plain } from './inline.ts';
import { tabsFor, urlFor } from './manual.ts';

export interface SearchDoc {
  /** Element id to scroll to. */
  id: string;
  chapterId: string;
  chapterNumber: number;
  tab: SectionKind;
  /** Section / subsection heading the text sits under, for context. */
  where: string;
  text: string;
}

export interface SearchHit {
  doc: SearchDoc;
  /** [start, end] character ranges of the match in doc.text. */
  ranges: [number, number][];
}

export function buildDocs(m: Manual): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const ch of m.chapters) {
    const firstTab = tabsFor(ch)[0] ?? 'reference';
    docs.push({ id: ch.id, chapterId: ch.id, chapterNumber: ch.number, tab: firstTab, where: '', text: ch.title });
    for (const s of ch.sections) {
      const add = (id: string, text: string, where: string) =>
        docs.push({ id, chapterId: ch.id, chapterNumber: ch.number, tab: s.kind, where, text });
      if (s.headingText) add(s.id, s.headingText, '');
      for (const sub of s.subsections) {
        const where = [s.headingText, sub.headingText].filter(Boolean).join(' › ');
        if (sub.headingText) add(sub.id, sub.headingText, s.headingText ?? '');
        walk(sub.blocks, (id, text) => add(id, text, where));
      }
    }
  }
  return docs;
}

function walk(bs: Block[], add: (id: string, text: string) => void) {
  for (const b of bs) {
    switch (b.type) {
      case 'list':
        for (const it of b.items) {
          add(it.id, it.text);
          walk(it.children, add);
        }
        break;
      case 'paragraph':
      case 'subhead':
        add(b.id, b.text);
        break;
      case 'callout':
        walk(b.blocks, add);
        break;
      case 'table':
        for (const row of b.rows) add(b.id, row.map(plain).filter(Boolean).join(' · '));
        break;
    }
  }
}

export function createSearch(docs: SearchDoc[]) {
  const fuse = new Fuse(docs, {
    keys: ['text'],
    includeMatches: true,
    ignoreLocation: true,
    threshold: 0.3,
    minMatchCharLength: 2,
  });

  return (query: string, limit = 60): SearchHit[] => {
    const q = query.trim();
    if (q.length < 2) return [];
    const lower = q.toLowerCase();

    // Exact substring matches first, in manual order; then fuzzy ones (typos, partial words).
    const exact: SearchHit[] = docs
      .filter((d) => d.text.toLowerCase().includes(lower))
      .map((d) => {
        const at = d.text.toLowerCase().indexOf(lower);
        return { doc: d, ranges: [[at, at + q.length - 1]] };
      });
    const seen = new Set(exact.map((h) => h.doc));
    const fuzzy: SearchHit[] = fuse
      .search(q, { limit })
      .filter((r) => !seen.has(r.item))
      .map((r) => ({ doc: r.item, ranges: rangesOf(r.matches) }));
    return [...exact, ...fuzzy].slice(0, limit);
  };
}

function rangesOf(matches: readonly FuseResultMatch[] | undefined): [number, number][] {
  return (matches?.[0]?.indices ?? []).filter(([a, b]) => b - a >= 1).map(([a, b]) => [a, b]);
}

export function hitUrl(m: Manual, doc: SearchDoc): string {
  return doc.id === doc.chapterId ? `/p/${doc.chapterId}` : urlFor(m, doc.id);
}

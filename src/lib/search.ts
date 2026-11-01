import Fuse, { type FuseResultMatch } from 'fuse.js';
import type { Block } from '../data/types.ts';
import type { Flowcharts } from '../data/flowchartTypes.ts';
import { plain } from './inline.ts';
import { SOURCES, TAB_LABEL, isIntro, shortTitle, tabsFor, type SourceId } from './manual.ts';

export interface SearchDoc {
  /** Element (or chapter / flowchart) id. */
  id: string;
  url: string;
  source: SourceId | 'flowcharts';
  /** "3. Chest pain › Tests › Point-of-care investigations" */
  where: string;
  text: string;
}

export interface SearchHit {
  doc: SearchDoc;
  /** [start, end] character ranges of the match in doc.text. */
  ranges: [number, number][];
}

export const SOURCE_LABEL: Record<SearchDoc['source'], string> = {
  aiims: 'AIIMS',
  hospital: 'Hospital',
  flowcharts: 'Flowchart',
};

export function buildDocs(fc?: Flowcharts): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const { id: source, manual } of SOURCES) {
    for (const ch of manual.chapters) {
      const name = `${ch.label ? `${ch.label}${source === 'aiims' ? '.' : ''} ` : ''}${shortTitle(ch)}`;
      const tabs = tabsFor(ch);
      const stepper = tabs.length > 1;
      docs.push({ id: ch.id, url: `/p/${ch.id}`, source, where: '', text: ch.title });
      for (const s of ch.sections) {
        // Same link urlFor() would give, worked out once per section.
        const kind = stepper && isIntro(s) ? tabs[0]! : s.kind;
        const base = `/p/${ch.id}${stepper ? `/${kind}` : ''}?focus=`;
        const tab = stepper ? ` › ${TAB_LABEL[kind]}` : '';
        const add = (id: string, text: string, under: (string | null)[]) =>
          docs.push({ id, url: base + encodeURIComponent(id), source, where: [`${name}${tab}`, ...under].filter(Boolean).join(' › '), text });
        if (s.headingText) add(s.id, s.headingText, []);
        for (const sub of s.subsections) {
          if (sub.headingText) add(sub.id, sub.headingText, [s.headingText]);
          walk(sub.blocks, (id, text) => add(id, text, [s.headingText, sub.headingText]));
        }
      }
    }
  }
  for (const part of fc?.parts ?? []) {
    for (const f of part.items) {
      docs.push({ id: f.id, url: `/f/${f.id}`, source: 'flowcharts', where: `${part.label} ${part.title}`, text: `${f.label} ${f.title}` });
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

  return (query: string, limit = 80): SearchHit[] => {
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

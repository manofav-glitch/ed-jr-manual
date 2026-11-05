// Pull exact manual text into the tools, so labels and advice are never retyped.

import type { Block, Inline, Item, Manual } from '../data/types.ts';
import { findAnchor, type Anchor } from './anchors.ts';

export interface Quote {
  id: string;
  inline: Inline[];
  text: string;
  chapter: string;
}

/** The one item, paragraph or sub-heading matching the anchor. Throws if it is missing or ambiguous. */
export function quote(m: Manual, a: Anchor): Quote {
  const ids = findAnchor(m, a);
  if (ids.length !== 1) throw new Error(`${a.chapter}: "${a.match}" found ${ids.length} times, expected 1`);
  const node = byId(m, ids[0]!);
  if (!node) throw new Error(`${a.chapter}: "${a.match}" is a heading, not quotable text`);
  return { id: ids[0]!, inline: node.inline, text: node.text, chapter: a.chapter };
}

/**
 * Items of the first list that follows the paragraph / sub-heading `heading` (an exact match is
 * preferred, so "H" finds the "H" sub-heading, not the first line starting with H).
 */
export function listAfter(m: Manual, chapter: string, heading: string): Item[] {
  const ch = m.chapters.find((c) => c.id === chapter);
  for (const exact of [true, false]) {
    for (const s of ch?.sections ?? []) {
      for (const sub of s.subsections) {
        const at = sub.blocks.findIndex(
          (b) => (b.type === 'subhead' || b.type === 'paragraph') && (exact ? b.text === heading : b.text.startsWith(heading)),
        );
        if (at === -1) continue;
        const list = sub.blocks.slice(at + 1).find((b) => b.type === 'list');
        if (list?.type === 'list') return list.items;
      }
    }
  }
  throw new Error(`${chapter}: no list after "${heading}"`);
}

/** Items of the first list in the #### sub-section whose heading starts with `heading`. */
export function listIn(m: Manual, chapter: string, heading: string): Item[] {
  const ch = m.chapters.find((c) => c.id === chapter);
  for (const s of ch?.sections ?? []) {
    for (const sub of s.subsections) {
      if (!sub.headingText?.startsWith(heading)) continue;
      const list = sub.blocks.find((b) => b.type === 'list');
      if (list?.type === 'list') return list.items;
    }
  }
  throw new Error(`${chapter}: no list in "${heading}"`);
}

/** Text of the table row whose first cell starts with `rowStart` (e.g. "A — Airway"). */
export function tableRow(m: Manual, chapter: string, rowStart: string): string {
  const ch = m.chapters.find((c) => c.id === chapter);
  for (const b of allBlocks(ch?.sections.flatMap((s) => s.subsections.flatMap((x) => x.blocks)) ?? [])) {
    if (b.type !== 'table') continue;
    for (const row of b.rows) {
      const cells = row.map(plainText);
      if (cells[0]?.startsWith(rowStart)) return cells.slice(1).join(' ');
    }
  }
  throw new Error(`${chapter}: no table row "${rowStart}"`);
}

function plainText(runs: Inline[]): string {
  return runs.map((r) => ('v' in r ? r.v : plainText(r.c))).join('');
}

function allBlocks(bs: Block[]): Block[] {
  return bs.flatMap((b) =>
    b.type === 'list' ? [b, ...allBlocks(b.items.flatMap((i) => i.children))] : b.type === 'callout' ? [b, ...allBlocks(b.blocks)] : [b],
  );
}

function byId(m: Manual, id: string): { inline: Inline[]; text: string } | undefined {
  for (const ch of m.chapters)
    for (const s of ch.sections)
      for (const sub of s.subsections) {
        for (const b of allBlocks(sub.blocks)) {
          if (b.type === 'list') {
            const it = b.items.find((i) => i.id === id);
            if (it) return it;
          } else if ((b.type === 'paragraph' || b.type === 'subhead') && b.id === id) return b;
        }
      }
  return undefined;
}

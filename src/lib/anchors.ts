import type { Block, Chapter, Manual } from '../data/types.ts';

/**
 * Points at a place in the manual by text rather than by id, so it keeps working when the
 * manual is re-parsed. `match` must be an exact substring of exactly one item, paragraph,
 * bold sub-heading or heading in that chapter (tests/unit/notes.test.ts checks this).
 */
export interface Anchor {
  chapter: number;
  match: string;
}

/** Ids of every place in the chapter whose text contains `match`. */
export function findAnchor(manual: Manual, a: Anchor): string[] {
  const ch = manual.chapters.find((c) => c.number === a.chapter);
  if (!ch) return [];
  return textsOf(ch)
    .filter((t) => t.text.includes(a.match))
    .map((t) => t.id);
}

/** Map from element id to the notes anchored there. Anchors that don't resolve to one place are skipped. */
export function indexNotes<N extends { anchors: Anchor[] }>(manual: Manual, notes: N[]): Map<string, N[]> {
  const out = new Map<string, N[]>();
  for (const note of notes) {
    for (const a of note.anchors) {
      const ids = findAnchor(manual, a);
      if (ids.length !== 1) continue;
      const list = out.get(ids[0]!) ?? [];
      list.push(note);
      out.set(ids[0]!, list);
    }
  }
  return out;
}

export function textsOf(ch: Chapter): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = [];
  for (const s of ch.sections) {
    if (s.headingText) out.push({ id: s.id, text: s.headingText });
    for (const sub of s.subsections) {
      if (sub.headingText) out.push({ id: sub.id, text: sub.headingText });
      walk(sub.blocks, out);
    }
  }
  return out;
}

function walk(bs: Block[], out: { id: string; text: string }[]) {
  for (const b of bs) {
    if (b.type === 'list') {
      for (const it of b.items) {
        out.push({ id: it.id, text: it.text });
        walk(it.children, out);
      }
    } else if (b.type === 'paragraph' || b.type === 'subhead') {
      out.push({ id: b.id, text: b.text });
    } else if (b.type === 'callout') {
      walk(b.blocks, out);
    }
  }
}

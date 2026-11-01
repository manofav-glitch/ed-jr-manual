import type { Block, Item } from '../data/types.ts';

/** Every list item under these blocks, depth-first in reading order. */
export function items(bs: Block[]): Item[] {
  const out: Item[] = [];
  for (const b of bs) {
    if (b.type === 'list') {
      for (const it of b.items) out.push(it, ...items(it.children));
    } else if (b.type === 'callout') {
      out.push(...items(b.blocks));
    }
  }
  return out;
}

// Text walkers for the "no text lost, added or reordered" check.

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Nodes, RootContent } from 'mdast';
import { plain } from '../../scripts/parse-manual.ts';
import type { Block, Manual } from '../../src/data/types.ts';

/** All text of the markdown in reading order. */
export function textOfMarkdown(source: string): string[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(source);
  const out: string[] = [];
  const walk = (node: Nodes) => {
    if (node.type === 'text' || node.type === 'inlineCode') out.push(node.value);
    // A list item starting with ">" means "more than" (see the parser).
    if (node.type === 'listItem' && node.children[0]?.type === 'blockquote') out.push('>');
    if ('children' in node) (node.children as Nodes[]).forEach(walk);
  };
  for (const node of tree.children as RootContent[]) walk(node);
  return out;
}

/** All text of a parsed manual in the order the markdown had it. */
export function textOfManual(m: Manual): string[] {
  const out = [m.title, ...textOfBlocks(m.front)];
  for (const ch of m.chapters) {
    if (ch.partTitle) {
      out.push(ch.partTitle);
      out.push(...textOfBlocks(m.parts?.find((p) => p.title === ch.partTitle)?.intro ?? []));
    }
    out.push(ch.label ? `${ch.label} ${ch.title}` : ch.title);
    for (const s of ch.sections) {
      if (s.headingText) out.push(s.headingText);
      for (const sub of s.subsections) {
        if (sub.headingText) out.push(sub.headingText);
        out.push(...textOfBlocks(sub.blocks));
      }
    }
  }
  return out;
}

export function textOfBlocks(bs: Block[]): string[] {
  return bs.flatMap((b): string[] => {
    switch (b.type) {
      case 'paragraph':
      case 'subhead':
        return [b.text];
      case 'list':
        return b.items.flatMap((i) => [i.text, ...textOfBlocks(i.children)]);
      case 'callout':
        return textOfBlocks(b.blocks);
      case 'table':
        return [...b.header, ...b.rows.flat()].map(plain);
    }
  });
}

export const squash = (parts: string[]) => parts.join('').replace(/\s+/g, '');

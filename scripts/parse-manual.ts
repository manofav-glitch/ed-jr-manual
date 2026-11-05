// Converts content/hospital.md (made by scripts/import-hospital.ts) into src/data/hospital.json,
// the only text the app reads.
//
//   npm run parse            regenerate the JSON
//   npm run parse -- --check exit 1 if the committed JSON is out of date
//
// The text is carried over exactly: inline emphasis is kept as runs, nothing is reworded.
// Structure comes from the headings: "# 1.0 Part", "## 1.1 Protocol" (a chapter), "###" a section
// (tagged with a kind from its heading), "####" a subsection.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Blockquote, List, ListItem, PhrasingContent, RootContent, Table } from 'mdast';
import type { Block, Chapter, Inline, Item, Manual, Section, SectionKind, Subsection } from '../src/data/types.ts';
import { items } from '../src/lib/items.ts';
import { plain } from '../src/lib/inline.ts';

export { items, plain };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const HOSPITAL_PATH = join(ROOT, 'content/hospital.md');
export const HOSPITAL_OUTPUT_PATH = join(ROOT, 'src/data/hospital.json');

const REQUIRED_KINDS: SectionKind[] = ['history', 'exam', 'tests', 'redflags', 'management'];

/** Every protocol table has these column headings, then a RED FLAG row. Anything else is reference. */
const KIND_RULES: [RegExp, SectionKind][] = [
  [/^Salient history to be taken$/, 'history'],
  [/^Salient clinical examination$/, 'exam'],
  [/^Point-of-care investigations$/, 'tests'],
  [/^RED FLAG SIGNS/, 'redflags'],
  [/^Basic initial management$/, 'management'],
];

export interface ParseResult {
  manual: Manual;
  warnings: string[];
}

export function parseManual(md: string): ParseResult {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(md);
  const warnings: string[] = [];

  let title = '';
  const front: Block[] = [];
  const chapters: Chapter[] = [];
  const parts: Manual['parts'] = [];

  let mode: 'front' | 'part' | 'body' = 'front';
  let pendingPart: string | undefined;
  let currentPart: string | undefined;
  let chapter: Chapter | undefined;
  let section: Section | undefined;
  let subsection: Subsection | undefined;

  const newSection = (heading: Inline[] | null, line: number): Section => {
    if (!chapter) throw new Error(`Line ${line}: section outside a chapter`);
    const s: Section = { id: '', kind: 'reference', heading, headingText: heading && plain(heading), subsections: [], line };
    chapter.sections.push(s);
    subsection = undefined;
    return s;
  };
  const newSubsection = (heading: Inline[] | null, line: number): Subsection => {
    section ??= newSection(null, line);
    const sub: Subsection = { id: '', heading, headingText: heading && plain(heading), blocks: [], line };
    section.subsections.push(sub);
    return sub;
  };

  for (const node of tree.children) {
    const line = node.position?.start.line ?? 0;

    if (node.type === 'thematicBreak') continue;

    // "# Title" first; later "# 1.0 Trauma" opens a part, whose text up to the next "##" is its introduction.
    if (node.type === 'heading' && node.depth === 1) {
      const text = plain(inline(node.children));
      if (!title) title = text;
      else {
        pendingPart = currentPart = text;
        parts.push({ title: text, intro: [] });
        mode = 'part';
      }
      continue;
    }

    if (mode === 'part' && node.type !== 'heading') {
      parts.at(-1)!.intro.push(...blocks([node]));
      continue;
    }

    // "## 1.1 Title" is a protocol in the current part; "## 10.0 Title" or "## Title" is a chapter on its own.
    if (node.type === 'heading' && node.depth === 2) {
      const text = plain(inline(node.children));
      const m = /^(\d+(?:\.\d+)*)\s+(.+)$/.exec(text);
      mode = 'body';
      const label = m?.[1] ?? '';
      const chTitle = m?.[2] ?? text;
      if (!/^\d+\.[1-9]\d*$/.test(label)) currentPart = undefined;
      chapter = {
        id: `hp${label ? label.replace(/\./g, '-') : `-${slug(chTitle)}`}`,
        number: chapters.length + 1,
        label,
        title: chTitle,
        ...(pendingPart ? { partTitle: pendingPart } : {}),
        ...(currentPart ? { part: currentPart } : {}),
        sections: [],
        line,
      };
      pendingPart = undefined;
      chapters.push(chapter);
      section = undefined;
      subsection = undefined;
      continue;
    }

    if (mode === 'front') {
      front.push(...blocks([node]));
      continue;
    }

    // Chapter body.
    if (node.type === 'heading' && node.depth === 3) {
      section = newSection(inline(node.children), line);
      continue;
    }
    if (node.type === 'heading' && node.depth === 4) {
      subsection = newSubsection(inline(node.children), line);
      continue;
    }
    if (node.type === 'heading') {
      throw new Error(`Line ${line}: heading level ${node.depth} is not supported inside a chapter`);
    }
    subsection ??= newSubsection(null, line);
    subsection.blocks.push(...blocks([node]));
  }

  // Finish: kinds and ids.
  for (const ch of chapters) {
    const kindCount = new Map<SectionKind, number>();
    for (const s of ch.sections) {
      s.kind = classify(s);
      const k = (kindCount.get(s.kind) ?? 0) + 1;
      kindCount.set(s.kind, k);
      s.id = `${ch.id}-${s.kind}${k > 1 ? `-${k}` : ''}`;
      s.subsections.forEach((sub, j) => {
        sub.id = `${s.id}.${j}`;
        assignIds(sub.blocks, sub.id);
      });
    }
    // A chapter with any part of the protocol table must have all of it, once.
    if (REQUIRED_KINDS.some((k) => kindCount.has(k))) {
      for (const kind of REQUIRED_KINDS) {
        const n = kindCount.get(kind) ?? 0;
        if (n !== 1) throw new Error(`${ch.label || ch.title} has ${n} "${kind}" sections, expected 1`);
      }
    }
  }

  if (new Set(chapters.map((c) => c.id)).size !== chapters.length) throw new Error('Two chapters have the same id');
  assignIds(front, 'front');
  parts.forEach((p, i) => assignIds(p.intro, `part${i + 1}`));

  return {
    manual: { title, parts, front, chapters, sourceHash: createHash('sha256').update(md).digest('hex') },
    warnings,
  };
}

function classify(s: Section): SectionKind {
  if (s.headingText === null) return 'reference';
  for (const [re, kind] of KIND_RULES) if (re.test(s.headingText)) return kind;
  return 'reference';
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Ids are positional, in reading order: items `<subsection>.<n>`, other blocks `<subsection>.b<n>`.
 * Sections never contain a ".", so ids cannot collide across levels.
 */
function assignIds(bs: Block[], prefix: string, counter = { item: 0, block: 0 }): void {
  for (const b of bs) {
    if (b.type === 'list') {
      for (const it of b.items) {
        it.id = `${prefix}.${counter.item++}`;
        assignIds(it.children, prefix, counter);
      }
    } else {
      b.id = `${prefix}.b${counter.block++}`;
      if (b.type === 'callout') assignIds(b.blocks, prefix, counter);
    }
  }
}

// ---------- mdast → content blocks ----------

function blocks(nodes: RootContent[]): Block[] {
  const out: Block[] = [];
  for (const node of nodes) {
    const line = node.position?.start.line ?? 0;
    switch (node.type) {
      case 'paragraph': {
        const runs = inline(node.children);
        const onlyBold = runs.length === 1 && runs[0]!.t === 'strong';
        out.push({ type: onlyBold ? 'subhead' : 'paragraph', id: '', inline: runs, text: plain(runs), line });
        break;
      }
      case 'list':
        out.push(list(node));
        break;
      case 'blockquote':
        out.push({ type: 'callout', id: '', blocks: blocks(node.children), line });
        break;
      case 'table':
        out.push(table(node));
        break;
      case 'thematicBreak':
        break;
      default:
        throw new Error(`Line ${line}: unsupported markdown block "${node.type}"`);
    }
  }
  return out;
}

function list(node: List): Block {
  const start = node.start ?? 1;
  return {
    type: 'list',
    ordered: !!node.ordered,
    items: node.children.map((li, i) => {
      const [first, ...rest] = li.children;
      return {
        id: '',
        ...(node.ordered ? { n: start + i } : {}),
        inline: itemInline(li),
        text: plain(itemInline(li)),
        children: blocks(first?.type === 'paragraph' || isGreaterThanItem(li) ? rest : li.children),
        line: li.position?.start.line ?? 0,
      } satisfies Item;
    }),
  };
}

/**
 * "- > 250 neutrophils/µL" means "more than 250", but markdown reads a list item that starts
 * with ">" as a quote and drops the symbol. Such an item is a one-paragraph quote; put the
 * ">" back as text.
 */
function isGreaterThanItem(li: ListItem): li is ListItem & { children: [Blockquote, ...ListItem['children']] } {
  const first = li.children[0];
  return first?.type === 'blockquote' && first.children.length === 1 && first.children[0]!.type === 'paragraph';
}

function itemInline(li: ListItem): Inline[] {
  const first = li.children[0];
  if (first?.type === 'paragraph') return inline(first.children);
  if (isGreaterThanItem(li)) {
    const p = li.children[0].children[0];
    if (p?.type === 'paragraph') return [{ t: 'text', v: '> ' }, ...inline(p.children)];
  }
  return [];
}

function table(node: Table): Block {
  const [head, ...body] = node.children;
  const cells = (row: typeof head) => (row ? row.children.map((cell) => inline(cell.children)) : []);
  return { type: 'table', id: '', header: cells(head), rows: body.map(cells), line: node.position?.start.line ?? 0 };
}

function inline(nodes: PhrasingContent[]): Inline[] {
  const out: Inline[] = [];
  for (const n of nodes) {
    switch (n.type) {
      case 'text': {
        const prev = out.at(-1);
        if (prev?.t === 'text') prev.v += n.value;
        else out.push({ t: 'text', v: n.value });
        break;
      }
      case 'strong':
        out.push({ t: 'strong', c: inline(n.children) });
        break;
      case 'emphasis':
        out.push({ t: 'em', c: inline(n.children) });
        break;
      case 'inlineCode':
        out.push({ t: 'code', v: n.value });
        break;
      case 'link':
        out.push({ t: 'link', href: n.url, c: inline(n.children) });
        break;
      case 'break':
        out.push({ t: 'text', v: '\n' });
        break;
      default:
        throw new Error(`Line ${n.position?.start.line}: unsupported inline markdown "${n.type}"`);
    }
  }
  return out;
}

// ---------- output ----------

export function serialise(manual: Manual): string {
  return `${JSON.stringify(manual, null, 1)}\n`;
}

// ---------- CLI ----------

if (import.meta.main) {
  const { manual, warnings } = parseManual(readFileSync(HOSPITAL_PATH, 'utf8'));
  const json = serialise(manual);
  for (const w of warnings) console.warn(`warning: ${w}`);

  if (process.argv.includes('--check')) {
    let current = '';
    try {
      current = readFileSync(HOSPITAL_OUTPUT_PATH, 'utf8');
    } catch {
      // missing counts as out of date
    }
    if (current !== json) {
      console.error('src/data/hospital.json is out of date: run `npm run parse` and commit it.');
      process.exit(1);
    }
    console.log('hospital.json is up to date.');
  } else {
    writeFileSync(HOSPITAL_OUTPUT_PATH, json);
    const secs = manual.chapters.flatMap((c) => c.sections);
    const its = secs.flatMap((s) => s.subsections.flatMap((sub) => items(sub.blocks)));
    console.log(`Parsed ${manual.chapters.length} chapters, ${secs.length} sections, ${its.length} items → src/data/hospital.json`);
  }
}

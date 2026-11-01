// Converts content/manual.md into src/data/manual.json, the only content source the app reads.
//
//   npm run parse            regenerate the JSON
//   npm run parse -- --check exit 1 if the committed JSON is out of date
//
// The text is carried over exactly: inline emphasis is kept as runs, nothing is reworded.
// Structure comes from the headings: "## N. Title" is a chapter, "###" a section (tagged with a
// kind from its heading), "####" a subsection.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Blockquote, List, ListItem, PhrasingContent, RootContent, Table } from 'mdast';
import type {
  Block,
  Chapter,
  ChapterGroup,
  Inline,
  Item,
  Manual,
  Section,
  SectionKind,
  Subsection,
} from '../src/data/types.ts';
import { items } from '../src/lib/items.ts';
import { plain } from '../src/lib/inline.ts';

export { items, plain };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const MANUAL_PATH = join(ROOT, 'content/manual.md');
export const OUTPUT_PATH = join(ROOT, 'src/data/manual.json');
export const HOSPITAL_PATH = join(ROOT, 'content/hospital.md');
export const HOSPITAL_OUTPUT_PATH = join(ROOT, 'src/data/hospital.json');

/**
 * Two manuals share this parser.
 *  - 'aiims': chapters "## 3. Title", numbered 1…21, with a Contents list; tabs come from heading words.
 *  - 'hospital': chapters "## 1.1 Title" (or unnumbered), grouped under "# 1.0 Part" headings that may
 *    have an introduction; every protocol has the same four column headings plus a RED FLAG row.
 */
export interface ParseOptions {
  style: 'aiims' | 'hospital';
  /** Prefix for chapter ids: ch3, hp1-1. */
  idPrefix: string;
}
export const AIIMS: ParseOptions = { style: 'aiims', idPrefix: 'ch' };
export const HOSPITAL: ParseOptions = { style: 'hospital', idPrefix: 'hp' };

/** App grouping of chapters (Home screen). This is navigation, not manual content. */
const GROUPS: { group: ChapterGroup; from: number; to: number }[] = [
  { group: 'counter', from: 1, to: 2 },
  { group: 'presentation', from: 3, to: 16 },
  { group: 'drug', from: 17, to: 21 },
];

/** Presentation chapters that do not follow History → Exam → Tests → Red flags → Management. */
const NON_STANDARD_PRESENTATIONS = [13];
const REQUIRED_KINDS: SectionKind[] = ['history', 'exam', 'tests', 'redflags', 'management'];

// Checked in order. "Quick guide…", "Differential diagnosis … initial treatment" and
// "Diagnosis & management of … complications" are reference material even though they
// mention tests or management.
const REFERENCE_HEADING =
  /^(quick|differential|common differential|diagnosis & management|brief initial approach|other common|n-acetyl|reversible causes)/i;
const KIND_RULES: [RegExp, SectionKind][] = [
  [REFERENCE_HEADING, 'reference'],
  [/history/i, 'history'],
  [/examination/i, 'exam'],
  [/investigations/i, 'tests'],
  [/red flag|warning signs/i, 'redflags'],
  [/management|treatment/i, 'management'],
  // Chapter 13's branches: "If pulse absent", …
  [/^if /i, 'management'],
];

const HOSPITAL_RULES: [RegExp, SectionKind][] = [
  [/^Salient history to be taken$/, 'history'],
  [/^Salient clinical examination$/, 'exam'],
  [/^Point-of-care investigations$/, 'tests'],
  [/^RED FLAG SIGNS/, 'redflags'],
  [/^Basic initial management$/, 'management'],
];

/** A footnote like "*If clinically indicated" changes what "*" means in its section. */
const IF_INDICATED_LEGEND = /^\*\s*if (clinically )?indicated/i;

export interface ParseResult {
  manual: Manual;
  warnings: string[];
}

export function parseManual(md: string, opts: ParseOptions = AIIMS): ParseResult {
  const hospital = opts.style === 'hospital';
  const tree = unified().use(remarkParse).use(remarkGfm).parse(md);
  const warnings: string[] = [];

  let title = '';
  const front: Block[] = [];
  const contentsGroups: Manual['contentsGroups'] = [];
  const contentsTitles = new Map<number, string>();
  const chapters: Chapter[] = [];
  const parts: NonNullable<Manual['parts']> = [];

  let mode: 'front' | 'contents' | 'part' | 'body' = 'front';
  let pendingPart: string | undefined;
  let currentPart: string | undefined;
  let chapter: Chapter | undefined;
  let section: Section | undefined;
  let subsection: Subsection | undefined;

  const newSection = (heading: Inline[] | null, line: number): Section => {
    if (!chapter) throw new Error(`Line ${line}: section outside a chapter`);
    const s: Section = {
      id: '',
      kind: 'reference',
      heading,
      headingText: heading && plain(heading),
      markerMeaning: 'askSr',
      subsections: [],
      line,
    };
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

    if (node.type === 'heading' && node.depth === 1) {
      const text = plain(inline(node.children));
      if (!title) title = text;
      else {
        pendingPart = text;
        if (hospital) {
          currentPart = text;
          parts.push({ title: text, intro: [] });
          mode = 'part';
        }
      }
      continue;
    }

    if (mode === 'part' && node.type !== 'heading') {
      parts.at(-1)!.intro.push(...blocks([node]));
      continue;
    }

    if (node.type === 'heading' && node.depth === 2) {
      const text = plain(inline(node.children));
      const m = (hospital ? /^(\d+(?:\.\d+)*)\s+(.+)$/ : /^(\d+)\.\s+(.+)$/).exec(text);
      if (!m && /^contents$/i.test(text) && !hospital) {
        mode = 'contents';
        continue;
      }
      if (!m && !hospital) throw new Error(`Line ${line}: "## ${text}" is not a numbered chapter heading`);
      mode = 'body';
      const label = m?.[1] ?? '';
      const chTitle = m?.[2] ?? text;
      const number = hospital ? chapters.length + 1 : Number(label);
      let group: ChapterGroup | undefined;
      if (hospital) {
        // "1.1" is a protocol; "10.0" or an unnumbered heading is a chapter of its own, outside any part.
        group = /^\d+\.[1-9]\d*$/.test(label) ? 'presentation' : 'counter';
        if (group === 'counter') currentPart = undefined;
      } else {
        group = GROUPS.find((g) => number >= g.from && number <= g.to)?.group;
      }
      if (!group) throw new Error(`Line ${line}: chapter ${number} is not in any group`);
      chapter = {
        id: hospital ? `${opts.idPrefix}${label ? label.replace(/\./g, '-') : `-${slug(chTitle)}`}` : `${opts.idPrefix}${number}`,
        number,
        label,
        title: chTitle,
        contentsTitle: '',
        group,
        ...(pendingPart ? { partTitle: pendingPart } : {}),
        ...(hospital && currentPart ? { part: currentPart } : {}),
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

    if (mode === 'contents') {
      if (node.type === 'heading') {
        contentsGroups.push({ title: plain(inline(node.children)), chapters: [] });
      } else if (node.type === 'list') {
        const start = node.start ?? 1;
        node.children.forEach((li, i) => {
          const n = start + i;
          contentsTitles.set(n, plain(itemInline(li)));
          contentsGroups.at(-1)?.chapters.push(n);
        });
      } else {
        throw new Error(`Line ${line}: unexpected ${node.type} in Contents`);
      }
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

  // Finish: ids, kinds, "*" markers, contents titles.
  for (const ch of chapters) {
    ch.contentsTitle = hospital ? ch.title : (contentsTitles.get(ch.number) ?? '');
    if (!ch.contentsTitle) warnings.push(`Chapter ${ch.number} is missing from the Contents list`);

    const kindCount = new Map<SectionKind, number>();
    for (const s of ch.sections) {
      s.kind = hospital ? classifyHospital(s) : classify(ch, s, warnings);
      const k = (kindCount.get(s.kind) ?? 0) + 1;
      kindCount.set(s.kind, k);
      s.id = `${ch.id}-${s.kind}${k > 1 ? `-${k}` : ''}`;

      const allBlocks = s.subsections.flatMap((sub) => sub.blocks);
      if (paragraphs(allBlocks).some((p) => IF_INDICATED_LEGEND.test(p.trim()))) {
        s.markerMeaning = 'ifIndicated';
      }
      s.subsections.forEach((sub, j) => {
        sub.id = `${s.id}.${j}`;
        assignIds(sub.blocks, sub.id);
        // The hospital manual has no "*" convention: its asterisks are leftover formatting.
        if (hospital) return;
        for (const item of items(sub.blocks)) {
          // The "*" sits before, after or (ch 19) in the middle of the item's text.
          if (item.text.includes('*')) item.marker = s.markerMeaning;
        }
      });
    }

    // Hospital: a chapter with any part of the protocol table must have all of it.
    const standard = hospital
      ? REQUIRED_KINDS.some((k) => kindCount.has(k))
      : ch.group === 'presentation' && !NON_STANDARD_PRESENTATIONS.includes(ch.number);
    if (standard) {
      for (const kind of REQUIRED_KINDS) {
        const n = kindCount.get(kind) ?? 0;
        if (n !== 1) throw new Error(`Chapter ${ch.number} has ${n} "${kind}" sections, expected 1`);
      }
    }
  }

  chapters.forEach((ch, i) => {
    if (ch.number !== i + 1) throw new Error(`Chapter ${ch.number} is out of order (expected ${i + 1})`);
  });
  if (new Set(chapters.map((c) => c.id)).size !== chapters.length) throw new Error('Two chapters have the same id');
  assignIds(front, 'front');
  parts.forEach((p, i) => assignIds(p.intro, `part${i + 1}`));

  return {
    manual: {
      title,
      ...(hospital ? { parts } : {}),
      front,
      contentsGroups,
      chapters,
      sourceHash: createHash('sha256').update(md).digest('hex'),
    },
    warnings,
  };
}

function classifyHospital(s: Section): SectionKind {
  if (s.headingText === null) return 'reference';
  for (const [re, kind] of HOSPITAL_RULES) if (re.test(s.headingText)) return kind;
  return 'reference';
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function classify(ch: Chapter, s: Section, warnings: string[]): SectionKind {
  if (ch.group === 'counter') return 'reference';
  if (s.headingText === null) {
    // Text before the first ### heading: a numbered protocol (ch 13's first steps,
    // ch 17–19) is followed step by step; anything else is reference.
    const hasSteps = s.subsections.some((sub) => sub.blocks.some((b) => b.type === 'list' && b.ordered));
    return hasSteps ? 'management' : 'reference';
  }
  if (ch.group === 'drug') return 'reference';
  for (const [re, kind] of KIND_RULES) if (re.test(s.headingText)) return kind;
  warnings.push(`Ch ${ch.number}: heading "${s.headingText}" has no known kind; shown as reference`);
  return 'reference';
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

// ---------- helpers ----------

function paragraphs(bs: Block[]): string[] {
  return bs.flatMap((b) =>
    b.type === 'paragraph' ? [b.text] : b.type === 'callout' ? paragraphs(b.blocks) : [],
  );
}

export function serialise(manual: Manual): string {
  return `${JSON.stringify(manual, null, 1)}\n`;
}

// ---------- CLI ----------

if (import.meta.main) {
  const check = process.argv.includes('--check');
  let stale = false;
  for (const [src, out, opts] of [
    [MANUAL_PATH, OUTPUT_PATH, AIIMS],
    [HOSPITAL_PATH, HOSPITAL_OUTPUT_PATH, HOSPITAL],
  ] as const) {
    const name = out.split('/').pop();
    const { manual, warnings } = parseManual(readFileSync(src, 'utf8'), opts);
    const json = serialise(manual);
    for (const w of warnings) console.warn(`warning (${name}): ${w}`);

    if (check) {
      let current = '';
      try {
        current = readFileSync(out, 'utf8');
      } catch {
        // missing counts as out of date
      }
      if (current !== json) {
        console.error(`src/data/${name} is out of date: run \`npm run parse\` and commit it.`);
        stale = true;
      } else console.log(`${name} is up to date.`);
    } else {
      writeFileSync(out, json);
      const secs = manual.chapters.flatMap((c) => c.sections);
      const its = secs.flatMap((s) => s.subsections.flatMap((sub) => items(sub.blocks)));
      const byKind = Object.fromEntries(
        [...new Set(secs.map((s) => s.kind))].map((k) => [k, secs.filter((s) => s.kind === k).length]),
      );
      console.log(
        `Parsed ${manual.chapters.length} chapters, ${secs.length} sections ${JSON.stringify(byKind)}, ` +
          `${its.length} items (${its.filter((i) => i.marker).length} marked "*") → src/data/${name}`,
      );
    }
  }
  if (stale) process.exit(1);
}

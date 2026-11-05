// Converts the hospital's emergency manual (.docx) into content/hospital.md, which
// scripts/parse-manual.ts then turns into src/data/hospital.json.
//
//   node scripts/import-hospital.ts <manual.docx> --replace "<text to remove>=this hospital" [--replace …]
//
// The .docx itself is not committed. The cover page, contents, index and the flowchart captions
// (the flowcharts are images and come in separately) are left out; everything else is carried
// over word for word. --replace swaps the given text everywhere, so the institution's name never
// enters the repository. The run ends with a check that no text was lost.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Nodes } from 'mdast';
import { readDocx, type BodyItem, type Para, type Table } from './lib/docx.ts';
import { blocksMarkdown, escapeMd, inlineMarkdown, plainForCheck, type InlineStats, type Replacement } from './lib/markdown.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const HOSPITAL_MD = join(ROOT, 'content/hospital.md');

// The cover's subtitle; the cover itself (institution, address, document number) is left out.
const TITLE = 'Clinical Protocols for Common Emergency Presentations';
const START = /^How to use this manual$/;
const STOP = /^\d+\.0\s+Alphabetical Index/;
const NUMBERED = /^(\d+(?:\.\d+)*)\s+(.+)$/;
const CAPTION = /^Algorithm\b/;

export function convert(body: BodyItem[], replace: Replacement[]) {
  const stats: InlineStats = { replaced: 0, asteriskPairs: 0 };
  const out: string[] = [`# ${TITLE}`, ''];
  /** Text carried over, for the completeness check. */
  const kept: string[] = [TITLE];
  const inline = (p: Para) => inlineMarkdown(p.runs, replace, stats);
  const blocks = (ps: Para[]) => {
    kept.push(...ps.map((p) => p.text));
    return blocksMarkdown(ps, replace, stats);
  };
  const push = (...lines: string[]) => out.push(...lines, '');

  let started = false;
  let inCaption = false;
  // Is the current H1 a numbered section with sub-protocols (a "part"), or a chapter of its own?
  let h1Chapter = false;

  for (let k = 0; k < body.length; k++) {
    const el = body[k]!;
    if (el.kind === 'p' && /^Heading1$/.test(el.style)) {
      const text = el.text.trim();
      if (STOP.test(text)) break;
      if (!started && !START.test(text)) continue;
      started = true;
      inCaption = false;
      const m = NUMBERED.exec(text);
      const hasProtocols = nextHeadingIsH2(body, k);
      kept.push(text);
      if (m && hasProtocols) {
        push(`# ${m[1]} ${escapeMd(m[2]!)}`);
        h1Chapter = false;
      } else {
        // Numbered sections with no sub-protocols (10.0, 11.0, 12.0) and unnumbered front matter are chapters.
        push(m ? `## ${m[1]} ${escapeMd(m[2]!)}` : `## ${escapeMd(text)}`);
        h1Chapter = true;
      }
      continue;
    }
    if (!started) continue;

    if (el.kind === 'p' && el.style === 'Heading2') {
      const text = el.text.trim();
      kept.push(text);
      inCaption = false;
      const m = NUMBERED.exec(text);
      // Under an unnumbered H1 ("How to use this manual") the H2s are sections of that chapter.
      push(h1Chapter && !m ? `### ${escapeMd(text)}` : m ? `## ${m[1]} ${escapeMd(m[2]!)}` : `## ${escapeMd(text)}`);
      if (m) h1Chapter = false;
      continue;
    }

    if (el.kind === 'p') {
      // "Algorithm 2.1 — Chest Pain", its one-line description and the image are the flowchart,
      // which the app shows from the flowchart sheets instead.
      if (CAPTION.test(el.text.trim())) {
        inCaption = true;
        continue;
      }
      if (el.images.length) {
        inCaption = false;
        continue;
      }
      if (inCaption) continue;
      const md = blocks([el]);
      if (md) {
        // Consecutive list items stay one list.
        const prevIsList = out.at(-2)?.trimStart().startsWith('- ') && el.level !== null;
        if (prevIsList) out.splice(out.length - 1, 1, md, '');
        else push(md);
      }
      continue;
    }

    push(tableMarkdown(el, blocks, inline, kept));
  }
  return { markdown: `${out.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`, kept, stats };
}

function nextHeadingIsH2(body: BodyItem[], k: number): boolean {
  for (let j = k + 1; j < body.length; j++) {
    const el = body[j]!;
    if (el.kind === 'p' && el.style === 'Heading1') return false;
    if (el.kind === 'p' && el.style === 'Heading2') return true;
  }
  return false;
}

const PROTOCOL_HEADERS = ['Salient history to be taken', 'Salient clinical examination', 'Point-of-care investigations', 'Basic initial management'];

function tableMarkdown(t: Table, blocks: (ps: Para[]) => string, inline: (p: Para) => string, kept: string[]): string {
  const rowText = (r: Para[][]) => r.map((c) => c.map((p) => p.text).join(' ').trim());
  const out: string[] = [];
  const head = rowText(t.rows[0]!);

  // The four-column protocol table, then its RED FLAG row.
  if (head.length === 4 && head.every((h, i) => h === PROTOCOL_HEADERS[i])) {
    t.rows[0]!.forEach((_cell, i) => {
      kept.push(head[i]!);
      out.push(`### ${escapeMd(head[i]!)}`, '', blocks(t.rows[1]![i]!), '');
    });
    const [label, list] = t.rows[2]!;
    const flag = label!.map((p) => p.text).join(' ').trim();
    kept.push(flag);
    out.push(`### ${escapeMd(flag)}`, '', blocks(list!), '');
    return out.join('\n');
  }

  // A box: a one-cell title row, then column headings, then the columns' content.
  let rows = t.rows;
  if (head.length === 1) {
    kept.push(head[0]!);
    out.push(`### ${escapeMd(head[0]!)}`, '');
    rows = t.rows.slice(1);
  }
  const simple = rows.every((r) => r.every((c) => c.length <= 1 && c.every((p) => p.level === null)));
  if (simple && rows.length > 2) {
    // A real grid (e.g. the ABCDE thresholds): a markdown table.
    const cells = rows.map((r) => r.map((c) => (c[0] ? inline(c[0]).replace(/\|/g, '\\|') : '')));
    kept.push(...rows.flatMap((r) => r.flatMap((c) => c.map((p) => p.text))));
    out.push(`| ${cells[0]!.join(' | ')} |`, `|${cells[0]!.map(() => '---').join('|')}|`, ...cells.slice(1).map((r) => `| ${r.join(' | ')} |`), '');
    return out.join('\n');
  }
  // Otherwise one sub-section per column: heading from the first row, content below it.
  const [headers, ...content] = rows;
  headers!.forEach((h, i) => {
    const title = h.map((p) => p.text).join(' ').trim();
    if (title) {
      kept.push(title);
      out.push(`#### ${escapeMd(title)}`, '');
    }
    for (const r of content) if (r[i]) out.push(blocks(r[i]!), '');
  });
  return out.join('\n');
}

/** Every piece of kept text must appear, in order, in the markdown's text. */
export function checkComplete(markdown: string, kept: string[], replace: Replacement[]): string[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const parts: string[] = [];
  const walk = (n: Nodes) => {
    if (n.type === 'text' || n.type === 'inlineCode') parts.push(n.value);
    if ('children' in n) (n.children as Nodes[]).forEach(walk);
  };
  walk(tree);
  const norm = (s: string) => s.replace(/\*/g, '').replace(/\s+/g, '').toLowerCase();
  const haystack = norm(parts.join(''));
  const missing: string[] = [];
  let from = 0;
  for (const k of kept) {
    const needle = norm(plainForCheck(k, replace));
    if (!needle) continue;
    const at = haystack.indexOf(needle, from);
    if (at === -1) missing.push(k);
    else from = at + needle.length;
  }
  return missing;
}

if (import.meta.main) {
  const [, , file, ...args] = process.argv;
  if (!file) {
    console.error('Usage: node scripts/import-hospital.ts <manual.docx> --replace "<text>=<replacement>" …');
    process.exit(1);
  }
  const replace: Replacement[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--replace') {
      const [from, to] = args[++i]!.split('=');
      replace.push({ from: from!, to: to ?? '' });
    }
  }
  const { markdown, kept, stats } = convert(readDocx(file).body, replace);
  const missing = checkComplete(markdown, kept, replace);
  if (missing.length) {
    console.error(`${missing.length} pieces of text did not come through:`);
    for (const m of missing.slice(0, 20)) console.error(`  - ${m.slice(0, 120)}`);
    process.exit(1);
  }
  writeFileSync(HOSPITAL_MD, markdown);
  console.log(
    `Wrote content/hospital.md (${markdown.split('\n').length} lines). ` +
      `${stats.replaced} replacements, ${stats.asteriskPairs} *…* pairs shown as italics. All text accounted for.`,
  );
}

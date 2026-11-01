// Word paragraphs → markdown, keeping the words exactly and the bold / italic as written.
//
// Two rules change what is shown, both deliberate and tested:
//  - `*text*` typed literally in the document (left over from the authors' own formatting) is shown
//    as italics, the way the authors meant it; an unpaired "*" stays as a visible "*".
//  - `replace` swaps given text (e.g. an institution's name) for neutral wording.

import type { Para, Run } from './docx.ts';

export interface Replacement {
  from: string;
  to: string;
}

interface Ch {
  c: string;
  b: boolean;
  i: boolean;
}

export interface InlineStats {
  replaced: number;
  asteriskPairs: number;
}

/** Inline markdown for one paragraph's runs. */
export function inlineMarkdown(runs: Run[], replace: Replacement[] = [], stats?: InlineStats): string {
  let chars: Ch[] = runs.flatMap((r) => [...r.text.replace(/\n/g, ' ')].map((c) => ({ c, b: r.bold, i: r.italic })));
  chars = applyReplacements(chars, replace, stats);
  chars = literalAsterisks(chars, stats);

  // Group into runs of equal formatting and wrap each; whitespace stays outside the markers.
  let out = '';
  let k = 0;
  while (k < chars.length) {
    const { b, i } = chars[k]!;
    let end = k;
    while (end < chars.length && chars[end]!.b === b && chars[end]!.i === i) end++;
    const text = chars
      .slice(k, end)
      .map((x) => x.c)
      .join('');
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(text)!;
    const mark = b && i ? '***' : b ? '**' : i ? '*' : '';
    out += m[2] ? `${m[1]}${mark}${escapeMd(m[2])}${mark}${m[3]}` : text;
    k = end;
  }
  return escapeLineStart(out.trim());
}

function applyReplacements(chars: Ch[], replace: Replacement[], stats?: InlineStats): Ch[] {
  for (const { from, to } of replace) {
    let text = chars.map((x) => x.c).join('');
    let at = text.indexOf(from);
    while (at !== -1) {
      const before = text.slice(0, at);
      const sentenceStart = /(^|[.!?:]\s+)$/.test(before);
      const word = sentenceStart ? to.charAt(0).toUpperCase() + to.slice(1) : to;
      const fmt = chars[at]!;
      chars = [...chars.slice(0, at), ...[...word].map((c) => ({ c, b: fmt.b, i: fmt.i })), ...chars.slice(at + from.length)];
      if (stats) stats.replaced++;
      text = chars.map((x) => x.c).join('');
      at = text.indexOf(from, at + word.length);
    }
  }
  return chars;
}

/** Pair literal asterisks as italics when they pair up cleanly; otherwise leave them as text. */
function literalAsterisks(chars: Ch[], stats?: InlineStats): Ch[] {
  const at = chars.flatMap((x, k) => (x.c === '*' ? [k] : []));
  if (!at.length || at.length % 2) return chars;
  for (let p = 0; p < at.length; p += 2) {
    const a = at[p]!;
    const z = at[p + 1]!;
    // A clean pair hugs its words: "*Do not lavage*", not "* x *" or "**".
    if (z - a < 2 || /\s/.test(chars[a + 1]!.c) || /\s/.test(chars[z - 1]!.c)) return chars;
  }
  const out = chars.map((x) => ({ ...x }));
  for (let p = 0; p < at.length; p += 2) for (let k = at[p]! + 1; k < at[p + 1]!; k++) out[k]!.i = true;
  if (stats) stats.asteriskPairs += at.length / 2;
  const drop = new Set(at);
  return out.filter((_, k) => !drop.has(k));
}

/** Backslash-escape everything markdown would otherwise read as syntax. */
export function escapeMd(s: string): string {
  return s.replace(/[\\`*_[\]<>#|~&]/g, (c) => `\\${c}`);
}

function escapeLineStart(s: string): string {
  return s.replace(/^(\d+)([.)])(\s)/, '$1\\$2$3').replace(/^([-+=])(\s|$)/, '\\$1$2');
}

/** A run of paragraphs (body text or one table cell) as markdown blocks. */
export function blocksMarkdown(paras: Para[], replace: Replacement[] = [], stats?: InlineStats): string {
  const lines: string[] = [];
  let lastWasList = false;
  for (const p of paras) {
    const md = inlineMarkdown(p.runs, replace, stats);
    if (!md) continue;
    const isList = p.level !== null;
    if (lines.length && (!isList || !lastWasList)) lines.push('');
    lines.push(isList ? `${'  '.repeat(p.level!)}- ${md}` : md);
    lastWasList = isList;
  }
  return lines.join('\n');
}

/** Plain text of a paragraph after the same replacements, with every "*" removed (for checks). */
export function plainForCheck(text: string, replace: Replacement[]): string {
  let t = text;
  for (const { from, to } of replace) {
    t = t.split(from).join(to);
  }
  return t.replace(/\*/g, '');
}

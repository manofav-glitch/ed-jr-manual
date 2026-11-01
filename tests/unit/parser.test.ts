import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MANUAL_PATH, OUTPUT_PATH, items, parseManual, serialise } from '../../scripts/parse-manual.ts';
import { squash, textOfBlocks, textOfManual, textOfMarkdown } from './helpers.ts';
import type { Chapter, Item } from '../../src/data/types.ts';

const md = readFileSync(MANUAL_PATH, 'utf8');
const { manual, warnings } = parseManual(md);

// ---- Counts taken straight from the markdown lines, independent of the parser ----

const lines = md.split('\n');
const chapterStarts = lines.flatMap((l, i) => (/^## \d+\. /.test(l) ? [i] : []));
const rawChapter = (idx: number) => lines.slice(chapterStarts[idx]! + 1, chapterStarts[idx + 1] ?? lines.length);
const count = (ls: string[], re: RegExp) => ls.filter((l) => re.test(l)).length;
const LIST_ITEM_LINE = /^\s*(?:[-*]|\d+\.)\s/;

function hasIntro(ls: string[]) {
  const firstH3 = ls.findIndex((l) => l.startsWith('### '));
  return ls.slice(0, firstH3 === -1 ? ls.length : firstH3).some((l) => l.trim() && l.trim() !== '---' && !l.startsWith('# '));
}

const itemsOf = (ch: Chapter): Item[] => ch.sections.flatMap((s) => s.subsections.flatMap((sub) => items(sub.blocks)));
const findItem = (n: number, text: string) => itemsOf(manual.chapters[n - 1]!).find((i) => i.text === text);

describe('parser: structure matches the manual', () => {
  it('parses without warnings', () => {
    expect(warnings).toEqual([]);
  });

  it('finds all 21 chapters, in order', () => {
    expect(chapterStarts).toHaveLength(21);
    expect(manual.chapters.map((c) => c.number)).toEqual(Array.from({ length: 21 }, (_, i) => i + 1));
  });

  it('groups chapters as counter 1–2, presentations 3–16, drugs 17–21', () => {
    const by = (g: string) => manual.chapters.filter((c) => c.group === g).map((c) => c.number);
    expect(by('counter')).toEqual([1, 2]);
    expect(by('presentation')).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    expect(by('drug')).toEqual([17, 18, 19, 20, 21]);
  });

  it('takes every chapter title from the contents list', () => {
    expect(manual.contentsGroups.flatMap((g) => g.chapters)).toHaveLength(21);
    expect(manual.chapters.every((c) => c.contentsTitle.length > 0)).toBe(true);
    expect(manual.chapters[2]!.contentsTitle).toBe('Initial assessment of a patient with chest pain');
  });

  it.each(manual.chapters.map((c, i) => [c.number, i] as const))(
    'chapter %i: section, subsection and item counts match the markdown',
    (_n, i) => {
      const ch = manual.chapters[i]!;
      const raw = rawChapter(i);
      expect(ch.sections).toHaveLength(count(raw, /^### /) + (hasIntro(raw) ? 1 : 0));
      expect(ch.sections.flatMap((s) => s.subsections).filter((s) => s.heading)).toHaveLength(count(raw, /^#### /));
      expect(itemsOf(ch)).toHaveLength(count(raw, LIST_ITEM_LINE));
    },
  );

  it('gives every standard presentation exactly one History, Exam, Tests, Red flags and Manage section', () => {
    for (const ch of manual.chapters.filter((c) => c.group === 'presentation' && c.number !== 13)) {
      for (const kind of ['history', 'exam', 'tests', 'redflags', 'management']) {
        expect(ch.sections.filter((s) => s.kind === kind), `ch ${ch.number} ${kind}`).toHaveLength(1);
      }
    }
  });

  it('tags the out-of-pattern headings correctly', () => {
    const kinds = (n: number) => manual.chapters[n - 1]!.sections.map((s) => s.kind);
    // Fever: red flags ("Warning signs") come last, after the differentials.
    expect(kinds(11)).toEqual(['history', 'exam', 'tests', 'management', 'reference', 'redflags']);
    // "Differential diagnosis of SOB — signs, tests and initial treatment" is reference.
    expect(kinds(5)).toEqual(['history', 'exam', 'tests', 'redflags', 'management', 'reference', 'reference']);
    // "Diagnosis & management of common CLD and CKD related complications" is reference.
    expect(kinds(15).at(-1)).toBe('reference');
    // Unresponsive patient: steps and branches are management, 5H & 5T is reference.
    expect(kinds(13)).toEqual(['management', 'management', 'management', 'management', 'reference', 'management']);
    // Hyperkalaemia steps are a protocol; analgesic lists are reference.
    expect(kinds(17)).toEqual(['management']);
    expect(new Set(kinds(20))).toEqual(new Set(['reference']));
  });

  it('keeps the part title before the drug chapters', () => {
    expect(manual.chapters[16]!.partTitle).toBe('Guide to common medications used in ED');
  });
});

describe('parser: "*" markers', () => {
  it('reads "*" as "discuss with SR" by default', () => {
    expect(findItem(3, 'Troponin I*')?.marker).toBe('askSr');
    expect(findItem(17, '*Inj. SODIUM BICARBONATE 100 mEq, infused over 30 minutes')?.marker).toBe('askSr');
  });

  it('reads "*" as "if indicated" where the chapter footnote says so (ch 9, ch 15)', () => {
    expect(findItem(9, 'Troponin / D-dimer*')?.marker).toBe('ifIndicated');
    expect(findItem(15, '*Blood group + cross match')?.marker).toBe('ifIndicated');
  });

  it('catches a "*" in the middle of an item (ch 19 NG lavage)', () => {
    const ng = itemsOf(manual.chapters[18]!).find((i) => i.text.startsWith('Nasogastric tube lavage'));
    expect(ng?.marker).toBe('askSr');
  });

  it('marks exactly the items that carry a "*" in the markdown', () => {
    const marked = manual.chapters.flatMap(itemsOf).filter((i) => i.marker);
    const rawMarked = lines.filter((l) => LIST_ITEM_LINE.test(l) && l.includes('\\*'));
    expect(marked).toHaveLength(rawMarked.length);
    expect(marked).toHaveLength(24);
  });
});

describe('parser: text is carried over exactly', () => {
  it('keeps a leading ">" ("more than") that markdown would read as a quote', () => {
    expect(findItem(9, '> 100 mL bleed in 2 hours')).toBeDefined();
    expect(findItem(15, '> 250 neutrophils/µL or TLC > 1000/µL')).toBeDefined();
  });

  it('keeps bold and italic as runs', () => {
    const site = findItem(3, 'Site of pain — localised or not')!;
    expect(site.inline).toEqual([
      { t: 'strong', c: [{ t: 'text', v: 'Site' }] },
      { t: 'text', v: ' of pain — localised or not' },
    ]);
  });

  it('keeps the AIIMS credits', () => {
    const front = textOfBlocks(manual.front).join(' ');
    expect(front).toContain('Department of Emergency Medicine, AIIMS New Delhi');
    expect(front).toContain('Dr Praveen Aggarwal, Professor & Head');
    expect(front).toContain('Dr Rachana, Senior Resident');
    expect(front).toContain('Dr Roshan Mathew');
  });

  it('loses, adds or reorders no text anywhere in the manual', () => {
    expect(squash(textOfManual(manual))).toBe(squash(textOfMarkdown(md)));
  });
});

describe('parser: re-running picks up edits to the manual', () => {
  it('adds a new history item', () => {
    const edited = md.replace('- **Site** of pain — localised or not', '- **Site** of pain — localised or not\n- New point');
    const ch3 = parseManual(edited).manual.chapters[2]!;
    expect(itemsOf(ch3)).toHaveLength(itemsOf(manual.chapters[2]!).length + 1);
    expect(ch3.sections[0]!.subsections[0]!.blocks.some((b) => b.type === 'list' && b.items.some((i) => i.text === 'New point'))).toBe(true);
  });

  it('warns about a heading it cannot classify', () => {
    const edited = md.replace('### Quick guide to important ED differentials of chest pain', '### Pearls');
    expect(parseManual(edited).warnings).toEqual(['Ch 3: heading "Pearls" has no known kind; shown as reference']);
  });

  it('refuses a presentation that loses its management section', () => {
    const edited = md.replace('## 3. Assessment of a patient with Chest Pain', '## 3. Chest Pain').replace(
      /### Basic initial management\n\n> \*\*\\\*Always discuss with the Senior Resident on shift before proceeding with any of the following management\.\*\*\n>\n> \*\*Shift to Red area if red flags present\.\*\*/,
      '',
    );
    expect(() => parseManual(edited)).toThrow(/Chapter 3 has 0 "management" sections/);
  });

  it('src/data/manual.json is up to date with content/manual.md', () => {
    expect(readFileSync(OUTPUT_PATH, 'utf8')).toBe(serialise(manual));
  });
});

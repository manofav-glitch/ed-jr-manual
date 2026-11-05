import data from '../data/hospital.json';
import { SHEET_TEXT } from '../data/sheetLinks.ts';
import type { Block, Chapter, Item, Manual, Section, SectionKind } from '../data/types.ts';
import { items } from './items.ts';

/** The hospital's ED protocols (text). */
export const manual = data as unknown as Manual;

export const TAB_ORDER: SectionKind[] = ['history', 'exam', 'tests', 'redflags', 'management', 'reference'];

export const TAB_LABEL: Record<SectionKind, string> = {
  history: 'History',
  exam: 'Exam',
  tests: 'Tests',
  redflags: 'Red flags',
  management: 'Manage',
  reference: 'Reference',
};

/** Tabs whose items can be ticked off. */
export const CHECKLIST_KINDS: ReadonlySet<SectionKind> = new Set(['history', 'exam', 'tests', 'management']);

export function chapterById(id: string | undefined): Chapter | undefined {
  return manual.chapters.find((c) => c.id === id);
}

export function chapterByLabel(label: string): Chapter | undefined {
  return manual.chapters.find((c) => c.label === label);
}

/** Text protocols linked from a flowchart (see src/data/sheetLinks.ts). */
export function textFor(sheetLabel: string): Chapter[] {
  return (SHEET_TEXT[sheetLabel] ?? []).map((l) => chapterByLabel(l)).filter((c): c is Chapter => !!c);
}

/** Flowchart numbers that link to this text protocol. */
export function sheetLabelsFor(ch: Chapter): string[] {
  return Object.entries(SHEET_TEXT)
    .filter(([, texts]) => texts.includes(ch.label))
    .map(([sheet]) => sheet);
}

/** Text protocols shown in the app: the ones a flowchart links to. */
export const linkedChapters: Chapter[] = manual.chapters.filter((c) => sheetLabelsFor(c).length > 0);

/** Text before a chapter's first heading. In a stepper it is shown above the first step. */
export function isIntro(s: Section): boolean {
  return s.heading === null && s.kind === 'reference';
}

export function tabsFor(ch: Chapter): SectionKind[] {
  const tabs = TAB_ORDER.filter((k) => ch.sections.some((s) => s.kind === k && !isIntro(s)));
  return tabs.length ? tabs : ['reference'];
}

/** Sections shown in this tab. A stepper's introduction is shown above the first step instead. */
export function sectionsFor(ch: Chapter, kind: SectionKind): Section[] {
  const stepper = tabsFor(ch).length > 1;
  return ch.sections.filter((s) => s.kind === kind && !(stepper && isIntro(s)));
}

export function introFor(ch: Chapter): Section[] {
  return tabsFor(ch).length > 1 ? ch.sections.filter(isIntro) : [];
}

/** The part ("1.0 Trauma") a protocol sits in, with its introduction. */
export function partFor(ch: Chapter) {
  return ch.part ? manual.parts.find((p) => p.title === ch.part) : undefined;
}

/** An item with its own nested list is a heading for those points, not a step to tick. */
export function isLeaf(item: Item): boolean {
  return !item.children.some((b) => b.type === 'list');
}

export function blocksOf(sections: Section[]): Block[] {
  return sections.flatMap((s) => s.subsections.flatMap((sub) => sub.blocks));
}

/** The items that can be ticked in this tab of this chapter. */
export function checkItems(ch: Chapter, kind: SectionKind): Item[] {
  if (!CHECKLIST_KINDS.has(kind)) return [];
  return items(blocksOf(sectionsFor(ch, kind))).filter(isLeaf);
}

/** "2.1 · Chest Pain" */
export function chapterLine(ch: Chapter): string {
  return ch.label ? `${ch.label} · ${ch.title}` : ch.title;
}

/** Link that opens the protocol on the right tab and scrolls to element `id` (any section, item or block id). */
export function urlFor(id: string): string {
  const sectionId = id.split('.')[0]!;
  const ch = manual.chapters.find((c) => c.sections.some((s) => s.id === sectionId));
  if (!ch) return '/';
  const section = ch.sections.find((s) => s.id === sectionId)!;
  const tabs = tabsFor(ch);
  // An introduction shows on the first step.
  const kind = tabs.length > 1 && isIntro(section) ? tabs[0]! : section.kind;
  const tab = tabs.length > 1 ? `/${kind}` : '';
  return `/p/${ch.id}${tab}?focus=${encodeURIComponent(id)}`;
}

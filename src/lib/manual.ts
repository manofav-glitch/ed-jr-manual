import data from '../data/manual.json';
import type { Block, Chapter, ChapterGroup, Item, Manual, Section, SectionKind } from '../data/types.ts';
import { items } from './items.ts';

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

export const GROUP_LABEL: Record<ChapterGroup, string> = {
  counter: 'At the counter',
  presentation: 'Presentations',
  drug: 'Drugs',
};

export function chapterById(m: Manual, id: string | undefined): Chapter | undefined {
  return m.chapters.find((c) => c.id === id);
}

export function tabsFor(ch: Chapter): SectionKind[] {
  return TAB_ORDER.filter((k) => ch.sections.some((s) => s.kind === k));
}

export function sectionsFor(ch: Chapter, kind: SectionKind): Section[] {
  return ch.sections.filter((s) => s.kind === kind);
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

/**
 * Short label for lists: the contents-list title without its "Initial assessment of a patient
 * with" prefix ("Chest pain", "Unresponsive patient", "Drugs for hyperkalaemia").
 */
export function shortTitle(ch: Chapter): string {
  const t = ch.contentsTitle.replace(/^(?:initial )?assessment of (?:an? )?(?:patients? (?:with|of) )?/i, '');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Link that opens the protocol on the right tab and scrolls to element `id` (any section, item or block id). */
export function urlFor(m: Manual, id: string): string {
  const sectionId = id.split('.')[0]!;
  const ch = m.chapters.find((c) => c.sections.some((s) => s.id === sectionId));
  if (!ch) return '/';
  const kind = ch.sections.find((s) => s.id === sectionId)!.kind;
  const tab = tabsFor(ch).length > 1 ? `/${kind}` : '';
  return `/p/${ch.id}${tab}?focus=${encodeURIComponent(id)}`;
}

import aiimsData from '../data/manual.json';
import hospitalData from '../data/hospital.json';
import type { Block, Chapter, ChapterGroup, Item, Manual, Section, SectionKind } from '../data/types.ts';
import { items } from './items.ts';

/** The AIIMS manual. Review notes and site notes point into this one. */
export const manual = aiimsData as unknown as Manual;
/** The hospital's own ED protocols. */
export const hospital = hospitalData as unknown as Manual;

export type SourceId = 'aiims' | 'hospital';

export const SOURCES: { id: SourceId; name: string; manual: Manual }[] = [
  { id: 'aiims', name: 'AIIMS manual', manual },
  { id: 'hospital', name: 'Hospital protocols', manual: hospital },
];

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

export function chapterById(id: string | undefined): Chapter | undefined {
  for (const s of SOURCES) {
    const ch = s.manual.chapters.find((c) => c.id === id);
    if (ch) return ch;
  }
  return undefined;
}

export function sourceOf(ch: Chapter): SourceId {
  return hospital.chapters.includes(ch) ? 'hospital' : 'aiims';
}

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

/** Hospital protocols: the part ("1.0 Trauma") a chapter sits in, with its introduction. */
export function partFor(ch: Chapter) {
  return ch.part ? hospital.parts?.find((p) => p.title === ch.part) : undefined;
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
 * Short label for lists. AIIMS: the contents-list title without its "Initial assessment of a
 * patient with" prefix ("Chest pain", "Unresponsive patient"). Hospital protocols: the title.
 */
export function shortTitle(ch: Chapter): string {
  const t = ch.contentsTitle.replace(/^(?:initial )?assessment of (?:an? )?(?:patients? (?:with|of) )?/i, '');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** "Chapter 3 · Assessment of…" / "1.1 · Road Traffic Accident…" */
export function chapterLine(ch: Chapter): string {
  if (sourceOf(ch) === 'aiims') return `Chapter ${ch.label} · ${ch.title}`;
  return ch.label ? `${ch.label} · ${ch.title}` : ch.title;
}

/** Link that opens the protocol on the right tab and scrolls to element `id` (any section, item or block id). */
export function urlFor(id: string): string {
  const sectionId = id.split('.')[0]!;
  for (const src of SOURCES) {
    const ch = src.manual.chapters.find((c) => c.sections.some((s) => s.id === sectionId));
    if (!ch) continue;
    const section = ch.sections.find((s) => s.id === sectionId)!;
    const tabs = tabsFor(ch);
    // An introduction shows on the first step.
    const kind = tabs.length > 1 && isIntro(section) ? tabs[0]! : section.kind;
    const tab = tabs.length > 1 ? `/${kind}` : '';
    return `/p/${ch.id}${tab}?focus=${encodeURIComponent(id)}`;
  }
  return '/';
}

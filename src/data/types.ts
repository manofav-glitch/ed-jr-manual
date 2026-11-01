// Shape of src/data/manual.json, produced by scripts/parse-manual.ts.
// The JSON is generated: edit content/manual.md and run `npm run parse`, never the JSON.

/** Inline text exactly as written in the manual, with its emphasis kept. */
export type Inline =
  | { t: 'text'; v: string }
  | { t: 'strong'; c: Inline[] }
  | { t: 'em'; c: Inline[] }
  | { t: 'code'; v: string }
  | { t: 'link'; href: string; c: Inline[] };

/**
 * What a "*" on an item means. The manual uses it two ways: "discuss with the SR before
 * proceeding" (most chapters) and "if (clinically) indicated" (chapters 9 and 15, which say
 * so in a footnote).
 */
export type Marker = 'askSr' | 'ifIndicated';

export interface Item {
  id: string;
  /** Number shown in the manual for ordered lists. */
  n?: number;
  inline: Inline[];
  /** Plain text of `inline`, for search and tests. */
  text: string;
  marker?: Marker;
  /** Nested lists, call-outs or extra paragraphs belonging to this item. */
  children: Block[];
  line: number;
}

export type Block =
  | { type: 'list'; ordered: boolean; items: Item[] }
  | { type: 'paragraph'; id: string; inline: Inline[]; text: string; line: number }
  /** A paragraph that is only bold text, used by the manual as a small heading. */
  | { type: 'subhead'; id: string; inline: Inline[]; text: string; line: number }
  | { type: 'callout'; id: string; blocks: Block[]; line: number }
  | { type: 'table'; id: string; header: Inline[][]; rows: Inline[][][]; line: number };

export type SectionKind = 'history' | 'exam' | 'tests' | 'redflags' | 'management' | 'reference';

export interface Subsection {
  id: string;
  /** The #### heading; null for content before the first one. */
  heading: Inline[] | null;
  headingText: string | null;
  blocks: Block[];
  line: number;
}

export interface Section {
  id: string;
  kind: SectionKind;
  /** null for content between the chapter title and its first ### heading. */
  heading: Inline[] | null;
  headingText: string | null;
  /** Meaning of "*" on items in this section. */
  markerMeaning: Marker;
  subsections: Subsection[];
  line: number;
}

export type ChapterGroup = 'counter' | 'presentation' | 'drug';

export interface Chapter {
  id: string;
  /** Position in its manual, from 1. */
  number: number;
  /** Number as printed: "3" in the AIIMS manual, "1.1" in the hospital protocols, "" if none. */
  label: string;
  /** Title as in the chapter heading, e.g. "Assessment of a patient with Chest Pain". */
  title: string;
  /** Title as in the manual's contents list, e.g. "Initial assessment of a patient with chest pain". */
  contentsTitle: string;
  group: ChapterGroup;
  /** A part title (a single # heading) printed just before this chapter, if any. */
  partTitle?: string;
  /** Hospital protocols: the part ("1.0 Trauma") this chapter belongs to. */
  part?: string;
  sections: Section[];
  line: number;
}

export interface Manual {
  title: string;
  /** Hospital protocols: parts ("# 1.0 Trauma") with their introductions. */
  parts?: { title: string; intro: Block[] }[];
  /** Front matter: department line and credits, exactly as written. */
  front: Block[];
  /** Headings the manual uses to group its contents list. */
  contentsGroups: { title: string; chapters: number[] }[];
  chapters: Chapter[];
  /** sha-256 of content/manual.md, so the app can tell which manual version it was built from. */
  sourceHash: string;
}

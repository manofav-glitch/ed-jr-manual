// Shape of src/data/hospital.json, produced by scripts/parse-manual.ts.
// The JSON is generated: change content/hospital.md (via scripts/import-hospital.ts) and run
// `npm run parse`, never the JSON.

/** Inline text exactly as written in the manual, with its emphasis kept. */
export type Inline =
  | { t: 'text'; v: string }
  | { t: 'strong'; c: Inline[] }
  | { t: 'em'; c: Inline[] }
  | { t: 'code'; v: string }
  | { t: 'link'; href: string; c: Inline[] };

export interface Item {
  id: string;
  /** Number shown in the manual for ordered lists. */
  n?: number;
  inline: Inline[];
  /** Plain text of `inline`, for search and tests. */
  text: string;
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
  subsections: Subsection[];
  line: number;
}

export interface Chapter {
  /** hp2-1, or hp-triage for an unnumbered chapter. */
  id: string;
  /** Position in the manual, from 1. */
  number: number;
  /** Number as printed: "2.1", "10.0", or "" if none. */
  label: string;
  title: string;
  /** The part title ("# 2.0 …") printed just before this chapter, if any. */
  partTitle?: string;
  /** The part ("2.0 Chest Pain, …") this protocol belongs to. */
  part?: string;
  sections: Section[];
  line: number;
}

export interface Manual {
  title: string;
  /** Parts ("# 1.0 Trauma") with their introductions. */
  parts: { title: string; intro: Block[] }[];
  /** Text before the first chapter (none in the current manual). */
  front: Block[];
  chapters: Chapter[];
  /** sha-256 of content/hospital.md, so the app can tell which version it was built from. */
  sourceHash: string;
}

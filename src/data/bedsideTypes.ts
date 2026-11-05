// Bedside history, examination, differentials and plan for a presentation.
//
// Unlike the hospital protocols, these are written for the app: the order and the points follow
// Talley & O'Connor, Clinical Examination: a systematic guide to physical diagnosis (8th edition,
// Elsevier 2018), but the wording is our own. The book is copyrighted, so nothing here is quoted
// from it; every group cites the pages to read in the book instead.

/** Pages in the printed book (8th edition), e.g. { chapter: 4, pages: '62', label: 'Questions box 4.1' }. */
export interface BookRef {
  chapter: number;
  pages: string;
  /** The book's own name for the box, table or list, when there is one. */
  label?: string;
}

export interface Point {
  text: string;
  /** A question or sign the book flags as pointing to an urgent or dangerous problem. */
  urgent?: boolean;
  /** What a yes (or a finding) points to. */
  hint?: string;
  /** Not in the book: added because it matters in the ED. Shown with its own label. */
  extra?: boolean;
}

export interface PointGroup {
  heading: string;
  points: Point[];
  refs: BookRef[];
}

export interface Differential {
  name: string;
  /** Can't-miss diagnosis: listed first and shown in red. */
  urgent?: boolean;
  /** Features that point towards it. */
  for: string[];
  /** Features that point away from it, or another diagnosis it is often confused with. */
  against?: string[];
  /** Book pages; empty only when `extra`. */
  refs: BookRef[];
  /** Not in the book: added because it matters in the ED. */
  extra?: boolean;
}

export interface DifferentialGroup {
  heading: string;
  items: Differential[];
}

export interface BedsideTopic {
  /** URL id, e.g. "chest-pain". */
  id: string;
  title: string;
  /** Flowchart labels this topic goes with, e.g. ["6.2"]. */
  flowcharts: string[];
  /** True once a senior has checked it against the book. Until then the screen says it is a draft. */
  reviewed: boolean;
  history: PointGroup[];
  exam: PointGroup[];
  differentials: DifferentialGroup[];
  plan: PointGroup[];
}

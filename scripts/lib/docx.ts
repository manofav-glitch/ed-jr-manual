// Minimal .docx reader for the import scripts: paragraphs with their runs (bold / italic),
// list levels, tables and images, in document order. Only what the importers need.

import { readFileSync } from 'node:fs';
import { strFromU8, unzipSync } from 'fflate';
import { DOMParser, type Element } from '@xmldom/xmldom';

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const A = 'http://schemas.openxmlformats.org/drawingml/2006/main';

export interface Run {
  text: string;
  bold: boolean;
  italic: boolean;
}

export interface Para {
  kind: 'p';
  style: string;
  /** Bullet level (0, 1, 2) or null when the paragraph is not a list item. */
  level: number | null;
  runs: Run[];
  text: string;
  /** Relationship ids of images in this paragraph. */
  images: string[];
}

export interface Table {
  kind: 'table';
  /** rows → cells → paragraphs */
  rows: Para[][][];
}

export type BodyItem = Para | Table;

export interface Docx {
  body: BodyItem[];
  /** Read a file from the package, e.g. "word/media/image1.png". */
  file: (path: string) => Uint8Array;
  /** Relationship id → target path inside the package ("word/media/…"). */
  rels: Map<string, string>;
}

export function readDocx(path: string): Docx {
  const zip = unzipSync(readFileSync(path));
  const xml = (p: string) => new DOMParser().parseFromString(strFromU8(zip[p]!), 'text/xml');
  const doc = xml('word/document.xml');
  const relsDoc = xml('word/_rels/document.xml.rels');
  const rels = new Map<string, string>();
  for (const r of Array.from(relsDoc.getElementsByTagName('Relationship'))) {
    rels.set(r.getAttribute('Id')!, `word/${r.getAttribute('Target')}`);
  }
  const body = doc.getElementsByTagNameNS(W, 'body')[0]!;
  const items: BodyItem[] = [];
  for (const el of kids(body)) {
    if (el.localName === 'p') items.push(para(el));
    else if (el.localName === 'tbl') items.push(table(el));
  }
  return {
    body: items,
    rels,
    file: (p) => {
      const f = zip[p];
      if (!f) throw new Error(`Not in the .docx: ${p}`);
      return f;
    },
  };
}

function kids(el: Element, name?: string): Element[] {
  return Array.from(el.childNodes).filter(
    (n): n is Element => n.nodeType === 1 && (n as Element).namespaceURI === W && (!name || (n as Element).localName === name),
  );
}

function para(p: Element): Para {
  const ppr = kids(p, 'pPr')[0];
  const style = (ppr && kids(ppr, 'pStyle')[0]?.getAttributeNS(W, 'val')) || '';
  const numPr = ppr && kids(ppr, 'numPr')[0];
  const ilvl = numPr && kids(numPr, 'ilvl')[0]?.getAttributeNS(W, 'val');
  const runs: Run[] = [];
  for (const r of Array.from(p.getElementsByTagNameNS(W, 'r'))) {
    const rpr = kids(r, 'rPr')[0];
    const on = (name: string) => {
      const e = rpr && kids(rpr, name)[0];
      if (!e) return false;
      const v = e.getAttributeNS(W, 'val');
      return v !== '0' && v !== 'false';
    };
    let text = '';
    for (const c of kids(r)) {
      if (c.localName === 't') text += c.textContent ?? '';
      else if (c.localName === 'tab') text += ' ';
      else if (c.localName === 'br') text += '\n';
    }
    if (text) runs.push({ text, bold: on('b'), italic: on('i') });
  }
  const images = Array.from(p.getElementsByTagNameNS(A, 'blip')).map((b) => b.getAttributeNS(R, 'embed')!);
  return {
    kind: 'p',
    style,
    level: numPr ? Number(ilvl ?? 0) : null,
    runs,
    text: runs.map((r) => r.text).join(''),
    images,
  };
}

function table(t: Element): Table {
  return {
    kind: 'table',
    rows: kids(t, 'tr').map((tr) => kids(tr, 'tc').map((tc) => kids(tc, 'p').map(para))),
  };
}

// Imports the flowchart sheets (.docx of images, two sheets per presentation) into
// public/flowcharts/*.webp and src/data/flowcharts.json.
//
//   node scripts/import-flowcharts.ts <sheets.docx>
//
// Titles come from the document's own contents list and captions; each sheet is the image that
// follows its caption. The cover page is skipped. The .docx itself is not committed.

import { mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { readDocx } from './lib/docx.ts';
import type { Flowcharts, FlowchartItem } from '../src/data/flowchartTypes.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public/flowcharts');
export const FLOWCHARTS_JSON = join(ROOT, 'src/data/flowcharts.json');

const PART = /^(\d+)\.0\s+(.+)$/;
const ITEM = /^(\d+(?:\.\d+)?)\s+(.+)$/;
const SHEET = /^(.+?)\s+—\s+SHEET (\d+) of (\d+)$/;
const SEE = /^(.+?)\s+—\s+see protocol ([\d.]+)$/;
/** Wide enough to zoom into at the bedside, small enough to keep offline. */
const WIDTH = 1400;

if (import.meta.main) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/import-flowcharts.ts <sheets.docx>');
    process.exit(1);
  }
  const doc = readDocx(file);
  const data: Flowcharts = { parts: [] };
  const byLabel = new Map<string, FlowchartItem>();
  let inContents = false;
  let pending: { label: string; caption: string } | null = null;
  // The contents list comes first; captions start at the first "— SHEET 1 of 2".
  let captions = false;
  const jobs: { rel: string; out: string; item: FlowchartItem; caption: string }[] = [];

  for (const el of doc.body) {
    if (el.kind !== 'p') continue;
    const text = el.text.replace(/\s+/g, ' ').trim();
    if (el.style === 'Heading1' && text === 'Contents') {
      inContents = true;
      continue;
    }
    if (!inContents) continue; // cover page

    const sheet = SHEET.exec(text);
    const see = SEE.exec(text);
    if (sheet) captions = true;
    if (sheet || (see && captions)) {
      const head = (sheet ?? see)![1]!;
      const m = ITEM.exec(head)!;
      const item = byLabel.get(m[1]!);
      if (!item) throw new Error(`Caption for ${m[1]} has no entry in the contents list`);
      pending = { label: m[1]!, caption: sheet ? `Sheet ${sheet[2]} of ${sheet[3]}` : `See protocol ${see![2]}` };
      continue;
    }
    if (el.images.length && pending) {
      const item = byLabel.get(pending.label)!;
      const n = item.sheets.length + 1;
      const out = `flowcharts/${item.label.replace(/\./g, '-')}-${n}.webp`;
      for (const rel of el.images) jobs.push({ rel, out, item, caption: pending.caption });
      item.sheets.push({ src: out, caption: pending.caption, width: 0, height: 0 });
      pending = null;
      continue;
    }

    // Contents list: "1.0 BLEEDING" parts, then "1.1 Bleeding P/V — Vaginal Bleeding" items.
    const part = PART.exec(text);
    if (part && el.style !== 'ListParagraph') {
      data.parts.push({ label: `${part[1]}.0`, title: part[2]!, items: [] });
      continue;
    }
    const item = ITEM.exec(text);
    if (item && el.style === 'ListParagraph' && data.parts.length) {
      const seeAlso = SEE.exec(text)?.[2];
      const title = seeAlso ? SEE.exec(text)![1]!.replace(ITEM, '$2') : item[2]!;
      const entry: FlowchartItem = {
        id: `fc${item[1]!.replace(/\./g, '-')}`,
        label: item[1]!,
        title,
        sheets: [],
        ...(seeAlso ? { seeAlso } : {}),
      };
      data.parts.at(-1)!.items.push(entry);
      byLabel.set(entry.label, entry);
    }
  }

  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  let bytes = 0;
  for (const j of jobs) {
    const target = join(ROOT, 'public', j.out);
    const img = sharp(doc.file(doc.rels.get(j.rel)!)).resize({ width: WIDTH, withoutEnlargement: true });
    const info = await img.webp({ quality: 74 }).toFile(target);
    const sheet = j.item.sheets.find((s) => s.src === j.out)!;
    sheet.width = info.width;
    sheet.height = info.height;
    bytes += statSync(target).size;
  }

  const items = data.parts.flatMap((p) => p.items);
  const missing = items.filter((i) => !i.sheets.length);
  if (missing.length) throw new Error(`No sheets for: ${missing.map((i) => i.label).join(', ')}`);
  writeFileSync(FLOWCHARTS_JSON, `${JSON.stringify(data, null, 1)}\n`);
  console.log(
    `${data.parts.length} sections, ${items.length} presentations, ${jobs.length} sheets → public/flowcharts ` +
      `(${(bytes / 1e6).toFixed(1)} MB) and src/data/flowcharts.json`,
  );
}


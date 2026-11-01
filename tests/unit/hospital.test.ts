import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { HOSPITAL, HOSPITAL_OUTPUT_PATH, HOSPITAL_PATH, items, parseManual, serialise } from '../../scripts/parse-manual.ts';
import { allFlowcharts, flowchartByLabel, flowcharts } from '../../src/lib/flowcharts.ts';
import { tabsFor } from '../../src/lib/manual.ts';
import { squash, textOfManual, textOfMarkdown } from './helpers.ts';

const ROOT = join(import.meta.dirname, '../..');
const md = readFileSync(HOSPITAL_PATH, 'utf8');
const { manual: hp, warnings } = parseManual(md, HOSPITAL);

describe('hospital protocols: structure', () => {
  it('parses without warnings, and the committed JSON is up to date', () => {
    expect(warnings).toEqual([]);
    expect(readFileSync(HOSPITAL_OUTPUT_PATH, 'utf8')).toBe(serialise(hp));
  });

  it('has a chapter for every "##" heading, with unique ids', () => {
    expect(hp.chapters).toHaveLength(md.split('\n').filter((l) => l.startsWith('## ')).length);
    expect(new Set(hp.chapters.map((c) => c.id)).size).toBe(hp.chapters.length);
  });

  it('has the 44 protocols (1.1–8.13), each with History, Exam, Tests, Red flags and Manage', () => {
    const protocols = hp.chapters.filter((c) => /^[1-8]\.\d+$/.test(c.label));
    expect(protocols).toHaveLength(44);
    for (const c of protocols) {
      expect(tabsFor(c).slice(0, 5), c.label).toEqual(['history', 'exam', 'tests', 'redflags', 'management']);
    }
  });

  it('keeps the parts and their introductions', () => {
    expect(hp.parts?.map((p) => p.title)).toEqual([
      '1.0 Trauma',
      '2.0 Chest Pain, Breathlessness and Syncope',
      '3.0 Nausea, Vomiting, Diarrhoea, GI Bleed and Acute Abdominal Pain',
      '4.0 Central Nervous System — Unconsciousness, Seizure, Altered Sensorium and Weakness',
      '5.0 Poisoning, Envenomation and Animal Bite',
      '6.0 Obstetric and Gynaecological Presentations',
      '7.0 Other Presentations',
      '8.0 Additional Protocols (new in Revision 02)',
      '9.0 Emergency Assessment Protocols and Resuscitation Algorithms',
    ]);
    expect(hp.chapters.find((c) => c.label === '2.1')?.part).toBe('2.0 Chest Pain, Breathlessness and Syncope');
    expect(hp.chapters.find((c) => c.label === '10.0')?.part).toBeUndefined();
  });

  it('counts sub-sections and list items as in the markdown', () => {
    const sub = hp.chapters.flatMap((c) => c.sections.flatMap((s) => s.subsections)).filter((s) => s.heading);
    expect(sub).toHaveLength(md.split('\n').filter((l) => l.startsWith('#### ')).length);
    const its = hp.chapters.flatMap((c) => c.sections.flatMap((s) => s.subsections.flatMap((x) => items(x.blocks))));
    const partItems = (hp.parts ?? []).flatMap((p) => items(p.intro));
    expect(its.length + partItems.length).toBe(md.split('\n').filter((l) => /^\s*- /.test(l)).length);
  });

  it('loses, adds or reorders no text', () => {
    expect(squash(textOfManual(hp, 'hospital'))).toBe(squash(textOfMarkdown(md)));
  });

  it('has no "Ask" badges (its asterisks are formatting, not a convention)', () => {
    const its = hp.chapters.flatMap((c) => c.sections.flatMap((s) => s.subsections.flatMap((x) => items(x.blocks))));
    expect(its.filter((i) => i.marker)).toEqual([]);
  });
});

describe('flowcharts', () => {
  it('has 21 sections, 78 presentations and 154 sheets', () => {
    expect(flowcharts.parts).toHaveLength(21);
    expect(allFlowcharts).toHaveLength(78);
    expect(allFlowcharts.reduce((n, f) => n + f.sheets.length, 0)).toBe(154);
  });

  it('has every sheet image on disk', () => {
    for (const f of allFlowcharts) {
      for (const s of f.sheets) {
        const file = join(ROOT, 'public', s.src);
        expect(existsSync(file), s.src).toBe(true);
        expect(s.width).toBeGreaterThan(0);
      }
    }
  });

  it('"see protocol" entries point at a real flowchart', () => {
    const see = allFlowcharts.filter((f) => f.seeAlso);
    expect(see.map((f) => [f.label, f.seeAlso])).toEqual([
      ['3.3', '2.2'],
      ['16.2', '3.2'],
    ]);
    for (const f of see) expect(flowchartByLabel(f.seeAlso!)).toBeDefined();
  });
});

// The owner asked that the source institution is not named anywhere in the app or repository.
// Its name is checked by hash so the test itself does not contain it.
const FORBIDDEN = new Set([
  'b26d28f46ceba1518fad6a7122320240084a5fe4fe73a5128fffcfffa86f2907',
  '46cd786bc58599b8b178693d39418832515c4d81c540415aec3ef383de1d50c3',
]);

function textFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'node_modules' || name.startsWith('.') ? [] : textFiles(p);
    return /\.(md|json|ts|tsx|html|css|yml|svg)$/.test(name) ? [p] : [];
  });
}

describe('the source institution is not named', () => {
  const files = [
    ...['content', 'src', 'scripts', 'tests', 'public', '.github'].flatMap((d) => textFiles(join(ROOT, d))),
    ...['README.md', 'index.html', 'vite.config.ts', 'package.json'].map((f) => join(ROOT, f)),
  ];

  it.each(files.map((f) => [f.slice(ROOT.length + 1)]))('%s', (file) => {
    const words = readFileSync(join(ROOT, file), 'utf8').toLowerCase().match(/[a-z]+/g) ?? [];
    const hits = [...new Set(words)].filter((w) => FORBIDDEN.has(createHash('sha256').update(w).digest('hex')));
    expect(hits).toEqual([]);
  });
});

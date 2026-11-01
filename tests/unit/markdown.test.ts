import { describe, expect, it } from 'vitest';
import { blocksMarkdown, inlineMarkdown } from '../../scripts/lib/markdown.ts';
import type { Para, Run } from '../../scripts/lib/docx.ts';

const r = (text: string, bold = false, italic = false): Run => ({ text, bold, italic });
const p = (runs: Run[], level: number | null = null): Para => ({
  kind: 'p',
  style: '',
  level,
  runs,
  text: runs.map((x) => x.text).join(''),
  images: [],
});

describe('docx → markdown', () => {
  it('keeps bold and italic, with spaces outside the markers', () => {
    expect(inlineMarkdown([r('Two '), r('wide-bore 16G ', true), r('cannulae')])).toBe('Two **wide-bore 16G** cannulae');
    expect(inlineMarkdown([r('only if stable', false, true)])).toBe('*only if stable*');
  });

  it('shows literal *pairs* as italics', () => {
    expect(inlineMarkdown([r('*Never lavage a corrosive ingestion.* Never lavage an unprotected airway')])).toBe(
      '*Never lavage a corrosive ingestion.* Never lavage an unprotected airway',
    );
  });

  it('leaves an unpaired or badly placed "*" visible', () => {
    expect(inlineMarkdown([r('initiated independently by the EMO*.')])).toBe('initiated independently by the EMO\\*.');
    expect(inlineMarkdown([r('decisions.***')])).toBe('decisions.\\*\\*\\*');
  });

  it('escapes markdown syntax so the words come through as written', () => {
    expect(inlineMarkdown([r('> 250 neutrophils <90 mmHg [ref] E_V_M_ A|B')])).toBe(
      '\\> 250 neutrophils \\<90 mmHg \\[ref\\] E\\_V\\_M\\_ A\\|B',
    );
    expect(inlineMarkdown([r('1. Not a list')])).toBe('1\\. Not a list');
  });

  it('replaces given text, capitalising at the start of a sentence', () => {
    const replace = [{ from: 'Example Hospital', to: 'this hospital' }];
    expect(inlineMarkdown([r('Care at Example Hospital is a team activity.')], replace)).toBe('Care at this hospital is a team activity.');
    expect(inlineMarkdown([r('Example Hospital is not an obstetric unit.')], replace)).toBe('This hospital is not an obstetric unit.');
  });

  it('writes bullets with nesting and separates them from paragraphs', () => {
    expect(blocksMarkdown([p([r('Imaging', true)]), p([r('CXR')], 0), p([r('portable')], 1), p([r('Note')])])).toBe(
      '**Imaging**\n\n- CXR\n  - portable\n\nNote',
    );
  });
});

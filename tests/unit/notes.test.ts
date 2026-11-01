import { describe, expect, it } from 'vitest';
import { redFlagAction, siteNotes, sites } from '../../src/config/site.ts';
import { reviewNotes } from '../../src/data/reviewNotes.ts';
import { findAnchor } from '../../src/lib/anchors.ts';
import { manual } from '../../src/lib/manual.ts';

describe('review notes ("Check before use")', () => {
  it('have unique ids', () => {
    expect(new Set(reviewNotes.map((n) => n.id)).size).toBe(reviewNotes.length);
  });

  it.each(reviewNotes.flatMap((n) => n.anchors.map((a) => [n.id, a.chapter, a.match] as const)))(
    '%s: "%s / %s" is found in exactly one place',
    (_id, chapter, match) => {
      expect(findAnchor(manual, { chapter, match })).toHaveLength(1);
    },
  );

  it('cover the six corrections asked for', () => {
    expect(reviewNotes.map((n) => n.id).sort()).toEqual(
      [
        'aspirin-325-vs-300',
        'lysis-3-to-4.5h-exclusions',
        'meningitis-ceftriaxone-frequency',
        'nac-bag-3',
        'thrombectomy-window',
        'tnk-stroke-dose',
      ].sort(),
    );
  });
});

describe('site config', () => {
  it('AIIMS shows no local notes and uses the manual wording', () => {
    expect(siteNotes(sites.aiims)).toEqual([]);
    expect(redFlagAction(sites.aiims)).toBe('Any red flag → shift to Red area, inform SR.');
  });

  it('keeps the EHS rule out of triage by default', () => {
    expect(sites.aiims.priorityRed).toEqual({ text: 'AIIMS EHS patient', useInTriage: false });
  });

  it.each(siteNotes(sites.local).flatMap((n) => n.anchors.map((a) => [n.id, a.chapter, a.match] as const)))(
    'Local note %s: "%s / %s" is found in exactly one place',
    (_id, chapter, match) => {
      expect(findAnchor(manual, { chapter, match })).toHaveLength(1);
    },
  );

  it('the local profile uses its own zones and senior', () => {
    expect(redFlagAction(sites.local)).toBe('Any red flag → shift to Resuscitation Bay / Red bed, inform Consultant.');
    expect(sites.local.verified).toBe(false);
  });
});

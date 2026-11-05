// "Check before use" notes, shown next to the manual text they refer to.
// The manual text itself is never changed; these sit beside it, clearly labelled.
//
// To add a note: give it a unique id, the chapter id ("hp-triage", "hp5-1"…) and `match`, an
// exact piece of the manual text it belongs next to (copy it from content/hospital.md without the
// ** and * marks). `npm test` fails if a `match` is not found, or is found in more than one place.

import type { Anchor } from '../lib/anchors.ts';

export interface ReviewNote {
  id: string;
  anchors: Anchor[];
  title: string;
  body: string;
  source?: string;
}

export const reviewNotes: ReviewNote[] = [
  {
    id: 'triage-red-vs-abcde',
    anchors: [{ chapter: 'hp-triage', match: 'Danger-zone vitals: HR >100, RR >20, SpO₂ <92%' }],
    title: 'Section 9.1 gives different Red limits',
    body:
      'The ABCDE table (9.1) gives Red as RR 30–40 or 10–12, SpO₂ <90%, HR >130 or <60, BP <100/70, ' +
      'blood sugar <70 or >250 mg/dL. The triage tool calls a patient Red if either table does.',
    source: 'Section 9.1, ABCDE assessment — physiological thresholds by triage zone',
  },
  {
    id: 'triage-resus-vs-abcde',
    anchors: [{ chapter: 'hp-triage', match: 'Apnoea, agonal or gasping respiration, RR >40 or <10, SpO₂ <90% on oxygen' }],
    title: 'Section 9.1 gives different Resuscitation Bay limits',
    body:
      'The ABCDE table (9.1) gives SpO₂ <80% (on any oxygen), BP >180/100 or <90/60, shock index >1.0, ' +
      'temperature >104 or <97 °F and blood sugar <50 mg/dL. The triage tool uses whichever table is more urgent.',
    source: 'Section 9.1, ABCDE assessment — physiological thresholds by triage zone',
  },
];

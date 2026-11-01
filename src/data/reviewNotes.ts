// "Check before use" notes, shown next to the manual text they refer to.
// The manual text itself is never changed; these sit beside it, clearly labelled.
//
// To add a note: give it a unique id, the chapter number, and `match`, an exact piece of the
// manual text it belongs next to (copy it from content/manual.md without the ** and * marks).
// `npm test` fails if a `match` is not found, or is found in more than one place.

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
    id: 'tnk-stroke-dose',
    anchors: [{ chapter: 4, match: 'Tenecteplase 0.5 mg/kg IV (max 50 mg)' }],
    title: 'This is the STEMI dose',
    body:
      'Tenecteplase 0.5 mg/kg (max 50 mg) is the STEMI dose. For acute ischaemic stroke the dose is ' +
      '0.25 mg/kg (max 25 mg) per AHA/ASA; the Indian stroke label uses 0.2 mg/kg. The dose calculator uses the stroke dose.',
    source: 'AHA/ASA acute ischaemic stroke guideline; Indian tenecteplase label (stroke)',
  },
  {
    id: 'thrombectomy-window',
    anchors: [
      { chapter: 4, match: 'Groin puncture for endovascular therapy initiated within 6 hrs of onset' },
      { chapter: 4, match: 'Fibrinolysis received within 4.5 hrs of onset' },
      { chapter: 4, match: 'Endovascular therapy by 6 hours of arrival' },
    ],
    title: 'Thrombectomy window is out of date',
    body:
      'The 6-hour limit and the requirement for prior fibrinolysis are outdated. After DAWN and DEFUSE-3, ' +
      'thrombectomy can be offered up to 24 hours in selected patients.',
    source: 'DAWN (2018), DEFUSE-3 (2018); AHA/ASA 2019',
  },
  {
    id: 'lysis-3-to-4.5h-exclusions',
    anchors: [
      { chapter: 4, match: 'Age ≤ 80' },
      { chapter: 4, match: 'No h/o uncontrolled DM, prior stroke, anticoagulant use' },
    ],
    title: '3–4.5 h exclusions were relaxed',
    body:
      'The extra exclusions for the 3–4.5 hour window (age > 80, diabetes with prior stroke, anticoagulant use) ' +
      'were relaxed in AHA/ASA 2019. Decide eligibility with the SR and Neurology.',
    source: 'AHA/ASA 2019 acute ischaemic stroke guideline',
  },
  {
    id: 'nac-bag-3',
    anchors: [{ chapter: 12, match: '100 mg/kg in 1 L 5% D over 16 hrs' }],
    title: 'Bag 3 example is wrong',
    body:
      'The example in brackets repeats bag 2. 100 mg/kg for 60 kg = 6 g in 1 L 5% dextrose over 16 h ≈ 62.5 mL/h.',
  },
  {
    id: 'meningitis-ceftriaxone-frequency',
    anchors: [{ chapter: 21, match: 'Inj. CEFTRIAXONE 2 g IV ATD' }],
    title: 'Frequency missing',
    body: 'Meningitis dose: ceftriaxone 2 g IV q12h.',
  },
  {
    id: 'aspirin-325-vs-300',
    anchors: [
      { chapter: 3, match: 'Tab Aspirin 325 mg' },
      { chapter: 18, match: 'ASPIRIN (non-enteric coated, e.g. Disprin) 300 mg' },
    ],
    title: 'Chapters 3 and 18 disagree',
    body: 'Chapter 3 gives aspirin 325 mg; chapter 18 gives 300 mg (4 tablets of 75 mg). Confirm with the SR.',
  },
];

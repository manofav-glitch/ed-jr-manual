import type { BedsideTopic } from '../bedsideTypes.ts';
import { FIRST_LOOK, KIDNEY_EXAM } from './shared.ts';

export const flankPain: BedsideTopic = {
  id: 'flank-pain',
  title: 'Flank (loin) pain',
  flowcharts: ['16.3'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'The pain',
      refs: [
        { chapter: 13, pages: '217–218' },
        { chapter: 17, pages: '300' },
      ],
      points: [
        { text: 'Colicky waves on a constant loin pain, radiating to the groin, testis or labia?', hint: 'Renal colic' },
        { text: 'Can’t keep still, or lying still?', hint: 'Restless: colic. Still: peritonitis' },
        { text: 'Sudden, severe, to the back, with faintness?', urgent: true, hint: 'Ruptured aortic aneurysm' },
        { text: 'Steady, with fever and rigors?', urgent: true, hint: 'Pyelonephritis, obstructed infected kidney' },
        { text: 'Worse with movement or on breathing in?', hint: 'Spine or chest wall; basal pneumonia' },
        { text: 'Burning pain in a band, then a rash', hint: 'Herpes zoster' },
      ],
    },
    {
      heading: 'With it',
      refs: [
        { chapter: 17, pages: '298–300', label: 'Lists 17.3, 17.4' },
      ],
      points: [
        { text: 'Blood in the urine; passing gravel or stones' },
        { text: 'Burning, frequency' },
        { text: 'Nausea and vomiting', hint: 'Common with colic: don’t mistake it for a gut cause' },
        { text: 'Reduced or no urine', urgent: true, hint: 'Obstruction of a single kidney, or both' },
        { text: 'Could she be pregnant? Last period', urgent: true },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 17, pages: '298, 304', label: 'Questions box 17.1' },
        { chapter: 19, pages: '322', label: 'Fig. 19.2' },
      ],
      points: [
        { text: 'Previous stones or UTIs; only one kidney; transplant' },
        { text: 'Polycystic kidneys in the family', hint: 'Bleed into a cyst, infected cyst' },
        { text: 'Gout, hyperparathyroidism', hint: 'Stones' },
        { text: 'Atrial fibrillation', hint: 'Renal infarction' },
        { text: 'Over 60, smoker, vascular disease, hypertension', urgent: true, hint: 'Aneurysm masquerading as renal colic', extra: true },
        { text: 'Anticoagulants' },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 15, pages: '272–273' },
      ],
      points: [
        { text: 'Pulse, BP, temperature, respiratory rate' },
        { text: 'Shock with loin or back pain', urgent: true, hint: 'Aneurysm, or septic obstructed kidney' },
        { text: 'Expansile mass in the abdomen', urgent: true, hint: 'Aneurysm (may be hard to feel)' },
      ],
    },
    ...KIDNEY_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 18, pages: '310–312' },
        { chapter: 15, pages: '273–274', label: 'Fig. 15.1' },
      ],
      points: [
        { text: 'Loin tenderness', hint: 'Strongly suggests renal colic in a patient with abdominal pain' },
        { text: 'Enlarged kidney', hint: 'Hydronephrosis, polycystic, tumour' },
        { text: 'Testes in men (torsion can refer pain upwards)', extra: true },
        { text: 'Chest: basal crackles, rub' },
        { text: 'Spine: tenderness. Skin: early zoster' },
        { text: 'Abdomen: appendicitis, cholecystitis, pancreatitis, diverticulitis signs' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Ruptured or leaking abdominal aortic aneurysm',
          urgent: true,
          for: ['Sudden pain to the back or loin; collapse, shock', 'Pulsatile mass (may be indistinct)'],
          refs: [
            { chapter: 15, pages: '272–273', label: 'Fig. 15.1' },
            { chapter: 14, pages: '255' },
          ],
        },
        {
          name: 'Obstructed, infected kidney',
          urgent: true,
          for: ['Colic plus fever and rigors; septic'],
          refs: [
            { chapter: 17, pages: '299–300' },
          ],
        },
        {
          name: 'Ectopic pregnancy',
          urgent: true,
          for: ['Woman of child-bearing age; missed period; shock'],
          refs: [{ chapter: 15, pages: '273–274', label: 'Fig. 15.1' }],
        },
        {
          name: 'Renal infarction',
          for: ['Atrial fibrillation, endocarditis; blood in the urine'],
          refs: [{ chapter: 19, pages: '322', label: 'List 19.4' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Renal or ureteric stone',
          for: ['Colicky loin to groin pain, restless, vomiting', 'Blood in the urine; loin tenderness'],
          refs: [
            { chapter: 13, pages: '218' },
            { chapter: 17, pages: '299–300', label: 'List 17.3' },
            { chapter: 18, pages: '310' },
          ],
        },
        {
          name: 'Pyelonephritis',
          for: ['Fever, rigors, moderate flank pain, dysuria; loin tenderness'],
          refs: [
            { chapter: 17, pages: '299', label: 'List 17.3' },
          ],
        },
        {
          name: 'Polycystic kidney: bleed or infection in a cyst',
          for: ['Family history, hypertension, big kidneys; tender'],
          refs: [{ chapter: 18, pages: '311', label: 'List 18.3' }],
        },
        {
          name: 'Gut causes (appendicitis, cholecystitis, pancreatitis, diverticulitis)',
          for: ['Tenderness at the site; peritonism'],
          refs: [{ chapter: 15, pages: '273', label: 'Fig. 15.1' }],
        },
        {
          name: 'Basal pneumonia or pleurisy',
          for: ['Cough, fever, pain on breathing; chest signs'],
          refs: [{ chapter: 15, pages: '273–274', label: 'Fig. 15.1' }],
        },
        {
          name: 'Spine or musculoskeletal; herpes zoster',
          for: ['Pain with movement; spinal tenderness; dermatomal pain before the rash'],
          refs: [{ chapter: 15, pages: '274' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 19, pages: '319–322', label: 'Fig. 19.2' },
      ],
      points: [
        { text: 'Urine dipstick (blood, nitrite, leucocytes) and culture' },
        { text: 'Pregnancy test in women of child-bearing age', extra: true },
        { text: 'Kidney function' },
        { text: 'Imaging: ultrasound or CT for stone and obstruction (most stones show on X-ray)' },
        { text: 'Bedside ultrasound of the aorta if older', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 17, pages: '299–300' }],
      points: [
        { text: 'Older patient with “renal colic”: exclude an aneurysm first', urgent: true, extra: true },
        { text: 'Fever with an obstructed kidney: urgent drainage (urology)', urgent: true, extra: true },
        { text: 'Single kidney, anuria or kidney failure: urgent', urgent: true },
        { text: 'Then follow the hospital’s flank pain flowchart below' },
      ],
    },
  ],
};

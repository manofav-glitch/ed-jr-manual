// Pieces several presentations share: the first look at an acutely ill patient and the book's
// order for the cardiovascular and respiratory examinations. See ../bedsideTypes.ts for the rules
// on wording.

import type { PointGroup } from '../bedsideTypes.ts';

/** Ch 47, The acutely ill patient: look before taking a full history. */
export const FIRST_LOOK: PointGroup = {
  heading: 'First look: is this patient critically ill?',
  refs: [
    { chapter: 47, pages: '867–869', label: 'Fig. 47.2' },
    { chapter: 47, pages: '870', label: 'List 47.2' },
  ],
  points: [
    { text: 'Airway: open and protected? Stridor, swelling, injury', urgent: true },
    { text: 'Breathing: rate, effort, accessory muscles, can they speak in sentences, SpO₂', urgent: true },
    { text: 'Circulation: pulse rate and rhythm, BP, skin colour and temperature, capillary refill', urgent: true },
    { text: 'Disability: AVPU, then GCS if only responding to pain or unresponsive; pupils', urgent: true },
    { text: 'Check blood sugar if consciousness is impaired', urgent: true, hint: 'Never miss hypoglycaemia' },
    { text: 'AMPLE: allergies, medicines, past illnesses, last meal, events leading up to this' },
  ],
};

/** Ch 8, Text box 8.1: the cardiovascular examination in order. */
export const CVS_EXAM: PointGroup[] = [
  {
    heading: 'General inspection (patient at 45°, chest and neck exposed)',
    refs: [{ chapter: 8, pages: '145–146', label: 'Text box 8.1' }],
    points: [
      { text: 'Distress, sweating, breathlessness at rest' },
      { text: 'Cyanosis, pallor, jaundice, cachexia' },
      { text: 'Body habitus: tall and thin with long limbs (Marfan), Turner or Down features' },
    ],
  },
  {
    heading: 'Hands and pulse',
    refs: [
      { chapter: 5, pages: '79–84' },
      { chapter: 8, pages: '145–146', label: 'Text box 8.1' },
    ],
    points: [
      { text: 'Clubbing, peripheral cyanosis, splinter haemorrhages (endocarditis), tendon xanthomata' },
      { text: 'Radial pulse: rate and rhythm' },
      { text: 'Compare both radial pulses, and radial with femoral', hint: 'Unequal or delayed: dissection, coarctation' },
    ],
  },
  {
    heading: 'Blood pressure',
    refs: [{ chapter: 5, pages: '84–89' }],
    points: [
      { text: 'BP in both arms', hint: 'A difference of 20 mmHg or more suggests dissection' },
      { text: 'Lying and standing (or sitting) for a postural drop' },
    ],
  },
  {
    heading: 'Face and neck',
    refs: [
      { chapter: 5, pages: '89–92' },
      { chapter: 8, pages: '146', label: 'Text box 8.1' },
    ],
    points: [
      { text: 'Eyes: pallor, jaundice, xanthelasma' },
      { text: 'Mouth: central cyanosis of tongue and lips, teeth (endocarditis source)' },
      { text: 'JVP: height and waveform; does it rise on inspiration (Kussmaul’s sign)?' },
      { text: 'Carotid pulses, one at a time: character and volume' },
    ],
  },
  {
    heading: 'Praecordium',
    refs: [
      { chapter: 5, pages: '92–105' },
      { chapter: 8, pages: '146–147', label: 'Text box 8.1' },
    ],
    points: [
      { text: 'Look: scars (sternotomy, under the left breast), pacemaker box, visible pulsations' },
      { text: 'Feel: apex beat position (normally 5th left space, just inside the mid-clavicular line) and character' },
      { text: 'Feel: parasternal heave and thrills' },
      { text: 'Listen: heart sounds, added sounds (S3, S4), murmurs, rub; time them against the carotid' },
      { text: 'Turn to the left side and listen at the apex; sit forward in full expiration and listen at the left sternal edge' },
    ],
  },
  {
    heading: 'Back, abdomen and legs',
    refs: [
      { chapter: 5, pages: '106–107' },
      { chapter: 8, pages: '147', label: 'Text box 8.1' },
    ],
    points: [
      { text: 'Back: percuss for effusion, listen for basal crackles, feel for sacral oedema' },
      { text: 'Abdomen: liver size and pulsation, ascites, spleen, aortic aneurysm' },
      { text: 'Legs: femoral and peripheral pulses, oedema, calf swelling or tenderness, signs of poor perfusion' },
      { text: 'Finish: temperature, urine dipstick, fundi' },
    ],
  },
];

/** Ch 12, Text box 12.1: the respiratory examination in order. */
export const RESP_EXAM: PointGroup[] = [
  {
    heading: 'General inspection (sitting up if not acutely ill)',
    refs: [{ chapter: 12, pages: '201–202', label: 'Text box 12.1' }],
    points: [
      { text: 'Respiratory rate (count it) and the pattern of breathing' },
      { text: 'Accessory muscles, in-drawing of the lower ribs, pursed lips, tripod position' },
      { text: 'Can they finish a sentence?' },
      { text: 'Look at the sputum: purulent, bloody, frothy pink' },
      { text: 'Cough: loose, dry, or hollow (“bovine”: recurrent laryngeal nerve)' },
    ],
  },
  {
    heading: 'Hands, pulse and face',
    refs: [{ chapter: 12, pages: '201–202', label: 'Text box 12.1' }],
    points: [
      { text: 'Clubbing, peripheral cyanosis, nicotine staining, small-muscle wasting' },
      { text: 'Flapping tremor', hint: 'CO₂ retention' },
      { text: 'Pulse: tachycardia; pulsus paradoxus (fall of more than 10 mmHg on inspiration)' },
      { text: 'Eyes: Horner’s syndrome, anaemia. Tongue: central cyanosis. Voice: hoarseness' },
    ],
  },
  {
    heading: 'Trachea and neck',
    refs: [{ chapter: 12, pages: '202', label: 'Text box 12.1' }],
    points: [
      { text: 'Trachea: central or deviated (towards collapse, away from tension or massive effusion)' },
      { text: 'Tracheal tug, accessory muscles' },
      { text: 'Cervical and supraclavicular lymph nodes' },
    ],
  },
  {
    heading: 'Chest, back then front',
    refs: [
      { chapter: 12, pages: '202–203', label: 'Text box 12.1' },
      { chapter: 11, pages: '191', label: 'Table 11.1' },
    ],
    points: [
      { text: 'Look: shape of the chest and spine, scars, radiotherapy marks, prominent veins' },
      { text: 'Expansion: upper lobes (watch the clavicles) and lower lobes (hands on the chest); compare sides' },
      { text: 'Percussion, side to side: resonant, dull, stony dull or hyper-resonant' },
      { text: 'Breath sounds: vesicular or bronchial; reduced or absent' },
      { text: 'Added sounds: crackles (early, late, fine, coarse), wheeze, pleural rub' },
      { text: 'Vocal resonance (or fremitus) over any abnormal area' },
      { text: 'Listen high in the axillae too' },
    ],
  },
  {
    heading: 'Then',
    refs: [{ chapter: 12, pages: '203', label: 'Text box 12.1' }],
    points: [
      { text: 'JVP and signs of right heart failure (cor pulmonale): heave, liver, ankle oedema' },
      { text: 'Calves for DVT' },
      { text: 'Temperature' },
    ],
  },
];

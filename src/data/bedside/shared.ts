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

/** Ch 16, Text box 16.1: the gastrointestinal examination in order (lying flat, one pillow). */
export const ABDO_EXAM: PointGroup[] = [
  {
    heading: 'General inspection (lying flat, one pillow, abdomen exposed)',
    refs: [
      { chapter: 16, pages: '282–283', label: 'Text box 16.1' },
      { chapter: 15, pages: '272' },
      { chapter: 3, pages: '46–47', label: 'Hydration' },
    ],
    points: [
      { text: 'Looks unwell or comfortable; lying still or rolling about', hint: 'Still: peritonitis. Rolling: colic' },
      { text: 'Jaundice, pallor, wasting' },
      { text: 'Confusion or drowsiness', hint: 'Hepatic encephalopathy' },
      { text: 'Hydration: tongue, skin, postural BP', hint: 'Fluid loss' },
    ],
  },
  {
    heading: 'Hands, arms, face and chest',
    refs: [
      { chapter: 16, pages: '282–283', label: 'Text box 16.1' },
      { chapter: 15, pages: '275' },
    ],
    points: [
      { text: 'Clubbing, white nails, palmar erythema, Dupuytren’s contracture' },
      { text: 'Flapping tremor (arms out, wrists back)', hint: 'Liver failure' },
      { text: 'Bruising, spider naevi, scratch marks' },
      { text: 'Eyes: jaundice, pallor. Mouth: ulcers, angular stomatitis, glossitis; smell of the breath' },
      { text: 'Neck: left supraclavicular node' },
      { text: 'Chest: spider naevi, gynaecomastia, loss of body hair' },
    ],
  },
  {
    heading: 'Abdomen: look',
    refs: [
      { chapter: 14, pages: '245–248' },
      { chapter: 16, pages: '283', label: 'Text box 16.1' },
    ],
    points: [
      { text: 'Does it move with breathing?', hint: 'Not moving: peritonitis' },
      { text: 'Distension: fat, fluid, flatus, faeces, fetus or a big mass' },
      { text: 'Scars, stomas, visible peristalsis, masses, hernias' },
      { text: 'Prominent veins; bruising in the flanks or round the umbilicus', hint: 'Severe pancreatitis' },
    ],
  },
  {
    heading: 'Abdomen: feel',
    refs: [
      { chapter: 15, pages: '272–273', label: 'Good signs guide 15.1' },
      { chapter: 14, pages: '250–257' },
    ],
    points: [
      { text: 'Ask where it hurts first, start away from it, and watch the face' },
      { text: 'Ask them to cough: where does it hurt?', hint: 'A gentle test for peritonism' },
      { text: 'Light palpation: tenderness, guarding, rigidity' },
      { text: 'Light percussion over tender areas (kinder than testing rebound)' },
      { text: 'Deep palpation: masses; liver, spleen, kidneys' },
      { text: 'Gallbladder: Murphy’s sign (catches breath on deep inspiration)' },
      { text: 'Aorta: expansile pulsation?', urgent: true, hint: 'Aneurysm' },
    ],
  },
  {
    heading: 'Percuss, listen, and finish',
    refs: [
      { chapter: 14, pages: '257–269' },
      { chapter: 16, pages: '283–284', label: 'Text box 16.1' },
    ],
    points: [
      { text: 'Shifting dullness if the flanks are dull', hint: 'Ascites' },
      { text: 'Bowel sounds: absent, or loud and high-pitched', hint: 'Ileus, or obstruction' },
      { text: 'Hernial orifices and groin nodes; testes' },
      { text: 'Rectal examination (and look at the stool on the glove)' },
      { text: 'Look at any vomit or stool kept' },
      { text: 'Urine dipstick; temperature' },
    ],
  },
];

/** Ch 19, Text box 19.1 (and ch 18): the renal examination, trimmed to what the ED needs. */
export const KIDNEY_EXAM: PointGroup[] = [
  {
    heading: 'General inspection',
    refs: [
      { chapter: 19, pages: '317–318', label: 'Text box 19.1' },
      { chapter: 18, pages: '306' },
    ],
    points: [
      { text: 'Mental state: drowsy, confused, twitching', urgent: true, hint: 'Advanced uraemia' },
      { text: 'Deep fast breathing', urgent: true, hint: 'Metabolic acidosis' },
      { text: 'Hiccups, uraemic (fishy, ammonia) breath, sallow skin' },
      { text: 'Fluid status: dry or overloaded? Weigh the patient' },
    ],
  },
  {
    heading: 'Hands, arms, face and neck',
    refs: [
      { chapter: 19, pages: '317–318', label: 'Text box 19.1' },
      { chapter: 18, pages: '306–310' },
    ],
    points: [
      { text: 'Flapping tremor; pale palmar creases' },
      { text: 'Dialysis fistula (thrill), bruising, scratch marks' },
      { text: 'Rash of lupus or vasculitis' },
      { text: 'Eyes: anaemia. Mouth: dry, ulcers' },
      { text: 'JVP at 45°: volume status' },
    ],
  },
  {
    heading: 'Abdomen and back',
    refs: [
      { chapter: 18, pages: '310–312', label: 'List 18.2' },
      { chapter: 19, pages: '318', label: 'Text box 19.1' },
    ],
    points: [
      { text: 'Scars: nephrectomy (look in the loins), transplant (iliac fossa), dialysis catheter' },
      { text: 'Ballot each kidney: enlarged?' },
      { text: 'Bladder: palpable, or dull to percussion above the pubis?', hint: 'Retention' },
      { text: 'Aortic aneurysm' },
      { text: 'Renal bruit (2 cm either side of the midline above the umbilicus, and the flanks)' },
      { text: 'Loin tenderness: ballot the renal angle or a gentle fist (kidney punch)', hint: 'Infection, stone' },
      { text: 'Back: spinal tenderness, sacral oedema' },
    ],
  },
  {
    heading: 'Chest, legs and the rest',
    refs: [
      { chapter: 18, pages: '310–313' },
      { chapter: 19, pages: '318', label: 'Text box 19.1' },
    ],
    points: [
      { text: 'Heart: pericardial rub, heart failure; lungs: crackles, effusion' },
      { text: 'Legs: oedema, purpura, livedo, neuropathy' },
      { text: 'BP lying and standing', hint: 'Hypertension; postural drop (hypovolaemia can cause AKI)' },
      { text: 'Rectal examination: prostate; pelvic examination in women' },
      { text: 'Fundi: hypertensive and diabetic changes' },
      { text: 'Urine: look at it, and dipstick it' },
    ],
  },
];

/** Ch 18: examination of the male genitalia (wear gloves; offer a chaperone). */
export const MALE_GENITAL_EXAM: PointGroup = {
  heading: 'Male genitalia (gloves, chaperone)',
  refs: [
    { chapter: 18, pages: '313–315', label: 'Figs 18.9–18.11' },
  ],
  points: [
    { text: 'Penis: retract the foreskin; ulcers, discharge, swelling' },
    { text: 'Always pull the foreskin back over the glans afterwards', hint: 'Prevents paraphimosis', extra: true },
    { text: 'Scrotum standing: is one testis high and lying across?', urgent: true, hint: 'Torsion' },
    { text: 'Skin: oedema, redness, rash' },
    { text: 'Each testis: size, tenderness, hardness; then the epididymis behind and the cord above' },
    { text: 'Any lump: can you get above it?', hint: 'No: inguinoscrotal hernia' },
    { text: 'Separate from the testis or part of it? Does it light up with a torch?' },
    { text: 'Groin nodes and hernial orifices' },
  ],
};

/** Ch 36, Text box 36.1: the neurological examination, in the order the ED usually needs it. */
export const NEURO_EXAM: PointGroup[] = [
  {
    heading: 'Higher centres and speech',
    refs: [
      { chapter: 36, pages: '606–608', label: 'Text box 36.1' },
      { chapter: 33, pages: '540–547' },
    ],
    points: [
      { text: 'Right- or left-handed' },
      { text: 'Orientation: time, place, person' },
      { text: 'Dysphasia: name an object, point to a named object, follow a command' },
      { text: 'Dysarthria: slurred speech' },
      { text: 'Neglect or inattention of one side' },
    ],
  },
  {
    heading: 'Neck stiffness and Kernig’s sign',
    refs: [
      { chapter: 32, pages: '501' },
      { chapter: 36, pages: '607–608' },
    ],
    points: [
      { text: 'Lying flat, lift the head gently: do the neck and shoulders come up together?', urgent: true, hint: 'Meningism: meningitis or subarachnoid blood' },
      { text: 'Kernig’s sign: hip flexed, straighten the knee', hint: 'Limited by painful hamstring spasm in meningism' },
      { text: 'Skip if there may be a neck injury' },
    ],
  },
  {
    heading: 'Cranial nerves',
    refs: [
      { chapter: 36, pages: '607–609', label: 'Text box 36.1' },
      { chapter: 32, pages: '505–539' },
    ],
    points: [
      { text: 'Pupils: size, equality, reaction to light', urgent: true, hint: 'One dilated pupil: herniation, third nerve' },
      { text: 'Visual acuity and fields (hemianopia)' },
      { text: 'Fundi: papilloedema, haemorrhages', hint: 'Raised intracranial pressure' },
      { text: 'Eye movements: double vision, nystagmus, gaze palsy' },
      { text: 'Face: weakness of the lower face only (upper motor neurone) or the whole side (Bell’s)' },
      { text: 'Hearing; palate and gag; tongue', hint: 'Bulbar weakness threatens the airway' },
    ],
  },
  {
    heading: 'Limbs',
    refs: [
      { chapter: 36, pages: '607–610', label: 'Text box 36.1' },
      { chapter: 35, pages: '583', label: 'List 35.3' },
    ],
    points: [
      { text: 'Arms out, palms up, eyes closed: does one arm drift?' },
      { text: 'Wasting, fasciculation' },
      { text: 'Tone: increased (spastic) or reduced (flaccid); clonus' },
      { text: 'Power at shoulder, elbow, wrist, fingers, hip, knee, ankle; compare sides' },
      { text: 'Reflexes and plantars (upgoing: upper motor neurone)' },
      { text: 'Coordination: finger–nose, heel–shin, rapid alternating movements' },
      { text: 'Sensation: pinprick and vibration; map any loss (one side, glove and stocking, a level, dermatome)' },
    ],
  },
  {
    heading: 'Gait, back and sacral area',
    refs: [
      { chapter: 34, pages: '577–579' },
      { chapter: 36, pages: '608', label: 'Text box 36.1' },
    ],
    points: [
      { text: 'Gait if safe: ataxic, spastic, high-stepping, shuffling' },
      { text: 'Back: deformity, tenderness' },
      { text: 'Saddle sensation and anal reflex', hint: 'Cauda equina' },
    ],
  },
  {
    heading: 'Also',
    refs: [
      { chapter: 36, pages: '607' },
      { chapter: 31, pages: '497' },
    ],
    points: [
      { text: 'Pulse rhythm (atrial fibrillation), BP, carotid bruits' },
      { text: 'Blood sugar', urgent: true },
      { text: 'Temperature' },
    ],
  },
];

/** Ch 35, The unconscious patient (pp 601–604). */
export const UNCONSCIOUS_EXAM: PointGroup[] = [
  {
    heading: 'Airway, breathing, circulation',
    refs: [{ chapter: 35, pages: '601–602' }],
    points: [
      { text: 'Breathing? Clear and protect the airway', urgent: true },
      { text: 'Breathing pattern: Cheyne–Stokes, ataxic (brainstem), deep and fast (acidosis)' },
      { text: 'Shock, dehydration, cyanosis; cherry-red colour (carbon monoxide)' },
      { text: 'Pulse and BP' },
    ],
  },
  {
    heading: 'Level of consciousness',
    refs: [{ chapter: 35, pages: '602', label: 'Table 35.4' }],
    points: [
      { text: 'GCS: eyes (4), verbal (5), motor (6); record each part, not just the total' },
      { text: 'Posture: decerebrate (extension) or decorticate (flexion)' },
      { text: 'Fitting, twitching', urgent: true, hint: 'Status epilepticus (can be non-convulsive)' },
    ],
  },
  {
    heading: 'Head to toe',
    refs: [{ chapter: 35, pages: '603–604' }],
    points: [
      { text: 'Neck stiffness and Kernig’s sign (if no neck injury)' },
      { text: 'Head injury: scalp, bruising behind the ear, blood or clear fluid from the ears or nose' },
      { text: 'Pupils: pinpoint (opioids, pons), one dilated (herniation, subdural), fixed mid-sized (midbrain, anoxia)', urgent: true },
      { text: 'Eyes: deviation to one side; doll’s eye movements; fundi' },
      { text: 'Face: asymmetry when grimacing' },
      { text: 'Mouth: bitten tongue, corrosive burns; smell of alcohol, ketones, liver or kidney failure' },
      { text: 'Limbs: injection marks; tone and drop test for a hemiplegia; response to pain in each limb; plantars' },
      { text: 'Heart, lungs, abdomen; temperature (hypothermia, fever)' },
    ],
  },
  {
    heading: 'Bedside tests',
    refs: [{ chapter: 35, pages: '604' }],
    points: [
      { text: 'Blood sugar now', urgent: true },
      { text: 'Urine: glucose and ketones, protein, blood; incontinence' },
    ],
  },
];

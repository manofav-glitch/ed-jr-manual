import type { BedsideTopic } from '../bedsideTypes.ts';
import { ABDO_EXAM, FIRST_LOOK } from './shared.ts';

export const abdominalPain: BedsideTopic = {
  id: 'abdominal-pain',
  title: 'Abdominal pain',
  flowcharts: ['3.1'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'The pain',
      refs: [
        { chapter: 13, pages: '217–218' },
        { chapter: 1, pages: '7–8' },
      ],
      points: [
        { text: 'How long, and how often: acute or chronic, first time or recurrent?' },
        { text: 'Site: ask them to point to where it is worst' },
        { text: 'Did it start in one place and move?', hint: 'Central then right iliac fossa: appendicitis' },
        { text: 'Radiation: to the back', urgent: true, hint: 'Pancreatitis, penetrating ulcer, aortic aneurysm' },
        { text: 'Radiation: to the shoulder (diaphragm), throat (oesophagus), groin (renal colic)' },
        { text: 'Character: colicky in waves, or steady?', hint: 'Colicky: bowel or ureteric obstruction' },
        { text: 'Lying still, or rolling about?', hint: 'Still: peritonitis. Rolling: colic' },
        { text: 'Worse or better with food, vomiting, antacids, opening the bowels, sitting forward' },
        { text: 'Sudden severe onset?', urgent: true, hint: 'Perforation, rupture, ischaemia' },
      ],
    },
    {
      heading: 'With the pain',
      refs: [
        { chapter: 13, pages: '217–227' },
        { chapter: 15, pages: '274' },
      ],
      points: [
        { text: 'Vomiting: what, how often; bile or faeculent?' },
        { text: 'Bowels: last opened, flatus, diarrhoea, blood', urgent: true, hint: 'No flatus: obstruction' },
        { text: 'Fever, rigors' },
        { text: 'Jaundice, dark urine, pale stools', hint: 'Biliary' },
        { text: 'Urinary burning, frequency, blood', hint: 'Urinary tract' },
        { text: 'Last period, chance of pregnancy, vaginal bleeding or discharge', urgent: true, hint: 'Ectopic pregnancy, salpingitis' },
        { text: 'Chest pain, breathlessness, cough', hint: 'MI, basal pneumonia' },
        { text: 'Weight loss', urgent: true },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 13, pages: '226–227' },
        { chapter: 15, pages: '274' },
      ],
      points: [
        { text: 'Relapsing epigastric pain before, now severe', urgent: true, hint: 'Perforated peptic ulcer' },
        { text: 'Gallstones, pancreatitis, IBD, previous surgery (and what)' },
        { text: 'Atrial fibrillation, vascular disease', urgent: true, hint: 'Mesenteric ischaemia' },
        { text: 'Known aortic aneurysm, smoker, hypertension', urgent: true, hint: 'Ruptured aneurysm', extra: true },
        { text: 'Diabetes', hint: 'Ketoacidosis can cause abdominal pain' },
        { text: 'NSAIDs, steroids, anticoagulants' },
        { text: 'Alcohol', hint: 'Pancreatitis, liver disease' },
        { text: 'Analgesia already given (it should not be withheld)' },
      ],
    },
  ],
  exam: [
    {
      heading: 'Vital signs, repeated',
      refs: [{ chapter: 15, pages: '272' }],
      points: [
        { text: 'Pulse, BP and postural BP, respiratory rate, temperature' },
        { text: 'Tachycardia, postural drop, fast breathing, cold sweaty skin', urgent: true, hint: 'Bleeding (aneurysm), large fluid loss (pancreatitis) or septic shock (perforation)' },
        { text: 'Does the patient look unwell or distressed?' },
      ],
    },
    ...ABDO_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 15, pages: '272–274', label: 'Fig. 15.1, Good signs guides 15.1–15.3' },
        { chapter: 14, pages: '247–248, 253, 257' },
      ],
      points: [
        { text: 'Generalised rigidity and percussion tenderness', urgent: true, hint: 'Generalised peritonitis: usually surgical (not pancreatitis)' },
        { text: 'Pulsatile, expansile mass', urgent: true, hint: 'Aortic aneurysm' },
        { text: 'Tender or irreducible hernia', urgent: true },
        { text: 'Right iliac fossa: McBurney’s point, Rovsing’s and psoas signs', hint: 'Appendicitis (may be absent in the elderly)' },
        { text: 'Murphy’s sign', hint: 'Cholecystitis' },
        { text: 'Flank or umbilical bruising', hint: 'Severe pancreatitis' },
        { text: 'Tenderness that persists when the abdominal muscles are tensed (Carnett’s test)', hint: 'Abdominal wall pain' },
        { text: 'Rectal (and vaginal) examination: tenderness, mass, blood; cervical motion tenderness', hint: 'Ectopic pregnancy, salpingitis' },
        { text: 'Chest: consolidation or effusion; heart: atrial fibrillation' },
        { text: 'Back: spinal disease; skin: early zoster' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Ruptured abdominal aortic aneurysm',
          urgent: true,
          for: ['Pain to the back, collapse, shock', 'Pulsatile expansile mass (may be indistinct)'],
          refs: [
            { chapter: 15, pages: '272–273', label: 'Fig. 15.1' },
            { chapter: 14, pages: '255' },
          ],
        },
        {
          name: 'Perforated viscus (peptic ulcer, colon)',
          urgent: true,
          for: ['Sudden severe pain; lying still; rigid abdomen', 'Previous ulcer symptoms'],
          refs: [
            { chapter: 13, pages: '227' },
            { chapter: 15, pages: '272–273', label: 'Fig. 15.1' },
          ],
        },
        {
          name: 'Mesenteric ischaemia',
          urgent: true,
          for: ['Atrial fibrillation (embolism to a mesenteric artery)', 'Pain brought on by eating; blood per rectum'],
          refs: [
            { chapter: 13, pages: '217' },
            { chapter: 15, pages: '273–274', label: 'Fig. 15.1' },
          ],
        },
        {
          name: 'Ruptured ectopic pregnancy',
          urgent: true,
          for: ['Woman of child-bearing age; missed period', 'Lower abdominal pain, shock', 'Cervical motion or adnexal tenderness, adnexal mass'],
          refs: [{ chapter: 15, pages: '273–274', label: 'Fig. 15.1' }],
        },
        {
          name: 'Bowel obstruction',
          urgent: true,
          for: ['Colicky pain, vomiting, constipation, distension', 'Visible peristalsis, obstructed bowel sounds, scars, hernia'],
          refs: [
            { chapter: 13, pages: '218' },
            { chapter: 15, pages: '273', label: 'Good signs guide 15.2' },
          ],
        },
        {
          name: 'Acute pancreatitis',
          urgent: true,
          for: ['Steady epigastric pain to the back, eased sitting forward; vomiting', 'Alcohol or gallstones; flank or umbilical bruising if severe'],
          refs: [
            { chapter: 13, pages: '218' },
            { chapter: 14, pages: '247–248' },
          ],
        },
        {
          name: 'Myocardial infarction, basal pneumonia, diabetic ketoacidosis',
          urgent: true,
          for: ['Upper abdominal pain from outside the abdomen', 'Check ECG, chest, blood sugar and urine ketones'],
          refs: [
            { chapter: 15, pages: '273–274', label: 'Fig. 15.1' },
          ],
        },
      ],
    },
    {
      heading: 'By where it hurts (book Fig. 15.1)',
      items: [
        {
          name: 'Right upper quadrant: cholecystitis, biliary pain, hepatitis',
          for: ['Biliary pain: severe and constant (not colicky) for hours, epigastric or right upper quadrant', 'Murphy’s sign; fever in cholecystitis'],
          refs: [
            { chapter: 13, pages: '218, 227' },
            { chapter: 15, pages: '273', label: 'Fig. 15.1' },
          ],
        },
        {
          name: 'Epigastrium: peptic ulcer, pancreatitis, MI, oesophageal causes',
          for: ['Ulcer: dull or burning, eased by food or antacids, wakes at night'],
          refs: [
            { chapter: 13, pages: '218' },
            { chapter: 15, pages: '273', label: 'Fig. 15.1' },
          ],
        },
        {
          name: 'Right iliac fossa: appendicitis, ectopic, salpingitis, renal stone, Crohn’s',
          for: ['Appendicitis: central pain moving to the right iliac fossa, fever, McBurney’s point tenderness'],
          refs: [
            { chapter: 15, pages: '273–274', label: 'Fig. 15.1, Good signs guide 15.3' },
          ],
        },
        {
          name: 'Left iliac fossa: diverticulitis, ectopic, salpingitis, colitis',
          for: ['Sigmoid diverticulitis; in women, also ectopic pregnancy and salpingitis'],
          refs: [{ chapter: 15, pages: '273', label: 'Fig. 15.1' }],
        },
        {
          name: 'Loin to groin: renal or ureteric stone, pyelonephritis',
          for: ['Colicky waves on a constant pain, can’t keep still', 'Blood on dipstick'],
          refs: [
            { chapter: 13, pages: '218' },
            { chapter: 15, pages: '273–274', label: 'Fig. 15.1' },
          ],
        },
        {
          name: 'Central or generalised: early appendicitis, obstruction, mesenteric ischaemia, aneurysm',
          for: ['Small-bowel colic every few minutes; large-bowel colic every 10–15 minutes'],
          refs: [
            { chapter: 13, pages: '218' },
            { chapter: 15, pages: '273', label: 'Fig. 15.1' },
          ],
        },
        {
          name: 'Abdominal wall pain; herpes zoster',
          for: ['Tenderness persists with tensed muscles', 'Band-like pain before the rash'],
          refs: [
            { chapter: 14, pages: '257' },
            { chapter: 15, pages: '274' },
          ],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 15, pages: '274' },
        { chapter: 14, pages: '269' },
      ],
      points: [
        { text: 'Urine dipstick: glucose and ketones, blood, protein, bilirubin' },
        { text: 'Pregnancy test in every woman of child-bearing age', urgent: true, extra: true },
        { text: 'ECG in older patients or upper abdominal pain', extra: true },
        { text: 'Bedside ultrasound (aorta, free fluid, gallbladder) if available', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 15, pages: '272–273' }],
      points: [
        { text: 'Does this patient need an operation now, or observation and reassessment?' },
        { text: 'Shock with abdominal pain: bleeding, fluid loss or sepsis', urgent: true },
        { text: 'Generalised peritonitis: call the surgeons (except pancreatitis)', urgent: true },
        { text: 'Give pain relief; it does not hide the diagnosis' },
        { text: 'Re-examine and repeat vital signs often' },
        { text: 'Then follow the hospital’s abdominal pain flowchart and checklist below' },
      ],
    },
  ],
};

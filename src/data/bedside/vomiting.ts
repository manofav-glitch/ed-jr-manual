import type { BedsideTopic } from '../bedsideTypes.ts';
import { ABDO_EXAM, FIRST_LOOK } from './shared.ts';

export const vomiting: BedsideTopic = {
  id: 'vomiting',
  title: 'Fever, nausea and vomiting',
  flowcharts: ['2.1'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'The vomiting',
      refs: [
        { chapter: 13, pages: '218–219', label: 'Questions box 13.1' },
      ],
      points: [
        { text: 'What happens exactly? True vomiting, or effortless regurgitation of food (rumination)?' },
        { text: 'How long: hours to days, or weeks?' },
        { text: 'Nausea first, or vomiting without warning?', hint: 'No nausea: bowel obstruction, raised intracranial pressure' },
        { text: 'Timing: straight after meals, or more than an hour after?', hint: 'Late: gastric outlet obstruction, gastroparesis' },
        { text: 'Early morning before eating?', hint: 'Pregnancy, alcohol, raised intracranial pressure' },
        { text: 'What does it look like: blood, coffee grounds, bile, old food, faeculent?', urgent: true, hint: 'Bleeding; obstruction' },
        { text: 'Episodes with long well spells in between?', hint: 'Cyclical vomiting' },
        { text: 'Able to keep fluids down? Passing urine?', hint: 'Dehydration', extra: true },
      ],
    },
    {
      heading: 'With it',
      refs: [
        { chapter: 13, pages: '217–219', label: 'Questions box 13.1' },
        { chapter: 45, pages: '835', label: 'Questions box 45.1' },
      ],
      points: [
        { text: 'Abdominal pain: where, what kind?', urgent: true },
        { text: 'Diarrhoea; others ill after the same food', hint: 'Gastroenteritis, food poisoning' },
        { text: 'No stool or flatus, distension', urgent: true, hint: 'Bowel obstruction' },
        { text: 'Worsening headache, neck stiffness, drowsiness', urgent: true, hint: 'Raised intracranial pressure, meningitis' },
        { text: 'Fever: how high, rigors?', urgent: true, hint: 'Rigors suggest bacteraemia' },
        { text: 'Burning urine, loin pain', hint: 'Pyelonephritis' },
        { text: 'Jaundice, dark urine', hint: 'Hepatobiliary disease' },
        { text: 'Chest pain', urgent: true, hint: 'Myocardial infarction can present as epigastric pain and vomiting' },
        { text: 'Weight loss', urgent: true },
        { text: 'Recent travel; others ill' },
      ],
    },
    {
      heading: 'Background',
      refs: [{ chapter: 13, pages: '219' }],
      points: [
        { text: 'Could she be pregnant? Last period' },
        { text: 'Drugs: digoxin, opioids, chemotherapy, new medicines' },
        { text: 'Diabetes: blood sugar control, ketones', hint: 'Diabetic ketoacidosis; gastroparesis' },
        { text: 'Alcohol' },
        { text: 'Previous abdominal surgery', hint: 'Adhesions', extra: true },
        { text: 'Peptic ulcer history', hint: 'Gastric outlet obstruction' },
      ],
    },
  ],
  exam: [
    {
      heading: 'Vital signs and fluid status',
      refs: [
        { chapter: 3, pages: '46–47', label: 'Hydration' },
        { chapter: 15, pages: '272' },
        { chapter: 47, pages: '871' },
      ],
      points: [
        { text: 'Temperature, pulse, BP, respiratory rate' },
        { text: 'Postural BP, dry tongue, reduced skin turgor', hint: 'Dehydration' },
        { text: 'Tachycardia, low BP, poor perfusion, confusion', urgent: true, hint: 'Sepsis or severe fluid loss' },
        { text: 'Blood sugar' },
      ],
    },
    ...ABDO_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 14, pages: '255' },
        { chapter: 15, pages: '273–274' },
        { chapter: 45, pages: '836' },
      ],
      points: [
        { text: 'Distension, visible peristalsis, tinkling bowel sounds, hernias', urgent: true, hint: 'Bowel obstruction' },
        { text: 'Succussion splash', hint: 'Gastric outlet obstruction' },
        { text: 'Neck stiffness, focal neurological signs, papilloedema', urgent: true, hint: 'Meningitis, raised intracranial pressure' },
        { text: 'Deep sighing breathing, ketones on the breath', urgent: true, hint: 'Diabetic ketoacidosis' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Bowel obstruction',
          urgent: true,
          for: ['Colicky pain, distension, constipation', 'Vomiting with little nausea; faeculent vomit late', 'Visible peristalsis, obstructed bowel sounds; scars or hernia'],
          refs: [
            { chapter: 13, pages: '218–219' },
            { chapter: 15, pages: '273', label: 'Good signs guide 15.2' },
          ],
        },
        {
          name: 'Surgical abdomen (appendicitis, cholecystitis, pancreatitis, perforation)',
          urgent: true,
          for: ['Localised pain and tenderness; peritonism'],
          refs: [
            { chapter: 15, pages: '272–274', label: 'Fig. 15.1' },
          ],
        },
        {
          name: 'Raised intracranial pressure or meningitis',
          urgent: true,
          for: ['Headache, early morning vomiting without nausea', 'Neck stiffness, drowsiness, focal signs'],
          refs: [
            { chapter: 13, pages: '219', label: 'Questions box 13.1' },
          ],
        },
        {
          name: 'Diabetic ketoacidosis',
          urgent: true,
          for: ['Diabetes, high blood sugar, ketones; deep rapid breathing; abdominal pain'],
          refs: [{ chapter: 15, pages: '274' }],
        },
        {
          name: 'Sepsis (e.g. pyelonephritis, cholangitis)',
          urgent: true,
          for: ['Fever, rigors, tachycardia, low BP'],
          refs: [{ chapter: 47, pages: '871' }],
        },
        {
          name: 'Myocardial infarction',
          urgent: true,
          for: ['Epigastric or chest pain, sweating, risk factors'],
          refs: [{ chapter: 15, pages: '273', label: 'Fig. 15.1' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Gastroenteritis or food poisoning',
          for: ['Acute; diarrhoea; others ill after the same food; fever'],
          refs: [{ chapter: 13, pages: '218' }],
        },
        {
          name: 'Pregnancy',
          for: ['Missed period, early morning nausea'],
          refs: [{ chapter: 13, pages: '219' }],
        },
        {
          name: 'Drugs and alcohol',
          for: ['Digoxin, opioids, chemotherapy; heavy drinking'],
          refs: [{ chapter: 13, pages: '219' }],
        },
        {
          name: 'Acute hepatobiliary disease',
          for: ['Right upper quadrant pain, jaundice, fever'],
          refs: [{ chapter: 13, pages: '218–219' }],
        },
        {
          name: 'Gastric outlet obstruction or gastroparesis',
          for: ['Vomiting old food more than an hour after meals', 'Ulcer history, diabetes, gastric surgery; succussion splash'],
          refs: [
            { chapter: 13, pages: '219' },
            { chapter: 14, pages: '255' },
          ],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 14, pages: '268–269' },
        { chapter: 15, pages: '274' },
      ],
      points: [
        { text: 'Look at the vomit' },
        { text: 'Urine dipstick: glucose and ketones, blood, protein, bilirubin' },
        { text: 'Blood sugar; pregnancy test in women of child-bearing age' },
        { text: 'ECG if older or any chest or epigastric pain', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 15, pages: '272' }],
      points: [
        { text: 'Shocked, peritonitic, obstructed, or neurological signs: urgent', urgent: true },
        { text: 'Fluids: how dry, and can they drink?', extra: true },
        { text: 'Then follow the hospital’s fever, nausea and vomiting flowchart and checklist below' },
      ],
    },
  ],
};

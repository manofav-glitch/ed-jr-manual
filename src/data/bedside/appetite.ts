import type { BedsideTopic } from '../bedsideTypes.ts';
import { ABDO_EXAM } from './shared.ts';

export const appetite: BedsideTopic = {
  id: 'loss-of-appetite',
  title: 'Loss of appetite',
  flowcharts: ['3.6'],
  reviewed: false,
  history: [
    {
      heading: 'Appetite and weight',
      refs: [{ chapter: 13, pages: '218' }],
      points: [
        { text: 'When did it start?' },
        { text: 'How much weight lost, over what time? (weigh them)' },
        { text: 'Poor appetite and weight loss together?', urgent: true, hint: 'Suspect cancer' },
        { text: 'Weight loss with a good appetite?', hint: 'Malabsorption, thyrotoxicosis' },
        { text: 'Full after small meals?', hint: 'Gastric disease' },
        { text: 'Change in taste; went off cigarettes', hint: 'Liver disease, hepatitis' },
      ],
    },
    {
      heading: 'Alarm and system questions',
      refs: [
        { chapter: 13, pages: '217–227' },
        { chapter: 45, pages: '834–835' },
      ],
      points: [
        { text: 'Difficulty swallowing', urgent: true },
        { text: 'Vomiting, vomiting blood, black stools', urgent: true },
        { text: 'Change in bowel habit, blood in stools', urgent: true },
        { text: 'Jaundice, dark urine, itching' },
        { text: 'Abdominal pain, swelling' },
        { text: 'Fever, night sweats', hint: 'TB, lymphoma' },
        { text: 'Cough, haemoptysis; breathlessness' },
        { text: 'Low mood, loss of interest, poor sleep', hint: 'Depression' },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 13, pages: '226–227' },
        { chapter: 1, pages: '15–19' },
      ],
      points: [
        { text: 'Medicines (many cause nausea and poor appetite)' },
        { text: 'Alcohol' },
        { text: 'Kidney, liver, heart or lung disease; diabetes' },
        { text: 'Living alone, money, access to food; who cooks?' },
        { text: 'Smoking' },
      ],
    },
  ],
  exam: [
    {
      heading: 'General',
      refs: [
        { chapter: 3, pages: '45–47' },
        { chapter: 16, pages: '282–284', label: 'Text box 16.1' },
      ],
      points: [
        { text: 'Weight and body build; muscle wasting' },
        { text: 'Hydration' },
        { text: 'Pallor, jaundice' },
        { text: 'All lymph node groups if malignancy is suspected' },
      ],
    },
    ...ABDO_EXAM,
    {
      heading: 'Elsewhere',
      refs: [
        { chapter: 16, pages: '284' },
        { chapter: 12, pages: '201–203', label: 'Text box 12.1' },
      ],
      points: [
        { text: 'Chest: signs of cancer, TB, effusion' },
        { text: 'Breasts' },
        { text: 'Thyroid', extra: true },
        { text: 'Mood and mental state', extra: true },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Think of',
      items: [
        {
          name: 'Cancer (gastric, oesophageal, colon, pancreas, lung, and others)',
          urgent: true,
          for: ['Poor appetite with weight loss', 'Alarm features: dysphagia, bleeding, change in bowel habit', 'Mass, nodes, liver enlargement'],
          refs: [
            { chapter: 13, pages: '218, 227' },
          ],
        },
        {
          name: 'Liver disease (hepatitis, cirrhosis)',
          for: ['Change in taste, jaundice, lethargy; alcohol', 'Signs of chronic liver disease'],
          refs: [
            { chapter: 13, pages: '218, 226' },
            { chapter: 15, pages: '274–275' },
          ],
        },
        {
          name: 'Peptic ulcer, gastric outlet obstruction',
          for: ['Early fullness; epigastric pain; vomiting old food'],
          refs: [{ chapter: 13, pages: '218–219' }],
        },
        {
          name: 'Chronic infection (TB and others)',
          for: ['Fever, night sweats, cough'],
          refs: [{ chapter: 45, pages: '834–835', label: 'List 45.1' }],
        },
        {
          name: 'Depression',
          for: ['Low mood, loss of interest'],
          refs: [{ chapter: 13, pages: '218' }],
        },
        {
          name: 'Malabsorption or thyrotoxicosis',
          for: ['Weight loss with a normal or increased appetite'],
          refs: [{ chapter: 13, pages: '218' }],
        },
        {
          name: 'Chronic kidney, heart or lung disease; drugs; alcohol',
          extra: true,
          for: ['Known disease; medicine list'],
          refs: [],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 14, pages: '264–269' }],
      points: [
        { text: 'Weight recorded' },
        { text: 'Rectal examination' },
        { text: 'Urine dipstick (bilirubin, glucose, protein, blood)' },
        { text: 'Blood sugar', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 13, pages: '218, 227', label: 'T&O’C essentials' }],
      points: [
        { text: 'Poor appetite with weight loss or other alarm symptoms: needs investigation for cancer' },
        { text: 'Unable to eat or drink, dehydrated, or unsafe at home: admit', extra: true },
        { text: 'Then follow the hospital’s loss of appetite flowchart below' },
      ],
    },
  ],
};

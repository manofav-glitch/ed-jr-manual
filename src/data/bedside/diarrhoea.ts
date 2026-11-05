import type { BedsideTopic } from '../bedsideTypes.ts';
import { ABDO_EXAM, FIRST_LOOK } from './shared.ts';

export const diarrhoea: BedsideTopic = {
  id: 'diarrhoea',
  title: 'Loose stools (diarrhoea)',
  flowcharts: ['2.2', '3.3'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'Is it really diarrhoea?',
      refs: [{ chapter: 13, pages: '222' }],
      points: [
        { text: 'How many stools a day now, and what is normal for them?' },
        { text: 'Loose or watery, or just frequent small formed stools?', hint: 'Frequent formed stools: rectal problem, not true diarrhoea' },
        { text: 'Acute (days) or chronic (weeks)?', hint: 'Acute: usually infection' },
      ],
    },
    {
      heading: 'The stools',
      refs: [
        { chapter: 13, pages: '222–223', label: 'Questions box 13.4' },
      ],
      points: [
        { text: 'Blood, mucus or pus?', urgent: true, hint: 'Colonic disease: colitis, cancer' },
        { text: 'Large watery volumes', hint: 'Small bowel or secretory (e.g. cholera)' },
        { text: 'Small frequent stools with urgency', hint: 'Colon' },
        { text: 'Pale, greasy, smelly, hard to flush', hint: 'Malabsorption' },
        { text: 'Woken at night by it?', hint: 'Organic cause more likely' },
        { text: 'Does it stop when fasting?', hint: 'Yes: osmotic. No: secretory' },
        { text: 'Leakage or incontinence' },
      ],
    },
    {
      heading: 'With it',
      refs: [{ chapter: 13, pages: '222', label: 'Questions box 13.4' }],
      points: [
        { text: 'Fever, rigors', urgent: true, hint: 'Infection' },
        { text: 'Weight loss', urgent: true, hint: 'Cancer, malabsorption' },
        { text: 'Vomiting; keeping fluids down; urine output', extra: true },
        { text: 'Abdominal pain: where; relieved by opening the bowels?' },
        { text: 'Joint pain, eye or skin problems', hint: 'Inflammatory bowel disease' },
        { text: 'Weight loss despite a good appetite', hint: 'Thyrotoxicosis, malabsorption' },
      ],
    },
    {
      heading: 'Exposures and background',
      refs: [{ chapter: 13, pages: '222', label: 'Questions box 13.4' }],
      points: [
        { text: 'Antibiotics recently?', urgent: true, hint: 'Clostridium difficile' },
        { text: 'Travel: where?', hint: 'Giardia and other infections' },
        { text: 'Others ill; food eaten', extra: true },
        { text: 'Known IBD, previous bowel or gastric surgery' },
        { text: 'Frequent infections, HIV, immunosuppression', hint: 'Immune deficiency' },
        { text: 'New medicines, magnesium antacids, laxatives' },
        { text: 'Family history of coeliac disease or IBD' },
      ],
    },
  ],
  exam: [
    {
      heading: 'How dry, how sick?',
      refs: [
        { chapter: 3, pages: '46–47', label: 'Hydration' },
        { chapter: 47, pages: '869–871' },
      ],
      points: [
        { text: 'Pulse, BP lying and sitting, temperature' },
        { text: 'Dry tongue, reduced skin turgor, sunken eyes, low urine output', hint: 'Dehydration' },
        { text: 'Low BP, tachycardia, cold peripheries, confusion', urgent: true, hint: 'Severe dehydration or sepsis' },
      ],
    },
    ...ABDO_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 15, pages: '277–280' },
        { chapter: 14, pages: '264–268' },
      ],
      points: [
        { text: 'Tender, distended abdomen with fever in bloody diarrhoea', urgent: true, hint: 'Severe colitis' },
        { text: 'Mouth ulcers, perianal tags or fistulae, red eyes, erythema nodosum', hint: 'Inflammatory bowel disease' },
        { text: 'Rectal examination: mass, blood, stool appearance' },
        { text: 'Signs of thyrotoxicosis', extra: true },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Acute',
      items: [
        {
          name: 'Infective gastroenteritis or food poisoning',
          for: ['Sudden onset; fever; vomiting; others ill; travel'],
          refs: [{ chapter: 13, pages: '218, 222' }],
        },
        {
          name: 'Cholera and other secretory infections',
          urgent: true,
          for: ['Large watery volumes that continue when fasting', 'Rapid dehydration'],
          refs: [{ chapter: 13, pages: '222–223' }],
        },
        {
          name: 'Clostridium difficile colitis',
          urgent: true,
          for: ['Recent antibiotics or hospital stay'],
          refs: [{ chapter: 13, pages: '222', label: 'Questions box 13.4' }],
        },
        {
          name: 'Bloody diarrhoea: infective, inflammatory or ischaemic colitis',
          urgent: true,
          for: ['Blood and mucus, urgency, fever', 'Ischaemic: older, vascular disease, AF'],
          refs: [
            { chapter: 13, pages: '223' },
            { chapter: 15, pages: '274' },
          ],
        },
        {
          name: 'Drugs',
          for: ['New medicine, magnesium antacids, laxatives'],
          refs: [{ chapter: 13, pages: '223' }],
        },
      ],
    },
    {
      heading: 'Chronic',
      items: [
        {
          name: 'Inflammatory bowel disease',
          for: ['Blood, mucus, urgency, night symptoms, weight loss', 'Joint, eye, skin or perianal disease; family history'],
          refs: [
            { chapter: 13, pages: '222–223', label: 'Questions box 13.4' },
            { chapter: 15, pages: '277–279' },
          ],
        },
        {
          name: 'Colon cancer',
          urgent: true,
          for: ['Older; blood; change in bowel habit; weight loss; mass'],
          refs: [{ chapter: 13, pages: '223–224' }],
        },
        {
          name: 'Malabsorption (coeliac disease, pancreatic)',
          for: ['Pale, greasy, smelly stools; oil drops; weight loss'],
          refs: [
            { chapter: 13, pages: '222–223', label: 'Questions box 13.4' },
            { chapter: 15, pages: '279–280' },
          ],
        },
        {
          name: 'Osmotic (lactose intolerance, magnesium)',
          for: ['Stops with fasting; related to food'],
          refs: [{ chapter: 13, pages: '223' }],
        },
        {
          name: 'Thyrotoxicosis',
          for: ['Weight loss despite a good appetite'],
          refs: [{ chapter: 13, pages: '218, 223' }],
        },
        {
          name: 'Irritable bowel syndrome',
          for: ['Pain relieved by defecation; alternating bowel habit; bloating', 'No alarm features'],
          against: ['Not if blood, weight loss, night symptoms or fever'],
          refs: [{ chapter: 13, pages: '224, 227', label: 'List 13.3' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 14, pages: '264–269' }],
      points: [
        { text: 'Look at the stool: blood, mucus, pus, fat' },
        { text: 'Rectal examination' },
        { text: 'Stool culture (and C. difficile) if bloody, febrile or after antibiotics', extra: true },
        { text: 'Electrolytes and kidney function if dehydrated', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [
        { chapter: 13, pages: '222–223' },
      ],
      points: [
        { text: 'Severe dehydration, shock, or toxic colitis: urgent', urgent: true },
        { text: 'Blood, weight loss, fever or night symptoms: organic cause, needs investigation' },
        { text: 'Then follow the hospital’s loose stools flowchart and checklist below' },
      ],
    },
  ],
};

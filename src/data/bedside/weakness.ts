import type { BedsideTopic } from '../bedsideTypes.ts';
import { FIRST_LOOK, NEURO_EXAM } from './shared.ts';

export const weakness: BedsideTopic = {
  id: 'generalised-weakness',
  title: 'Generalised weakness',
  flowcharts: ['7.2'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'Weak, or tired?',
      refs: [
        { chapter: 31, pages: '496' },
        { chapter: 4, pages: '67' },
      ],
      points: [
        { text: 'True loss of strength (can’t lift, climb, grip), or tiredness and lack of energy?', hint: 'Tiredness: anaemia, heart failure, depression, infection' },
        { text: 'All over, one side, both legs, or proximal (stairs, rising from a chair, combing hair)?' },
        { text: 'Gets worse with repeated use; double vision, drooping eyelids, slurred speech late in the day', urgent: true, hint: 'Myasthenia' },
        { text: 'Ascending from the legs, with tingling and back pain, after an infection', urgent: true, hint: 'Guillain–Barré syndrome' },
        { text: 'Breathless, can’t swallow, weak cough', urgent: true, hint: 'Respiratory or bulbar weakness' },
        { text: 'Onset: sudden, over days, or over months?', hint: 'Time course points to the cause' },
      ],
    },
    {
      heading: 'Systemic causes',
      refs: [
        { chapter: 35, pages: '591', label: 'List 35.8' },
        { chapter: 17, pages: '301–302' },
      ],
      points: [
        { text: 'Diarrhoea, vomiting, diuretics; previous episodes of paralysis', hint: 'Low (or high) potassium: periodic paralysis' },
        { text: 'Kidney failure', hint: 'High potassium' },
        { text: 'Thyroid, Cushing’s, steroid use', hint: 'Endocrine myopathy' },
        { text: 'Fever, infection; poor intake; recent illness' },
        { text: 'Bleeding, pallor', hint: 'Anaemia' },
        { text: 'Weight loss, cancer', hint: 'Carcinoma, paraneoplastic' },
        { text: 'Muscle pain, dark urine, statins', hint: 'Myositis, rhabdomyolysis' },
        { text: 'Low mood, poor sleep', hint: 'Depression' },
      ],
    },
    {
      heading: 'Drugs, alcohol, family',
      refs: [
        { chapter: 31, pages: '497–498', label: 'List 31.4' },
        { chapter: 35, pages: '591', label: 'List 35.8' },
      ],
      points: [
        { text: 'Statins, steroids, chloroquine; sedatives; BP tablets' },
        { text: 'Alcohol', hint: 'Myopathy, neuropathy' },
        { text: 'Family history of muscle or nerve disease' },
      ],
    },
  ],
  exam: [
    {
      heading: 'Danger signs',
      refs: [
        { chapter: 35, pages: '584' },
        { chapter: 47, pages: '870', label: 'List 47.2' },
      ],
      points: [
        { text: 'Breathing: rate, effort; FEV₁ and FVC if available', urgent: true, hint: 'GBS can cause fatal respiratory failure' },
        { text: 'Can they count to 20 in one breath?', extra: true },
        { text: 'Swallow and cough', urgent: true },
        { text: 'Pulse and BP; dehydration' },
      ],
    },
    ...NEURO_EXAM,
    {
      heading: 'Which pattern? (book List 35.3)',
      refs: [
        { chapter: 31, pages: '496' },
        { chapter: 35, pages: '583', label: 'List 35.3' },
      ],
      points: [
        { text: 'Upper motor neurone: increased tone and reflexes, upgoing plantars, little wasting' },
        { text: 'Lower motor neurone: wasting, fasciculation, low tone, reduced reflexes' },
        { text: 'Muscle: proximal weakness, reflexes reduced, wasting; tenderness (myositis)' },
        { text: 'Neuromuscular junction: fatigable, normal reflexes and tone, ptosis' },
        { text: 'Non-organic: pattern doesn’t fit anatomy, normal tone and reflexes' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Guillain–Barré syndrome',
          urgent: true,
          for: ['Ascending flaccid weakness, absent reflexes, back pain, patchy sensory loss', 'A week or two after an infection (often diarrhoea)', 'Sphincters little affected'],
          refs: [{ chapter: 35, pages: '583–584' }],
        },
        {
          name: 'Myasthenic crisis',
          urgent: true,
          for: ['Fatigable weakness; ptosis, diplopia; bulbar and breathing weakness'],
          refs: [{ chapter: 35, pages: '593' }],
        },
        {
          name: 'Spinal cord compression',
          urgent: true,
          for: ['Legs more than arms; a sensory level; bladder or bowel change; back pain'],
          refs: [{ chapter: 35, pages: '585–587', label: 'List 35.7' }],
        },
        {
          name: 'Potassium disturbance (periodic paralysis)',
          urgent: true,
          for: ['Diarrhoea, vomiting, diuretics, kidney failure; previous attacks'],
          refs: [{ chapter: 35, pages: '591', label: 'List 35.8' }],
        },
        {
          name: 'Stroke (bilateral or brainstem)',
          urgent: true,
          for: ['Sudden onset; cranial nerve signs; crossed signs'],
          refs: [{ chapter: 35, pages: '580–582', label: 'Table 35.1' }],
        },
        {
          name: 'Sepsis, dehydration, hypoglycaemia in an older patient',
          urgent: true,
          extra: true,
          for: ['“Off legs”, confused; fever or low temperature; no focal signs'],
          refs: [],
        },
      ],
    },
    {
      heading: 'Other',
      items: [
        {
          name: 'Myopathy (polymyositis, alcohol, endocrine, drugs, carcinoma)',
          for: ['Proximal weakness; trouble rising from a chair; muscle tenderness; rash (dermatomyositis)'],
          refs: [{ chapter: 35, pages: '590–593', label: 'List 35.8' }],
        },
        {
          name: 'Peripheral neuropathy',
          for: ['Distal weakness and glove-and-stocking sensory loss; diabetes, alcohol, drugs'],
          refs: [{ chapter: 35, pages: '583–584', label: 'List 35.4' }],
        },
        {
          name: 'Motor neurone disease',
          for: ['Mixed upper and lower motor neurone signs; fasciculation; no sensory loss'],
          refs: [{ chapter: 35, pages: '583' }],
        },
        {
          name: 'Tiredness rather than weakness (anaemia, heart failure, depression, infection)',
          for: ['Normal power on testing'],
          refs: [
            { chapter: 4, pages: '67' },
            { chapter: 13, pages: '226' },
          ],
        },
        {
          name: 'Non-organic weakness',
          for: ['Non-anatomical pattern; normal tone, reflexes and bulk'],
          against: ['Only after organic causes have been looked for'],
          refs: [{ chapter: 31, pages: '496' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 35, pages: '584' }],
      points: [
        { text: 'FEV₁ and FVC if neuromuscular weakness: repeat regularly' },
        { text: 'Blood sugar; potassium, sodium, calcium, magnesium; CK; thyroid; blood count', extra: true },
        { text: 'ECG (potassium)', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 35, pages: '584' }],
      points: [
        { text: 'Falling vital capacity, weak cough or swallow: ICU review', urgent: true, extra: true },
        { text: 'Sensory level, saddle loss or sphincter change: urgent spinal imaging', urgent: true, extra: true },
        { text: 'Then follow the hospital’s generalised weakness flowchart below' },
      ],
    },
  ],
};

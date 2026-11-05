import type { BedsideTopic } from '../bedsideTypes.ts';
import { FIRST_LOOK, NEURO_EXAM } from './shared.ts';

export const feverHeadache: BedsideTopic = {
  id: 'fever-headache',
  title: 'Fever with headache and vomiting',
  flowcharts: ['13.6'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'Meningitis or encephalitis?',
      refs: [
        { chapter: 31, pages: '490–492', label: 'Questions box 31.3' },
        { chapter: 45, pages: '835–836' },
      ],
      points: [
        { text: 'Headache with fever, stiff neck, light hurting the eyes', urgent: true, hint: 'Meningitis' },
        { text: 'Onset over hours to days', hint: 'Infection' },
        { text: 'Confusion, odd behaviour, fits, drowsiness', urgent: true, hint: 'Encephalitis' },
        { text: 'Rash, especially one that doesn’t fade with pressure', urgent: true, hint: 'Meningococcal' },
        { text: 'Rigors', hint: 'Bacteraemia' },
        { text: 'Sudden onset, at its worst immediately', urgent: true, hint: 'Subarachnoid haemorrhage (fever can follow)' },
      ],
    },
    {
      heading: 'Where else could the fever come from?',
      refs: [{ chapter: 45, pages: '835', label: 'Questions box 45.1' }],
      points: [
        { text: 'Ear pain or discharge; sinus pain', hint: 'Spread to the brain (abscess, meningitis)' },
        { text: 'Cough, breathlessness' },
        { text: 'Burning urine' },
        { text: 'Travel; mosquito exposure', hint: 'Cerebral malaria', extra: true },
        { text: 'Contacts with meningitis or TB' },
      ],
    },
    {
      heading: 'Risk',
      refs: [
        { chapter: 45, pages: '835–836' },
        { chapter: 31, pages: '497' },
      ],
      points: [
        { text: 'Weak immunity: HIV, steroids, chemotherapy, diabetes, alcohol, no spleen', urgent: true, hint: 'TB, cryptococcal and other infections' },
        { text: 'Recent head injury or neurosurgery; CSF leak' },
        { text: 'Weeks of headache with fever and weight loss', hint: 'TB or cryptococcal meningitis' },
        { text: 'Antibiotics already taken (can mask signs)', extra: true },
        { text: 'Vaccination history', extra: true },
      ],
    },
  ],
  exam: [
    {
      heading: 'How sick?',
      refs: [
        { chapter: 47, pages: '870–871', label: 'List 47.2' },
        { chapter: 35, pages: '602', label: 'Table 35.4' },
      ],
      points: [
        { text: 'Temperature, pulse, BP, respiratory rate, SpO₂', hint: 'Septic shock' },
        { text: 'GCS, repeated', urgent: true },
        { text: 'Skin: petechial or purpuric rash (check the whole body)', urgent: true, hint: 'Meningococcal septicaemia' },
      ],
    },
    ...NEURO_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 32, pages: '501, 508–509' },
        { chapter: 45, pages: '836' },
      ],
      points: [
        { text: 'Neck stiffness, Kernig’s and Brudzinski’s signs', urgent: true },
        { text: 'Papilloedema, focal signs, falling GCS', urgent: true, hint: 'Abscess, raised intracranial pressure' },
        { text: 'Ears and sinuses' },
        { text: 'Murmur, splinter haemorrhages', hint: 'Endocarditis' },
        { text: 'Spleen', hint: 'Malaria, endocarditis' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Bacterial meningitis',
          urgent: true,
          for: ['Fever, headache, neck stiffness, photophobia, vomiting; confusion; rash'],
          refs: [
            { chapter: 31, pages: '491–492' },
            { chapter: 32, pages: '501' },
          ],
        },
        {
          name: 'Meningococcal septicaemia',
          urgent: true,
          for: ['Petechial or purpuric rash; shock'],
          refs: [
            { chapter: 47, pages: '871', label: 'Fig. 47.3' },
            { chapter: 43, pages: '818' },
          ],
        },
        {
          name: 'Encephalitis (e.g. herpes simplex)',
          urgent: true,
          for: ['Fever with confusion, behaviour change, fits, focal signs'],
          refs: [{ chapter: 31, pages: '490' }],
        },
        {
          name: 'Brain abscess',
          urgent: true,
          for: ['Ear, sinus or dental infection; endocarditis; focal signs; papilloedema'],
          refs: [
            { chapter: 45, pages: '836' },
            { chapter: 35, pages: '582' },
          ],
        },
        {
          name: 'Cerebral malaria',
          urgent: true,
          extra: true,
          for: ['Endemic area or travel; fever, confusion, fits; positive smear or rapid test'],
          refs: [],
        },
        {
          name: 'Subarachnoid haemorrhage',
          urgent: true,
          for: ['Instant severe headache; neck stiffness; low-grade fever can follow'],
          refs: [{ chapter: 31, pages: '491–492' }],
        },
      ],
    },
    {
      heading: 'Other',
      items: [
        {
          name: 'Viral meningitis',
          extra: true,
          for: ['Milder; alert; no rash; often in epidemics'],
          against: ['Treat as bacterial until proven otherwise'],
          refs: [],
        },
        {
          name: 'TB or cryptococcal meningitis',
          for: ['Weeks of illness; weight loss; HIV or immunosuppression'],
          refs: [{ chapter: 45, pages: '836' }],
        },
        {
          name: 'Systemic infection with headache (flu, pneumonia, UTI, dengue, typhoid)',
          for: ['Source elsewhere; no meningism'],
          refs: [{ chapter: 45, pages: '835' }],
        },
        {
          name: 'Sinusitis',
          for: ['Facial pain over the sinuses; nasal discharge'],
          refs: [{ chapter: 31, pages: '491–492' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 47, pages: '871' }],
      points: [
        { text: 'Blood cultures (before antibiotics, but don’t delay them)' },
        { text: 'Blood sugar; malaria test; blood count, CRP, lactate', extra: true },
        { text: 'CT head before lumbar puncture if focal signs, papilloedema, low GCS, fits or immunosuppression', extra: true },
        { text: 'Lumbar puncture when safe', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 47, pages: '871' }],
      points: [
        { text: 'Suspected bacterial meningitis or meningococcal rash: antibiotics immediately', urgent: true },
        { text: 'Encephalitis suspected: add aciclovir', urgent: true, extra: true },
        { text: 'Then follow the hospital’s fever with headache and vomiting flowchart and checklist below' },
      ],
    },
  ],
};

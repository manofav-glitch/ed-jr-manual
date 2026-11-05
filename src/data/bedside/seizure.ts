import type { BedsideTopic } from '../bedsideTypes.ts';
import { FIRST_LOOK, NEURO_EXAM } from './shared.ts';

export const seizure: BedsideTopic = {
  id: 'seizure',
  title: 'Abnormal body movements and seizure',
  flowcharts: ['5.1'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'Still fitting?',
      refs: [
        { chapter: 35, pages: '602' },
        { chapter: 47, pages: '870', label: 'List 47.2' },
      ],
      points: [
        { text: 'Recurrent or continuous fits without waking between', urgent: true, hint: 'Status epilepticus' },
        { text: 'Blood sugar now', urgent: true },
      ],
    },
    {
      heading: 'Was it a seizure? (ask the witness; phone video?)',
      refs: [
        { chapter: 31, pages: '492–494', label: 'Questions box 31.4, Table 31.1' },
        { chapter: 4, pages: '66', label: 'List 4.3' },
      ],
      points: [
        { text: 'Warning: strange smell or taste, déjà vu, rising feeling, fear', hint: 'Aura: a focal seizure' },
        { text: 'Or nausea, sweating, a hot room, standing up', hint: 'Faint (a few jerks can occur)' },
        { text: 'What did the movements look like: stiffening, jerking, one side, staring, lip smacking?' },
        { text: 'Started in one hand or one side and spread?', hint: 'Focal motor onset: look for a brain lesion' },
        { text: 'How long did it last?' },
        { text: 'Bitten tongue (side), incontinence, injury' },
        { text: 'Afterwards: drowsy, confused, aching, weak on one side?', hint: 'Post-ictal; Todd’s palsy' },
        { text: 'Prolonged, eyes forced shut, back arching, side-to-side head movements, with witnesses', hint: 'Psychogenic non-epileptic seizure' },
      ],
    },
    {
      heading: 'Why now?',
      refs: [
        { chapter: 31, pages: '493–498', label: 'Questions box 31.5, List 31.4' },
      ],
      points: [
        { text: 'Known epilepsy: diagnosis, usual pattern, last fit, medicines, missed doses' },
        { text: 'First fit ever?', urgent: true, hint: 'Look for a cause' },
        { text: 'Head injury, headache, fever, neck stiffness', urgent: true, hint: 'Bleed, meningitis, encephalitis' },
        { text: 'Diabetes: insulin or sulphonylurea', hint: 'Hypoglycaemia' },
        { text: 'Alcohol: heavy use or sudden stopping', hint: 'Withdrawal' },
        { text: 'Drugs and overdose (e.g. pethidine)', hint: 'Drug-induced seizures' },
        { text: 'Pregnant or just delivered?', urgent: true, hint: 'Eclampsia', extra: true },
        { text: 'Sleep loss, illness, flashing lights', extra: true },
        { text: 'Cancer, previous stroke, HIV' },
        { text: 'Family history of epilepsy' },
        { text: 'Drives? Works at heights or with machinery?' },
      ],
    },
  ],
  exam: [
    {
      heading: 'After the fit',
      refs: [
        { chapter: 35, pages: '602–604' },
      ],
      points: [
        { text: 'GCS, and is it improving?' },
        { text: 'Bitten tongue; injuries, especially head and shoulders' },
        { text: 'Temperature; neck stiffness; rash', urgent: true },
        { text: 'Pupils; focal weakness', urgent: true, hint: 'Structural lesion, or Todd’s palsy (should resolve)' },
        { text: 'BP' },
      ],
    },
    ...NEURO_EXAM,
  ],
  differentials: [
    {
      heading: 'Seizure with a cause to treat now',
      items: [
        {
          name: 'Hypoglycaemia',
          urgent: true,
          for: ['Diabetic on insulin or sulphonylurea; sweating, confusion first'],
          refs: [{ chapter: 31, pages: '494' }],
        },
        {
          name: 'Meningitis or encephalitis',
          urgent: true,
          for: ['Fever, headache, neck stiffness, confusion'],
          refs: [{ chapter: 31, pages: '490' }],
        },
        {
          name: 'Intracranial bleed, stroke, tumour, abscess',
          urgent: true,
          for: ['Focal onset; focal signs that persist; headache; head injury; papilloedema'],
          refs: [
            { chapter: 31, pages: '494' },
            { chapter: 35, pages: '582' },
          ],
        },
        {
          name: 'Drugs, alcohol or withdrawal',
          for: ['Pethidine, other drugs; heavy drinking or stopping'],
          refs: [{ chapter: 31, pages: '498', label: 'List 31.4' }],
        },
        {
          name: 'Eclampsia',
          urgent: true,
          extra: true,
          for: ['Pregnant or recently delivered; high BP; protein in urine'],
          refs: [],
        },
        {
          name: 'Electrolyte disturbance (low sodium, calcium) or kidney failure',
          for: ['Vomiting, diuretics; known kidney disease'],
          refs: [
            { chapter: 18, pages: '306' },
            { chapter: 47, pages: '870', label: 'List 47.1' },
          ],
        },
      ],
    },
    {
      heading: 'Epilepsy',
      items: [
        {
          name: 'Generalised tonic–clonic seizure',
          for: ['Abrupt loss of consciousness, stiffening then jerking, incontinence, bitten tongue, drowsy after'],
          refs: [{ chapter: 31, pages: '492–494', label: 'Table 31.1' }],
        },
        {
          name: 'Focal seizure (with or without loss of awareness)',
          for: ['Aura; staring and automatisms (lip smacking, picking); jerking spreading from one part'],
          refs: [{ chapter: 31, pages: '493–494', label: 'List 31.2' }],
        },
      ],
    },
    {
      heading: 'Not a seizure',
      items: [
        {
          name: 'Syncope (faint, or cardiac)',
          urgent: true,
          for: ['Pale, brief; quick recovery without confusion; a few jerks possible', 'Exertion, palpitations, heart disease: cardiac'],
          refs: [
            { chapter: 4, pages: '66', label: 'List 4.3' },
            { chapter: 31, pages: '492–493', label: 'Questions box 31.4' },
          ],
        },
        {
          name: 'Psychogenic non-epileptic seizure',
          for: ['Long episodes, eyes forced shut, back arching, non-rhythmic, side-to-side movements'],
          against: ['Getting it right matters: these do not respond to anticonvulsants'],
          refs: [{ chapter: 31, pages: '494–495', label: 'List 31.3' }],
        },
        {
          name: 'Other movement disorders (tremor, dystonia from drugs, chorea, myoclonus)',
          for: ['Fully conscious throughout; major tranquillisers (dyskinesia, dystonia)'],
          refs: [{ chapter: 31, pages: '496–497', label: 'Table 31.4' }],
        },
        {
          name: 'TIA or drop attack',
          for: ['Focal symptoms; falls without warning or loss of consciousness'],
          refs: [{ chapter: 31, pages: '494' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 31, pages: '493', label: 'Questions box 31.5' }],
      points: [
        { text: 'Blood sugar; ECG' },
        { text: 'Electrolytes, calcium, magnesium; anticonvulsant level if on treatment', extra: true },
        { text: 'Pregnancy test in women of child-bearing age', extra: true },
        { text: 'CT head: first fit, focal signs, head injury, not recovering, or on anticoagulants', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 35, pages: '602' }],
      points: [
        { text: 'Still fitting or not waking between fits: status epilepticus, treat now', urgent: true },
        { text: 'Advise about driving and safety', },
        { text: 'Then follow the hospital’s seizure flowchart and checklist below' },
      ],
    },
  ],
};

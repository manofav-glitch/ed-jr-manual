import type { BedsideTopic } from '../bedsideTypes.ts';
import { NEURO_EXAM } from './shared.ts';

export const dizziness: BedsideTopic = {
  id: 'dizziness',
  title: 'Dizziness',
  flowcharts: ['7.1'],
  reviewed: false,
  history: [
    {
      heading: 'What do they mean by dizzy?',
      refs: [
        { chapter: 31, pages: '493–495', label: 'Questions box 31.4' },
        { chapter: 4, pages: '66–67', label: 'List 4.3' },
      ],
      points: [
        { text: 'Room or self spinning?', hint: 'Vertigo' },
        { text: 'About to faint, light-headed, vision greying?', hint: 'Presyncope: think heart, BP, blood loss' },
        { text: 'Unsteady on the feet only?', hint: 'Balance, legs, neuropathy, cerebellum' },
        { text: 'Did they actually lose consciousness?', hint: 'See the syncope checklist' },
      ],
    },
    {
      heading: 'If vertigo',
      refs: [
        { chapter: 31, pages: '495', label: 'Table 31.2' },
      ],
      points: [
        { text: 'Brief spells (seconds) on rolling over in bed, lying down, looking up', hint: 'Benign paroxysmal positional vertigo' },
        { text: 'Constant for hours to days at rest', hint: 'Vestibular neuronitis, labyrinthitis, or stroke' },
        { text: 'Hearing loss or tinnitus with it?', hint: 'Labyrinthitis; Ménière’s (episodic, with tinnitus, progressive deafness)' },
        { text: 'Double vision, slurred speech, numbness, weakness, clumsy limbs, can’t walk', urgent: true, hint: 'Brainstem or cerebellar stroke' },
        { text: 'New severe headache or neck pain', urgent: true, hint: 'Cerebellar bleed, vertebral dissection', extra: true },
        { text: 'Migraine history', hint: 'Vestibular migraine (a great mimic)' },
        { text: 'Nausea, vomiting, sweating (common with any severe vertigo)' },
      ],
    },
    {
      heading: 'If presyncope',
      refs: [
        { chapter: 4, pages: '64–67', label: 'Lists 4.3, 4.4' },
        { chapter: 31, pages: '493', label: 'Questions box 31.4' },
      ],
      points: [
        { text: 'On standing up?', hint: 'Postural hypotension' },
        { text: 'Palpitations, chest pain, breathlessness, during exertion', urgent: true, hint: 'Arrhythmia, outflow obstruction' },
        { text: 'Bleeding, black stools, vomiting, diarrhoea, not eating', urgent: true },
        { text: 'Diabetes and its treatment', hint: 'Hypoglycaemia' },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 31, pages: '497–498', label: 'List 31.4' },
        { chapter: 31, pages: '489', label: 'List 31.1' },
      ],
      points: [
        { text: 'BP tablets, sedatives, anticonvulsants, aminoglycosides' },
        { text: 'Stroke risk factors: hypertension, diabetes, smoking, AF, previous stroke' },
        { text: 'Alcohol' },
        { text: 'Recent viral illness', hint: 'Vestibular neuronitis', extra: true },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 5, pages: '83–88' },
        { chapter: 4, pages: '66' },
      ],
      points: [
        { text: 'Pulse rate and rhythm; BP lying and standing' },
        { text: 'Blood sugar' },
        { text: 'Pallor' },
      ],
    },
    {
      heading: 'Eyes and ears',
      refs: [
        { chapter: 32, pages: '514–518', label: 'List 32.1' },
        { chapter: 36, pages: '609' },
      ],
      points: [
        { text: 'Nystagmus: follow your finger to 30° each side (fine nystagmus at the extremes is normal)' },
        { text: 'Horizontal nystagmus beating away from the bad ear, worse looking that way', hint: 'Peripheral (vestibular)' },
        { text: 'Purely torsional nystagmus; vertical nystagmus', urgent: true, hint: 'Central (vertical may also be ocular or neuromuscular)' },
        { text: 'Nystagmus that changes direction with gaze', urgent: true, hint: 'Central', extra: true },
        { text: 'Head impulse test (if nystagmus looks peripheral)' },
        { text: 'A corrective catch-up jerk on head impulse suggests a peripheral cause; a normal test with nystagmus is worrying', extra: true },
        { text: 'Dix–Hallpike test if the story suggests positional vertigo' },
        { text: 'Hearing (whisper test); look in the ear canals' },
      ],
    },
    {
      heading: 'Cerebellum and gait',
      refs: [
        { chapter: 35, pages: '595–596', label: 'List 35.11' },
        { chapter: 34, pages: '577–579' },
      ],
      points: [
        { text: 'Finger–nose and heel–shin: overshoot, intention tremor' },
        { text: 'Rapid alternating movements' },
        { text: 'Walk, if safe; can they stand unaided?' },
        { text: 'Unable to stand or walk unaided', urgent: true, hint: 'Central cause likely', extra: true },
      ],
    },
    ...NEURO_EXAM.slice(2, 4),
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Posterior circulation stroke (brainstem, cerebellum)',
          urgent: true,
          for: ['Vertigo with diplopia, limb ataxia, sensory change or other focal signs', 'Central nystagmus; can’t walk; vascular risk factors'],
          refs: [
            { chapter: 31, pages: '495' },
            { chapter: 35, pages: '581–582', label: 'Table 35.1, List 35.2' },
          ],
        },
        {
          name: 'Cardiac arrhythmia or outflow obstruction',
          urgent: true,
          for: ['Presyncope with palpitations, on exertion, or with heart disease'],
          refs: [{ chapter: 4, pages: '65–67', label: 'Table 4.4, List 4.3' }],
        },
        {
          name: 'Blood loss or dehydration',
          urgent: true,
          for: ['Postural drop, tachycardia; bleeding or fluid loss'],
          refs: [{ chapter: 4, pages: '66', label: 'List 4.3' }],
        },
        {
          name: 'Hypoglycaemia',
          urgent: true,
          for: ['Diabetic on treatment; low sugar'],
          refs: [{ chapter: 4, pages: '66', label: 'List 4.3' }],
        },
      ],
    },
    {
      heading: 'Vertigo (book Table 31.2)',
      items: [
        {
          name: 'Benign paroxysmal positional vertigo',
          for: ['Brief, recurrent, on moving the head (lying down, rolling over); no hearing loss', 'Positive Dix–Hallpike'],
          refs: [{ chapter: 31, pages: '495', label: 'Table 31.2' }],
        },
        {
          name: 'Vestibular neuronitis',
          for: ['Persistent vertigo at rest; normal hearing; peripheral nystagmus'],
          refs: [{ chapter: 31, pages: '495', label: 'Table 31.2' }],
        },
        {
          name: 'Labyrinthitis',
          for: ['Persistent vertigo with hearing loss'],
          refs: [{ chapter: 31, pages: '495', label: 'Table 31.2' }],
        },
        {
          name: 'Ménière’s disease',
          for: ['Episodic vertigo, tinnitus, progressive deafness; often over 50'],
          refs: [{ chapter: 31, pages: '495', label: 'Table 31.2' }],
        },
        {
          name: 'Vestibular migraine',
          for: ['Migraine history; hours to days; any pattern'],
          refs: [{ chapter: 31, pages: '495' }],
        },
        {
          name: 'Drugs (aminoglycosides, anticonvulsants, alcohol)',
          for: ['Drug history; oscillopsia with bilateral damage'],
          refs: [{ chapter: 31, pages: '495, 498', label: 'List 31.4' }],
        },
      ],
    },
    {
      heading: 'Presyncope or unsteadiness',
      items: [
        {
          name: 'Postural hypotension (drugs, dehydration)',
          for: ['On standing; BP tablets; BP falls on standing'],
          refs: [{ chapter: 4, pages: '66–67', label: 'Lists 4.3, 4.4' }],
        },
        {
          name: 'Peripheral neuropathy, cerebellar disease',
          for: ['Unsteady, worse in the dark; loss of vibration and position sense; ataxia'],
          refs: [
            { chapter: 34, pages: '577–579' },
            { chapter: 35, pages: '583–584, 595–596' },
          ],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 36, pages: '609' }],
      points: [
        { text: 'ECG; blood sugar; haemoglobin if pale', extra: true },
        { text: 'Postural BP recorded' },
        { text: 'Dix–Hallpike result recorded' },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 31, pages: '495' }],
      points: [
        { text: 'Any central feature (focal signs, central nystagmus, can’t walk): treat as stroke', urgent: true },
        { text: 'Presyncope: assess as for syncope' },
        { text: 'Then follow the hospital’s dizziness flowchart and checklist below' },
      ],
    },
  ],
};

import type { BedsideTopic } from '../bedsideTypes.ts';
import { NEURO_EXAM, UNCONSCIOUS_EXAM } from './shared.ts';

export const drowsy: BedsideTopic = {
  id: 'drowsy-alcohol',
  title: 'Drowsiness and alcohol intoxication',
  flowcharts: ['4.1'],
  reviewed: false,
  history: [
    {
      heading: 'First',
      refs: [
        { chapter: 47, pages: '867' },
        { chapter: 35, pages: '603–604' },
      ],
      points: [
        { text: 'Airway safe? Vomiting? Can they protect it?', urgent: true },
        { text: 'Blood sugar', urgent: true, hint: 'Never miss hypoglycaemia' },
        { text: 'Smelling of alcohol does not explain everything: look for something else', urgent: true },
      ],
    },
    {
      heading: 'What happened?',
      refs: [
        { chapter: 47, pages: '867' },
        { chapter: 31, pages: '489–490' },
      ],
      points: [
        { text: 'How much, what, over how long? (ask friends, ambulance staff)' },
        { text: 'Fall, fight or head injury?', urgent: true },
        { text: 'Fit?', hint: 'Seizure, or alcohol withdrawal' },
        { text: 'Tablets or drugs taken too?', urgent: true, hint: 'Mixed overdose' },
        { text: 'Self-harm intent or low mood', urgent: true },
        { text: 'Vomiting blood, black stools', urgent: true },
      ],
    },
    {
      heading: 'Is it delirium? (ask family or staff)',
      refs: [{ chapter: 47, pages: '867–870', label: 'Questions box 47.1, List 47.1' }],
      points: [
        { text: 'A recent change in mental state that comes and goes, or is worse at night?' },
        { text: 'Hard to concentrate, easily distracted?' },
        { text: 'Rambling, disorganised thinking?' },
        { text: 'Drowsy, or agitated and over-alert?' },
        { text: 'Causes: infection, stroke, seizure, bleed, MI, drugs (opioids, sedatives), alcohol or drug withdrawal, low oxygen, low sodium, low or high sugar, retention' },
      ],
    },
    {
      heading: 'Alcohol history',
      refs: [
        { chapter: 1, pages: '17–18', label: 'List 1.3' },
      ],
      points: [
        { text: 'Usual intake; heavy episodes (AUDIT-C questions)' },
        { text: 'Last drink: when?', hint: 'Withdrawal starts as levels fall', extra: true },
        { text: 'Previous withdrawal fits or delirium tremens', extra: true },
        { text: 'Known liver disease, pancreatitis, previous GI bleed' },
        { text: 'Eating poorly', hint: 'Thiamine deficiency (Wernicke’s)' },
      ],
    },
  ],
  exam: [
    ...UNCONSCIOUS_EXAM.slice(0, 2),
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 35, pages: '603–604' },
        { chapter: 15, pages: '275' },
        { chapter: 1, pages: '18', label: 'List 1.3' },
      ],
      points: [
        { text: 'Head injury: scalp wounds, bruising behind the ears, blood or fluid from ears or nose', urgent: true },
        { text: 'Unequal pupils, focal weakness', urgent: true, hint: 'Subdural or other bleed' },
        { text: 'Confusion with eye movement problems and unsteadiness', urgent: true, hint: 'Wernicke’s encephalopathy', extra: true },
        { text: 'Signs of liver disease; flapping tremor', hint: 'Hepatic encephalopathy' },
        { text: 'Tremor, sweating, fast pulse, agitation', hint: 'Withdrawal', extra: true },
        { text: 'Cold: temperature', hint: 'Hypothermia' },
        { text: 'Chest: aspiration' },
      ],
    },
    ...NEURO_EXAM.slice(2, 4),
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Head injury (subdural or extradural haematoma)',
          urgent: true,
          for: ['Fall or assault; unequal pupils; focal signs; getting drowsier'],
          refs: [{ chapter: 35, pages: '601, 603' }],
        },
        {
          name: 'Hypoglycaemia',
          urgent: true,
          for: ['Low sugar; poor intake; diabetes'],
          refs: [{ chapter: 35, pages: '601, 604' }],
        },
        {
          name: 'Mixed overdose',
          urgent: true,
          for: ['Pinpoint pupils, empty packets, history'],
          refs: [{ chapter: 35, pages: '601, 603' }],
        },
        {
          name: 'Wernicke’s encephalopathy',
          urgent: true,
          for: ['Heavy drinker, poor diet; confusion, eye movement problems, ataxia'],
          refs: [
            { chapter: 1, pages: '18', label: 'List 1.3' },
            { chapter: 32, pages: '518' },
          ],
        },
        {
          name: 'Meningitis, sepsis, aspiration pneumonia',
          urgent: true,
          for: ['Fever, neck stiffness, rash; low SpO₂'],
          refs: [
            { chapter: 47, pages: '870', label: 'List 47.1' },
            { chapter: 9, pages: '172' },
          ],
        },
        {
          name: 'Hepatic encephalopathy (often after a GI bleed or infection)',
          for: ['Jaundice, ascites, flap; known cirrhosis'],
          refs: [{ chapter: 15, pages: '275–276' }],
        },
      ],
    },
    {
      heading: 'Other',
      items: [
        {
          name: 'Alcohol intoxication alone',
          for: ['Improving steadily, no other findings'],
          against: ['A diagnosis to make only after the others are excluded, and after watching them improve'],
          refs: [{ chapter: 35, pages: '603–604' }],
        },
        {
          name: 'Alcohol withdrawal or delirium tremens',
          extra: true,
          for: ['Hours to days after the last drink; tremor, sweating, agitation, hallucinations, fits'],
          refs: [],
        },
        {
          name: 'Post-ictal state',
          for: ['Bitten tongue, incontinence; recovering over minutes to hours'],
          refs: [{ chapter: 31, pages: '493–494' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 35, pages: '604' },
        { chapter: 47, pages: '867' },
      ],
      points: [
        { text: 'Blood sugar, repeated' },
        { text: 'GCS recorded and repeated' },
        { text: 'Blood alcohol, electrolytes, liver tests; blood gas if very drowsy', extra: true },
        { text: 'CT head if injured, focal signs, or not improving as expected', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 47, pages: '867' }],
      points: [
        { text: 'Consciousness falling: recheck ABC, sugar, and think of a bleed', urgent: true },
        { text: 'Thiamine before glucose in heavy drinkers', extra: true },
        { text: 'Do not discharge until sober, safe and fully assessed', extra: true },
        { text: 'Then follow the hospital’s drowsiness and alcohol flowchart below' },
      ],
    },
  ],
};

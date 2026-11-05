import type { BedsideTopic } from '../bedsideTypes.ts';
import { NEURO_EXAM } from './shared.ts';

export const headache: BedsideTopic = {
  id: 'headache',
  title: 'Headache',
  flowcharts: ['8.0'],
  reviewed: false,
  history: [
    {
      heading: 'Danger questions',
      refs: [
        { chapter: 31, pages: '491–492', label: 'Questions box 31.3' },
      ],
      points: [
        { text: 'Sudden and severe, at its worst within moments (“thunderclap”)?', urgent: true, hint: 'Subarachnoid haemorrhage' },
        { text: 'Fever, neck stiffness, light hurting the eyes, rash', urgent: true, hint: 'Meningitis' },
        { text: 'Worse in the morning, with drowsiness or vomiting; worse coughing or straining', urgent: true, hint: 'Raised intracranial pressure' },
        { text: 'Over 50: one-sided temple pain, scalp tenderness, jaw pain on chewing, blurred or double vision', urgent: true, hint: 'Temporal arteritis (risk of blindness)' },
        { text: 'Weakness, numbness, speech or vision change, confusion, fit', urgent: true },
        { text: 'Head injury; on anticoagulants', urgent: true, extra: true },
        { text: 'Pregnant or just delivered', urgent: true, extra: true },
        { text: 'Red painful eye with blurred vision and haloes', urgent: true, hint: 'Acute glaucoma', extra: true },
      ],
    },
    {
      heading: 'The headache',
      refs: [
        { chapter: 31, pages: '490–492', label: 'Questions box 31.3' },
      ],
      points: [
        { text: 'What is it like: throbbing, tight band, stabbing?' },
        { text: 'Where: one side, front, back, behind the eye, over the cheeks?' },
        { text: 'How severe, how long does it last, how often?' },
        { text: 'Warning first: flashing lights, zigzag lines?', hint: 'Migraine with aura' },
        { text: 'Nausea, vomiting, light sensitivity?', hint: 'Migraine' },
        { text: 'Behind one eye, with a watering eye and running nose, waking at the same time each night, can’t keep still', hint: 'Cluster headache' },
        { text: 'Tight band, both sides, no other symptoms, not worse with walking', hint: 'Tension-type headache' },
        { text: 'During sex', hint: 'Coital headache (but exclude subarachnoid haemorrhage)' },
        { text: 'Heavy drinking last night', hint: 'Hangover' },
        { text: 'Is this like your usual headaches, or different?' },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 31, pages: '497–498', label: 'List 31.4' },
        { chapter: 47, pages: '867' },
      ],
      points: [
        { text: 'Painkiller use: how often?', hint: 'Medication-overuse headache' },
        { text: 'Nitrates, sildenafil', hint: 'Drug-induced headache' },
        { text: 'High BP' },
        { text: 'Cancer, HIV or immunosuppression', urgent: true, extra: true },
        { text: 'Obese, with morning headaches worse on coughing, and blurred vision', hint: 'Idiopathic intracranial hypertension' },
        { text: 'Gas heater or stove; others at home with headache', hint: 'Carbon monoxide', extra: true },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 32, pages: '501' },
        { chapter: 7, pages: '124–125' },
      ],
      points: [
        { text: 'Temperature, pulse, BP', hint: 'Fever; very high BP (malignant hypertension)' },
        { text: 'GCS and orientation' },
        { text: 'Neck stiffness and Kernig’s sign', urgent: true },
        { text: 'Rash (petechial)', urgent: true },
      ],
    },
    ...NEURO_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 31, pages: '492', label: 'Good signs guide 31.1' },
        { chapter: 32, pages: '508–509' },
      ],
      points: [
        { text: 'Papilloedema', urgent: true, hint: 'Raised intracranial pressure' },
        { text: 'Tender temporal artery', urgent: true, hint: 'Temporal arteritis' },
        { text: 'Third nerve palsy (droopy lid, dilated pupil, eye down and out)', urgent: true, hint: 'Posterior communicating artery aneurysm' },
        { text: 'Red eye, hazy cornea, fixed mid-dilated pupil', urgent: true, hint: 'Acute glaucoma', extra: true },
        { text: 'Tenderness over the sinuses', hint: 'Sinusitis' },
        { text: 'Neck: tender, reduced movement', hint: 'Cervical spondylosis' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Subarachnoid haemorrhage',
          urgent: true,
          for: ['Instant, severe, at its worst at onset; neck stiffness; vomiting; collapse', 'May occur with exertion or sex'],
          refs: [{ chapter: 31, pages: '489, 491–492', label: 'Questions box 31.3' }],
        },
        {
          name: 'Meningitis or encephalitis',
          urgent: true,
          for: ['Fever, photophobia, neck stiffness, more gradual onset; confusion, fits'],
          refs: [
            { chapter: 31, pages: '491–492' },
            { chapter: 32, pages: '501' },
          ],
        },
        {
          name: 'Raised intracranial pressure (tumour, abscess, bleed, idiopathic intracranial hypertension)',
          urgent: true,
          for: ['Morning headache, vomiting, drowsiness; worse on coughing', 'Papilloedema, sixth nerve palsy, focal signs'],
          refs: [
            { chapter: 31, pages: '491–492' },
            { chapter: 35, pages: '582' },
          ],
        },
        {
          name: 'Temporal (giant cell) arteritis',
          urgent: true,
          for: ['Over 50; temporal pain and tenderness; jaw claudication; diplopia or visual loss'],
          refs: [{ chapter: 31, pages: '491–492', label: 'Good signs guide 31.1' }],
        },
        {
          name: 'Acute angle-closure glaucoma',
          urgent: true,
          extra: true,
          for: ['Painful red eye, blurred vision, vomiting'],
          refs: [],
        },
        {
          name: 'Stroke or intracerebral haemorrhage; malignant hypertension',
          urgent: true,
          for: ['Focal signs; very high BP with retinal haemorrhages or papilloedema'],
          refs: [
            { chapter: 35, pages: '580–582' },
            { chapter: 7, pages: '125' },
          ],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Migraine',
          for: ['POUND: Pulsatile, 4–72 hOurs, Unilateral, Nausea, Disabling (4–5 of these: very likely)', 'Aura; photophobia; previous similar attacks'],
          refs: [{ chapter: 31, pages: '490–492' }],
        },
        {
          name: 'Tension-type headache',
          for: ['Bilateral tightness for hours, recurring; no nausea or other symptoms; doesn’t wake them'],
          refs: [{ chapter: 31, pages: '492' }],
        },
        {
          name: 'Cluster headache',
          for: ['Around one eye, with tearing and a running nose; bouts at the same time each day; restless'],
          refs: [{ chapter: 31, pages: '491' }],
        },
        {
          name: 'Sinusitis',
          for: ['Pain or fullness over the cheeks or forehead, behind the eyes'],
          refs: [{ chapter: 31, pages: '491–492' }],
        },
        {
          name: 'Cervical spondylosis',
          for: ['Occipital headache with neck stiffness (but resistance to rotation too)'],
          refs: [
            { chapter: 31, pages: '491' },
            { chapter: 32, pages: '501' },
          ],
        },
        {
          name: 'Drugs, alcohol, analgesic overuse',
          for: ['Nitrates, sildenafil; hangover; daily painkillers'],
          refs: [{ chapter: 31, pages: '491, 498', label: 'List 31.4' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 32, pages: '508–509' }],
      points: [
        { text: 'Fundoscopy recorded' },
        { text: 'BP; blood sugar' },
        { text: 'ESR or CRP if temporal arteritis is possible', extra: true },
        { text: 'CT head (and lumbar puncture if CT is normal) for thunderclap headache or suspected meningitis', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 31, pages: '491–492' }],
      points: [
        { text: 'Any danger feature: image and investigate, don’t send home', urgent: true },
        { text: 'Suspected meningitis: antibiotics without delay', urgent: true, extra: true },
        { text: 'Suspected temporal arteritis: steroids now to protect vision', urgent: true, extra: true },
        { text: 'Then follow the hospital’s headache flowchart and checklist below' },
      ],
    },
  ],
};

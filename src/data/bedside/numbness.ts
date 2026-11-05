import type { BedsideTopic } from '../bedsideTypes.ts';
import { NEURO_EXAM } from './shared.ts';

export const numbness: BedsideTopic = {
  id: 'numbness-tingling',
  title: 'Numbness and tingling',
  flowcharts: ['8.1'],
  reviewed: false,
  history: [
    {
      heading: 'Where, and how did it start?',
      refs: [
        { chapter: 31, pages: '496' },
        { chapter: 35, pages: '587', label: 'Table 35.2' },
      ],
      points: [
        { text: 'Sudden, one side of the face and body?', urgent: true, hint: 'Stroke or TIA' },
        { text: 'Both feet, then creeping up; hands later', hint: 'Peripheral neuropathy (glove and stocking)' },
        { text: 'Rising up both legs over days with weakness', urgent: true, hint: 'Guillain–Barré syndrome' },
        { text: 'Up to a level on the trunk; legs weak or stiff; bladder or bowel change', urgent: true, hint: 'Spinal cord' },
        { text: 'Saddle area (buttocks, perineum)', urgent: true, hint: 'Cauda equina' },
        { text: 'A strip down one arm or leg with neck or back pain', hint: 'Nerve root' },
        { text: 'Thumb, index and middle fingers; worse at night; eased by shaking the hand', hint: 'Carpal tunnel syndrome' },
        { text: 'Round the mouth and both hands, while anxious or breathing fast', hint: 'Hyperventilation' },
        { text: 'Electric shock down the spine on bending the neck', hint: 'Lhermitte’s sign (MS, cervical cord)' },
      ],
    },
    {
      heading: 'With it',
      refs: [
        { chapter: 31, pages: '489–490', label: 'Questions box 31.1' },
        { chapter: 35, pages: '584–585', label: 'List 35.5' },
      ],
      points: [
        { text: 'Weakness, speech or vision change, facial droop', urgent: true },
        { text: 'Recent diarrhoea or infection', hint: 'Guillain–Barré' },
        { text: 'Previous episodes of numbness or visual loss in a young adult', hint: 'Multiple sclerosis' },
        { text: 'Pain, burning feet', hint: 'Painful neuropathy (diabetes, alcohol, B₁ or B₁₂ deficiency)' },
        { text: 'Twitching, cramps, spasms of the hands', hint: 'Low calcium', extra: true },
      ],
    },
    {
      heading: 'Causes to ask about',
      refs: [
        { chapter: 35, pages: '584', label: 'List 35.4' },
        { chapter: 31, pages: '498', label: 'List 31.4' },
      ],
      points: [
        { text: 'Diabetes, kidney disease' },
        { text: 'Alcohol; diet (vegetarian, poor intake)', hint: 'B₁, B₁₂ deficiency' },
        { text: 'Drugs: isoniazid, metronidazole, amiodarone, phenytoin, chemotherapy' },
        { text: 'Cancer, HIV, vasculitis' },
        { text: 'Heavy metals, occupation' },
        { text: 'Stroke risk factors' },
      ],
    },
  ],
  exam: [
    ...NEURO_EXAM,
    {
      heading: 'Map the sensory loss (book Table 35.2)',
      refs: [
        { chapter: 35, pages: '583–587', label: 'Table 35.2, Fig. 35.2' },
        { chapter: 36, pages: '610' },
      ],
      points: [
        { text: 'One whole side (face, arm, leg)', hint: 'Brain (opposite side)' },
        { text: 'Face one side, body the other', hint: 'Brainstem' },
        { text: 'A level on the trunk', urgent: true, hint: 'Spinal cord' },
        { text: 'Saddle area; anal reflex', urgent: true, hint: 'Cauda equina or conus' },
        { text: 'Glove and stocking', hint: 'Peripheral neuropathy' },
        { text: 'One dermatome', hint: 'Nerve root' },
        { text: 'One nerve (median, ulnar, peroneal)', hint: 'Entrapment or mononeuritis' },
        { text: 'Vibration and position sense only', hint: 'Posterior columns (B₁₂, MS, tabes)' },
        { text: 'Thickened nerves (ulnar at the elbow, peroneal at the fibula)', hint: 'Leprosy, hereditary neuropathy' },
        { text: 'Tinel’s or Phalen’s test at the wrist', hint: 'Carpal tunnel', extra: true },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Stroke or TIA',
          urgent: true,
          for: ['Sudden, one-sided; with weakness, speech or vision change; vascular risk factors'],
          refs: [
            { chapter: 31, pages: '489–490' },
            { chapter: 35, pages: '580–582', label: 'Table 35.1' },
          ],
        },
        {
          name: 'Spinal cord compression or cauda equina',
          urgent: true,
          for: ['Sensory level or saddle loss; leg weakness; sphincter change; back pain'],
          refs: [{ chapter: 35, pages: '585–590', label: 'Table 35.2' }],
        },
        {
          name: 'Guillain–Barré syndrome',
          urgent: true,
          for: ['Ascending tingling and weakness, absent reflexes, after an infection'],
          refs: [{ chapter: 35, pages: '583–584' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Peripheral neuropathy (diabetes, alcohol, B₁₂, drugs, kidney disease)',
          for: ['Symmetrical glove-and-stocking loss; reduced ankle reflexes'],
          refs: [{ chapter: 35, pages: '583–584', label: 'List 35.4' }],
        },
        {
          name: 'Carpal tunnel syndrome',
          for: ['Median nerve fingers; worse at night; flick sign'],
          refs: [{ chapter: 31, pages: '496' }],
        },
        {
          name: 'Nerve root lesion (disc, spondylosis)',
          for: ['Dermatomal; neck or back pain; reduced reflex at that level'],
          refs: [{ chapter: 35, pages: '587', label: 'Table 35.2' }],
        },
        {
          name: 'Hyperventilation',
          for: ['Tingling round the mouth and in the fingers with anxiety; normal examination'],
          refs: [{ chapter: 9, pages: '169' }],
        },
        {
          name: 'Multiple sclerosis',
          for: ['Young adult; episodes separated in time and place; optic neuritis, Lhermitte’s'],
          refs: [{ chapter: 35, pages: '584–585', label: 'List 35.5' }],
        },
        {
          name: 'Mononeuritis multiplex (diabetes, vasculitis, leprosy)',
          for: ['More than one separate nerve affected'],
          refs: [{ chapter: 35, pages: '585', label: 'List 35.6' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 35, pages: '584' }],
      points: [
        { text: 'Blood sugar', urgent: true },
        { text: 'Calcium, B₁₂, kidney function, HbA1c', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 31, pages: '489–490' }],
      points: [
        { text: 'Sudden one-sided symptoms: treat as stroke (time matters)', urgent: true },
        { text: 'Sensory level, saddle loss or sphincter change: urgent spinal imaging', urgent: true, extra: true },
        { text: 'Then follow the hospital’s numbness and tingling flowchart below' },
      ],
    },
  ],
};

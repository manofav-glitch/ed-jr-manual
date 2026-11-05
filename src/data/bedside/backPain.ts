import type { BedsideTopic } from '../bedsideTypes.ts';
import { NEURO_EXAM } from './shared.ts';

export const backPain: BedsideTopic = {
  id: 'back-pain',
  title: 'Back pain',
  flowcharts: ['9.1'],
  reviewed: false,
  history: [
    {
      heading: 'Danger questions (book List 24.6)',
      refs: [
        { chapter: 24, pages: '392–393', label: 'List 24.6' },
        { chapter: 23, pages: '363–366', label: 'Questions box 23.1' },
      ],
      points: [
        { text: 'Bladder: retention or incontinence; bowel incontinence; numb saddle area; leg weakness', urgent: true, hint: 'Cauda equina syndrome' },
        { text: 'Worse at rest, wakes them at night, more than 4 weeks, weight loss, known cancer', urgent: true, hint: 'Malignancy' },
        { text: 'Fever, worse at rest, immunosuppressed (or injecting drugs)', urgent: true, hint: 'Spinal abscess or infection' },
        { text: 'Sudden severe pain after little or no injury; osteoporosis, steroids', urgent: true, hint: 'Vertebral fracture' },
        { text: 'Sudden tearing pain, faint, shocked', urgent: true, hint: 'Aortic aneurysm or dissection' },
        { text: 'Older patient with back pain and kidney failure or anaemia', urgent: true, hint: 'Myeloma' },
      ],
    },
    {
      heading: 'The pain',
      refs: [
        { chapter: 23, pages: '365–366' },
        { chapter: 24, pages: '392' },
      ],
      points: [
        { text: 'Where: localised or diffuse; one level?' },
        { text: 'Sudden (lifting, straining) or gradual?' },
        { text: 'Down the leg below the knee, worse coughing or straining?', hint: 'Sciatica (L4–S1 root)' },
        { text: 'Calf or thigh pain on walking, eased by bending forward or sitting', hint: 'Spinal stenosis' },
        { text: 'Morning stiffness, better with exercise, young, buttock pain', hint: 'Ankylosing spondylitis' },
        { text: 'Worse with movement, well localised, after a minor strain', hint: 'Mechanical' },
        { text: 'Abdominal pain, burning urine, vomiting', hint: 'Referred: pyelonephritis, pancreatitis, diverticular abscess' },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 23, pages: '366–369' },
      ],
      points: [
        { text: 'Osteoporosis risks: menopause, steroids, alcohol, smoking, thyroid, kidney or liver disease' },
        { text: 'Psoriasis, inflammatory bowel disease, red eyes (iritis)', hint: 'Spondyloarthritis' },
        { text: 'Known cancer', urgent: true },
        { text: 'TB exposure', hint: 'Spinal TB' },
        { text: 'Occupation; how it affects work and daily life' },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 24, pages: '393', label: 'List 24.6' },
        { chapter: 14, pages: '255' },
      ],
      points: [
        { text: 'Pulse, BP, temperature' },
        { text: 'Abdomen: expansile aortic mass; tenderness', urgent: true },
        { text: 'Palpable bladder', urgent: true, hint: 'Painless retention: cauda equina' },
      ],
    },
    {
      heading: 'The spine',
      refs: [{ chapter: 24, pages: '392–394' }],
      points: [
        { text: 'Look standing: loss of the normal curves, scoliosis, deformity' },
        { text: 'Feel each spinous process for tenderness; muscle spasm', hint: 'Bony tenderness: fracture, infection, tumour' },
        { text: 'Movement: flexion, extension, side bending, rotation' },
        { text: 'Schober’s test (less than 5 cm increase: limited lumbar flexion)' },
        { text: 'Straight leg raise: pain down the leg before 80–90°', hint: 'Root compression (L5, S1)' },
        { text: 'Femoral stretch test (prone, knee bent)', hint: 'Upper lumbar roots', extra: true },
      ],
    },
    ...NEURO_EXAM.slice(3, 5),
    {
      heading: 'Elsewhere',
      refs: [{ chapter: 24, pages: '393', label: 'List 24.6' }],
      points: [
        { text: 'Peripheral pulses', hint: 'Vascular claudication vs spinal stenosis' },
        { text: 'Breasts, prostate, nodes if cancer is possible' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Cauda equina syndrome',
          urgent: true,
          for: ['Severe pain; retention or incontinence; saddle anaesthesia; leg weakness'],
          refs: [{ chapter: 24, pages: '392–393', label: 'List 24.6' }],
        },
        {
          name: 'Spinal metastases or myeloma',
          urgent: true,
          for: ['Worse at rest and at night; more than 4 weeks; weight loss; known cancer'],
          refs: [
            { chapter: 24, pages: '393', label: 'List 24.6' },
            { chapter: 18, pages: '312' },
          ],
        },
        {
          name: 'Spinal infection (abscess, discitis, TB)',
          urgent: true,
          for: ['Fever; worse at rest; immunosuppression; injecting drugs'],
          refs: [
            { chapter: 24, pages: '393', label: 'List 24.6' },
            { chapter: 45, pages: '835' },
          ],
        },
        {
          name: 'Ruptured aortic aneurysm or dissection',
          urgent: true,
          for: ['Sudden tearing pain; hypotension; shock'],
          refs: [{ chapter: 24, pages: '393', label: 'List 24.6' }],
        },
        {
          name: 'Vertebral fracture',
          for: ['Sudden severe pain; osteoporosis, steroids, trauma; bony tenderness'],
          refs: [{ chapter: 24, pages: '393', label: 'List 24.6' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Non-specific mechanical back pain',
          for: ['Gradual onset; minor strain; no neurological symptoms or signs'],
          against: ['Serious causes are rare (<1%) in otherwise well patients'],
          refs: [{ chapter: 24, pages: '393', label: 'List 24.6' }],
        },
        {
          name: 'Sciatica (root compression)',
          for: ['Pain beyond the knee; positive straight leg raise; root signs'],
          refs: [{ chapter: 24, pages: '392–393', label: 'List 24.6' }],
        },
        {
          name: 'Spinal canal stenosis',
          for: ['Pain on walking, eased by bending; pulses present'],
          refs: [
            { chapter: 24, pages: '393', label: 'List 24.6' },
            { chapter: 23, pages: '367' },
          ],
        },
        {
          name: 'Ankylosing spondylitis',
          for: ['Young; morning stiffness; better with activity; sacroiliac pain; reduced Schober’s'],
          refs: [
            { chapter: 23, pages: '366' },
            { chapter: 25, pages: '410–411' },
          ],
        },
        {
          name: 'Referred pain (kidney, pancreas, bowel)',
          for: ['Abdominal pain, urinary symptoms, vomiting'],
          refs: [{ chapter: 24, pages: '393', label: 'List 24.6' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 26, pages: '429–431' }],
      points: [
        { text: 'Urine dipstick' },
        { text: 'Bladder scan after voiding if cauda equina is possible', extra: true },
        { text: 'ESR or CRP, blood count, calcium if infection, cancer or myeloma is possible', extra: true },
        { text: 'Imaging only with danger features (urgent MRI for cauda equina or cord compression)', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 24, pages: '393', label: 'List 24.6' }],
      points: [
        { text: 'Cauda equina or cord compression features: urgent spinal imaging and surgical referral', urgent: true, extra: true },
        { text: 'No danger features: mechanical pain; analgesia and keep moving', extra: true },
        { text: 'Then follow the hospital’s back pain flowchart below' },
      ],
    },
  ],
};

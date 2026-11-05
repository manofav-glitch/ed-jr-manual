import type { BedsideTopic } from '../bedsideTypes.ts';
import { JOINT_EXAM } from './shared.ts';

export const elbowPain: BedsideTopic = {
  id: 'elbow-pain',
  title: 'Elbow pain',
  flowcharts: ['9.3'],
  reviewed: false,
  history: [
    {
      heading: 'The pain',
      refs: [
        { chapter: 24, pages: '383–384' },
        { chapter: 25, pages: '422–423' },
      ],
      points: [
        { text: 'Injury: fall on an outstretched hand or the elbow?', urgent: true, hint: 'Fracture or dislocation', extra: true },
        { text: 'Over the outer bony point, worse gripping or lifting', hint: 'Lateral epicondylitis (tennis elbow)' },
        { text: 'Over the inner bony point', hint: 'Medial epicondylitis (golfer’s elbow)' },
        { text: 'Swelling over the back of the elbow', hint: 'Olecranon bursitis' },
        { text: 'Hot, swollen whole joint, can’t bend or straighten; fever', urgent: true, hint: 'Septic arthritis, gout' },
        { text: 'Trouble combing hair, carrying or turning the hand', hint: 'Stiffness; loss of rotation' },
        { text: 'Elbow feels unstable', hint: 'Rheumatoid arthritis, previous injury' },
        { text: 'Numbness of the little and ring fingers', hint: 'Ulnar nerve at the elbow' },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 23, pages: '364–369', label: 'List 23.2' },
        { chapter: 25, pages: '412–413' },
      ],
      points: [
        { text: 'Repetitive work or sport (painters, manual work, racquet sports)' },
        { text: 'Gout, kidney disease, heavy drinking' },
        { text: 'Rheumatoid arthritis; immunosuppression; diabetes' },
        { text: 'Leaning on the elbow; a graze over it', hint: 'Septic bursitis', extra: true },
        { text: 'Bleeding disorder, anticoagulants' },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 24, pages: '373' },
        { chapter: 6, pages: '109' },
      ],
      points: [
        { text: 'Temperature' },
        { text: 'Radial pulse, hand colour and sensation', urgent: true, hint: 'Vascular or nerve injury', extra: true },
        { text: 'Do not move the joint passively if a fracture is possible' },
      ],
    },
    {
      heading: 'The elbow (book p 384)',
      refs: [{ chapter: 24, pages: '384' }],
      points: [
        { text: 'Look with palms forward: carrying angle, deformity' },
        { text: 'Swelling on both sides of the olecranon', hint: 'Joint effusion' },
        { text: 'Discrete swelling over the olecranon or the ulnar border', hint: 'Bursa, rheumatoid nodule, gouty tophus' },
        { text: 'Feel: lateral and medial epicondyles for tenderness' },
        { text: 'Bursa: soft fluctuant swelling; tender, red and hot if inflamed or infected' },
        { text: 'Effusion: thumb beside the ulna below the olecranon, then extend the elbow' },
        { text: 'Move: flexion to 150°, full extension (loss of extension is an early sign of synovitis), rotation' },
        { text: 'Resisted wrist extension and supination', hint: 'Pain at the lateral epicondyle: tennis elbow' },
        { text: 'Resisted wrist flexion', hint: 'Pain at the medial epicondyle: golfer’s elbow' },
        { text: 'Ulnar nerve: little finger sensation, finger spreading' },
      ],
    },
    ...JOINT_EXAM.slice(3),
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Septic arthritis of the elbow',
          urgent: true,
          for: ['Hot, swollen, very painful joint; all movement painful; fever'],
          refs: [{ chapter: 23, pages: '364–365', label: 'List 23.2' }],
        },
        {
          name: 'Fracture or dislocation',
          urgent: true,
          extra: true,
          for: ['Injury; deformity; unable to move; check the pulse and nerves'],
          refs: [],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Olecranon bursitis (simple, gouty, rheumatoid or septic)',
          for: ['Soft fluctuant swelling over the back of the elbow', 'Tender if inflamed; with RA or gout, or on its own'],
          refs: [
            { chapter: 24, pages: '383–384' },
            { chapter: 25, pages: '424' },
          ],
        },
        {
          name: 'Lateral epicondylitis (tennis elbow)',
          for: ['Tender lateral epicondyle; pain on resisted wrist extension'],
          refs: [{ chapter: 25, pages: '422–423', label: 'Fig. 25.18' }],
        },
        {
          name: 'Medial epicondylitis (golfer’s elbow)',
          for: ['Tender medial epicondyle; pain on resisted wrist flexion'],
          refs: [{ chapter: 25, pages: '422–423', label: 'Fig. 25.19' }],
        },
        {
          name: 'Gout or pseudogout',
          for: ['Tophi; previous attacks; sudden hot joint'],
          refs: [{ chapter: 25, pages: '412–413' }],
        },
        {
          name: 'Inflammatory arthritis (RA) or osteoarthritis',
          for: ['Other joints; loss of extension; nodules; crepitus'],
          refs: [
            { chapter: 23, pages: '366', label: 'List 23.4' },
          ],
        },
        {
          name: 'Ulnar nerve entrapment',
          for: ['Numb little and ring fingers; weak hand'],
          refs: [{ chapter: 24, pages: '383–384' }],
        },
        {
          name: 'Referred pain (neck, shoulder)',
          for: ['Elbow exam normal; neck movements reproduce the pain'],
          refs: [{ chapter: 24, pages: '390' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [{ chapter: 23, pages: '365', label: 'T&O’C essential' }],
      points: [
        { text: 'Aspirate a suspected septic joint (and a hot bursa): Gram stain, culture, crystals', urgent: true },
        { text: 'X-ray if injured or the joint is swollen', extra: true },
        { text: 'Urate, blood count, CRP if inflamed', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 23, pages: '365', label: 'T&O’C essential' }],
      points: [
        { text: 'Septic joint: emergency (aspirate, antibiotics, orthopaedics)', urgent: true },
        { text: 'Pulse or nerve deficit after injury: urgent orthopaedic review', urgent: true, extra: true },
        { text: 'Then follow the hospital’s elbow pain flowchart below' },
      ],
    },
  ],
};

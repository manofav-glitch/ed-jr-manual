import type { BedsideTopic } from '../bedsideTypes.ts';
import { KIDNEY_EXAM } from './shared.ts';

export const dysuria: BedsideTopic = {
  id: 'burning-micturition',
  title: 'Burning micturition',
  flowcharts: ['16.6'],
  reviewed: false,
  history: [
    {
      heading: 'Is it a urinary infection?',
      refs: [
        { chapter: 17, pages: '298–300', label: 'Good symptoms and signs guide 17.1' },
      ],
      points: [
        { text: 'Burning or stinging on passing urine' },
        { text: 'Frequency of small amounts, urgency' },
        { text: 'Blood in the urine; suprapubic pain' },
        { text: 'Does she think it is a urine infection?', hint: 'Women who think so are usually right' },
        { text: 'Vaginal discharge or itch?', hint: 'Points away from UTI: think vaginitis or STI' },
      ],
    },
    {
      heading: 'Upper tract or complicated?',
      refs: [
        { chapter: 17, pages: '299–300' },
      ],
      points: [
        { text: 'Fever, rigors', urgent: true, hint: 'Pyelonephritis, prostatitis' },
        { text: 'Loin or back pain', urgent: true, hint: 'Pyelonephritis' },
        { text: 'Vomiting, unable to keep tablets down', extra: true },
        { text: 'Older patient who is confused', urgent: true, hint: 'UTI often presents this way in the elderly' },
        { text: 'A man, or repeated infections in a woman', hint: 'Suggests an anatomical problem: needs urology review' },
        { text: 'Poor stream, retention', hint: 'Obstruction' },
      ],
    },
    {
      heading: 'Risk factors and background',
      refs: [
        { chapter: 17, pages: '299, 303–304', label: 'List 17.4' },
      ],
      points: [
        { text: 'Pregnant?', urgent: true },
        { text: 'Diabetes' },
        { text: 'Catheter in place' },
        { text: 'Previous UTIs, stones, kidney problems' },
        { text: 'Recent intercourse; new partner; urethral discharge', hint: 'Urethritis (STI)' },
        { text: 'Antibiotics recently, and allergies' },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 47, pages: '871' },
        { chapter: 18, pages: '306' },
      ],
      points: [
        { text: 'Temperature, pulse, BP, respiratory rate, mental state', hint: 'Sepsis' },
        { text: 'Hydration' },
      ],
    },
    ...KIDNEY_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 17, pages: '299' },
        { chapter: 18, pages: '312–314' },
      ],
      points: [
        { text: 'Loin tenderness (renal angle)', hint: 'Upper tract infection' },
        { text: 'Suprapubic tenderness; palpable bladder' },
        { text: 'Men: urethral discharge, tender prostate, tender epididymis' },
        { text: 'Women: vaginal discharge (pelvic examination if indicated)' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Can’t miss',
      items: [
        {
          name: 'Pyelonephritis or urosepsis',
          urgent: true,
          for: ['Fever, rigors, loin pain, vomiting; septic'],
          refs: [{ chapter: 17, pages: '299–300' }],
        },
        {
          name: 'Infection behind an obstruction (stone, prostate)',
          urgent: true,
          for: ['Colic or retention with fever'],
          refs: [{ chapter: 17, pages: '300' }],
        },
        {
          name: 'UTI in pregnancy',
          urgent: true,
          for: ['Pregnant; any urinary symptoms'],
          refs: [{ chapter: 17, pages: '299', label: 'List 17.4' }],
        },
      ],
    },
    {
      heading: 'Common',
      items: [
        {
          name: 'Cystitis (lower UTI)',
          for: ['Burning, frequency, suprapubic pain, blood; no fever'],
          refs: [{ chapter: 17, pages: '298–299', label: 'List 17.3' }],
        },
        {
          name: 'Urethritis (sexually transmitted infection)',
          for: ['Discharge; new partner; genital ulcers'],
          refs: [
            { chapter: 17, pages: '297, 303', label: 'List 17.1' },
            { chapter: 18, pages: '313–314', label: 'List 18.4' },
          ],
        },
        {
          name: 'Vaginitis',
          for: ['Vaginal discharge or itch'],
          refs: [{ chapter: 17, pages: '300' }],
        },
        {
          name: 'Prostatitis',
          for: ['Fever, perineal pain; tender prostate'],
          refs: [{ chapter: 17, pages: '299', label: 'List 17.3' }],
        },
        {
          name: 'Stone',
          for: ['Colicky loin pain, blood'],
          refs: [{ chapter: 17, pages: '299–300', label: 'List 17.3' }],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 19, pages: '319–322' },
      ],
      points: [
        { text: 'Urine dipstick: nitrite and leucocytes (a positive leucocyte test favours infection)' },
        { text: 'Midstream urine for microscopy and culture' },
        { text: 'Pregnancy test in women of child-bearing age', extra: true },
        { text: 'Swab any urethral or vaginal discharge' },
        { text: 'Blood sugar; kidney function and blood cultures if febrile', extra: true },
      ],
    },
    {
      heading: 'Decide',
      refs: [{ chapter: 17, pages: '299–300' }],
      points: [
        { text: 'Septic or upper tract infection: treat as pyelonephritis', urgent: true },
        { text: 'UTI in a man, or recurrent UTIs: needs urological evaluation' },
        { text: 'Then follow the hospital’s burning micturition flowchart below' },
      ],
    },
  ],
};

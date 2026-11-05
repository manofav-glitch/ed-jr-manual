import type { BedsideTopic } from '../bedsideTypes.ts';
import { FIRST_LOOK, KIDNEY_EXAM } from './shared.ts';

export const haematuria: BedsideTopic = {
  id: 'haematuria',
  title: 'Blood in the urine (haematuria)',
  flowcharts: ['1.2'],
  reviewed: false,
  history: [
    FIRST_LOOK,
    {
      heading: 'Is it really blood?',
      refs: [
        { chapter: 17, pages: '298–299', label: 'List 17.3' },
        { chapter: 19, pages: '319', label: 'Table 19.1' },
      ],
      points: [
        { text: 'Menstruating?', hint: 'Blood not from the urine' },
        { text: 'Beetroot, rifampicin, other drugs that colour the urine' },
        { text: 'Dark or brown urine after muscle injury, fits or heavy exercise', urgent: true, hint: 'Myoglobinuria (rhabdomyolysis)' },
        { text: 'Dark urine with pallor or jaundice', hint: 'Haemoglobinuria (haemolysis)' },
      ],
    },
    {
      heading: 'The bleeding',
      refs: [
        { chapter: 17, pages: '298–299', label: 'List 17.3' },
      ],
      points: [
        { text: 'At the start of the stream then clearing, or only at the end?', hint: 'Urethra or prostate' },
        { text: 'Clots?', hint: 'Not glomerular (lower tract)' },
        { text: 'Unable to pass urine because of clots?', urgent: true, hint: 'Clot retention' },
        { text: 'Painless?', urgent: true, hint: 'Must exclude urinary tract cancer' },
        { text: 'Several episodes over months?', hint: 'IgA nephropathy' },
        { text: 'Foamy, tea-coloured urine; swelling; breathlessness', hint: 'Nephritis or nephrosis' },
      ],
    },
    {
      heading: 'With it',
      refs: [
        { chapter: 17, pages: '298–300', label: 'Lists 17.3, 17.4' },
      ],
      points: [
        { text: 'Burning, frequency, suprapubic pain', hint: 'Cystitis' },
        { text: 'Fever, flank or back pain', hint: 'Pyelonephritis, prostatitis' },
        { text: 'Severe colicky loin pain to the groin', hint: 'Stone' },
        { text: 'Weak stream, hesitancy, dribbling', hint: 'Prostate' },
        { text: 'Weight loss', urgent: true },
        { text: 'Rash, joint pain, sinus trouble, coughing blood', hint: 'Vasculitis, lupus' },
      ],
    },
    {
      heading: 'Background',
      refs: [
        { chapter: 17, pages: '298–299, 304', label: 'Questions box 17.1' },
      ],
      points: [
        { text: 'Anticoagulants', hint: 'Bleeding disorder (still look for a cause)' },
        { text: 'Recent catheter or procedure; back or abdominal injury', hint: 'Trauma' },
        { text: 'Previous stones, UTIs, kidney disease, biopsy' },
        { text: 'Analgesic powders taken over years', hint: 'Analgesic nephropathy; urothelial cancer' },
        { text: 'Smoking', hint: 'Bladder cancer', extra: true },
        { text: 'Hypertension, diabetes' },
        { text: 'Family history of kidney disease, polycystic kidneys, deafness', hint: 'Polycystic kidneys, Alport’s' },
        { text: 'Heart valve disease or a prosthetic valve', hint: 'Endocarditis (renal infarction); valve haemolysis' },
      ],
    },
  ],
  exam: [
    {
      heading: 'First',
      refs: [
        { chapter: 18, pages: '310–313' },
      ],
      points: [
        { text: 'Pulse, BP lying and standing, temperature' },
        { text: 'Palpable, tender bladder', urgent: true, hint: 'Clot retention' },
        { text: 'Pallor' },
      ],
    },
    ...KIDNEY_EXAM,
    {
      heading: 'Look specifically for',
      refs: [
        { chapter: 18, pages: '310–312', label: 'Lists 18.2, 18.3' },
        { chapter: 7, pages: '123' },
      ],
      points: [
        { text: 'Kidney mass (one side: tumour, hydronephrosis; both: polycystic)' },
        { text: 'Big kidneys with hypertension', hint: 'Polycystic kidneys' },
        { text: 'Prostate on rectal examination: enlarged, hard, tender' },
        { text: 'Murmur, splinter haemorrhages', hint: 'Endocarditis' },
        { text: 'Oedema, rash, purpura', hint: 'Nephritic or nephrotic syndrome, vasculitis' },
      ],
    },
  ],
  differentials: [
    {
      heading: 'Kidney',
      items: [
        {
          name: 'Glomerulonephritis (including IgA nephropathy)',
          for: ['Painless; brown or tea-coloured urine; protein too', 'Hypertension, oedema; repeated episodes'],
          refs: [
            { chapter: 17, pages: '298–299', label: 'Table 17.1, List 17.3' },
            { chapter: 19, pages: '322', label: 'List 19.4' },
          ],
        },
        {
          name: 'Renal cell carcinoma',
          urgent: true,
          for: ['Painless; weight loss; kidney mass; left varicocele'],
          refs: [
            { chapter: 18, pages: '311, 314', label: 'List 18.2' },
            { chapter: 19, pages: '322', label: 'List 19.4' },
          ],
        },
        {
          name: 'Pyelonephritis',
          for: ['Fever, rigors, flank pain, dysuria; loin tenderness'],
          refs: [
            { chapter: 17, pages: '299', label: 'List 17.3' },
            { chapter: 19, pages: '322', label: 'List 19.4' },
          ],
        },
        {
          name: 'Polycystic kidney disease',
          for: ['Family history, hypertension, flank pain, big kidneys'],
          refs: [
            { chapter: 17, pages: '298', label: 'List 17.2' },
            { chapter: 18, pages: '311', label: 'List 18.3' },
          ],
        },
        {
          name: 'Renal infarction (endocarditis, vasculitis); malignant hypertension',
          for: ['Murmur or vasculitic rash; very high BP with grade 3–4 retina'],
          refs: [{ chapter: 19, pages: '322', label: 'List 19.4' }],
        },
      ],
    },
    {
      heading: 'Urinary tract',
      items: [
        {
          name: 'Cystitis or urethritis',
          for: ['Burning, frequency, suprapubic pain'],
          refs: [
            { chapter: 17, pages: '299', label: 'List 17.3' },
          ],
        },
        {
          name: 'Stone',
          for: ['Severe colicky loin pain radiating to the groin or testis'],
          refs: [
            { chapter: 17, pages: '299–300', label: 'List 17.3' },
          ],
        },
        {
          name: 'Bladder or ureteric cancer',
          urgent: true,
          for: ['Painless haematuria, often with clots'],
          refs: [{ chapter: 19, pages: '322', label: 'List 19.4' }],
        },
        {
          name: 'Prostate (benign enlargement or cancer)',
          for: ['Older man; poor stream; blood at the start or end'],
          refs: [
            { chapter: 17, pages: '298–300' },
            { chapter: 19, pages: '322', label: 'List 19.4' },
          ],
        },
        {
          name: 'Trauma or a recent catheter',
          for: ['Injury; procedure'],
          refs: [{ chapter: 17, pages: '299', label: 'List 17.3' }],
        },
      ],
    },
    {
      heading: 'Red urine that is not blood',
      items: [
        {
          name: 'Myoglobinuria (rhabdomyolysis)',
          urgent: true,
          for: ['Crush injury, fits, heat, extreme exercise, snake bite, alcohol, statins', 'Dipstick positive for blood but few red cells'],
          refs: [
            { chapter: 19, pages: '322', label: 'List 19.4' },
          ],
        },
        {
          name: 'Haemoglobinuria (intravascular haemolysis)',
          for: ['Pallor, jaundice; prosthetic valve'],
          refs: [{ chapter: 19, pages: '322', label: 'List 19.4' }],
        },
        {
          name: 'Food, drugs, menstrual blood',
          for: ['Beetroot, rifampicin; menstruation'],
          refs: [
            { chapter: 17, pages: '298' },
            { chapter: 19, pages: '319', label: 'Table 19.1' },
          ],
        },
      ],
    },
  ],
  plan: [
    {
      heading: 'Extend the examination',
      refs: [
        { chapter: 19, pages: '319–323' },
      ],
      points: [
        { text: 'Look at the urine: colour, clots, cloudiness' },
        { text: 'Dipstick: blood, protein (protein with blood suggests a kidney cause), nitrite, leucocytes' },
        { text: 'Microscopy: red cells (misshapen ones and red cell casts point to the glomerulus), white cells' },
        { text: 'Urine culture' },
        { text: 'Kidney function, electrolytes, blood count' },
        { text: 'Ultrasound of the kidneys and bladder' },
      ],
    },
    {
      heading: 'Decide',
      refs: [
        { chapter: 17, pages: '298' },
        { chapter: 19, pages: '319–322' },
      ],
      points: [
        { text: 'Clot retention or heavy bleeding: catheter and urgent urology', urgent: true, extra: true },
        { text: 'Myoglobinuria: think rhabdomyolysis and protect the kidneys', urgent: true },
        { text: 'Blood in the urine is always abnormal: it needs a cause, even on anticoagulants' },
        { text: 'Then follow the hospital’s haematuria flowchart and checklist below' },
      ],
    },
  ],
};
